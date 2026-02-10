import { getDb } from '../server/db';
import { news, categories } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function fixMetadata() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Get all categories
  const allCategories = await db.select().from(categories).where(eq(categories.type, 'news'));
  const catMap = Object.fromEntries(allCategories.map(c => [c.slug, c.id]));

  // Get all articles
  const articles = await db.select().from(news);
  
  console.log(`Found ${articles.length} articles to update\n`);

  // Update each article based on title/slug patterns
  for (const article of articles) {
    let location = article.location || '';
    let categorySlug = '';

    // Determine location and category based on title
    const title = article.title.toLowerCase();
    
    // Assistant work
    if (title.includes('assisting') || title.includes('assistant')) {
      categorySlug = 'assistant-scenic-design';
    }
    // Life updates
    else if (title.includes('new role') || title.includes('utep') || title.includes('stephens college update')) {
      categorySlug = 'life-updates';
      if (title.includes('utep')) location = 'University of Texas at El Paso - El Paso, TX';
      if (title.includes('stephens')) location = 'Stephens College - Columbia, MO';
    }
    // Reviews
    else if (title.includes('review') || title.includes('praises')) {
      categorySlug = 'reviews-press';
    }
    // Season announcements
    else if (title.includes('returning') || title.includes('season') || title.includes('2026')) {
      categorySlug = 'season-announcements';
    }
    // Production debuts
    else if (title.includes('debut') || title.includes('making my')) {
      categorySlug = 'production-debuts';
    }
    // Milestones
    else if (title.includes('40 productions')) {
      categorySlug = 'milestones';
    }
    // Opening nights - default
    else {
      categorySlug = 'opening-nights';
    }

    // Fix locations if not already set properly
    if (!location.includes(' - ')) {
      if (location.includes('South Coast Rep')) {
        location = 'South Coast Repertory - Costa Mesa, CA';
      } else if (location.includes('New Swan')) {
        location = 'New Swan Theatre Festival - Laguna Beach, CA';
      } else if (location.includes('Okoboji')) {
        location = 'Okoboji Summer Theatre - Okoboji, IA';
      }
    }

    const categoryId = catMap[categorySlug];
    
    if (categoryId && location) {
      await db.update(news)
        .set({ location, categoryId })
        .where(eq(news.id, article.id));
      
      console.log(`✓ ${article.title}`);
      console.log(`  → ${location} | ${categorySlug}\n`);
    }
  }

  console.log('✓ All metadata updated!');
  process.exit(0);
}

fixMetadata();
