import { buildVideoSitemap, xmlResponse } from "../../lib/seo/xml";
import { getLocalArticles, type LocalArticle } from "../../shared/localArticles";
import { getLocalTutorials } from "../../shared/localStudio";
import { LEARNING_PORTAL_ARTICLE_SLUG_SET } from "../../shared/learningPortal";

export const dynamic = "force-static";

function toYouTubeEmbedUrl(url: string) {
  const match = url.match(/[?&]v=([^&]+)/);
  if (match?.[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return url;
}

function isVideoUrl(value: string) {
  return /\.(m4v|mov|mp4|webm)(\?|#|$)/i.test(value) || /\/video\//i.test(value);
}

function collectArticleVideos(article: LocalArticle) {
  const urls = new Set<string>();

  const visit = (value: unknown) => {
    if (!value) return;
    if (typeof value === "string") {
      if (isVideoUrl(value)) urls.add(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "object") {
      for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof nestedValue === "string" && /(?:video|url|src)$/i.test(key) && isVideoUrl(nestedValue)) {
          urls.add(nestedValue);
          continue;
        }
        visit(nestedValue);
      }
    }
  };

  visit(article.content);
  return [...urls];
}

export function GET() {
  const tutorialEntries = getLocalTutorials()
    .filter((tutorial) => tutorial.video_url && tutorial.cover_image)
    .map((tutorial) => ({
      pathname: `/studio/tutorials/${tutorial.slug}`,
      title: tutorial.title,
      description: tutorial.description || tutorial.overview || tutorial.seo_description || tutorial.title,
      thumbnailUrl: String(tutorial.cover_image),
      playerUrl: toYouTubeEmbedUrl(String(tutorial.video_url)),
      publishedAt: tutorial.published_at || tutorial.created_at || tutorial.updated_at,
    }));
  const articleEntries = getLocalArticles()
    .filter((article) => article.coverImageUrl)
    .flatMap((article) => {
      const pathname = LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug)
        ? `/studio/tutorials/${article.slug}`
        : `/articles/${article.slug}`;

      return collectArticleVideos(article).slice(0, 6).map((videoUrl, index) => ({
        pathname,
        title: index === 0 ? article.title : `${article.title} video example ${index + 1}`,
        description: article.seoDescription || article.excerpt || article.title,
        thumbnailUrl: article.coverImageUrl,
        contentUrl: videoUrl,
        publishedAt: article.publishedAt || article.createdAt || article.updatedAt,
      }));
    });

  return xmlResponse(buildVideoSitemap([...tutorialEntries, ...articleEntries]));
}
