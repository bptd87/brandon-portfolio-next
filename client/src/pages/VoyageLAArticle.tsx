import { ArrowUpRight, Check, Clock, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voyageLaArticle } from "@shared/publicContent";

const estimateReadTime = () => {
  const words = voyageLaArticle.sections.reduce((count, section) => {
    const paragraphWords = section.paragraphs.reduce(
      (sum, paragraph) => sum + paragraph.split(/\s+/).filter(Boolean).length,
      0,
    );
    const bulletWords = (section.bullets || []).reduce(
      (sum, bullet) => sum + bullet.split(/\s+/).filter(Boolean).length,
      0,
    );
    return count + paragraphWords + bulletWords + section.title.split(/\s+/).filter(Boolean).length;
  }, 0);

  return Math.max(1, Math.ceil(words / 200));
};

export default function VoyageLAArticle() {
  const [linkCopied, setLinkCopied] = useState(false);
  const readTime = estimateReadTime();

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      setLinkCopied(false);
    }
  };

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

      <article className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-5xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.96rem] tracking-[-0.02em] text-foreground/58">
              <time dateTime={new Date(voyageLaArticle.publishedAt).toISOString()}>
                {new Date(voyageLaArticle.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              <Link href={`/articles?category=${encodeURIComponent(voyageLaArticle.categoryName)}`}>
                <a className="transition-colors hover:text-foreground">{voyageLaArticle.categoryName}</a>
              </Link>
            </div>

            <h1 className="mx-auto mt-6 max-w-[15ch] font-sans text-[clamp(2.4rem,5vw,5.2rem)] font-normal leading-[0.94] tracking-[-0.06em] text-foreground">
              {voyageLaArticle.title}
            </h1>

            <p className="mx-auto mt-6 max-w-[44rem] text-[clamp(1.04rem,1.6vw,1.55rem)] leading-[1.5] tracking-[-0.02em] text-foreground/78">
              {voyageLaArticle.excerpt}
            </p>

            <div className="mx-auto mt-10 max-w-[82rem] overflow-hidden rounded-xl">
              <ProgressiveImage
                src={voyageLaArticle.coverImageUrl}
                alt={voyageLaArticle.coverImageAlt}
                loading="eager"
                className="h-auto w-full"
              />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-[58rem] items-center justify-between gap-6 border-y border-white/14 py-4 text-foreground/72">
              <span className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em]">
                <Clock className="h-4 w-4" />
                {readTime} min read
              </span>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-foreground"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[58rem]">
            <div className="mx-auto max-w-[58ch]">
              {voyageLaArticle.sections.map((section) => (
                <section key={section.title} className="border-t border-white/12 py-12 first:border-t-0 first:pt-0">
                  <h2 className="mb-5 font-sans text-[1.9rem] font-normal leading-[1.08] tracking-[-0.04em] text-foreground">
                    {section.title}
                  </h2>

                  <div className="space-y-7">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-[1.08rem] leading-[1.82] tracking-normal text-foreground/88"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-8 space-y-4 pl-6 text-[1.0625rem] leading-[1.75] text-foreground/84 marker:text-white/55 list-disc">
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {voyageLaArticle.sourceUrl && (
                <div className="mt-4 border-t border-white/12 pt-12">
                  <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-foreground/48">
                    Original publication
                  </p>
                  <a
                    href={voyageLaArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-normal tracking-[-0.03em] text-foreground transition-colors hover:text-foreground/75"
                  >
                    Read the VoyageLA interview
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div className="mt-16 border-t border-white/12 pt-12">
                <div className="flex items-start gap-6">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border border-white/12">
                    <img
                      src="/brandon%20pt%20davis.jpeg"
                      alt="Brandon PT Davis"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 font-sans text-2xl font-normal tracking-[-0.04em] text-foreground">
                      Brandon PT Davis
                    </h3>
                    <p className="mb-4 text-sm uppercase tracking-[0.16em] text-foreground/48">Scenic Designer</p>
                    <p className="leading-relaxed text-foreground/78">
                      Brandon PT Davis is a scenic designer based in Los Angeles. His work explores physical space,
                      digital technology, and story-driven environments for live performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <div className="relative z-20 bg-background">
        <Footer />
      </div>
    </div>
  );
}
