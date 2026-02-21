import 'dotenv/config';
import { JSDOM } from 'jsdom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
const ARTICLE_ID = 60141;

const FAQ_ITEMS = [
  {
    question: 'Why does Urinetown scenic design often feel industrial?',
    answer: 'The design language supports the show\'s satire by using rigid structures, exposed materials, and compressed space to reflect control, scarcity, and social pressure.',
  },
  {
    question: 'How did this production approach class contrast onstage?',
    answer: 'We separated visual worlds through scale, texture, and finish: civic power spaces felt monolithic and imposed, while working-class areas carried layered wear and improvisation.',
  },
  {
    question: 'What visual references shaped the design?',
    answer: 'The palette drew from expressionist cinema, brutalist massing, and industrial futurism to create a city that feels authoritarian, crowded, and emotionally cold.',
  },
  {
    question: 'How was flexibility built into the set?',
    answer: 'Modular architecture and repeatable units allowed rapid transitions, supporting musical rhythm without sacrificing narrative clarity or the production\'s dystopian tone.',
  },
  {
    question: 'What was the central design goal for this staging?',
    answer: 'To create a world that felt uncomfortably familiar, where environment and power structures actively shape the story instead of functioning as passive background.',
  },
];

function t(v) {
  return String(v || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripWrappingQuotes(v) {
  return String(v || '').replace(/^\s*"+/, '').replace(/"+\s*$/, '').trim();
}

function convertHtmlToBlocks(html, title) {
  const dom = new JSDOM(`<div id=\"root\">${html}</div>`);
  const doc = dom.window.document;
  const root = doc.getElementById('root');
  if (!root) return [];

  const blocks = [];

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === dom.window.Node.TEXT_NODE) {
      const text = t(node.textContent);
      if (text) blocks.push({ type: 'paragraph', text });
      continue;
    }

    if (!(node instanceof dom.window.Element)) continue;
    const tag = node.tagName.toLowerCase();

    if (['h2', 'h3', 'h4'].includes(tag)) {
      const text = t(node.textContent);
      if (text) blocks.push({ type: 'heading', level: Number(tag[1]), text });
      continue;
    }

    if (tag === 'p') {
      const text = t(node.textContent);
      if (text) blocks.push({ type: 'paragraph', text });
      continue;
    }

    if (tag === 'blockquote') {
      const text = stripWrappingQuotes(t(node.textContent));
      if (text) blocks.push({ type: 'quote', text });
      continue;
    }

    if (tag === 'ul' || tag === 'ol') {
      const items = Array.from(node.querySelectorAll('li')).map((li) => t(li.textContent)).filter(Boolean);
      if (items.length) {
        blocks.push({
          type: 'list',
          ordered: tag === 'ol',
          listType: tag === 'ol' ? 'numbered' : 'bullet',
          items,
        });
      }
      continue;
    }

    if (tag === 'figure') {
      const images = Array.from(node.querySelectorAll('img'))
        .map((img) => ({
          url: t(img.getAttribute('src')),
          alt: t(img.getAttribute('alt')) || `Production image from ${title}`,
          caption: t(img.getAttribute('alt')) || `Production image from ${title}`,
        }))
        .filter((img) => img.url);
      const figcaption = t(node.querySelector('figcaption')?.textContent);

      if (images.length === 1) {
        blocks.push({
          type: 'image',
          url: images[0].url,
          alt: images[0].alt,
          caption: figcaption || images[0].caption,
        });
      } else if (images.length > 1) {
        blocks.push({
          type: 'gallery',
          images: images.map((img) => ({
            url: img.url,
            alt: img.alt,
            caption: figcaption || img.caption,
          })),
        });
      }
      continue;
    }

    const fallback = t(node.textContent);
    if (fallback) blocks.push({ type: 'paragraph', text: fallback });
  }

  return blocks;
}

function normalizeQuotes(blocks) {
  return blocks.map((b) => {
    if (b.type !== 'quote') return b;
    return { ...b, text: stripWrappingQuotes(b.text || b.content || '') };
  });
}

const { data: article, error: fetchError } = await supabase
  .from('articles')
  .select('id,title,slug,content,seo_title')
  .eq('id', ARTICLE_ID)
  .single();

if (fetchError || !article) {
  console.error('Failed to fetch article:', fetchError?.message || 'not found');
  process.exit(1);
}

let parsed = [];
if (typeof article.content === 'string') {
  try {
    parsed = JSON.parse(article.content);
  } catch {
    parsed = [];
  }
} else if (Array.isArray(article.content)) {
  parsed = article.content;
}

let nextBlocks = parsed;
if (parsed.length === 1 && parsed[0]?.type === 'text' && /<\s*(p|h2|h3|h4|figure|img|ul|ol|li)\b/i.test(parsed[0]?.content || '')) {
  nextBlocks = convertHtmlToBlocks(parsed[0].content, article.title);
}

nextBlocks = normalizeQuotes(nextBlocks);

if (!nextBlocks.some((b) => b.type === 'faq')) {
  nextBlocks.push({ type: 'heading', level: 2, text: 'FAQ: Urinetown Scenic Design' });
  nextBlocks.push({ type: 'faq', items: FAQ_ITEMS });
}

const seoTitle = 'Urinetown Scenic Design: Dystopia, Power, and Class | Brandon PT';

const { error: updateError } = await supabase
  .from('articles')
  .update({ content: JSON.stringify(nextBlocks), seo_title: seoTitle })
  .eq('id', ARTICLE_ID);

if (updateError) {
  console.error('Failed to update article:', updateError.message);
  process.exit(1);
}

console.log(`Updated article ${ARTICLE_ID} (${article.slug})`);
console.log(`Blocks: ${parsed.length} -> ${nextBlocks.length}`);
