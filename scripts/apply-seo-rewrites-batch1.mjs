import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const apply = process.argv.includes("--apply");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const updates = [
  {
    id: 60147,
    slug: "scenic-design-process",
    seo_title: "Scenic Design Process Guide: From Script to Opening Night",
    seo_description:
      "A practical scenic design process guide covering script analysis, research, concept development, drafting, and production collaboration from first read to opening night.",
    seo_keywords:
      "scenic design process, scenic designer workflow, theatre design process, script analysis for designers, scenic design production workflow",
    excerpt:
      "A practical step-by-step guide to the scenic design process, from script analysis and visual research through drafting, tech, and opening night.",
  },
  {
    id: 60145,
    slug: "the-art-of-presenting-theatre-design-a-guide-for-designers",
    seo_title: "How to Present Scenic Design Ideas to Directors and Producers",
    seo_description:
      "Learn how scenic designers present concepts clearly in meetings, production reviews, and rehearsal rooms while balancing story, feasibility, and budget.",
    seo_keywords:
      "presenting scenic design, theatre design presentation, scenic design communication, design pitch for theatre, production design collaboration",
    excerpt:
      "How to present scenic design ideas with clarity and authority to directors, producers, shops, and creative teams.",
  },
  {
    id: 60144,
    slug: "computer-hardware-why-scenic-designers-and-all-theatre-designers-need-to-care",
    seo_title: "Computer Hardware for Scenic Designers: Workstation Guide",
    seo_description:
      "A scenic designer's guide to choosing computer hardware for drafting, rendering, and production workflow reliability in theatre design practice.",
    seo_keywords:
      "computer hardware for scenic designers, scenic design workstation, rendering hardware theatre, vectorworks hardware guide, theatre design technology",
    excerpt:
      "A practical hardware guide for scenic designers who need dependable drafting, modeling, and rendering performance in real production timelines.",
  },
  {
    id: 60131,
    slug: "the-lights-were-already-on-maude-adams-legacy-at-stephens-college",
    seo_title: "Maude Adams and Stephens College: Legacy Through Scenic Practice",
    seo_description:
      "A scenic design perspective on Maude Adams' legacy at Stephens College, and how theatre history, pedagogy, and production culture shape current practice.",
    seo_keywords:
      "Maude Adams, Stephens College theatre, scenic design pedagogy, theatre history and design, scenic designer training",
    excerpt:
      "A scenic reflection on how Maude Adams' legacy at Stephens College continues to influence theatre training, pedagogy, and design values.",
  },
  {
    id: 60143,
    slug: "sora-in-the-studio-testing-ais-potential-for-theatrical-design",
    seo_title: "AI for Scenic Design: Testing Sora in Theatre Workflows",
    seo_description:
      "Field-tested notes on using Sora for scenic design ideation, communication, and iteration, including practical limits and production-safe use cases.",
    seo_keywords:
      "AI for scenic design, Sora theatre design, scenic design ideation tools, AI in production design, theatrical design workflow",
    excerpt:
      "A scenic designer's field test of Sora for concept development and team communication, with practical guidance for production use.",
  },
  {
    id: 60130,
    slug: "what-makes-a-good-scenic-design-rendering",
    seo_title: "Scenic Rendering Principles: What Makes a Rendering Production-Ready",
    seo_description:
      "Core scenic rendering principles for theatre production: readability, material clarity, lighting logic, and communication choices that support build decisions.",
    seo_keywords:
      "scenic rendering principles, scenic design rendering, theatre rendering techniques, production-ready renderings, scenic communication",
    excerpt:
      "What makes a scenic rendering useful in production: clear visual hierarchy, material logic, and communication choices teams can actually build from.",
  },
];

console.log(`Mode: ${apply ? "APPLY" : "DRY RUN"}`);
console.log(`Records queued: ${updates.length}`);

for (const item of updates) {
  if (!apply) {
    console.log(`- [DRY] ${item.id} ${item.slug}`);
    continue;
  }

  const { error } = await supabase
    .from("articles")
    .update({
      seo_title: item.seo_title,
      seo_description: item.seo_description,
      seo_keywords: item.seo_keywords,
      excerpt: item.excerpt,
    })
    .eq("id", item.id)
    .eq("slug", item.slug);

  if (error) {
    console.error(`Failed ${item.id} ${item.slug}: ${error.message}`);
  } else {
    console.log(`Updated ${item.id} ${item.slug}`);
  }
}
