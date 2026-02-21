import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const TITLE_OVERRIDES = {
  2: 'Assistant Scenic Design: The Play That Goes Wrong at Seattle Rep',
  4: 'Assistant Scenic Design: Utah Shakespeare Festival (Fifth Season with Jo Winiarski)',
  30022: 'Assistant Scenic Design: The Fears (Off-Broadway, Signature Theatre)',
};

const SUBTITLE_OVERRIDES = {
  2: 'Assistant Scenic Designer to Tom Buderwitz',
  4: 'Assistant Scenic Designer to Jo Winiarski',
  30022: 'Assistant Scenic Designer | Signature Theatre, New York',
};

function normalizeText(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function blockPrimaryText(block) {
  if (!block || typeof block !== 'object') return '';
  if (typeof block.content === 'string' && block.content.trim()) return block.content;
  if (typeof block.text === 'string' && block.text.trim()) return block.text;
  if (typeof block.title === 'string' && block.title.trim()) return block.title;
  if (typeof block.note === 'string' && block.note.trim()) return block.note;
  return '';
}

function isMeaningfulBlock(block) {
  if (!block || typeof block !== 'object') return false;
  if (typeof block.type !== 'string' || !block.type.trim()) return false;

  const direct = blockPrimaryText(block);
  if (direct && normalizeText(direct).length > 0) return true;

  if (Array.isArray(block.items) && block.items.length > 0) return true;
  if (Array.isArray(block.images) && block.images.length > 0) return true;
  if (Array.isArray(block.members) && block.members.length > 0) return true;

  if (typeof block.url === 'string' && block.url.trim()) return true;
  if (typeof block.imageUrl === 'string' && block.imageUrl.trim()) return true;

  return false;
}

function dedupeBlocks(blocks, excerpt = '') {
  if (!Array.isArray(blocks)) return { blocks: [], removed: 0 };

  const excerptNorm = normalizeText(excerpt);
  const seenText = new Set();
  const next = [];
  let removed = 0;

  for (const block of blocks) {
    if (!isMeaningfulBlock(block)) {
      removed += 1;
      continue;
    }

    const type = (block.type || '').toLowerCase();
    const text = blockPrimaryText(block);
    const textNorm = normalizeText(text);

    if ((type === 'text' || type === 'paragraph' || type === 'heading' || type === 'header') && textNorm) {
      if (textNorm.length > 40 && seenText.has(textNorm)) {
        removed += 1;
        continue;
      }

      // Prevent common import issue where excerpt is repeated verbatim in body multiple times
      if (excerptNorm && textNorm.length > 60 && textNorm === excerptNorm && seenText.has(textNorm)) {
        removed += 1;
        continue;
      }

      seenText.add(textNorm);
    }

    next.push(block);
  }

  return { blocks: next, removed };
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

const { data: newsItems, error } = await supabase
  .from('news')
  .select('id,title,subtitle,excerpt,blocks,status,seo_title')
  .eq('status', 'published')
  .order('date', { ascending: false });

if (error) {
  console.error('Failed to load news:', error);
  process.exit(1);
}

const updates = [];

for (const item of newsItems || []) {
  const originalBlocks = parseBlocks(item.blocks);
  const { blocks: dedupedBlocks, removed } = dedupeBlocks(originalBlocks, item.excerpt || '');

  const update = {};
  if (removed > 0) {
    update.blocks = dedupedBlocks;
  }

  if (TITLE_OVERRIDES[item.id] && item.title !== TITLE_OVERRIDES[item.id]) {
    update.title = TITLE_OVERRIDES[item.id];
  }

  if (SUBTITLE_OVERRIDES[item.id] && item.subtitle !== SUBTITLE_OVERRIDES[item.id]) {
    update.subtitle = SUBTITLE_OVERRIDES[item.id];
  }

  if (Object.keys(update).length > 0) {
    if (!item.seo_title || !item.seo_title.trim()) {
      update.seo_title = update.title || item.title;
    }

    updates.push({
      id: item.id,
      removed,
      titleBefore: item.title,
      titleAfter: update.title || item.title,
      ...update,
    });
  }
}

if (updates.length === 0) {
  console.log(JSON.stringify({ updated: 0, message: 'No changes required' }, null, 2));
  process.exit(0);
}

for (const u of updates) {
  const payload = { ...u };
  delete payload.id;
  delete payload.removed;
  delete payload.titleBefore;
  delete payload.titleAfter;

  const { error: updateError } = await supabase
    .from('news')
    .update(payload)
    .eq('id', u.id);

  if (updateError) {
    console.error(`Failed updating news ${u.id}:`, updateError);
    process.exit(1);
  }
}

console.log(JSON.stringify({
  updated: updates.length,
  summary: updates.map((u) => ({
    id: u.id,
    titleBefore: u.titleBefore,
    titleAfter: u.titleAfter,
    removedDuplicateBlocks: u.removed,
  })),
}, null, 2));
