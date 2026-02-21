import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const csvPath = '/Users/brandonptdavis/Downloads/Brandon_PT_Davis_External_Press_Links.csv';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function parseCsv(content) {
  const rows = [];
  let i = 0;
  let field = '';
  let row = [];
  let inQuotes = false;

  while (i < content.length) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i += 1;
      continue;
    }

    if (!inQuotes && ch === ',') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((v) => String(v).trim() !== '')) rows.push(row);
      row = [];
      field = '';
      i += 1;
      continue;
    }

    field += ch;
    i += 1;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((v) => String(v).trim() !== '')) rows.push(row);
  }

  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim());
  return body.map((r) => {
    const obj = {};
    keys.forEach((k, idx) => {
      obj[k] = (r[idx] || '').trim();
    });
    return obj;
  });
}

function normalize(v) {
  return String(v || '').replace(/\s+/g, ' ').trim();
}

function phraseForNotes(notes = '') {
  const n = notes.toLowerCase();
  if (n.includes('review')) return 'critical response and review coverage';
  if (n.includes('announcement')) return 'production announcement coverage';
  if (n.includes('season')) return 'season and programming coverage';
  if (n.includes('feature')) return 'feature coverage';
  if (n.includes('interview')) return 'interview coverage';
  return 'press coverage';
}

const csvRows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const byUrl = new Map(csvRows.map((r) => [r.URL, r]));

const { data: drafts, error } = await supabase
  .from('news')
  .select('id,title,slug,status,external_link,date')
  .eq('status', 'draft')
  .not('external_link', 'is', null)
  .order('date', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

const updates = [];
for (const d of drafts || []) {
  const row = byUrl.get(d.external_link);
  if (!row) continue;

  const dt = new Date(row.Date || d.date || new Date());
  const monthYear = dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  const dayDate = dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const publication = normalize(row.Publication);
  const articleTitle = normalize(row['Article Title']);
  const notes = normalize(row.Notes);

  const title = `${articleTitle} | ${publication}`.slice(0, 255);
  const subtitle = notes || `${publication} coverage archive`;
  const excerpt = `${monthYear} — ${publication} published ${phraseForNotes(notes)} tied to Brandon PT Davis's scenic design work: ${articleTitle}.`;

  const blocks = [
    { type: 'heading', level: 2, content: 'Coverage Snapshot' },
    {
      type: 'text',
      content: `${publication} published \"${articleTitle}\" on ${dayDate}. This item is archived to document external press and public reference points connected to Brandon PT Davis's design career.`,
    },
    { type: 'heading', level: 3, content: 'Why It Matters' },
    {
      type: 'text',
      content: 'Consistent outside coverage helps establish independent credibility, captures production history, and supports long-term search visibility for scenic design work.',
    },
    { type: 'heading', level: 3, content: 'Key Details' },
    {
      type: 'list',
      ordered: false,
      items: [
        `Publication: ${publication}`,
        `Date: ${dayDate}`,
        `Coverage Type: ${notes || 'Press coverage'}`,
      ],
    },
    { type: 'link', label: `Read on ${publication}`, url: row.URL },
  ];

  updates.push({
    id: d.id,
    title,
    subtitle,
    excerpt,
    seo_title: title,
    seo_description: excerpt,
    blocks,
  });
}

for (const u of updates) {
  const { id, ...payload } = u;
  const { error: uerr } = await supabase.from('news').update(payload).eq('id', id);
  if (uerr) {
    console.error('update failed', id, uerr);
    process.exit(1);
  }
}

console.log(JSON.stringify({ updated: updates.length, sample: updates.slice(0, 20).map((u) => ({ id: u.id, title: u.title })) }, null, 2));
