import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractAndImportFromSQL() {
  console.log('📥 Parsing SQL for creative team and design notes...\n');

  const sqlContent = fs.readFileSync('./portfolio_projects_rows.sql', 'utf8');
  
  // Extract all INSERT statements
  const insertMatches = sqlContent.matchAll(/INSERT INTO[^(]+\((.*?)\)\s*VALUES\s*\((.*?)\)(?:,\s*\(|;)/gs);
  
  let columnNames = [];
  const rows = [];

  for (const match of insertMatches) {
    if (!columnNames.length) {
      columnNames = match[1].split(',').map(c => c.trim().replace(/"/g, ''));
    }
    
    // Parse the VALUES part - this is complex due to nested data
    const valuesStr = match[2];
    const values = parseValues(valuesStr);
    
    if (values.length === columnNames.length) {
      const row = {};
      columnNames.forEach((col, i) => {
        row[col] = values[i];
      });
      rows.push(row);
    }
  }

  console.log(`✅ Parsed ${rows.length} projects from SQL\n`);

  // Find projects with credits or design_notes
  const projectsToUpdate = [];

  for (const row of rows) {
    const slug = row.slug;
    const credits = row.credits ? parseJSON(row.credits) : null;
    const designNotes = row.design_notes ? parseJSON(row.design_notes) : null;

    if ((credits && Array.isArray(credits) && credits.length > 0) || 
        (designNotes && Array.isArray(designNotes) && designNotes.length > 0)) {
      projectsToUpdate.push({
        slug,
        title: row.title,
        credits,
        designNotes: designNotes?.[0] || null
      });
    }
  }

  console.log(`Found ${projectsToUpdate.length} projects with data to import:\n`);

  let migrated = 0;

  for (const project of projectsToUpdate) {
    // Find in Supabase
    const { data: dbProject } = await supabase
      .from('projects')
      .select('id, title, slug')
      .eq('slug', project.slug)
      .single();

    if (!dbProject) {
      console.log(`⚠️  Not found: ${project.slug}`);
      continue;
    }

    const updateData = {};
    
    if (project.credits && Array.isArray(project.credits)) {
      updateData.creative_team = project.credits;
    }
    
    if (project.designNotes) {
      updateData.design_notes = project.designNotes;
    }

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', dbProject.id);

    if (!error) {
      console.log(`✅ ${project.title}`);
      if (project.credits?.length) {
        console.log(`   Team: ${project.credits.length} members`);
      }
      if (project.designNotes) {
        console.log(`   Design Notes: ${project.designNotes.substring(0, 60)}...`);
      }
      migrated++;
    } else {
      console.log(`❌ Error: ${project.slug}`, error.message);
    }
  }

  console.log(`\n📊 Migrated: ${migrated}/${projectsToUpdate.length}`);
}

function parseValues(str) {
  const values = [];
  let current = '';
  let inQuotes = false;
  let inArray = false;
  let depth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const nextChar = str[i + 1];
    const prevChar = str[i - 1];

    if (char === "'" && prevChar !== '\\' && !inArray) {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === 'A' && str.substring(i, i + 5) === 'ARRAY' && !inQuotes) {
      inArray = true;
      current += char;
    } else if (char === '[' && inArray) {
      depth++;
      current += char;
    } else if (char === ']' && inArray && depth > 0) {
      depth--;
      current += char;
      if (depth === 0) inArray = false;
    } else if (char === ',' && !inQuotes && !inArray) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    values.push(current.trim());
  }

  return values.map(v => {
    // Handle SQL NULL
    if (v === 'null') return null;
    // Handle quoted strings
    if (v.startsWith("'") && v.endsWith("'")) {
      return v.slice(1, -1).replace(/\\'/g, "'");
    }
    // Handle booleans
    if (v === "'true'" || v === 'true') return true;
    if (v === "'false'" || v === 'false') return false;
    // Handle numbers
    if (!isNaN(v) && v !== '') return Number(v);
    return v;
  });
}

function parseJSON(val) {
  if (!val) return null;
  if (typeof val === 'object') return val;
  
  try {
    // Handle SQL format like ARRAY[...] or quoted JSON
    let cleaned = val;
    if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned.startsWith('ARRAY[') && cleaned.endsWith(']')) {
      cleaned = cleaned.slice(5, -1);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

extractAndImportFromSQL().catch(console.error);
