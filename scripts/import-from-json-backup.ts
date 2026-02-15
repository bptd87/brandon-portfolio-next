import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function importFromJSON() {
  console.log('🔄 Importing data from JSON backup...\n');

  // Read the JSON backup
  const projectsData = JSON.parse(
    fs.readFileSync('data/portfolio_projects.json', 'utf-8')
  );

  console.log(`Found ${projectsData.length} projects in backup\n`);

  // Import projects one by one
  let imported = 0;
  let errors = 0;

  for (const project of projectsData) {
    try {
      const { error } = await supabase.from('projects').upsert({
        slug: project.slug,
        title: project.title,
        excerpt: project.description?.substring(0, 500),
        design_notes: project.project_overview,
        discipline: project.category?.toLowerCase().includes('experiential') ? 'experiential_design' : 
                    project.category?.toLowerCase().includes('scenic') ? 'scenic_design' : 'rendering',
        subcategory: project.subcategory,
        location: project.location,
        venue: project.venue,
        year: project.year,
        cover_image: project.card_image,
        status: 'published',
        featured: false,
      });

      if (error) {
        console.log(`❌ ${project.title}: ${error.message}`);
        errors++;
      } else {
        imported++;
        if (imported % 10 === 0) {
          console.log(`✅ Imported ${imported}/${projectsData.length}...`);
        }
      }
    } catch (err: any) {
      console.log(`❌ ${project.title}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Import complete!`);
  console.log(`   Imported: ${imported}`);
  console.log(`   Errors: ${errors}`);
}

importFromJSON().catch(err => {
  console.error('Import failed:', err);
  process.exit(1);
});
