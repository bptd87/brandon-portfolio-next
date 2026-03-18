import { ArrowRight, BookOpen, Calendar, Play, Wrench } from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";

const apps = [
  {
    title: "Scenic 3D Converter (Mac)",
    description:
      "Finder quick action workflow to convert 3D files locally into Vectorworks-friendly USD, USDZ, and 3DM outputs.",
    image: "/assets/studio/studio-app-scenic-3d-converter.png",
    href: "/studio/apps/scenic-3d-converter",
    category: "Utility",
    cta: "Open tool",
  },
  {
    title: "Scale Calculator",
    description:
      "Convert between architectural and model scales for drafting, model building, and production workflow.",
    image: "/assets/studio/studio-app-scale-calculator.png",
    href: "/studio/apps/scale-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
  {
    title: "Dimension Reference",
    description:
      "Quick reference for standard dimensions and unit conversions in scenic and production design.",
    image: "/assets/studio/studio-app-dimension-reference.png",
    href: "/studio/apps/dimension-reference",
    category: "Reference",
    cta: "Open reference",
  },
  {
    title: "Rosco Paint Calculator",
    description:
      "Professional scenic paint mixing calculator for Rosco Off-Broadway paints and color matching workflows.",
    image: "/assets/studio/studio-app-rosco-paint-calculator.png",
    href: "/studio/apps/rosco-paint-calculator",
    category: "Calculator",
    cta: "Launch app",
  },
] as const;

const studioLinks = [
  {
    title: "Articles",
    href: "/articles",
    category: "Writing",
    imageTitle: "Articles",
    description: "Process notes, scenic design practice, drafting decisions, and production-facing writing.",
    cta: "Read articles",
    image: "/assets/studio/studio-articles-cover.png",
  },
  {
    title: "Tutorials",
    href: "/studio/tutorials",
    category: "Video",
    imageTitle: "Tutorials",
    description: "Walkthroughs for drafting, rendering, and workflow built for scenic designers.",
    cta: "Watch tutorials",
    image: "/assets/studio/studio-tutorials-cover.png",
  },
  {
    title: "Scenic Directory",
    href: "/studio/directory",
    category: "Reference",
    imageTitle: "Scenic Directory",
    description: "A curated shelf of resources, archives, organizations, and research references.",
    cta: "Browse directory",
    image: "/assets/studio/studio-directory-cover.png",
  },
] as const;

function formatArticleDate(value?: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Studio() {
  const { data: articles = [] } = trpc.articles.list.useQuery({
    status: "published",
  });

  const latestArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Scenic Design Education Studio | Free Tools & Tutorials"
        description="Scenic design education hub with articles, Vectorworks tutorials, interactive tools, and curated references for theatre designers."
        keywords="scenic design education, Vectorworks tutorials, scenic design tools, theatre design resources, stage design learning"
        type="website"
        url="https://www.brandonptdavis.com/studio"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Studio",
          url: "https://www.brandonptdavis.com/studio",
          description: "Studio hub for scenic design tools, tutorials, and articles.",
          about: "Scenic design education and workflow resources by Brandon PT Davis.",
          primaryImageOfPage: articles?.[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: "Studio Resources",
            itemListElement: [
              ...studioLinks.map((item, index) => ({
                position: index + 1,
                name: item.title,
                url: `https://www.brandonptdavis.com${item.href}`,
              })),
              ...apps.map((app, index) => ({
                position: studioLinks.length + index + 1,
                name: app.title,
                url: `https://www.brandonptdavis.com${app.href}`,
                image: `https://www.brandonptdavis.com${app.image}`,
              })),
            ],
          },
        }}
      />

      <Header />

      <main className="px-6 pb-24 pt-24 md:pt-28">
        <section className="mx-auto max-w-6xl border-b border-border/18 pb-14">
          <AnimatedSection>
            <div className="mx-auto max-w-4xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
                Studio
              </p>
              <h1 className="mt-5 font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                Scenic design resources for working practice.
              </h1>
              <p className="mx-auto mt-7 max-w-3xl text-[1.02rem] leading-8 text-foreground/62 md:text-[1.12rem]">
                A studio index for articles, tutorials, and tools that support scenic drafting,
                research, rendering, and production workflow.
              </p>
            </div>
          </AnimatedSection>
        </section>

        <section className="mx-auto mt-14 max-w-[92rem]">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                Studio Index
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Articles, tutorials, and references in one place.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {studioLinks.map((item, index) => (
              <AnimatedSection key={item.title} delay={index * 70}>
                <Link href={item.href} className="group block">
                  <article className="border-t border-border/14 pt-4">
                    <div className="relative overflow-hidden rounded-[1rem] border border-border/16 bg-card/10">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                      {item.imageTitle ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
                          <div className="absolute inset-0 bg-black/10" />
                          <p className="relative max-w-[11ch] font-sans text-[1.55rem] font-medium leading-[0.94] tracking-[-0.055em] text-white md:text-[1.75rem]">
                            {item.imageTitle}
                          </p>
                        </div>
                      ) : null}
                      <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/5" />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        {item.category}
                      </p>
                    </div>

                    <h3 className="mt-3 font-sans text-[1.28rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[34rem] text-[0.93rem] leading-6 text-foreground/60">
                      {item.description}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-medium text-foreground/68 transition-colors group-hover:text-foreground">
                      {item.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-[92rem] border-t border-border/18 pt-16">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                App Studio
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Practical tools for scenic design workflow.
              </h2>
            </div>
          </AnimatedSection>

          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {apps.map((app, index) => (
              <AnimatedSection key={app.title} delay={index * 70}>
                <Link href={app.href} className="group block">
                  <article className="border-t border-border/14 pt-4">
                    <div className="relative overflow-hidden rounded-[1rem] border border-border/16 bg-card/10">
                      <img
                        src={app.image}
                        alt={app.title}
                        className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/5" />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                        {app.category}
                      </p>
                    </div>

                    <h3 className="mt-3 font-sans text-[1.28rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                      {app.title}
                    </h3>
                    <p className="mt-3 max-w-[34rem] text-[0.93rem] leading-6 text-foreground/60">
                      {app.description}
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-medium text-foreground/68 transition-colors group-hover:text-foreground">
                      {app.cta}
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </article>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/studio/apps"
              className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-foreground/62 transition-colors hover:text-foreground"
            >
              View all studio tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-[92rem] border-t border-border/18 pt-16">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                Latest Articles
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Recent writing from the studio.
              </h2>
            </div>
          </AnimatedSection>

          {latestArticles.length > 0 ? (
            <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {latestArticles.map((article, index) => (
                <AnimatedSection key={article.id} delay={index * 70}>
                  <Link href={`/articles/${article.slug}`} className="group block">
                    <article className="border-t border-border/14 pt-4">
                      <div className="relative overflow-hidden rounded-[1rem] border border-border/16 bg-card/10">
                        {article.coverImageUrl ? (
                          <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="flex aspect-square w-full items-center justify-center bg-card/10">
                            <BookOpen className="h-10 w-10 text-foreground/28" />
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-inset ring-white/5" />
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                          {article.category?.name || "Article"}
                        </p>
                        {article.publishedAt ? (
                          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-foreground/34">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatArticleDate(article.publishedAt)}
                          </div>
                        ) : null}
                      </div>

                      <h3 className="mt-3 font-sans text-[1.28rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                        {article.title}
                      </h3>
                      {article.excerpt ? (
                        <p className="mt-3 max-w-[34rem] text-[0.93rem] leading-6 text-foreground/60">
                          {article.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-medium text-foreground/68 transition-colors group-hover:text-foreground">
                        Read article
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="mt-10 border-t border-border/14 pt-8 text-center text-foreground/52">
                Articles coming soon.
              </div>
            </AnimatedSection>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
