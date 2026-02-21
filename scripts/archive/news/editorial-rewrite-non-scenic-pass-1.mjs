import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const REWRITES = {
  31: {
    excerpt: 'A practical Vectorworks workflow for creating clean, reusable trim profiles with the Polyline tool for scenic drafting and production packages.',
    seo_description: 'Step-by-step Vectorworks guidance for building trim profiles with the Polyline tool, including cleanup standards, reusable symbols, and production-ready drafting habits.',
    lead: 'Trim profiles are small details that can slow an entire drafting set if they are built inconsistently. This workflow focuses on clean geometry and repeatable construction so profiles remain easy to revise and reuse across a full scenic package.'
  },
  60132: {
    excerpt: 'A design-history survey tracing themed entertainment from early spectacle gardens to contemporary immersive environments and experience-led storytelling.',
    seo_description: 'Explore the evolution of themed entertainment from historical public spectacles to modern immersive design systems shaped by technology, narrative, and audience behavior.',
    lead: 'Themed entertainment has always been about environment as narrative. From formal gardens and exposition architecture to today\'s immersive attractions, each era reveals how designers choreograph space, expectation, and audience movement.'
  },
  60138: {
    excerpt: 'How art direction builds coherent visual worlds in film and television through concept alignment, team coordination, and material execution.',
    seo_description: 'A practical guide to art direction in film and television covering visual development, cross-department collaboration, and on-set implementation workflows.',
    lead: 'Art direction is where visual intent becomes operational. It connects concept art, production design, and technical execution so every set, prop, and surface contributes to a coherent world on camera.'
  },
  60144: {
    excerpt: 'A practical hardware guide for theatre and design professionals covering CPU, GPU, RAM, storage, and workstation planning for production workflows.',
    seo_description: 'Understand the hardware decisions that affect design speed and reliability, from processor and graphics performance to memory, storage strategy, and workstation longevity.',
    lead: 'Hardware choices directly affect how quickly designers can draft, model, render, and revise under deadline. This guide translates technical specs into production-centered decisions for theatre and design workflows.'
  },
  60146: {
    excerpt: 'A lighting-reference guide to AI image prompting, showing how lighting language shifts mood, depth, and narrative emphasis across generated scenes.',
    seo_description: 'Learn how lighting styles in AI tools influence atmosphere, composition, and storytelling clarity, with prompt strategies designers can adapt to production ideation.',
    lead: 'Lighting vocabulary is one of the fastest ways to change emotional tone in AI-generated imagery. The value of this guide is not novelty prompts, but clearer control over mood, depth, and narrative emphasis.'
  },
  60148: {
    excerpt: 'Why computer literacy matters in theatre training, with a practical framework for helping production students work confidently across digital tools.',
    seo_description: 'A theatre education guide for building student computer literacy through practical workflows, tool fluency, and production-ready digital habits across design disciplines.',
    lead: 'Computer literacy in theatre education is not about software preference. It is about giving students reliable digital habits so they can collaborate effectively, troubleshoot quickly, and contribute with confidence in production environments.'
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

let touched = 0;
for (const [idStr, rewrite] of Object.entries(REWRITES)) {
  const id = Number(idStr);
  const { data: article, error } = await supabase
    .from('articles')
    .select('id,slug,title,content')
    .eq('id', id)
    .single();

  if (error || !article) {
    console.error(`Failed fetch ${id}: ${error?.message || 'not found'}`);
    continue;
  }

  const blocks = parseBlocks(article.content);
  const idx = blocks.findIndex((b) => b && (b.type === 'paragraph' || b.type === 'text') && String(b.text || b.content || '').trim());
  if (idx >= 0) {
    if (blocks[idx].type === 'paragraph') blocks[idx].text = rewrite.lead;
    else blocks[idx].content = rewrite.lead;
  }

  const { error: upErr } = await supabase
    .from('articles')
    .update({
      excerpt: rewrite.excerpt,
      seo_description: rewrite.seo_description,
      content: JSON.stringify(blocks),
    })
    .eq('id', id);

  if (upErr) {
    console.error(`Failed update ${id} ${article.slug}: ${upErr.message}`);
    continue;
  }

  touched += 1;
  console.log(`Rewrote ${id} ${article.slug}`);
}

console.log(`Done. Rewrote ${touched} non-scenic articles.`);
