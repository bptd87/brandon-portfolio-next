import { getDb } from './server/db';
import { news } from './drizzle/schema';
import { eq } from 'drizzle-orm';

const db = await getDb();

if (!db) {
  console.error('❌ Failed to connect to database');
  process.exit(1);
}

// Update Making My SCR Debut
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
  .where(eq(news.slug, 'making-my-scr-debut-million-dollar-quartet-2025'));

console.log('✅ Updated Making My SCR Debut');

// Update Assisting Tom Buderwitz
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
  .where(eq(news.slug, 'assisting-tom-buderwitz-the-play-that-goes-wrong'));

console.log('✅ Updated Assisting Tom Buderwitz');

// Update 40 Productions at Okoboji
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
    type: 'heading',
    content: 'Selected Productions at Okoboji Summer Theatre'
  },
  {
    type: 'text',
    content: '1. The Effect of Gamma Rays — dir. Beth Leonard (2010)\n2. Steel Magnolias — dir. Lamby Hedge (2011)\n3. The Glass Menagerie — dir. Lamby Hedge (2011)\n4. Crimes of the Heart — dir. Jana Robbins (2012)\n5. The Liar — dir. Lamby Hedge (2012)\n6. Chicago — dir. Millie Garvey (2012)\n7. Don\'t Dress for Dinner — dir. Dan Schultz (2013)\n8. Bingo: The Winning Musical — dir. Tricia Brouke (2013)\n9. Angel Street — dir. Rich Cole (2013)\n10. Rich Girl — dir. Rich Cole (2014)\n11. The Complete Works of Shakespeare — dir. David Davalos (2014)\n12. Little Shop of Horrors — dir. Terry Berliner (2014)\n13. On Thin Ice — dir. Dan Schultz (2015)\n14. The Last Train to Nibroc — dir. Janice Goldberg (2015)\n15. Barefoot in the Park — dir. Kymberly Mellen (2015)\n16. The Spitfire Grill — dir. Stephens Brotebeck (2016)\n17. A Murder Is Announced — dir. Karl Kippola (2016)\n18. Cinderella — dir. Liz Picolli (2016)\n19. Not Now, Darling — dir. Fred Rubeck (2018)\n20. Over the River, and Through the Woods — dir. Fred Rubeck (2018)\n21. Thoroughly Modern Millie — dir. Paul Finocchiaro (2018)\n22. Happily Ever After — dir. Courtney Crouse (2019)\n23. Living on Love — dir. Fred Rubeck (2019)\n24. Mamma Mia — dir. Robin Levine (2019)\n25. Clue: On Stage — dir. Stephen Brotebeck (2021)\n26. The Marvelous Wonderettes: Dream On — dir. Lauren Haughton Gillis (2021)\n27. Urinetown — dir. Paul Finocchiaro (2021)\n28. An Inspector Calls — dir. Stephen Brotebeck (2022)\n29. Bright Star — dir. Lauren Haughton Gillis (2022)\n30. Legally Blonde — dir. Amy Fritsche (2022)\n31. Cole — dir. Alison Moroney (2023)\n32. Dial "M" for Murder — dir. Fred Rubeck (2023)\n33. The Wedding Singer — dir. Bernie Monroe (2023)\n34. Baskerville — dir. Stephen Brotebeck (2024)\n35. Freaky Friday — dir. Josh Walden (2024)\n36. Barefoot in the Park — dir. Brett Olson (2024)\n37. The Music Man — dir. Bernie Monroe (2024)\n38. Bell, Book, and Candle — dir. Richard Biever (2025)\n39. Deathtrap — dir. Fred Rubeck (2025)\n40. How to Succeed in Business Without Really Trying — dir. Bernie Monroe (2025)'
  }
];

await db.update(news)
  .set({ blocks: okobojiBlocks })
  .where(eq(news.slug, '40-productions-at-okoboji-summer-theatre'));

console.log('✅ Updated 40 Productions at Okoboji');

// Update Fifth Season Utah Shakespeare
const utahShakespeareBlocks = [
  {
    type: 'text',
    content: 'June 2025 — I\'m proud to be in my fifth season assisting Jo Winiarski as Scenic Designer for the Utah Shakespeare Festival. While most of my work with Jo happens remotely during the year, it\'s always exciting to see the productions take shape in Cedar City.'
  },
  {
    type: 'text',
    content: 'This summer\'s lineup at the Randall L. Jones Theatre includes:'
  },
  {
    type: 'heading',
    content: 'A Gentleman\'s Guide to Love and Murder'
  },
  {
    type: 'text',
    content: 'Director: Amanda Berg Wilson\nScenic Design: Jo Winiarski\nAssistant Scenic Design: Brandon PT Davis\nCostume Design: Cha See\nLighting Design: Robert Wierzel\nSound Design/Composer: Sarah Pickett'
  },
  {
    type: 'heading',
    content: 'The Importance of Being Earnest'
  },
  {
    type: 'text',
    content: 'Director: Rodney Lizcano\nScenic Design: Jo Winiarski\nAssistant Scenic Design: Brandon PT Davis\nCostume Design: Bill Black\nLighting Design: Jessica Greenberg\nSound Design/Composer: Scott O\'Brien'
  }
];

await db.update(news)
  .set({ blocks: utahShakespeareBlocks })
  .where(eq(news.slug, 'fifth-season-assisting-jo-winiarski-utah-shakespeare'));

console.log('✅ Updated Fifth Season Utah Shakespeare');

console.log('\n🎉 All 4 news articles updated with complete content!');
process.exit(0);
