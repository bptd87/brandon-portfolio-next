import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function normalizeText(value = '') {
  return String(value).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseBlocks(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function isImportGarbage(text) {
  const t = normalizeText(text);
  if (!t) return true;
  if (/\b\d{4}\s[A-Z][a-z]{2}\s\d{1,2},\s\d{4}\b/.test(t)) return true;
  if (/\b(Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul)\s\d{1,2},\s\d{4}\b.*\b(Aug|Sep|Oct|Nov|Dec|Jan|Feb|Mar|Apr|May|Jun|Jul)\s\d{1,2},\s\d{4}\b/i.test(t)) return true;
  if (/making my scr debut|open story|read\s+→|featured update/i.test(t) && t.length > 120) return true;
  return false;
}

function toTextBlock(block) {
  const content = normalizeText(block?.content || block?.text || block?.title || block?.note || '');
  return { type: 'text', content };
}

function normalizeBlockTypes(blocks) {
  const out = [];
  for (const raw of blocks) {
    if (!raw || typeof raw !== 'object') continue;
    const type = String(raw.type || '').toLowerCase();

    if (type === 'paragraph') {
      const b = toTextBlock(raw);
      if (b.content && !isImportGarbage(b.content)) out.push(b);
      continue;
    }

    if (type === 'header') {
      const content = normalizeText(raw.content || raw.text || '');
      if (content) out.push({ type: 'heading', level: Number(raw.level || 2), content });
      continue;
    }

    if (type === 'text') {
      const b = toTextBlock(raw);
      if (b.content && !isImportGarbage(b.content)) out.push(b);
      continue;
    }

    if (type === 'heading') {
      const content = normalizeText(raw.content || raw.text || '');
      if (content) out.push({ type: 'heading', level: Number(raw.level || 2), content });
      continue;
    }

    if (type === 'list' && Array.isArray(raw.items)) {
      const items = raw.items.map((i) => normalizeText(typeof i === 'string' ? i : i?.label || i?.value || '')).filter(Boolean);
      if (items.length) out.push({ type: 'list', ordered: !!raw.ordered, items });
      continue;
    }

    if (type === 'update_note') {
      const text = normalizeText(raw.text || raw.content || raw.note || '');
      if (text && !isImportGarbage(text)) out.push({ type: 'update_note', text });
      continue;
    }

    if (type === 'link') {
      const url = normalizeText(raw.url || '');
      if (url) out.push({ type: 'link', url, label: normalizeText(raw.label || 'Read Source') || 'Read Source' });
      continue;
    }

    // Keep other block types if they are likely valid.
    if (['image', 'gallery', 'quote', 'video', 'faq', 'accordion', 'creative_team', 'team', 'details', 'html'].includes(type)) {
      out.push(raw);
    }
  }
  return out;
}

function dedupeTextBlocks(blocks) {
  const seen = new Set();
  const next = [];
  let removed = 0;

  for (const b of blocks) {
    const t = b.type;
    if (t === 'text' || t === 'heading' || t === 'update_note') {
      const key = `${t}:${normalizeText(b.content || b.text || '').toLowerCase()}`;
      if (key.endsWith(':')) {
        removed += 1;
        continue;
      }
      if ((normalizeText(b.content || b.text || '').length > 60) && seen.has(key)) {
        removed += 1;
        continue;
      }
      seen.add(key);
    }
    next.push(b);
  }

  return { blocks: next, removed };
}

function hasType(blocks, type) {
  return blocks.some((b) => String(b.type).toLowerCase() === type);
}

function makeKeyDetails(item) {
  const details = [];
  const d = formatDate(item.date || item.published_at || item.created_at);
  if (d) details.push(`Published: ${d}`);
  if (item.location) details.push(`Location: ${item.location}`);

  const lowerTitle = String(item.title || '').toLowerCase();
  if (lowerTitle.includes('assistant scenic')) details.push('Role: Assistant Scenic Designer');
  else if (lowerTitle.includes('assistant professor')) details.push('Role: Assistant Professor of Scenic Design');
  else if (lowerTitle.includes('scenic design')) details.push('Role: Scenic Designer');

  if (item.external_link) details.push('Source: External reference available below');
  return details;
}

const { data: rows, error } = await supabase
  .from('news')
  .select('id,title,status,blocks,date,published_at,created_at,location,external_link')
  .order('date', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

const changes = [];
for (const row of rows || []) {
  const parsed = parseBlocks(row.blocks);
  let blocks = normalizeBlockTypes(parsed);

  const beforeLen = blocks.length;
  const dedupe = dedupeTextBlocks(blocks);
  blocks = dedupe.blocks;

  if (!hasType(blocks, 'heading')) {
    blocks.unshift({ type: 'heading', level: 2, content: 'Overview' });
  }

  if (!hasType(blocks, 'update_note')) {
    const d = formatDate(row.date || row.published_at || row.created_at);
    if (d) blocks.unshift({ type: 'update_note', text: `Updated ${d}` });
  }

  if (!hasType(blocks, 'list')) {
    const details = makeKeyDetails(row);
    if (details.length >= 2) {
      blocks.push({ type: 'heading', level: 3, content: 'Key Details' });
      blocks.push({ type: 'list', ordered: false, items: details });
    }
  }

  if (row.external_link && !hasType(blocks, 'link')) {
    const isReview = /review|praised|featured/i.test(String(row.title || ''));
    blocks.push({ type: 'link', label: isReview ? 'Read Full Review' : 'Read Source', url: row.external_link });
  }

  const changed = JSON.stringify(parsed) !== JSON.stringify(blocks);
  if (changed) {
    changes.push({
      id: row.id,
      title: row.title,
      status: row.status,
      before: parsed.length,
      normalizedInput: beforeLen,
      after: blocks.length,
      removedDuplicateTextBlocks: dedupe.removed,
      blocks,
    });
  }
}

for (const c of changes) {
  const { error: updateError } = await supabase.from('news').update({ blocks: c.blocks }).eq('id', c.id);
  if (updateError) {
    console.error('Update failed', c.id, updateError);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  total: rows.length,
  changed: changes.length,
  sample: changes.slice(0, 20).map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    before: c.before,
    after: c.after,
    removedDuplicateTextBlocks: c.removedDuplicateTextBlocks,
  })),
}, null, 2));
