import 'dotenv/config';
import fs from 'fs';
import path from 'path';
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

function slugify(v) {
  return String(v || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

function normalize(v) {
  return String(v || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function linkTypeFor(row) {
  const text = `${row.Notes || ''} ${row.Publication || ''} ${row['Article Title'] || ''}`.toLowerCase();
  if (text.includes('review')) return 'review';
  if (text.includes('official production listing') || text.includes('tickets')) return 'tickets';
  if (text.includes('interview') || text.includes('feature') || text.includes('profile')) return 'press';
  return 'source';
}

function matchNewsId(row, newsList) {
  const t = normalize(row['Article Title']);
  const p = normalize(row.Publication);

  const patterns = [
    { test: () => t.includes('deathtrap'), slug: 'deathtrap-opening-ost' },
    { test: () => t.includes('freaky'), slug: 'freaky-friday-review' },
    { test: () => t.includes('guys on ice'), slug: 'guys-on-ice-slo-review' },
    { test: () => t.includes('sherlock'), slug: 'shut-up-sherlock-praised' },
    { test: () => t.includes('million dollar quartet') && (p.includes('orange') || p.includes('stage raw')), slug: 'orange-curtain-review-million-dollar-quartet' },
    { test: () => t.includes('million dollar quartet'), slug: 'making-my-scr-debut-million-dollar-quartet' },
    { test: () => t.includes('pajama game'), slug: 'the-pajama-game-stagescenela' },
    { test: () => t === 'company' || t.includes(' company '), slug: 'company-review' },
    { test: () => t.includes('american idiot'), slug: 'american-idiot-review' },
    { test: () => t.includes('voyagela') || p.includes('voyagela'), slug: 'featured-in-voyagela-rising-stars-interview' },
    { test: () => t.includes('forum'), slug: 'forum-review' },
    { test: () => t.includes('okoboji') && t.includes('season') && t.includes('2024'), slug: 'okoboji-2024-season-announced' },
    { test: () => t.includes('okoboji') && t.includes('season') && t.includes('2025'), slug: 'okoboji-summer-theatre-2025-season' },
  ];

  for (const rule of patterns) {
    if (!rule.test()) continue;
    const match = newsList.find((n) => n.slug === rule.slug);
    if (match) return match.id;
  }

  // fallback: token overlap
  const tokens = new Set(t.split(' ').filter((x) => x.length > 3));
  let best = null;
  for (const n of newsList) {
    const nt = normalize(n.title);
    let score = 0;
    for (const tok of tokens) {
      if (nt.includes(tok)) score += 1;
    }
    if (score >= 3 && (!best || score > best.score)) best = { id: n.id, score };
  }
  return best?.id || null;
}

function buildDraft(row) {
  const title = row['Article Title'];
  const publication = row.Publication;
  const date = row.Date ? new Date(row.Date) : new Date();
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const linkType = linkTypeFor(row);

  const draftTitle = `Press Coverage: ${title}`;
  const excerpt = `${month} ${year} — ${publication} published coverage related to Brandon PT Davis's scenic design work: ${title}.`;

  const blocks = [
    { type: 'heading', level: 2, content: 'Coverage Summary' },
    { type: 'text', content: `${publication} published "${title}". This source is archived as part of the public press record for scenic design and production history.` },
    { type: 'heading', level: 3, content: 'Key Details' },
    { type: 'list', ordered: false, items: [
      `Publication: ${publication}`,
      `Date: ${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Type: ${linkType}`,
    ]},
    { type: 'link', label: `Read on ${publication}`, url: row.URL },
  ];

  return {
    title: draftTitle,
    slug: slugify(`${title}-${publication}-${row.Date}`),
    excerpt,
    subtitle: `${publication} coverage archive`,
    date: date.toISOString(),
    status: 'draft',
    featured: false,
    external_link: row.URL,
    blocks,
    seo_title: `${title} | ${publication}`.slice(0, 255),
    seo_description: excerpt,
    layout_variant: 'bulletin',
  };
}

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(csv);

const { data: news, error: nerr } = await supabase
  .from('news')
  .select('id,title,slug,external_link')
  .order('date', { ascending: false });
if (nerr) {
  console.error(nerr);
  process.exit(1);
}

const { data: existingLinks, error: lerr } = await supabase
  .from('news_related_links')
  .select('news_id,url,label');
if (lerr) {
  console.error(lerr);
  process.exit(1);
}

const existingSet = new Set((existingLinks || []).map((l) => `${l.news_id}|${normalize(l.url)}`));
let nextId = Math.max(0, ...(news || []).map((n) => Number(n.id) || 0)) + 1;
const createdDrafts = [];
const attachedLinks = [];
const skipped = [];

for (const row of rows) {
  const url = row.URL;
  if (!url) {
    skipped.push({ row, reason: 'missing_url' });
    continue;
  }

  let newsId = matchNewsId(row, news || []);

  if (newsId) {
    const key = `${newsId}|${normalize(url)}`;
    if (existingSet.has(key)) {
      skipped.push({ title: row['Article Title'], reason: 'already_linked', newsId });
      continue;
    }

    const sameNews = (existingLinks || []).filter((l) => l.news_id === newsId);
    const sortOrder = sameNews.length;
    const label = `${row.Publication}: ${row['Article Title']}`.slice(0, 120);

    const { error: ierr } = await supabase.from('news_related_links').insert({
      news_id: newsId,
      label,
      url,
      link_type: linkTypeFor(row),
      sort_order: sortOrder,
    });

    if (ierr) {
      console.error('insert link failed', row['Article Title'], ierr);
      process.exit(1);
    }

    existingSet.add(key);
    existingLinks.push({ news_id: newsId, url, label });
    attachedLinks.push({ newsId, title: row['Article Title'], publication: row.Publication });
    continue;
  }

  const draft = buildDraft(row);

  // Ensure slug uniqueness
  let slug = draft.slug;
  let counter = 1;
  while ((news || []).some((n) => n.slug === slug)) {
    counter += 1;
    slug = `${draft.slug}-${counter}`;
  }
  draft.slug = slug;

  const payload = { id: nextId, ...draft };
  const { data: created, error: cerr } = await supabase.from('news').insert(payload).select('id,title,slug').single();
  if (cerr) {
    console.error('create draft failed', row['Article Title'], cerr);
    process.exit(1);
  }

  nextId += 1;
  news.push({ id: created.id, title: created.title, slug: created.slug, external_link: draft.external_link });
  createdDrafts.push({ id: created.id, title: created.title, slug: created.slug, source: row.URL });
}

console.log(JSON.stringify({
  csvRows: rows.length,
  attachedLinks: attachedLinks.length,
  createdDrafts: createdDrafts.length,
  skipped: skipped.length,
  attachedSample: attachedLinks.slice(0, 25),
  createdSample: createdDrafts.slice(0, 25),
}, null, 2));
