import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Parse CSV using native Python or a line-by-line approach
async function extractCreativeTeamFromCSV() {
  console.log('📥 Extracting creative team from CSV...\n');

  const csvContent = fs.readFileSync('./portfolio_projects_rows.csv', 'utf8');
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  // Find column indices
  const creditsIndex = headers.findIndex(h => h.trim() === 'credits');
  const designNotesIndex = headers.findIndex(h => h.trim() === 'design_notes');
  const categoryIndex = headers.findIndex(h => h.trim() === 'category');
  const slugIndex = headers.findIndex(h => h.trim() === 'slug');
  const titleIndex = headers.findIndex(h => h.trim() === 'title');

  console.log(`Column indices: credits=${creditsIndex}, designNotes=${designNotesIndex}, category=${categoryIndex}, slug=${slugIndex}`);

  const projectsToUpdate = [];

  // Parse each line manually
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Extract fields while respecting quotes
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"' && nextChar === '"') {
        current += '"';
        j++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);

    const category = fields[categoryIndex]?.trim();
    const slug = fields[slugIndex]?.trim();
    const title = fields[titleIndex]?.trim();
    const credits = fields[creditsIndex]?.trim();
    const designNotes = fields[designNotesIndex]?.trim();

    // Filter for Scenic Design projects with credits
    if (category === 'Scenic Design' && (credits || designNotes)) {
      let team = [];

      if (credits && credits !== '[]' && credits !== '') {
        try {
          // Remove outer quotes if present
          let cleanedCredits = credits.startsWith('"') ? credits.slice(1) : credits;
          cleanedCredits = cleanedCredits.endsWith('"') ? cleanedCredits.slice(0, -1) : cleanedCredits;
          
          // Unescape JSON escape sequences
          cleanedCredits = cleanedCredits.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
          
          team = JSON.parse(cleanedCredits);
          if (!Array.isArray(team)) team = [];
        } catch (e) {
          console.log(`⚠️  Failed to parse credits for ${slug}: ${e.message}`);
        }
      }

      if (team.length > 0 || designNotes) {
        projectsToUpdate.push({
          slug,
          title,
          team,
          designNotes: designNotes ? (designNotes.startsWith('"') ? designNotes.slice(1, -1) : designNotes) : null
        });
      }
    }
  }

  console.log(`Found ${projectsToUpdate.length} projects to update:\n`);

  let migrated = 0;

  for (const project of projectsToUpdate) {
    // Find in Supabase
    const { data: dbProject } = await supabase
      .from('projects')
      .select('id, title, slug')
      .eq('slug', project.slug)
      .single();

    if (!dbProject) {
      console.log(`⚠️  Not found in Supabase: ${project.slug}`);
      continue;
    }

    const updateData = {};
    if (project.team.length > 0) {
      updateData.creative_team = project.team;
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
      if (project.team.length > 0) {
        console.log(`   Team: ${project.team.length} members`);
      }
      migrated++;
    } else {
      console.log(`❌ Error updating ${project.slug}:`, error.message);
    }
  }

  console.log(`\n📊 Migrated: ${migrated}/${projectsToUpdate.length}`);
}

extractCreativeTeamFromCSV().catch(console.error);
