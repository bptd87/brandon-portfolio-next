import mysql from "mysql2/promise";

const conn = await mysql.createConnection(process.env.DATABASE_URL);

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Remaining directors
const directors = [
  'Lisa Brescia', 'Alison Morooney', 'Sara Rodriguez', 'Todd Davidson',
  'Elizabeth Palmieri', 'Amy Fritsche', 'Lauren Haughton', 'Chris Allerman',
  'Melissa Livingston', 'Richard Stafford', 'Paul Finocchiaro', 'Jay Stratton',
  'Lamby Hedge', 'Allison Watrous', 'Jennifer Hemphill', 'Robin Levine',
  'Don Hill', 'Tami LoSasso', 'Jane Page', 'Deb Currier',
  'Andrew Palermo', 'Jace Smykil', 'Evan Mueller', 'Suzy Newman',
  'Dan Schultz', 'Chuck McLane', 'Michael Jenkinson', 'Karl Kippola',
  'Sarah Hairston', 'Aaron DeYoung', 'Ann Marie Roberts', 'Rochelle Walter',
  'Michael Bollinger', 'Stephen Casey', 'James Zager', 'Kymberly Mellen',
  'Janice Goldberg', 'Jazz Rucker', 'Terry Berliner', 'David Davalos',
  'Rich Cole', 'Tricia Brouke', 'Millie Garvey', 'Jana Robbins',
  'Ken Halley', 'Beth Leonard', 'Becca Kravitz', 'Shana Prentice',
  'Cheryl Black'
];

// Theatre companies
const theatreCompanies = [
  { name: 'New Swan Theatre Festival', bio: 'Professional theatre company producing classical and contemporary works.' },
  { name: 'The Great American Melodrama', bio: 'Historic theatre in California specializing in melodramas and musicals.', instagram: 'https://www.instagram.com/greatmelodrama/' },
  { name: 'University of Missouri', bio: 'University theatre program producing professional-quality productions.' },
  { name: 'Theatre SilCo', bio: 'Theatre company in Silicon Valley.' },
  { name: 'University of Texas El Paso', bio: 'University theatre program.' },
  { name: 'Western Washington University', bio: 'University theatre program.' },
  { name: 'Western Summer Theatre', bio: 'Summer stock theatre company.' },
  { name: 'Lakewood High School', bio: 'High school theatre program.' },
  { name: 'Westminster High School', bio: 'High school theatre program.' },
  { name: 'Castleview High School', bio: 'High school theatre program.' },
  { name: 'Skyline High School', bio: 'High school theatre program.' },
  { name: 'West Virginia Public Theatre', bio: 'Professional regional theatre company.' },
  { name: 'Battle High School', bio: 'High school theatre program.' },
  { name: 'Kentucky Repertory Theatre', bio: 'Professional repertory theatre company.' },
  { name: 'Warehouse Theatre Company', bio: 'Professional theatre company.' },
  { name: 'Pomona High School', bio: 'High school theatre program.' },
  { name: 'Seattle Rep', bio: 'Major regional theatre in Seattle, Washington.', website: 'https://www.seattlerep.org/' },
  { name: 'Utah Shakespeare Festival', bio: 'Tony Award-winning professional theatre festival.', website: 'https://www.bard.org/' },
  { name: 'Cincinnati Playhouse in the Park', bio: 'Professional regional theatre in Cincinnati, Ohio.', website: 'https://www.cincyplay.com/' },
  { name: 'Pioneer Theatre', bio: 'Professional theatre company in Utah.' },
  { name: 'The Ruth Hale Orem', bio: 'Theatre company in Utah.' },
  { name: 'Pioneer Theatre Company', bio: 'Professional theatre company in Salt Lake City.', website: 'https://www.pioneertheatre.org/' },
  { name: 'California Center for the Arts Escondido', bio: 'Performing arts center in Escondido, California.' },
  { name: 'Off Broadway Signature Theatre', bio: 'Off-Broadway theatre in New York City.' },
  { name: 'Theatre Works Silicon Valley', bio: 'Professional theatre company in Silicon Valley.' },
  { name: 'Dallas Theatre Center', bio: 'Major regional theatre in Dallas, Texas.', website: 'https://www.dallastheatercenter.org/' },
  { name: 'Arrow Rock Lyceum Theatre', bio: 'Historic professional summer theatre in Missouri.' }
];

console.log(`Adding ${directors.length} remaining directors...`);
for (const name of directors) {
  const slug = generateSlug(name);
  try {
    await conn.query(
      `INSERT INTO collaborators (name, slug, role, bio, createdAt, updatedAt) 
       VALUES (?, ?, 'director', 'Theatre director.', NOW(), NOW())
       ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
      [name, slug]
    );
    console.log(`✓ Added director: ${name}`);
  } catch (err) {
    console.log(`✗ Error adding ${name}: ${err.message}`);
  }
}

console.log(`\nAdding ${theatreCompanies.length} theatre companies...`);
for (const company of theatreCompanies) {
  const slug = generateSlug(company.name);
  try {
    await conn.query(
      `INSERT INTO collaborators (name, slug, role, bio, portfolioUrl, instagramHandle, createdAt, updatedAt) 
       VALUES (?, ?, 'theatre_company', ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE updatedAt = NOW()`,
      [company.name, slug, company.bio, company.website || null, company.instagram || null]
    );
    console.log(`✓ Added company: ${company.name}`);
  } catch (err) {
    console.log(`✗ Error adding ${company.name}: ${err.message}`);
  }
}

await conn.end();
console.log('\nAll collaborators added successfully!');
