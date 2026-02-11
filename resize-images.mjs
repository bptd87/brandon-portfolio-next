import { getDb } from "./server/db.ts";
import { projects } from "./drizzle/schema.ts";
import { storagePut } from "./server/storage.ts";
import { eq } from "drizzle-orm";
import sharp from "sharp";

const targetProjects = [
  "the-glass-menagerie",
  "million-dollar-quartet", 
  "much-ado-about-nothing",
  "freaky-friday",
  "the-penelopiad",
  "company"
];

async function resizeImages() {
  console.log("Starting image resize...\n");
  const db = await getDb();
  const allProjects = await db.select().from(projects);
  const toResize = allProjects.filter(p => targetProjects.includes(p.slug));
  console.log(`Found ${toResize.length} projects to resize\n`);
  
  let totalOldSize = 0;
  let totalNewSize = 0;
  
  for (const project of toResize) {
    try {
      console.log(`Processing: ${project.title}`);
      const response = await fetch(project.coverImageUrl);
      if (!response.ok) {
        console.log(`  ❌ Failed to fetch: ${response.status}\n`);
        continue;
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const resized = await sharp(buffer).resize(800, null, { withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
      
      const oldSize = buffer.length / 1024;
      const newSize = resized.length / 1024;
      totalOldSize += oldSize;
      totalNewSize += newSize;
      
      console.log(`  Old: ${oldSize.toFixed(1)} KiB → New: ${newSize.toFixed(1)} KiB (${((1 - newSize/oldSize) * 100).toFixed(1)}% savings)`);
      
      const key = `projects/${project.slug}-cover-resized.webp`;
      const { url } = await storagePut(key, resized, "image/webp");
      
      await db.update(projects).set({ coverImageUrl: url, coverImageKey: key }).where(eq(projects.id, project.id));
      console.log(`  ✓ Updated\n`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  console.log(`\nTotal savings: ${(totalOldSize - totalNewSize).toFixed(1)} KiB (${totalOldSize.toFixed(1)} → ${totalNewSize.toFixed(1)})`);
  console.log("Complete!");
  process.exit(0);
}

resizeImages().catch(console.error);
