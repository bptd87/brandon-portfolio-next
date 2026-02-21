import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

async function check() {
  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('id, title, year, discipline, slug')
      .order('id', { ascending: true })
      .limit(100);
    
    if (error) {
      console.log('Error:', error);
      process.exit(1);
    }
    
    console.log(`Total: ${count} projects\n`);
    
    const byDiscipline = {};
    data.forEach(p => {
      if (!byDiscipline[p.discipline]) byDiscipline[p.discipline] = [];
      byDiscipline[p.discipline].push(p);
    });
    
    Object.entries(byDiscipline).forEach(([discipline, projects]) => {
      console.log(`\n=== ${discipline?.toUpperCase() || 'NULL'} (${projects.length}) ===`);
      projects.forEach(p => {
        console.log(`  ${p.id}: "${p.title}" (${p.year})`);
      });
    });
    
  } catch (e) {
    console.error('Error:', e.message);
  }
  process.exit(0);
}

check();
