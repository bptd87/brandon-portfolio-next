import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function addMissingGalleryEntry() {
  console.log('🔍 Checking for missing gallery entries...\n');

  // Get all rendering projects
  const { data: projects } = await supabase
    .from('rendering_projects')
    .select('id, title');

  // Get all gallery entries
  const { data: gallery } = await supabase
    .from('rendering_gallery')
    .select('rendering_project_id');

  const galleryIds = new Set(gallery?.map(g => g.rendering_project_id) || []);
  const missingProjects = projects?.filter(p => !galleryIds.has(p.id)) || [];

  if (missingProjects.length === 0) {
    console.log('✅ All projects are in the gallery!');
    process.exit(0);
  }

  console.log(`Found ${missingProjects.length} projects missing from gallery:\n`);

  for (const project of missingProjects) {
    console.log(`Adding: "${project.title}" (ID ${project.id})`);
    
    const { error } = await supabase
      .from('rendering_gallery')
      .insert({
        rendering_project_id: project.id,
        display_title: project.title,
        alt_text: project.title,
        sort_order: 100 // Add at end
      });

    if (error) {
      console.log(`  ❌ Error: ${error.message}`);
    } else {
      console.log(`  ✅ Added to gallery`);
    }
  }

  console.log('\n✅ Done!');
  process.exit(0);
}

addMissingGalleryEntry();
