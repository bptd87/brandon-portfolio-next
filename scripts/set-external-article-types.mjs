import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const isReview = (item) => {
  const text = `${item?.title || ''} ${item?.source || ''}`.toLowerCase();
  return /review|critic|interview|feature|warm and funny|relevant take/.test(text);
};

const { data: projects, error } = await supabase
  .from('projects')
  .select('id,slug,external_articles')
  .eq('discipline', 'scenic_design')
  .neq('status', 'archived');

if (error) {
  console.error(error);
  process.exit(1);
}

let updated = 0;
for (const p of projects || []) {
  const existing = Array.isArray(p.external_articles) ? p.external_articles : [];
  if (existing.length === 0) continue;

  const next = existing.map((item) => ({
    ...item,
    type: isReview(item) ? 'review' : 'listing',
  }));

  if (JSON.stringify(existing) === JSON.stringify(next)) continue;

  const { error: upErr } = await supabase
    .from('projects')
    .update({ external_articles: next })
    .eq('id', p.id);

  if (upErr) {
    console.error(`Failed ${p.slug}:`, upErr.message);
    continue;
  }

  updated += 1;
  console.log(`Updated types: ${p.slug}`);
}

console.log(`Done. Updated ${updated} projects.`);
