import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  {
    id: 30023,
    title: 'Stephens College Update: Spring 2022 Design & Teaching',
    subtitle: 'Semester recap and spring production plans at Stephens College',
    excerpt:
      'A semester update from Stephens College: teaching momentum, student collaboration, and spring scenic design work on Mamma Mia!.',
    seo_title: 'Stephens College Spring 2022 Scenic Design Update | Brandon PT Davis',
    seo_description:
      'Brandon PT Davis shares a Stephens College update, including spring 2022 scenic design plans for Mamma Mia! and ongoing teaching work.',
    blocks: [
      { type: 'heading', level: 2, content: 'Semester One at Stephens College' },
      {
        type: 'text',
        content:
          'My first semester at Stephens College moved quickly and set a strong foundation for the work ahead. The term balanced studio teaching, design mentoring, and collaboration with students eager to build practical production skills.',
      },
      { type: 'heading', level: 3, content: 'Spring 2022: Mamma Mia!' },
      {
        type: 'text',
        content:
          'This spring I will design Mamma Mia! for the main stage. The production calls for a bright, energetic visual language that supports musical storytelling while remaining buildable and efficient for the shop and crew.',
      },
      {
        type: 'text',
        content:
          'In parallel, I am continuing classroom work focused on process, drafting clarity, and communication. The goal is to help emerging designers translate ideas into work that serves directors, performers, and production teams.',
      },
    ],
  },
  {
    id: 30025,
    title: 'Scenic Design Spotlight: Lysistrata at UTEP (Spring 2021)',
    subtitle: 'Designing UTEP’s return to in-person performance after shutdown',
    excerpt:
      'A look at scenic design for Lysistrata at UTEP, created under post-shutdown safety protocols and focused on clear storytelling in a constrained production environment.',
    seo_title: 'Lysistrata at UTEP Scenic Design Process | Brandon PT Davis',
    seo_description:
      'Brandon PT Davis shares scenic design notes for UTEP’s Lysistrata, including safety-aware process decisions and production strategy during in-person return.',
    blocks: [
      { type: 'heading', level: 2, content: 'Designing Lysistrata at UTEP' },
      {
        type: 'text',
        content:
          'I designed Lysistrata at UTEP for the department’s first in-person production after the COVID shutdown. The project required clear visual storytelling while adapting every phase of process to new production constraints.',
      },
      { type: 'heading', level: 3, content: 'Process Under Safety Protocols' },
      {
        type: 'text',
        content:
          'Planning and execution were shaped by updated hygiene and rehearsal protocols. The scenic approach prioritized flexibility, practical traffic flow, and durable choices that could hold up under evolving schedules and requirements.',
      },
      {
        type: 'quote',
        text: 'In that moment, scenic design was not only aesthetic; it was operational and collaborative.',
      },
      {
        type: 'text',
        content:
          'The production reinforced a core principle in my practice: good design must be resilient. Strong concepts are important, but they only succeed when the workflow can support the people making the show.',
      },
    ],
  },
  {
    id: 30027,
    title: 'Career Update: Assistant Professor of Scenic Design & Technology at UTEP',
    subtitle: 'Transitioning into higher-ed leadership during a remote-to-in-person period',
    excerpt:
      'Announcement of a new role at UTEP as Assistant Professor of Scenic Design & Technology, including teaching focus and upcoming production design work.',
    seo_title: 'Assistant Professor of Scenic Design at UTEP | Brandon PT Davis',
    seo_description:
      'Career update from Brandon PT Davis on joining UTEP as Assistant Professor of Scenic Design & Technology, with teaching and production priorities.',
    blocks: [
      { type: 'heading', level: 2, content: 'New Role at UTEP' },
      {
        type: 'text',
        content:
          'I joined the University of Texas at El Paso as Assistant Professor of Scenic Design & Technology during a period when instruction and production workflows were rapidly shifting. The position combines classroom teaching, design mentorship, and production collaboration.',
      },
      { type: 'heading', level: 3, content: 'Teaching Focus' },
      {
        type: 'list',
        ordered: false,
        items: [
          'THEA 2301: Principles of Scenery',
          'THEA 2304: Theatre Graphics & Technology',
          'THEA 3321: Advanced Technical Solutions',
        ],
      },
      { type: 'heading', level: 3, content: 'Production Work and Direction' },
      {
        type: 'text',
        content:
          'Alongside teaching, I prepared scenic design work for Lysistrata as the department planned its return to in-person performance. The priority was building a process that was disciplined, adaptable, and grounded in craft.',
      },
      {
        type: 'text',
        content:
          'This chapter strengthened my long-term approach: combine rigorous design standards with practical production leadership, and train artists to communicate clearly across the full design-to-build pipeline.',
      },
    ],
  },
];

for (const item of updates) {
  const { id, ...payload } = item;
  const { error } = await supabase.from('news').update(payload).eq('id', id);
  if (error) {
    console.error(`Failed updating ${id}:`, error);
    process.exit(1);
  }
}

console.log(JSON.stringify({ updated: updates.map((u) => ({ id: u.id, title: u.title })) }, null, 2));
