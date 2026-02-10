import { getDb } from '../server/db';
import { projectImages, projects } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function getImages() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const [project] = await db.select().from(projects).where(eq(projects.slug, 'million-dollar-quartet')).limit(1);
  console.log('Project ID:', project.id);

  const images = await db.select().from(projectImages).where(eq(projectImages.projectId, project.id));
  console.log('Images:', JSON.stringify(images, null, 2));
}

getImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
