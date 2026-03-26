import Link from "next/link";

import {
  decodeHtmlEntities,
  formatArticleDate,
  getArticleHeadingId,
  getArticlePath,
  getYouTubeId,
  resolveArticleBlocks,
} from "./article-utils";
import type { LocalArticle } from "../../../shared/localArticles";
import type { LocalScenicProject } from "../../../shared/localScenicProjects";

function InlineVideo({ url, caption }: { url: string; caption?: string }) {
  if (url.toLowerCase().endsWith(".mp4")) {
    return (
      <figure className="my-12">
        <video className="w-full rounded-[1.25rem] bg-black" controls playsInline preload="metadata">
          <source src={url} type="video/mp4" />
        </video>
        {caption ? (
          <figcaption className="mt-4 text-center text-[0.78rem] uppercase tracking-[0.14em] text-white/42">
            {decodeHtmlEntities(caption)}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  const videoId = getYouTubeId(url);
  if (!videoId) return null;

  return (
    <figure className="my-12">
      <div className="overflow-hidden rounded-[1.25rem] bg-black">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={caption || "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-[0.78rem] uppercase tracking-[0.14em] text-white/42">
          {decodeHtmlEntities(caption)}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ArticleBody({ article }: { article: LocalArticle }) {
  const blocks = resolveArticleBlocks(article);
  let headingIndex = 0;

  return (
    <div className="mx-auto max-w-[56ch]">
      {blocks.map((block, index) => {
        if (!block || typeof block !== "object") return null;

        switch (block.type) {
          case "heading": {
            const level = block.level || 2;
            const headingText = decodeHtmlEntities(block.text || block.content || "");
            const headingId = getArticleHeadingId(headingText, level === 2 ? headingIndex : index);
            if (level === 2) headingIndex += 1;

            if (level === 2) {
              return (
                <h2
                  key={index}
                  id={headingId}
                  className="mt-20 scroll-mt-28 font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white"
                >
                  {headingText}
                </h2>
              );
            }

            if (level === 3) {
              return (
                <h3
                  key={index}
                  id={headingId}
                  className="mt-14 font-sans text-[clamp(1.55rem,2vw,2.05rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white"
                >
                  {headingText}
                </h3>
              );
            }

            return (
              <h4
                key={index}
                id={headingId}
                className="mt-10 text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-white/48"
              >
                {headingText}
              </h4>
            );
          }
          case "paragraph":
            return (
              <p
                key={index}
                className="mb-8 text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/78"
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(block.text || block.content || "") }}
              />
            );
          case "quote":
            return (
              <blockquote key={index} className="my-14 border-l border-white/14 pl-6">
                <p className="font-sans text-[clamp(1.35rem,2vw,1.85rem)] font-medium leading-[1.25] tracking-[-0.04em] text-white">
                  “{decodeHtmlEntities(block.text || block.content || "")}”
                </p>
                {block.author ? (
                  <footer className="mt-4 text-[0.78rem] uppercase tracking-[0.16em] text-white/42">
                    {decodeHtmlEntities(block.author)}
                  </footer>
                ) : null}
              </blockquote>
            );
          case "image":
            return (
              <figure key={index} className="my-12 overflow-hidden rounded-[1.25rem] border border-white/10">
                <img
                  src={block.url}
                  alt={block.alt || block.caption || ""}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full"
                />
                {block.caption ? (
                  <figcaption className="border-t border-white/10 bg-white/[0.03] px-4 py-3 text-center text-[0.78rem] uppercase tracking-[0.14em] text-white/42">
                    {decodeHtmlEntities(block.caption)}
                  </figcaption>
                ) : null}
              </figure>
            );
          case "gallery":
            return (
              <section key={index} className="my-14">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {(block.images || []).map((image: { url: string; alt?: string; caption?: string }, imageIndex: number) => (
                    <figure
                      key={imageIndex}
                      className="overflow-hidden rounded-[1.25rem] border border-white/10 bg-white/[0.03]"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.caption || ""}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full"
                      />
                      {image.caption ? (
                        <figcaption className="border-t border-white/10 px-4 py-3 text-[0.76rem] uppercase tracking-[0.14em] text-white/42">
                          {decodeHtmlEntities(image.caption)}
                        </figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
              </section>
            );
          case "video":
            return <InlineVideo key={index} url={block.url || ""} caption={block.caption} />;
          case "list": {
            const ListTag = block.listType === "numbered" ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`my-8 space-y-3 pl-6 text-[1.02rem] leading-[1.8] text-white/78 ${
                  block.listType === "numbered" ? "list-decimal" : "list-disc"
                }`}
              >
                {(block.items || []).map((item: string, itemIndex: number) => (
                  <li key={itemIndex} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item) }} />
                ))}
              </ListTag>
            );
          }
          case "faq":
            return (
              <section key={index} className="my-14 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
                <div className="space-y-3">
                  {(block.items || []).map((item: { question?: string; answer?: string }, faqIndex: number) => (
                    <details
                      key={faqIndex}
                      className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-4"
                    >
                      <summary className="cursor-pointer list-none font-medium tracking-[-0.02em] text-white">
                        {decodeHtmlEntities(item.question || "")}
                      </summary>
                      <div
                        className="prose prose-invert mt-4 max-w-none prose-p:my-4 prose-p:text-white/76 prose-a:text-white prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: item.answer || "" }}
                      />
                    </details>
                  ))}
                </div>
              </section>
            );
          case "html":
            return (
              <div
                key={index}
                className="mb-8 text-[1.03rem] leading-[1.9] text-white/78 [&_p]:mb-4 [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            );
          case "text":
            return (
              <div
                key={index}
                className="mb-8 text-[1.03rem] leading-[1.9] text-white/78 [&_p]:mb-4 [&_p]:leading-[1.9]"
                dangerouslySetInnerHTML={{ __html: block.content || "" }}
              />
            );
          case "image_placeholder":
            return (
              <figure key={index} className="my-12 rounded-[1.25rem] border border-dashed border-white/14 p-6">
                <div className="aspect-video rounded-[1rem] border border-white/10 bg-black/20" />
                <figcaption className="mt-4 space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/42">Image placeholder</p>
                  <p className="font-sans text-[1.2rem] font-medium tracking-[-0.04em] text-white">
                    {decodeHtmlEntities(block.title || "Planned image")}
                  </p>
                  {block.note ? <p className="text-[0.98rem] leading-7 text-white/60">{decodeHtmlEntities(block.note)}</p> : null}
                </figcaption>
              </figure>
            );
          case "ai_prompt":
            return (
              <div key={index} className="my-10 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  AI prompt
                </p>
                <pre className="whitespace-pre-wrap font-mono text-[0.92rem] leading-7 text-white/78">
                  {block.prompt || block.content?.prompt || block.content || ""}
                </pre>
              </div>
            );
          case "update_note":
            return (
              <div key={index} className="my-10 rounded-[1.25rem] border border-white/12 bg-white/[0.03] p-5">
                <p
                  className="text-[0.96rem] leading-7 text-white/78"
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(block.text || block.content || "") }}
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function RelatedProjectCard({ project }: { project: LocalScenicProject }) {
  return (
    <Link href={`/project/${project.slug}`} className="group block">
      <article className="flex gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/16 hover:bg-white/[0.045]">
        <div className="h-24 w-24 flex-none overflow-hidden rounded-[0.95rem] bg-black/35">
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <h3 className="font-sans text-[1.12rem] font-medium leading-[1.08] tracking-[-0.04em] text-white">
            {project.title}
          </h3>
          <p className="mt-2 text-[0.88rem] leading-6 text-white/52">
            {project.client || project.subcategory || "Scenic design"}
            {project.year ? ` • ${project.year}` : ""}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function ArticleDetail({
  article,
  relatedArticles,
  linkedScenicProjects,
}: {
  article: LocalArticle;
  relatedArticles: LocalArticle[];
  linkedScenicProjects: LocalScenicProject[];
}) {
  const publishedDate = formatArticleDate(article.publishedAt || article.createdAt || null);

  return (
    <main className="bg-background text-foreground">
      <article className="container max-w-[88rem] py-24 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.24em] text-white/42">
            {publishedDate ? <time dateTime={article.publishedAt || article.createdAt || ""}>{publishedDate}</time> : null}
            {article.categoryName ? <span>{article.categoryName}</span> : null}
            {article.readTime ? <span>{article.readTime} min read</span> : null}
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-sans text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.075em] text-white">
            {decodeHtmlEntities(article.title)}
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-[1.05rem] leading-8 text-white/58 md:text-[1.12rem]">
            {decodeHtmlEntities(article.excerpt)}
          </p>

          {article.series ? (
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-white/40">
              Part {article.series.order} of {article.series.name}
            </p>
          ) : null}

          {article.coverImageUrl ? (
            <figure className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/30">
              <img
                src={article.coverImageUrl}
                alt={article.coverImageAlt || article.title}
                className="h-auto w-full"
                loading="eager"
                decoding="async"
              />
            </figure>
          ) : null}

          {article.audio ? (
            <div className="mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-[0.92rem] text-white/68">
              <audio controls preload="metadata" src={article.audio.url} className="h-8" />
              <span>{article.audio.label || "Listen to article"}</span>
              {article.audio.durationLabel ? <span>{article.audio.durationLabel}</span> : null}
            </div>
          ) : null}
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-16 xl:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            <ArticleBody article={article} />

            {article.tags && article.tags.length > 0 ? (
              <div className="mt-16 border-t border-white/10 pt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Tags
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[0.88rem] text-white/64"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {relatedArticles.length > 0 ? (
              <div className="mt-16 border-t border-white/10 pt-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/40">
                  Related
                </p>
                <h2 className="mt-3 font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.06em] text-white">
                  More articles from this archive
                </h2>
                <div className="mt-8 grid gap-5 lg:grid-cols-3">
                  {relatedArticles.slice(0, 3).map((related) => (
                    <Link
                      key={related.slug}
                      href={getArticlePath(related.slug)}
                      className="group rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/16 hover:bg-white/[0.045]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                        {related.categoryName}
                      </p>
                      <h3 className="mt-4 font-sans text-[1.25rem] font-medium leading-[1.08] tracking-[-0.04em] text-white">
                        {decodeHtmlEntities(related.title)}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-[0.94rem] leading-7 text-white/56">
                        {decodeHtmlEntities(related.excerpt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-8">
            {article.sourcePublication ? (
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Source publication
                </p>
                <p className="mt-3 text-[1.02rem] leading-7 text-white/76">{article.sourcePublication}</p>
                {article.sourceUrl ? (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex text-[0.92rem] text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
                  >
                    Read original
                  </a>
                ) : null}
              </section>
            ) : null}

            {linkedScenicProjects.length > 0 ? (
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                  Linked projects
                </p>
                <div className="mt-4 space-y-4">
                  {linkedScenicProjects.map((project) => (
                    <RelatedProjectCard key={project.slug} project={project} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Back to archive</p>
              <p className="mt-3 text-[1.02rem] leading-7 text-white/76">
                Return to the article archive to browse the current local snapshot.
              </p>
              <Link
                href="/articles"
                className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-[0.92rem] text-white/70 transition-colors hover:border-white/18 hover:text-white"
              >
                View all articles
              </Link>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
