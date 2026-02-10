import { getDb } from '../server/db';
import { news, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function changePTGWCategory() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Find the article
  const article = await db.select().from(news)
    .where(eq(news.slug, 'assisting-the-play-that-goes-wrong'))
    .limit(1);

  if (!article || article.length === 0) {
    throw new Error('Article not found');
  }

  const articleId = article[0].id;

  // Find or create "Assistant Scenic Design" category
  let assistantCategory = await db.select().from(categories)
    .where(eq(categories.slug, 'assistant-scenic-design'))
    .limit(1);

  if (!assistantCategory || assistantCategory.length === 0) {
    // Create the category
    await db.insert(categories).values({
      name: 'Assistant Scenic Design',
      slug: 'assistant-scenic-design',
      description: 'Projects where Brandon served as Assistant Scenic Designer, providing drafting and 3D modeling support',
      type: 'news'
    });

    assistantCategory = await db.select().from(categories)
      .where(eq(categories.slug, 'assistant-scenic-design'))
      .limit(1);
  }

  const assistantCategoryId = assistantCategory[0].id;

  // Update the article's categoryId
  await db.update(news)
    .set({ categoryId: assistantCategoryId })
    .where(eq(news.id, articleId));

  console.log('✓ Category changed to "Assistant Scenic Design"');
  console.log(`  Article: ${article[0].title}`);
  console.log(`  Old category ID: ${article[0].categoryId}`);
  console.log(`  New category ID: ${assistantCategoryId}`);
}

changePTGWCategory()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
