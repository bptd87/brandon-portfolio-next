"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  archivedProductionEvents,
  formatUpcomingDateRange,
  type UpcomingProduction,
  upcomingProductions,
} from "@shared/upcomingProductions";

function ProductionArt({
  production,
}: {
  production: UpcomingProduction;
}) {
  return (
    <div className="mx-auto mt-10 w-full max-w-[62rem]">
      <div className="overflow-hidden bg-black">
        <img
          src={production.imageUrl}
          alt={production.imageAlt}
          loading="lazy"
          className="aspect-[16/9] h-auto w-full object-cover object-center"
        />
      </div>
      <div className="mt-8 flex justify-end border-t border-white/14 pt-6 text-white/72">
        <a
          href={`/upcoming-productions/${production.id}`}
          className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
          {production.company}
        </a>
      </div>
    </div>
  );
}

function ProductionArticle({
  idPrefix,
  production,
}: {
  idPrefix: "upcoming" | "past";
  production: UpcomingProduction;
}) {
  return (
    <article
      className="py-16 text-center md:py-24"
      id={`${idPrefix}-${production.id}`}
    >
      <header className="mx-auto max-w-[62rem]">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
          <span>{formatUpcomingDateRange(production)}</span>
        </div>
        <h2 className="mx-auto mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
          {production.title}
        </h2>
        <p className="mx-auto mt-6 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
          {production.subtitle}
        </p>
      </header>

      <ProductionArt production={production} />

      <div className="mx-auto mt-14 max-w-[54rem] text-left">
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
    </article>
  );
}

function ProductionSectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mx-auto max-w-[62rem] py-16 text-center md:py-20">
      <div className="text-[0.98rem] tracking-[-0.02em] text-white/56">{eyebrow}</div>
      <h2 className="mx-auto mt-7 max-w-[12ch] font-sans text-[clamp(2.8rem,5.5vw,5.6rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
        {title}
      </h2>
      <p className="mx-auto mt-7 max-w-[42rem] text-[clamp(1.05rem,1.35vw,1.24rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
        {description}
      </p>
    </header>
  );
}

export default function UpcomingProductions() {
  const [pageLinkCopied, setPageLinkCopied] = useState(false);

  const handleSharePage = async () => {
    const path = "/upcoming-productions";
    const url =
      typeof window === "undefined" ? `https://www.brandonptdavis.com${path}` : `${window.location.origin}${path}`;

    const copied = await copyTextToClipboard(url);
    if (copied) {
      setPageLinkCopied(true);
      window.setTimeout(() => setPageLinkCopied(false), 1800);
    } else {
      setPageLinkCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Upcoming Productions | Brandon PT Davis"
        description="Upcoming scenic design productions by Brandon PT Davis, including 2026 work with Maples Repertory Theatre, New Swan Shakespeare Festival, and Okoboji Summer Theatre."
        image="https://www.brandonptdavis.com/upcoming-productions/upcoming-productions-hero.webp"
        imageAlt="Abstract stage calendar graphic for upcoming scenic design productions."
        url="https://www.brandonptdavis.com/upcoming-productions"
        keywords="Brandon PT Davis upcoming productions, scenic design 2026, Okoboji Summer Theatre, Maples Repertory Theatre, New Swan Shakespeare Festival"
      />

      <Header />

      <main className="pb-20">
        <section className="px-6 py-12 md:px-10 md:py-16">
          <header className="mx-auto flex w-full max-w-[62rem] flex-col items-center text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
              <span>Upcoming Productions</span>
              <span>2026</span>
            </div>
            <h1 className="mx-auto mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
              Scenic Design Calendar
            </h1>
            <p className="mt-8 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
              Upcoming scenic design work organized by production, theatre company, director, and
              season dates.
            </p>

            <div className="mt-10 w-full max-w-[62rem] overflow-hidden bg-black">
              <img
                src="/upcoming-productions/upcoming-productions-hero.webp"
                alt="Abstract stage calendar graphic for upcoming scenic design productions."
                className="aspect-[16/9] h-auto w-full object-cover"
                fetchPriority="high"
              />
            </div>

            <div className="mt-8 flex w-full max-w-[62rem] justify-end border-t border-white/14 py-4 text-white/72">
              <button
                type="button"
                onClick={handleSharePage}
                className="inline-flex items-center justify-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white sm:justify-start"
              >
                {pageLinkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                <span>{pageLinkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </header>
        </section>

        <section className="px-6 md:px-10">
          <div className="mx-auto w-full max-w-[72rem]">
            {upcomingProductions.map((production) => (
              <ProductionArticle key={production.id} idPrefix="upcoming" production={production} />
            ))}
          </div>
        </section>

        <section className="px-6 pt-12 md:px-10 md:pt-16">
          <div className="mx-auto w-full max-w-[72rem]">
            <ProductionSectionHeader
              eyebrow="Production Archive"
              title="Past Productions"
              description="Selected production archives that connect public event pages to the full scenic design portfolio."
            />
            {archivedProductionEvents.map((production) => (
              <ProductionArticle key={production.id} idPrefix="past" production={production} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
