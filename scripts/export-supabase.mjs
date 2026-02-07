import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://zuycsuajiuqsvopiioer.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1eWNzdWFqaXVxc3ZvcGlpb2VyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTgzOTU4NSwiZXhwIjoyMDc3NDE1NTg1fQ.TN_GzEO1M36MHZ_Xxbn8CqhbOFONUC5qOItReFTlhXs';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Create data directory
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('📦 Exporting Supabase data...\n');

// Export portfolio_projects
const { data: projects, error: projectsError } = await supabase
  .from('portfolio_projects')
  .select('*')
  .order('created_at', { ascending: false });

if (projectsError) {
  console.error('Error fetching projects:', projectsError);
} else {
  fs.writeFileSync(
    path.join(dataDir, 'portfolio_projects.json'),
    JSON.stringify(projects, null, 2)
  );
  console.log(`✅ Exported ${projects.length} projects`);
  
  // Show first project structure for analysis
  if (projects.length > 0) {
    console.log('\n📋 First project structure:');
    console.log('Title:', projects[0].title);
    console.log('Category:', projects[0].category);
    console.log('Subcategory:', projects[0].subcategory);
    console.log('\nGallery fields:');
    console.log('- galleries:', Object.keys(projects[0].galleries || {}));
    console.log('- cover_image:', projects[0].cover_image ? 'exists' : 'missing');
    console.log('- card_image:', projects[0].card_image ? 'exists' : 'missing');
    console.log('\nFull first project:');
    console.log(JSON.stringify(projects[0], null, 2));
  }
}

// Export categories
const { data: categories, error: categoriesError } = await supabase
  .from('categories')
  .select('*');

if (categoriesError) {
  console.error('Error fetching categories:', categoriesError);
} else {
  fs.writeFileSync(
    path.join(dataDir, 'categories.json'),
    JSON.stringify(categories, null, 2)
  );
  console.log(`\n✅ Exported ${categories.length} categories`);
}

console.log('\n✨ Export complete! Check the data/ directory');
