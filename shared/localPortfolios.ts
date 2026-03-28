import {
  fileFirstRenderingProjectContentBySlug,
  fileFirstRenderingProjectFieldsBySlug,
} from "./fileFirstProjects.generated";
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
  "the-northwind-mare-tavern": {
    excerpt:
      "A fantasy tavern rendering built around weathered timber, lantern glow, and the feeling that the room has already lived through a few long winters before the viewer arrives.",
    heroExcerpt:
      "The tavern reads as a lived-in threshold between shelter and adventure, with carved wood, worn stone, and practical light carrying the scenic read before anyone speaks.",
    bodySections: [
      {
        heading: "A World You Can Enter",
        paragraphs: [
          "The goal was not just to make a fantasy interior look detailed. It was to make the room feel used. The carving, lantern placement, and surface wear all needed to suggest a place shaped by habit, memory, and folklore rather than ornament alone.",
          "That matters in rendering work because a space feels believable when it seems to have a life before the frame and after it, not when every object is trying to announce the genre all at once.",
        ],
      },
      {
        heading: "Atmosphere as Structure",
        paragraphs: [
          "Mist, warm practical light, and the heavy silhouette of the architecture help the image read like a stage picture: clear focal hierarchy in front, depth beyond, and enough visual weight to hold the eye in the room.",
          "The rendering is ultimately about hospitality and suspense sharing the same frame. It should feel welcoming, but never entirely safe.",
        ],
      },
    ],
  },
  "ashes-of-the-underworld": {
    images: [],
  },
  "the-glass-menagerie": {
    excerpt:
      "A rendering sequence for The Glass Menagerie shaped around memory instead of literal realism, using thresholds, scrim, and softened architecture to hold longing, confinement, and escape in one room.",
    heroExcerpt:
      "These images support a memory play rather than a fixed apartment box, so the room can breathe, blur, and hold emotional distance without losing its domestic truth.",
    bodySections: [
      {
        heading: "Memory Before Architecture",
        paragraphs: [
          "The rendering work began with the idea that Tom is not recalling a blueprint. He is recalling pressure, tenderness, and the parts of home that would not let him go. That pushed the images away from literal enclosure and toward a more permeable remembered space.",
          "Scrim, threshold, and partial framing became useful because they let the room feel present without insisting on total solidity. The world stays recognizable, but it never hardens into a straightforward apartment illustration.",
        ],
      },
      {
        heading: "Emotional Geography",
        paragraphs: [
          "The renderings had to communicate how the family shares space while also living at different emotional distances from one another. Sightlines, platform relationships, and the pressure of the room all help stage that separation.",
          "Used this way, the images become a design conversation about atmosphere and movement, not just finish selection. They help clarify how the production should feel when memory and action start occupying the same frame.",
        ],
      },
    ],
  },
  "head-over-heels": {
    excerpt:
      "A bright, pop-inflected world for Head Over Heels, balancing theatrical excess with clear spatial structure for movement, comedy, and transformation.",
    heroExcerpt:
      "The design keeps the color loud but the layout readable, so the production can stay playful without losing the paths actors need to move, pivot, and land the jokes.",
    bodySections: [
      {
        heading: "Pop With Purpose",
        paragraphs: [
          "The visual language leans into bold color and heightened style, but it still has to behave like a working stage environment. The renderings are meant to show that the spectacle is disciplined, not random.",
          "That balance is what keeps the world from feeling decorative only. It stays theatrical while still giving the company clean sightlines and a usable playing space.",
        ],
      },
      {
        heading: "Space for Momentum",
        paragraphs: [
          "The production needs a layout that can support quick shifts in tone, ensemble movement, and the show's constant sense of motion. The images therefore prioritize circulation as much as visual punch.",
          "When the room is designed this way, the style supports the comedy instead of crowding it. The result feels energetic, but still built for the stage.",
        ],
      },
    ],
  },
  "boeing-boeing": {
    excerpt:
      "A crisp Paris apartment for Boeing, Boeing, built to handle fast entrances, overlapping schedules, and the mechanical precision of the farce.",
    heroExcerpt:
      "The room has to read cleanly at a glance and still have enough friction in the details for the comedy to keep escalating without confusion.",
    bodySections: [
      {
        heading: "Entrances as Choreography",
        paragraphs: [
          "This kind of farce lives or dies on circulation, so the rendering has to make doors, thresholds, and sightlines feel obvious and reliable. The audience should understand the room before the first scramble begins.",
          "That clarity is what makes the comic timing work. Once the geography is legible, the pace can keep getting faster without the set turning into visual noise.",
        ],
      },
      {
        heading: "A Room That Can Absorb Chaos",
        paragraphs: [
          "The apartment needs enough polish to feel credible, but not so much preciousness that it breaks when the plot starts piling on complications. The design keeps the domestic setting sturdy and practical.",
          "In rendering terms, the job is to show a room that can take repeated collisions of character, timing, and misunderstanding and still read as the same place.",
        ],
      },
    ],
  },
  "an-inspector-calls": {
    excerpt:
      "A tense dining room for An Inspector Calls, holding respectability on the surface while pressure and unease gather underneath.",
    heroExcerpt:
      "The image needs to feel proper and controlled at first glance, then gradually reveal how brittle that order becomes once the interrogation begins.",
    bodySections: [
      {
        heading: "Respectability as a Surface",
        paragraphs: [
          "The room has to look socially complete: polished, stable, and carefully composed. That sense of order is important because it gives the production something solid to disturb.",
          "The rendering therefore resists melodrama and lets the unease emerge from proportion, arrangement, and the cold clarity of the domestic setting.",
        ],
      },
      {
        heading: "Pressure in the Room",
        paragraphs: [
          "As the evening darkens, the space should feel less like a home and more like a place where the family can no longer hide from itself. The visual tension comes from how little the room can actually absorb.",
          "That makes the design useful in production: it supports the shift from confidence to exposure without needing to overstate the mood.",
        ],
      },
    ],
  },
  "tomas-and-the-library-lady": {
    excerpt:
      "A warm library world for Tomás and the Library Lady, shaped around discovery, welcome, and the quiet change that happens when a space makes room for a child.",
    heroExcerpt:
      "The setting should feel practical and kind, with enough visual clarity that the production's warmth reads as lived experience rather than decoration.",
    bodySections: [
      {
        heading: "A Room That Invites Reading",
        paragraphs: [
          "The library needs to feel approachable and specific, not idealized. Shelves, tables, and paths through the room all matter because the space has to suggest real use by real people.",
          "That groundedness gives the story its emotional weight. The design is doing quiet work by making access feel ordinary, generous, and meaningful all at once.",
        ],
      },
      {
        heading: "Small Details, Real Stakes",
        paragraphs: [
          "The renderings keep the gestures modest so the transformation lands through atmosphere rather than spectacle. Light, scale, and material warmth carry the feeling forward.",
          "In production terms, that restraint helps the room support the story instead of competing with it. The image becomes a welcoming frame for the performance.",
        ],
      },
    ],
  },
  "the-merry-wives-of-windsor": {
    excerpt:
      "A playful rendering for The Merry Wives of Windsor, built around comic movement, social energy, and the elasticity of Shakespearean farce.",
  },
  isolation: {
    excerpt:
      "A spare interior study where distance, silence, and a controlled palette make the isolation feel specific instead of symbolic.",
    heroExcerpt:
      "The rendering keeps the space intentionally restrained so the emptiness reads as design intent, not just absence.",
    bodySections: [
      {
        heading: "Emptiness as Composition",
        paragraphs: [
          "The room works by withholding rather than adding. Negative space, simple geometry, and a quiet material palette do most of the emotional lifting.",
          "That restraint keeps the image from turning abstract. It stays legible as a place someone inhabits, even as it makes that inhabitation feel lonely.",
        ],
      },
      {
        heading: "Stillness With Intent",
        paragraphs: [
          "The production value of this kind of image comes from control. Nothing needs to shout, but every choice has to reinforce the sense of distance and separation.",
          "The result is a rendering that feels calm on the surface and emotionally loaded underneath, which is where the piece needs to live.",
        ],
      },
    ],
  },
  "parliament-square": {
    excerpt:
      "A spare civic space for Parliament Square, composed to hold tension, surveillance, and the uneasy balance between public order and private fear.",
    heroExcerpt:
      "These renderings treat the room as an instrument of scrutiny: public enough to feel institutional, exposed enough to keep every conversation unstable.",
    bodySections: [
      {
        heading: "A Room Under Watch",
        paragraphs: [
          "The visual idea was restraint rather than spectacle. Parliament Square works when the space feels official, intelligible, and slightly unforgiving, so the audience senses how power circulates through the room before any overt conflict arrives.",
          "That meant keeping the architecture clean and legible while letting the image carry pressure through emptiness, proportion, and the suggestion of surveillance.",
        ],
      },
      {
        heading: "How Tension Holds",
        paragraphs: [
          "The rendering needed to show that this is a room built for procedure but vulnerable to intrusion. Composition, sightlines, and negative space all help support that contradiction.",
          "Instead of overexplaining the concept, the image lets the institutional calm do the work. The tension comes from what the room refuses to soften.",
        ],
      },
    ],
  },
  "angel-food-cake": {
    excerpt:
      "A modest mobile home interior for Angel Food Cake, where familiar domestic detail carries humor, tenderness, and emotional strain.",
    heroExcerpt:
      "The room stays practical and lived-in, letting small domestic choices carry the story instead of pushing the emotion too hard.",
    bodySections: [
      {
        heading: "Everyday Scale",
        paragraphs: [
          "The design works best when it feels familiar rather than polished. The mobile home setting needs to read as a real place people have worked to maintain, not a decorative version of one.",
          "That groundedness is what gives the production room to breathe. The humor and hurt both land more cleanly when the environment is honest about its scale and limits.",
        ],
      },
      {
        heading: "Warmth Without Gloss",
        paragraphs: [
          "Material detail does the emotional work here: worn surfaces, practical furniture, and a room that has been adapted over time all suggest care without sentimentality.",
          "The rendering ultimately helps the production by making the space feel inhabited, which keeps the story human even when it turns difficult.",
        ],
      },
    ],
  },
  "angel-street": {
    excerpt:
      "A Victorian interior for Angel Street, shaped to support claustrophobia, ornament, and the slow psychological pressure of the play.",
    heroExcerpt:
      "The rendering work for Angel Street was about letting comfort and control occupy the same room, so the domestic image could slowly turn against the person living inside it.",
    bodySections: [
      {
        heading: "A Drawing Room with Teeth",
        paragraphs: [
          "The room needed to feel credible, furnished, and socially polished, but never relaxed. Decorative richness was useful only if it also supported a sense of enclosure and constant observation.",
          "That is where rendering becomes especially valuable on a piece like this: it helps test how much beauty the space can hold before beauty starts reading as pressure.",
        ],
      },
      {
        heading: "Psychology Through Detail",
        paragraphs: [
          "Scale, trim, furniture placement, and visual density all contribute to the emotional argument. The audience should feel that the room is meticulously kept and yet increasingly unsafe.",
          "The image set clarifies that the design is not trying to illustrate gothic mood in the abstract. It is trying to make control visible through domestic order.",
        ],
      },
    ],
  },
  "all-my-sons": {
    excerpt:
      "A postwar family home for All My Sons, designed as an ordinary backyard world whose familiarity makes its moral fractures feel more devastating.",
    heroExcerpt:
      "These renderings focus on the danger of normalcy: a house, porch, and yard that look open and familiar enough to feel trustworthy until the story begins exposing what that comfort has been protecting.",
    bodySections: [
      {
        heading: "Ordinary on Purpose",
        paragraphs: [
          "The strength of the design lies in its refusal to announce tragedy too early. The house needed to look like a place built for routine, family habit, and postwar stability so the eventual pressure could arrive through recognition rather than visual warning.",
          "That is why the rendering language stays grounded. Familiar siding, porch structure, and backyard openness all support the moral shock of the play far better than a design that signals collapse from the beginning.",
        ],
      },
      {
        heading: "Exposure in an Open Yard",
        paragraphs: [
          "The exterior setting is deceptively generous. It provides space, air, and community visibility, but it also denies the characters privacy once the emotional temperature changes.",
          "The renderings help show how that openness works dramaturgically. The yard is not merely picturesque background; it is the place where private failure becomes public fact.",
        ],
      },
    ],
  },
  "bell-book-and-candle": {
    excerpt:
      "A rendering series for Bell, Book, and Candle that keeps the apartment grounded and livable while letting color, texture, and atmosphere quietly support the play’s supernatural edge.",
    heroExcerpt:
      "The images stay rooted in a believable interior, but they leave enough tonal slippage for the room to feel charming, uncanny, and emotionally mobile all at once.",
    bodySections: [
      {
        heading: "A Real Room First",
        paragraphs: [
          "The design works best when the apartment reads as a place people genuinely occupy, not as a decorative idea about magic. The rendering therefore starts with domestic credibility: scale, furniture logic, and a room you can imagine someone moving through every day.",
          "Once that realism is in place, color and atmosphere can begin doing quieter conceptual work. The supernatural tone arrives through nuance rather than visual announcement.",
        ],
      },
      {
        heading: "Mood Without Overstatement",
        paragraphs: [
          "A green-dominant palette and carefully tuned lighting give the space a subtle otherworldliness without severing it from the play’s wit and intimacy.",
          "The rendering set is meant to show that the room can carry both flirtation and enchantment. It should remain approachable even as it starts to feel a little off-center.",
        ],
      },
    ],
  },
  urinetown: {
    excerpt:
      "A rendering series for Urinetown built around civic decay, satirical scale, and the feeling of a city infrastructure so overdetermined that it begins shaping human behavior.",
    heroExcerpt:
      "These images treat the world of Urinetown as an urban machine: funny in its exaggeration, severe in its logic, and always pressing back on the people inside it.",
    bodySections: [
      {
        heading: "Satire Through Infrastructure",
        paragraphs: [
          "The images were not meant to simply look dystopian. They needed to show a world whose pipes, platforms, and public systems feel so omnipresent that the city itself starts acting like an authority figure.",
          "That approach helps the satire stay legible. The environment is exaggerated, but it is exaggerated with purpose, so the audience can feel how policy, scarcity, and spectacle are all working together.",
        ],
      },
      {
        heading: "A City That Presses Back",
        paragraphs: [
          "The rendering composition leans on vertical pressure, exposed structure, and a sense of circulation that is always being managed from above. Characters should appear contained by the same mechanisms they are trying to survive.",
          "What matters most is that the world feels theatrical and political at the same time. The room is funny until it stops being funny, and the design has to live right on that edge.",
        ],
      },
    ],
  },
  company: {
    excerpt:
      "A rendering sequence for Company that treats the city as both social architecture and emotional pressure, letting the world feel lively, exposed, and slightly lonely all at once.",
    heroExcerpt:
      "The image work balances urban energy with interior distance, so the architecture can support Company’s wit while still holding Bobby’s isolation in plain view.",
    bodySections: [
      {
        heading: "Public Life, Private Distance",
        paragraphs: [
          "The renderings needed to support a New York that feels shared, fast, and constantly in motion while still allowing the central loneliness of the piece to stay visible. That tension is built through layered exterior access, stacked sightlines, and a city that always seems to be happening just beyond reach.",
          "Rather than illustrating a single realistic apartment, the images help describe a system of social spaces that Bobby moves through without fully inhabiting.",
        ],
      },
      {
        heading: "Rhythm in the Architecture",
        paragraphs: [
          "Stoops, fire escapes, and linked facades help the rendering operate like a musical score. The eye keeps moving, but the structure also keeps revealing who is connected and who is left outside that connection.",
          "That is the real value of the images here: they let the production test how architecture can carry comedy, movement, and emotional estrangement at the same time.",
        ],
      },
    ],
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

function mergeRenderingImages(
  currentImages: LocalRenderingProjectImage[],
  nextImages?: Array<Partial<LocalRenderingProjectImage>>
) {
  if (!nextImages?.length) return currentImages;

  return currentImages.map((image, index) => {
    const override = nextImages[index];
    if (!override) return image;

    return {
      ...image,
      ...override,
      imageUrl: override.imageUrl ?? image.imageUrl,
      altText: override.altText ?? image.altText,
      caption: override.caption ?? image.caption,
      sortOrder: override.sortOrder ?? image.sortOrder,
    };
  });
}

function applyFileFirstRenderingProject(project: LocalRenderingProject): LocalRenderingProject {
  const fieldOverride = (fileFirstRenderingProjectFieldsBySlug as unknown as Record<
    string,
    Partial<LocalRenderingProject>
  >)[project.slug];
  const contentOverride = (fileFirstRenderingProjectContentBySlug as unknown as Record<
    string,
    Partial<
      Pick<LocalRenderingProject, "images" | "designNotes" | "heroExcerpt" | "bodySections">
    >
  >)[project.slug];

  const nextProject = fieldOverride ? { ...project, ...fieldOverride } : project;
  return {
    ...nextProject,
    ...(contentOverride || {}),
    images: mergeRenderingImages(project.images, contentOverride?.images),
  };
}

function applyRenderingProjectOverrides(project: LocalRenderingProject): LocalRenderingProject {
  const fileFirstProject = applyFileFirstRenderingProject(project);
  const override = RENDERING_PROJECT_OVERRIDES[fileFirstProject.slug];
  return override ? { ...fileFirstProject, ...override } : fileFirstProject;
}

export function getLocalRenderingProjects() {
  return applyBlobMediaManifest(generatedRenderingProjects as LocalRenderingProject[])
    .filter((project) => !EXCLUDED_RENDERING_SLUGS.has(project.slug))
    .map((project) => applyRenderingProjectOverrides(project));
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
  return applyBlobMediaManifest(generatedRenderingGallery as LocalRenderingGalleryItem[])
    .filter((item) => item.project?.slug && !EXCLUDED_RENDERING_SLUGS.has(item.project.slug))
    .map((item) => ({
      ...item,
      project: item.project ? applyRenderingProjectOverrides(item.project as LocalRenderingProject) : null,
    }));
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
