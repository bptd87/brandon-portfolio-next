import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function testQueries() {
  console.log('=== TESTING FRONTEND QUERIES ===\n');

  // 1. Query for full project pages (what "Selected Works" section will show)
  console.log('1. FULL PROJECT PAGES (galleryOnly = false):');
  const { data: fullPages } = await supabase
    .from('rendering_projects')
    .select('id, title, slug, year, gallery_only')
    .eq('gallery_only', false)
    .order('year', { ascending: false });
  
  console.log(`   Found ${fullPages?.length || 0} projects:`);
  fullPages?.forEach(p => {
    console.log(`   - ${p.title} (${p.year}) → /projects/rendering/${p.slug}`);
  });

  // 2. Query for rendering gallery (all items for modal)
  console.log('\n2. RENDERING GALLERY (modal items - ALL projects in gallery):');
  const { data: gallery } = await supabase
    .from('rendering_gallery')
    .select(`
      id,
      rendering_project_id,
      display_title
    `)
    .order('sort_order');
  
  console.log(`   Found ${gallery?.length || 0} gallery items:`);
  gallery?.forEach(g => {
    console.log(`   - ${g.display_title} (project ${g.rendering_project_id})`);
  });

  // 3. Check both lists separately
  console.log('\n3. GALLERY-ONLY ITEMS (galleryOnly = true):');
  const { data: galleryOnlyItems } = await supabase
    .from('rendering_projects')
    .select('id, title, gallery_only')
    .eq('gallery_only', true);
  
  console.log(`   Found ${galleryOnlyItems?.length || 0} gallery-only items:`);
  galleryOnlyItems?.forEach(p => {
    console.log(`   - ${p.title} (no detail page, modal only)`);
  });

  console.log('\n=== SUMMARY ===');
  console.log(`✓ "Selected Works" section will show: ${fullPages?.length || 0} projects with detail pages`);
  console.log(`✓ Gallery modal will show: ${gallery?.length || 0} total items (full pages + gallery-only)`);
  console.log(`✓ Gallery-only items: ${galleryOnlyItems?.length || 0} (no detail page route)\n`);

  process.exit(0);
}

testQueries();
