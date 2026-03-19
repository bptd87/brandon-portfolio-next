import { useMemo } from "react";
import { ArrowRight, Image as ImageIcon, Play, Video } from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getVideoThumbnail } from "@/lib/videoUtils";
import {
  getLocalExperientialLeadImage,
  getLocalExperientialMediaItems,
  getLocalExperientialSampleHref,
  getLocalExperientialSamples,
  type LocalExperientialCategory,
} from "@shared/localPortfolios";

const EXPERIENTIAL_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/experiential";
const EXPERIENTIAL_PORTFOLIO_TITLE =
  "Experiential Projects by a Scenic Designer | Renderings, Technical Drawing, Live Events | Brandon PT Davis";
const EXPERIENTIAL_PORTFOLIO_DESCRIPTION =
  "Experiential projects by scenic designer Brandon PT Davis: renderings, technical drawings, and live event build support for agencies that need clear visual direction and production-aware execution.";
const EXPERIENTIAL_PORTFOLIO_KEYWORDS = [
  "scenic designer experiential work",
  "experiential design portfolio",
  "event renderings",
  "technical drawing services",
  "live event design portfolio",
  "branded environment designer",
].join(", ");

type GalleryItem = {
  id: number;
  imageUrl: string;
  videoUrl?: string | null;
  altText: string | null;
  displayTitle: string | null;
  description?: string | null;
  projectId?: number | null;
  slug: string;
  category: LocalExperientialCategory;
  images?: Array<{
    imageUrl: string;
    altText?: string | null;
  }>;
};

function GalleryCardGrid({
  items,
  categoryLabel,
  cardAspectClass = "aspect-[3/2]",
  imageFit = "cover",
  cardBackgroundClass = "bg-black",
  cardRoundedClass = "rounded-none",
  imagePaddingClass = "",
}: {
  items: GalleryItem[];
  categoryLabel: string;
  cardAspectClass?: string;
  imageFit?: "cover" | "contain";
  cardBackgroundClass?: string;
  cardRoundedClass?: string;
  imagePaddingClass?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/10 py-16 text-center">
        <ImageIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="text-muted-foreground">No items in {categoryLabel} yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const leadMedia = item.category === "technical-drawing" ? getLocalExperientialMediaItems(item)[0] : null;
        const displayImage =
          (item.category === "technical-drawing" ? leadMedia?.imageUrl : null) ||
          getLocalExperientialLeadImage(item) ||
          (item.videoUrl ? getVideoThumbnail(item.videoUrl) : null);

        return (
          <AnimatedSection key={item.id} delay={index * 0.06}>
            <Link
              href={getLocalExperientialSampleHref(item)}
              className="group block w-full text-left transition-transform duration-300 hover:-translate-y-0.5"
            >
              <div
                className={`relative overflow-hidden border border-white/12 transition-colors duration-300 group-hover:border-white/24 ${cardAspectClass} ${cardBackgroundClass} ${cardRoundedClass}`}
              >
                {displayImage ? (
                  <div className={`h-full w-full ${imagePaddingClass}`}>
                    {item.category === "technical-drawing" ? (
                      <div className="flex h-full w-full items-center justify-center bg-white">
                        <img
                          src={displayImage}
                          alt={item.altText || item.displayTitle || categoryLabel}
                          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : (
                      <img
                        src={displayImage}
                        alt={item.altText || item.displayTitle || categoryLabel}
                        className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.02] ${
                          imageFit === "contain" ? "object-contain" : "object-cover"
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/10 to-pink-500/10">
                    <Video className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}

                {item.videoUrl && (
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur">
                    <Play className="ml-0.5 h-5 w-5 text-white" />
                  </div>
                )}
              </div>
              <div className="mt-3 min-h-[4.75rem] space-y-1">
                {item.displayTitle && (
                  <h3 className="text-[1rem] font-medium leading-snug tracking-[-0.02em] text-foreground">
                    {item.displayTitle}
                  </h3>
                )}
                {item.description ? (
                  <p
                    className="text-sm leading-6 text-white/62"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>
                ) : null}
              </div>
            </Link>
          </AnimatedSection>
        );
      })}
    </div>
  );
}

function PortfolioSection({
  id,
  eyebrow,
  title,
  copy,
  items,
  cardAspectClass,
  imageFit,
  cardBackgroundClass,
  cardRoundedClass,
  imagePaddingClass,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  items: GalleryItem[];
  cardAspectClass?: string;
  imageFit?: "cover" | "contain";
  cardBackgroundClass?: string;
  cardRoundedClass?: string;
  imagePaddingClass?: string;
}) {
  return (
    <section id={id} className="border-t border-white/12 py-20 md:py-24">
      <div className="container max-w-6xl">
        <AnimatedSection>
          <div className="mb-10 md:mb-12">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-white/48">
              {eyebrow}
            </p>
            <h2 className="mb-5 max-w-4xl font-sans text-3xl font-normal leading-[0.96] tracking-[-0.05em] text-foreground md:text-5xl">
              {title}
            </h2>
            <p className="max-w-3xl text-[1.02rem] leading-8 text-white/68 md:text-[1.08rem]">{copy}</p>
          </div>
        </AnimatedSection>

        <GalleryCardGrid
          items={items}
          categoryLabel={title}
          cardAspectClass={cardAspectClass}
          imageFit={imageFit}
          cardBackgroundClass={cardBackgroundClass}
          cardRoundedClass={cardRoundedClass}
          imagePaddingClass={imagePaddingClass}
        />
      </div>
    </section>
  );
}

export default function ExperientialPortfolio() {
  const experientialSamples = getLocalExperientialSamples();

  const processImagesByCategory = useMemo(() => {
    return experientialSamples.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof experientialSamples>);
  }, [experientialSamples]);

  const experientialImages = Array.from(
    new Set(
      (experientialSamples || [])
        .map((item) => getLocalExperientialLeadImage(item) || (item.videoUrl ? getVideoThumbnail(item.videoUrl) : null))
        .filter((value): value is string => Boolean(value))
    )
  ).slice(0, 12);
  const experientialPrimaryImage = experientialImages[0];
  const experientialUpdatedDate = (experientialSamples || []).reduce((latest, item) => {
    if (!item.createdAt) return latest;
    const isoDate = new Date(item.createdAt).toISOString().split("T")[0];
    return isoDate > latest ? isoDate : latest;
  }, "");
  const sectionList = [
    {
      name: "Rendering and Visualization for Pitch and Approval",
      url: `${EXPERIENTIAL_PORTFOLIO_URL}#rendering`,
    },
    {
      name: "Technical Drawings That Bridge Creative and Fabrication",
      url: `${EXPERIENTIAL_PORTFOLIO_URL}#technical-drawing`,
    },
    {
      name: "Live Event and Installation Work in Real Conditions",
      url: `${EXPERIENTIAL_PORTFOLIO_URL}#live-events`,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title={EXPERIENTIAL_PORTFOLIO_TITLE}
        description={EXPERIENTIAL_PORTFOLIO_DESCRIPTION}
        image={experientialPrimaryImage}
        keywords={EXPERIENTIAL_PORTFOLIO_KEYWORDS}
        url={EXPERIENTIAL_PORTFOLIO_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Experiential", url: EXPERIENTIAL_PORTFOLIO_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Experiential Portfolio",
          url: EXPERIENTIAL_PORTFOLIO_URL,
          description: EXPERIENTIAL_PORTFOLIO_DESCRIPTION,
          about:
            "A portfolio of experiential renderings, technical drawings, and live event project support shaped by scenic design thinking.",
          primaryImageOfPage: experientialPrimaryImage,
          mainEntity: {
            name: "Experiential Portfolio Sections",
            itemListElement: sectionList.map((item, index) => ({
              position: index + 1,
              name: item.name,
              url: item.url,
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Experiential Projects",
          description: EXPERIENTIAL_PORTFOLIO_DESCRIPTION,
          url: EXPERIENTIAL_PORTFOLIO_URL,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Experiential Design",
          about:
            "Renderings, technical drawings, and live event support for experiential and branded environment projects.",
          mainEntityOfPage: EXPERIENTIAL_PORTFOLIO_URL,
          dateModified: experientialUpdatedDate || undefined,
          keywords: EXPERIENTIAL_PORTFOLIO_KEYWORDS.split(", "),
          image: experientialImages,
          workExample: (experientialSamples || [])
            .map((item) => ({
              type: "ImageObject" as const,
              contentUrl: item.imageUrl || (item.videoUrl ? getVideoThumbnail(item.videoUrl) : "") || "",
              name:
                item.displayTitle ||
                item.category.replace(/-/g, " "),
              caption:
                item.description ||
                item.displayTitle ||
                `Experiential ${item.category.replace(/-/g, " ")} by Brandon PT Davis`,
            }))
            .filter((item) => Boolean(item.contentUrl))
            .slice(0, 12),
        }}
      />
      <Header />

      <section className="border-b border-white/12">
        <div className="container relative z-10 max-w-6xl py-20 md:py-24">
          <AnimatedSection>
            <div className="mx-auto max-w-[62rem] text-center">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-white/48">Experiential Design</p>
              <h1 className="mx-auto mb-6 max-w-[15ch] font-sans text-[clamp(2.5rem,6vw,5.2rem)] font-normal leading-[0.94] tracking-[-0.06em]">
              Experiential work shaped by scenic thinking.
              </h1>
              <p className="mx-auto mb-12 max-w-[44rem] text-[1.05rem] leading-8 text-white/72 md:text-[1.18rem]">
                Concept renderings, technical drawings, and live event support for teams that need visual clarity,
                production logic, and a designer who understands how ideas behave once they enter real space.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#rendering"
                  className="rounded-full border border-white/16 px-5 py-2 text-sm font-semibold text-white/78 transition-colors hover:border-white/30 hover:bg-white/[0.03] hover:text-white"
                >
                  Rendering
                </a>
                <a
                  href="#technical-drawing"
                  className="rounded-full border border-white/16 px-5 py-2 text-sm font-semibold text-white/78 transition-colors hover:border-white/30 hover:bg-white/[0.03] hover:text-white"
                >
                  Technical Drawing
                </a>
                <a
                  href="#live-events"
                  className="rounded-full border border-white/16 px-5 py-2 text-sm font-semibold text-white/78 transition-colors hover:border-white/30 hover:bg-white/[0.03] hover:text-white"
                >
                  Live Events
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-b border-white/12 py-18 md:py-24">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="mb-12 text-center md:mb-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-white/48">Approach</p>
              <h2 className="mx-auto max-w-4xl font-sans text-3xl font-normal leading-[0.98] tracking-[-0.05em] md:text-5xl">
                A production-aware workflow for experiential projects.
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 md:grid-cols-3 md:gap-6">
            {[
              {
                step: "01",
                title: "Story First",
                detail:
                  "I begin with audience flow, key moments, and brand intent so the concept communicates clearly before it is engineered.",
                color: "#FFFFFF",
              },
              {
                step: "02",
                title: "Design to Build",
                detail:
                  "Renderings and drawings are developed together so visual decisions stay aligned with fabrication logic, venue constraints, and install flow.",
                color: "#FFFFFF",
              },
              {
                step: "03",
                title: "Production Clarity",
                detail:
                  "Assets are packaged for agency teams, producers, and builders so approvals move faster and handoff risk stays lower.",
                color: "#FFFFFF",
              },
            ].map((item) => (
              <AnimatedSection key={item.step}>
                <article className="h-full rounded-2xl border border-white/12 bg-white/[0.02] p-5 md:p-6">
                  <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-white/44">
                    STEP {item.step}
                  </p>
                  <h3 className="mb-3 font-sans text-2xl font-normal tracking-[-0.04em]">{item.title}</h3>
                  <p className="text-sm leading-7 text-white/72">{item.detail}</p>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <PortfolioSection
        id="rendering"
        eyebrow="01 / Rendering"
        title="Rendering and Visualization for Pitch and Approval"
        copy="Concept renderings developed for presentation decks, internal reviews, and early alignment. These images are built to communicate tone, hierarchy, and install intent before the project shifts into production detail."
        items={processImagesByCategory.rendering || []}
      />

      <PortfolioSection
        id="technical-drawing"
        eyebrow="02 / Technical Drawing"
        title="Technical Drawings That Bridge Creative and Fabrication"
        copy="Drafting sets and build documents that turn creative direction into dimensions, scope, and install-ready information. This is where design intent becomes clear enough for fabrication teams to move with confidence."
        items={processImagesByCategory["technical-drawing"] || []}
        cardAspectClass="aspect-[3/2]"
        imageFit="contain"
        cardBackgroundClass="bg-black"
        cardRoundedClass="rounded-none"
        imagePaddingClass=""
      />

      <PortfolioSection
        id="live-events"
        eyebrow="03 / Live Events"
        title="Live Event and Installation Work in Real Conditions"
        copy="Installed work showing how concept direction performs under deadlines, venue constraints, and audience flow. This is where the design is tested against real schedules, real budgets, and real public use."
        items={processImagesByCategory["live-events"] || []}
      />
      <section className="border-t border-white/12 py-20 md:py-24">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="rounded-2xl bg-white/[0.08] px-8 py-20 text-center md:px-12 md:py-24">
              <p className="mx-auto mb-8 max-w-[20ch] font-sans text-3xl font-normal leading-[1.12] tracking-[-0.05em] md:text-5xl">
                Start a project with a designer who can think concept through execution.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-6 py-3 text-sm font-semibold text-white/84 transition-colors hover:bg-white/[0.14] hover:text-white"
              >
                Start a Project <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
