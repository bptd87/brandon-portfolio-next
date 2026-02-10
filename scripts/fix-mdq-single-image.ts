import { getDb } from '../server/db';
import { news } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function fixMDQArticle() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const contentBlocks = [
    {
      type: 'text',
      content: 'Brandon PT Davis makes his South Coast Repertory debut as co-scenic designer for Million Dollar Quartet, collaborating with Efren Delgadillo Jr. to create a transformative scenic environment that captures the legendary night when Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins came together at Sun Studio.'
    },
    {
      type: 'header',
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
      content: 'The Creative Team'
    },
    {
      type: 'team',
      members: [
        { role: 'Book', name: 'Colin Escott & Floyd Mutrux' },
        { role: 'Director', name: 'James Moye' },
        { role: 'Associate Director', name: 'Kim Martin-Cotton' },
        { role: 'Music Director', name: 'Wiley DeWeese' },
        { role: 'Scenic Design', name: 'Efren Delgadillo Jr. & Brandon PT Davis' },
        { role: 'Costume Design', name: 'Kish Finnegan' },
        { role: 'Lighting Design', name: 'Lonnie Rafael Alcaraz' },
        { role: 'Sound Design', name: 'Jeff Polunas' }
      ]
    },
    {
      type: 'header',
      content: 'Scenic Model'
    },
    {
      type: 'image',
      url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/gICYYLwJUNchNBLE.png',
      caption: 'Brandon PT Davis with the 1:24 scale scenic model for Million Dollar Quartet at South Coast Repertory, showcasing the detailed Sun Records studio environment before technical rehearsals begin.'
    },
    {
      type: 'header',
      content: 'About the Production'
    },
    {
      type: 'text',
      content: 'Million Dollar Quartet tells the story of the famed recording session that brought together Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins for one unforgettable night at Sun Records. The production ran at South Coast Repertory\'s Segerstrom Stage, directed by James Moye with music direction by Wiley DeWeese.'
    },
    {
      type: 'link',
      text: 'Visit South Coast Repertory - Costa Mesa, CA',
      url: 'https://www.scr.org'
    }
  ];

  await db.update(news)
    .set({
      coverImageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/DHlqIGtPWTrrEypH.jpeg', // IMG_1529.jpeg - you with scenic model
      blocks: contentBlocks
    })
    .where(eq(news.slug, 'million-dollar-quartet-scr-debut'));

  console.log('✓ Million Dollar Quartet article updated!');
  console.log('  - Cover: Scenic model photo with Brandon');
  console.log('  - Single image: Scenic model with newsworthy caption');
  console.log('  - Creative team: Kim Martin-Cotton listed second (Associate Director)');
  console.log('  - Single link button at bottom');
}

fixMDQArticle()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
