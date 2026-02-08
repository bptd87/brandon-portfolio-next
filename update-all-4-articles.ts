import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

// 1. Million Dollar Quartet SCR Debut (slug: million-dollar-quartet-scr-debut)
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

await db.update(news)
  .set({ blocks: scrDebutBlocks })
  .where(eq(news.slug, 'million-dollar-quartet-scr-debut'));

console.log('✅ Updated Million Dollar Quartet SCR Debut');

// 2. Assisting Tom Buderwitz (slug: assisting-the-play-that-goes-wrong)
const tomBuderwitzBlocks = [
  {
    type: 'text',
    content: 'The Play That Goes Wrong opened at Seattle Repertory Theatre on August 28, 2025, and I was proud to serve as Assistant Scenic Designer to Tom Buderwitz, a longtime mentor whose guidance I deeply value. The production runs in the Bagley Wright Theater through September 28, 2025, and it has been a pleasure to contribute behind the scenes on what promises to be a riotous and meticulously crafted comedy.'
  },
  {
    type: 'text',
    content: 'The assistant role on The Play That Goes Wrong is both hands-on and illuminating. My work has spanned everything from model plotting to live adjustments, collaborating closely with Tom as the design balances precise technical execution with intentional visual chaos. His sharp eye for comedic mischief—where everything appears to collapse while remaining structurally sound—offers a master class in how comedy and craft intersect.'
  },
  {
    type: 'text',
    content: 'Working alongside Tom reinforces a core truth of scenic design: it is never just about scenery. It is collaborative, energetic, and responsive, supporting performers through controlled disorder with clarity and calm. Being part of this process has been a powerful reminder of how design functions as an active partner in storytelling, especially when everything goes wrong in exactly the right ways.'
  }
];

await db.update(news)
  .set({ blocks: tomBuderwitzBlocks })
  .where(eq(news.slug, 'assisting-the-play-that-goes-wrong'));

console.log('✅ Updated Assisting Tom Buderwitz');

// 3. 40 Productions at Okoboji (slug: 40-productions-at-okoboji-summer-theatre)
const okobojiBlocks = [
  {
    type: 'text',
    content: 'August 5, 2023 marked the opening of my 40th production at Okoboji Summer Theatre—a milestone that still feels surreal to write. I was 38 at the time, and somehow it had become my 15th season with the company. Time compresses when you think back on the shows, the late nights, and the many students and artists I\'ve had the privilege to work alongside.'
  },
  {
    type: 'text',
    content: 'Two people have been constants every single summer: Michael Burke, Director of Production, and Ruth Ann Burke, Executive Director. They are the anchors of this theatre, and working with them year after year has shaped not only my career, but my understanding of what summer stock can be at its best—rigorous, communal, and deeply human.'
  },
  {
    type: 'text',
    content: 'Forty productions is a number I never could have imagined when I first arrived. More than the milestone itself, I\'m grateful for the friendships, mentorship, and sense of community that Okoboji has built around the act of making theatre.'
  },
  {
    type: 'details',
    title: 'Selected Productions at Okoboji Summer Theatre',
    items: [
      { label: '1. The Effect of Gamma Rays', value: 'dir. Beth Leonard (2010)' },
      { label: '2. Steel Magnolias', value: 'dir. Lamby Hedge (2011)' },
      { label: '3. The Glass Menagerie', value: 'dir. Lamby Hedge (2011)' },
      { label: '4. Crimes of the Heart', value: 'dir. Jana Robbins (2012)' },
      { label: '5. The Liar', value: 'dir. Lamby Hedge (2012)' },
      { label: '6. Chicago', value: 'dir. Millie Garvey (2012)' },
      { label: '7. Don\'t Dress for Dinner', value: 'dir. Dan Schultz (2013)' },
      { label: '8. Bingo: The Winning Musical', value: 'dir. Tricia Brouke (2013)' },
      { label: '9. Angel Street', value: 'dir. Rich Cole (2013)' },
      { label: '10. Rich Girl', value: 'dir. Rich Cole (2014)' },
      { label: '11. The Complete Works of Shakespeare', value: 'dir. David Davalos (2014)' },
      { label: '12. Little Shop of Horrors', value: 'dir. Terry Berliner (2014)' },
      { label: '13. On Thin Ice', value: 'dir. Dan Schultz (2015)' },
      { label: '14. The Last Train to Nibroc', value: 'dir. Janice Goldberg (2015)' },
      { label: '15. Barefoot in the Park', value: 'dir. Kymberly Mellen (2015)' },
      { label: '16. The Spitfire Grill', value: 'dir. Stephens Brotebeck (2016)' },
      { label: '17. A Murder Is Announced', value: 'dir. Karl Kippola (2016)' },
      { label: '18. Cinderella', value: 'dir. Liz Picolli (2016)' },
      { label: '19. Not Now, Darling', value: 'dir. Fred Rubeck (2018)' },
      { label: '20. Over the River, and Through the Woods', value: 'dir. Fred Rubeck (2018)' },
      { label: '21. Thoroughly Modern Millie', value: 'dir. Paul Finocchiaro (2018)' },
      { label: '22. Happily Ever After', value: 'dir. Courtney Crouse (2019)' },
      { label: '23. Living on Love', value: 'dir. Fred Rubeck (2019)' },
      { label: '24. Mamma Mia', value: 'dir. Robin Levine (2019)' },
      { label: '25. Clue: On Stage', value: 'dir. Stephen Brotebeck (2021)' },
      { label: '26. The Marvelous Wonderettes: Dream On', value: 'dir. Lauren Haughton Gillis (2021)' },
      { label: '27. Urinetown', value: 'dir. Paul Finocchiaro (2021)' },
      { label: '28. An Inspector Calls', value: 'dir. Stephen Brotebeck (2022)' },
      { label: '29. Bright Star', value: 'dir. Lauren Haughton Gillis (2022)' },
      { label: '30. Legally Blonde', value: 'dir. Amy Fritsche (2022)' },
      { label: '31. Cole', value: 'dir. Alison Moroney (2023)' },
      { label: '32. Dial "M" for Murder', value: 'dir. Fred Rubeck (2023)' },
      { label: '33. The Wedding Singer', value: 'dir. Bernie Monroe (2023)' },
      { label: '34. Baskerville', value: 'dir. Stephen Brotebeck (2024)' },
      { label: '35. Freaky Friday', value: 'dir. Josh Walden (2024)' },
      { label: '36. Barefoot in the Park', value: 'dir. Brett Olson (2024)' },
      { label: '37. The Music Man', value: 'dir. Bernie Monroe (2024)' },
      { label: '38. Bell, Book, and Candle', value: 'dir. Richard Biever (2025)' },
      { label: '39. Deathtrap', value: 'dir. Fred Rubeck (2025)' },
      { label: '40. How to Succeed in Business Without Really Trying', value: 'dir. Bernie Monroe (2025)' }
    ]
  }
];

await db.update(news)
  .set({ blocks: okobojiBlocks })
  .where(eq(news.slug, '40-productions-at-okoboji-summer-theatre'));

console.log('✅ Updated 40 Productions at Okoboji');

// 4. Fifth Season Utah Shakespeare (slug: fifth-season-utah-shakespeare-festival)
const utahBlocks = [
  {
    type: 'text',
    content: 'June 2025 — I\'m proud to be in my fifth season assisting Jo Winiarski as Scenic Designer for the Utah Shakespeare Festival. While most of my work with Jo happens remotely during the year, it\'s always exciting to see the productions take shape in Cedar City.'
  },
  {
    type: 'text',
    content: 'This summer\'s lineup at the Randall L. Jones Theatre includes:'
  },
  {
    type: 'team',
    title: 'A Gentleman\'s Guide to Love and Murder',
    members: [
      { role: 'Director', name: 'Amanda Berg Wilson' },
      { role: 'Scenic Design', name: 'Jo Winiarski' },
      { role: 'Assistant Scenic Design', name: 'Brandon PT Davis' },
      { role: 'Costume Design', name: 'Cha See' },
      { role: 'Lighting Design', name: 'Robert Wierzel' },
      { role: 'Sound Design/Composer', name: 'Sarah Pickett' }
    ]
  },
  {
    type: 'team',
    title: 'The Importance of Being Earnest',
    members: [
      { role: 'Director', name: 'Rodney Lizcano' },
      { role: 'Scenic Design', name: 'Jo Winiarski' },
      { role: 'Assistant Scenic Design', name: 'Brandon PT Davis' },
      { role: 'Costume Design', name: 'Bill Black' },
      { role: 'Lighting Design', name: 'Jessica Greenberg' },
      { role: 'Sound Design/Composer', name: 'Scott O\'Brien' }
    ]
  }
];

await db.update(news)
  .set({ blocks: utahBlocks })
  .where(eq(news.slug, 'fifth-season-utah-shakespeare-festival'));

console.log('✅ Updated Fifth Season Utah Shakespeare');

console.log('\n🎉 All 4 news articles updated successfully with complete content!');
process.exit(0);
