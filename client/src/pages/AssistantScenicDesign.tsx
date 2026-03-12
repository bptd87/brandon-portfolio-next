import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  assistantScenicDesignEntries,
  assistantScenicYearRange,
} from "@shared/publicContent";

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
const SECTION_ACCENTS = ["#FFB000", "#00BCD4", "#FF5722", "#4CAF50", "#E91E63", "#9C27B0"];
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
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
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
          {
            name: "Assistant Scenic Design",
            url: ASSISTANT_SCENIC_URL,
          },
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

      <section className="border-b border-border py-18 md:py-24">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <div className="space-y-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-muted-foreground">
                Portfolio
              </p>
              <h1 className="text-4xl font-black tracking-tight md:text-5xl">
                Assistant Scenic Design
              </h1>
              <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Selected assistant scenic credits supporting scenic designers Tom Buderwitz and
                Jo Winiarski across regional theatre, premieres, and repertory production.
              </p>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-foreground/65 md:text-base">
                A focused companion page to the primary scenic design portfolio, centered on support
                roles, drafting, coordination, and production communication.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
                <span className="rounded-full border border-border px-4 py-2">
                  {assistantScenicYearRange.start}-{assistantScenicYearRange.end}
                </span>
                <span className="rounded-full border border-border px-4 py-2">
                  Selected assistant scenic credits
                </span>
              </div>
              <div className="pt-2">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FFB000] transition-colors hover:opacity-80"
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
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                Highlights
              </p>
              <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">
                Selected Credits
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Productions where assistant scenic work was central to drafting, coordination, and
                production communication.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-2">
            {highlightEntries.map((entry, index) => {
              const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length];
              const externalUrl = getEntryExternalUrl(entry);

              return (
                <AnimatedSection key={entry.anchorId}>
                  <article
                    id={entry.anchorId}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/20"
                  >
                    <div className="aspect-[3/2] bg-black/70 p-4">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black/60">
                        <img
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          className="h-full w-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-7">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.26em] text-foreground/45">
                        Selected supporting work
                      </p>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                        {entry.organization}
                      </p>
                      <h3 className="mb-3 min-h-[4.5rem] text-2xl font-bold leading-tight md:text-3xl">
                        {entry.title}
                      </h3>
                      <div className="mb-4 space-y-1 text-sm">
                        <p className="font-semibold uppercase tracking-[0.16em] text-foreground/65">
                          {entry.role}
                        </p>
                        <p className="text-foreground/80">
                          Scenic Designer: <span className="font-semibold">{entry.collaborator}</span>
                        </p>
                      </div>
                      <p className="mb-5 min-h-[4.75rem] text-sm leading-relaxed text-muted-foreground md:text-base">
                        {trimCopy(entry.excerpt, 150)}
                      </p>
                      <div className="mt-auto space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {formatDate(entry.date)}
                          </span>
                          {entry.location && (
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {entry.location}
                            </span>
                          )}
                        </div>
                        {externalUrl && (
                          <div>
                            <a
                              href={externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-semibold"
                              style={{ color: accent }}
                            >
                              {getEntryExternalLabel(entry)}
                              <ArrowUpRight className="h-4 w-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/10 py-16 md:py-20">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 grid gap-6 lg:grid-cols-[1.5fr_0.8fr] lg:items-end">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#FFB000]">
                  Utah Shakespeare Festival
                </p>
                <h2 className="mb-4 text-3xl font-black tracking-tight md:text-4xl">
                  Five Consecutive Seasons
                </h2>
                <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  A sustained assistant scenic collaboration with scenic designer Jo Winiarski across
                  five summer seasons in Cedar City.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-foreground/55">
                  Collaboration Snapshot
                </p>
                <div className="mt-3 space-y-2 text-sm text-foreground/80">
                  <p>
                    Scenic Designer: <span className="font-semibold">Jo Winiarski</span>
                  </p>
                  <p>Seasons: 2021-2025</p>
                  {utahMilestone && <p>{trimCopy(utahMilestone.excerpt, 130)}</p>}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {utahEntries.map((entry, index) => {
              const accent = SECTION_ACCENTS[index % SECTION_ACCENTS.length];
              const externalUrl = getEntryExternalUrl(entry);

              return (
                <AnimatedSection key={entry.anchorId}>
                  <article
                    id={entry.anchorId}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background/70"
                  >
                    <div className="aspect-[3/2] bg-black/70 p-4">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black/60">
                        <img
                          src={entry.coverImageUrl}
                          alt={entry.coverImageAlt}
                          className="h-full w-full object-contain"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.26em] text-foreground/45">
                        Repertory collaboration
                      </p>
                      <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                        Season {new Date(entry.date).getFullYear()}
                      </p>
                      <h3 className="mb-3 min-h-[3.75rem] text-2xl font-bold leading-tight">{entry.title}</h3>
                      <div className="mb-4 space-y-1 text-sm">
                        <p className="font-semibold uppercase tracking-[0.16em] text-foreground/65">
                          {entry.role}
                        </p>
                        <p className="text-foreground/80">
                          Scenic Designer: <span className="font-semibold">{entry.collaborator}</span>
                        </p>
                      </div>
                      <p className="mb-5 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground">
                        {trimCopy(entry.excerpt, 132)}
                      </p>
                      <div className="mt-auto flex items-center gap-4 text-sm text-foreground/70">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {formatDate(entry.date)}
                        </span>
                        {externalUrl && (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 font-semibold"
                            style={{ color: accent }}
                          >
                            {getEntryExternalLabel(entry)}
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {additionalEntries.length > 0 && (
        <section className="border-t border-border py-16 md:py-20">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <div className="mb-8 max-w-3xl">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
                  Additional Credits
                </p>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Additional production credits kept visible here without giving them equal weight to
                  the core highlight section.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid gap-4 md:grid-cols-2">
              {additionalEntries.map((entry, index) => {
                const accent = SECTION_ACCENTS[(index + 1) % SECTION_ACCENTS.length];
                const externalUrl = getEntryExternalUrl(entry);

                return (
                  <AnimatedSection key={entry.anchorId}>
                    <article
                      id={entry.anchorId}
                      className="rounded-2xl border border-border/60 bg-card/10 p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
                            {entry.organization}
                          </p>
                          <h3 className="text-xl font-bold leading-tight">{entry.title}</h3>
                          <p className="text-sm text-foreground/75">
                            Scenic Designer: <span className="font-semibold">{entry.collaborator}</span>
                          </p>
                        </div>
                        <span className="text-sm text-foreground/60">{formatDate(entry.date)}</span>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {trimCopy(entry.excerpt, 140)}
                      </p>
                      {externalUrl && (
                        <div className="mt-4">
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold"
                            style={{ color: accent }}
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
