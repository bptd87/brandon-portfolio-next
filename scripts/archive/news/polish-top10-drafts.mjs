import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  {
    id: 90005,
    title: 'Assistant Scenic Design: Utah Shakespeare Festival 2025 Season',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design support for Utah Shakespeare Festival 2025, including The Importance of Being Earnest, A Gentleman\'s Guide to Love and Murder, and Steel Magnolias.',
    seo_title: 'Assistant Scenic Design | Utah Shakespeare Festival 2025 Season',
    seo_description: 'Brandon PT Davis served as Assistant Scenic Designer to Jo Winiarski for Utah Shakespeare Festival 2025 productions.'
  },
  {
    id: 90007,
    title: 'Assistant Scenic Design: The Book Club Play at Cincinnati Playhouse',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design credit for The Book Club Play at Cincinnati Playhouse in the Park, supporting scenic development, drafting, and design execution.',
    seo_title: 'The Book Club Play at Cincinnati Playhouse | Assistant Scenic Design',
    seo_description: 'Assistant scenic design post for The Book Club Play at Cincinnati Playhouse in the Park.'
  },
  {
    id: 90009,
    title: 'Assistant Scenic Design: Ragtime at The Ruth and Nathan Hale Theater',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design support for Ragtime at The Ruth and Nathan Hale Theater, focused on documentation, drafting, and production-ready scenic communication.',
    seo_title: 'Ragtime at The Ruth and Nathan Hale Theater | Assistant Scenic Design',
    seo_description: 'Assistant scenic design credit for Ragtime at The Ruth and Nathan Hale Theater.'
  },
  {
    id: 90008,
    title: 'Assistant Scenic Design: Souvenir at Pioneer Theatre Company',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design work for Souvenir at Pioneer Theatre Company, supporting scenic drawings, 3D coordination, and design implementation.',
    seo_title: 'Souvenir at Pioneer Theatre Company | Assistant Scenic Design',
    seo_description: 'Assistant scenic design credit for Souvenir at Pioneer Theatre Company.'
  },
  {
    id: 90010,
    title: 'Assistant Scenic Design: Natasha, Pierre & The Great Comet at Pioneer Theatre',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design support for Natasha, Pierre & The Great Comet of 1812 at Pioneer Theatre Company, including drafting and production coordination.',
    seo_title: 'Great Comet at Pioneer Theatre Company | Assistant Scenic Design',
    seo_description: 'Assistant scenic design post for Natasha, Pierre & The Great Comet of 1812 at Pioneer Theatre Company.'
  },
  {
    id: 120001,
    title: 'Assistant Scenic Design: Jersey Boys at Pioneer Theatre Company',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design credit for Jersey Boys at Pioneer Theatre Company, with drafting and 3D model support for a fast-moving, music-driven production.',
    seo_title: 'Jersey Boys at Pioneer Theatre Company | Assistant Scenic Design',
    seo_description: 'Assistant scenic design work for Jersey Boys at Pioneer Theatre Company.'
  },
  {
    id: 120002,
    title: 'Assistant Scenic Design: Native Gardens at Pioneer Theatre Company',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design support for Native Gardens at Pioneer Theatre Company, including detailed drafting and spatial development for two contrasting homes.',
    seo_title: 'Native Gardens at Pioneer Theatre Company | Assistant Scenic Design',
    seo_description: 'Assistant scenic design credit for Native Gardens at Pioneer Theatre Company.'
  },
  {
    id: 120003,
    title: 'Assistant Scenic Design: Bottle Shock! The Musical (World Premiere)',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design credit on the world premiere of Bottle Shock! The Musical at California Center for the Arts, Escondido.',
    seo_title: 'Bottle Shock! The Musical World Premiere | Assistant Scenic Design',
    seo_description: 'Assistant scenic design post for the world premiere of Bottle Shock! The Musical.'
  },
  {
    id: 120005,
    title: 'Assistant Scenic Design: Clue On Stage at Dallas Theater Center',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design work for Clue On Stage at Dallas Theater Center, supporting production drafting, layout coordination, and scenic documentation.',
    seo_title: 'Clue On Stage at Dallas Theater Center | Assistant Scenic Design',
    seo_description: 'Assistant scenic design credit for Clue On Stage at Dallas Theater Center.'
  },
  {
    id: 120004,
    title: 'Assistant Scenic Design: A Distinct Society (World Premiere)',
    subtitle: 'Assistant Scenic Designer to Jo Winiarski',
    excerpt: 'Assistant scenic design support for the world premiere of A Distinct Society at Pioneer Theatre Company, including drafting and 3D model deliverables.',
    seo_title: 'A Distinct Society World Premiere | Assistant Scenic Design',
    seo_description: 'Assistant scenic design credit for A Distinct Society at Pioneer Theatre Company.'
  }
];

for (const item of updates) {
  const { id, ...payload } = item;
  const { error } = await s.from('news').update(payload).eq('id', id);
  if (error) {
    console.error('Failed', id, error);
    process.exit(1);
  }
}

console.log(JSON.stringify({ updated: updates.length, ids: updates.map((u) => u.id) }, null, 2));
