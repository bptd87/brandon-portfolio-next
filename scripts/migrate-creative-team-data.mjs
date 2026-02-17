import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateCreativeTeam() {
  console.log('🔄 Migrating creative team data from portfolio_projects.json to Supabase...\n');

  // Read the JSON file
  const rawData = fs.readFileSync('./data/portfolio_projects.json', 'utf8');
  const projects = JSON.parse(rawData);

  let successCount = 0;
  let skipCount = 0;

  for (const project of projects) {
    // Check if project has team data
    if (!project.team || !Array.isArray(project.team) || project.team.length === 0) {
      continue;
    }

    // Find the project in Supabase by slug
    const { data: supabaseProject, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, slug, creative_team')
      .eq('slug', project.slug)
      .single();

    if (fetchError) {
      console.log(`⚠️  Project not found in Supabase: ${project.slug}`);
      skipCount++;
      continue;
    }

    if (!supabaseProject) {
      console.log(`⚠️  Project not found in Supabase: ${project.slug}`);
      skipCount++;
      continue;
    }

    // Convert team format to creativeTeam format (should be identical)
    const creativeTeamData = project.team.map((member) => ({
      name: member.name?.trim() || '',
      role: member.role?.trim() || ''
    })).filter((m) => m.name && m.role);

    if (creativeTeamData.length === 0) {
      skipCount++;
      continue;
    }

    // Update the project with creative team data
    const { error: updateError } = await supabase
      .from('projects')
      .update({ creative_team: creativeTeamData })
      .eq('id', supabaseProject.id);

    if (updateError) {
      console.log(`❌ Error updating project ${project.slug}:`, updateError.message);
      skipCount++;
    } else {
      console.log(`✅ Migrated: ${project.title}`);
      console.log(`   Team members: ${creativeTeamData.map((m) => `${m.name} (${m.role})`).join(', ')}`);
      successCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Successfully migrated: ${successCount}`);
  console.log(`   ⚠️  Skipped: ${skipCount}`);
  console.log(`   📦 Total projects in file: ${projects.length}`);
}

migrateCreativeTeam();
