import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function check() {
  try {
    // Check rendering tables
    const { data: rendering, count: rCount } = await supabase
      .from('rendering_projects')
      .select('id, title, year', { count: 'exact' });
    
    console.log(`\n=== RENDERING_PROJECTS (${rCount}) ===`);
    rendering?.forEach(p => console.log(`  ${p.id}: ${p.title} (${p.year})`));

    const { count: rImgCount } = await supabase
      .from('rendering_project_images')
      .select('*', { count: 'exact', head: true });
    console.log(`  Images: ${rImgCount}`);

    const { count: rGalleryCount } = await supabase
      .from('rendering_gallery')
      .select('*', { count: 'exact', head: true });
    console.log(`  Gallery entries: ${rGalleryCount}`);

    // Check experiential tables
    const { data: experiential, count: eCount } = await supabase
      .from('experiential_projects')
      .select('id, title, year', { count: 'exact' });
    
    console.log(`\n=== EXPERIENTIAL_PROJECTS (${eCount}) ===`);
    experiential?.forEach(p => console.log(`  ${p.id}: ${p.title} (${p.year})`));

    const { count: eImgCount } = await supabase
      .from('experiential_project_images')
      .select('*', { count: 'exact', head: true });
    console.log(`  Images: ${eImgCount}`);

    const { count: eGalleryCount } = await supabase
      .from('experiential_gallery')
      .select('*', { count: 'exact', head: true });
    console.log(`  Gallery entries: ${eGalleryCount}`);

    // Check the failed project
    console.log('\n=== FAILED PROJECT ===');
    const { data: failed } = await supabase
      .from('projects')
      .select('id, title, year, status, slug')
      .eq('title', 'All My Sons')
      .eq('discipline', 'rendering')
      .single();
    
    if (failed) {
      console.log(`  "${failed.title}" - status: "${failed.status}"`);
      console.log(`  Need to fix status and retry`);
    }

  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
