import {
  generatedExperientialBrands,
  generatedExperientialProcessGallery,
  generatedRenderingGallery,
  generatedRenderingProjects,
} from "./localPortfolios.generated";
import { applyBlobMediaManifest } from "./mediaBlob";

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
  Partial<Pick<LocalRenderingProject, "coverImageUrl" | "images" | "excerpt" | "designNotes" | "heroExcerpt" | "bodySections">>
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
  heroExcerpt?: string;
  designNotes: string;
  bodySections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
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

export type LocalExperientialProjectSection = {
  heading: string;
  paragraphs: string[];
};

export type LocalExperientialProject = {
  slug: string;
  title: string;
  summary: string;
  heroSummary?: string;
  seoTitle: string;
  seoDescription: string;
  year: number | null;
  updatedAt: string | null;
  coverImageUrl: string;
  coverAltText: string;
  mediaTypes: LocalExperientialCategory[];
  samples: LocalExperientialSample[];
  renderings: LocalExperientialRenderingSample[];
  technicalDrawings: LocalExperientialTechnicalDrawingSample[];
  liveEvents: LocalExperientialLiveEventSample[];
  sections: LocalExperientialProjectSection[];
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
  return applyBlobMediaManifest(generatedRenderingProjects as LocalRenderingProject[])
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
  return applyBlobMediaManifest(generatedRenderingGallery as LocalRenderingGalleryItem[]).filter(
    (item) => item.project?.slug && !EXCLUDED_RENDERING_SLUGS.has(item.project.slug)
  );
}

export function getLocalExperientialProcessGallery() {
  return applyBlobMediaManifest(
    generatedExperientialProcessGallery as LocalExperientialProcessGalleryItem[]
  );
}

export function getLocalExperientialBrands() {
  return applyBlobMediaManifest(generatedExperientialBrands as LocalExperientialBrand[]);
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

type LocalExperientialProjectDefinition = {
  slug: string;
  title: string;
  sampleSlugs: string[];
  summary: string;
  heroSummary?: string;
  sections: LocalExperientialProjectSection[];
  seoTitle?: string;
  seoDescription?: string;
  year?: number | null;
};

const EXPERIENTIAL_PROJECT_DEFINITIONS: LocalExperientialProjectDefinition[] = [
  {
    slug: "first-bank-lollipops",
    title: "First Bank Lollipops",
    sampleSlugs: ["first-bank-lollipops-commercial", "first-bank-lollipops"],
    summary:
      "A campaign-focused experiential project that pairs concept visualization with live documentation, framing how the First Bank Lollipops idea moves from pitch asset to on-site experience.",
    sections: [
      {
        heading: "Concept and Delivery",
        paragraphs: [
          "This project is presented as a full experiential case study rather than a single category sample. The visual work supports both internal alignment and outward-facing communication, showing how a campaign concept reads before and during rollout.",
          "Bringing the rendering and live material together makes the project easier to read as a complete design package: one thread of thinking carried from early visualization through public-facing execution.",
        ],
      },
      {
        heading: "Why the Pairing Matters",
        paragraphs: [
          "Concept imagery establishes tone, hierarchy, and branded presence. Live documentation shows how those decisions hold up once the work meets schedule, audience flow, and production conditions.",
          "Seen together, the assets function less like isolated images and more like an editorial record of how the idea was framed, approved, and ultimately experienced.",
        ],
      },
    ],
  },
  {
    slug: "toyota-gold-cup-activation",
    title: "Toyota Gold Cup Activation",
    sampleSlugs: ["toyota-gold-cup-final-29", "toyota-gold-cup-activation"],
    summary:
      "An experiential activation package for Toyota Gold Cup that combines concept renderings with live event photography to show sponsor visibility, guest circulation, and event-scale presence.",
    sections: [
      {
        heading: "Designed for Scale",
        paragraphs: [
          "The project is organized around visibility and audience movement at event scale. The renderings establish spatial hierarchy early, giving stakeholders a readable view of how branded elements, circulation, and focal moments fit together.",
          "That early clarity matters for approvals because large-format activations need to communicate quickly to both creative teams and production partners.",
        ],
      },
      {
        heading: "From Visualization to Experience",
        paragraphs: [
          "Live imagery completes the story by showing the work in actual venue conditions. Instead of treating renderings and event photos as separate portfolio buckets, the page frames them as parts of the same production arc.",
          "That project-by-project structure makes the experiential work read more like a design case study, which is the right lens for clients comparing concept intent with built outcome.",
        ],
      },
    ],
  },
  {
    slug: "red-line-cafe",
    title: "Red Line Cafe",
    sampleSlugs: ["red-line-cafe"],
    summary:
      "Interior concept renderings for Red Line Cafe, focused on atmosphere, customer flow, and presentation-ready visual communication for a branded hospitality environment.",
    sections: [
      {
        heading: "Interior Atmosphere",
        paragraphs: [
          "This project is framed around how rendering can communicate tone as clearly as layout. The imagery focuses on atmosphere, customer orientation, and the way brand character is held inside an everyday hospitality space.",
          "That makes the page function less like a gallery dump and more like a concise editorial presentation of what the design is trying to achieve.",
        ],
      },
      {
        heading: "Visualization as Alignment",
        paragraphs: [
          "The renderings work as approval tools, helping teams read seating zones, branded millwork, and circulation before fabrication or fit-out decisions move forward.",
          "Presented as a project page, the material can carry explanation alongside imagery, which is exactly what the current experiential portfolio has been missing.",
        ],
      },
    ],
  },
  {
    slug: "woody-creek-distillery-activation",
    title: "Woody Creek Distillery Activation",
    sampleSlugs: ["woody-creek-distillery-activation"],
    summary:
      "A branded activation concept for Woody Creek Distillery, built to show guest-facing visibility, product storytelling, and a flexible event presence that can support presentation and review.",
    sections: [
      {
        heading: "Brand Presence",
        paragraphs: [
          "The project emphasizes how an activation can feel legible and branded without losing flexibility. The renderings focus on presence, guest readability, and how the environment supports product storytelling.",
          "By giving the work a project page instead of a loose category slot, the portfolio can explain intent rather than relying on a single image to do all the work.",
        ],
      },
      {
        heading: "Presentation-Ready Assets",
        paragraphs: [
          "This material is most useful when framed as part of a project narrative: what the activation needs to communicate, how the visual system is structured, and why the concept is organized the way it is.",
          "That article-like framing makes the portfolio stronger for experiential clients who evaluate thinking, not just image polish.",
        ],
      },
    ],
  },
  {
    slug: "rab-activation",
    title: "Rab Activation",
    sampleSlugs: ["rab-activation"],
    summary:
      "Retail activation renderings for Rab, focused on merchandising clarity, guest circulation, and a branded environment that reads cleanly in presentation and review.",
    sections: [
      {
        heading: "Merchandising and Movement",
        paragraphs: [
          "The renderings are organized around circulation, product visibility, and the relationship between display structure and customer movement.",
          "That makes the work especially suited to an editorial project page, where the portfolio can speak to both atmosphere and retail logic at the same time.",
        ],
      },
      {
        heading: "Why This Lives as a Project",
        paragraphs: [
          "Experiential work like this is clearer when it is grouped by project rather than split into generic gallery categories. The design intent, visual language, and stakeholder use case stay connected in one place.",
          "That shift helps the page read more like the rest of the site: a designed story with supporting media, not a bucket of disconnected assets.",
        ],
      },
    ],
  },
  {
    slug: "park-and-shop",
    title: "Park & Shop",
    sampleSlugs: ["park-and-shop-concord-ca", "park-and-shop-technical-drawing"],
    summary:
      "A retail environment package for Park & Shop that pairs concept renderings with technical drawing support, showing how presentation imagery and drafting documentation work together inside one project.",
    sections: [
      {
        heading: "One Project, Two Asset Types",
        paragraphs: [
          "Park & Shop is exactly the kind of work that benefits from a unified project structure. The renderings communicate brand tone and customer-facing organization, while the drafting clarifies dimensions, layouts, and fabrication logic.",
          "Keeping those assets together makes the portfolio easier to read because the project no longer has to be mentally reassembled across separate category pages.",
        ],
      },
      {
        heading: "From Approval to Coordination",
        paragraphs: [
          "Renderings support presentation and approval. Technical drawings support execution, coordination, and handoff. The strength of the project is the relationship between those layers, not either one in isolation.",
          "That is why the new experiential pages should behave more like articles or scenic project pages, with narrative first and categorized media supporting the story underneath.",
        ],
      },
    ],
  },
  {
    slug: "lysistrata-covid-documentation",
    title: "Lysistrata COVID Documentation",
    sampleSlugs: ["lysistrata-covid-documentation"],
    summary:
      "A drafting and documentation package created to support staging clarity and evolving production requirements during COVID-era planning.",
    sections: [
      {
        heading: "Documentation Under Constraint",
        paragraphs: [
          "This work is rooted in technical clarity. The drawings serve as communication tools for changing requirements, helping teams track layout decisions and production needs in a period where planning conditions were unusually fluid.",
          "Framed as a project page, the documentation can carry context and intent rather than appearing as an isolated sheet set.",
        ],
      },
      {
        heading: "Why It Belongs Here",
        paragraphs: [
          "Technical drawing samples deserve the same editorial framing as rendering or scenic work. The design value is not just in the sheet itself, but in the problem it helps a team solve.",
          "Presenting this as a project makes that problem-solving role legible to clients who need coordination, not just images.",
        ],
      },
    ],
  },
  {
    slug: "new-swan-venue-documentation",
    title: "New Swan Venue Documentation",
    sampleSlugs: ["new-swan-venue-documentation"],
    summary:
      "Venue documentation for New Swan, capturing site conditions and technical information needed to support planning, coordination, and installation decisions.",
    sections: [
      {
        heading: "Recording Existing Conditions",
        paragraphs: [
          "This project centers on clarity of information. Venue documentation supports downstream planning by turning existing conditions into something teams can actually work from.",
          "The value of the page comes from pairing that documentation with a concise explanation of what the material is for and how it supports production decisions.",
        ],
      },
      {
        heading: "Editorial Framing for Technical Work",
        paragraphs: [
          "Grouped inside an article-like project page, the drawings read as part of a process rather than as isolated technical artifacts.",
          "That framing aligns the experiential portfolio with the rest of the site, where projects are presented as complete stories supported by images, text, and navigation structure.",
        ],
      },
    ],
  },
];

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

function getExperientialProjectTimestamp(input: {
  updatedAt?: string | null;
  createdAt?: string | null;
  year?: number | null;
}) {
  const explicitDate = input.updatedAt || input.createdAt;
  if (explicitDate) {
    const timestamp = new Date(explicitDate).getTime();
    if (!Number.isNaN(timestamp)) return timestamp;
  }

  if (input.year) return new Date(input.year, 6, 1).getTime();
  return 0;
}

function sortExperientialSamples(items: LocalExperientialSample[]) {
  return [...items].sort((a, b) => {
    const timeCompare =
      getExperientialProjectTimestamp({ updatedAt: a.createdAt, year: a.year }) -
      getExperientialProjectTimestamp({ updatedAt: b.createdAt, year: b.year });

    if (timeCompare !== 0) return timeCompare;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });
}

function pickExperientialProjectLeadSample(samples: LocalExperientialSample[]) {
  const categoryPriority: LocalExperientialCategory[] = ["live-events", "rendering", "technical-drawing"];

  for (const category of categoryPriority) {
    const categorySamples = samples.filter((sample) => sample.category === category);
    for (const sample of categorySamples) {
      const leadImage = getLocalExperientialLeadImage(sample);
      if (leadImage) return sample;
    }
  }

  return samples[0] || null;
}

function buildFallbackExperientialSections(sample: LocalExperientialSample): LocalExperientialProjectSection[] {
  const description = String(sample.description || "").trim();
  return [
    {
      heading: "Project Overview",
      paragraphs: [
        description || `${sample.categoryLabel} sample presented as a standalone experiential project page.`,
        "This fallback project is generated from the portfolio snapshot so new experiential entries can still appear in the unified project system before custom editorial copy is added.",
      ],
    },
  ];
}

function buildLocalExperientialProjects(): LocalExperientialProject[] {
  const samples = getLocalExperientialSamples();
  const sampleBySlug = new Map(samples.map((sample) => [sample.slug, sample]));
  const definitions: LocalExperientialProjectDefinition[] = [...EXPERIENTIAL_PROJECT_DEFINITIONS];

  for (const sample of samples) {
    const isAssigned = EXPERIENTIAL_PROJECT_DEFINITIONS.some((definition) => definition.sampleSlugs.includes(sample.slug));
    if (isAssigned) continue;

    definitions.push({
      slug: sample.slug,
      title: sample.displayTitle,
      sampleSlugs: [sample.slug],
      summary:
        String(sample.description || "").trim() ||
        `${sample.categoryLabel} project from Brandon PT Davis's experiential portfolio.`,
      sections: buildFallbackExperientialSections(sample),
    });
  }

  const projects = definitions
    .map((definition) => {
      const projectSamples = definition.sampleSlugs
        .map((sampleSlug) => sampleBySlug.get(sampleSlug))
        .filter((sample): sample is LocalExperientialSample => Boolean(sample));

      if (projectSamples.length === 0) return null;
      const orderedSamples = sortExperientialSamples(projectSamples);
      const renderings = orderedSamples.filter(
        (sample): sample is LocalExperientialRenderingSample => sample.category === "rendering"
      );
      const technicalDrawings = orderedSamples.filter(
        (sample): sample is LocalExperientialTechnicalDrawingSample => sample.category === "technical-drawing"
      );
      const liveEvents = orderedSamples.filter(
        (sample): sample is LocalExperientialLiveEventSample => sample.category === "live-events"
      );
      const leadSample = pickExperientialProjectLeadSample(orderedSamples);
      const latestUpdatedAt =
        [...orderedSamples]
          .map((sample) => sample.createdAt)
          .filter((value): value is string => Boolean(value))
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null;
      const derivedYear =
        definition.year ??
        [...orderedSamples]
          .map((sample) => sample.year)
          .filter((value): value is number => typeof value === "number")
          .sort((a, b) => b - a)[0] ??
        null;
      const mediaTypes = (["live-events", "rendering", "technical-drawing"] as LocalExperientialCategory[]).filter(
        (category) => orderedSamples.some((sample) => sample.category === category)
      );
      const coverImageUrl = leadSample ? getLocalExperientialLeadImage(leadSample) : "";
      const coverAltText = String(leadSample?.altText || leadSample?.displayTitle || definition.title).trim();
      const seoDescription = definition.seoDescription || definition.summary;

      return {
        slug: definition.slug,
        title: definition.title,
        summary: definition.summary,
        heroSummary: definition.heroSummary,
        seoTitle: definition.seoTitle || `${definition.title} | Experiential Design | Brandon PT Davis`,
        seoDescription,
        year: derivedYear,
        updatedAt: latestUpdatedAt,
        coverImageUrl,
        coverAltText,
        mediaTypes,
        samples: orderedSamples,
        renderings,
        technicalDrawings,
        liveEvents,
        sections: definition.sections,
      } satisfies LocalExperientialProject;
    })
    .filter((project): project is NonNullable<typeof project> => Boolean(project));

  return projects.sort((a, b) => {
      const timeCompare =
        getExperientialProjectTimestamp({ updatedAt: b.updatedAt, year: b.year }) -
        getExperientialProjectTimestamp({ updatedAt: a.updatedAt, year: a.year });

      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });
}

export function getLocalExperientialProjects() {
  return buildLocalExperientialProjects();
}

export function getLocalExperientialProjectBySlug(slug: string) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return getLocalExperientialProjects().find((project) => project.slug === normalizedSlug) || null;
}

export function getLocalExperientialProjectForSample(sample: Pick<LocalExperientialSample, "slug">) {
  const normalizedSlug = String(sample.slug || "").trim().toLowerCase();
  return (
    getLocalExperientialProjects().find((project) =>
      project.samples.some((projectSample) => projectSample.slug === normalizedSlug)
    ) || null
  );
}

export function getLocalExperientialProjectHref(project: Pick<LocalExperientialProject, "slug">) {
  return `/projects/experiential/${project.slug}`;
}
