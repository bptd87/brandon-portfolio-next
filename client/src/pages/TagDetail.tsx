import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { getProjectPath } from "@/lib/projectRoutes";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Briefcase, FileText, Newspaper } from "lucide-react";
import { Link, useParams } from "wouter";

const INDEXABLE_TAG_MIN_ITEMS = 3;

type TagPageSection = {
  id: string;
  label: string;
  count: number;
  icon: typeof Briefcase;
};

export default function TagDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = trpc.tags.getBySlug.useQuery({ slug: slug || "" });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container flex min-h-[55vh] items-center justify-center">
          <div className="text-sm tracking-[0.02em] text-foreground/48">Loading tag archive...</div>
        </div>
      </div>
    );
  }

  if (!data || !data.tag) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container flex min-h-[55vh] items-center justify-center">
          <div className="max-w-xl text-center">
            <h1 className="font-sans text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground">
              Tag Not Found
            </h1>
            <p className="mt-4 text-[1.02rem] leading-[1.72] text-foreground/64">
              This tag archive is not available on the site right now.
            </p>
            <div className="mt-8">
              <Link
                href="/articles"
                className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/72 transition-colors hover:border-white/20 hover:text-foreground"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { tag, projects, articles, news } = data;
  const totalItems = projects.length + articles.length + news.length;
  const shouldNoindex = totalItems < INDEXABLE_TAG_MIN_ITEMS;
  const canonicalTagSlug = (tag.slug || slug || "").toLowerCase();
  const canonicalTagUrl = `https://www.brandonptdavis.com/tags/${canonicalTagSlug}`;

  const sections: TagPageSection[] = [
    { id: "projects", label: "Projects", count: projects.length, icon: Briefcase },
    { id: "articles", label: "Articles", count: articles.length, icon: FileText },
    { id: "news", label: "News Archive", count: news.length, icon: Newspaper },
  ].filter((section) => section.count > 0);

  return (
    <>
      <SEO
        title={`${tag.name} | Brandon PT Davis`}
        description={`Browse all content tagged with ${tag.name} across projects, articles, and archived news.`}
        url={canonicalTagUrl}
        noindex={shouldNoindex}
      />

      <div className="min-h-screen bg-background text-foreground">
        <Header />

        <main className="pb-20 pt-10 md:pt-14">
          <section className="container max-w-6xl">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.015em] text-foreground/56 transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>

            <div className="mt-10 max-w-4xl border-t border-white/10 pt-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/42">Tag Archive</p>
              <h1 className="mt-4 max-w-[12ch] font-sans text-[clamp(2.8rem,6vw,5.4rem)] font-medium leading-[0.9] tracking-[-0.065em] text-foreground">
                {tag.name}
              </h1>
              <p className="mt-5 max-w-3xl text-[clamp(1.02rem,1.2vw,1.14rem)] leading-[1.72] tracking-[-0.014em] text-foreground/64">
                {totalItems} {totalItems === 1 ? "item" : "items"} gathered across projects, essays, and archived
                site writing.
              </p>
            </div>

            {sections.length > 0 ? (
              <div className="mt-10 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center justify-between border border-white/10 px-4 py-4 text-foreground/72 transition-colors hover:border-white/18 hover:text-foreground"
                    >
                      <span className="inline-flex items-center gap-3 text-[0.98rem] tracking-[-0.015em]">
                        <Icon className="h-4 w-4" />
                        {section.label}
                      </span>
                      <span className="text-sm text-foreground/46">{section.count}</span>
                    </a>
                  );
                })}
              </div>
            ) : null}
          </section>

          <div className="container mt-16 max-w-6xl space-y-18">
            {projects.length > 0 ? (
              <section id="projects" className="border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                    Projects
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-foreground/42">{projects.length}</div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Link key={project.id} href={getProjectPath(project)} className="group block">
                      <div className="space-y-4">
                        {project.coverImageUrl ? (
                          <div className="overflow-hidden bg-black">
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <h3 className="font-sans text-[1.6rem] font-medium leading-[1.02] tracking-[-0.04em] text-foreground transition-colors group-hover:text-foreground/84">
                            {project.title}
                          </h3>
                          <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-white/42">
                            {[project.client, project.year].filter(Boolean).join("  ")}
                          </p>
                          {project.excerpt ? (
                            <p className="line-clamp-3 text-[0.98rem] leading-[1.7] tracking-[-0.012em] text-foreground/58">
                              {project.excerpt}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {articles.length > 0 ? (
              <section id="articles" className="border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                    Articles
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-foreground/42">{articles.length}</div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block border-t border-white/10 pt-4">
                      <div className="space-y-3">
                        <h3 className="font-sans text-[1.45rem] font-medium leading-[1.02] tracking-[-0.04em] text-foreground transition-colors group-hover:text-foreground/84">
                          {article.title}
                        </h3>
                        {article.excerpt ? (
                          <p className="line-clamp-4 text-[0.98rem] leading-[1.72] tracking-[-0.012em] text-foreground/58">
                            {article.excerpt}
                          </p>
                        ) : null}
                        <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-white/42">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Article"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {news.length > 0 ? (
              <section id="news" className="border-t border-white/10 pt-8">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <h2 className="font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-foreground">
                    News Archive
                  </h2>
                  <div className="text-sm tracking-[0.08em] text-foreground/42">{news.length}</div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {news.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group block">
                      <div className="space-y-4">
                        {item.coverImageUrl ? (
                          <div className="overflow-hidden bg-black">
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                            />
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <h3 className="font-sans text-[1.5rem] font-medium leading-[1.02] tracking-[-0.04em] text-foreground transition-colors group-hover:text-foreground/84">
                            {item.title}
                          </h3>
                          {item.excerpt ? (
                            <p className="line-clamp-3 text-[0.98rem] leading-[1.7] tracking-[-0.012em] text-foreground/58">
                              {item.excerpt}
                            </p>
                          ) : null}
                          <p className="text-[0.76rem] font-bold uppercase tracking-[0.24em] text-white/42">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {totalItems === 0 ? (
              <section className="border-t border-white/10 pt-10">
                <p className="max-w-2xl text-[1rem] leading-[1.72] text-foreground/58">
                  No projects, articles, or archived news are attached to this tag yet.
                </p>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
