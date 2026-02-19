import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function verifyAdminData() {
  console.log('=== VERIFYING ADMIN DATA ===\n');

  // Check OLD projects table (should NOT show in rendering admin)
  const { data: oldProjects } = await supabase
    .from('projects')
    .select('id, title, discipline')
    .eq('discipline', 'rendering');

  console.log('1. OLD projects table with discipline="rendering":');
  if (oldProjects && oldProjects.length > 0) {
    console.log(`   ⚠️  WARNING: Found ${oldProjects.length} projects in OLD table:`);
    oldProjects.forEach(p => console.log(`   - ${p.title} (ID ${p.id})`));
    console.log('   These should NOT appear in rendering admin!\n');
  } else {
    console.log('   ✅ No rendering projects in old table (correct)\n');
  }

  // Check NEW rendering_projects table (SHOULD show in rendering admin)
  const { data: newProjects } = await supabase
    .from('rendering_projects')
    .select('id, title, gallery_only, status')
    .order('year', { ascending: false });

  console.log('2. NEW rendering_projects table:');
  console.log(`   Found ${newProjects?.length || 0} projects:\n`);
  
  console.log('   FULL PROJECT PAGES (will appear in "Existing Projects"):');
  newProjects?.filter(p => !p.gallery_only).forEach(p => {
    console.log(`   ✓ ${p.title} (ID ${p.id}, status: ${p.status})`);
  });

  console.log('\n   GALLERY-ONLY ITEMS (will appear in "Existing Projects"):');
  newProjects?.filter(p => p.gallery_only).forEach(p => {
    console.log(`   ✓ ${p.title} (ID ${p.id}, status: ${p.status})`);
  });

  // Check gallery
  const { data: gallery } = await supabase
    .from('rendering_gallery')
    .select('id, rendering_project_id, display_title, sort_order')
    .order('sort_order');

  console.log('\n3. ACTIVE GALLERY (will appear in "Active Gallery"):');
  console.log(`   Found ${gallery?.length || 0} items:\n`);
  gallery?.forEach(g => {
    const project = newProjects?.find(p => p.id === g.rendering_project_id);
    const type = project?.gallery_only ? 'modal only' : 'full page';
    console.log(`   ${g.sort_order}. ${g.display_title} (project ${g.rendering_project_id}, ${type})`);
  });

  console.log('\n=== EXPECTED ADMIN VIEW ===');
  console.log('Left column "Active Gallery": 6 items');
  console.log('Right column "Existing Projects": 0 items (all are already in gallery)');
  console.log('\nAll items can be managed (reordered, updated, removed)');

  process.exit(0);
}

verifyAdminData();
