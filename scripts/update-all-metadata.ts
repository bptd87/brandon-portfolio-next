import { getDb } from '../server/db';
import { news, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function updateAllMetadata() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get all categories
  const allCategories = await db.select().from(categories).where(eq(categories.type, 'news'));
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]));

  // Complete list of updates with correct slugs from database
  const updates = [
    { slug: 'returning-to-new-swan-theatre-festival-2026', location: 'New Swan Theatre Festival - Laguna Beach, CA', category: 'season-announcements' },
    { slug: 'million-dollar-quartet-scr-debut', location: 'South Coast Repertory - Costa Mesa, CA', category: 'production-debuts' },
    { slug: 'the-orange-curtain-review-praises-million-dollar-quartet-at-south-coast-repertory', location: 'South Coast Repertory - Costa Mesa, CA', category: 'reviews-press' },
    { slug: 'assisting-on-the-play-that-goes-wrong', location: 'South Coast Repertory - Costa Mesa, CA', category: 'assistant-scenic-design' },
    { slug: '40-productions-at-okoboji-summer-theatre', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'milestones' },
    { slug: 'new-role-at-utep', location: 'University of Texas at El Paso - El Paso, TX', category: 'life-updates' },
    { slug: 'stephens-college-update', location: 'Stephens College - Columbia, MO', category: 'life-updates' },
    { slug: 'opening-night-deathtrap', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-bell-book-and-candle', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-freaky-friday', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-company', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-romero', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-much-ado-about-nothing', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-alls-well-that-ends-well', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-million-dollar-quartet', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-sound-of-music', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-addams-family', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-39-steps', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-drowsy-chaperone', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-producers', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-hairspray', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-full-monty', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-wedding-singer', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-rocky-horror-show', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-25th-annual-putnam-county-spelling-bee', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-music-man', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-little-mermaid', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-wizard-of-oz', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-king-and-i', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' },
    { slug: 'opening-night-the-pirates-of-penzance', location: 'Okoboji Summer Theatre - Okoboji, IA', category: 'opening-nights' }
  ];

  let updated = 0;
  let notFound = 0;

  for (const update of updates) {
    const [article] = await db.select().from(news).where(eq(news.slug, update.slug)).limit(1);
    
    if (!article) {
      console.log(`⚠ Not found: ${update.slug}`);
      notFound++;
      continue;
    }

    const categoryId = catMap[update.category];
    
    await db.update(news)
      .set({
        location: update.location,
        categoryId: categoryId
      })
      .where(eq(news.id, article.id));

    updated++;
  }

  console.log(`\n✓ Updated ${updated} articles`);
  console.log(`⚠ ${notFound} articles not found`);
  process.exit(0);
}

updateAllMetadata();
