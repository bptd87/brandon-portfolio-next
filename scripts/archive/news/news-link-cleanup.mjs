import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function parseBlocks(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const p = JSON.parse(value);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeUrl(value) {
  const v = String(value || '').trim();
  if (!v) return '';
  try {
    const u = new URL(v);
    return `${u.origin}${u.pathname}`.replace(/\/+$/, '').toLowerCase();
  } catch {
    return v.replace(/\/+$/, '').toLowerCase();
  }
}

function labelForUrl(url) {
  const v = String(url || '').trim();
  if (!v) return 'Read Source';
  try {
    const host = new URL(v).hostname.replace(/^www\./, '');
    return `Read on ${host}`;
  } catch {
    return 'Read Source';
  }
}

const { data: rows, error } = await supabase
  .from('news')
  .select('id,title,blocks,external_link')
  .order('date', { ascending: false });

if (error) {
  console.error(error);
  process.exit(1);
}

const changes = [];

for (const row of rows || []) {
  const blocks = parseBlocks(row.blocks);
  const externalNorm = normalizeUrl(row.external_link);

  const seen = new Set();
  const next = [];
  let touched = false;

  for (const block of blocks) {
    if (!block || typeof block !== 'object' || String(block.type).toLowerCase() !== 'link') {
      next.push(block);
      continue;
    }

    const url = String(block.url || '').trim();
    const normalized = normalizeUrl(url);

    if (!url) {
      touched = true;
      continue;
    }

    if (normalized && seen.has(normalized)) {
      touched = true;
      continue;
    }

    if (normalized && externalNorm && normalized === externalNorm) {
      // keep only one source of truth for primary external CTA
      touched = true;
      continue;
    }

    const currentLabel = String(block.label || '').trim();
    const nextLabel = currentLabel || labelForUrl(url);
    if (nextLabel !== currentLabel) touched = true;

    seen.add(normalized || url);
    next.push({ ...block, label: nextLabel, url });
  }

  if (touched) {
    changes.push({ id: row.id, title: row.title, before: blocks.length, after: next.length, blocks: next });
  }
}

for (const c of changes) {
  const { error: uerr } = await supabase.from('news').update({ blocks: c.blocks }).eq('id', c.id);
  if (uerr) {
    console.error('update failed', c.id, uerr);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  changed: changes.length,
  sample: changes.slice(0, 25).map((c) => ({ id: c.id, title: c.title, before: c.before, after: c.after })),
}, null, 2));
