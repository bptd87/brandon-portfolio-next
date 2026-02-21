import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const REWRITES = {
  60147: {
    excerpt: 'A scenic-first walkthrough of the design process, from first read to opening night, with practical checkpoints for collaboration, revisions, and production reality.',
    seo_description: 'A scenic designer\'s step-by-step production workflow covering script analysis, concept development, drafting, build collaboration, tech, and opening-night execution.',
    lead: 'Scenic design is a sequence of decisions, not a single moment of inspiration. This guide follows the full process from first read to opening night, focusing on the practical choices that keep story, collaboration, and production constraints aligned.'
  },
  60145: {
    excerpt: 'How to present scenic design work with clarity and authority in concept meetings, production reviews, and first rehearsals.',
    seo_description: 'Learn how scenic designers can present concepts clearly to directors, producers, and technical teams while balancing storytelling, feasibility, and schedule pressure.',
    lead: 'A design presentation is part storytelling, part production strategy. The goal is not to show everything you made, but to help the room understand what the world is, why it matters, and how it can be built responsibly.'
  },
  60140: {
    excerpt: 'Why minimalist scenic design continues to lead regional theatre in 2025, and how restraint can increase flexibility, clarity, and visual impact.',
    seo_description: 'An analysis of 2025 regional theatre design trends showing how minimalist scenic systems improve adaptability, cue clarity, and production efficiency without flattening story.',
    lead: 'Minimalism in scenic design is not about doing less work. It is about making more precise choices so the environment can shift quickly, hold focus, and support story under the real constraints of regional production schedules.'
  },
  60139: {
    excerpt: 'A scenic design history of opera from Baroque machinery to contemporary staging, and what those traditions still teach designers now.',
    seo_description: 'Trace opera scenic design from Renaissance origins through modern staging practices, with lessons on scale, composition, transition logic, and audience experience.',
    lead: 'Opera helped establish the visual grammar of large-scale performance long before modern musical theatre. Its design history offers a useful record of how scenery, machinery, and composition evolved to support emotional storytelling at scale.'
  },
  60137: {
    excerpt: 'A scenic lens on Broadway\'s Golden Age and the design vocabulary that still shapes musical theatre production today.',
    seo_description: 'Explore Broadway\'s Golden Age through scenic design: integrated storytelling, visual rhythm, spatial composition, and production practices that still influence musicals.',
    lead: 'The Golden Age of Broadway is often discussed through scores and librettos, but its scenic language was equally foundational. Designers built repeatable visual systems that helped musicals move with narrative clarity and emotional precision.'
  },
  60136: {
    excerpt: 'How Hollywood\'s musical era fused choreography, camera, and scenic composition into a visual language that still influences stage design.',
    seo_description: 'A scenic-focused study of Golden Age cinema musicals, examining how set composition, movement, and camera logic shaped modern theatrical visual storytelling.',
    lead: 'Golden Age movie musicals were laboratories for visual storytelling. Their set composition, choreographic flow, and camera-aware staging continue to inform how scenic designers think about rhythm, focus, and spectacle.'
  },
  60135: {
    excerpt: 'A reflection on building artistic voice in scenic design while staying accountable to story, collaboration, and craft.',
    seo_description: 'A personal scenic design reflection on artistic identity, process discipline, collaboration, and developing a clear creative voice over time.',
    lead: 'Finding a creative voice in scenic design is less about style signatures and more about consistent decision-making under pressure. Voice emerges when process, collaboration, and dramaturgical intent stay aligned across many productions.'
  },
  60134: {
    excerpt: 'How 1960s musicals disrupted inherited formulas and reshaped scenic language across film, stage, and popular culture.',
    seo_description: 'An examination of 1960s musical transformation and its design impact, from shifting visual tone to new production vocabularies in stage and screen storytelling.',
    lead: 'The 1960s musical did not simply update an existing genre. It challenged tone, structure, and visual expectations, forcing designers to negotiate tradition and disruption inside the same production frame.'
  },
  60133: {
    excerpt: 'A scenic case study of All My Sons focused on spatial ethics, domestic realism, and the dramaturgy of the Keller home.',
    seo_description: 'A scenic design case study of Arthur Miller\'s All My Sons, analyzing environment, social tension, revision process, and the storytelling function of domestic space.',
    lead: 'In All My Sons, the set cannot be neutral. The Keller home is both shelter and evidence, and every design choice must balance recognizable realism with the moral pressure embedded in Miller\'s text.'
  },
  60143: {
    excerpt: 'A scenic designer\'s field notes on testing Sora for research, iteration, and presentation while keeping authorship and ethics in view.',
    seo_description: 'A practical test of Sora in scenic design workflows, covering concept exploration, communication value, limitations, and ethical boundaries in production contexts.',
    lead: 'I approached Sora as a studio tool, not a replacement for design thinking. The question was simple: can it accelerate research and communication without flattening authorship, collaboration, or production reality?'
  },
  60131: {
    excerpt: 'A scenic reflection on Maude Adams\' legacy at Stephens College and the institutional memory that shapes design pedagogy.',
    seo_description: 'Explore Maude Adams\' legacy at Stephens College through scenic practice, teaching context, and historical continuity in theatrical training.',
    lead: 'Maude Adams is often remembered as a performer, but her influence on theatrical education remains equally significant. At Stephens, that legacy still appears in how students are trained to think about presence, space, and visual intention.'
  },
  60142: {
    excerpt: 'A formative critique story about scenic growth, revision discipline, and learning to protect standards without losing curiosity.',
    seo_description: 'A scenic design growth essay on critique, revision habits, and professional resilience in early-career training environments.',
    lead: 'Some critique moments stay with you because they force a choice: defend instinct, or improve process. This story is about learning to revise with intention while building the professional stamina scenic design demands.'
  },
  60129: {
    excerpt: 'How Romero used scenic space as memory architecture, shaping ritual, grief, and political urgency onstage.',
    seo_description: 'A scenic design analysis of Romero focused on memory-based spatial strategy, ritual structure, and collaborative world-building for nonlinear storytelling.',
    lead: 'Romero required a scenic world that could hold memory, ritual, and rupture at once. The design strategy treated space as an active witness, not a backdrop, so the stage could carry both history and immediacy.'
  },
  60141: {
    excerpt: 'A scenic breakdown of Urinetown focused on authoritarian architecture, class contrast, and the mechanics of dystopian satire.',
    seo_description: 'A scenic case study of Urinetown examining industrial visual language, class-coded space, modular transitions, and the dramaturgy of dystopian control.',
    lead: 'Urinetown works best when the environment feels systematized and oppressive before a single line is spoken. This design pass leaned into authoritarian scale and material weight to keep power visible in every scene shift.'
  },
  60128: {
    excerpt: 'A realistic guide to becoming a scenic designer, covering training paths, portfolio development, collaboration habits, and career positioning.',
    seo_description: 'A practical scenic design career guide on education pathways, portfolio strategy, production experience, and professional growth in contemporary theatre.',
    lead: 'Becoming a scenic designer is less about a single credential and more about sustained practice across storytelling, drafting, collaboration, and production problem-solving. This guide outlines the path in working terms.'
  },
  60130: {
    excerpt: 'What makes a scenic rendering useful in production: readability, hierarchy, atmosphere, and decision-ready communication.',
    seo_description: 'Learn what separates decorative renderings from production-useful scenic images, including composition, value control, material clarity, and communication intent.',
    lead: 'A strong scenic rendering is not judged only by beauty. It succeeds when directors, shops, and collaborators can read the image quickly and make better decisions because the visual hierarchy is clear.'
  },
  60127: {
    excerpt: 'How environment design lessons from games can sharpen scenic world-building, audience orientation, and spatial storytelling.',
    seo_description: 'A scenic design essay translating video game environment principles into theatrical practice through navigation cues, atmosphere control, and spatial narrative logic.',
    lead: 'Game environments and stage environments solve similar problems: guiding attention, shaping movement, and delivering story through space. This article translates those shared principles into scenic practice.'
  },
  60126: {
    excerpt: 'How to build a scenic-focused digital portfolio in 2026 with stronger structure, better indexing, and clearer project storytelling.',
    seo_description: 'A 2026 portfolio strategy guide for scenic designers covering site architecture, SEO fundamentals, project narrative structure, and conversion-focused presentation.',
    lead: 'A portfolio should function like a curated production document, not a random gallery. For scenic designers, structure and language determine whether the work is discoverable, credible, and easy to hire from.'
  }
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
    if (blocks[idx].type === 'paragraph') {
      blocks[idx].text = rewrite.lead;
    } else {
      blocks[idx].content = rewrite.lead;
    }
  }

  const payload = {
    excerpt: rewrite.excerpt,
    seo_description: rewrite.seo_description,
    content: JSON.stringify(blocks),
  };

  const { error: upErr } = await supabase
    .from('articles')
    .update(payload)
    .eq('id', id);

  if (upErr) {
    console.error(`Failed update ${id} ${article.slug}: ${upErr.message}`);
    continue;
  }

  touched += 1;
  console.log(`Rewrote ${id} ${article.slug}`);
}

console.log(`Done. Rewrote ${touched} scenic-first articles.`);
