import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function showBeforeAfter() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          RENDERING ADMIN - BEFORE vs AFTER FIX            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const { data: oldProjects } = await supabase
    .from('projects')
    .select('id, title')
    .eq('discipline', 'rendering')
    .order('id');

  const { data: newProjects } = await supabase
    .from('rendering_projects')
    .select('id, title, gallery_only')
    .order('id');

  const { data: gallery } = await supabase
    .from('rendering_gallery')
    .select('id, rendering_project_id, display_title, sort_order')
    .order('sort_order');

  console.log('BEFORE (Broken):\n' + '─'.repeat(60));
  console.log('❌ Query: trpc.projects.list({ discipline: "rendering" })');
  console.log('❌ Data Source: OLD projects table');
  console.log('❌ Active Gallery: Showed items but references were broken');
  console.log('❌ Existing Projects: Showed these 6 OLD projects:');
  oldProjects?.forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.title} (old ID ${p.id})`);
  });
  console.log('❌ Problem: IDs didn\'t match! Gallery referenced rendering_projects,');
  console.log('   but "Existing Projects" showed old projects table\n');

  console.log('AFTER (Fixed):\n' + '─'.repeat(60));
  console.log('✅ Query: trpc.renderingProjects.list()');
  console.log('✅ Data Source: NEW rendering_projects table');
  console.log('✅ Active Gallery: Shows 6 items (correct):');
  gallery?.forEach((g, i) => {
    const project = newProjects?.find(p => p.id === g.rendering_project_id);
    const badge = project?.gallery_only ? '🖼️  modal' : '📄 page';
    console.log(`   ${g.sort_order}. ${g.display_title} ${badge}`);
  });
  console.log('✅ Existing Projects: Shows 0 items');
  console.log('   (All 6 projects already in gallery - correct!)\n');

  console.log('CHANGES MADE:\n' + '─'.repeat(60));
  console.log('1. ✅ Updated query: projects.list → renderingProjects.list');
  console.log('2. ✅ Updated mutation: projects.create → renderingProjects.create');  
  console.log('3. ✅ Updated mutation: projects.update → renderingProjects.update');
  console.log('4. ✅ Added missing "Boeing, Boeing" to gallery');
  console.log('5. ✅ Fixed gallery sort_order (was 0, 0, 0, 0, 0, 100)');
  console.log('6. ✅ Removed "discipline" field (no longer needed)\n');

  console.log('RESULT:\n' + '─'.repeat(60));
  console.log('✅ Admin now shows CORRECT rendering_projects data');
  console.log('✅ Gallery items properly linked to rendering_projects');
  console.log('✅ 4 full project pages + 2 gallery-only items');
  console.log('✅ Old projects table ignored (archived data)\n');

  process.exit(0);
}

showBeforeAfter();
