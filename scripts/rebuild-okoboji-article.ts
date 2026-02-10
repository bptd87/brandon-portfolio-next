import { getDb } from '../server/db';
import { news } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function rebuildArticle() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const contentBlocks = [
    {
      type: 'text',
      content: 'August 5, 2023 marked the opening of Brandon PT Davis\'s 40th production at Okoboji Summer Theatre—a milestone reached over 15 seasons of summer stock theatre in Iowa. From intimate dramas to large-scale musicals, these 40 productions represent years of late nights, creative collaboration, and the privilege of working alongside talented students and theatre professionals.'
    },
    {
      type: 'text',
      content: 'Two people have been constants throughout this journey: Michael Burke, Director of Production, and Ruth Ann Burke, Executive Director. Their leadership has shaped Okoboji Summer Theatre into a training ground for emerging theatre artists and a home for professional designers. Working with them year after year has defined not just Davis\'s career, but his understanding of what summer stock theatre can mean—a place where artistry, mentorship, and community intersect.'
    },
    {
      type: 'image',
      url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/AnPuFUvobynVmETt.webp',
      caption: 'Freaky Friday (2024) at Okoboji Summer Theatre, directed by Josh Walden. Scenic design by Brandon PT Davis.'
    },
    {
      type: 'image',
      url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/BBViVMsHvKIVjdNU.jpg',
      caption: 'The Music Man (2024) at Okoboji Summer Theatre, directed by Bernie Monroe. Scenic design by Brandon PT Davis.'
    },
    {
      type: 'image',
      url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/fsDJvKNFUigGpVci.jpg',
      caption: 'Okoboji Summer Theatre venue in Okoboji, Iowa—home to 15 seasons and 40 productions designed by Brandon PT Davis.'
    },
    {
      type: 'header',
      content: '40 Productions at Okoboji Summer Theatre'
    },
    {
      type: 'details',
      items: [
        { label: '2010', value: 'The Effect of Gamma Rays on Man-in-the-Moon Marigolds — dir. Beth Leonard' },
        { label: '2011', value: 'Steel Magnolias — dir. Lamby Hedge' },
        { label: '', value: 'The Glass Menagerie — dir. Lamby Hedge' },
        { label: '2012', value: 'Crimes of the Heart — dir. Jana Robbins' },
        { label: '', value: 'The Liar — dir. Lamby Hedge' },
        { label: '', value: 'Chicago — dir. Millie Garvey' },
        { label: '2013', value: 'Don\'t Dress for Dinner — dir. Dan Schultz' },
        { label: '', value: 'Bingo: The Winning Musical — dir. Tricia Brouke' },
        { label: '', value: 'Angel Street — dir. Rich Cole' },
        { label: '2014', value: 'Rich Girl — dir. Rich Cole' },
        { label: '', value: 'The Complete Works of Shakespeare (Abridged) — dir. David Davolos' },
        { label: '', value: 'Little Shop of Horrors — dir. Terry Berliner' },
        { label: '2015', value: 'On Thin Ice — dir. Dan Schultz' },
        { label: '', value: 'The Last Train to Nibroc — dir. Janice Goldberg' },
        { label: '', value: 'Barefoot in the Park — dir. Kymberly Mellen' },
        { label: '2016', value: 'The Spitfire Grill — dir. Stephens Brotebeck' },
        { label: '', value: 'A Murder is Announced — dir. Karl Kippola' },
        { label: '', value: 'Cinderella — dir. Liz Picolli' },
        { label: '2018', value: 'Not Now, Darling — dir. Fred Rubeck' },
        { label: '', value: 'Over the River and Through the Woods — dir. Fred Rubeck' },
        { label: '', value: 'Thoroughly Modern Millie — dir. Paul Finocchiaro' },
        { label: '2019', value: 'Happily Ever After — dir. Courtney Crouse' },
        { label: '', value: 'Living on Love — dir. Fred Rubeck' },
        { label: '', value: 'Mamma Mia! — dir. Robin Levine' },
        { label: '2021', value: 'Clue on Stage — dir. Stephen Brotebeck' },
        { label: '', value: 'The Marvelous Wonderettes: Dream On — dir. Lauren Haughton Gillis' },
        { label: '', value: 'Urinetown — dir. Paul Finocchiaro' },
        { label: '2022', value: 'An Inspector Calls — dir. Stephen Brotebeck' },
        { label: '', value: 'Bright Star — dir. Lauren Haughton Gillis' },
        { label: '', value: 'Legally Blonde — dir. Amy Fritsche' },
        { label: '2023', value: 'Cole — dir. Alison Morooney' },
        { label: '', value: 'Dial "M" for Murder — dir. Fred Rubeck' },
        { label: '', value: 'The Wedding Singer — dir. Bernie Monroe' },
        { label: '2024', value: 'Baskerville — dir. Stephen Brotebeck' },
        { label: '', value: 'Freaky Friday — dir. Josh Walden' },
        { label: '', value: 'Barefoot in the Park — dir. Brett Olson' },
        { label: '', value: 'The Music Man — dir. Bernie Monroe' },
        { label: '2025', value: 'Bell, Book, and Candle — dir. Richard Biever' },
        { label: '', value: 'Deathtrap — dir. Fred Rubeck' },
        { label: '', value: 'How to Succeed in Business Without Really Trying — dir. Bernie Monroe' }
      ]
    }
  ];

  await db.update(news)
    .set({
      title: '40 Productions at Okoboji Summer Theatre',
      excerpt: 'Brandon PT Davis reached a career milestone with his 40th production at Okoboji Summer Theatre, marking 15 seasons of summer stock theatre in Iowa and years of collaboration with Michael Burke and Ruth Ann Burke.',
      blocks: contentBlocks,
      venue: 'Okoboji Summer Theatre',
      location: 'Okoboji, IA'
    })
    .where(eq(news.slug, '40-productions-at-okoboji-summer-theatre'));

  console.log('✓ Okoboji Summer Theatre article rebuilt!');
  console.log('  - Personal milestone narrative');
  console.log('  - 3 production images with captions');
  console.log('  - Complete list of 40 productions with directors');
  console.log('  - Section about Michael Burke and Ruth Ann Burke');
}

rebuildArticle()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
