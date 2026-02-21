import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

function parseBlocks(content) {
  if (!content) return [];
  if (Array.isArray(content)) return content;
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

async function ensureLeadImage(id) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id,slug,title,cover_image,content')
    .eq('id', id)
    .single();

  if (error || !article) throw new Error(`fetch ${id}: ${error?.message || 'not found'}`);
  const blocks = parseBlocks(article.content);
  const hasVisual = blocks.some((b) => b?.type === 'image' || b?.type === 'gallery');

  if (!hasVisual && article.cover_image) {
    const imageBlock = {
      type: 'image',
      url: article.cover_image,
      alt: `Scenic design production image for ${article.title}`,
      caption: `Production image from ${article.title}`,
    };
    blocks.splice(Math.min(2, blocks.length), 0, imageBlock);

    const { error: upErr } = await supabase
      .from('articles')
      .update({ content: JSON.stringify(blocks) })
      .eq('id', id);

    if (upErr) throw new Error(`update ${id}: ${upErr.message}`);
    console.log(`Inserted lead image block: ${id} ${article.slug}`);
  }
}

await ensureLeadImage(60128);
await ensureLeadImage(60137);

const metadataUpdates = [
  {
    id: 60136,
    excerpt: 'How Hollywood musicals of the 1930s–1950s fused design, choreography, and narrative into a cinematic language that still shapes scenic storytelling today.',
  },
  {
    id: 60137,
    excerpt: 'A closer look at the Golden Age of Broadway and the scenic design principles that helped define musical theatre\'s most influential era.',
  },
  {
    id: 60140,
    seo_description: 'A practical look at 2025 regional theatre trends showing how minimalist scenic design improves flexibility, storytelling clarity, and production efficiency.',
  },
  {
    id: 60142,
    seo_title: 'Scenic Design Growth: Critique, Revision, and Professional Standards',
  },
];

for (const item of metadataUpdates) {
  const { id, ...payload } = item;
  const { error } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id);

  if (error) {
    throw new Error(`metadata update ${id}: ${error.message}`);
  }
  console.log(`Updated metadata: ${id}`);
}

console.log('Batch 2 complete');
