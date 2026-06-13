"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  Facebook,
  FileText,
  Linkedin,
  Link2,
  Mail,
  MapPin,
} from "lucide-react";

import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
import {
  formatUpcomingDateRange,
  productionEvents,
  type UpcomingProduction,
} from "@shared/upcomingProductions";

type UpcomingProductionDetailProps = {
  production: UpcomingProduction;
};

function getAbsoluteImageUrl(imageUrl: string) {
  if (/^https?:\/\//.test(imageUrl)) return imageUrl;
  return `https://www.brandonptdavis.com${imageUrl}`;
}

const STATE_MAP_IMAGES: Record<string, { src: string; alt: string }> = {
  IA: {
    src: "/upcoming-productions/maps/iowa-dark.png",
    alt: "United States map with Iowa highlighted in purple.",
  },
  MO: {
    src: "/upcoming-productions/maps/missouri-dark.png",
    alt: "United States map with Missouri highlighted in purple.",
  },
  CA: {
    src: "/upcoming-productions/maps/california-dark.png",
    alt: "United States map with California highlighted in purple.",
  },
};

const LOCATION_DESCRIPTIONS: Record<string, string> = {
  "Costa Mesa":
    "A coastal Orange County city known for its blend of modern design, independent businesses, culinary culture, and proximity to Southern California's beaches and creative industries.",
  Irvine:
    "A master-planned city in Southern California known for its universities, technology industry, and strong focus on design, education, and innovation.",
  Macon:
    "A small Midwestern town in northern Missouri with deep agricultural roots and a close connection to regional arts and community theatre traditions.",
  Okoboji:
    "A lakeside resort community in northwest Iowa best known for tourism, summer entertainment, and the long-running Okoboji Summer Theatre.",
};

function ContextCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  description,
  className = "",
}: {
  href: string;
  icon: typeof Building2;
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`group flex min-h-[13.5rem] flex-col justify-between rounded-[1.6rem] bg-white p-6 shadow-[0_24px_70px_rgba(17,17,17,0.07)] transition-transform duration-300 hover:-translate-y-1 md:p-7 ${className}`}
    >
      <div>
        <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[#111111]/42">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[clamp(1.55rem,2.5vw,2.35rem)] font-medium leading-[0.98] tracking-[-0.06em] text-[#111111]">
          {title}
        </h2>
        <p className="mt-4 max-w-[28rem] text-[1rem] leading-[1.45] tracking-[-0.025em] text-[#111111]/56">
          {description}
        </p>
      </div>
      <span className="mt-8 inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-[-0.02em] text-[#7c35ff]">
        Open
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </span>
    </a>
  );
}

function ProductionLocationCard({ production }: { production: UpcomingProduction }) {
  const stateMap = STATE_MAP_IMAGES[production.location.region];
  const locationDescription =
    LOCATION_DESCRIPTIONS[production.location.city] ||
    "A geographic marker for where this production is scheduled, paired with the theatre and listing links below.";

  return (
    <aside className="rounded-[1.6rem] bg-[#050505] p-6 text-white md:col-span-2 md:p-7">
      <div className="grid gap-8 md:grid-cols-[0.82fr_1.18fr] md:items-end">
        <div>
          <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111111]">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white/45">
            Production Location
          </p>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.35rem)] font-medium leading-[0.92] tracking-[-0.07em] text-white">
            {production.location.city}, {production.location.region}
          </h2>
          <p className="mt-4 max-w-[30rem] text-[1rem] leading-[1.45] tracking-[-0.025em] text-white/58">
            {locationDescription}
          </p>
        </div>
        <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[1.2rem] bg-[#050505]">
          {stateMap ? (
            <img
              src={stateMap.src}
              alt={stateMap.alt}
              loading="lazy"
              className="h-full w-full object-contain opacity-100"
            />
          ) : (
            <span className="text-[1.1rem] font-medium tracking-[-0.03em] text-[#111111]/45">
              {production.location.region}
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}

function ProductionContextCards({ production }: { production: UpcomingProduction }) {
  return (
    <section className="mx-auto mt-16 grid max-w-[52rem] gap-4 md:grid-cols-2">
      <ContextCard
        href={production.companyUrl}
        icon={Building2}
        eyebrow="Theatre Company"
        title={production.company}
        description={`Visit ${production.company} for season information, tickets, and venue context.`}
      />
      <ContextCard
        href={production.sourceUrl}
        icon={CalendarDays}
        eyebrow="Production Listing"
        title={production.sourceLabel}
        description="Open the published listing used for dates, production context, and public event information."
      />
      <ProductionLocationCard production={production} />
      {production.portfolioHref ? (
        <ContextCard
          href={production.portfolioHref}
          icon={FileText}
          eyebrow="Portfolio Record"
          title={production.portfolioLabel || "Related portfolio project"}
          description="Continue into the scenic design portfolio entry connected to this production record."
          className="md:col-span-2 md:min-h-[12rem]"
        />
      ) : null}
    </section>
  );
}

function ProductionShareLine({
  company,
  companyUrl,
  encodedTitle,
  encodedUrl,
  handleShare,
  linkCopied,
}: {
  company: string;
  companyUrl: string;
  encodedTitle: string;
  encodedUrl: string;
  handleShare: () => void;
  linkCopied: boolean;
}) {
  return (
    <div className="mx-auto mt-14 w-full max-w-[52rem] px-6 md:px-10">
      <div className="flex items-center justify-between gap-6 border-y border-[#111111]/10 py-7">
        <a
          href={companyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="min-w-0 truncate text-left text-[1.02rem] font-medium tracking-[-0.025em] text-[#111111]/64 transition-colors hover:text-[#111111]"
        >
          {company}
        </a>
        <nav aria-label="Share this production" className="flex shrink-0 items-center gap-6 text-[#111111]/46">
          <button
            type="button"
            onClick={handleShare}
            className="transition-colors hover:text-[#111111]"
            aria-label={linkCopied ? "Link copied" : "Copy link"}
          >
            {linkCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
          </button>
          <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} className="transition-colors hover:text-[#111111]" aria-label="Share by email">
            <Mail className="h-5 w-5" />
          </a>
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#111111]" aria-label="Share on LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#111111]" aria-label="Share on Facebook">
            <Facebook className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </div>
  );
}

function ProductionExploreRail({ currentId }: { currentId: string }) {
  const productions = productionEvents.filter((item) => item.id !== currentId);
  const railItems = [...productions, ...productions];

  if (!productions.length) return null;

  return (
    <section className="relative left-1/2 mt-20 w-screen -translate-x-1/2 overflow-hidden bg-[#f1f0ec] py-12 md:mt-24 md:py-14">
      <div className="mx-auto mb-7 flex w-full max-w-[88rem] items-end justify-between gap-6 px-6 md:px-10">
        <div>
          <p className="text-[1.04rem] tracking-[-0.035em] text-[#111111]/50">
            Production archive
          </p>
          <h2 className="mt-2 max-w-[12ch] bg-gradient-to-r from-[#2458ff] via-[#6f2dff] to-[#7c3cff] bg-clip-text font-sans text-[clamp(2.25rem,4vw,4.9rem)] font-medium leading-[0.9] tracking-[-0.08em] text-transparent">
            Explore more productions.
          </h2>
        </div>
        <a
          href="/upcoming-productions"
          className="hidden rounded-full border border-[#7c35ff]/48 px-5 py-3 text-[0.95rem] font-medium tracking-[-0.02em] text-[#7c35ff] transition-colors hover:border-[#7c35ff] hover:bg-[#7c35ff] hover:text-white sm:inline-flex"
        >
          View all
        </a>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="production-explore-track flex w-max gap-4 py-3"
          aria-label="Explore more upcoming and archived productions"
        >
          {railItems.map((item, index) => (
            <a
              key={`${item.id}-${index}`}
              href={`/upcoming-productions/${item.id}`}
              className="group relative h-[17rem] w-[15rem] shrink-0 overflow-hidden rounded-[1.35rem] bg-black md:h-[20rem] md:w-[18rem]"
            >
              <img
                src={item.imageUrl}
                alt={item.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover opacity-78 transition duration-500 group-hover:scale-[1.025] group-hover:opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/58">
                  {item.status === "archived" ? "Archive" : "Upcoming"}
                </p>
                <h3 className="mt-2 text-[1.42rem] font-medium leading-[0.95] tracking-[-0.06em] text-white">
                  {item.title}
                </h3>
                <p className="mt-3 truncate text-[0.9rem] tracking-[-0.025em] text-white/62">
                  {item.company}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UpcomingProductionDetail({ production }: UpcomingProductionDetailProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const pagePath = `/upcoming-productions/${production.id}`;
  const pageUrl = `https://www.brandonptdavis.com${pagePath}`;
  const pageLabel = production.status === "archived" ? "Production Archive" : "Upcoming Production";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(`${production.title} | Brandon PT Davis`);

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
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title={`${production.title} | ${pageLabel} | Brandon PT Davis`}
        description={production.description}
        image={getAbsoluteImageUrl(production.imageUrl)}
        imageAlt={production.imageAlt}
        url={pageUrl}
        type="article"
        keywords={`${production.title}, ${production.company}, ${production.director}, Brandon PT Davis, scenic design`}
      />
      <StructuredData
        type="Event"
        event={{
          name: production.title,
          description: production.description,
          startDate: production.startDate,
          endDate: production.endDate,
          image: getAbsoluteImageUrl(production.imageUrl),
          url: pageUrl,
          eventStatus: production.status === "archived" ? "EventScheduled" : "EventScheduled",
          eventAttendanceMode: "OfflineEventAttendanceMode",
          location: {
            name: production.venue,
            address: {
              addressLocality: production.location.city,
              addressRegion: production.location.region,
              addressCountry: "US",
            },
          },
          performer: {
            name: production.director,
            jobTitle: "Director",
          },
        }}
      />

      <Header />
      <AboutNav />

      <article className="pb-20">
        <header className="site-media-square relative isolate w-full overflow-hidden bg-black text-white">
          <img
            src={production.imageUrl}
            alt={production.imageAlt}
            loading="eager"
            fetchPriority="high"
            className="site-media-square aspect-[16/9] min-h-[30rem] w-full object-cover object-center md:min-h-[38rem]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.76)_100%)]" />
          <div className="absolute inset-0 flex items-end justify-center px-6 py-12 text-center md:px-10 md:py-16">
            <div className="mx-auto max-w-[76rem]">
              <p className="text-[0.92rem] font-semibold uppercase tracking-[0.14em] text-white/72">
                {production.status === "archived" ? pageLabel : "Upcoming Productions"}
              </p>
              <h1 className="mx-auto mt-5 max-w-[13ch] font-sans text-[clamp(3.25rem,8vw,8rem)] font-medium leading-[0.84] tracking-[-0.09em] text-white">
                {production.title}
              </h1>
              <p className="mx-auto mt-7 max-w-[42rem] text-[clamp(1.05rem,1.5vw,1.32rem)] leading-[1.25] tracking-[-0.035em] text-white/76">
                {production.subtitle}
              </p>
            </div>
          </div>
        </header>

        <ProductionShareLine
          company={production.company}
          companyUrl={production.companyUrl}
          encodedTitle={encodedTitle}
          encodedUrl={encodedUrl}
          handleShare={handleShare}
          linkCopied={linkCopied}
        />

        <div className="mx-auto w-full px-6 md:px-10">
          <div className="mx-auto mt-14 max-w-[52rem]">
            <time
              dateTime={production.startDate}
              className="block text-[clamp(1.9rem,3vw,2.8rem)] font-medium leading-[1] tracking-[-0.065em] text-[#111111]"
            >
              {formatUpcomingDateRange(production)}
            </time>
            <div className="mt-8 space-y-7">
              {production.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[1.08rem] leading-[1.72] tracking-[-0.015em] text-[#111111]/72"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ProductionContextCards production={production} />
          <ProductionExploreRail currentId={production.id} />
        </div>
      </article>

      <Footer tone="light" />
    </div>
  );
}
