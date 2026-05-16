"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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
  return entry.externalUrl ? "Production page" : "Designer portfolio";
}

function getSelectedCreditNote(entry: (typeof assistantScenicDesignEntries)[number]) {
  switch (entry.anchorId) {
    case "the-play-that-goes-wrong-seattle-rep":
      return "Supported a technically precise comedy environment where scenic mechanics, visual timing, and documentation all had to stay clear.";
    case "the-book-club-play-cincinnati-playhouse":
      return "Regional theatre support for a contemporary comedy, with assistant work focused on scenic communication and production follow-through.";
    case "native-gardens-pioneer-theatre-company":
      return "Drafting and spatial development support for a production built around neighboring homes, property lines, and contrasting exterior worlds.";
    case "bottle-shock-the-musical":
      return "World-premiere musical support in a developing production process where scenic information had to keep pace with new-work decisions.";
    case "the-fears-signature-theatre":
      return "Off-Broadway assistant work supporting design continuity, communication, and execution through a fast-moving production process.";
    case "clue-on-stage-dallas-theater-center":
      return "Assistant scenic support for a highly choreographed farce where layout, timing, and scenic documentation carried real production weight.";
    default:
      return entry.excerpt;
  }
}

export default function AssistantScenicDesign() {
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
  const leadHighlightEntry = highlightEntries[0] || utahEntries[0] || assistantScenicDesignEntries[0];
  const leadUtahEntry =
    utahEntries.find((entry) => entry.anchorId === "utah-shakespeare-festival-2023") ||
    utahEntries[0] ||
    null;
  const supportingUtahEntries = leadUtahEntry
    ? utahEntries.filter((entry) => entry.anchorId !== leadUtahEntry.anchorId)
    : utahEntries.slice(1);

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

      <section className="relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-border bg-black">
        {leadHighlightEntry?.coverImageUrl ? (
          <Image
            src={leadHighlightEntry.coverImageUrl}
            alt={leadHighlightEntry.coverImageAlt}
            fill
            priority
            quality={88}
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.32)_48%,rgba(0,0,0,0.88)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.24)_48%,rgba(0,0,0,0.4)_100%)]" />
        <div className="relative flex min-h-[calc(100svh-74px)] items-end px-[clamp(1.5rem,5vw,5.5rem)] pb-10 pt-24 md:pb-16">
          <AnimatedSection>
            <div className="max-w-[72rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/62">
                Production Support
              </p>
              <h1 className="mt-5 max-w-[12ch] font-sans text-[clamp(3.2rem,7vw,7.4rem)] font-medium leading-[0.88] tracking-[-0.075em] text-white">
                Assistant Scenic Design
              </h1>
              <p className="mt-7 max-w-[44rem] text-[clamp(1.03rem,1.35vw,1.28rem)] leading-[1.66] tracking-[-0.02em] text-white/78">
                Assistant scenic credits across regional theatre, repertory seasons, new work,
                musicals, comedy, and Off-Broadway production. This work reflects experience
                supporting established scenic designers through drafting, model communication,
                coordination, and production follow-through.
              </p>
              <div className="mt-8">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-[0.94rem] tracking-[-0.015em] text-white/76 transition-colors hover:text-white"
                >
                  View Scenic Design Portfolio
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-[88rem]">
          <AnimatedSection>
            <div className="mb-10 max-w-4xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Selected Credits
              </p>
              <h2 className="mb-4 font-sans text-[clamp(2.2rem,4vw,4rem)] font-medium leading-[0.94] tracking-[-0.06em] text-foreground">
                Production support across demanding theatre processes.
              </h2>
              <p className="text-[1.02rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                These selected credits show the range of assistant scenic work: precision comedy,
                regional theatre, new musicals, Off-Broadway process, repertory pace, and production
                teams that need clear scenic information from early design through technical rehearsal.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-16 md:space-y-20">
            {highlightEntries.map((entry, index) => {
              const externalUrl = getEntryExternalUrl(entry);
              const imageFirst = index % 2 === 0;

              return (
                <AnimatedSection key={entry.anchorId}>
                  <article
                    id={entry.anchorId}
                    className="group grid gap-6 border-t border-white/12 pt-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] lg:gap-12"
                  >
                    <div className={`${imageFirst ? "" : "lg:order-2"} overflow-hidden bg-black/70`}>
                      <div className="relative aspect-[16/10] w-full lg:aspect-[16/9]">
                        <Image
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          fill
                          quality={82}
                          sizes="(max-width: 1024px) 100vw, 58vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                      </div>
                    </div>
                    <div className={`${imageFirst ? "" : "lg:order-1"} self-end lg:pb-1`}>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                        {entry.organization}
                      </p>
                      <h3 className="mt-3 font-sans text-[clamp(1.8rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.055em] text-foreground">
                        {entry.title}
                      </h3>
                      <p className="mt-5 max-w-[42rem] text-[0.94rem] leading-[1.65] tracking-[-0.01em] text-foreground/50">
                        Assistant scenic design with {entry.collaborator}, {formatDate(entry.date)}
                        {entry.location ? ` · ${entry.location}` : ""}.
                      </p>
                      <p className="mt-4 max-w-[42rem] text-[1rem] leading-[1.78] tracking-[-0.01em] text-foreground/64">
                        {getSelectedCreditNote(entry)}
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
        <div className="container max-w-[88rem]">
          <AnimatedSection>
            <div className="mb-10 max-w-4xl">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                Utah Shakespeare Festival
              </p>
              <h2 className="mb-4 font-sans text-[clamp(2.1rem,3.8vw,3.6rem)] font-medium leading-[0.95] tracking-[-0.055em] text-foreground">
                Five seasons of repertory collaboration.
              </h2>
              <p className="text-[1.02rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                The Utah Shakespeare Festival credits form the clearest through-line on this page:
                five summer seasons supporting Jo Winiarski across rotating repertory productions,
                shared production timelines, and multiple scenic worlds moving at once.
                {utahMilestone ? ` ${trimCopy(utahMilestone.excerpt, 136)}` : ""}
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-10">
              {leadUtahEntry ? (
                <figure id={leadUtahEntry.anchorId} className="grid gap-6 border-t border-white/12 pt-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)] lg:gap-12">
                  <div className="overflow-hidden bg-black/70">
                    <div className="relative aspect-[16/9] w-full lg:aspect-[16/8]">
                      <Image
                        src={leadUtahEntry.coverImageUrl}
                        alt={leadUtahEntry.coverImageAlt}
                        fill
                        quality={86}
                        sizes="(max-width: 1024px) 100vw, 62vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="lg:pt-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                      {new Date(leadUtahEntry.date).getFullYear()} Season
                    </p>
                    <h3 className="mt-3 font-sans text-[clamp(1.8rem,3vw,3.25rem)] font-medium leading-[0.95] tracking-[-0.055em] text-foreground">
                      {leadUtahEntry.title}
                    </h3>
                    <p className="mt-5 max-w-[34rem] text-[1rem] leading-[1.75] tracking-[-0.01em] text-foreground/62">
                      Assistant scenic design with {leadUtahEntry.collaborator}. {leadUtahEntry.excerpt}
                    </p>
                    {getEntryExternalUrl(leadUtahEntry) ? (
                      <div className="mt-5">
                        <a
                          href={getEntryExternalUrl(leadUtahEntry) || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[0.94rem] tracking-[-0.015em] text-foreground/76 transition-colors hover:text-foreground"
                        >
                          {getEntryExternalLabel(leadUtahEntry)}
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    ) : null}
                  </figcaption>
                </figure>
              ) : null}

              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {supportingUtahEntries.map((entry) => {
                    const externalUrl = getEntryExternalUrl(entry);

                    return (
                      <figure
                        key={entry.anchorId}
                        id={entry.anchorId}
                        className="border-t border-white/12 pt-5"
                      >
                        <div className="overflow-hidden bg-black/70">
                          <div className="relative aspect-[16/10] w-full">
                            <Image
                              src={entry.coverImageUrl}
                              alt={entry.coverImageAlt}
                              fill
                              quality={82}
                              sizes="(max-width: 768px) 100vw, 48vw"
                              className="object-cover"
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
          </AnimatedSection>
        </div>
      </section>

      {additionalEntries.length > 0 && (
        <section className="border-t border-border py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <AnimatedSection>
              <div className="mb-8 max-w-3xl">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
                  Additional Credits
                </p>
                <p className="text-[1rem] leading-[1.72] tracking-[-0.01em] text-foreground/58">
                  Additional assistant scenic credits across regional theatre, repertory production,
                  drafting support, and long-term scenic collaboration.
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
