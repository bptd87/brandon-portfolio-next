import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fetchCreativeTeamFromMySQL() {
  console.log('🔍 Fetching creative team data from MySQL...\n');

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Get all projects with non-empty creativeTeam
    const [projects] = await connection.execute(`
      SELECT id, title, slug, creativeTeam 
      FROM projects 
      WHERE creativeTeam IS NOT NULL 
      AND creativeTeam != '{}' 
      AND creativeTeam != 'null'
      AND status = 'published'
      ORDER BY title ASC
    `);

    console.log(`✅ Found ${projects.length} projects with creative team data\n`);

    const projectData = [];

    for (const project of projects) {
      let team = [];
      
      // Parse creativeTeam - can be JSON string or object
      if (typeof project.creativeTeam === 'string') {
        try {
          team = JSON.parse(project.creativeTeam);
        } catch (e) {
          console.log(`⚠️  Failed to parse creativeTeam for ${project.slug}:`, e.message);
          continue;
        }
      } else if (typeof project.creativeTeam === 'object') {
        team = project.creativeTeam;
      }

      // Convert legacy format {director: "Name"} to [{name, role}]
      let formattedTeam = [];
      
      if (Array.isArray(team)) {
        formattedTeam = team.filter((m) => m.name && m.role);
      } else if (typeof team === 'object') {
        const roleMap = {
          director: "Director",
          associateDirector: "Associate Director",
          musicDirector: "Music Director",
          coScenicDesigner: "Co-Scenic Designer",
          costumeDesigner: "Costume Design",
          lightingDesigner: "Lighting Design",
          soundDesigner: "Sound Design",
          projectionDesigner: "Projection Design",
        };

        for (const [key, value] of Object.entries(team)) {
          if (value && typeof value === 'string' && roleMap[key]) {
            formattedTeam.push({
              name: value,
              role: roleMap[key]
            });
          }
        }
      }

      if (formattedTeam.length > 0) {
        console.log(`✅ ${project.title}`);
        formattedTeam.forEach((member) => {
          console.log(`   - ${member.name} (${member.role})`);
        });
        console.log('');

        projectData.push({
          id: project.id,
          slug: project.slug,
          title: project.title,
          team: formattedTeam
        });
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Projects with creative team: ${projectData.length}`);

    // Save for migration
    const fs = await import('fs');
    fs.writeFileSync(
      './scripts/mysql-creative-team-data.json',
      JSON.stringify(projectData, null, 2)
    );
    console.log(`   💾 Saved to scripts/mysql-creative-team-data.json`);

  } finally {
    await connection.end();
  }
}

fetchCreativeTeamFromMySQL().catch(console.error);
