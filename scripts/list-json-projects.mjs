import fs from 'fs';

const rawData = fs.readFileSync('./data/portfolio_projects.json', 'utf8');
const jsonProjects = JSON.parse(rawData);

// Extract projects with team data
const projectsWithTeam = jsonProjects.filter((p) => p.team && Array.isArray(p.team) && p.team.length > 0);

console.log('📋 Projects in JSON file with team data:');
projectsWithTeam.forEach((p) => {
  console.log(`   - ${p.slug} (team: ${p.team.length})`);
});
console.log(`\n✅ Total with team data: ${projectsWithTeam.length} / ${jsonProjects.length}`);
