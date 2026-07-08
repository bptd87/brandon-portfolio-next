export type ProjectArtifactCategory =
  | "drafting"
  | "paint-elevations"
  | "research"
  | "graphics"
  | "sketches";

export type ProjectArtifactItem = {
  id: string;
  title: string;
  category: ProjectArtifactCategory;
  imageUrl: string;
  altText: string;
  width: number;
  height: number;
  display?: "wide" | "portrait" | "sheet";
};

export type ProjectArtifactCollection = {
  slug: string;
  projectSlug: string;
  projectTitle: string;
  title: string;
  eyebrow: string;
  summary: string;
  year: number;
  client: string;
  coverImageUrl: string;
  items: ProjectArtifactItem[];
};

export const PROJECT_ARTIFACT_CATEGORY_LABELS: Record<ProjectArtifactCategory, string> = {
  drafting: "Drafting",
  "paint-elevations": "Paint elevations",
  research: "Research",
  graphics: "Graphics",
  sketches: "Sketches",
};

export const projectArtifactCollections = [
  {
    slug: "head-over-heels",
    projectSlug: "head-over-heels",
    projectTitle: "Head Over Heels",
    title: "Head Over Heels Artifacts",
    eyebrow: "Scenic design artifacts",
    summary:
      "Procreate graphic studies inspired by Keith Haring's line work, developed for scenic graphics in the Theatre SilCo production.",
    year: 2023,
    client: "Theatre SilCo",
    coverImageUrl:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/production-photo-0a088b2c72.jpeg",
    items: [
      {
        id: "head-over-heels-production-context",
        title: "Production Context",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/production-photo-0a088b2c72.jpeg",
        altText: "Production context image for Head Over Heels at Theatre SilCo.",
        width: 886,
        height: 886,
        display: "wide",
      },
      {
        id: "head-over-heels-blue-temple-study",
        title: "Temple Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/blue-temple-study-57cd62a76d.jpeg",
        altText: "Procreate temple graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 2172,
        height: 1448,
        display: "wide",
      },
      {
        id: "head-over-heels-red-tent-study",
        title: "Red Tent Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/red-tent-study-98ad23c701.jpeg",
        altText: "Red tent Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 768,
        height: 1024,
        display: "portrait",
      },
      {
        id: "head-over-heels-bright-tree-study",
        title: "Tree Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/bright-tree-study-82fec5f18d.jpeg",
        altText: "Bright tree Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 886,
        height: 886,
        display: "sheet",
      },
      {
        id: "head-over-heels-green-tree-study",
        title: "Green Tree Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/green-tree-study-47446b14e8.jpeg",
        altText: "Green tree Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 724,
        height: 1086,
        display: "portrait",
      },
      {
        id: "head-over-heels-red-column-study",
        title: "Column Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/red-column-study-61c08207e7.jpeg",
        altText: "Red column Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 768,
        height: 1024,
        display: "portrait",
      },
      {
        id: "head-over-heels-serpent-study",
        title: "Serpent Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/serpent-study-56c5d4f175.jpeg",
        altText: "Serpent Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 768,
        height: 1024,
        display: "portrait",
      },
      {
        id: "head-over-heels-gold-arcade-study",
        title: "Arcade Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/gold-arcade-study-d49351dc10.jpeg",
        altText: "Arcade Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 768,
        height: 1024,
        display: "portrait",
      },
      {
        id: "head-over-heels-blue-tent-study",
        title: "Blue Tent Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/blue-tent-study-c67fd4058f.jpeg",
        altText: "Blue tent Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 886,
        height: 886,
        display: "sheet",
      },
      {
        id: "head-over-heels-yellow-tent-study",
        title: "Yellow Tent Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/yellow-tent-study-81885935ce.jpeg",
        altText: "Yellow tent Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 724,
        height: 1086,
        display: "portrait",
      },
      {
        id: "head-over-heels-kneeling-serpent-study",
        title: "Serpent Figure Graphic Study",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/head-over-heels/kneeling-serpent-study-ca22d78b6f.jpeg",
        altText: "Serpent figure Procreate graphic study for Head Over Heels inspired by Keith Haring line work.",
        width: 768,
        height: 1024,
        display: "portrait",
      },
    ],
  },
  {
    slug: "tomas-and-the-library-lady",
    projectSlug: "tomas-and-the-library-lady",
    projectTitle: "Tomás and the Library Lady",
    title: "Tomás and the Library Lady Artifacts",
    eyebrow: "Scenic design artifacts",
    summary:
      "Drafting, paint elevations, rendering studies, and build references from the Lake Dillon Theatre Company production.",
    year: 2022,
    client: "Lake Dillon Theatre Company",
    coverImageUrl:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/bookcase-build-wide-75d09acebd.jpeg",
    items: [
      {
        id: "tomas-bookcase-build-wide",
        title: "Bookcase Build",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/bookcase-build-wide-75d09acebd.jpeg",
        altText: "Bookcase build view for Tomás and the Library Lady.",
        width: 1536,
        height: 2048,
        display: "portrait",
      },
      {
        id: "tomas-production-stage",
        title: "Production Stage",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/production-stage-59d3f1bea7.jpeg",
        altText: "Production view of Tomás and the Library Lady scenic design at Lake Dillon Theatre Company.",
        width: 1536,
        height: 2048,
        display: "portrait",
      },
      {
        id: "tomas-ground-plan",
        title: "Ground Plan",
        category: "drafting",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/ground-plan-b659a1c74b.jpeg",
        altText: "Ground plan drafting plate for Tomás and the Library Lady.",
        width: 1086,
        height: 724,
        display: "sheet",
      },
      {
        id: "tomas-stage-deck-drafting",
        title: "Stage Deck Drafting",
        category: "drafting",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/stage-deck-drafting-a2a8dda48e.jpeg",
        altText: "Stage deck drafting plate for Tomás and the Library Lady.",
        width: 1086,
        height: 724,
        display: "sheet",
      },
      {
        id: "tomas-floor-paint-elevation",
        title: "Floor Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/floor-paint-elevation-37e8f1a06e.jpeg",
        altText: "Floor paint elevation plate for Tomás and the Library Lady.",
        width: 1086,
        height: 722,
        display: "sheet",
      },
      {
        id: "tomas-bookcase-detail",
        title: "Bookcase Detail",
        category: "drafting",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/bookcase-detail-121455619a.jpeg",
        altText: "Bookcase detail drafting plate for Tomás and the Library Lady.",
        width: 1086,
        height: 722,
        display: "sheet",
      },
      {
        id: "tomas-library-rendering-study",
        title: "Library Rendering Study",
        category: "sketches",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/library-rendering-study-938c1ec728.jpeg",
        altText: "Library rendering study for Tomás and the Library Lady.",
        width: 1182,
        height: 665,
        display: "wide",
      },
      {
        id: "tomas-bookcase-paint-elevation",
        title: "Bookcase Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/bookcase-paint-elevation-032f136731.jpeg",
        altText: "Bookcase paint elevation plate for Tomás and the Library Lady.",
        width: 1086,
        height: 722,
        display: "sheet",
      },
      {
        id: "tomas-process-candid",
        title: "Process Candid",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/process-candid-b166b76164.jpeg",
        altText: "Process reference image from Tomás and the Library Lady.",
        width: 1536,
        height: 2048,
        display: "portrait",
      },
      {
        id: "tomas-bookcase-build-detail",
        title: "Bookcase Build Detail",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/bookcase-build-detail-12e6a3dfb6.jpeg",
        altText: "Bookcase build detail for Tomás and the Library Lady.",
        width: 1536,
        height: 2048,
        display: "portrait",
      },
      {
        id: "tomas-production-stage-with-crew",
        title: "Production Stage With Crew",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/tomas-and-the-library-lady/production-stage-with-crew-89d8ab7514.jpeg",
        altText: "Production stage view with crew for Tomás and the Library Lady.",
        width: 1536,
        height: 2048,
        display: "portrait",
      },
    ],
  },
  {
    slug: "the-glass-menagerie",
    projectSlug: "the-glass-menagerie",
    projectTitle: "The Glass Menagerie",
    title: "The Glass Menagerie Artifacts",
    eyebrow: "Scenic design artifacts",
    summary:
      "Selected drafting, paint elevations, graphics, and research references from the Maples Repertory Theatre production.",
    year: 2025,
    client: "Maples Repertory Theatre",
    coverImageUrl:
      "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-library-research-02-8032077d2c.jpeg",
    items: [
      {
        id: "glass-menagerie-production-reference",
        title: "Production Reference",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-library-research-02-8032077d2c.jpeg",
        altText: "Production reference image for The Glass Menagerie scenic design.",
        width: 1280,
        height: 915,
        display: "wide",
      },
      {
        id: "glass-menagerie-ground-plan",
        title: "Ground Plan",
        category: "drafting",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-ground-plan-no-frame-405863ff5b.jpg",
        altText: "Ground plan drafting plate for The Glass Menagerie scenic design.",
        width: 2836,
        height: 1836,
        display: "wide",
      },
      {
        id: "glass-menagerie-stage-deck",
        title: "Stage Deck Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-paint-elevation-01-no-frame-ed92393dc6.jpg",
        altText: "Stage deck paint elevation sheet for The Glass Menagerie.",
        width: 2868,
        height: 2120,
        display: "sheet",
      },
      {
        id: "glass-menagerie-fire-escape",
        title: "Fire Escape Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-paint-elevation-02-no-frame-2e7764c8d2.jpg",
        altText: "Fire escape paint elevation and texture reference sheet for The Glass Menagerie.",
        width: 2868,
        height: 2120,
        display: "sheet",
      },
      {
        id: "glass-menagerie-brick-wall",
        title: "Brick Wall Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-paint-elevation-03-no-frame-c0a4793240.jpg",
        altText: "Brick wall paint elevation sheet for The Glass Menagerie.",
        width: 2868,
        height: 2120,
        display: "sheet",
      },
      {
        id: "glass-menagerie-interior-wall",
        title: "Interior Wall Paint Elevation",
        category: "paint-elevations",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-paint-elevation-04-no-frame-2cb38f3c37.jpg",
        altText: "Interior wall paint elevation sheet for The Glass Menagerie.",
        width: 2868,
        height: 2120,
        display: "sheet",
      },
      {
        id: "glass-menagerie-printed-graphics",
        title: "Printed Graphics Paint Elevation",
        category: "graphics",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-paint-elevation-05-no-frame-9943cc0e56.jpg",
        altText: "Printed graphics paint elevation sheet for The Glass Menagerie.",
        width: 2868,
        height: 2120,
        display: "sheet",
      },
      {
        id: "glass-menagerie-library-exterior",
        title: "Library Exterior Reference",
        category: "research",
        imageUrl:
          "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/projects/artifacts/the-glass-menagerie/glass-menagerie-library-research-01-7a628443d0.jpeg",
        altText: "Exterior building research reference for The Glass Menagerie scenic design.",
        width: 1024,
        height: 1280,
        display: "portrait",
      },
    ],
  },
] satisfies ProjectArtifactCollection[];

export function getProjectArtifactCollections() {
  return projectArtifactCollections;
}

export function getProjectArtifactCollectionBySlug(slug: string) {
  return projectArtifactCollections.find((collection) => collection.slug === slug);
}

export function getProjectArtifactCollectionByProjectSlug(projectSlug: string) {
  return projectArtifactCollections.find((collection) => collection.projectSlug === projectSlug);
}
