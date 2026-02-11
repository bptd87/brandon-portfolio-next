import { getDb } from "./server/db.ts";
import { projects } from "./drizzle/schema.ts";
import { storagePut } from "./server/storage.ts";
import { eq } from "drizzle-orm";
import sharp from "sharp";

const alreadyDone = [
  'guys-on-ice', 'romero', 'the-glass-menagerie', 'million-dollar-quartet',
  'much-ado-about-nothing', 'freaky-friday', 'the-penelopiad', 'company'
];

async function resizeAllRemaining() {
  console.log("Resizing all remaining project images...\n");
  const db = await getDb();
  const allProjects = await db.select().from(projects);
  const toResize = allProjects.filter(p => 
    !alreadyDone.includes(p.slug) && 
    p.coverImageUrl && 
    !p.coverImageUrl.includes('-resized.webp')
  );
  
  console.log(`Found ${toResize.length} projects to resize\n`);
  
  let totalOldSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;
  
  for (const project of toResize) {
    try {
      console.log(`[${successCount + failCount + 1}/${toResize.length}] ${project.title}`);
      const response = await fetch(project.coverImageUrl);
      if (!response.ok) {
        console.log(`  ❌ Failed to fetch: ${response.status}\n`);
        failCount++;
        continue;
      }
      
      const buffer = Buffer.from(await response.arrayBuffer());
      const resized = await sharp(buffer)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      
      const oldSize = buffer.length / 1024;
      const newSize = resized.length / 1024;
      totalOldSize += oldSize;
      totalNewSize += newSize;
      
      console.log(`  ${oldSize.toFixed(1)} → ${newSize.toFixed(1)} KiB`);
      
      const key = `projects/${project.slug}-cover-resized.webp`;
      const { url } = await storagePut(key, resized, "image/webp");
      
      await db.update(projects)
        .set({ coverImageUrl: url, coverImageKey: key })
        .where(eq(projects.id, project.id));
      
      successCount++;
      console.log(`  ✓\n`);
    } catch (error) {
      console.log(`  ❌ ${error.message}\n`);
      failCount++;
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total savings: ${(totalOldSize - totalNewSize).toFixed(1)} KiB`);
  console.log(`Average: ${totalOldSize.toFixed(1)} → ${totalNewSize.toFixed(1)} KiB`);
  process.exit(0);
}

resizeAllRemaining().catch(console.error);
