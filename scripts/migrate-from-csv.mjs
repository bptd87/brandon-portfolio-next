import fs from 'fs';
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

// Simple CSV parser that handles quoted fields
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const record = {};
    let current = '';
    let inQuotes = false;
    let fieldIndex = 0;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"' && nextChar === '"') {
        current += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        record[headers[fieldIndex]] = current.trim();
        current = '';
        fieldIndex++;
      } else {
        current += char;
      }
    }
    record[headers[fieldIndex]] = current.trim();
    records.push(record);
  }

  return records;
}

async function migrateFromCSV() {
  console.log('📥 Parsing CSV file...\n');

  // Read CSV
  const csvContent = fs.readFileSync('./portfolio_projects_rows.csv', 'utf8');
  const records = parseCSV(csvContent);

  console.log(`✅ Parsed ${records.length} rows from CSV\n`);

  // Track unique projects by slug (filter for scenic design only)
  const projectsBySlug = new Map();

  for (const row of records) {
    if (!row.slug) continue;
    if (row.category !== 'Scenic Design') continue;

    // Only keep the first occurrence of each slug
    if (!projectsBySlug.has(row.slug)) {
      projectsBySlug.set(row.slug, row);
    }
  }

  console.log(`📊 Found ${projectsBySlug.size} unique Scenic Design projects (after deduplication)\n`);

  let migrated = 0;
  let skipped = 0;

  for (const [slug, row] of projectsBySlug) {
    // Extract credits (creative team)
    let credits = [];
    if (row.credits && row.credits.trim()) {
      try {
        credits = JSON.parse(row.credits);
        if (!Array.isArray(credits)) credits = [];
      } catch (e) {
        credits = [];
      }
    }

    // Extract design notes
    let designNotes = '';
    if (row.design_notes && row.design_notes.trim()) {
      try {
        const parsed = JSON.parse(row.design_notes);
        designNotes = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        designNotes = row.design_notes;
      }
    }

    // Skip if no data to migrate
    if (credits.length === 0 && !designNotes) {
      skipped++;
      continue;
    }

    // Find project in Supabase by slug
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, title, slug')
      .eq('slug', slug)
      .single();

    if (fetchError || !project) {
      console.log(`⚠️  Project not found: ${slug}`);
      skipped++;
      continue;
    }

    // Update with creative team and design notes
    const updateData = {};
    
    if (credits.length > 0) {
      updateData.creative_team = credits;
    }
    
    if (designNotes) {
      updateData.design_notes = designNotes;
    }

    const { error: updateError } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', project.id);

    if (updateError) {
      console.log(`❌ Error updating ${slug}:`, updateError.message);
      skipped++;
    } else {
      console.log(`✅ ${row.title}`);
      if (credits.length > 0) {
        console.log(`   Team: ${credits.length} members`);
      }
      if (designNotes) {
        console.log(`   Design notes: ${designNotes.substring(0, 60)}...`);
      }
      migrated++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Migrated: ${migrated}`);
  console.log(`   ⚠️  Skipped: ${skipped}`);
  console.log(`   📦 Unique projects: ${projectsBySlug.size}`);
}

migrateFromCSV().catch(console.error);
