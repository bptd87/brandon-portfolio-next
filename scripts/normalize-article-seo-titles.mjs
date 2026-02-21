import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const BRAND = ' | Brandon PT Davis';
const MAX = 65;
const MIN = 35;

function clean(s) {
  return String(s || '').replace(/\s+/g, ' ').trim();
}

function truncateAtWord(text, maxLen) {
  const source = clean(text);
  if (source.length <= maxLen) return source;
  const slice = source.slice(0, maxLen + 1);
  const idx = slice.lastIndexOf(' ');
  const cut = idx > 20 ? slice.slice(0, idx) : source.slice(0, maxLen);
  return cut.replace(/[\s:|,-]+$/, '').trim();
}

function buildSeoTitle(title) {
  const base = clean(title)
    .replace(/\s*\|\s*Brandon\s*PT\s*Davis/i, '')
    .replace(/\s*\|\s*Brandon\s*PT/i, '')
    .trim();

  const room = MAX - BRAND.length;
  const trimmed = truncateAtWord(base, room);
  const result = `${trimmed}${BRAND}`;
  if (result.length < MIN) {
    const fallback = truncateAtWord(base, MAX);
    return fallback.length >= MIN ? fallback : `${base} Brandon PT Davis`.slice(0, MAX);
  }
  return result;
}

const { data, error } = await supabase
  .from('articles')
  .select('id,slug,title,seo_title,status')
  .eq('status', 'published')
  .order('id');

if (error) {
  console.error(error.message);
  process.exit(1);
}

const candidates = (data || []).filter((row) => {
  const len = clean(row.seo_title).length;
  return len < MIN || len > MAX;
});

let updated = 0;
for (const row of candidates) {
  const nextTitle = buildSeoTitle(row.title);
  const { error: upErr } = await supabase
    .from('articles')
    .update({ seo_title: nextTitle })
    .eq('id', row.id);

  if (upErr) {
    console.error(`Failed ${row.id} ${row.slug}: ${upErr.message}`);
    process.exitCode = 1;
    continue;
  }

  updated += 1;
  console.log(`Updated ${row.id} ${row.slug} -> ${nextTitle}`);
}

console.log(`Done. Updated ${updated} article SEO titles.`);
