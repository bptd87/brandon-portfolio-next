"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import type { CSSProperties } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
} from "@shared/localAssistantScenic";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "wouter";

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

function buildEntryMap() {
  const map = new Map<string, (typeof assistantScenicDesignEntries)[number]>();
  for (const entry of assistantScenicDesignEntries) {
    for (const slug of entry.legacyNewsSlugs) {
      map.set(slug, entry);
    }
  }
  return map;
}

export default function AssistantScenicDesign() {
  const { homeTheme } = useHomeTheme();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxScrollRef = useRef<HTMLDivElement | null>(null);
  const entryBySlug = buildEntryMap();
  useHomeDocumentTheme(homeTheme);

  const highlightEntries = HIGHLIGHT_SLUGS.map(slug =>
    entryBySlug.get(slug)
  ).filter(Boolean) as typeof assistantScenicDesignEntries;
  const utahEntries = UTAH_SEASON_SLUGS.map(slug =>
    entryBySlug.get(slug)
  ).filter(Boolean) as typeof assistantScenicDesignEntries;
  const utahMilestone = entryBySlug.get(UTAH_MILESTONE_SLUG) || null;

  const excludedAnchorIds = new Set([
    ...highlightEntries.map(entry => entry.anchorId),
    ...utahEntries.map(entry => entry.anchorId),
    ...(utahMilestone ? [utahMilestone.anchorId] : []),
  ]);

  const additionalEntries = assistantScenicDesignEntries.filter(
    entry => !excludedAnchorIds.has(entry.anchorId)
  );
  const portfolioEntries = [
    ...highlightEntries,
    ...utahEntries,
    ...additionalEntries,
  ];
  const lightboxImages = portfolioEntries.map(entry => ({
    imageUrl: entry.coverImageUrl,
    altText: entry.coverImageAlt,
    caption: `${entry.title} at ${entry.organization}. Scenic Design by ${entry.collaborator}. ${formatDate(entry.date)}.`,
  }));
  const selectedLightboxImage = lightboxIndex === null ? null : lightboxImages[lightboxIndex] || null;

  useEffect(() => {
    if (!selectedLightboxImage) return;
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [selectedLightboxImage]);

  useEffect(() => {
    if (!selectedLightboxImage) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex(current =>
          current === null ? 0 : Math.min(current + 1, lightboxImages.length - 1)
        );
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex(current =>
          current === null ? 0 : Math.max(current - 1, 0)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImages.length, selectedLightboxImage]);

  useLayoutEffect(() => {
    if (lightboxIndex === null) return;
    const selectedImage = lightboxScrollRef.current?.querySelector<HTMLElement>(
      `[data-lightbox-index="${lightboxIndex}"]`
    );
    selectedImage?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "center" });
  }, [lightboxIndex]);

  const assistantScenicUpdatedDate = assistantScenicDesignEntries.reduce(
    (latest, entry) => {
      return entry.date > latest ? entry.date : latest;
    },
    assistantScenicDesignEntries[0]?.date || ""
  );
  const assistantScenicImages = highlightEntries
    .map(entry => entry.coverImageUrl)
    .filter(
      (value, index, array): value is string =>
        Boolean(value) && array.indexOf(value) === index
    );
  const assistantScenicContributors = Array.from(
    new Set(
      assistantScenicDesignEntries
        .map(entry => entry.collaborator)
        .filter(Boolean)
    )
  );
  return (
    <div
      className="min-h-screen [--border:rgba(17,17,17,0.14)]"
      style={{
        "--background": homeTheme.bg,
        "--foreground": homeTheme.ink,
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_BODY_FONT,
      } as CSSProperties}
    >
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
            itemListElement: assistantScenicDesignEntries.map(
              (entry, index) => ({
                position: index + 1,
                name: entry.title,
                url: `${ASSISTANT_SCENIC_URL}#${entry.anchorId}`,
                datePublished: entry.date,
                image: entry.coverImageUrl,
              })
            ),
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
          workExample: highlightEntries.map(entry => ({
            type: "ImageObject" as const,
            contentUrl: entry.coverImageUrl,
            name: entry.title,
            caption: `${entry.title} at ${entry.organization}. Scenic designer ${entry.collaborator}.`,
          })),
          contributor: assistantScenicContributors.map(name => ({
            type: "Person" as const,
            name,
            roleName: "Scenic Designer",
          })),
        }}
      />
      <Header />

      <main>
        <section
          id="assistant-credits"
          className="scroll-mt-24 px-[clamp(1.5rem,7vw,8rem)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(8rem,12vw,11rem)]"
        >
          <div className="mx-auto w-full max-w-[64rem]">
            <AnimatedSection className="mb-[clamp(2.75rem,6vw,5rem)] text-center">
              <div>
                <div className="mx-auto max-w-[42rem]">
                  <h1
                    className="mx-auto max-w-[11ch] text-balance text-[clamp(3.1rem,7vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[0]"
                    style={{
                      color: homeTheme.ink,
                      fontFamily: HOME_DISPLAY_FONT,
                      fontStretch: "condensed",
                    }}
                  >
                    Assistant Scenic Design
                  </h1>
                  <p
                    className="mx-auto mt-5 max-w-[31rem] text-[clamp(0.98rem,1.2vw,1.12rem)] font-medium leading-7 tracking-[-0.02em]"
                    style={{ color: homeTheme.muted }}
                  >
                    Selected assistant scenic design collaborations with
                    production images, venues, scenic designers, and seasons.
                  </p>
                </div>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/resume"
                    className="inline-flex h-11 w-fit items-center gap-2 rounded-full px-5 text-[0.9rem] font-bold uppercase tracking-[0.04em] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.12)] transition hover:scale-[1.02]"
                    style={{
                      backgroundColor: homeTheme.controlBg,
                      color: homeTheme.controlInk,
                    }}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Resume
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid grid-cols-1 gap-[clamp(2.25rem,5vw,4.25rem)] px-[clamp(1rem,3vw,2rem)] sm:grid-cols-2 lg:grid-cols-3">
                {portfolioEntries.map((entry, index) => {
                  return (
                    <figure
                      key={entry.anchorId}
                      id={entry.anchorId}
                      className="group scroll-mt-28"
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="portfolio-focus-card relative block aspect-square w-full overflow-hidden rounded-[0.85rem] bg-neutral-100 text-left shadow-[0_1rem_2.4rem_rgba(0,0,0,0.12)] ring-1 ring-black/5 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/70"
                        aria-label={`Open ${entry.title} image`}
                      >
                        <img
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          className="portfolio-focus-media h-full w-full object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:brightness-[0.72]"
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding={index < 3 ? "sync" : "async"}
                        />
                        <div className="pointer-events-none absolute inset-0 flex items-end bg-black/18 p-5 opacity-100 transition-[background-color,opacity] duration-500 md:opacity-0 md:group-hover:bg-black/30 md:group-hover:opacity-100">
                          <div className="translate-y-0 opacity-100 transition-[opacity,transform] duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                            <p
                              className="text-[clamp(1.4rem,2vw,2.4rem)] font-black uppercase leading-[0.9] tracking-[0] text-white"
                              style={{
                                fontFamily: HOME_DISPLAY_FONT,
                                fontStretch: "condensed",
                              }}
                            >
                              {entry.title}
                            </p>
                            <p className="mt-2 max-w-[18rem] text-[0.82rem] font-bold uppercase leading-tight tracking-[0.04em] text-white/78">
                              {entry.organization} / {formatDate(entry.date)}
                            </p>
                          </div>
                        </div>
                      </button>
                      <figcaption className="sr-only">
                        {entry.title} at {entry.organization}. Scenic Design by{" "}
                        {entry.collaborator}. {formatDate(entry.date)}.
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      {selectedLightboxImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-[clamp(0.75rem,2vw,1.5rem)] backdrop-blur-sm"
          style={{
            backgroundColor: `color-mix(in srgb, ${homeTheme.ink} 42%, transparent)`,
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Assistant scenic design gallery"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            className="absolute right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[102] inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.45rem] font-normal leading-none shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
            style={{
              backgroundColor: homeTheme.controlBg,
              color: homeTheme.controlInk,
            }}
            onClick={() => setLightboxIndex(null)}
            aria-label="Close assistant scenic design gallery"
          >
            <X className="h-5 w-5" aria-hidden="true" strokeWidth={2.4} />
          </button>
          <div
            className="relative h-full w-full overflow-hidden rounded-[1.65rem] shadow-[0_2rem_6rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: homeTheme.bg }}
            onClick={event => event.stopPropagation()}
          >
            <div
              ref={lightboxScrollRef}
              className="flex h-full snap-x snap-mandatory items-center gap-[clamp(1.25rem,4vw,4rem)] overflow-x-auto overflow-y-hidden px-[clamp(1.5rem,7vw,8rem)] py-[clamp(3.5rem,7vh,6rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {lightboxImages.map((item, index) => (
                <figure
                  key={`${item.imageUrl}-${index}`}
                  data-lightbox-index={index}
                  className="flex h-full min-w-[min(82vw,46rem)] snap-center flex-col items-center justify-center"
                >
                  <div className="flex min-h-0 w-full flex-1 items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={
                        item.altText ||
                        item.caption ||
                        "Assistant scenic design image"
                      }
                      className="max-h-full w-auto max-w-full rounded-[1.1rem] object-contain shadow-[0_1rem_3rem_rgba(0,0,0,0.18)]"
                      draggable={false}
                    />
                  </div>
                  {item.caption || item.altText ? (
                    <figcaption
                      className="mt-4 max-w-[38rem] text-center text-[0.82rem] font-medium leading-snug tracking-[-0.015em]"
                      style={{
                        color: homeTheme.ink,
                        fontFamily: HOME_BODY_FONT,
                      }}
                    >
                      {item.caption || item.altText}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
