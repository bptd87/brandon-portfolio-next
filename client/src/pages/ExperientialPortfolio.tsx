import { useMemo, useState } from "react";
import { ArrowRight, Image as ImageIcon, Play, Search, Video } from "lucide-react";
import { Link } from "wouter";

import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProcessGalleryModal } from "@/components/ProcessGalleryModal";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { getVideoThumbnail } from "@/lib/videoUtils";

const SECTION_ACCENTS = ["#00BCD4", "#FFC107", "#E91E63", "#4CAF50", "#FF5722"];

type GalleryItem = {
  id: number;
  imageUrl: string;
  videoUrl?: string | null;
  altText: string | null;
  displayTitle: string | null;
  description?: string | null;
  projectId?: number | null;
};

function GalleryCardGrid({
  items,
  onItemClick,
  categoryLabel,
  cardAspectClass = "aspect-video",
  imageFit = "contain",
  cardBackgroundClass = "bg-black",
  cardRoundedClass = "rounded-xl",
}: {
  items: GalleryItem[];
  onItemClick: (index: number) => void;
  categoryLabel: string;
  cardAspectClass?: string;
  imageFit?: "cover" | "contain";
  cardBackgroundClass?: string;
  cardRoundedClass?: string;
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
        const accentColor = SECTION_ACCENTS[index % SECTION_ACCENTS.length];
        const displayImage = item.imageUrl || (item.videoUrl ? getVideoThumbnail(item.videoUrl) : null);

        return (
          <AnimatedSection key={item.id} delay={index * 0.06}>
            <button className="group block w-full text-left" onClick={() => onItemClick(index)}>
              <div className={`relative overflow-hidden border border-border/60 shadow-lg shadow-black/10 transition-colors group-hover:border-white/40 ${cardAspectClass} ${cardBackgroundClass} ${cardRoundedClass}`}>
                {displayImage ? (
                  <ProgressiveImage
                    src={displayImage}
                    alt={item.altText || item.displayTitle || categoryLabel}
                    className="h-full w-full"
                    objectFit={imageFit}
                  />
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-4 left-4 right-4">
                    {item.displayTitle && (
                      <h3 className="text-sm font-bold" style={{ color: accentColor }}>
                        {item.displayTitle}
                      </h3>
                    )}
                  </div>
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 min-h-[4.75rem] space-y-1">
                {item.displayTitle && (
                  <h3 className="text-sm font-semibold leading-snug" style={{ color: accentColor }}>
                    {item.displayTitle}
                  </h3>
                )}
                {item.description ? (
                  <p
                    className="text-xs leading-relaxed text-white/70"
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
            </button>
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
  accent,
  items,
  onItemClick,
  cardAspectClass,
  imageFit,
  cardBackgroundClass,
  cardRoundedClass,
}: {
  id: string;
  eyebrow: string;
  title: string;
  copy: string;
  accent: string;
  items: GalleryItem[];
  onItemClick: (index: number) => void;
  cardAspectClass?: string;
  imageFit?: "cover" | "contain";
  cardBackgroundClass?: string;
  cardRoundedClass?: string;
}) {
  return (
    <section id={id} className="border-t border-border py-20 md:py-28">
      <div className="container max-w-6xl">
        <AnimatedSection>
          <div className="mb-12 text-center md:mb-14">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em]" style={{ color: accent }}>
              {eyebrow}
            </p>
            <h2 className="mx-auto mb-5 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">{title}</h2>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">{copy}</p>
          </div>
        </AnimatedSection>

        <GalleryCardGrid
          items={items}
          onItemClick={onItemClick}
          categoryLabel={title}
          cardAspectClass={cardAspectClass}
          imageFit={imageFit}
          cardBackgroundClass={cardBackgroundClass}
          cardRoundedClass={cardRoundedClass}
        />
      </div>
    </section>
  );
}

function BrandsGrid() {
  const { data: brands } = trpc.processGallery.brands.useQuery();

  if (!brands || brands.length === 0) return null;

  return (
    <section className="border-b border-border/70 py-14">
      <div className="container max-w-6xl">
        <AnimatedSection>
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Selected Project Brands
            </p>
            <p className="mx-auto max-w-3xl text-sm leading-relaxed text-white/65">
              Brands represented in projects I supported with agency and production teams.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <AnimatedSection key={brand.id}>
              <div
                className="group flex aspect-square items-center justify-center rounded-xl border border-border/60 bg-card/20 p-4 transition-colors hover:border-white/50"
                style={{ boxShadow: `inset 0 0 0 1px ${SECTION_ACCENTS[index % SECTION_ACCENTS.length]}20` }}
              >
                {brand.logoUrl ? (
                  brand.websiteUrl ? (
                    <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 group-hover:scale-105">
                      <img src={brand.logoUrl} alt={brand.name} className="max-h-14 w-auto object-contain" />
                    </a>
                  ) : (
                    <img src={brand.logoUrl} alt={brand.name} className="max-h-14 w-auto object-contain" />
                  )
                ) : brand.websiteUrl ? (
                  <a href={brand.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/80 transition-colors hover:text-white">
                    {brand.name}
                  </a>
                ) : (
                  <span className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{brand.name}</span>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ExperientialPortfolio() {
  const { data: processGalleryItems } = trpc.processGallery.list.useQuery();

  const processImagesByCategory = useMemo(() => {
    if (!processGalleryItems) {
      return {
        rendering: [],
        "technical-drawing": [],
        "live-events": [],
      };
    }

    return processGalleryItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof processGalleryItems>);
  }, [processGalleryItems]);

  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [processModalCategory, setProcessModalCategory] = useState<"rendering" | "technical-drawing" | "live-events">("rendering");
  const [projectIndex, setProjectIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);

  const categoryItems = processImagesByCategory[processModalCategory] || [];

  const groupedProjects = useMemo(() => {
    const groups: Array<{
      id: string;
      projectId: number | null;
      mainItem?: (typeof categoryItems)[0];
      images: typeof categoryItems;
    }> = [];

    const seenProjects = new Set<number>();

    categoryItems.forEach((item) => {
      if (item.projectId) {
        if (!seenProjects.has(item.projectId)) {
          seenProjects.add(item.projectId);
          groups.push({
            id: `project-${item.projectId}`,
            projectId: item.projectId,
            mainItem: item,
            images: [],
          });
        }
      } else {
        groups.push({
          id: `single-${item.id}`,
          projectId: null,
          mainItem: item,
          images: [item],
        });
      }
    });

    return groups;
  }, [categoryItems]);

  const currentProject = groupedProjects[projectIndex];
  const { data: projectImages, isLoading: isLoadingProjectImages } = trpc.processGallery.projectImages.useQuery(
    { projectId: currentProject?.projectId! },
    { enabled: currentProject?.projectId !== null && currentProject?.projectId !== undefined },
  );

  const currentImages = useMemo(() => {
    if (!currentProject?.mainItem) {
      return projectImages && projectImages.length > 0 ? projectImages : currentProject?.images || [];
    }

    // Always keep the clicked/card image as the first slide, then append project gallery images.
    if (projectImages && projectImages.length > 0) {
      const seen = new Set<number>([currentProject.mainItem.id]);
      const merged = [currentProject.mainItem];

      for (const img of projectImages) {
        if (seen.has(img.id)) continue;
        seen.add(img.id);
        merged.push(img);
      }

      return merged;
    }

    return [currentProject.mainItem];
  }, [currentProject, projectImages]);

  const currentImage = currentImages[imageIndex];

  const canGoNextProject = projectIndex < groupedProjects.length - 1;
  const canGoPrevProject = projectIndex > 0;
  const canGoNextImage = imageIndex < currentImages.length - 1;
  const canGoPrevImage = imageIndex > 0;

  const handleGalleryItemClick = (index: number) => {
    const item = categoryItems[index];

    const projIndex = groupedProjects.findIndex((group) => {
      if (group.projectId && item.projectId && group.projectId === item.projectId) return true;
      if (group.projectId === null && group.mainItem?.id === item.id) return true;
      return false;
    });

    if (projIndex >= 0) {
      setProjectIndex(projIndex);
      setImageIndex(0);
      setProcessModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SEO
        title="Experiential Projects by a Scenic Designer | Renderings, Technical Drawing, Live Events | Brandon PT Davis"
        description="Experiential projects by scenic designer Brandon PT Davis: renderings, technical drawings, and live event build support for agencies that need clear visual direction and production-aware execution."
        keywords="scenic designer experiential work, experiential design portfolio, event renderings, technical drawing services, live event design portfolio, branded environment designer"
        url="https://www.brandonptdavis.com/projects/experiential"
      />
      <Header />

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,188,212,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(233,30,99,0.12),transparent_38%),linear-gradient(180deg,#020304_0%,#05070a_100%)]" />
        <div className="container relative z-10 max-w-6xl py-24 text-center md:py-32">
          <AnimatedSection>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.34em] text-cyan-300">Experiential Design Portfolio</p>
            <h1 className="mx-auto mb-6 max-w-5xl text-5xl font-black tracking-tight md:text-7xl">
              Scenic Thinking for Experiential Work
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-white/75 md:text-2xl">
              I am a scenic designer who also takes on experiential projects when teams need strong concept visuals, technical precision, and production-aware support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#rendering"
                className="rounded-full border border-cyan-400/60 px-5 py-2 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/10"
              >
                Rendering
              </a>
              <a
                href="#technical-drawing"
                className="rounded-full border border-amber-400/60 px-5 py-2 text-sm font-semibold text-amber-300 transition-colors hover:bg-amber-500/10"
              >
                Technical Drawing
              </a>
              <a
                href="#live-events"
                className="rounded-full border border-pink-400/60 px-5 py-2 text-sm font-semibold text-pink-300 transition-colors hover:bg-pink-500/10"
              >
                Live Events
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="border-b border-border/70 py-16">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">My Process</p>
              <h2 className="mx-auto max-w-4xl text-3xl font-black tracking-tight md:text-5xl">
                How I Approach Experiential Projects Differently
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Story First",
                detail:
                  "I start with audience sightlines, emotional beats, and brand intent so ideas are designed to communicate clearly in real space.",
                color: "#00BCD4",
              },
              {
                step: "02",
                title: "Design to Build",
                detail:
                  "Renderings and drawings are developed together so creative choices stay aligned with fabrication logic, venue constraints, and install flow.",
                color: "#FFC107",
              },
              {
                step: "03",
                title: "Production Clarity",
                detail:
                  "I package assets for agency teams, producers, and builders so approvals are faster and handoff risk is lower.",
                color: "#E91E63",
              },
            ].map((item) => (
              <AnimatedSection key={item.step}>
                <article className="h-full rounded-2xl border border-border/60 bg-card/20 p-6 text-center">
                  <p className="mb-2 text-xs font-semibold tracking-[0.22em]" style={{ color: item.color }}>
                    STEP {item.step}
                  </p>
                  <h3 className="mb-3 text-2xl font-bold tracking-tight">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-white/75">{item.detail}</p>
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
        copy="High-speed concept rendering and visual storytelling that helps agency teams secure stakeholder buy-in. These images are structured for presentation decks, creative reviews, and production kickoff alignment."
        accent="#00BCD4"
        items={processImagesByCategory.rendering || []}
        onItemClick={(index) => {
          setProcessModalCategory("rendering");
          handleGalleryItemClick(index);
        }}
      />

      <PortfolioSection
        id="technical-drawing"
        eyebrow="02 / Technical Drawing"
        title="Technical Drawings That Bridge Creative and Fabrication"
        copy="Drafting sets and build documents that convert creative direction into dimensions, clear scopes, and install-ready details. This is the layer where software precision serves production confidence."
        accent="#FFC107"
        items={processImagesByCategory["technical-drawing"] || []}
        cardAspectClass="aspect-[3/2]"
        imageFit="contain"
        cardBackgroundClass="bg-white/90"
        cardRoundedClass="rounded-md"
        onItemClick={(index) => {
          setProcessModalCategory("technical-drawing");
          handleGalleryItemClick(index);
        }}
      />

      <PortfolioSection
        id="live-events"
        eyebrow="03 / Live Events"
        title="Live Event and Installation Work in Real Conditions"
        copy="Executed environments showing how concept direction performs under deadlines, venue constraints, and audience flow. This is where strategy becomes physical experience."
        accent="#E91E63"
        items={processImagesByCategory["live-events"] || []}
        onItemClick={(index) => {
          setProcessModalCategory("live-events");
          handleGalleryItemClick(index);
        }}
      />

      <BrandsGrid />

      <section className="border-t border-border py-20">
        <div className="container max-w-4xl text-center">
          <AnimatedSection>
            <p className="mb-6 text-3xl font-light leading-relaxed md:text-4xl">
              Need an experiential designer who can support concept, documentation, and execution in one workflow?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 px-6 py-3 text-sm font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/10"
            >
              Start a Project <ArrowRight className="h-4 w-4" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <ProcessGalleryModal
        isOpen={processModalOpen}
        currentImage={currentImage}
        currentProject={currentProject?.mainItem}
        images={currentImages}
        imageIndex={imageIndex}
        projectIndex={projectIndex}
        totalProjects={groupedProjects.length}
        onClose={() => {
          setProcessModalOpen(false);
          setProjectIndex(0);
          setImageIndex(0);
        }}
        onNextImage={() => {
          if (canGoNextImage) setImageIndex((prev) => prev + 1);
        }}
        onPrevImage={() => {
          if (canGoPrevImage) setImageIndex((prev) => prev - 1);
        }}
        onNextProject={() => {
          if (canGoNextProject) {
            setProjectIndex((prev) => prev + 1);
            setImageIndex(0);
          }
        }}
        onPrevProject={() => {
          if (canGoPrevProject) {
            setProjectIndex((prev) => prev - 1);
            setImageIndex(0);
          }
        }}
        canGoNextProject={canGoNextProject}
        canGoPrevProject={canGoPrevProject}
        canGoNextImage={canGoNextImage}
        canGoPrevImage={canGoPrevImage}
        isLoadingImages={isLoadingProjectImages}
        categoryLabel={
          processModalCategory === "rendering"
            ? "Rendering"
            : processModalCategory === "technical-drawing"
              ? "Technical Drawing"
              : "Live Events"
        }
      />

      <Footer />
    </div>
  );
}
