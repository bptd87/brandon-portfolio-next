import fs from 'fs';

const csvContent = fs.readFileSync('./portfolio_projects_rows.csv', 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

function parseCSVLine(line) {
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
  return fields;
}

const creditsIndex = headers.findIndex(h => h.trim() === 'credits');
const designNotesIndex = headers.findIndex(h => h.trim() === 'design_notes');
const slugIndex = headers.findIndex(h => h.trim() === 'slug');
const titleIndex = headers.findIndex(h => h.trim() === 'title');

// Find Glass Menagerie and Million Dollar Quartet
for (let i = 1; i < lines.length; i++) {
  const fields = parseCSVLine(lines[i]);
  const slug = fields[slugIndex]?.trim();
  
  if (slug === 'the-glass-menagerie' || slug === 'million-dollar-quartet') {
    const title = fields[titleIndex]?.trim();
    const credits = fields[creditsIndex]?.trim();
    const designNotes = fields[designNotesIndex]?.trim();
    
    console.log(`\n${title}:`);
    console.log(`  Slug: ${slug}`);
    console.log(`  Has Credits: ${!!credits && credits !== '[]' && credits !== ''}`);
    
    if (credits && credits !== '[]') {
      console.log(`  Credits (first 200 chars):\n    ${credits.substring(0, 200)}...`);
      
      try {
        let cleanedCredits = credits.startsWith('"') ? credits.slice(1) : credits;
        cleanedCredits = cleanedCredits.endsWith('"') ? cleanedCredits.slice(0, -1) : cleanedCredits;
        cleanedCredits = cleanedCredits.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        const parsed = JSON.parse(cleanedCredits);
        console.log(`  Parsed Team: ${parsed.length} members`);
        parsed.slice(0, 3).forEach(m => {
          console.log(`    - ${m.name} (${m.role})`);
        });
      } catch (e) {
        console.log(`  Parse Error: ${e.message}`);
      }
    }
    
    console.log(`  Has Design Notes: ${!!designNotes && designNotes !== ''}`);
  }
}
