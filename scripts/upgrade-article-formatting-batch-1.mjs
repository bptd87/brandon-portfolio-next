import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const CONFIG = {
  60139: {
    seoTitle: "Opera Scenic Design History: From Baroque to Contemporary Stage",
    faq: [
      { question: 'Why does opera matter in scenic design history?', answer: 'Opera established many of the visual systems still used in stage design, including perspective environments, machine-driven transitions, and large-scale scenic storytelling.' },
      { question: 'How did early opera houses change design practice?', answer: 'Public opera houses increased production volume and audience demand, which pushed designers toward repeatable methods, painted depth, and flexible scenic mechanisms.' },
      { question: 'What can contemporary scenic designers learn from opera?', answer: 'Opera emphasizes composition, sightline control, and emotional scale. Those principles remain useful across theatre, musical staging, and large-format experiential work.' },
      { question: 'Is opera scenic design only about spectacle?', answer: 'No. The strongest opera design supports dramatic clarity and rhythm. Spectacle is most effective when it serves narrative structure and performer focus.' },
      { question: 'How does this history connect to modern production workflows?', answer: 'Current workflows still build on historic practices: collaborative drafting, layered visual systems, and rapid scene logic that balances artistic ambition with technical feasibility.' },
    ],
  },
  60142: {
    seoTitle: 'Scenic Design Growth: Revision, Critique, and Professional Standards',
    faq: [
      { question: 'What is the main lesson from this URTA moment?', answer: 'Critique is most useful when it identifies intention, clarity, and craft. The goal is not personal approval but stronger design decisions and better communication.' },
      { question: 'How should scenic designers respond to blunt feedback?', answer: 'Pause, separate tone from substance, and translate feedback into revision actions. Strong process turns difficult moments into measurable design growth.' },
      { question: 'What does professional revision look like in practice?', answer: 'It means updating drawings, re-prioritizing storytelling goals, and proving changes through clearer visual hierarchy, cleaner drafting, and stronger collaborative language.' },
      { question: 'How does confidence develop in early-career design?', answer: 'Confidence grows through preparation, iteration, and pattern recognition over multiple productions, not from a single review or comment.' },
      { question: 'Why is this lesson still relevant for scenic careers today?', answer: 'Regional and institutional workflows move fast. Designers who can absorb critique, revise quickly, and maintain artistic standards are the most trusted collaborators.' },
    ],
  },
  60145: {
    seoTitle: 'Presenting Scenic Design Ideas: A Practical Guide for Designers',
    faq: [
      { question: 'What makes a scenic design presentation effective?', answer: 'An effective presentation aligns concept, storytelling, and production logistics while making visual choices legible to directors, producers, and technical teams.' },
      { question: 'How much detail should be shown in early concept meetings?', answer: 'Show enough detail to clarify mood, structure, and feasibility without overcommitting before collaboration. Prioritize the decisions that move the process forward.' },
      { question: 'What is the best order for presenting design material?', answer: 'Start with narrative intent, then visual strategy, then execution plan. This sequence keeps artistic goals and production reality connected.' },
      { question: 'How can designers present confidently under pressure?', answer: 'Use clear sectioning, concise language, and prepared alternates. Confidence comes from process clarity, not from overloading the room with information.' },
      { question: 'Why does presentation quality affect production outcomes?', answer: 'Clear presentations improve alignment, reduce revision churn, and accelerate approvals, which protects both artistic integrity and production schedules.' },
    ],
  },
};

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

function cleanQuoteText(text) {
  return String(text || '')
    .replace(/^\s*"+/, '')
    .replace(/"+\s*$/, '')
    .replace(/^\s*[“”]+/, '')
    .replace(/[“”]+\s*$/, '')
    .trim();
}

for (const id of Object.keys(CONFIG).map(Number)) {
  const { data: article, error } = await supabase
    .from('articles')
    .select('id,slug,title,content,cover_image')
    .eq('id', id)
    .single();

  if (error || !article) {
    console.error(`Failed to load ${id}:`, error?.message || 'not found');
    process.exitCode = 1;
    continue;
  }

  let blocks = parseBlocks(article.content);

  blocks = blocks.map((b) => {
    if (b?.type !== 'quote') return b;
    return { ...b, text: cleanQuoteText(b.text || b.content || '') };
  });

  const hasImage = blocks.some((b) => b?.type === 'image' || b?.type === 'gallery');
  if (id === 60142 && !hasImage && article.cover_image) {
    blocks.splice(Math.min(2, blocks.length), 0, {
      type: 'image',
      url: article.cover_image,
      alt: `Production image for ${article.title}`,
      caption: `Production image related to ${article.title}`,
    });
  }

  const hasFaq = blocks.some((b) => b?.type === 'faq' && Array.isArray(b.items) && b.items.length > 0);
  if (!hasFaq) {
    blocks.push({ type: 'heading', level: 2, text: 'Frequently Asked Questions' });
    blocks.push({ type: 'faq', items: CONFIG[id].faq });
  }

  const payload = {
    content: JSON.stringify(blocks),
    seo_title: CONFIG[id].seoTitle,
  };

  const { error: updateError } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id);

  if (updateError) {
    console.error(`Failed update ${id} ${article.slug}:`, updateError.message);
    process.exitCode = 1;
    continue;
  }

  console.log(`Updated ${id} ${article.slug} (blocks=${blocks.length})`);
}
