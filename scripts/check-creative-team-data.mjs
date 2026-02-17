import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCreativeTeamData() {
  console.log('🔍 Checking creative_team data in projects table...\n');

  // Get all projects with creative_team data
  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, creative_team')
    .order('id', { ascending: true });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!projects || projects.length === 0) {
    console.log('❌ No projects found');
    return;
  }

  console.log(`✅ Found ${projects.length} projects\n`);

  let withData = 0;
  let withoutData = 0;

  for (const project of projects) {
    const hasCreativeTeam = project.creative_team && 
      (typeof project.creative_team === 'object' || typeof project.creative_team === 'string') &&
      JSON.stringify(project.creative_team) !== '{}' &&
      JSON.stringify(project.creative_team) !== 'null';

    if (hasCreativeTeam) {
      withData++;
      console.log(`✅ Project ${project.id} - "${project.title}"`);
      console.log(`   Type: ${typeof project.creative_team}`);
      console.log(`   Data:`, JSON.stringify(project.creative_team, null, 2));
      console.log('');
    } else {
      withoutData++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   Projects with creative team: ${withData}`);
  console.log(`   Projects without creative team: ${withoutData}`);
}

checkCreativeTeamData();
