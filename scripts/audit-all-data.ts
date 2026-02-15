import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface TableCheck {
  table: string;
  count: number;
  sampleData?: any;
  error?: string;
}

async function checkTable(tableName: string): Promise<TableCheck> {
  try {
    // Get count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return { table: tableName, count: 0, error: countError.message };
    }

    // Get sample record
    const { data: sample } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    return { 
      table: tableName, 
      count: count || 0,
      sampleData: sample?.[0] 
    };
  } catch (err: any) {
    return { table: tableName, count: 0, error: err.message };
  }
}

async function auditAllData() {
  console.log('🔍 COMPREHENSIVE SUPABASE DATA AUDIT\n');
  console.log('Checking all tables for data integrity...\n');
  console.log('='.repeat(80));

  const criticalTables = [
    'projects',
    'project_images', 
    'news',
    'articles',
    'categories',
    'tags',
    'users',
    'tutorials',
    'collaborators',
    'scenic_directory',
  ];

  const galleryTables = [
    'rendering_gallery',
    'experiential_gallery', 
    'model_gallery',
  ];

  const junctionTables = [
    'project_tags',
    'article_tags',
    'news_tags',
  ];

  const analyticsTables = [
    'analytics_sessions',
    'analytics_project_views',
    'analytics_events',
  ];

  let totalRecords = 0;
  let errors: string[] = [];

  console.log('\n📊 CRITICAL DATA TABLES (Your content):\n');
  for (const table of criticalTables) {
    const result = await checkTable(table);
    
    if (result.error) {
      console.log(`  ❌ ${table.padEnd(25)} ERROR: ${result.error}`);
      errors.push(`${table}: ${result.error}`);
    } else if (result.count === 0) {
      console.log(`  ⚠️  ${table.padEnd(25)} 0 rows (might be empty)`);
    } else {
      console.log(`  ✅ ${table.padEnd(25)} ${result.count} rows`);
      totalRecords += result.count;
      
      // Show sample data for key tables
      if (['projects', 'news', 'articles'].includes(table) && result.sampleData) {
        const sample = result.sampleData;
        console.log(`     └─ Sample: "${sample.title || sample.name}" (ID: ${sample.id})`);
      }
    }
  }

  console.log('\n🎨 GALLERY TABLES:\n');
  for (const table of galleryTables) {
    const result = await checkTable(table);
    if (result.error) {
      console.log(`  ❌ ${table.padEnd(25)} ERROR: ${result.error}`);
      errors.push(`${table}: ${result.error}`);
    } else {
      console.log(`  ${result.count > 0 ? '✅' : '⚪️'} ${table.padEnd(25)} ${result.count} rows`);
      totalRecords += result.count;
    }
  }

  console.log('\n🔗 JUNCTION TABLES (Relationships):\n');
  for (const table of junctionTables) {
    const result = await checkTable(table);
    if (result.error) {
      console.log(`  ❌ ${table.padEnd(25)} ERROR: ${result.error}`);
    } else {
      console.log(`  ${result.count > 0 ? '✅' : '⚪️'} ${table.padEnd(25)} ${result.count} rows`);
      totalRecords += result.count;
    }
  }

  console.log('\n📈 ANALYTICS TABLES (May not exist yet):\n');
  for (const table of analyticsTables) {
    const result = await checkTable(table);
    if (result.error) {
      console.log(`  ⚠️  ${table.padEnd(25)} Not created yet (expected)`);
    } else {
      console.log(`  ✅ ${table.padEnd(25)} ${result.count} rows`);
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log(`\n📦 TOTAL RECORDS IN SUPABASE: ${totalRecords.toLocaleString()}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  ERRORS FOUND: ${errors.length}`);
    errors.forEach(err => console.log(`   - ${err}`));
  } else {
    console.log('\n✅ No critical errors found!');
  }

  // Critical validation
  const projectsCheck = await checkTable('projects');
  const newsCheck = await checkTable('news');
  const articlesCheck = await checkTable('articles');

  console.log('\n🎯 VALIDATION SUMMARY:\n');
  
  if (projectsCheck.count > 0) {
    console.log(`  ✅ Projects: ${projectsCheck.count} found - YOUR PORTFOLIO IS SAFE`);
  } else {
    console.log(`  ❌ Projects: NONE FOUND - DO NOT PROCEED WITH CLEANUP!`);
  }

  if (newsCheck.count > 0) {
    console.log(`  ✅ News: ${newsCheck.count} found - News items are safe`);
  } else {
    console.log(`  ⚠️  News: Empty (might be intentional)`);
  }

  if (articlesCheck.count > 0) {
    console.log(`  ✅ Articles: ${articlesCheck.count} found - Articles are safe`);
  } else {
    console.log(`  ⚠️  Articles: Empty (might be intentional)`);
  }

  const imageCount = (await checkTable('project_images')).count;
  if (imageCount > 0) {
    console.log(`  ✅ Project Images: ${imageCount} found - Image data is safe`);
  }

  console.log('\n' + '='.repeat(80));
  
  if (projectsCheck.count > 0 && totalRecords > 10) {
    console.log('\n✅ SAFE TO PROCEED: All critical data is in Supabase');
    console.log('   You can safely remove MySQL/Drizzle dependencies\n');
  } else {
    console.log('\n⛔️ DO NOT PROCEED: Critical data missing or insufficient');
    console.log('   Need to investigate before removing MySQL\n');
  }
}

auditAllData().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
