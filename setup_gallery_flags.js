import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function setupGalleryFlags() {
  console.log('🔧 Setting gallery_only flags on rendering projects...\n');

  // Get all rendering projects
  const { data: projects, error } = await supabase
    .from('rendering_projects')
    .select('id, title, slug, design_notes, excerpt')
    .order('year', { ascending: false });

  if (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  console.log(`Found ${projects.length} rendering projects:\n`);

  // Determine which should be full pages vs gallery-only
  // Projects WITH design_notes or substantial excerpt = full pages
  // Projects WITHOUT = gallery-only
  
  for (const project of projects) {
    const hasContent = (project.design_notes && project.design_notes.length > 50) || 
                      (project.excerpt && project.excerpt.length > 50);
    
    const galleryOnly = !hasContent;
    
    console.log(`${project.id}. "${project.title}"`);
    console.log(`   Slug: ${project.slug || 'NULL'}`);
    console.log(`   Has content: ${hasContent ? 'Yes' : 'No'}`);
    console.log(`   Setting: ${galleryOnly ? 'GALLERY ONLY' : 'FULL PROJECT PAGE'}`);
    
    // Update the flag
    const { error: updateError } = await supabase
      .from('rendering_projects')
      .update({ gallery_only: galleryOnly })
      .eq('id', project.id);
    
    if (updateError) {
      console.log(`   ❌ Error: ${updateError.message}`);
    } else {
      console.log(`   ✅ Updated\n`);
    }
  }

  // Show final breakdown
  console.log('\n=== FINAL BREAKDOWN ===\n');
  
  const { data: fullPages } = await supabase
    .from('rendering_projects')
    .select('id, title')
    .eq('gallery_only', false);
  
  const { data: galleryItems } = await supabase
    .from('rendering_projects')
    .select('id, title')
    .eq('gallery_only', true);
  
  console.log(`Full Project Pages (${fullPages?.length || 0}):`);
  fullPages?.forEach(p => console.log(`  - ${p.title}`));
  
  console.log(`\nGallery Only (${galleryItems?.length || 0}):`);
  galleryItems?.forEach(p => console.log(`  - ${p.title}`));
  
  console.log('\n✅ Done!');
  process.exit(0);
}

setupGalleryFlags();
