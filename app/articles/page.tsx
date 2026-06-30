import type { Metadata } from "next";

import ArticlesPage from "../../client/src/pages/Articles";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { JsonLdScript } from "../../components/seo/JsonLdScript";
import { absoluteUrl, buildPageMetadata, stripHtml } from "../../lib/metadata";
import { BRANDON_PERSON_ID, getBreadcrumbJsonLd } from "../../lib/seo/entities";
import { getTutorialArticles } from "../../shared/articleTutorials";
import { getLocalArticles } from "../../shared/localArticles";
import {
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "../../shared/learningPortal";

export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Scenic Design Articles",
  description:
    "Articles on scenic design, rendering, theatre history, production thinking, tools, and visual storytelling by Brandon PT Davis.",
  pathname: "/articles",
  type: "article",
});

export default function Page() {
  const articles = [...getLocalArticles(), ...getTutorialArticles()]
    .filter((article) => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug))
    .sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return dateB - dateA;
    });

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl("/articles")}#collection`,
    name: "Scenic Design Articles",
    url: absoluteUrl("/articles"),
    description:
      "Articles on scenic design, rendering, theatre history, production thinking, tools, and visual storytelling by Brandon PT Davis.",
    inLanguage: "en-US",
    author: {
      "@id": BRANDON_PERSON_ID,
    },
    about: [
      { "@type": "Thing", name: "Scenic Design" },
      { "@type": "Thing", name: "Theatre Design" },
      { "@type": "Thing", name: "Production Design" },
    ],
    mainEntity: {
      "@type": "ItemList",
      name: "Latest scenic design articles by Brandon PT Davis",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: Math.min(articles.length, 24),
      itemListElement: articles.slice(0, 24).map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/articles/${article.slug}`),
        item: {
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(`/articles/${article.slug}`)}#article`,
          headline: stripHtml(article.title),
          description: stripHtml(article.seoDescription || article.excerpt || article.title),
          url: absoluteUrl(`/articles/${article.slug}`),
          image: article.coverImageUrl || undefined,
          datePublished: article.publishedAt || article.createdAt || undefined,
          author: {
            "@id": BRANDON_PERSON_ID,
          },
        },
      })),
    },
  };

  return (
    <>
      <JsonLdScript
        id="articles-archive-json-ld"
        data={[
          getBreadcrumbJsonLd([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Articles", url: absoluteUrl("/articles") },
          ]),
          collectionJsonLd,
        ]}
      />
      <NextPathProvider currentPath="/articles">
        <ArticlesPage />
      </NextPathProvider>
    </>
  );
}
