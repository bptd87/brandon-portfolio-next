import type { ComponentType } from "react";
import type { Metadata } from "next";

import {
  AccessibilityPage,
  AboutPage,
  ArticleDetailPage,
  ArticlesPage,
  AssistantScenicDesignPage,
  CollaboratorsPage,
  CreativeStatementPage,
  DesignHistoryTimelinePage,
  DimensionReferencePage,
  ExperientialPortfolioPage,
  ExperientialProjectDetailPage,
  ExperientialSampleDetailPage,
  FAQPage,
  HomePage,
  LinksPage,
  PrivacyPage,
  ProjectsPage,
  RenderingPortfolioPage,
  RenderingProjectDetailPage,
  ResumePage,
  RoscoPaintCalculatorPage,
  ScaleCalculatorPage,
  Scenic3DConverterPage,
  ScenicProjectDetailPage,
  SitemapPage,
  StudioAppsPage,
  StudioDirectoryPage,
  StudioPage,
  StudioTutorialsPage,
  TagDetailPage,
  TeachingPhilosophyPage,
  TermsPage,
  TutorialDetailPage,
} from "../components/legacy/bridges";
import { buildPageMetadata, stripHtml } from "./metadata";
import { ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION, ASSISTANT_SCENIC_DESIGN_SEO_TITLE } from "../shared/localAssistantScenic";
import { getLocalArticleRecordBySlug, getLocalArticles } from "../shared/localArticles";
import { getLocalExperientialProjectBySlug, getLocalExperientialProjects, getLocalExperientialSampleBySlug, getLocalExperientialSamples, getLocalRenderingProjectBySlug, getLocalRenderingProjects } from "../shared/localPortfolios";
import { getLocalScenicProjectBySlug, getLocalScenicProjects } from "../shared/localScenicProjects";
import { getLocalCollaborators, getLocalStudioDirectory, getLocalTutorialBySlug, getLocalTutorials } from "../shared/localStudio";

type PublicComponent = ComponentType<any>;

export type PublicRouteMatch =
  | { kind: "component"; component: PublicComponent }
  | { kind: "redirect"; destination: string };

const staticRouteComponents = new Map<string, PublicComponent>([
  ["", HomePage],
  ["projects", ProjectsPage],
  ["projects/scenic-design", ProjectsPage],
  ["projects/rendering", RenderingPortfolioPage],
  ["projects/experiential", ExperientialPortfolioPage],
  ["articles", ArticlesPage],
  ["about", AboutPage],
  ["about/collaborators", CollaboratorsPage],
  ["about/teaching", TeachingPhilosophyPage],
  ["about/philosophy", TeachingPhilosophyPage],
  ["teaching-philosophy", TeachingPhilosophyPage],
  ["resume", ResumePage],
  ["creative-statement", CreativeStatementPage],
  ["studio", StudioPage],
  ["studio/tutorials", StudioTutorialsPage],
  ["studio/apps", StudioAppsPage],
  ["studio/apps/scale-calculator", ScaleCalculatorPage],
  ["studio/apps/dimension-reference", DimensionReferencePage],
  ["studio/apps/design-history-timeline", DesignHistoryTimelinePage],
  ["studio/apps/rosco-paint-calculator", RoscoPaintCalculatorPage],
  ["studio/apps/scenic-3d-converter", Scenic3DConverterPage],
  ["studio/directory", StudioDirectoryPage],
  ["assistant-scenic-design", AssistantScenicDesignPage],
  ["links", LinksPage],
  ["privacy", PrivacyPage],
  ["terms", TermsPage],
  ["faq", FAQPage],
  ["accessibility", AccessibilityPage],
  ["sitemap", SitemapPage],
]);

const staticRouteMetadata = new Map<string, Metadata>([
  [
    "",
    buildPageMetadata({
      title: "Brandon PT Davis | Scenic Designer",
      description:
        "Union scenic designer in Southern California creating story-driven environments for regional theatre, summer stock, and academic production.",
      pathname: "/",
    }),
  ],
  [
    "projects",
    buildPageMetadata({
      title: "Scenic Design Portfolio",
      description:
        "Portfolio of scenic design projects across musicals, plays, Shakespeare, and regional theatre.",
      pathname: "/projects",
    }),
  ],
  [
    "projects/rendering",
    buildPageMetadata({
      title: "Rendering Portfolio",
      description:
        "Concept images, scenic visualization studies, and rendering projects by Brandon PT Davis.",
      pathname: "/projects/rendering",
    }),
  ],
  [
    "projects/experiential",
    buildPageMetadata({
      title: "Experiential Design Portfolio",
      description:
        "Experiential design projects spanning renderings, technical drawings, and live event documentation.",
      pathname: "/projects/experiential",
    }),
  ],
  [
    "articles",
    buildPageMetadata({
      title: "Scenic Design Articles",
      description:
        "Articles on scenic design, design process, rendering communication, and theatre practice.",
      pathname: "/articles",
      type: "article",
    }),
  ],
  [
    "about",
    buildPageMetadata({
      title: "About Brandon PT Davis",
      description:
        "Southern California scenic designer with production credits across regional theatre, summer stock, and education.",
      pathname: "/about",
    }),
  ],
  [
    "about/collaborators",
    buildPageMetadata({
      title: "Collaborators",
      description:
        "Creative partners, directors, and theatre companies that shape Brandon PT Davis's design practice.",
      pathname: "/about/collaborators",
    }),
  ],
  [
    "about/teaching",
    buildPageMetadata({
      title: "Teaching Philosophy",
      description:
        "Teaching philosophy centered on scenic design process, professional practice, and student growth.",
      pathname: "/about/teaching",
      type: "article",
    }),
  ],
  [
    "resume",
    buildPageMetadata({
      title: "Resume",
      description:
        "Production history, teaching, training, and portfolio-linked scenic design credits.",
      pathname: "/resume",
    }),
  ],
  [
    "creative-statement",
    buildPageMetadata({
      title: "Creative Statement",
      description:
        "Creative statement on architecture, history, collaboration, and narrative storytelling in scenic design.",
      pathname: "/creative-statement",
      type: "article",
    }),
  ],
  [
    "studio",
    buildPageMetadata({
      title: "Studio",
      description:
        "Scenic design studio hub with articles, tutorials, tools, and directory resources.",
      pathname: "/studio",
    }),
  ],
  [
    "studio/tutorials",
    buildPageMetadata({
      title: "Vectorworks Tutorials",
      description:
        "Vectorworks tutorials for scenic designers covering drafting, 3D modeling, rendering, and workflow.",
      pathname: "/studio/tutorials",
      type: "article",
    }),
  ],
  [
    "studio/apps",
    buildPageMetadata({
      title: "Studio Apps",
      description:
        "Interactive tools and utilities for scenic design workflow, drafting, and visualization.",
      pathname: "/studio/apps",
    }),
  ],
  [
    "studio/directory",
    buildPageMetadata({
      title: "Scenic Directory",
      description:
        "Curated directory of scenic resources, organizations, archives, and reference links.",
      pathname: "/studio/directory",
    }),
  ],
  [
    "assistant-scenic-design",
    buildPageMetadata({
      title: ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
      description: ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
      pathname: "/assistant-scenic-design",
      type: "article",
    }),
  ],
  [
    "links",
    buildPageMetadata({
      title: "Links",
      description: "Quick links and destination pages across the Brandon PT Davis site.",
      pathname: "/links",
    }),
  ],
  [
    "privacy",
    buildPageMetadata({
      title: "Privacy",
      description: "Privacy policy for Brandon PT Davis.",
      pathname: "/privacy",
    }),
  ],
  [
    "terms",
    buildPageMetadata({
      title: "Terms",
      description: "Terms of use for Brandon PT Davis.",
      pathname: "/terms",
    }),
  ],
  [
    "faq",
    buildPageMetadata({
      title: "FAQ",
      description: "Frequently asked questions about Brandon PT Davis and this site.",
      pathname: "/faq",
    }),
  ],
  [
    "accessibility",
    buildPageMetadata({
      title: "Accessibility",
      description: "Accessibility statement for Brandon PT Davis.",
      pathname: "/accessibility",
    }),
  ],
  [
    "sitemap",
    buildPageMetadata({
      title: "Sitemap",
      description: "HTML sitemap for Brandon PT Davis.",
      pathname: "/sitemap",
    }),
  ],
]);

export function resolvePublicRoute(segments: string[]): PublicRouteMatch | null {
  const key = segments.join("/");
  const staticComponent = staticRouteComponents.get(key);
  if (staticComponent) {
    return { kind: "component", component: staticComponent };
  }

  if (segments.length === 1 && segments[0] === "project") {
    return { kind: "redirect", destination: "/projects" };
  }

  if (segments[0] === "project" && segments.length === 2) {
    return getLocalScenicProjectBySlug(segments[1])
      ? { kind: "component", component: ScenicProjectDetailPage }
      : null;
  }

  if (segments[0] === "projects" && segments.length === 2) {
    if (segments[1] === "rendering" || segments[1] === "experiential" || segments[1] === "scenic-design") {
      return null;
    }
    return { kind: "redirect", destination: `/project/${segments[1]}` };
  }

  if (segments[0] === "projects" && segments[1] === "rendering" && segments.length === 3) {
    return getLocalRenderingProjectBySlug(segments[2])
      ? { kind: "component", component: RenderingProjectDetailPage }
      : null;
  }

  if (segments[0] === "projects" && segments[1] === "experiential" && segments.length === 3) {
    return getLocalExperientialProjectBySlug(segments[2])
      ? { kind: "component", component: ExperientialProjectDetailPage }
      : null;
  }

  if (
    segments[0] === "projects" &&
    segments[1] === "experiential" &&
    segments.length === 4 &&
    (segments[2] === "rendering" || segments[2] === "technical-drawing" || segments[2] === "live-events")
  ) {
    return getLocalExperientialSampleBySlug(segments[2], segments[3])
      ? { kind: "component", component: ExperientialSampleDetailPage }
      : null;
  }

  if (segments[0] === "articles" && segments.length === 2) {
    return getLocalArticleRecordBySlug(segments[1])
      ? { kind: "component", component: ArticleDetailPage }
      : null;
  }

  if (segments[0] === "studio" && segments[1] === "tutorials" && segments.length === 3) {
    return getLocalTutorialBySlug(segments[2])
      ? { kind: "component", component: TutorialDetailPage }
      : null;
  }

  if (segments[0] === "tags" && segments.length === 2) {
    return { kind: "component", component: TagDetailPage };
  }

  return null;
}

export function resolvePublicMetadata(segments: string[]): Metadata | null {
  const key = segments.join("/");
  const staticMetadata = staticRouteMetadata.get(key);
  if (staticMetadata) return staticMetadata;

  if (segments[0] === "project" && segments.length === 2) {
    const project = getLocalScenicProjectBySlug(segments[1]);
    if (!project) return null;
    return buildPageMetadata({
      title: project.seoTitle || `${project.title} | Scenic Design`,
      description: project.seoDescription || project.excerpt,
      pathname: `/project/${project.slug}`,
      image: project.coverImageUrl,
      keywords: project.seoKeywords || undefined,
      type: "article",
    });
  }

  if (segments[0] === "projects" && segments[1] === "rendering" && segments.length === 3) {
    const project = getLocalRenderingProjectBySlug(segments[2]);
    if (!project) return null;
    return buildPageMetadata({
      title: project.seoTitle || `${project.title} | Rendering`,
      description: project.seoDescription || project.excerpt,
      pathname: `/projects/rendering/${project.slug}`,
      image: project.coverImageUrl,
      keywords: project.seoKeywords || undefined,
      type: "article",
    });
  }

  if (segments[0] === "projects" && segments[1] === "experiential" && segments.length === 3) {
    const project = getLocalExperientialProjectBySlug(segments[2]);
    if (!project) return null;
    return buildPageMetadata({
      title: project.seoTitle || `${project.title} | Experiential Design`,
      description: project.seoDescription || project.summary,
      pathname: `/projects/experiential/${project.slug}`,
      image: project.coverImageUrl,
      type: "article",
    });
  }

  if (
    segments[0] === "projects" &&
    segments[1] === "experiential" &&
    segments.length === 4 &&
    (segments[2] === "rendering" || segments[2] === "technical-drawing" || segments[2] === "live-events")
  ) {
    const sample = getLocalExperientialSampleBySlug(segments[2], segments[3]);
    if (!sample) return null;
    return buildPageMetadata({
      title: `${sample.displayTitle} | ${sample.categoryLabel}`,
      description:
        sample.description ||
        `${sample.categoryLabel} sample from Brandon PT Davis's experiential design portfolio.`,
      pathname: `/projects/experiential/${sample.category}/${sample.slug}`,
      image: sample.imageUrl,
      type: "article",
    });
  }

  if (segments[0] === "articles" && segments.length === 2) {
    const article = getLocalArticleRecordBySlug(segments[1]);
    if (!article) return null;
    return buildPageMetadata({
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      pathname: `/articles/${article.slug}`,
      image: article.coverImageUrl,
      keywords: article.seoKeywords || undefined,
      type: "article",
    });
  }

  if (segments[0] === "studio" && segments[1] === "tutorials" && segments.length === 3) {
    const tutorial = getLocalTutorialBySlug(segments[2]);
    if (!tutorial) return null;
    return buildPageMetadata({
      title: tutorial.seo_title || tutorial.title,
      description:
        tutorial.seo_description ||
        tutorial.description ||
        tutorial.overview ||
        `${tutorial.title} tutorial by Brandon PT Davis.`,
      pathname: `/studio/tutorials/${tutorial.slug}`,
      image: tutorial.cover_image || undefined,
      keywords: tutorial.seo_keywords || undefined,
      type: "article",
    });
  }

  if (segments[0] === "tags" && segments.length === 2) {
    const tagName = segments[1].replace(/-/g, " ");
    return buildPageMetadata({
      title: `${tagName} | Tags`,
      description: `Tagged scenic design content for ${tagName}.`,
      pathname: `/tags/${segments[1]}`,
    });
  }

  return null;
}

export function getStaticPublicParams() {
  const staticPaths = Array.from(staticRouteComponents.keys())
    .filter((key) => key !== "")
    .map((key) => ({ slug: key.split("/") }));

  const scenicProjectPaths = getLocalScenicProjects().map((project) => ({
    slug: ["project", project.slug],
  }));
  const legacyProjectAliases = getLocalScenicProjects().map((project) => ({
    slug: ["projects", project.slug],
  }));
  const renderingPaths = getLocalRenderingProjects().map((project) => ({
    slug: ["projects", "rendering", project.slug],
  }));
  const experientialProjectPaths = getLocalExperientialProjects().map((project) => ({
    slug: ["projects", "experiential", project.slug],
  }));
  const experientialSamplePaths = getLocalExperientialSamples().map((sample) => ({
    slug: ["projects", "experiential", sample.category, sample.slug],
  }));
  const articlePaths = getLocalArticles().map((article) => ({
    slug: ["articles", article.slug],
  }));
  const tutorialPaths = getLocalTutorials().map((tutorial) => ({
    slug: ["studio", "tutorials", tutorial.slug],
  }));

  const tagSlugs = new Set<string>();
  for (const article of getLocalArticles()) {
    for (const tag of article.tags || []) {
      if (tag.slug) tagSlugs.add(tag.slug);
    }
  }
  for (const project of getLocalScenicProjects()) {
    for (const tag of project.tags || []) {
      if (tag.slug) tagSlugs.add(tag.slug);
    }
  }
  const tagPaths = Array.from(tagSlugs).map((slug) => ({
    slug: ["tags", slug],
  }));

  return [
    { slug: [] as string[] },
    ...staticPaths,
    ...scenicProjectPaths,
    ...legacyProjectAliases,
    ...renderingPaths,
    ...experientialProjectPaths,
    ...experientialSamplePaths,
    ...articlePaths,
    ...tutorialPaths,
    ...tagPaths,
  ];
}

export function getSearchableContentForSitemap() {
  return {
    scenicProjects: getLocalScenicProjects(),
    renderingProjects: getLocalRenderingProjects(),
    experientialProjects: getLocalExperientialProjects(),
    articles: getLocalArticles(),
    tutorials: getLocalTutorials(),
    collaborators: getLocalCollaborators(),
    directory: getLocalStudioDirectory(),
  };
}
