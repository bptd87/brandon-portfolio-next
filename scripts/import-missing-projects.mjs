import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function importMissingProjects() {
  console.log('📥 Importing missing creative team and design notes...\n');

  // Data extracted from SQL
  const projectsToUpdate = [
    {
      slug: 'the-glass-menagerie',
      title: 'The Glass Menagerie',
      creativeTeam: [
        { name: 'Tennessee Williams', role: 'Playwright' },
        { name: 'Kimberly Braun', role: 'Director' },
        { name: 'Brandon PT Davis', role: 'Scenic Design' },
        { name: 'Jack A. Smith', role: 'Costume Design' },
        { name: 'Vincente Williams', role: 'Ligthing Design' },
        { name: 'Leo Basinger', role: 'Sound Design' }
      ],
      designNotes: `This production of The Glass Menagerie was grounded in the idea of the memory play—not as a literal reconstruction of the Wingfield apartment, but as a fluid, impressionistic landscape shaped by Tom's recollection. From the outset, the design sought to feel unstable and permeable, allowing memory to drift, overlap, and distort rather than lock the play into a fixed domestic realism.

The central scenic gesture was a large, elevated interior platform that defined the apartment's primary playing space. This platform functioned both practically and metaphorically: it created a clear home base for the action while reinforcing Tom's sense of entrapment within the last place he ever called home. The elevation subtly separated the family from the surrounding world, heightening the emotional pressure of scenes that unfold there.

Surrounding the platform, I developed a series of loosely defined architectural structures—brick fragments, doorways, and thresholds—that suggested environment without enclosing it. These elements allowed actors to move freely through the space, supporting the play's fluid shifts between interior and exterior, past and present. The lack of complete walls was intentional; nothing in this world is fully contained.

A key visual component was the "memory wall," a collage of framed images depicting fragments of Tom and Laura's past. These images were intentionally vague—grayed photographs with subtle noise and muted color—designed to feel incomplete and unreliable. Rather than illustrating specific moments, they functioned as emotional echoes, reinforcing the idea that memory is selective, fragile, and shaped by longing.

Throughout the process, the design remained focused on supporting the actors and the text. The space was built to breathe, allowing lighting, movement, and performance to activate it. The result was an environment that lived between realism and recollection—a theatrical memoryscape shaped by absence as much as presence.`
    },
    {
      slug: 'million-dollar-quartet',
      title: 'Million Dollar Quartet',
      creativeTeam: [
        { name: 'James Moye', role: 'Director' },
        { name: 'Kim Martin-Cotten', role: 'Associate Director' },
        { name: 'Wiley DeWeese', role: 'Music Director' },
        { name: 'Brandon PT Davis & Efren Delgadillo Jr', role: 'Co-Scenic Designer' },
        { name: 'Kish Finnegan', role: 'Costume Designer' },
        { name: 'Lonnie Rafael Alcaraz', role: 'Lighting Designer' },
        { name: 'Jeff Polunas', role: 'Sound Designer' }
      ],
      designNotes: `The design invites audiences into Sun Records on the day Elvis Presley, Johnny Cash, Jerry Lee Lewis, and Carl Perkins came together for their legendary jam session. Collaborating with co–scenic designer Efren Delgadillo Jr., director James Moye, and associate director Kim Martin-Cotten, we balanced authenticity with theatricality—capturing both a Memphis studio's intimacy and the explosive energy of rock 'n' roll in the making.

The studio environment was detailed and grounded: wood floors, period recording equipment, and control-room windows lined with gold records. At the same time, theatrical elements heightened the impact of the music. Chief among these is an illuminated "SUN" sign—drawn from Elvis's concert signage—that turns the room into a stage for history, where the everyday suddenly feels iconic.

Our goal was to honor the spirit of collaboration at the heart of the play. The space is shaped to amplify relationships in the room—musicians facing one another, sharing energy, finding rhythm, and pushing boundaries. The set becomes not just a place to perform, but a portrait of how artists influence each other and, together, change the course of American music.`
    },
    {
      slug: 'bell-book-and-candle',
      title: 'Bell, Book, and Candle',
      creativeTeam: [
        { name: 'John Van Druten', role: 'Playwright' },
        { name: 'Richard Biever', role: 'Director' },
        { name: 'Brandon PT Davis', role: 'Scenic Design' },
        { name: 'Ashley Harrison', role: 'Costume Design' },
        { name: 'Lennox Emery', role: 'Lighting Design' },
        { name: 'Anastasiia Didenko', role: 'Sound Design' }
      ],
      designNotes: `The scenic design for Bell, Book and Candle, directed by Richard Biever, was rooted in realism. The primary goal was to create a fully realized apartment interior that felt lived-in, functional, and emotionally specific—an environment where the characters could exist naturally, allowing the story and performances to drive the theatrical experience.

The space was conceived as a complete room rather than a suggestion of one. Architectural details such as built-in bookshelves, practical doors, and defined wall planes established a sense of permanence and weight. Furniture placement was carefully considered to support blocking and sightlines while reinforcing the rhythms of everyday life. The set needed to accommodate long scenes of dialogue and subtle shifts in power and intimacy, so clarity and comfort were prioritized over spectacle.

Color played a key role in shaping the atmosphere. The decision to use green walls was both aesthetic and narrative. Green offered warmth without becoming neutral, giving the room personality while remaining grounded in realism. It also provided a gentle contrast to costumes and skin tones, helping actors remain visually distinct without calling attention to the scenery itself. The palette supported the play's tone—familiar, slightly heightened, and quietly playful—without tipping into overt stylization.

Textures and finishes reinforced the realism of the space. Wood flooring, soft furnishings, framed artwork, and practical lighting elements contributed to a domestic environment that felt curated but not precious. The room suggested history and routine, allowing the supernatural elements of the story to exist just beneath the surface rather than being overtly designed into the architecture.

Ultimately, the scenic design aimed to disappear into the storytelling. By committing fully to realism, the set created a stable, believable world in which the play's humor, relationships, and magical undertones could unfold organically.`
    },
    {
      slug: 'a-funny-thing-happened',
      title: 'A Funny Thing Happened on the Way to the Forum',
      creativeTeam: [
        { name: 'Stephens Sondheim', role: 'Music and Lyrics' },
        { name: 'Mellisa Livingston', role: 'Director' },
        { name: 'Len Rhodes', role: 'Music Director' },
        { name: 'Rachel Leigh Dolan', role: 'Choreographer' },
        { name: 'Brandon PT Davis', role: 'Scenic Designer' },
        { name: 'Rachel Anne Germinario', role: 'Costume Designer' },
        { name: 'Kenrick Fischer', role: 'Lighting Designer' },
        { name: 'Matthew Eckstein', role: 'Sound Designer' }
      ],
      designNotes: `Three houses stood at the center of the design for A Funny Thing Happened on the Way to the Forum: the home of Senex, the lively brothel of Lycus, and the worn, modest dwelling of Erronius. Each façade was rendered in a heightened, cartoon-like style that matched the show's farcical humor while still carrying echoes of ancient Rome—a stage picture that instantly communicated comedy yet stayed rooted in a classical world.

To strike this balance, I looked to Greco-Roman pottery and decorative motifs. Columns and carved details appeared throughout the architecture, treated with playful exaggeration. The humor is quick and relentless, so the set needed clarity and flexibility—anchoring comic situations while transforming easily as the farce unfolded.

Each house held its own personality: Senex's home suggested domestic order ready to unravel; Lycus's façade leaned into flamboyance and theatricality; Erronius's dwelling offered contrast in its simplicity. Together, the trio formed a visual shorthand for tangled relationships and chaotic schemes.

What tied the design together was its sense of exaggeration—architectural features pushed just far enough to feel humorous without tipping into parody. That blend of sophistication and whimsy created a world where mistaken identities, disguises, and comic chases felt perfectly at home, inviting audiences to laugh while appreciating the historical textures beneath the comedy.`
    }
  ];

  console.log(`Importing ${projectsToUpdate.length} projects:\n`);

  let migrated = 0;

  for (const project of projectsToUpdate) {
    // Find in Supabase
    const { data: dbProject } = await supabase
      .from('projects')
      .select('id, title, slug')
      .eq('slug', project.slug)
      .single();

    if (!dbProject) {
      console.log(`⚠️  Not found in Supabase: ${project.slug}`);
      continue;
    }

    const updateData = {
      creative_team: project.creativeTeam,
      design_notes: project.designNotes
    };

    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', dbProject.id);

    if (!error) {
      console.log(`✅ ${project.title}`);
      console.log(`   Team: ${project.creativeTeam.length} members`);
      console.log(`   Design Notes: ✓`);
      migrated++;
    } else {
      console.log(`❌ Error updating ${project.slug}:`, error.message);
    }
  }

  console.log(`\n📊 Migrated: ${migrated}/${projectsToUpdate.length}`);
}

importMissingProjects().catch(console.error);
