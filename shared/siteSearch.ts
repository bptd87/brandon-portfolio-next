import { getLocalArticles } from "./localArticles";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "./learningPortal";
import { resolveBlobMediaUrl } from "./mediaBlob";
import {
  assistantScenicDesignEntries,
  ASSISTANT_SCENIC_DESIGN_PATH,
} from "./localAssistantScenic";
import {
  getLocalExperientialBrands,
  getLocalExperientialSamples,
  getLocalRenderingProjects,
} from "./localPortfolios";
import { getLocalScenicProjects } from "./localScenicProjects";
import {
  getLocalCollaborators,
  getLocalStudioDirectory,
  getLocalTutorials,
} from "./localStudio";
import { voiceProfile } from "./voiceProfile";

export type SiteSearchSection = "Portfolio" | "Writing" | "Studio" | "People";

export type SiteSearchEntry = {
  id: string;
  title: string;
  href: string;
  section: SiteSearchSection;
  kind: string;
  description: string;
  meta?: string;
  imageUrl?: string;
  keywords: string[];
  featured?: boolean;
  bodyText?: string;
  searchText: string;
  searchTokens?: string[];
};

export type SiteSearchResult = SiteSearchEntry & {
  score: number;
  snippet: string;
};

function normalizeSearchValue(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SEARCH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "all",
  "are",
  "about",
  "best",
  "can",
  "connect",
  "connected",
  "does",
  "find",
  "for",
  "from",
  "how",
  "i",
  "in",
  "is",
  "me",
  "name",
  "named",
  "names",
  "of",
  "or",
  "page",
  "pages",
  "result",
  "results",
  "search",
  "show",
  "tell",
  "the",
  "their",
  "them",
  "to",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
]);

function uniqueKeywords(values: Array<string | null | undefined>) {
  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const value of values) {
    const normalized = normalizeSearchValue(String(value || ""));
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    keywords.push(normalized);
  }

  return keywords;
}

function toEntry(input: Omit<SiteSearchEntry, "searchText">) {
  const keywords = uniqueKeywords(input.keywords);
  const tokenSource = uniqueKeywords([
    input.title,
    input.kind,
    input.section,
    input.description,
    input.meta,
    ...keywords,
  ]);
  const searchText = uniqueKeywords([
    input.title,
    input.kind,
    input.section,
    input.description,
    input.meta,
    input.bodyText?.slice(0, 420),
    ...keywords,
  ]).join(" ");

  return {
    ...input,
    keywords,
    searchText,
    searchTokens: tokenSource.flatMap((value) => value.split(" ").filter(Boolean)),
  };
}

type SearchEntryInput = Omit<SiteSearchEntry, "keywords" | "searchText"> & {
  keywords: Array<string | null | undefined>;
};

function createEntry(input: SearchEntryInput) {
  return toEntry({
    ...input,
    keywords: uniqueKeywords(input.keywords),
  });
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

function collapseWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stringifyVoiceProfile(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(stringifyVoiceProfile).join(" ");
  if (!value || typeof value !== "object") return "";
  return Object.values(value).map(stringifyVoiceProfile).join(" ");
}

function extractArticleBodyText(content: unknown): string {
  if (typeof content === "string") {
    return collapseWhitespace(stripHtml(content));
  }

  if (!Array.isArray(content)) return "";

  const parts: string[] = [];

  for (const block of content) {
    if (!block || typeof block !== "object") continue;

    if (typeof block.text === "string") {
      parts.push(block.text);
    }

    if (typeof block.content === "string") {
      parts.push(stripHtml(block.content));
    }

    if (typeof block.caption === "string") {
      parts.push(block.caption);
    }

    if (typeof block.alt === "string") {
      parts.push(block.alt);
    }

    if (Array.isArray(block.items)) {
      for (const item of block.items) {
        if (typeof item === "string") {
          parts.push(item);
        } else if (item && typeof item === "object") {
          if (typeof item.question === "string") parts.push(item.question);
          if (typeof item.answer === "string") parts.push(item.answer);
          if (typeof item.text === "string") parts.push(item.text);
          if (typeof item.content === "string") parts.push(stripHtml(item.content));
        }
      }
    }

    if (Array.isArray(block.images)) {
      for (const image of block.images) {
        if (!image || typeof image !== "object") continue;
        if (typeof image.alt === "string") parts.push(image.alt);
        if (typeof image.caption === "string") parts.push(image.caption);
      }
    }
  }

  return collapseWhitespace(parts.join(" "));
}

function extractTutorialBodyText(tutorial: ReturnType<typeof getLocalTutorials>[number]) {
  return collapseWhitespace(
    [
      tutorial.description,
      tutorial.overview,
      ...(tutorial.learning_objectives || []),
      ...(tutorial.pro_tips || []),
      ...(tutorial.common_pitfalls || []),
      ...(tutorial.key_concepts || []).flatMap((concept) => [concept.title, concept.content]),
      ...(tutorial.transcript || []).map((item) => item.text),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function extractScenicBodyText(project: ReturnType<typeof getLocalScenicProjects>[number]) {
  return collapseWhitespace(
    [
      project.excerpt,
      ...project.creativeTeam.flatMap((member) => [member.name, member.role]),
      ...project.sections.flatMap((section) => {
        if (section.type === "text") {
          return [section.heading, ...section.content];
        }

        if (section.type === "video") {
          return [section.heading, ...(section.content || [])];
        }

        return [section.heading];
      }),
      ...project.media.flatMap((media) => [media.altText, media.caption]),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function extractRenderingBodyText(project: ReturnType<typeof getLocalRenderingProjects>[number]) {
  return collapseWhitespace(
    [
      project.excerpt,
      project.heroExcerpt,
      project.designNotes,
      ...(project.bodySections || []).flatMap((section) => [section.heading, ...section.paragraphs]),
      ...project.images.flatMap((image) => [image.altText, image.caption]),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function extractExperientialBodyText(sample: ReturnType<typeof getLocalExperientialSamples>[number]) {
  return collapseWhitespace(
    [
      sample.description,
      sample.altText,
      ...sample.images.flatMap((image) => [image.title, image.caption, image.altText]),
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function createProfileEntries() {
  const aboutImage =
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
  const profileBody = collapseWhitespace(stringifyVoiceProfile(voiceProfile));

  return [
    createEntry({
      id: "profile:about",
      title: "About Brandon PT Davis",
      href: "/about",
      section: "People",
      kind: "Profile",
      description:
        "Biography, current base in Orange County, California, and the creative throughline connecting theatre, teaching, and experiential work.",
      meta: "About • Scenic Designer • Irvine, CA",
      imageUrl: aboutImage,
      bodyText: [voiceProfile.location.summary, profileBody].join(" "),
      keywords: [
        "Brandon PT Davis",
        "Brandon",
        "where is Brandon from",
        "where is Brandon based",
        "where is Brandon located",
        "where does Brandon live",
        "Central Missouri",
        "Irvine",
        "Orange County",
        "California",
        "Southern California",
        "scenic designer",
        "artist first",
        "creative identity",
        "background",
        "bio",
        "biography",
        "origin",
        "about",
      ],
    }),
    createEntry({
      id: "profile:resume",
      title: "Resume & Credits",
      href: "/resume",
      section: "People",
      kind: "Resume",
      description:
        "Production history, collaborators, teaching, and the broader professional record across theatre and related work.",
      meta: "Resume • Credits",
      imageUrl: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png",
      bodyText: [
        voiceProfile.careerReality.workload,
        voiceProfile.careerReality.extensions,
        voiceProfile.careerReality.sustainability,
      ].join(" "),
      keywords: [
        "resume",
        "credits",
        "production history",
        "career",
        "workload",
        "productions per year",
        "Brandon PT Davis resume",
      ],
    }),
    createEntry({
      id: "profile:teaching",
      title: "Teaching Philosophy",
      href: "/about/teaching",
      section: "People",
      kind: "Teaching",
      description:
        "Teaching values, industry-facing classroom priorities, and how scenic design education connects to real production practice.",
      meta: "Teaching • Education",
      imageUrl: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png",
      bodyText: [
        voiceProfile.teaching.philosophy,
        voiceProfile.teaching.gap,
        ...voiceProfile.teaching.priorities,
      ].join(" "),
      keywords: [
        "teaching",
        "education",
        "students",
        "teaching philosophy",
        "portfolio development",
        "communication skills",
        "industry workflows",
      ],
    }),
    createEntry({
      id: "profile:statement",
      title: "Creative Statement",
      href: "/creative-statement",
      section: "People",
      kind: "Creative Statement",
      description:
        "A concise view of Brandon's process, scenic design philosophy, collaboration values, and relationship to tools and storytelling.",
      meta: "Process • Philosophy",
      imageUrl: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png",
      bodyText: [
        voiceProfile.process.startingPoint,
        voiceProfile.process.philosophy,
        voiceProfile.creativeIdentity.definitionOfScenicDesign,
        voiceProfile.tools.renderingInsight,
      ].join(" "),
      keywords: [
        "creative statement",
        "process",
        "philosophy",
        "storytelling",
        "rendering",
        "drafting",
        "model building",
      ],
    }),
  ];
}

function createStaticPageEntries() {
  return [
    createEntry({
      id: "page:portfolio",
      title: "Portfolio",
      href: "/projects",
      section: "Portfolio",
      kind: "Portfolio Index",
      description:
        "Browse scenic design, rendering, and experiential design projects across Brandon PT Davis's body of work.",
      meta: "Projects • Scenic Design • Rendering",
      keywords: [
        "portfolio",
        "projects",
        "scenic design portfolio",
        "theatre design",
        "rendering",
        "experiential design",
        "production design",
      ],
    }),
    createEntry({
      id: "page:scenic-projects",
      title: "Scenic Design Projects",
      href: "/projects/scenic-design",
      section: "Portfolio",
      kind: "Portfolio Collection",
      description:
        "Selected scenic design work for musicals, plays, Shakespeare, and new work.",
      meta: "Scenic Design",
      keywords: [
        "scenic design",
        "set design",
        "theatre",
        "musicals",
        "plays",
        "portfolio",
      ],
    }),
    createEntry({
      id: "page:rendering-projects",
      title: "Theatre Renderings",
      href: "/projects/rendering",
      section: "Portfolio",
      kind: "Portfolio Collection",
      description:
        "Rendering work and visual development studies for theatrical and scenic design.",
      meta: "Rendering • Visualization",
      keywords: [
        "rendering",
        "theatre renderings",
        "visualization",
        "concept art",
        "scenic rendering",
        "Twinmotion",
        "Photoshop",
        "Vectorworks",
      ],
    }),
    createEntry({
      id: "page:experiential-projects",
      title: "Experiential Design",
      href: "/projects/experiential",
      section: "Portfolio",
      kind: "Portfolio Collection",
      description:
        "Experiential design, live event, branded environment, and technical drawing work.",
      meta: "Experiential • Live Events",
      keywords: [
        "experiential design",
        "brand activation",
        "live events",
        "technical drawing",
        "event design",
        "branded environment",
      ],
    }),
    createEntry({
      id: "page:articles",
      title: "Articles",
      href: "/articles",
      section: "Writing",
      kind: "Article Archive",
      description:
        "Essays, interviews, profiles, and long-form writing around scenic design, process, rendering, and creative practice.",
      meta: "Writing • Essays",
      keywords: [
        "articles",
        "writing",
        "essays",
        "interviews",
        "profiles",
        "scenic design process",
        "creative practice",
      ],
    }),
    createEntry({
      id: "page:collaborators",
      title: "Collaborators & Directors",
      href: "/about/collaborators",
      section: "People",
      kind: "People Directory",
      description:
        "Directors, designers, theatre companies, and recurring creative partners across Brandon PT Davis's work.",
      meta: "People • Designers • Directors",
      keywords: [
        "collaborators",
        "directors",
        "designers",
        "creative partners",
        "creative team",
        "theatre companies",
        "design team",
      ],
    }),
    createEntry({
      id: "page:learning-portal",
      title: "Scenic Design Learning Portal",
      href: "/studio/tutorials",
      section: "Studio",
      kind: "Learning Archive",
      description:
        "Tutorials, article guides, Vectorworks lessons, drafting references, rendering workflows, and scenic design learning resources.",
      meta: "Tutorials • Vectorworks • Articles",
      keywords: [
        "tutorials",
        "learning portal",
        "Vectorworks",
        "drafting",
        "rendering",
        "scenic design tutorials",
        "article tutorials",
        "students",
      ],
    }),
    createEntry({
      id: "page:studio-apps",
      title: "Studio Apps",
      href: "/studio/apps",
      section: "Studio",
      kind: "Studio Tools",
      description:
        "Production-focused calculators, reference tools, and utilities for scenic drafting, paint, modeling, and research.",
      meta: "Apps • Calculators • Tools",
      keywords: [
        "studio apps",
        "scale calculator",
        "paint calculator",
        "dimension reference",
        "scenic tools",
        "drafting tools",
      ],
    }),
    createEntry({
      id: "page:studio-directory",
      title: "Studio Directory",
      href: "/studio/directory",
      section: "Studio",
      kind: "Resource Directory",
      description:
        "Outbound links to scenic design resources, software, suppliers, organizations, and theatre research references.",
      meta: "Resources • Directory",
      keywords: [
        "directory",
        "resources",
        "suppliers",
        "software",
        "research",
        "scenic design resources",
      ],
    }),
    createEntry({
      id: "page:contact",
      title: "Contact Brandon PT Davis",
      href: "/contact",
      section: "People",
      kind: "Contact",
      description:
        "Contact page for Brandon PT Davis, scenic designer and educator.",
      meta: "Contact",
      keywords: [
        "contact",
        "email",
        "hire",
        "collaboration",
        "Brandon PT Davis contact",
      ],
    }),
  ];
}

const collaboratorRoleLabels: Record<string, string> = {
  director: "Director",
  scenic_designer: "Scenic Designer",
  costume_designer: "Costume Designer",
  lighting_designer: "Lighting Designer",
  sound_designer: "Sound Designer",
  projection_designer: "Projection Designer",
  theatre_company: "Theatre Company",
  partner_company: "Partner Company",
};

const slugifySearchAnchor = (value: string) =>
  normalizeSearchValue(value).replace(/\s+/g, "-");

function createCollaboratorEntries() {
  return getLocalCollaborators().map((collaborator) => {
    const roleLabel =
      collaboratorRoleLabels[String(collaborator.role || "")] ||
      String(collaborator.role || "Collaborator").replace(/_/g, " ");
    const href = `/about/collaborators#${slugifySearchAnchor(collaborator.name)}`;
    const socialHandle = collaborator.instagramHandle
      ? collaborator.instagramHandle.replace(/^@/, "")
      : "";

    return createEntry({
      id: `collaborator:${collaborator.slug}`,
      title: collaborator.name,
      href,
      section: "People",
      kind: roleLabel,
      description:
        collaborator.bio ||
        `${collaborator.name} is listed in the collaborator directory as a ${roleLabel.toLowerCase()}.`,
      imageUrl: collaborator.coverImage || undefined,
      featured: collaborator.featured,
      bodyText: collaborator.bio || "",
      keywords: [
        collaborator.name,
        collaborator.slug,
        collaborator.role,
        roleLabel,
        collaborator.bio,
        collaborator.website,
        collaborator.portfolioUrl,
        collaborator.instagramUrl,
        socialHandle,
        "collaborator",
        "creative partner",
        "designer",
        "director",
      ],
    });
  });
}

function buildSnippet(source: string | undefined, fallback: string, terms: string[]) {
  const body = collapseWhitespace(source || "");
  if (!body) return fallback;

  const lower = body.toLowerCase();
  const hit = terms
    .map((term) => lower.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];

  if (hit == null) return fallback;

  const start = Math.max(0, hit - 72);
  const end = Math.min(body.length, hit + 148);
  const snippet = body.slice(start, end).trim();

  return `${start > 0 ? "..." : ""}${snippet}${end < body.length ? "..." : ""}`;
}

function getEditDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = Array.from({ length: a.length + 1 }, (_, index) => index);

  for (let j = 1; j <= b.length; j += 1) {
    let previous = rows[0];
    rows[0] = j;

    for (let i = 1; i <= a.length; i += 1) {
      const temp = rows[i];
      rows[i] = Math.min(
        rows[i] + 1,
        rows[i - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      previous = temp;
    }
  }

  return rows[a.length];
}

function isFuzzyTokenMatch(term: string, token: string) {
  if (!term || !token) return false;
  if (token === term) return true;
  if (term.length >= 3 && token.includes(term)) return true;
  if (term.length >= 4 && token.length >= 4 && term.includes(token)) return true;
  if (Math.abs(term.length - token.length) > 2) return false;
  if (term.length < 4 || token.length < 4) return false;
  return getEditDistance(term, token) <= (term.length >= 8 ? 2 : 1);
}

function hasProfileIntent(normalizedQuery: string) {
  return /(^|\s)(brandon|bio|biography|about|from|based|located|live|origin|background|designer|process|philosophy|teach|teaching|student|education)(\s|$)/.test(
    normalizedQuery
  );
}

function hasStudioIntent(normalizedQuery: string) {
  return /(^|\s)(vectorworks|tutorial|tutorials|studio|draft|drafting|render|rendering|model|modeling|tool|tools|software|workflow|texture|textures|resource|resources|symbol|symbols|class|classes|layer|layers|dimension|dimensions|pdf|pdfs)(\s|$)/.test(
    normalizedQuery
  );
}

export function buildSiteSearchEntries(): SiteSearchEntry[] {
  const profileEntries = createProfileEntries();
  const staticPageEntries = createStaticPageEntries();
  const collaboratorEntries = createCollaboratorEntries();
  const scenicEntries = getLocalScenicProjects().map((project) =>
    createEntry({
      id: `scenic:${project.slug}`,
      title: project.title,
      href: `/project/${project.slug}`,
      section: "Portfolio",
      kind: "Scenic Project",
      description: project.excerpt,
      meta: [project.client, project.location, project.year].filter(Boolean).join(" • "),
      imageUrl: project.coverImageUrl || undefined,
      featured: project.featured,
      bodyText: extractScenicBodyText(project),
      keywords: [
        project.title,
        project.slug,
        project.excerpt,
        project.client,
        project.location,
        ...(project.tags || []).flatMap((tag) => [tag.name, tag.slug]),
        ...(project.creativeTeam || []).flatMap((member) => [member.name, member.role]),
      ],
    })
  );

  const renderingEntries = getLocalRenderingProjects()
    .filter((project) => !project.galleryOnly)
    .map((project) =>
      createEntry({
        id: `rendering:${project.slug}`,
        title: project.title,
        href: `/projects/rendering/${project.slug}`,
      section: "Portfolio",
      kind: "Rendering Project",
      description: project.excerpt,
      meta: [project.client, project.location, project.year].filter(Boolean).join(" • "),
      imageUrl: project.coverImageUrl || undefined,
      featured: project.featured,
      bodyText: extractRenderingBodyText(project),
      keywords: [
        project.title,
        project.slug,
        project.excerpt,
        project.designNotes,
          project.client,
          project.location,
        ],
      })
    );

  const experientialEntries = getLocalExperientialSamples().map((sample) =>
    createEntry({
      id: `experiential:${sample.category}:${sample.slug}`,
      title: sample.displayTitle,
      href: `/projects/experiential/${sample.category}/${sample.slug}`,
      section: "Portfolio",
      kind: "Experiential Sample",
      description: sample.description,
      meta: [sample.category, sample.year].filter(Boolean).join(" • "),
      imageUrl: sample.imageUrl,
      bodyText: extractExperientialBodyText(sample),
      keywords: [
        sample.displayTitle,
        sample.slug,
        sample.category,
        sample.description,
        sample.altText,
        ...sample.images.flatMap((image) => [image.title, image.caption, image.altText]),
      ],
    })
  );

  const brandEntries = getLocalExperientialBrands().map((brand) =>
    createEntry({
      id: `brand:${brand.id}`,
      title: brand.name,
      href: "/projects/experiential",
      section: "Portfolio",
      kind: "Experiential Brand",
      description: "Brand partner within the experiential portfolio.",
      meta: "Experiential Design",
      imageUrl: brand.logoUrl,
      keywords: [brand.name, brand.websiteUrl],
    })
  );

  const articleEntries = getLocalArticles()
    .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) =>
      createEntry({
        id: `article:${article.slug}`,
        title: article.title,
        href: LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug)
          ? `/studio/tutorials/${article.slug}`
          : `/articles/${article.slug}`,
        section: "Writing",
        kind: LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug) ? "Learning Article" : "Article",
        description: article.excerpt,
        meta: [article.categoryName, article.sourcePublication].filter(Boolean).join(" • "),
        imageUrl: article.coverImageUrl,
        featured: article.featured,
        bodyText: extractArticleBodyText(article.content),
        keywords: [
          article.title,
          article.slug,
          article.excerpt,
          article.categoryName,
          article.seoTitle,
          article.seoDescription,
          article.sourcePublication,
          ...(article.tags || []).flatMap((tag) => [tag.name, tag.slug]),
        ],
      })
    );

  const tutorialEntries = getLocalTutorials().map((tutorial) =>
    createEntry({
      id: `tutorial:${tutorial.slug}`,
      title: tutorial.title,
      href: `/studio/tutorials/${tutorial.slug}`,
      section: "Studio",
      kind: "Tutorial",
      description: tutorial.description || tutorial.overview || "Scenic workflow tutorial.",
      meta: [tutorial.category, tutorial.difficulty].filter(Boolean).join(" • "),
      bodyText: extractTutorialBodyText(tutorial),
      keywords: [
        tutorial.title,
        tutorial.slug,
        tutorial.description,
        tutorial.overview,
        tutorial.category,
        tutorial.difficulty,
        ...(tutorial.learning_objectives || []),
        ...(tutorial.key_concepts || []).flatMap((concept) => [concept.title, concept.content]),
        ...(tutorial.pro_tips || []),
        ...(tutorial.related_resources || []).flatMap((resource) => [resource.title, resource.type]),
        ...(tutorial.tags || []).flatMap((tag) => [tag.name, tag.slug]),
      ],
    })
  );

  const assistantEntries = assistantScenicDesignEntries.map((entry) =>
    createEntry({
      id: `assistant:${entry.anchorId}`,
      title: entry.title,
      href: `${ASSISTANT_SCENIC_DESIGN_PATH}#${entry.anchorId}`,
      section: "People",
      kind: "Assistant Scenic Credit",
      description: entry.excerpt,
      meta: [entry.organization, entry.collaborator, entry.location].filter(Boolean).join(" • "),
      imageUrl: entry.coverImageUrl,
      featured: entry.featured,
      keywords: [
        entry.title,
        entry.organization,
        entry.collaborator,
        entry.role,
        entry.excerpt,
        entry.location,
      ],
    })
  );

  const directoryEntries = getLocalStudioDirectory().map((entry) =>
    createEntry({
      id: `directory:${entry.slug}`,
      title: entry.name,
      href: "/studio/directory",
      section: "Studio",
      kind: "Directory Resource",
      description: entry.description || "Reference resource in the scenic directory.",
      meta: [entry.category_name, entry.location].filter(Boolean).join(" • "),
      featured: entry.featured,
      keywords: [
        entry.name,
        entry.slug,
        entry.description,
        entry.category_name,
        entry.category_slug,
        entry.location,
        entry.url,
      ],
    })
  );

  return [
    ...profileEntries,
    ...staticPageEntries,
    ...collaboratorEntries,
    ...scenicEntries,
    ...renderingEntries,
    ...experientialEntries,
    ...brandEntries,
    ...articleEntries,
    ...tutorialEntries,
    ...assistantEntries,
    ...directoryEntries,
  ];
}

export function searchSiteIndex(entries: SiteSearchEntry[], query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return [] as SiteSearchResult[];

  const rawTerms = Array.from(new Set(normalizedQuery.split(" ").filter(Boolean)));
  const significantTerms = rawTerms.filter((term) => !SEARCH_STOPWORDS.has(term));
  const terms = significantTerms.length > 0 ? significantTerms : rawTerms;
  if (terms.length === 0) return [] as SiteSearchResult[];

  const profileIntent = hasProfileIntent(normalizedQuery);
  const studioIntent = hasStudioIntent(normalizedQuery);

  const results: SiteSearchResult[] = [];

  for (const entry of entries) {
    let score = 0;
    const title = normalizeSearchValue(entry.title);
    const description = normalizeSearchValue(entry.description);
    const meta = normalizeSearchValue(entry.meta || "");
    const keywords = entry.keywords;
    const text = entry.searchText;
    const tokens = entry.searchTokens || [];

    let matchedTerms = 0;

    for (const term of terms) {
      const inTitle = title.includes(term);
      const startsTitle = title.startsWith(term);
      const inDescription = description.includes(term);
      const inMeta = meta.includes(term);
      const inKeyword = keywords.some((keyword) => keyword.includes(term));
      const inText = text.includes(term);
      const fuzzyTokenMatch = tokens.some((token) => isFuzzyTokenMatch(term, token));

      if (!(inTitle || inDescription || inMeta || inKeyword || inText || fuzzyTokenMatch)) {
        matchedTerms = -1;
        break;
      }

      matchedTerms += 1;

      if (startsTitle) score += 18;
      else if (inTitle) score += 12;
      if (inKeyword) score += 9;
      if (inMeta) score += 7;
      if (inDescription) score += 4;
      if (inText) score += 2;
      if (fuzzyTokenMatch && !(inTitle || inKeyword)) score += 3;
    }

    if (matchedTerms !== terms.length) continue;

    if (title === normalizedQuery) score += 28;
    else if (title.includes(normalizedQuery)) score += 14;
    if (text.includes(normalizedQuery)) score += 8;
    if (entry.featured) score += 3;
    if (entry.imageUrl) score += 1;

    if (profileIntent) {
      if (entry.id.startsWith("profile:")) score += 38;
      if (entry.section === "People") score += 12;
      if (!studioIntent && entry.section === "Studio") score -= 10;
    }

    if (!profileIntent && studioIntent && entry.section === "Studio") {
      score += 10;
    }

    results.push({
      ...entry,
      score,
      snippet: buildSnippet(entry.bodyText, entry.description, terms),
    });
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

export function groupSearchResults(results: SiteSearchResult[]) {
  const groups = new Map<SiteSearchSection, SiteSearchResult[]>();

  for (const result of results) {
    const existing = groups.get(result.section);
    if (existing) {
      existing.push(result);
    } else {
      groups.set(result.section, [result]);
    }
  }

  return Array.from(groups.entries());
}
