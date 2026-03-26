import { getLocalArticles } from "./localArticles";
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

export type SiteSearchSection = "Portfolio" | "Writing" | "Studio" | "People";

export type SiteSearchEntry = {
  id: string;
  title: string;
  href: string;
  section: SiteSearchSection;
  kind: string;
  description: string;
  meta?: string;
  keywords: string[];
  featured?: boolean;
  searchText: string;
};

export type SiteSearchResult = SiteSearchEntry & {
  score: number;
};

function normalizeSearchValue(value: string) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function slugifyAnchor(value: string) {
  return normalizeSearchValue(value).replace(/\s+/g, "-");
}

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
  const searchText = uniqueKeywords([
    input.title,
    input.kind,
    input.section,
    input.description,
    input.meta,
    ...keywords,
  ]).join(" ");

  return {
    ...input,
    keywords,
    searchText,
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

export function buildSiteSearchEntries(): SiteSearchEntry[] {
  const scenicEntries = getLocalScenicProjects().map((project) =>
    createEntry({
      id: `scenic:${project.slug}`,
      title: project.title,
      href: `/project/${project.slug}`,
      section: "Portfolio",
      kind: "Scenic Project",
      description: project.excerpt,
      meta: [project.client, project.location, project.year].filter(Boolean).join(" • "),
      featured: project.featured,
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
        featured: project.featured,
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
      keywords: [brand.name, brand.websiteUrl],
    })
  );

  const articleEntries = getLocalArticles().map((article) =>
    createEntry({
      id: `article:${article.slug}`,
      title: article.title,
      href: `/articles/${article.slug}`,
      section: "Writing",
      kind: "Article",
      description: article.excerpt,
      meta: [article.categoryName, article.sourcePublication].filter(Boolean).join(" • "),
      featured: article.featured,
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
      ],
    })
  );

  const collaboratorEntries = getLocalCollaborators().map((collaborator) =>
    createEntry({
      id: `collaborator:${collaborator.slug}`,
      title: collaborator.name,
      href: `/about/collaborators#${slugifyAnchor(collaborator.name)}`,
      section: "People",
      kind: "Collaborator",
      description: collaborator.bio || `${collaborator.name} is featured in the collaborators index.`,
      meta: collaborator.role,
      featured: collaborator.featured,
      keywords: [
        collaborator.name,
        collaborator.slug,
        collaborator.role,
        collaborator.bio,
        collaborator.website,
        collaborator.portfolioUrl,
        collaborator.instagramHandle,
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
    ...scenicEntries,
    ...renderingEntries,
    ...experientialEntries,
    ...brandEntries,
    ...articleEntries,
    ...tutorialEntries,
    ...collaboratorEntries,
    ...assistantEntries,
    ...directoryEntries,
  ];
}

export function searchSiteIndex(entries: SiteSearchEntry[], query: string) {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return [] as SiteSearchResult[];

  const terms = Array.from(new Set(normalizedQuery.split(" ").filter(Boolean)));
  if (terms.length === 0) return [] as SiteSearchResult[];

  const results: SiteSearchResult[] = [];

  for (const entry of entries) {
    let score = 0;
    const title = normalizeSearchValue(entry.title);
    const description = normalizeSearchValue(entry.description);
    const meta = normalizeSearchValue(entry.meta || "");
    const keywords = entry.keywords;
    const text = entry.searchText;

    let matchedTerms = 0;

    for (const term of terms) {
      const inTitle = title.includes(term);
      const startsTitle = title.startsWith(term);
      const inDescription = description.includes(term);
      const inMeta = meta.includes(term);
      const inKeyword = keywords.some((keyword) => keyword.includes(term));
      const inText = text.includes(term);

      if (!(inTitle || inDescription || inMeta || inKeyword || inText)) {
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
    }

    if (matchedTerms !== terms.length) continue;

    if (title === normalizedQuery) score += 28;
    else if (title.includes(normalizedQuery)) score += 14;
    if (text.includes(normalizedQuery)) score += 8;
    if (entry.featured) score += 3;

    results.push({ ...entry, score });
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
