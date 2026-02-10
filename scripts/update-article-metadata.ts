import { getDb } from '../server/db';
import { news, categories } from '../drizzle/schema';
import { eq, like } from 'drizzle-orm';

async function updateMetadata() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get all categories
  const allCategories = await db.select().from(categories).where(eq(categories.type, 'news'));
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]));

  console.log('Available categories:', Object.keys(catMap));

  // Get all news articles
  const articles = await db.select().from(news);
  
  console.log(`\nUpdating ${articles.length} articles...\n`);

  // Define location and category updates for each article
  const updates = [
    {
      slug: 'returning-to-new-swan-theatre-festival-2026',
      location: 'New Swan Theatre Festival - Laguna Beach, CA',
      category: 'season-announcements'
    },
    {
      slug: 'making-my-scr-debut-million-dollar-quartet-2025',
      location: 'South Coast Repertory - Costa Mesa, CA',
      category: 'production-debuts'
    },
    {
      slug: 'the-orange-curtain-review-praises-million-dollar-quartet-at-south-coast-repertory',
      location: 'South Coast Repertory - Costa Mesa, CA',
      category: 'reviews-press'
    },
    {
      slug: 'assisting-the-play-that-goes-wrong-at-south-coast-repertory',
      location: 'South Coast Repertory - Costa Mesa, CA',
      category: 'assistant-scenic-design'
    },
    {
      slug: '40-productions-at-okoboji-summer-theatre',
      location: 'Okoboji Summer Theatre - Okoboji, IA',
      category: 'milestones'
    },
    {
      slug: 'new-role-at-utep-assistant-professor-of-scenic-design',
      location: 'University of Texas at El Paso - El Paso, TX',
      category: 'life-updates'
    },
    {
      slug: 'stephens-college-update-looking-ahead-to-spring-2022',
      location: 'Stephens College - Columbia, MO',
      category: 'life-updates'
    }
  ];

  for (const update of updates) {
    const [article] = await db.select().from(news).where(eq(news.slug, update.slug)).limit(1);
    
    if (!article) {
      console.log(`⚠ Article not found: ${update.slug}`);
      continue;
    }

    const categoryId = catMap[update.category];
    if (!categoryId) {
      console.log(`⚠ Category not found: ${update.category}`);
      continue;
    }

    await db.update(news)
      .set({
        location: update.location,
        categoryId: categoryId
      })
      .where(eq(news.id, article.id));

    console.log(`✓ Updated: ${article.title}`);
    console.log(`  Location: ${update.location}`);
    console.log(`  Category: ${update.category}\n`);
  }

  console.log('✓ Metadata update complete!');
  process.exit(0);
}

updateMetadata();
