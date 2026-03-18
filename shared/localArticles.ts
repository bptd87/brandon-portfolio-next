import { generatedLocalArticles } from "./localArticles.generated";

export type LocalArticleBlock = Record<string, any>;

export interface LocalArticleAudio {
  url: string;
  label?: string;
  durationLabel?: string;
}

export interface LocalArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: string;
  updatedAt: string;
  createdAt?: string;
  categoryName: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string | null;
  sourcePublication?: string | null;
  sourceUrl?: string | null;
  audio?: LocalArticleAudio;
  tags?: Array<{ id: number; name: string; slug: string }>;
  content: LocalArticleBlock[] | string;
  featured?: boolean;
  readTime?: number | null;
}

export const VOYAGELA_ARTICLE_SLUG = "voyagela-rising-stars-interview";
export const VOYAGELA_ARTICLE_PATH = `/articles/${VOYAGELA_ARTICLE_SLUG}`;

const countWords = (value: string) => value.split(/\s+/).filter(Boolean).length;

const estimateReadTime = (content: LocalArticle["content"]) => {
  if (!Array.isArray(content)) {
    return Math.max(1, Math.ceil(countWords(String(content || "")) / 200));
  }

  const words = content.reduce((total, block) => {
    if (!block || typeof block !== "object") return total;

    if (typeof block.text === "string") {
      return total + countWords(block.text);
    }

    if (typeof block.content === "string") {
      return total + countWords(block.content.replace(/<[^>]+>/g, " "));
    }

    if (Array.isArray(block.items)) {
      return total + block.items.reduce((sum: number, item: string) => sum + countWords(String(item)), 0);
    }

    if (Array.isArray(block.images)) {
      return total;
    }

    if (Array.isArray(block.items) && block.type === "faq") {
      return (
        total +
        block.items.reduce(
          (sum: number, item: { question?: string; answer?: string }) =>
            sum + countWords(item.question || "") + countWords(item.answer || ""),
          0
        )
      );
    }

    return total;
  }, 0);

  return Math.max(1, Math.ceil(words / 200));
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const audioBySlug: Record<string, LocalArticleAudio> = {
  "empowering-theatre-students-with-computer-literacy": {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/sign/article_audio/Computer%20Literacy.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTA3YTJmOS04YzBmLTRlODQtOWIwNC04Njc2OTJkMzA5OGEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnRpY2xlX2F1ZGlvL0NvbXB1dGVyIExpdGVyYWN5Lm1wMyIsImlhdCI6MTc3MzgwNjk0NCwiZXhwIjoxODY4NDE0OTQ0fQ.XkGzQOroOzZ3GLCtIEgUJ1AS7X_S9F1fnTUKR0lbAPA",
    label: "Listen to article",
    durationLabel: "5:50",
  },
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/sign/article_audio/Your%20Wasting%20My%20Time.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80OTA3YTJmOS04YzBmLTRlODQtOWIwNC04Njc2OTJkMzA5OGEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcnRpY2xlX2F1ZGlvL1lvdXIgV2FzdGluZyBNeSBUaW1lLm1wMyIsImlhdCI6MTc3MzgxNjQ5OCwiZXhwIjoxODY4NDI0NDk4fQ.mwUiLn-Rgqvp1rjZ93dOIqCAMJSmj4OvnG9mjCzzxc4",
    label: "Listen to article",
  },
};

const articleFieldOverridesBySlug: Record<string, Partial<LocalArticle>> = {
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": {
    excerpt:
      "A reflective essay on critique, revision, and the moment scenic design shifted from presentation toward real-time design thinking.",
    seoDescription:
      "A scenic design essay about critique, revision, URTAs, and learning to think like a designer under pressure.",
  },
};

const contentOverridesBySlug: Record<string, LocalArticle["content"]> = {
  "youre-wasting-my-time-a-scenic-design-lesson-in-growth-and-revision": [
    {
      type: "paragraph",
      text: "Some critique moments stay with you because they force a choice: defend instinct or improve process. This story is about learning to revise with intention while building the professional stamina scenic design demands.",
    },
    {
      type: "paragraph",
      text: "To save money on checked luggage, I decided I would buy my foam core once I arrived. There was a Blick down the street from the hotel. Everything felt organized. At that point, I already had a fair amount of experience. I felt confident. My love for Chicago was certain. And I was planning on attending Northwestern.",
    },
    {
      type: "paragraph",
      text: "The beginning of the day felt like a dream. There was praise. Conversations were easy. People were engaging with my work.",
    },
    {
      type: "paragraph",
      text: "It felt like everything was lining up.",
    },
    {
      type: "paragraph",
      text: "We were at URTAs. I was standing beside my boards, portfolio open, trying to keep up with the pace of the day. I remember one designer I deeply admired pausing in front of my setup. He glanced at my presentation boards and said:",
    },
    {
      type: "quote",
      text: "Oh, they’re black. How original.",
    },
    {
      type: "paragraph",
      text: "It was quick, dry, and dismissive. I wasn’t sure how to respond.",
    },
    {
      type: "paragraph",
      text: "Then he flipped to a ground plan from a show I had designed five years earlier and asked:",
    },
    {
      type: "quote",
      text: "How would you change this?",
    },
    {
      type: "paragraph",
      text: "It was a living room scene. And I knew exactly what he meant. The layout was stiff. The staging felt flat. The environment read more like a set than a place someone might actually live.",
    },
    {
      type: "paragraph",
      text: "But in that moment, I froze.",
    },
    {
      type: "paragraph",
      text: "Not because I had never thought critically about the design — but because I had not yet developed the instinct to revise my own work aloud, under pressure.",
    },
    {
      type: "paragraph",
      text: "Before I could find the words, he cut in:",
    },
    {
      type: "quote",
      text: "You’re wasting my time.",
    },
    {
      type: "paragraph",
      text: "And then he walked away.",
    },
    {
      type: "heading",
      level: 2,
      text: "What That Moment Revealed",
    },
    {
      type: "paragraph",
      text: "It was quiet after that. I stood there with my boards, stunned. In that instant, I knew I wasn’t going to be attending that program.",
    },
    {
      type: "paragraph",
      text: "I wasn’t angry. I was embarrassed. Northwestern had been my top choice. He was someone I respected. And I had completely blanked.",
    },
    {
      type: "paragraph",
      text: "The hardest part wasn’t the comment itself. It was realizing how unprepared I felt for the kind of conversation that moment required.",
    },
    {
      type: "paragraph",
      text: "Looking back now, I understand that the interaction was not really about that one drawing. It was not even about finding the “correct” answer. It was about demonstrating the ability to think like a designer in real time — to respond, to question, to revise. And at that point in my development, I didn’t yet have that skill.",
    },
    {
      type: "heading",
      level: 2,
      text: "The Instinct to Re-Enter",
    },
    {
      type: "paragraph",
      text: "That question — How would you change this? — was not a trap. It was an invitation to re-engage with my own work. I simply did not yet have the tools to do so.",
    },
    {
      type: "paragraph",
      text: "Freezing did not mean I lacked potential. It meant I was still developing a fundamental part of design practice: the instinct to re-enter a design and see it as something living and flexible.",
    },
    {
      type: "paragraph",
      text: "At the time, I believed my responsibility was to present a polished version of what I had already created. I had not yet realized that scenic design is never truly finished.",
    },
    {
      type: "paragraph",
      text: "What matters most is not having the “right” answer. It is staying in the conversation. It is showing that you can keep thinking.",
    },
    {
      type: "heading",
      level: 2,
      text: "What I Carry Forward in Scenic Design",
    },
    {
      type: "paragraph",
      text: "Since then, I have come to understand that the work of a designer is constantly evolving. Whether in rehearsal, in technical rehearsals, or in an interview, the ability to revisit your ideas — to challenge them, reshape them, and respond to feedback — is essential.",
    },
    {
      type: "paragraph",
      text: "I think about that moment often. Not with resentment, but as a marker of growth. That silence, that freeze, and that quick walk away clarified what the profession actually demands.",
    },
    {
      type: "paragraph",
      text: "There is a quote I return to again and again:",
    },
    {
      type: "quote",
      text: "Art is never finished, only abandoned.",
      author: "Leonardo da Vinci",
    },
    {
      type: "paragraph",
      text: "That set was never finished. Neither was I.",
    },
    {
      type: "paragraph",
      text: "And that moment was not a waste of time.",
    },
    {
      type: "paragraph",
      text: "It was the beginning of learning how to think like a designer.",
    },
    {
      type: "gallery",
      images: [
        {
          url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/Brandon%20URTAS%20Chicago%202017%20-1.webp",
          alt: "Brandon PT Davis at URTAs Chicago 2017.",
          caption: "URTAs, Chicago, 2017.",
        },
        {
          url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/Brandon%20URTAS%20Chicago%202017%20-2.webp",
          alt: "Portfolio review moment at URTAs Chicago 2017.",
          caption: "Portfolio review, URTAs Chicago, 2017.",
        },
        {
          url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/Brandon%20URTAS%20Chicago%202017%20-4.webp",
          alt: "Photo of Chicago's Water Tower district with the historic Water Tower and the John Hancock building.",
          caption: "Chicago Water Tower district, with the Water Tower and John Hancock building.",
        },
        {
          url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/Brandon%20URTAS%20Chicago%202017%20-3.webp",
          alt: "Hotel room selfie from the Chicago URTAs trip in 2017.",
          caption: "Hotel room selfie, Chicago, 2017.",
        },
      ],
    },
  ],
};

const voyageLaArticle: LocalArticle = {
  id: 100003,
  slug: VOYAGELA_ARTICLE_SLUG,
  title: "VoyageLA: Rising Stars Interview",
  excerpt:
    "VoyageLA featured Brandon PT Davis in a Rising Stars profile focused on scenic design growth, artistic voice, and long-term career direction in Southern California.",
  coverImageUrl:
    "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/news-images/news-150001-cover.webp",
  coverImageAlt: "VoyageLA Rising Stars interview feature",
  publishedAt: "2026-02-10",
  updatedAt: "2026-02-12",
  createdAt: "2026-02-10",
  categoryName: "Editorial Profiles",
  seoTitle: "VoyageLA Interview | Brandon PT Davis",
  seoDescription:
    "VoyageLA's Rising Stars interview with Brandon PT Davis on scenic design process, career development, and production-focused collaboration.",
  sourcePublication: "VoyageLA",
  sourceUrl: "https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/",
  tags: [],
  featured: true,
  content: [
    {
      type: "paragraph",
      text:
        "VoyageLA published a Rising Stars interview profiling Brandon PT Davis's path from regional theatre work to current scenic design and teaching practice. The feature works best as durable editorial context rather than time-sensitive news, so it now lives with the site's long-form article archive.",
    },
    {
      type: "heading",
      level: 2,
      text: "Editorial context",
    },
    {
      type: "paragraph",
      text:
        "The interview highlights a professional path shaped by scenic design, production collaboration, and a long-term interest in how environments support performance. It also offers a useful snapshot of how the larger body of work has been framed publicly outside the portfolio itself.",
    },
    {
      type: "heading",
      level: 2,
      text: "Interview focus",
    },
    {
      type: "paragraph",
      text:
        "The conversation centers on process, collaboration, and the working conditions that shape scenic design decisions in rehearsal, drafting, and production. It speaks less to one individual project than to the habits and values that organize the work across projects.",
    },
    {
      type: "list",
      listType: "bulleted",
      items: [
        "Career progression across regional and academic theatre",
        "How storytelling goals shape scenic systems and material choices",
        "Building a visible body of work through documented production practice",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Original publication",
    },
    {
      type: "paragraph",
      text: "Read the full interview on VoyageLA for the original editorial presentation and Q&A.",
    },
    {
      type: "html",
      content:
        '<p><a href="https://voyagela.com/interview/rising-stars-meet-brandon-pt-davis-of-irvine-ca/" target="_blank" rel="noopener noreferrer">Read the VoyageLA interview</a></p>',
    },
  ],
};

const dbBackedArticles = (generatedLocalArticles as LocalArticle[]).map((article) => ({
  ...article,
  ...articleFieldOverridesBySlug[article.slug],
  content: contentOverridesBySlug[article.slug] ?? article.content,
  audio: audioBySlug[article.slug],
}));

const baseArticles = dbBackedArticles.some((article) => article.slug === VOYAGELA_ARTICLE_SLUG)
  ? dbBackedArticles
  : [...dbBackedArticles, voyageLaArticle];

export const localArticles = baseArticles
  .map((article) => ({
    ...article,
    excerpt: article.excerpt || "",
    coverImageAlt: article.coverImageAlt || article.title,
    readTime: article.readTime ?? estimateReadTime(article.content),
    createdAt: article.createdAt || article.publishedAt,
    updatedAt: article.updatedAt || article.publishedAt,
    status: "published" as const,
  }))
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const voyageLaArticleRecord =
  localArticles.find((article) => article.slug === VOYAGELA_ARTICLE_SLUG) || null;

export function getLocalArticles() {
  return localArticles;
}

export function getLocalArticleBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return localArticles.find((article) => article.slug === slug);
}

export function isLocalArticleSlug(slug?: string | null): boolean {
  return Boolean(getLocalArticleBySlug(slug));
}

export function toLocalArticleRecord(article: LocalArticle) {
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImageUrl: article.coverImageUrl,
    coverImageAlt: article.coverImageAlt,
    readTime: article.readTime ?? estimateReadTime(article.content),
    status: "published" as const,
    featured: Boolean(article.featured),
    categoryId: null,
    authorId: null,
    category: {
      id: -1,
      name: article.categoryName,
      slug: slugify(article.categoryName),
    },
    categoryName: article.categoryName,
    seoTitle: article.seoTitle,
    seoDescription: article.seoDescription,
    seoKeywords: article.seoKeywords || null,
    createdAt: new Date(article.createdAt || article.publishedAt),
    updatedAt: new Date(article.updatedAt || article.publishedAt),
    publishedAt: new Date(article.publishedAt),
    likes: 0,
    views: 0,
    tags: article.tags || [],
    audio: article.audio,
    sourcePublication: article.sourcePublication || null,
    sourceUrl: article.sourceUrl || null,
  };
}

export function getLocalArticleRecordBySlug(slug?: string | null) {
  const article = getLocalArticleBySlug(slug);
  return article ? toLocalArticleRecord(article) : undefined;
}

export function mergeArticleListWithLocal<T extends { slug: string }>(articles: T[]) {
  const bySlug = new Map<string, any>();

  for (const article of articles) {
    bySlug.set(article.slug, article);
  }

  for (const localArticle of localArticles) {
    bySlug.set(localArticle.slug, {
      ...bySlug.get(localArticle.slug),
      ...toLocalArticleRecord(localArticle),
    });
  }

  return Array.from(bySlug.values()).sort(
    (a, b) =>
      new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  );
}
