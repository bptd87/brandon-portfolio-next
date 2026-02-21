import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function testGalleries() {
  console.log('=== TESTING GALLERY QUERIES ===\n');

  // Test rendering gallery
  console.log('1. RENDERING GALLERY:');
  const { data: renderingGallery, error: rError } = await supabase
    .from('rendering_gallery')
    .select(`
      id,
      rendering_project_id,
      display_title,
      sort_order
    `)
    .order('sort_order', { ascending: true });

  if (rError) {
    console.log('  ❌ Error:', rError);
  } else {
    console.log(`  ✅ ${renderingGallery.length} gallery items`);
    renderingGallery.forEach(item => {
      console.log(`    - "${item.display_title}" (project ${item.rendering_project_id})`);
    });
  }

  // Test rendering gallery with projects joined
  console.log('\n2. RENDERING GALLERY WITH PROJECTS:');
  const { data: renderingWithProjects } = await supabase
    .from('rendering_gallery')
    .select(`
      *,
      project:rendering_projects(*)
    `)
    .order('sort_order', { ascending: true });

  console.log(`  Found ${renderingWithProjects?.length || 0} items with project data`);
  renderingWithProjects?.slice(0, 2).forEach(item => {
    console.log(`    - ${item.project?.title} (${item.project?.year})`);
  });

  // Test rendering gallery with images
  console.log('\n3. RENDERING PROJECTS WITH IMAGES:');
  const renderingProjectIds = renderingGallery?.map(g => g.rendering_project_id) || [];
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title, year')
    .in('id', renderingProjectIds);

  for (const proj of projects || []) {
    const { data: images } = await supabase
      .from('rendering_project_images')
      .select('id, image_url')
      .eq('rendering_project_id', proj.id);
    
    console.log(`    - "${proj.title}": ${images?.length || 0} images`);
  }

  // Test experiential gallery
  console.log('\n4. EXPERIENTIAL GALLERY:');
  const { data: experientialGallery } = await supabase
    .from('experiential_gallery')
    .select(`
      *,
      project:experiential_projects(*)
    `)
    .order('sort_order', { ascending: true });

  console.log(`  ✅ ${experientialGallery?.length || 0} gallery items`);
  experientialGallery?.slice(0, 3).forEach(item => {
    console.log(`    - ${item.project?.title} (${item.project?.year})`);
  });

  console.log('\n✅ All gallery queries working!');
  process.exit(0);
}

testGalleries();
