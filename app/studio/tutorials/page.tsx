import StudioTutorialsPage from "../../../client/src/pages/StudioTutorials";
import { NextPathProvider } from "../../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata, stripHtml } from "../../../lib/metadata";
import { BRANDON_PERSON_ID, getBreadcrumbJsonLd } from "../../../lib/seo/entities";
import { getLocalArticles } from "../../../shared/localArticles";
import { getLocalTutorials } from "../../../shared/localStudio";
import { LEARNING_PORTAL_ARTICLE_SLUG_SET } from "../../../shared/learningPortal";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Vectorworks Tutorials for Scenic Designers",
  description:
    "Step-by-step Vectorworks tutorials for scenic designers covering drafting, 3D modeling, rendering, and production-ready workflow.",
  pathname: "/studio/tutorials",
  type: "article",
});

function toIsoDate(value?: string | Date | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function getYouTubeId(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes("youtu.be")) {
      return parsedUrl.pathname.replace("/", "") || null;
    }

    if (parsedUrl.pathname.includes("/embed/")) {
      return parsedUrl.pathname.split("/embed/")[1]?.split("/")[0] || null;
    }

    return parsedUrl.searchParams.get("v");
  } catch {
    return null;
  }
}

export default function Page() {
  const learningArticles = getLocalArticles()
    .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
    .map((article) => ({
      title: article.title,
      description: article.seoDescription || article.excerpt || article.title,
      href: `/studio/tutorials/${article.slug}`,
      image: article.coverImageUrl || undefined,
      publishedAt: article.publishedAt || article.createdAt || undefined,
      type: "BlogPosting",
      videoUrl: undefined,
      embedUrl: undefined,
    }));
  const videoTutorials = getLocalTutorials().map((tutorial) => {
    const publishedAt = toIsoDate(tutorial.published_at || tutorial.created_at || tutorial.updated_at);
    const youtubeId = getYouTubeId(tutorial.video_url);
    const hasCompleteVideoSchema = Boolean(tutorial.video_url && tutorial.cover_image && publishedAt);

    return {
      title: tutorial.title,
      description: tutorial.seo_description || tutorial.description || tutorial.overview || tutorial.title,
      href: `/studio/tutorials/${tutorial.slug}`,
      image: tutorial.cover_image || undefined,
      publishedAt,
      type: hasCompleteVideoSchema ? "VideoObject" : "Article",
      videoUrl: hasCompleteVideoSchema ? tutorial.video_url : undefined,
      embedUrl: hasCompleteVideoSchema && youtubeId ? `https://www.youtube.com/embed/${youtubeId}` : undefined,
    };
  });
  const learningItems = [...learningArticles, ...videoTutorials].sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return dateB - dateA;
  });

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/studio/tutorials")}#collection`,
    name: "Scenic Design Learning",
    url: absoluteUrl("/studio/tutorials"),
    description:
      "A scenic design learning portal by Brandon PT Davis with Vectorworks lessons, rendering articles, drafting references, and production workflow guides.",
    inLanguage: "en-US",
    author: {
      "@id": BRANDON_PERSON_ID,
    },
    about: [
      { "@type": "Thing", name: "Scenic Design Learning" },
      { "@type": "Thing", name: "Vectorworks" },
      { "@type": "Thing", name: "Theatre Drafting" },
      { "@type": "Thing", name: "Rendering Workflow" },
    ],
    mainEntity: {
      "@type": "ItemList",
      name: "Latest scenic design learning articles and tutorials",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: Math.min(learningItems.length, 24),
      itemListElement: learningItems.slice(0, 24).map((item, index) => {
        const itemUrl = absoluteUrl(item.href);
        const baseItem = {
          "@type": item.type,
          name: stripHtml(item.title),
          description: stripHtml(item.description),
          url: itemUrl,
          author: {
            "@id": BRANDON_PERSON_ID,
          },
        };
        const structuredItem =
          item.type === "VideoObject"
            ? {
                ...baseItem,
                "@id": `${itemUrl}#video`,
                thumbnailUrl: item.image ? [item.image] : undefined,
                uploadDate: item.publishedAt,
                contentUrl: item.videoUrl,
                embedUrl: item.embedUrl,
              }
            : {
                ...baseItem,
                headline: stripHtml(item.title),
                image: item.image,
                datePublished: item.publishedAt,
              };

        return {
          "@type": "ListItem",
          position: index + 1,
          url: itemUrl,
          item: structuredItem,
        };
      }),
    },
  };

  return (
    <>
      <JsonLdScript
        id="studio-tutorials-archive-json-ld"
        data={[
          getBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Studio", url: absoluteUrl("/studio") },
            { name: "Tutorials", url: absoluteUrl("/studio/tutorials") },
          ]),
          collectionJsonLd,
        ]}
      />
      <NextPathProvider currentPath="/studio/tutorials">
        <StudioTutorialsPage />
      </NextPathProvider>
    </>
  );
}
