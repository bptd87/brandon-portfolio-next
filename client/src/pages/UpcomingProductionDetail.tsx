"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUpcomingDateRange, type UpcomingProduction } from "@shared/upcomingProductions";

type UpcomingProductionDetailProps = {
  production: UpcomingProduction;
};

function getAbsoluteImageUrl(imageUrl: string) {
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `https://www.brandonptdavis.com${imageUrl}`;
}

function PortfolioLinkCard({ production }: { production: UpcomingProduction }) {
  if (!production.portfolioHref) return null;

  return (
    <aside className="mx-auto mt-16 max-w-[54rem] border-t border-white/14 pt-10">
      <p className="mb-8 font-sans text-[1.15rem] tracking-[-0.02em] text-white">
        Related Portfolio
      </p>
      <a
        href={production.portfolioHref}
        className="group flex items-start gap-5"
      >
        <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
          <img
            src={production.imageUrl}
            alt={production.imageAlt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.08)_0%,rgba(22,64,133,0.16)_55%,rgba(10,18,38,0.42)_100%)]" />
        </div>
        <div className="min-w-0 pt-1">
          <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
            {production.title}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
            <span>{production.portfolioLabel || "Portfolio project"}</span>
            <span>{production.company}</span>
          </div>
        </div>
      </a>
    </aside>
  );
}

export default function UpcomingProductionDetail({ production }: UpcomingProductionDetailProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const pagePath = `/upcoming-productions/${production.id}`;
  const pageUrl = `https://www.brandonptdavis.com${pagePath}`;
  const pageLabel = production.status === "archived" ? "Production Archive" : "Upcoming Production";

  const handleShare = async () => {
    const url = typeof window === "undefined" ? pageUrl : window.location.href;

    const copied = await copyTextToClipboard(url);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${production.title} | ${pageLabel} | Brandon PT Davis`}
        description={production.description}
        image={getAbsoluteImageUrl(production.imageUrl)}
        imageAlt={production.imageAlt}
        url={pageUrl}
        type="article"
        keywords={`${production.title}, ${production.company}, ${production.director}, Brandon PT Davis, scenic design`}
      />

      <Header />
      <AboutNav />

      <article className="pb-20 pt-12 md:pt-16">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto flex w-full max-w-[62rem] flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
              <time dateTime={production.startDate}>{formatUpcomingDateRange(production)}</time>
            </div>

            <h1 className="mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
              {production.title}
            </h1>

            <p className="mt-8 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
              {production.subtitle}
            </p>

            <div className="mx-auto mt-10 w-full max-w-[62rem] overflow-hidden bg-black">
              <img
                src={production.imageUrl}
                alt={production.imageAlt}
                loading="eager"
                fetchPriority="high"
                className="aspect-[16/9] h-auto w-full object-cover object-center"
              />
            </div>

            <div className="mx-auto mt-8 flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 py-4 text-white/72">
              <a
                href={production.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-w-0 items-center gap-2 text-left text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
              >
                <span className="truncate">{production.sourceLabel}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex shrink-0 items-center justify-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </header>

          <div className="mx-auto mt-14 max-w-[54rem]">
            <div className="space-y-8">
              {production.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <PortfolioLinkCard production={production} />
        </div>
      </article>

      <Footer />
    </div>
  );
}
