import { ArrowLeft, ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "wouter";

import { Breadcrumb } from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { voyageLaArticle } from "@shared/publicContent";

export default function VoyageLAArticle() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={voyageLaArticle.seoTitle}
        description={voyageLaArticle.seoDescription}
        image={voyageLaArticle.coverImageUrl}
        url={`https://www.brandonptdavis.com/articles/${voyageLaArticle.slug}`}
        type="article"
        publishedTime={new Date(voyageLaArticle.publishedAt).toISOString()}
        modifiedTime={new Date(voyageLaArticle.updatedAt).toISOString()}
      />
      <StructuredData
        type="Article"
        article={{
          headline: voyageLaArticle.title,
          description: voyageLaArticle.excerpt,
          image: voyageLaArticle.coverImageUrl,
          author: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: new Date(voyageLaArticle.publishedAt).toISOString(),
          dateModified: new Date(voyageLaArticle.updatedAt).toISOString(),
          publisher: {
            name: "Brandon PT Davis",
            logo: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          },
          url: `https://www.brandonptdavis.com/articles/${voyageLaArticle.slug}`,
          keywords: [voyageLaArticle.categoryName, "VoyageLA", "scenic design"],
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Articles", url: "https://www.brandonptdavis.com/articles" },
          { name: voyageLaArticle.title, url: `https://www.brandonptdavis.com/articles/${voyageLaArticle.slug}` },
        ]}
      />
      <Header />

      <div className="container py-6">
        <Breadcrumb items={[{ label: "Articles", href: "/articles" }, { label: voyageLaArticle.title }]} />
      </div>

      <section className="pt-10 pb-16">
        <div className="container max-w-5xl">
          <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Articles
          </Link>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border/60 bg-card/20">
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={voyageLaArticle.coverImageUrl}
                alt={voyageLaArticle.coverImageAlt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6 p-7 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#FF9800]">
                {voyageLaArticle.categoryName}
              </p>
              <div className="space-y-4">
                <h1 className="text-4xl font-black tracking-tight md:text-6xl">{voyageLaArticle.title}</h1>
                <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {voyageLaArticle.excerpt}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(voyageLaArticle.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {voyageLaArticle.sourcePublication && (
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em]">
                    {voyageLaArticle.sourcePublication}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container max-w-4xl">
          <div className="space-y-12 rounded-3xl border border-border/60 bg-card/10 p-8 md:p-10">
            {voyageLaArticle.sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="text-2xl font-bold md:text-3xl">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-base leading-relaxed text-muted-foreground md:text-lg">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-2 text-base leading-relaxed text-muted-foreground md:text-lg">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-[#FF9800]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {voyageLaArticle.sourceUrl && (
              <div className="rounded-2xl border border-border bg-background/60 p-5">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-foreground/60">
                  Original publication
                </p>
                <a
                  href={voyageLaArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-base font-semibold text-[#FF9800] transition-opacity hover:opacity-80"
                >
                  Read the VoyageLA interview
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
