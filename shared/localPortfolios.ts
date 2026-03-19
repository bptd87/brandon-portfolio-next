import {
  generatedExperientialBrands,
  generatedExperientialProcessGallery,
  generatedRenderingGallery,
  generatedRenderingProjects,
} from "./localPortfolios.generated";

// Public rendering and experiential landing pages read from these generated
// local snapshots instead of live TRPC queries. Re-run `pnpm generate:portfolios`
// after DB/media changes that should appear on the public pages.

const EXCLUDED_RENDERING_SLUGS = new Set([
  "american-idiot",
  "barefoot-in-the-park",
  "loteria-game-on",
  "a-funny-thing-happened",
  "the-penelopiad",
]);

const RENDERING_PROJECT_OVERRIDES: Record<
  string,
  Partial<Pick<LocalRenderingProject, "coverImageUrl" | "images" | "excerpt" | "designNotes">>
> = {
  "ashes-of-the-underworld": {
    images: [],
  },
  "head-over-heels": {
    excerpt:
      "A bright, pop-inflected world for Head Over Heels, balancing theatrical excess with clear spatial structure for movement, comedy, and transformation.",
  },
  "boeing-boeing": {
    excerpt:
      "A crisp farce interior for Boeing, Boeing, designed to support speed, entrances, and the escalating mechanics of the play’s comic timing.",
  },
  "an-inspector-calls": {
    excerpt:
      "A tense domestic world for An Inspector Calls, built to hold respectability on the surface while making room for pressure, unease, and collapse underneath.",
  },
  "tomas-and-the-library-lady": {
    excerpt:
      "A warm, story-led environment for Tomás and the Library Lady, shaped around discovery, memory, and the transformative promise of books.",
  },
  "the-merry-wives-of-windsor": {
    excerpt:
      "A playful rendering for The Merry Wives of Windsor, built around comic movement, social energy, and the elasticity of Shakespearean farce.",
  },
  isolation: {
    excerpt:
      "A solitary interior study where emptiness, distance, and stillness carry the emotional weight of the image.",
  },
  company: {
    excerpt:
      "A rendering for Company focused on urban rhythm, intimacy, and the emotional friction between public life and private uncertainty.",
  },
  "parliament-square": {
    excerpt:
      "A spare, civic space for Parliament Square, composed to hold tension, surveillance, and the uneasy balance between public order and private fear.",
  },
  "angel-food-cake": {
    excerpt:
      "A modest mobile home interior for Angel Food Cake, where familiar domestic detail carries humor, tenderness, and emotional strain.",
  },
  "angel-street": {
    excerpt:
      "A Victorian interior for Angel Street, shaped to support claustrophobia, ornament, and the slow psychological pressure of the play.",
  },
  "all-my-sons": {
    excerpt:
      "A postwar family home for All My Sons, designed as an ordinary backyard world whose familiarity makes its moral fractures feel more devastating.",
  },
};

export type LocalRenderingProjectImage = {
  id: number;
  imageUrl: string;
  altText: string;
  caption: string;
  sortOrder: number | null;
};

export type LocalRenderingProject = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  designNotes: string;
  coverImageUrl: string;
  client: string;
  location: string;
  year: number | null;
  month: number | null;
  status: string | null;
  featured: boolean;
  galleryOnly: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  images: LocalRenderingProjectImage[];
};

export type LocalRenderingGalleryItem = {
  id: number;
  altText: string;
  displayTitle: string;
  description: string;
  sortOrder: number | null;
  active: boolean;
  projectId: number | null;
  project: LocalRenderingProject | null;
};

export type LocalExperientialProcessGalleryItem = {
  id: number;
  category: string;
  imageUrl: string;
  videoUrl: string | null;
  altText: string;
  displayTitle: string;
  description: string;
  sortOrder: number | null;
  active: boolean;
  projectId: number | null;
  year: number | null;
  createdAt: string | null;
  images: Array<{
    id: number;
    imageUrl: string;
    videoUrl: string | null;
    altText: string;
    caption: string;
    title: string;
    sortOrder: number | null;
    imageType: string | null;
  }>;
};

export type LocalExperientialCategory = "rendering" | "technical-drawing" | "live-events";

export type LocalExperientialSample = LocalExperientialProcessGalleryItem & {
  slug: string;
  category: LocalExperientialCategory;
  categoryLabel: string;
};

export type LocalExperientialRenderingSample = LocalExperientialSample & {
  category: "rendering";
};

export type LocalExperientialTechnicalDrawingSample = LocalExperientialSample & {
  category: "technical-drawing";
};

export type LocalExperientialLiveEventSample = LocalExperientialSample & {
  category: "live-events";
};

export type LocalExperientialMediaItem = {
  imageUrl: string;
  altText: string;
  caption: string;
  source: "cover" | "attached";
};

type LocalExperientialMediaSource = {
  category: LocalExperientialCategory;
  imageUrl: string;
  altText: string | null;
  displayTitle: string | null;
  images?: Array<{
    imageUrl: string;
    altText?: string | null;
    caption?: string | null;
  }>;
};

export type LocalExperientialBrand = {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  sortOrder: number | null;
  active: boolean;
};

export function getLocalRenderingProjects() {
  return (generatedRenderingProjects as LocalRenderingProject[])
    .filter((project) => !EXCLUDED_RENDERING_SLUGS.has(project.slug))
    .map((project) => {
      const override = RENDERING_PROJECT_OVERRIDES[project.slug];
      return override ? { ...project, ...override } : project;
    });
}

export function getLocalRenderingProjectBySlug(slug: string) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return getLocalRenderingProjects().find((project) => project.slug === normalizedSlug) || null;
}

function normalizeCompareValue(value?: string | null) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLocalRenderingProjectForProduction(input: {
  title?: string | null;
  client?: string | null;
  year?: number | null;
}) {
  const targetTitle = normalizeCompareValue(input.title);
  const targetClient = normalizeCompareValue(input.client);
  if (!targetTitle) return null;

  return (
    getLocalRenderingProjects().find((project) => {
      if (normalizeCompareValue(project.title) !== targetTitle) return false;
      if (targetClient && normalizeCompareValue(project.client) && normalizeCompareValue(project.client) !== targetClient) {
        return false;
      }
      if (input.year && project.year && project.year !== input.year) return false;
      return true;
    }) || null
  );
}

export function getLocalRenderingGallery() {
  return (generatedRenderingGallery as LocalRenderingGalleryItem[]).filter(
    (item) => item.project?.slug && !EXCLUDED_RENDERING_SLUGS.has(item.project.slug)
  );
}

export function getLocalExperientialProcessGallery() {
  return generatedExperientialProcessGallery as LocalExperientialProcessGalleryItem[];
}

export function getLocalExperientialBrands() {
  return generatedExperientialBrands as LocalExperientialBrand[];
}

const EXPERIENTIAL_CATEGORY_LABELS: Record<LocalExperientialCategory, string> = {
  rendering: "Rendering",
  "technical-drawing": "Technical Drawing",
  "live-events": "Live Events",
};

const EXPERIENTIAL_SAMPLE_OVERRIDES: Record<
  string,
  Partial<Pick<LocalExperientialSample, "description" | "altText">>
> = {
  "red-line-cafe": {
    description:
      "Renderings for Red Line Cafe, exploring customer flow, branded millwork, seating zones, and the atmosphere of a polished quick-service interior.",
  },
  "woody-creek-distillery-activation": {
    description:
      "A brand-forward activation concept for Woody Creek Distillery, built around visibility, product storytelling, and flexible guest engagement.",
  },
  "rab-activation": {
    description:
      "Retail activation renderings for Rab, focused on merchandising clarity, circulation, and a durable branded environment.",
  },
  "toyota-gold-cup-activation": {
    description:
      "Event renderings for Toyota Gold Cup Activation, developed to show sponsor presence, audience circulation, and large-scale branded visibility.",
  },
  "park-and-shop-concord-ca": {
    description:
      "Retail environment renderings for Park and Shop in Concord, balancing customer circulation, fixture organization, and a clean branded presentation.",
  },
  "first-bank-lollipops": {
    description:
      "Promotional concept imagery for First Bank Lollipops, designed to translate a campaign idea into a clear visual moment.",
  },
  "park-and-shop-technical-drawing": {
    description:
      "Drafting sheets for Park & Shop, showing the documentation layer behind fixture layout, elevations, and fabrication-ready coordination.",
  },
  "lysistrata-covid-documentation": {
    description:
      "Documentation set for Lysistrata during COVID-era production planning, focused on adaptable staging information, layout clarity, and evolving requirements.",
  },
  "new-swan-venue-documentation": {
    description:
      "Venue documentation for New Swan, recording site conditions and technical information needed to support installation planning and coordination.",
  },
  "toyota-gold-cup-final-29": {
    description:
      "Live event photography from Toyota Gold Cup Final 29, capturing the built environment in use and the scale of the branded guest experience.",
  },
};

function slugifyExperientialTitle(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeExperientialTitle(item: LocalExperientialProcessGalleryItem) {
  const raw = String(item.displayTitle || "").trim();

  switch (raw) {
    case "Wood Creek Distillery Activation":
      return "Woody Creek Distillery Activation";
    case "Toyota  Gold Cup Activation":
      return "Toyota Gold Cup Activation";
    case "Park & Shop Techncial Drawing":
      return "Park & Shop Technical Drawing";
    case "Lysistrata Covid Documentation":
    case "Lysistrata Covid Documentation ":
      return "Lysistrata COVID Documentation";
    case "New Swan Venue Docuementation":
    case "New Swan Venue Docuementation ":
      return "New Swan Venue Documentation";
    default:
      return raw;
  }
}

function buildLocalExperientialSamples(): LocalExperientialSample[] {
  return getLocalExperientialProcessGallery()
    .filter((item): item is LocalExperientialProcessGalleryItem & { category: LocalExperientialCategory } => {
      return item.category === "rendering" || item.category === "technical-drawing" || item.category === "live-events";
    })
    .map((item) => {
      const displayTitle = normalizeExperientialTitle(item);
      const slug = slugifyExperientialTitle(displayTitle);
      const override = EXPERIENTIAL_SAMPLE_OVERRIDES[slug];
      return {
        ...item,
        displayTitle,
        slug,
        categoryLabel: EXPERIENTIAL_CATEGORY_LABELS[item.category],
        ...override,
      };
    });
}

export function getLocalExperientialSamples(): LocalExperientialSample[];
export function getLocalExperientialSamples(category: "rendering"): LocalExperientialRenderingSample[];
export function getLocalExperientialSamples(category: "technical-drawing"): LocalExperientialTechnicalDrawingSample[];
export function getLocalExperientialSamples(category: "live-events"): LocalExperientialLiveEventSample[];
export function getLocalExperientialSamples(category: LocalExperientialCategory): LocalExperientialSample[];
export function getLocalExperientialSamples(category?: LocalExperientialCategory) {
  const items = buildLocalExperientialSamples();

  return category ? items.filter((item) => item.category === category) : items;
}

export function getLocalExperientialSampleBySlug(category: "rendering", slug: string): LocalExperientialRenderingSample | null;
export function getLocalExperientialSampleBySlug(
  category: "technical-drawing",
  slug: string
): LocalExperientialTechnicalDrawingSample | null;
export function getLocalExperientialSampleBySlug(category: "live-events", slug: string): LocalExperientialLiveEventSample | null;
export function getLocalExperientialSampleBySlug(
  category: LocalExperientialCategory,
  slug: string
): LocalExperientialSample | null;
export function getLocalExperientialSampleBySlug(category: LocalExperientialCategory, slug: string) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return getLocalExperientialSamples(category).find((item) => item.slug === normalizedSlug) || null;
}

export function getLocalExperientialSampleHref(sample: Pick<LocalExperientialSample, "category" | "slug">) {
  return `/projects/experiential/${sample.category}/${sample.slug}`;
}

export function getLocalExperientialMediaItems(sample: LocalExperientialMediaSource): LocalExperientialMediaItem[] {
  const seen = new Set<string>();
  const fallbackAlt = String(sample.altText || sample.displayTitle || "Experiential sample").trim();
  const attached = (sample.images || []).map((image) => ({
    imageUrl: image.imageUrl,
    altText: String(image.altText || fallbackAlt),
    caption: String(image.caption || ""),
    source: "attached" as const,
  }));

  const cover = sample.imageUrl
    ? {
        imageUrl: sample.imageUrl,
        altText: fallbackAlt,
        caption: "",
        source: "cover" as const,
      }
    : null;

  const ordered =
    sample.category === "technical-drawing"
      ? [...attached, ...(cover ? [cover] : [])]
      : [...(cover ? [cover] : []), ...attached];

  return ordered.filter((image) => {
    if (!image.imageUrl || seen.has(image.imageUrl)) return false;
    seen.add(image.imageUrl);
    return true;
  });
}

export function getLocalExperientialLeadImage(sample: LocalExperientialMediaSource) {
  return getLocalExperientialMediaItems(sample)[0]?.imageUrl || sample.imageUrl || "";
}
