"use client";

import { ArrowUpRight } from "lucide-react";

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

function ProductionCard({
  index,
  production,
}: {
  index: number;
  production: UpcomingProduction;
}) {
  const imageFirst = index % 2 === 0;

  return (
    <a
      href={`/upcoming-productions/${production.id}`}
      className="group grid overflow-hidden rounded-[1.7rem] bg-white shadow-[0_18px_55px_rgba(20,18,15,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(20,18,15,0.13)] lg:grid-cols-2"
    >
      <div className={`site-media-square overflow-hidden bg-black ${imageFirst ? "" : "lg:order-2"}`}>
        <img
          src={production.imageUrl}
          alt={production.imageAlt}
          loading="lazy"
          className="site-media-square aspect-[16/9] h-full w-full object-cover transition duration-500 group-hover:scale-[1.018] lg:aspect-auto"
        />
      </div>
      <div className="flex min-h-[25rem] flex-col justify-between p-7 md:p-9 lg:min-h-[31rem] lg:p-12">
        <div>
          <p className="text-[0.95rem] font-medium tracking-[-0.02em] text-[#111111]/48">
            {formatUpcomingDateRange(production)}
          </p>
          <h2 className="mt-5 max-w-[12ch] font-sans text-[clamp(2.75rem,5.2vw,6rem)] font-medium leading-[0.9] tracking-[-0.08em] text-[#111111]">
            {production.title}
          </h2>
          <p className="mt-5 max-w-[30rem] text-[clamp(1.08rem,1.6vw,1.35rem)] leading-[1.25] tracking-[-0.04em] text-[#111111]/62">
            {production.subtitle}
          </p>
          <p className="mt-6 max-w-[34rem] text-[1.02rem] leading-[1.58] tracking-[-0.015em] text-[#111111]/64">
            {production.description}
          </p>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#111111]/10 pt-5">
          <span className="min-w-0 truncate text-[0.96rem] font-medium tracking-[-0.02em] text-[#111111]/68">
            {production.company}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-[#6f2dff] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
      </div>
    </a>
  );
}

function UpcomingProductionCards() {
  return (
    <section className="px-5 pb-12 pt-2 md:px-8 md:pb-16">
      <div className="mx-auto max-w-[88rem]">
        <div className="mb-7 md:mb-9">
          <p className="text-[1.14rem] tracking-[-0.04em] text-[#111111]/54">
            2026 season
          </p>
          <h2 className="mt-2 max-w-[12ch] bg-gradient-to-r from-[#2458ff] via-[#6f2dff] to-[#7c3cff] bg-clip-text font-sans text-[clamp(2.9rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.08em] text-transparent">
            The season ahead.
          </h2>
        </div>

        <div className="grid gap-5 md:gap-6">
          {upcomingProductions.map((production, index) => (
            <ProductionCard key={production.id} index={index} production={production} />
          ))}
        </div>
      </div>
    </section>
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
    <header className="mx-auto max-w-[58rem] py-10 text-center md:py-12">
      <div className="text-[1.1rem] tracking-[-0.035em] text-[#111111]/52">{eyebrow}</div>
      <h2 className="mx-auto mt-4 max-w-[12ch] font-sans text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.92] tracking-[-0.075em] text-[#111111]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-[34rem] text-[clamp(1rem,1.22vw,1.14rem)] leading-[1.4] tracking-[-0.025em] text-[#111111]/62">
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
        image="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/upcoming-productions/upcoming-productions-hero.webp"
        imageAlt="Abstract stage calendar graphic for upcoming scenic design productions."
        url="https://www.brandonptdavis.com/upcoming-productions"
        keywords="Brandon PT Davis upcoming productions, scenic design 2026, Okoboji Summer Theatre, Maples Repertory Theatre, New Swan Shakespeare Festival"
      />

      <Header />
      <AboutNav />

      <ProfileSectionHero
        canonicalPath="/upcoming-productions"
        description="Current and archived scenic design productions, gathered as a working calendar of upcoming shows and production records."
        descriptionClassName="!max-w-[31rem] !leading-[1.22]"
        imageAlt="Calendar and stage marquee icon for upcoming productions"
        imageSrc="/images/about/icons/upcoming-icon.png"
        title="Upcoming Productions"
        updatedAt="May 22, 2026"
      />

      <main className="bg-[#f1f0ec] pb-20 pt-6">
        <UpcomingProductionCards />

        <section className="px-6 pt-8 md:px-10 md:pt-10">
          <div className="mx-auto w-full max-w-[88rem]">
            <ProductionSectionHeader
              eyebrow="Archive"
              title="Past Productions"
              description="Selected production archives that connect public event pages to the full scenic design portfolio."
            />
            <div className="grid gap-5 md:gap-6">
              {archivedProductionEvents.map((production, index) => (
                <ProductionCard key={production.id} index={index} production={production} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
