import type { LocalArticle } from "./localArticles";
import { getLocalTutorialBySlug, getLocalTutorials, type LocalTutorial } from "./localStudio";
import { getTutorialArticleBlueprint, type TutorialArticleBlueprint } from "../client/src/data/tutorialArticleBlueprints";

const stripHtml = (value?: string | null) =>
  String(value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getTutorialExcerpt = (tutorial: LocalTutorial) =>
  stripHtml(tutorial.description || tutorial.overview || tutorial.seo_description || tutorial.title);

const escapeHtml = (value?: string | number | null) =>
  String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const blueprintToHtml = (blueprint: TutorialArticleBlueprint, tutorial: LocalTutorial) => {
  const parts: string[] = [];

  parts.push(`<h2>What to notice</h2>`);
  parts.push(`<p>${escapeHtml(blueprint.lead)}</p>`);
  for (const paragraph of blueprint.overview) {
    parts.push(`<p>${escapeHtml(paragraph)}</p>`);
  }

  if (blueprint.readingPath.length) {
    parts.push(`<div class="tutorial-reading-path">`);
    for (const item of blueprint.readingPath) {
      parts.push(
        `<section><p>${escapeHtml(item.label)}</p><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p><p>${escapeHtml(item.detail)}</p></section>`
      );
    }
    parts.push(`</div>`);
  }

  if (blueprint.modules.length) {
    parts.push(`<h2>${escapeHtml(blueprint.modules[0]?.title || "Workflow")}</h2>`);
    for (const module of blueprint.modules) {
      parts.push(`<section><p>${escapeHtml(module.label)}</p><h3>${escapeHtml(module.title)}</h3><p>${escapeHtml(module.body)}</p>`);
      if (module.points.length) {
        parts.push(`<ul>${module.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul>`);
      }
      parts.push(`</section>`);
    }
  }

  parts.push(`<h2>One guiding idea</h2>`);
  parts.push(`<blockquote>${escapeHtml(blueprint.quote)}</blockquote>`);

  for (const section of blueprint.sections) {
    parts.push(`<h2>${escapeHtml(section.number)} ${escapeHtml(section.title)}</h2>`);
    for (const paragraph of section.paragraphs) {
      parts.push(`<p>${escapeHtml(paragraph)}</p>`);
    }
  }

  if (tutorial.related_resources?.length || blueprint.accuracyNotes.length) {
    parts.push(`<h2>Supporting material</h2>`);
    parts.push(
      `<p>Related resources and quick references stay close to the article so the writing can keep moving without hiding the practical details.</p>`
    );
  }

  if (tutorial.related_resources?.length) {
    parts.push(`<h3>Related resources</h3>`);
    parts.push(
      `<ul>${tutorial.related_resources
        .map((resource) => {
          const title = resource.title || resource.url;
          return `<li><a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></li>`;
        })
        .join("")}</ul>`
    );
  }

  if (blueprint.accuracyNotes.length) {
    parts.push(`<h3>Quick reference</h3>`);
    parts.push(`<ul>${blueprint.accuracyNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>`);
  }

  if (blueprint.examQuestions.length) {
    parts.push(`<h2>Potential exam questions</h2>`);
    parts.push(
      `<p>These prompts are written for study or LMS use. They are intentionally presented without answers so they can support learning, review, or Canvas integration without giving the result away on the page.</p>`
    );
    blueprint.examQuestions.forEach((question, index) => {
      parts.push(`<section><h3>Question ${String(index + 1).padStart(2, "0")} of ${String(blueprint.examQuestions.length).padStart(2, "0")}</h3>`);
      parts.push(`<p>${escapeHtml(question.prompt)}</p>`);
      parts.push(`<ol type="A">${question.choices.map((choice) => `<li>${escapeHtml(choice)}</li>`).join("")}</ol></section>`);
    });
  }

  return parts.join("\n");
};

const tutorialContentToBlocks = (tutorial: LocalTutorial) => {
  const sections: Array<Record<string, unknown>> = [];
  const blueprint = getTutorialArticleBlueprint(tutorial.slug);
  const intro = tutorial.overview || tutorial.description || tutorial.seo_description;

  if (tutorial.video_url) {
    sections.push({
      type: "video",
      url: tutorial.video_url,
      caption: tutorial.title,
      playbackMode: "dialog",
    });
  }

  if (blueprint) {
    sections.push({
      type: "html",
      content: blueprintToHtml(blueprint, tutorial),
    });
    return sections;
  }

  if (intro) {
    sections.push({
      type: "paragraph",
      text: stripHtml(intro),
    });
  }

  return sections;
};

export const tutorialToArticle = (tutorial: LocalTutorial): LocalArticle => {
  const publishedAt = tutorial.published_at || tutorial.created_at || new Date(0).toISOString();
  const excerpt = getTutorialExcerpt(tutorial);

  return {
    id: 900000 + tutorial.id,
    slug: tutorial.slug,
    title: tutorial.title.replace(/^Vectorworks Tutorial:\s*/i, "Vectorworks: "),
    status: "published",
    excerpt,
    coverImageUrl: tutorial.cover_image || "",
    coverImageAlt: tutorial.title,
    publishedAt,
    updatedAt: tutorial.updated_at || publishedAt,
    createdAt: tutorial.created_at || publishedAt,
    categoryName: "Tools & Technology",
    seoTitle: tutorial.seo_title || tutorial.title,
    seoDescription: tutorial.seo_description || excerpt,
    seoKeywords: tutorial.seo_keywords || tutorial.tags?.map((tag) => tag.name).join(", ") || null,
    tags: tutorial.tags,
    content: tutorialContentToBlocks(tutorial) as LocalArticle["content"],
    featured: tutorial.featured,
    readTime:
      typeof tutorial.duration === "number"
        ? Math.max(1, Math.ceil(tutorial.duration / 60))
        : null,
  };
};

export const getTutorialArticles = () =>
  getLocalTutorials()
    .filter((tutorial) => tutorial.status === "published")
    .map(tutorialToArticle);

export const getTutorialArticleBySlug = (slug?: string | null) => {
  const tutorial = getLocalTutorialBySlug(slug);
  return tutorial?.status === "published" ? tutorialToArticle(tutorial) : null;
};
