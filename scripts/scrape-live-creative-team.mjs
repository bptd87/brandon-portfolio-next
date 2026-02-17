import fetch from 'node-fetch';

async function scrapeCreativeTeamData() {
  console.log('🌐 Fetching creative team data from live website...\n');

  // Get all projects from the live API
  try {
    const response = await fetch('https://www.brandonptdavis.com/api/projects?limit=100');
    const projects = await response.json();

    console.log(`✅ Found ${projects.length} projects on live site\n`);

    const projectsWithTeam = [];

    for (const project of projects) {
      if (project.creativeTeam && Object.keys(project.creativeTeam).length > 0) {
        // Convert legacy format to new format if needed
        const team = [];
        
        if (Array.isArray(project.creativeTeam)) {
          // Already in array format
          team.push(...project.creativeTeam);
        } else if (typeof project.creativeTeam === 'object') {
          // Legacy format: {director: "Name", ...}
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

          for (const [key, value] of Object.entries(project.creativeTeam)) {
            if (value && typeof value === 'string' && roleMap[key]) {
              team.push({
                name: value,
                role: roleMap[key]
              });
            }
          }
        }

        if (team.length > 0) {
          projectsWithTeam.push({
            id: project.id,
            slug: project.slug,
            title: project.title,
            team
          });

          console.log(`✅ ${project.title}`);
          team.forEach((member) => {
            console.log(`   - ${member.name} (${member.role})`);
          });
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Projects with creative team: ${projectsWithTeam.length}`);

    // Save to JSON for migration
    require('fs').writeFileSync(
      './scripts/live-site-creative-team-data.json',
      JSON.stringify(projectsWithTeam, null, 2)
    );
    console.log(`   💾 Saved to scripts/live-site-creative-team-data.json`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

scrapeCreativeTeamData();
