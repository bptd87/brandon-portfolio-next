import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const { data, error } = await s.from('news').select('id,title,location,date,published_at,created_at,external_link,blocks');
if (error) {
  console.error(error);
  process.exit(1);
}

const parse = (v) =>
  Array.isArray(v)
    ? v
    : typeof v === 'string'
      ? (() => {
          try {
            return JSON.parse(v);
          } catch {
            return [];
          }
        })()
      : [];

const fmt = (d) => {
  const x = new Date(d);
  return Number.isNaN(x.getTime())
    ? null
    : x.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

let updated = 0;
for (const row of data || []) {
  const blocks = parse(row.blocks);
  const hasList = blocks.some((b) => String(b?.type || '').toLowerCase() === 'list');
  if (hasList) continue;

  const details = [];
  const pd = fmt(row.date || row.published_at || row.created_at);
  if (pd) details.push(`Published: ${pd}`);
  if (row.location) details.push(`Location: ${row.location}`);
  if (row.external_link) details.push('Source: External reference linked below');
  if (details.length < 2) details.push('Discipline: Scenic Design');

  const next = [
    ...blocks,
    { type: 'heading', level: 3, content: 'Key Details' },
    { type: 'list', ordered: false, items: details },
  ];

  const { error: uerr } = await s.from('news').update({ blocks: next }).eq('id', row.id);
  if (uerr) {
    console.error('fail', row.id, uerr);
    process.exit(1);
  }

  updated += 1;
}

console.log(JSON.stringify({ updated }, null, 2));
