"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import { useState } from "react";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
} from "@shared/localAssistantScenic";
import { ArrowLeft } from "lucide-react";
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

const GALLERY_FRAMES = [
  { aspect: "aspect-[4/3]", spacing: "mb-[clamp(1.75rem,4vw,4rem)]" },
  { aspect: "aspect-[16/10]", spacing: "mb-[clamp(1.75rem,3vw,3rem)]" },
  { aspect: "aspect-[3/4]", spacing: "mb-[clamp(2rem,5vw,5rem)]" },
  { aspect: "aspect-[1/1]", spacing: "mb-[clamp(1.75rem,3.5vw,3.8rem)]" },
  { aspect: "aspect-[5/7]", spacing: "mb-[clamp(2rem,4.5vw,4.5rem)]" },
  { aspect: "aspect-[16/9]", spacing: "mb-[clamp(1.75rem,3vw,3rem)]" },
] as const;

export default function AssistantScenicDesign() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const entryBySlug = buildEntryMap();

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
    <div className="min-h-screen bg-white text-[#111111]">
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
          className="scroll-mt-24 bg-white px-[clamp(1rem,3vw,2.8rem)] pb-[clamp(3rem,7vw,6rem)] pt-[clamp(1rem,2.4vw,1.8rem)] text-black"
        >
          <div className="mx-auto w-full max-w-[1500px]">
            <AnimatedSection className="mb-[clamp(1.8rem,4vw,4.5rem)]">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div className="max-w-[42rem]">
                  <h1 className="font-sans text-[clamp(2.1rem,4.4vw,4.9rem)] font-medium leading-[0.9] tracking-[-0.078em] text-[#111111]">
                    Assistant Scenic Design
                  </h1>
                  <p className="mt-4 max-w-[34rem] text-[0.98rem] leading-6 tracking-[-0.018em] text-black/52">
                    Production images from assistant scenic design collaborations.
                    Select an image for the production title, venue, designer, and year.
                  </p>
                </div>
                <div>
                  <Link
                    href="/resume"
                    className="inline-flex h-10 w-fit items-center gap-2 border border-black/14 px-4 text-[0.9rem] font-medium tracking-[-0.02em] text-black/72 transition-colors hover:border-black/28 hover:bg-black/[0.035] hover:text-black"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to resume
                  </Link>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="columns-2 gap-[clamp(0.8rem,2.6vw,3rem)] md:columns-2 lg:columns-3">
                {portfolioEntries.map((entry, index) => {
                  const frame = GALLERY_FRAMES[index % GALLERY_FRAMES.length];

                  return (
                    <figure
                      key={entry.anchorId}
                      id={entry.anchorId}
                      className={`break-inside-avoid scroll-mt-28 ${frame.spacing}`}
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className={`group relative block w-full overflow-hidden bg-white text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 focus-visible:ring-offset-white ${frame.aspect}`}
                        aria-label={`Open ${entry.title} image`}
                      >
                        <img
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:brightness-[0.72]"
                          loading={index < 3 ? "eager" : "lazy"}
                          decoding={index < 3 ? "sync" : "async"}
                        />
                        <div className="pointer-events-none absolute inset-0 hidden items-end bg-black/0 p-5 opacity-0 transition-[background-color,opacity] duration-500 group-hover:bg-black/24 group-hover:opacity-100 md:flex">
                          <div className="translate-y-3 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="font-sans text-[clamp(1.25rem,1.7vw,1.9rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
                              {entry.title}
                            </p>
                            <p className="mt-2 max-w-[18rem] text-[0.82rem] font-medium leading-tight tracking-[-0.018em] text-white/74">
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

      {lightboxIndex !== null ? (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex(current =>
              current === null ? 0 : Math.min(current + 1, lightboxImages.length - 1)
            )
          }
          onPrev={() =>
            setLightboxIndex(current =>
              current === null ? 0 : Math.max(current - 1, 0)
            )
          }
        />
      ) : null}

      <Footer tone="light" />
    </div>
  );
}
