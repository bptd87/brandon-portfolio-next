import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

// Update Million Dollar Quartet SCR Debut (actual slug: million-dollar-quartet-scr-debut)
const scrDebutBlocks = [
  {
    type: 'text',
    content: 'Scenic designer Brandon PT Davis joins the creative team at South Coast Repertory for its upcoming production of Million Dollar Quartet, marking his scenic design debut at the theatre. Davis will co-design the set alongside Efren Delgadillo Jr., whose extensive experience in regional and festival theatre has been an invaluable guide during the early stages of the process.'
  },
  {
    type: 'text',
    content: 'Million Dollar Quartet launches South Coast Repertory\'s 62nd season on the Segerstrom Stage, opening September 13, 2025, and running through October. The high-energy musical is inspired by the legendary, spontaneous jam session that brought together four rock \'n\' roll icons—Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins—at Sun Records in Memphis.'
  },
  {
    type: 'text',
    content: 'Collaborating with the team at South Coast Repertory feels like a homecoming for Davis. The company\'s level of craft, production value, and urgency in storytelling align closely with the kind of work he has been striving toward. Designing a set that captures the spontaneity and high-stakes energy of the historic jam session—while also finding moments of humor and intimacy—presents a thrilling creative challenge.'
  },
  {
    type: 'text',
    content: 'Davis extends his gratitude to David Ivers, Suzanne Appel, Kim Martin-Cotten, James Moye, and the entire South Coast Repertory company for their trust and collaboration. He looks forward to sharing the world of Million Dollar Quartet with audiences this fall.'
  }
];

const result1 = await db.update(news)
  .set({ blocks: scrDebutBlocks })
  .where(eq(news.slug, 'million-dollar-quartet-scr-debut'));

console.log('✅ Updated Million Dollar Quartet SCR Debut');

// Now find the other 3 slugs by querying
const articles = await db.select({
  id: news.id,
  title: news.title,
  slug: news.slug
}).from(news).where(
  // Find articles containing these keywords in slug
  // We'll update them one by one after finding the correct slugs
);

console.log('\n📋 All news articles:');
for (const article of articles) {
  if (article.slug.includes('buderwitz') || 
      article.slug.includes('okoboji') || 
      article.slug.includes('utah') ||
      article.title.includes('Buderwitz') ||
      article.title.includes('40 Productions') ||
      article.title.includes('Utah Shakespeare')) {
    console.log(`  ${article.id} | ${article.title} | ${article.slug}`);
  }
}

process.exit(0);
