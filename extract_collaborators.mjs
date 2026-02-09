import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const results = await connection.query(`
  SELECT title, slug, creativeTeam, client, discipline
  FROM projects 
  WHERE status = 'published'
  ORDER BY publishedAt DESC
`);

const collaborators = {
  directors: new Set(),
  associate_directors: new Set(),
  music_directors: new Set(),
  scenic_designers: new Set(),
  costume_designers: new Set(),
  lighting_designers: new Set(),
  sound_designers: new Set(),
  projection_designers: new Set(),
  theatre_companies: new Set()
};

const rows = results[0];

rows.forEach(row => {
  const team = row.creativeTeam;
  if (!team) return;
  
  // Extract each role
  if (team.director) collaborators.directors.add(team.director);
  if (team.associateDirector) collaborators.associate_directors.add(team.associateDirector);
  if (team.musicDirector) collaborators.music_directors.add(team.musicDirector);
  if (team.coScenicDesigner) collaborators.scenic_designers.add(team.coScenicDesigner);
  if (team.costumeDesigner) collaborators.costume_designers.add(team.costumeDesigner);
  if (team.lightingDesigner) collaborators.lighting_designers.add(team.lightingDesigner);
  if (team.soundDesigner) collaborators.sound_designers.add(team.soundDesigner);
  if (team.projectionDesigner) collaborators.projection_designers.add(team.projectionDesigner);
  
  // Theatre companies from client field
  if (row.client && row.discipline === 'scenic_design') {
    collaborators.theatre_companies.add(row.client);
  }
});

// Convert Sets to Arrays
const output = {};
for (const [key, value] of Object.entries(collaborators)) {
  output[key] = Array.from(value).sort();
}

console.log(JSON.stringify(output, null, 2));

await connection.end();
