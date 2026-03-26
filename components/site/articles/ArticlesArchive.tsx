import Link from "next/link";

import { decodeHtmlEntities, formatArticleDate, getArticlePath } from "./article-utils";
import type { LocalArticle } from "../../../shared/localArticles";

function ArticleCard({ article }: { article: LocalArticle }) {
  const date = formatArticleDate(article.publishedAt || article.createdAt || null);

  return (
    <Link href={getArticlePath(article.slug)} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] transition-all duration-300 hover:border-white/16 hover:bg-white/[0.045]">
        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
          {article.coverImageUrl ? (
            <img
              src={article.coverImageUrl}
              alt={article.coverImageAlt || article.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          ) : null}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/28 via-transparent to-transparent" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
            {article.categoryName ? <span>{article.categoryName}</span> : null}
            {article.readTime ? <span>{article.readTime} min read</span> : null}
          </div>

          <h2 className="mt-4 font-sans text-[1.45rem] font-medium leading-[1.06] tracking-[-0.045em] text-white">
            {decodeHtmlEntities(article.title)}
          </h2>

          <p className="mt-3 line-clamp-3 text-[0.98rem] leading-7 text-white/62">
            {decodeHtmlEntities(article.excerpt)}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 text-[0.88rem] text-white/48">
            <span>{date}</span>
            <span className="transition-colors group-hover:text-white/72">Read article</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function ArticlesArchive({
  articles,
}: {
  articles: LocalArticle[];
}) {
  const featuredArticles = articles.filter((article) => article.featured).slice(0, 3);
  const latestArticles = articles.slice(0, 6);
  const categories = Array.from(
    new Set(articles.map((article) => article.categoryName).filter(Boolean))
  ).sort((a, b) => String(a).localeCompare(String(b)));

  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-white/8">
        <div className="container max-w-[88rem] py-24 md:py-32">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/40">
              Studio writing
            </p>
            <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.07em] text-white">
              Articles that document the work behind the work.
            </h1>
            <p className="mt-6 max-w-3xl text-[1.05rem] leading-8 text-white/58 md:text-[1.12rem]">
              Current articles, essays, and teaching notes pulled from the local snapshot data.
              This archive is rendered directly in Next, with no dependency on the legacy article pages.
            </p>
          </div>
        </div>
      </section>

      {featuredArticles.length > 0 ? (
        <section className="border-b border-white/8">
          <div className="container max-w-[88rem] py-16 md:py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Featured
                </p>
                <h2 className="mt-3 font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white">
                  Selected articles
                </h2>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-b border-white/8">
        <div className="container max-w-[88rem] py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                Categories
              </p>
              <h2 className="mt-3 font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white">
                The current archive
              </h2>
            </div>
            <p className="max-w-xl text-[0.98rem] leading-7 text-white/52">
              The archive is grouped by the same local snapshot data that powers the rebuilt site.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.86rem] text-white/64"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container max-w-[88rem] py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
              Latest
            </p>
            <h2 className="mt-3 font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white">
              Recent articles
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
