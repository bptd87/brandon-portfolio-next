import fs from 'fs';

const csvContent = fs.readFileSync('./portfolio_projects_rows.csv', 'utf8');

// Simple CSV parser
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

const records = parseCSV(csvContent);

// Look for Glass Menagerie and Million Dollar Quartet
const projects = ['the-glass-menagerie', 'million-dollar-quartet'];

for (const slug of projects) {
  const project = records.find(r => r.slug === slug && r.category === 'Scenic Design');
  
  if (project) {
    console.log(`\n✅ Found: ${project.title}`);
    console.log(`   Slug: ${project.slug}`);
    console.log(`   Credits: ${project.credits ? 'YES' : 'NO'}`);
    
    if (project.credits) {
      try {
        const credits = JSON.parse(project.credits);
        console.log(`   Team members: ${credits.length}`);
        credits.forEach((m) => {
          console.log(`     - ${m.name} (${m.role})`);
        });
      } catch (e) {
        console.log(`   ⚠️ Failed to parse credits: ${e.message}`);
      }
    }
    
    console.log(`   Design notes: ${project.design_notes ? 'YES' : 'NO'}`);
  } else {
    console.log(`\n❌ NOT FOUND: ${slug}`);
  }
}
