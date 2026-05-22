"use client";

import { Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
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
    <div className="mx-auto mt-8 w-full max-w-[62rem]">
      <div className="overflow-hidden bg-black">
        <img
          src={production.imageUrl}
          alt={production.imageAlt}
          loading="lazy"
          className="aspect-[16/9] h-auto w-full object-cover object-center"
        />
      </div>
      <div className="mt-5 flex justify-end text-foreground/62">
        <a
          href={`/upcoming-productions/${production.id}`}
          className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-foreground"
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
      className="py-12 text-center md:py-[4.5rem]"
      id={`${idPrefix}-${production.id}`}
    >
      <header className="mx-auto max-w-[62rem]">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-foreground/52">
          <span>{formatUpcomingDateRange(production)}</span>
        </div>
        <h2 className="mx-auto mt-6 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-foreground">
          {production.title}
        </h2>
        <p className="mx-auto mt-4 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.55] tracking-[-0.02em] text-foreground/62">
          {production.subtitle}
        </p>
      </header>

      <ProductionArt production={production} />

      <div className="mx-auto mt-10 max-w-[54rem] text-left">
        <div className="space-y-6">
          {production.body.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[1.03rem] leading-[1.78] tracking-[-0.01em] text-foreground/72"
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
    <header className="mx-auto max-w-[62rem] py-12 text-center md:py-14">
      <div className="text-[0.98rem] tracking-[-0.02em] text-foreground/52">{eyebrow}</div>
      <h2 className="mx-auto mt-5 max-w-[12ch] font-sans text-[clamp(2.8rem,5.5vw,5.6rem)] font-normal leading-[0.9] tracking-[-0.07em] text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-[42rem] text-[clamp(1.05rem,1.35vw,1.24rem)] leading-[1.58] tracking-[-0.02em] text-foreground/62">
        {description}
      </p>
    </header>
  );
}

export default function UpcomingProductions() {
  return (
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Upcoming Productions | Brandon PT Davis"
        description="Upcoming scenic design productions by Brandon PT Davis, including 2026 work with Maples Repertory Theatre, New Swan Shakespeare Festival, and Okoboji Summer Theatre."
        image="https://www.brandonptdavis.com/upcoming-productions/upcoming-productions-hero.webp"
        imageAlt="Abstract stage calendar graphic for upcoming scenic design productions."
        url="https://www.brandonptdavis.com/upcoming-productions"
        keywords="Brandon PT Davis upcoming productions, scenic design 2026, Okoboji Summer Theatre, Maples Repertory Theatre, New Swan Shakespeare Festival"
      />

      <Header />
      <AboutNav />

      <ProfileSectionHero
        canonicalPath="/upcoming-productions"
        description="Upcoming productions, archive links, and current scenic design work organized by season."
        descriptionClassName="!max-w-[34rem]"
        imageAlt="Calendar and stage marquee icon for upcoming productions"
        imageSrc="/images/about/icons/upcoming-icon.png"
        title="Upcoming Productions"
        updatedAt="May 22, 2026"
      />

      <main className="bg-[#f1f0ec] pb-20 pt-10">
        <section className="px-6 md:px-10">
          <div className="mx-auto w-full max-w-[72rem]">
            {upcomingProductions.map((production) => (
              <ProductionArticle key={production.id} idPrefix="upcoming" production={production} />
            ))}
          </div>
        </section>

        <section className="px-6 pt-8 md:px-10 md:pt-10">
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

      <Footer tone="light" />
    </div>
  );
}
