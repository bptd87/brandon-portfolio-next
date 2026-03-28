"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
} from "@shared/localAssistantScenic";

const HIGHLIGHT_SLUGS = [
  "assisting-the-play-that-goes-wrong",
  "the-book-club-play-cincinnati-playhouse",
  "native-gardens-pioneer-theatre",
  "bottle-shock-musical-ccae",
  "the-fears-signature-theatre-off-broadway",
  "clue-on-stage-dallas-theatre-center",
] as const;

const UTAH_SEASON_SLUGS = [
  "utah-shakespeare-festival-2025-season",
  "utah-shakespeare-festival-2024-season",
  "utah-shakespeare-festival-2023-season",
  "utah-shakespeare-festival-2022-season",
  "utah-shakespeare-festival-2021-season",
] as const;

const UTAH_MILESTONE_SLUG = "fifth-season-utah-shakespeare-festival";
const JO_WINIARSKI_THEATER_URL = "https://www.jowiniarski.com/theater";
const ASSISTANT_SCENIC_URL = `https://www.brandonptdavis.com${ASSISTANT_SCENIC_DESIGN_PATH}`;
const ASSISTANT_SCENIC_KEYWORDS = [
  "assistant scenic design credits",
  "assistant scenic designer",
  "theatre drafting",
  "regional theatre scenic design",
  "repertory theatre production",
  "Utah Shakespeare Festival",
  "Brandon PT Davis",
].join(", ");

function formatDate(value: string) {
  return formatUtcDate(value, "year");
}

function trimCopy(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength);
  const breakIndex = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, breakIndex > 90 ? breakIndex : maxLength).trim()}...`;
}

function buildEntryMap() {
  const map = new Map<string, (typeof assistantScenicDesignEntries)[number]>();
  for (const entry of assistantScenicDesignEntries) {
    for (const slug of entry.legacyNewsSlugs) {
      map.set(slug, entry);
    }
  }
  return map;
}

function getEntryExternalUrl(entry: (typeof assistantScenicDesignEntries)[number]) {
  if (entry.externalUrl) return entry.externalUrl;
  if (entry.collaborator === "Jo Winiarski") return JO_WINIARSKI_THEATER_URL;
  return null;
}

function getEntryExternalLabel(entry: (typeof assistantScenicDesignEntries)[number]) {
  return entry.externalUrl ? "External source" : "Jo Winiarski website";
}

export default function AssistantScenicDesign() {
  const utahGalleryRef = useRef<HTMLDivElement | null>(null);
  const entryBySlug = buildEntryMap();

  const highlightEntries = HIGHLIGHT_SLUGS.map((slug) => entryBySlug.get(slug)).filter(
    Boolean
  ) as typeof assistantScenicDesignEntries;
  const utahEntries = UTAH_SEASON_SLUGS.map((slug) => entryBySlug.get(slug)).filter(
    Boolean
  ) as typeof assistantScenicDesignEntries;
  const utahMilestone = entryBySlug.get(UTAH_MILESTONE_SLUG) || null;

  const excludedAnchorIds = new Set([
    ...highlightEntries.map((entry) => entry.anchorId),
    ...utahEntries.map((entry) => entry.anchorId),
    ...(utahMilestone ? [utahMilestone.anchorId] : []),
  ]);

  const additionalEntries = assistantScenicDesignEntries.filter(
    (entry) => !excludedAnchorIds.has(entry.anchorId)
  );
  const assistantScenicUpdatedDate = assistantScenicDesignEntries.reduce((latest, entry) => {
    return entry.date > latest ? entry.date : latest;
  }, assistantScenicDesignEntries[0]?.date || "");
  const assistantScenicImages = highlightEntries
    .map((entry) => entry.coverImageUrl)
    .filter((value, index, array): value is string => Boolean(value) && array.indexOf(value) === index);
  const assistantScenicContributors = Array.from(
    new Set(assistantScenicDesignEntries.map((entry) => entry.collaborator).filter(Boolean))
  );

  const scrollUtahGallery = (direction: "prev" | "next") => {
    const container = utahGalleryRef.current;
    if (!container) return;
    const firstFigure = container.querySelector("figure");
    const figureWidth =
      firstFigure instanceof HTMLElement
        ? firstFigure.offsetWidth
        : Math.round(container.clientWidth * 0.3);
    const gap = 24;
    container.scrollBy({
      left: (figureWidth + gap) * (direction === "next" ? 1 : -1),
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={ASSISTANT_SCENIC_DESIGN_SEO_TITLE}
        description={ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION}
        image={highlightEntries[0]?.coverImageUrl}
        keywords={ASSISTANT_SCENIC_KEYWORDS}
        url={ASSISTANT_SCENIC_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Assistant Scenic Design", url: ASSISTANT_SCENIC_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Assistant Scenic Design",
          url: ASSISTANT_SCENIC_URL,
          description: ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
          about:
            "Assistant scenic design credits spanning theatre drafting, design coordination, repertory production, and support for scenic designers Tom Buderwitz and Jo Winiarski.",
          primaryImageOfPage: highlightEntries[0]?.coverImageUrl,
          mainEntity: {
            name: "Assistant Scenic Design Credits",
            itemListElement: assistantScenicDesignEntries.map((entry, index) => ({
              position: index + 1,
              name: entry.title,
              url: `${ASSISTANT_SCENIC_URL}#${entry.anchorId}`,
              datePublished: entry.date,
              image: entry.coverImageUrl,
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Assistant Scenic Design Credits",
          description:
            "Selected assistant scenic design credits by Brandon PT Davis, with featured regional theatre, Off-Broadway, and repertory collaborations.",
          url: ASSISTANT_SCENIC_URL,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Assistant Scenic Design",
          about:
            "A supporting portfolio focused on assistant scenic design, drafting, design coordination, and production communication.",
          mainEntityOfPage: ASSISTANT_SCENIC_URL,
          dateModified: assistantScenicUpdatedDate || undefined,
          keywords: ASSISTANT_SCENIC_KEYWORDS.split(", "),
          image: assistantScenicImages,
          workExample: highlightEntries.map((entry) => ({
            type: "ImageObject" as const,
            contentUrl: entry.coverImageUrl,
            name: entry.title,
            caption: `${entry.title} at ${entry.organization}. Scenic designer ${entry.collaborator}.`,
          })),
          contributor: assistantScenicContributors.map((name) => ({
            type: "Person" as const,
            name,
            roleName: "Scenic Designer",
          })),
        }}
      />
      <Header />

      <section className="border-b border-border py-16 md:py-20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="space-y-6 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Portfolio
              </p>
              <h1 className="mx-auto max-w-[12ch] font-sans text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.07em] text-foreground">
                Assistant Scenic Design
              </h1>
              <p className="mx-auto max-w-[42rem] text-[clamp(1rem,1.35vw,1.22rem)] leading-[1.68] tracking-[-0.015em] text-foreground/66">
                A companion portfolio of assistant scenic credits centered on drafting, design
                coordination, repertory support, and production communication across regional
                theatre, Off-Broadway, and long-term collaborations.
              </p>
              <div className="pt-1">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-[0.92rem] tracking-[-0.015em] text-foreground/76 transition-colors hover:text-foreground"
                >
                  View Scenic Design Portfolio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Selected Credits
              </p>
              <h2 className="mb-4 font-sans text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground">
                Production support shaped by drafting, clarity, and follow-through.
              </h2>
              <p className="text-[1.02rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                A tighter selection of assistant scenic work across premieres, regional theatre,
                and repertory seasons where scenic support was central to the process.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-x-8 gap-y-12 lg:grid-cols-3 xl:gap-x-10">
            {highlightEntries.map((entry) => {
              const externalUrl = getEntryExternalUrl(entry);

              return (
                <AnimatedSection key={entry.anchorId}>
                  <article id={entry.anchorId} className="group flex h-full flex-col">
                    <div className="flex h-[18rem] items-end overflow-hidden rounded-[0.85rem] bg-black/70 md:h-[20rem] xl:h-[18.5rem]">
                      <div className="relative h-full w-full">
                        <Image
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          fill
                          quality={82}
                          sizes="(max-width: 1024px) 92vw, 30vw"
                          className="rounded-[0.85rem] object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                        {entry.organization}
                      </p>
                      <h3 className="mt-2 text-[1.5rem] font-sans font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
                        {entry.title}
                      </h3>
                      <p className="mt-3 max-w-[42rem] text-[0.98rem] leading-[1.72] tracking-[-0.01em] text-foreground/58">
                        Assistant scenic design with {entry.collaborator}, {formatDate(entry.date)}
                        {entry.location ? ` · ${entry.location}` : ""}.
                      </p>
                      {externalUrl && (
                        <div className="mt-4">
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[0.94rem] tracking-[-0.015em] text-foreground/76 transition-colors hover:text-foreground"
                          >
                            {getEntryExternalLabel(entry)}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 max-w-4xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Utah Shakespeare Festival
              </p>
              <h2 className="mb-4 font-sans text-[clamp(2.1rem,3.8vw,3.6rem)] font-medium leading-[0.95] tracking-[-0.055em] text-foreground">
                Five seasons of repertory collaboration.
              </h2>
              <p className="text-[1.02rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                A sustained assistant scenic collaboration with Jo Winiarski across five summer
                seasons in Cedar City, supporting continuity, scale, and the pace of repertory
                production.
                {utahMilestone ? ` ${trimCopy(utahMilestone.excerpt, 136)}` : ""}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  ref={utahGalleryRef}
                  className="flex gap-8 overflow-x-auto px-[10vw] pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:px-[14vw]"
                >
                  {utahEntries.map((entry) => {
                    const externalUrl = getEntryExternalUrl(entry);

                    return (
                      <figure
                        key={entry.anchorId}
                        id={entry.anchorId}
                        className="w-[72vw] max-w-[52rem] flex-none snap-center md:w-[calc((100%-2rem)/3)] md:max-w-none"
                      >
                        <div className="overflow-hidden rounded-[0.9rem] bg-black/70">
                          <div className="relative aspect-[16/10] w-full">
                            <Image
                              src={entry.coverImageUrl}
                              alt={entry.coverImageAlt}
                              fill
                              quality={82}
                              sizes="(max-width: 768px) 72vw, 33vw"
                              className="rounded-[0.9rem] object-contain"
                            />
                          </div>
                        </div>
                        <figcaption className="pt-4">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                            {new Date(entry.date).getFullYear()} Season
                          </p>
                          <h3 className="mt-2 text-[1.42rem] font-sans font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
                            {entry.title}
                          </h3>
                          <p className="mt-3 text-[0.98rem] leading-[1.7] tracking-[-0.01em] text-foreground/60">
                            Assistant scenic design with {entry.collaborator}.
                          </p>
                          <p className="mt-3 text-[0.98rem] leading-[1.72] tracking-[-0.01em] text-foreground/54">
                            {trimCopy(entry.excerpt, 140)}
                          </p>
                          {externalUrl && (
                            <div className="mt-4">
                              <a
                                href={externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-[0.94rem] tracking-[-0.015em] text-foreground/76 transition-colors hover:text-foreground"
                              >
                                {getEntryExternalLabel(entry)}
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </figcaption>
                      </figure>
                    );
                  })}
                </div>
              </div>
              <button
                type="button"
                aria-label="Previous Utah Shakespeare images"
                onClick={() => scrollUtahGallery("prev")}
                className="hidden md:flex absolute left-[4.5rem] top-[42%] -translate-y-1/2 items-center justify-center text-white/76 transition-colors hover:text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                aria-label="Next Utah Shakespeare images"
                onClick={() => scrollUtahGallery("next")}
                className="hidden md:flex absolute right-[4.5rem] top-[42%] -translate-y-1/2 items-center justify-center text-white/76 transition-colors hover:text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {additionalEntries.length > 0 && (
        <section className="border-t border-border py-16 md:py-18">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="mb-8 max-w-3xl">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                  Additional Credits
                </p>
                <p className="text-[1rem] leading-[1.72] tracking-[-0.01em] text-foreground/58">
                  A broader list of assistant scenic credits kept visible here without competing
                  with the main selection above.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-x-10 gap-y-0 md:grid-cols-2">
              {additionalEntries.map((entry) => {
                const externalUrl = getEntryExternalUrl(entry);

                return (
                  <AnimatedSection key={entry.anchorId}>
                    <article id={entry.anchorId} className="border-t border-white/10 py-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                          {entry.organization}
                        </p>
                        <p className="shrink-0 text-[0.92rem] tracking-[-0.015em] text-foreground/46">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <h3 className="mt-3 max-w-[34rem] text-[1.22rem] font-sans font-medium leading-[1.08] tracking-[-0.035em] text-foreground">
                        {entry.title}
                      </h3>
                      <p className="mt-2 max-w-[38rem] text-[0.96rem] leading-[1.68] tracking-[-0.01em] text-foreground/58">
                        Assistant scenic design with {entry.collaborator}
                        {entry.location ? ` · ${entry.location}` : ""}.
                      </p>
                      {externalUrl && (
                        <div className="mt-4">
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[0.92rem] tracking-[-0.015em] text-foreground/72 transition-colors hover:text-foreground"
                          >
                            {getEntryExternalLabel(entry)}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </article>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
