import { getDb } from '../server/db';
import { news } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function fixMDQ() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const slug = 'million-dollar-quartet-scr-debut';
  
  // NEW cover image - Brandon with scenic model (boss vibes!)
  const coverImage = 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/AnobejMscUsupIXj.jpeg';
  
  // Enhanced content blocks - REMOVED duplicate link button at top
  const blocks = [
    {
      type: 'text',
      content: 'Brandon PT Davis makes his South Coast Repertory debut as co-scenic designer for Million Dollar Quartet, collaborating with Efren Delgadillo Jr. to create a transformative scenic environment that captures the legendary night when Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins came together at Sun Studio.'
    },
    {
      type: 'header',
      level: 2,
      content: 'The Design'
    },
    {
      type: 'text',
      content: 'Working in collaboration with Delgadillo Jr., Davis crafted a design that honors the intimate, raw energy of Sun Records while supporting the distinct musical styles of four legendary performers. The set transforms SCR\'s Segerstrom Stage into the iconic Memphis recording studio, complete with period-accurate details that ground the audience in 1956.'
    },
    {
      type: 'text',
      content: 'The design challenge was to create a single architectural gesture capable of supporting both the intimate moments of musical discovery and the explosive energy of rock and roll\'s birth. The result is a space that feels both historically authentic and theatrically dynamic, allowing the performers to inhabit the world of Sun Studio while giving the audience an immersive view into this pivotal moment in music history.'
    },
    {
      type: 'header',
      level: 2,
      content: 'The Creative Team'
    },
    {
      type: 'team',
      members: [
        { name: 'Colin Escott & Floyd Mutrux', role: 'Book' },
        { name: 'James Moye', role: 'Director' },
        { name: 'Wiley DeWeese', role: 'Music Director' },
        { name: 'Kim Martin-Cotton', role: 'Associate Director' },
        { name: 'Efren Delgadillo Jr. & Brandon PT Davis', role: 'Scenic Design' },
        { name: 'Kish Finnegan', role: 'Costume Design' },
        { name: 'Lonnie Rafael Alcaraz', role: 'Lighting Design' },
        { name: 'Jeff Polunas', role: 'Sound Design' }
      ]
    },
    {
      type: 'header',
      level: 2,
      content: 'Scenic Model & Process'
    },
    {
      type: 'gallery',
      images: [
        {
          url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/znxyNlOguPWiTqxF.png',
          caption: 'Scenic model detail showing Sun Studio recording space with iconic signage and period architecture'
        },
        {
          url: 'https://files.manus.im/project/million-dollar-quartet-scr/mdq-scr-01.jpg',
          caption: 'Production photo - The legendary quartet on stage at Sun Studio'
        },
        {
          url: 'https://files.manus.im/project/million-dollar-quartet-scr/mdq-scr-02.jpg',
          caption: 'Full stage view showing the complete Sun Studio environment'
        }
      ]
    },
    {
      type: 'header',
      level: 2,
      content: 'About the Production'
    },
    {
      type: 'text',
      content: 'Million Dollar Quartet tells the story of the famed recording session that brought together Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins for one unforgettable night at Sun Records. The production ran at South Coast Repertory\'s Segerstrom Stage, directed by James Moye with music direction by Wiley DeWeese.'
    },
    {
      type: 'link',
      url: 'https://www.scr.org/scr-blog/posts/meet-the-creative-team-of-million-dollar-quartet',
      text: 'Read Full Creative Team Bios on SCR Blog'
    }
  ];

  const [article] = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
  
  if (!article) {
    console.log('❌ Article not found');
    process.exit(1);
  }

  await db.update(news)
    .set({
      coverImage,
      blocks: blocks as any
    })
    .where(eq(news.id, article.id));

  console.log('✓ Million Dollar Quartet article fixed!');
  console.log('  - Cover: Scenic model photo (you with model)');
  console.log('  - Removed duplicate link button');
  console.log('  - Gallery: 3 images (scenic model + 2 production)');
  console.log('  - Creative team block ready');
  
  process.exit(0);
}

fixMDQ();
