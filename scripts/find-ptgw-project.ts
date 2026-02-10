import { getDb } from '../server/db';
import { projects, projectImages } from '../drizzle/schema';
import { like, eq } from 'drizzle-orm';

async function findProject() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const proj = await db.select().from(projects).where(like(projects.title, '%Play That Goes Wrong%'));
  
  if (proj.length > 0) {
    console.log('Found project:', JSON.stringify(proj[0], null, 2));
    
    const images = await db.select().from(projectImages).where(eq(projectImages.projectId, proj[0].id));
    console.log('\nImages:', JSON.stringify(images, null, 2));
  } else {
    console.log('No project found for "The Play That Goes Wrong"');
  }
}

findProject()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
