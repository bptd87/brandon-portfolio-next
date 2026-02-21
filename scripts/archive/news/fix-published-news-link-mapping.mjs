import 'dotenv/config';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const csvPath = '/Users/brandonptdavis/Downloads/Brandon_PT_Davis_External_Press_Links.csv';

const curated = {
  30009: [
    'https://www.dglobe.com/news/okoboji-summer-theatre-to-bring-deathtrap-to-the-stage',
  ],
  30013: [
    'https://www.dglobe.com/news/local/okoboji-summer-theatre-selling-vouchers-for-2025-season',
  ],
  30017: [
    'https://www.spencerdailyreporter.com/articles/opinions-spencerreporter-2/performance-review-freaky-mother-daughter-duo-at-ost/',
  ],
  30016: [
    'https://sloreview.org/2025/02/15/guys-on-ice-is-warm-and-funny/',
  ],
  30014: [
    'https://sloreview.org/2025/04/09/shut-up-sherlock-deserves-a-standing-ovation/',
  ],
  30005: [
    'https://www.scr.org/plays/productions/25-26-season/million-dollar-quartet/',
    'https://www.scr.org/scr-blog/posts/meet-the-creative-team-of-million-dollar-quartet/',
    'https://theorangecurtainrev.com/million-dollar-quartet-south-coast-repertory-review/',
    'https://stageraw.com/million-dollar-quartet-2/',
  ],
  30029: [
    'https://stagescenela.com/2019/06/the-pajama-game-3/',
    'https://www.arts.uci.edu/in-the-news/review-pajama-game',
    'https://drama.arts.uci.edu/news/review-pajama-game-%E2%80%93-claire-trevor-theatre-uci',
    'https://newuniversity.org/2019/06/07/uci-drama-gets-into-the-pajama-game/',
  ],
  30028: [
    'https://stagescenela.com/2019/11/company-7/',
  ],
  30031: [
    'https://www.theshowreport.org/post/review-american-idiot-uc-irvine',
  ],
  150001: [
    'https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/',
  ],
};

function parseCsv(content) {
  const rows = [];
  let i = 0; let field = ''; let row = []; let inQuotes = false;
  while (i < content.length) {
    const ch = content[i]; const next = content[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { field += '"'; i += 2; continue; }
      inQuotes = !inQuotes; i += 1; continue;
    }
    if (!inQuotes && ch === ',') { row.push(field); field = ''; i += 1; continue; }
    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      if (ch === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((v) => String(v).trim() !== '')) rows.push(row);
      row = []; field = ''; i += 1; continue;
    }
    field += ch; i += 1;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((v) => String(v).trim() !== '')) rows.push(row);
  }
  const [header, ...body] = rows;
  const keys = header.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, idx) => [k, (r[idx] || '').trim()])));
}

function typeFor(row) {
  const t = `${row.Notes || ''} ${row.Publication || ''} ${row['Article Title'] || ''}`.toLowerCase();
  if (t.includes('review')) return 'review';
  if (t.includes('official production listing') || t.includes('tickets')) return 'tickets';
  if (t.includes('interview') || t.includes('feature') || t.includes('profile')) return 'press';
  return 'source';
}

const csvRows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const rowByUrl = new Map(csvRows.map((r) => [r.URL, r]));

const allPublishedIds = Object.keys(curated).map((x) => Number(x));

const { error: delErr } = await s.from('news_related_links').delete().in('news_id', allPublishedIds);
if (delErr) {
  console.error(delErr);
  process.exit(1);
}

let inserted = 0;
for (const [idStr, urls] of Object.entries(curated)) {
  const newsId = Number(idStr);
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const row = rowByUrl.get(url);
    const label = row
      ? `${row.Publication}: ${row['Article Title']}`.slice(0, 120)
      : 'External Source';
    const linkType = row ? typeFor(row) : 'source';

    const { error: insErr } = await s.from('news_related_links').insert({
      news_id: newsId,
      label,
      url,
      link_type: linkType,
      sort_order: i,
    });

    if (insErr) {
      console.error('insert failed', newsId, url, insErr);
      process.exit(1);
    }
    inserted += 1;
  }
}

console.log(JSON.stringify({ newsItemsUpdated: allPublishedIds.length, inserted }, null, 2));
