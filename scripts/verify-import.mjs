import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyImport() {
  console.log('🔍 Verifying imported data...\n');

  const projects = ['the-glass-menagerie', 'million-dollar-quartet', 'bell-book-and-candle', 'a-funny-thing-happened'];

  for (const slug of projects) {
    const { data: project } = await supabase
      .from('projects')
      .select('title, creative_team, design_notes')
      .eq('slug', slug)
      .single();

    if (project) {
      console.log(`✅ ${project.title}`);
      console.log(`   Creative Team: ${project.creative_team?.length || 0} members`);
      if (project.creative_team?.length > 0) {
        project.creative_team.forEach((member, i) => {
          console.log(`     ${i + 1}. ${member.name} (${member.role})`);
        });
      }
      console.log(`   Design Notes: ${project.design_notes ? '✓ ' + project.design_notes.substring(0, 50) + '...' : '✗ Missing'}\n`);
    }
  }
}

verifyImport().catch(console.error);
