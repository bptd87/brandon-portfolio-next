import type { LocalArticle } from "../../../shared/localArticles";
import type { LocalStudioDirectoryEntry, LocalTutorial } from "../../../shared/localStudio";

const TUTORIAL_CATEGORIES = [
  { slug: "getting-started", name: "Getting Started" },
  { slug: "2d-drafting", name: "2D Drafting" },
  { slug: "3d-modeling", name: "3D Modeling" },
  { slug: "rendering", name: "Rendering" },
] as const;

const DIFFICULTIES = [
  { slug: "beginner", name: "Beginner" },
  { slug: "intermediate", name: "Intermediate" },
  { slug: "advanced", name: "Advanced" },
] as const;

const DIRECTORY_CATEGORY_ORDER = [
  "industry",
  "research",
  "software",
  "modeling",
  "supplies",
] as const;

export const TUTORIAL_CATEGORY_LABELS = TUTORIAL_CATEGORIES;
export const TUTORIAL_DIFFICULTY_LABELS = DIFFICULTIES;

export const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getTutorialCategoryLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return TUTORIAL_CATEGORIES.find((category) => category.slug === normalized)?.name || value || "Tutorial";
};

export const getTutorialDifficultyLabel = (value: string | null | undefined) => {
  const normalized = normalizeToken(value);
  return DIFFICULTIES.find((difficulty) => difficulty.slug === normalized)?.name || value || "General";
};

export const getTutorialSummary = (tutorial: LocalTutorial) => {
  if (tutorial.description && String(tutorial.description).trim()) {
    return tutorial.description;
  }

  const category = getTutorialCategoryLabel(tutorial.category);
  const difficulty = getTutorialDifficultyLabel(tutorial.difficulty);
  const topic = tutorial.title
    .replace(/^Vectorworks Tutorial:\s*/i, "")
    .replace(/^Vectorworks Quick Tip:\s*/i, "")
    .trim();

  return `${category} tutorial covering ${topic} with a ${difficulty.toLowerCase()} workflow focus.`;
};

export const formatTutorialDuration = (duration: LocalTutorial["duration"]) => {
  if (!duration) return "10 min";

  if (typeof duration === "string") {
    if (duration.includes(":")) {
      const [mins] = duration.split(":");
      return `${mins || duration} min`;
    }

    return duration;
  }

  return `${Math.max(1, Math.floor(Number(duration) / 60))} min`;
};

export const formatDate = (value?: string | Date | null) => {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatLongDate = (value?: string | Date | null) => {
  if (!value) return null;

  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const sortTutorialsNewest = (tutorials: LocalTutorial[]) =>
  [...tutorials].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });

export const getYouTubeId = (url?: string | null) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  return match ? match[1] : null;
};

export const getYouTubeEmbedUrl = (url?: string | null) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

export const getYouTubeThumbnail = (url?: string | null) => {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
};

export const getArticleDate = (article: LocalArticle) =>
  article.publishedAt || article.createdAt || article.updatedAt || null;

export const formatArticleDate = (article: LocalArticle) => formatDate(getArticleDate(article));

export const sortArticlesNewest = (articles: LocalArticle[]) =>
  [...articles].sort((a, b) => {
    const dateA = new Date(getArticleDate(a) || 0).getTime();
    const dateB = new Date(getArticleDate(b) || 0).getTime();
    return dateB - dateA;
  });

export const getDirectoryPlaceholder = (name: string) => {
  const value = String(name || "resource");
  const hash = value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
  const hueA = (hash * 0.82 + 12) % 360;
  const hueB = (hash * 1.19 + 96) % 360;
  const hueC = (hash * 1.57 + 208) % 360;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${value}"><defs><clipPath id="clip"><circle cx="32" cy="32" r="28"/></clipPath><filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.8"/></filter><filter id="paper" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${hash % 97}"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 0.035"/></feComponentTransfer></filter></defs><g clip-path="url(#clip)"><rect width="64" height="64" fill="#f4efe7"/><rect width="64" height="64" fill="hsl(${hueA} 32% 92%)" opacity="0.42"/><g filter="url(#soft)"><ellipse cx="22" cy="21" rx="22" ry="16" fill="hsla(${hueA} 88% 60% / 0.70)" transform="rotate(-14 22 21)"/><ellipse cx="44" cy="29" rx="18" ry="13" fill="hsla(${hueB} 92% 56% / 0.58)" transform="rotate(18 44 29)"/><ellipse cx="30" cy="45" rx="21" ry="15" fill="hsla(${hueC} 84% 58% / 0.54)" transform="rotate(-8 30 45)"/><ellipse cx="46" cy="47" rx="11" ry="8" fill="hsla(${hueA} 98% 72% / 0.36)" transform="rotate(26 46 47)"/><ellipse cx="15" cy="41" rx="10" ry="7" fill="hsla(${hueB} 98% 74% / 0.30)" transform="rotate(-24 15 41)"/></g><rect width="64" height="64" filter="url(#paper)" opacity="0.9"/></g><circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="0.9"/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const groupDirectoryByCategory = (resources: LocalStudioDirectoryEntry[]) => {
  const groups = new Map<string, LocalStudioDirectoryEntry[]>();

  for (const resource of resources) {
    const key = normalizeToken(resource.category_slug || "resource");
    const current = groups.get(key) || [];
    current.push(resource);
    groups.set(key, current);
  }

  const orderedGroups = DIRECTORY_CATEGORY_ORDER.map((slug) => ({
    slug,
    name:
      resources.find((item) => normalizeToken(item.category_slug || "") === slug)?.category_name ||
      slug,
    items: groups.get(slug) || [],
  })).filter((group) => group.items.length > 0);

  const remainingGroups = Array.from(groups.entries())
    .filter(([slug]) => !DIRECTORY_CATEGORY_ORDER.includes(slug as (typeof DIRECTORY_CATEGORY_ORDER)[number]))
    .map(([slug, items]) => ({
      slug,
      name:
        items[0]?.category_name ||
        slug
          .split("-")
          .filter(Boolean)
          .map((part) => part[0].toUpperCase() + part.slice(1))
          .join(" "),
      items,
    }));

  return [...orderedGroups, ...remainingGroups];
};
