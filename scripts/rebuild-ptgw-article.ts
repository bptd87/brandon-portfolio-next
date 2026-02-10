import { getDb } from '../server/db';
import { news } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

async function rebuildArticle() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const contentBlocks = [
    {
      type: 'text',
      content: 'Brandon PT Davis served as Assistant Scenic Designer to Tom Buderwitz for Seattle Repertory Theatre\'s production of The Play That Goes Wrong, providing drafting and 3D modeling support for this technically complex comedy. The production ran in the Bagley Wright Theater from August 28 through September 28, 2025, directed by Seattle Rep Artistic Director Dámaso Rodríguez in partnership with Portland Center Stage.'
    },
    {
      type: 'header',
      content: 'Drafting and 3D Modeling'
    },
    {
      type: 'text',
      content: 'As Assistant Scenic Designer, Davis provided drafting and 3D modeling support for Buderwitz\'s elaborate theater-within-a-theater design. The production\'s technical demands—collapsing sets, moving doors, and precisely choreographed scenic disasters—required detailed construction drawings and accurate 3D models to communicate the design to the scenic shop and technical team.'
    },
    {
      type: 'text',
      content: 'Working from Buderwitz\'s design concept, Davis created technical drawings that translated the visual design into buildable reality, documenting the mechanical elements and trick scenery that make the show\'s controlled chaos possible. The 3D modeling work helped visualize sightlines, spatial relationships, and the complex mechanics required for the show\'s signature gags.'
    },
    {
      type: 'header',
      content: 'The Design'
    },
    {
      type: 'text',
      content: 'Tom Buderwitz\'s scenic design creates a fully realized 1920s drawing room for the fictional Cornley Drama Society\'s ill-fated production of "The Murder at Haversham Manor." The set features rich period details—ornate moldings, a grand staircase, elegant furniture—all designed to spectacularly malfunction at precisely the wrong moments. Reviews praised the design as "handsome" and noted that the show requires "virtuosic production design and execution to support the action on stage."'
    },
    {
      type: 'text',
      content: 'The design challenge was creating a set that appears solid and traditional while incorporating numerous trick elements: doors that stick, mantels that collapse, and set pieces that move on their own. Every element serves both the visual comedy and the physical safety of the performers, requiring extensive engineering and testing.'
    },
    {
      type: 'image',
      url: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/lGqxaLckpxDvjOWk.jpg',
      caption: 'The elaborate theater-within-a-theater set for The Play That Goes Wrong at Seattle Rep\'s Bagley Wright Theater, featuring Tom Buderwitz\'s scenic design with period-accurate details engineered for controlled chaos. Photo by Bronwen Houck.'
    },
    {
      type: 'header',
      content: 'The Creative Team'
    },
    {
      type: 'team',
      members: [
        { role: 'Playwright', name: 'Henry Lewis, Henry Shields & Jonathan Sayer' },
        { role: 'Director', name: 'Dámaso Rodríguez' },
        { role: 'Scenic Designer', name: 'Tom Buderwitz' },
        { role: 'Assistant Scenic Designers', name: 'Brandon PT Davis, Atria Pirouzmand, Ali Roustaei' },
        { role: 'Costume Designer', name: 'Melanie Taylor Burgess' },
        { role: 'Lighting Designer', name: 'Connie Yun' },
        { role: 'Sound Designer', name: 'Rodolfo Ortega' },
        { role: 'Movement & Fight Director', name: 'Brian Danner' }
      ]
    },
    {
      type: 'header',
      content: 'About the Production'
    },
    {
      type: 'text',
      content: 'The Play That Goes Wrong originated from London\'s Mischief Theatre Company and became a Broadway hit before touring regionally. The show follows the Cornley Drama Society\'s disastrous attempt to stage a 1920s murder mystery, with everything that can go wrong going spectacularly, hilariously wrong. Seattle Rep\'s production featured Chip Sherman, Cassi Q Kohl, Darius Pierce, Setareki, Ashley Song, Ian Bond, Chris Murray, and Darragh Kennan.'
    },
    {
      type: 'link',
      text: 'Visit Seattle Repertory Theatre',
      url: 'https://www.seattlerep.org/plays/202526-season/the-play-that-goes-wrong'
    }
  ];

  await db.update(news)
    .set({
      title: 'Assisting Tom Buderwitz on The Play That Goes Wrong at Seattle Rep',
      excerpt: 'Brandon PT Davis served as Assistant Scenic Designer to Tom Buderwitz for Seattle Rep\'s production of The Play That Goes Wrong, providing drafting and 3D modeling support for the elaborate theater-within-a-theater design.',
      blocks: contentBlocks,
      venue: 'Seattle Repertory Theatre',
      location: 'Seattle, WA'
    })
    .where(eq(news.slug, 'assisting-the-play-that-goes-wrong'));

  console.log('✓ The Play That Goes Wrong article rebuilt!');
  console.log('  - Comprehensive content with role, design, and production sections');
  console.log('  - Creative team credits with you as Assistant Scenic Designer');
  console.log('  - Production photo with detailed caption');
  console.log('  - Link to Seattle Rep production page');
}

rebuildArticle()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
