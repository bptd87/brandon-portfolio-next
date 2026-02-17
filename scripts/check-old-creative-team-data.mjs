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

async function checkProjectsData() {
  console.log('🔍 Checking projects in Supabase...\n');

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, title, metadata')
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

  // Check for creative team data in metadata
  let count = 0;
  for (const project of projects) {
    if (project.metadata) {
      const meta = typeof project.metadata === 'string' ? JSON.parse(project.metadata) : project.metadata;
      
      // Look for any crew/team related data
      if (meta.director || meta.cinematographer || meta.composer || meta.collaborators || meta.crew) {
        count++;
        console.log(`Project ${project.id}: ${project.title}`);
        console.log(JSON.stringify({
          director: meta.director,
          cinematographer: meta.cinematographer,
          composer: meta.composer,
          collaborators: meta.collaborators,
          crew: meta.crew
        }, null, 2));
        console.log('');
      }
    }
  }

  if (count === 0) {
    console.log('❌ No creative team data found in metadata');
  } else {
    console.log(`\n✅ Found ${count} projects with potential creative team data`);
  }
}

checkProjectsData();
