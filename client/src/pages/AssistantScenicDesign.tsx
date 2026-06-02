"use client";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PortfolioTopBar from "@/components/PortfolioTopBar";
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

const ASSISTANT_CV_CREDITS = [
  {
    year: "2025",
    title: "The Play That Goes Wrong",
    designer: "Tom Buderwitz",
    venue: "Seattle Rep",
  },
  {
    year: "2025",
    title: "The Importance of Being Earnest",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2025",
    title: "A Gentleman's Guide to Love and Murder",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2025",
    title: "Steel Magnolias",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2025",
    title: "The Book Club Play",
    designer: "Jo Winiarski",
    venue: "Cincinnati Playhouse in the Park",
  },
  {
    year: "2024",
    title: "Souvenir",
    designer: "Jo Winiarski",
    venue: "Pioneer Theatre Company",
  },
  {
    year: "2024",
    title: "Ragtime",
    designer: "Jo Winiarski",
    venue: "The Ruth, Hale Orem",
  },
  {
    year: "2024",
    title: "Natasha, Pierre, and the Great Comet of 1812",
    designer: "Jo Winiarski",
    venue: "Pioneer Theatre Company",
  },
  {
    year: "2024",
    title: "Jersey Boys",
    designer: "Jo Winiarski",
    venue: "Pioneer Theatre Company",
  },
  {
    year: "2024",
    title: "Silent Sky",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2023",
    title: "The Mountaintop",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2023",
    title: "Native Gardens",
    designer: "Jo Winiarski",
    venue: "Pioneer Theatre Company",
  },
  {
    year: "2023",
    title: "Bottle Shock",
    designer: "Jo Winiarski",
    venue: "California Center for the Arts, Escondido",
  },
  {
    year: "2023",
    title: "Romeo and Juliet",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2023",
    title: "A Midsummer Night's Dream",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2023",
    title: "The Fears",
    designer: "Jo Winiarski",
    venue: "Off-Broadway: Signature Theatre",
  },
  {
    year: "2022",
    title: "A Distinct Society",
    designer: "Jo Winiarski",
    venue: "Pioneer Theatre Company / TheatreWorks Silicon Valley",
  },
  {
    year: "2022",
    title: "Clue: On Stage",
    designer: "Jo Winiarski",
    venue: "Dallas Theater Center",
  },
  {
    year: "2022",
    title: "Clue: On Stage",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2022",
    title: "The Sound of Music",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2021",
    title: "Trouble in Mind",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2021",
    title: "Ragtime",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
  {
    year: "2019",
    title: "The Pirates of Penzance",
    designer: "Jo Winiarski",
    venue: "Utah Shakespeare Festival",
  },
] as const;

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

const isFullWidthCredit = (index: number) => index % 7 === 4;

const getCreditMediaClass = (index: number) => {
  if (isFullWidthCredit(index)) return "w-screen";
  if (index % 3 === 0) return "mr-auto w-full md:w-[54vw]";
  if (index % 3 === 1) return "ml-auto w-full md:w-[50vw]";
  return "mx-auto w-full md:w-[62vw]";
};

const getCreditCaptionClass = (index: number) => {
  if (isFullWidthCredit(index)) return "";
  if (index % 3 === 1) return "ml-auto md:w-[50vw]";
  if (index % 3 === 2) return "mx-auto md:w-[62vw]";
  return "md:w-[54vw]";
};

export default function AssistantScenicDesign() {
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
    <div className="min-h-screen bg-[#111111] text-white">
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
      <PortfolioTopBar />

      <main>
        <section
          id="assistant-credits"
          className="scroll-mt-24 border-t border-white/12 bg-[#111111]"
        >
          <div className="relative overflow-hidden border-b border-white/10 bg-[#111111]">
            <header className="relative flex min-h-[48svh] w-full items-center justify-center px-[clamp(1.5rem,5vw,5.5rem)] py-16 text-center md:min-h-[58svh] md:py-24">
              <div className="mx-auto max-w-[60rem]">
                <div className="text-[0.82rem] font-semibold tracking-[-0.01em] text-white/72">
                  Assistant Scenic Design
                </div>
                <h1 className="mx-auto mt-5 max-w-[13ch] font-sans text-[clamp(3.2rem,7vw,7.2rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
                  Assistant Scenic Design
                </h1>
                <p className="mx-auto mt-7 max-w-[43rem] text-[clamp(1.02rem,1.35vw,1.28rem)] leading-[1.66] tracking-[-0.02em] text-white/82">
                  Selected assistant scenic design credits supporting scenic
                  designers through drafting, model communication, and
                  production coordination.
                </p>
              </div>
            </header>
          </div>
          <div className="relative left-1/2 w-screen -translate-x-1/2 py-10 md:py-14">
            <div className="mx-auto mb-10 max-w-[92rem] px-[clamp(1.5rem,5vw,6rem)]">
              <p className="font-mono text-[0.72rem] uppercase leading-none tracking-[0.16em] text-white/38">
                Selected production views
              </p>
            </div>
            <div className="space-y-16 md:space-y-24">
              {highlightEntries.map((entry, index) => {
                const mediaClass = getCreditMediaClass(index);
                const captionClass = getCreditCaptionClass(index);

                return (
                  <AnimatedSection key={entry.anchorId}>
                    <figure className="space-y-4">
                      <img
                        src={entry.coverImageUrl}
                        alt={entry.coverImageAlt}
                        className={`block h-auto bg-[#111111] ${mediaClass}`}
                        loading={index < 2 ? "eager" : "lazy"}
                        decoding={index < 2 ? "sync" : "async"}
                      />
                      <figcaption
                        className={`px-[clamp(1.5rem,5vw,5.5rem)] ${captionClass}`}
                      >
                        <div className="max-w-[48rem]">
                          <p className="max-w-[38rem] text-[0.98rem] leading-6 tracking-[-0.016em] text-white/56">
                            <strong className="font-medium text-white">
                              {entry.title}
                            </strong>{" "}
                            at {entry.organization} with Scenic Design by{" "}
                            {entry.collaborator}. {formatDate(entry.date)}.
                          </p>
                        </div>
                      </figcaption>
                    </figure>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>

          <div className="px-[clamp(1.5rem,5vw,6rem)] pb-20 pt-6 md:pb-28 md:pt-12">
            <div className="mx-auto max-w-[92rem]">
              <div className="divide-y divide-white/10 border-y border-white/12">
                {ASSISTANT_CV_CREDITS.map((entry, index) => (
                  <article
                    key={`${entry.year}-${entry.title}-${entry.venue}-${index}`}
                    className="grid gap-4 py-5 md:grid-cols-[5rem_minmax(16rem,1.1fr)_minmax(13rem,0.75fr)_minmax(15rem,0.9fr)] md:items-start"
                  >
                    <p className="font-mono text-[0.68rem] uppercase leading-6 tracking-[0.16em] text-white/34">
                      {entry.year}
                    </p>
                    <div>
                      <h3 className="font-sans text-[1.18rem] font-medium leading-tight tracking-[-0.04em] text-white">
                        {entry.title}
                      </h3>
                      <p className="mt-1 text-[0.94rem] leading-tight tracking-[-0.018em] text-white/45">
                        Assistant Scenic Designer
                      </p>
                    </div>
                    <p className="text-[0.98rem] leading-6 tracking-[-0.018em] text-white/56">
                      {entry.designer}
                    </p>
                    <p className="text-[0.98rem] leading-6 tracking-[-0.018em] text-white/45">
                      {entry.venue}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer tone="dark" />
    </div>
  );
}
