import { getDb } from "../server/db.ts";

const db = getDb();

console.log("Cleaning article content...");

// Get all articles
const articles = await db.query.articles.findMany();

for (const article of articles) {
  try {
    let content = article.content;
    let needsUpdate = false;

    // Remove [IMAGE SUGGESTION: ...] placeholders
    const cleanedContent = content.replace(/\[IMAGE SUGGESTION:[^\]]+\]/gi, '');
    
    if (cleanedContent !== content) {
      needsUpdate = true;
      console.log(`Cleaning article: ${article.title}`);
      
      // Update the article
      await db.update(articles).set({ content: cleanedContent }).where(eq(articles.id, article.id));
      console.log(`  ✓ Cleaned`);
    }
  } catch (error) {
    console.error(`Error cleaning article ${article.id}:`, error);
  }
}

console.log("\nDone!");
process.exit(0);
