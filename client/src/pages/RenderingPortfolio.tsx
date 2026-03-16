import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { RenderingFAQ } from "@/components/RenderingFAQ";
import { ProcessGalleryModal } from "@/components/ProcessGalleryModal";
import { useEffect, useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const RENDERING_PORTFOLIO_URL = "https://www.brandonptdavis.com/projects/rendering";
const RENDERING_PORTFOLIO_TITLE = "Theatre Renderings | Brandon PT Davis";
const RENDERING_PORTFOLIO_DESCRIPTION =
  "Atmospheric theatre renderings by Brandon PT Davis, developed as pre-production communication tools for directors, collaborators, and scenic teams.";
const RENDERING_PORTFOLIO_KEYWORDS = [
  "theatre renderings",
  "scenic design renderings",
  "stage design renderings",
  "production renderings",
  "pre-production visualization",
  "Brandon PT Davis",
].join(", ");

export default function RenderingPortfolio() {
  const cleanText = (value?: string | null) =>
    String(value || "")
      .replace(/\s+/g, " ")
      .trim();

  const trimToSentence = (value: string, max = 260) => {
    if (!value || value.length <= max) return value;
    const cut = value.slice(0, max);
    const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
    if (stop > 120) return cut.slice(0, stop + 1).trim();
    const wordStop = cut.lastIndexOf(" ");
    return `${cut.slice(0, wordStop > 80 ? wordStop : max).trim()}...`;
  };

  const hashSeed = (value: string) => {
    let h = 0;
    for (let i = 0; i < value.length; i++) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    return h;
  };

  const buildModalDescription = (project: {
    id?: number | null;
    designNotes?: string | null;
    client?: string | null;
    year?: string | number | null;
    title?: string | null;
  }) => {
    const notes = cleanText(project.designNotes);
    if (notes) return trimToSentence(notes, 260);

    const title = cleanText(project.title) || "this production";
    const client = cleanText(project.client);
    const year = project.year ? String(project.year) : "";
    const lead = [year, client].filter(Boolean).join(" • ");

    const variants = [
      `${lead ? `${lead} — ` : ""}Atmospheric rendering sequence for ${title}, built to communicate tone, spatial rhythm, and staging focus before production decisions are finalized.`,
      `${lead ? `${lead} — ` : ""}Concept rendering exploration for ${title}, emphasizing visual hierarchy, material character, and narrative composition for team alignment.`,
      `${lead ? `${lead} — ` : ""}Pre-production rendering study for ${title}, translating design intent into clear visual language for directors, collaborators, and build conversations.`,
      `${lead ? `${lead} — ` : ""}Image set for ${title} focused on mood, proportion, and scenographic clarity—designed to test choices before they move to the stage floor.`,
      `${lead ? `${lead} — ` : ""}Renderings for ${title} developed as story-first communication tools, balancing atmosphere with practical scenic readability.`,
    ];

    const seed = `${project.id || ""}|${title}|${client}|${year}`;
    return variants[hashSeed(seed) % variants.length];
  };

  // Full project pages - query rendering_projects where gallery_only = false
  const { data: projects, isLoading: projectsLoading } = trpc.renderingProjects.list.useQuery({
    galleryOnly: false
  });

  const { data: galleryItems, isLoading: galleryLoading } = trpc.renderingGallery.list.useQuery(undefined, {
    retry: false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isLoading = projectsLoading || galleryLoading;

  // 1. Process Gallery Items (for the middle section)
  const galleryDisplayItems = galleryItems?.map(item => ({
    id: item.project?.id || 0,
    title: item.displayTitle || item.project?.title || '',
    imageUrl: item.project?.coverImageUrl || null,
    altText: item.altText || item.project?.title || '',
    slug: item.project?.slug || '',
    year: item.project?.year || null,
    client: item.project?.client,
    designNotes: item.project?.designNotes,
    images: (item.project?.images || []).map(img => ({
      id: img.id,
      url: img.imageUrl || '',
      caption: img.caption,
      altText: img.altText
    }))
  })) || [];

  // 2. Process Featured Items (for the top section)
  // Filter out any projects that are already in the gallery to avoid duplicates
  const galleryProjectIds = new Set(galleryDisplayItems.map(item => item.id));

  const featuredDisplayItems = projects?.filter(p => !galleryProjectIds.has(p.id)).map(p => ({
    id: p.id,
    title: p.title,
    imageUrl: p.coverImageUrl || null,
    altText: p.title,
    slug: p.slug,
    year: p.year,
    client: p.client,
    excerpt: p.excerpt
  })) || [];

  const currentProject = galleryDisplayItems[currentProjectIndex] || null;
  const currentProjectImages = useMemo(() => {
    if (!currentProject) return [];
    const coverImage = currentProject.imageUrl
      ? [{
          id: -1,
          imageUrl: currentProject.imageUrl,
          videoUrl: null,
          altText: currentProject.altText || currentProject.title,
          displayTitle: currentProject.title,
          description: null,
        }]
      : [];

    const galleryImages = (currentProject.images || []).map((img) => ({
      id: img.id,
      imageUrl: img.url,
      videoUrl: null,
      altText: img.altText || currentProject.title,
      displayTitle: img.caption || null,
      description: null,
    }));

    // Admin data may include the same image as both cover and first gallery item.
    // Deduplicate by normalized URL to prevent repeated slides in the modal.
    const combined = [...coverImage, ...galleryImages].filter((img) => img.imageUrl);
    const seen = new Set<string>();
    return combined.filter((img) => {
      const key = String(img.imageUrl || "").trim().replace(/\?.*$/, "");
      if (!key) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [currentProject]);

  const currentImage = currentProjectImages[currentImageIndex];
  const totalProjects = galleryDisplayItems.length;
  const showcaseItems = [...featuredDisplayItems, ...galleryDisplayItems]
    .filter((item) => item.slug && item.imageUrl)
    .slice(0, 4);
  const showcaseFeatured = showcaseItems[0];
  const showcaseSupporting = showcaseItems.slice(1, 4);
  const remainingFeaturedItems = featuredDisplayItems.filter(
    (item) => !showcaseItems.some((showcaseItem) => showcaseItem.id === item.id)
  );
  const renderingPortfolioImage =
    featuredDisplayItems[0]?.imageUrl || galleryDisplayItems[0]?.imageUrl || undefined;
  const renderingPortfolioUpdatedDate = (projects || []).reduce((latest, project) => {
    const candidate = project.updatedAt || project.publishedAt || project.createdAt;
    if (!candidate) return latest;
    const isoDate = new Date(candidate).toISOString().split("T")[0];
    return isoDate > latest ? isoDate : latest;
  }, "");
  const renderingPortfolioImages = Array.from(
    new Set(
      [...featuredDisplayItems, ...galleryDisplayItems]
        .map((item) => item.imageUrl)
        .filter((value): value is string => Boolean(value))
    )
  ).slice(0, 12);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [currentProjectIndex]);

  const handleNextProject = () => {
    setCurrentProjectIndex((prev) => Math.min(prev + 1, totalProjects - 1));
  };

  const handlePrevProject = () => {
    setCurrentProjectIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => Math.min(prev + 1, currentProjectImages.length - 1));
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={RENDERING_PORTFOLIO_TITLE}
        description={RENDERING_PORTFOLIO_DESCRIPTION}
        image={renderingPortfolioImage}
        keywords={RENDERING_PORTFOLIO_KEYWORDS}
        url={RENDERING_PORTFOLIO_URL}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Rendering", url: RENDERING_PORTFOLIO_URL },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Rendering Portfolio",
          url: RENDERING_PORTFOLIO_URL,
          description: RENDERING_PORTFOLIO_DESCRIPTION,
          about:
            "A portfolio of theatre renderings used to communicate light, material, atmosphere, and spatial intent before production.",
          primaryImageOfPage: renderingPortfolioImage,
          mainEntity: {
            name: "Rendering Projects",
            itemListElement: [...featuredDisplayItems, ...galleryDisplayItems]
              .filter((item) => item.slug)
              .map((item, index) => ({
                position: index + 1,
                name: item.title,
                url: `${RENDERING_PORTFOLIO_URL}/${item.slug}`,
                datePublished: item.year ? `${item.year}-01-01` : undefined,
                image: item.imageUrl || undefined,
              })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Theatre Renderings",
          description: RENDERING_PORTFOLIO_DESCRIPTION,
          url: RENDERING_PORTFOLIO_URL,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Theatre Rendering",
          about:
            "Pre-production renderings built to support scenic collaboration, production alignment, and visual storytelling.",
          mainEntityOfPage: RENDERING_PORTFOLIO_URL,
          dateModified: renderingPortfolioUpdatedDate || undefined,
          keywords: RENDERING_PORTFOLIO_KEYWORDS.split(", "),
          image: renderingPortfolioImages,
          workExample: [...featuredDisplayItems, ...galleryDisplayItems]
            .filter((item) => item.imageUrl)
            .slice(0, 12)
            .map((item) => ({
              type: "ImageObject" as const,
              contentUrl: item.imageUrl || "",
              name: item.title,
              caption: `${item.title} rendering by Brandon PT Davis`,
            })),
        }}
      />
      <Header />

      <section className="pt-12 md:pt-16">
        <div className="container max-w-6xl">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="font-sans text-[clamp(2.5rem,6vw,5.3rem)] font-normal leading-[0.94] tracking-[-0.06em] text-foreground">
              Renderings
            </h1>
            <p className="mx-auto mt-6 max-w-[44rem] text-[clamp(1.04rem,1.7vw,1.5rem)] leading-[1.5] tracking-[-0.02em] text-foreground/76">
              Pre-production renderings developed to clarify atmosphere, spatial rhythm, and visual intent
              before teams move into drafting, budgeting, and fabrication.
            </p>
          </div>
        </div>
      </section>

      {showcaseItems.length > 0 && (
        <section className="pb-10 pt-14 md:pb-14 md:pt-16">
          <div className="container max-w-6xl">
            <div className="border-t border-white/12 pt-5">
              <p className="text-[0.78rem] uppercase tracking-[0.24em] text-foreground/46">Concept Renderings</p>
              <h2 className="mt-3 max-w-[18ch] font-sans text-[clamp(1.9rem,3vw,3.1rem)] font-normal leading-[0.98] tracking-[-0.05em] text-foreground">
                Image-first concept work built to establish scenic tone and visual argument.
              </h2>
              <p className="mt-4 max-w-[42rem] text-[1rem] leading-8 text-foreground/72">
                These featured renderings are closer to concept framing than documentation: atmosphere, material
                language, and narrative tone established early enough to guide scenic design conversations.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
              {showcaseItems.map((item) => (
                <Link key={item.id} href={`/projects/rendering/${item.slug}`}>
                  <a className="group block">
                    <div className="overflow-hidden rounded-xl bg-white/[0.02] p-3">
                      <div className="flex h-[20rem] items-center justify-center md:h-[22rem]">
                        <ProgressiveImage
                          src={item.imageUrl!}
                          alt={item.altText}
                          className="max-h-full w-auto max-w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                        />
                      </div>
                    </div>
                    <div className="pt-3">
                      <h3 className="text-[1.12rem] font-sans font-normal leading-[1.14] tracking-[-0.03em] text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[0.94rem] tracking-[-0.02em] text-foreground/52">
                        {[item.client, item.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {remainingFeaturedItems.length > 0 && (
        <section className="pb-8 pt-16 md:pb-12">
          <div className="container max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-[-0.05em] text-foreground">
                Scenic Design Renderings
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remainingFeaturedItems.map((item) => (
                <Link key={item.id} href={`/projects/rendering/${item.slug}`}>
                  <a className="group block">
                    <div className="aspect-[16/10] overflow-hidden rounded-xl bg-white/[0.02]">
                      {item.imageUrl ? (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-foreground/42">
                          Image unavailable
                        </div>
                      )}
                    </div>
                    <div className="pt-4">
                      <h3 className="text-[1.35rem] font-sans font-normal leading-[1.08] tracking-[-0.04em] text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.98rem] tracking-[-0.02em] text-foreground/54">
                        {[item.client, item.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryDisplayItems.length > 0 && (
        <section className="border-t border-white/12 py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-[-0.05em] text-foreground">
                Process and Alternate Views
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {galleryDisplayItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    setCurrentProjectIndex(index);
                    setCurrentImageIndex(0);
                    setModalOpen(true);
                  }}
                >
                  <div className="space-y-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white/[0.02]">
                      {item.imageUrl && (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/12" />
                    </div>
                    <div>
                      <h3 className="text-[1.25rem] font-sans font-normal leading-[1.12] tracking-[-0.04em] text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.98rem] tracking-[-0.02em] text-foreground/54">
                        {[item.client, item.year].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryDisplayItems.length > 0 && (
        <ProcessGalleryModal
          isOpen={modalOpen}
          currentImage={currentImage}
          currentProject={currentProject ? { displayTitle: currentProject.title, description: buildModalDescription(currentProject) } : undefined}
          images={currentProjectImages}
          imageIndex={currentImageIndex}
          projectIndex={currentProjectIndex}
          totalProjects={totalProjects}
          onClose={() => setModalOpen(false)}
          onNextImage={handleNextImage}
          onPrevImage={handlePrevImage}
          onNextProject={handleNextProject}
          onPrevProject={handlePrevProject}
          canGoNextProject={currentProjectIndex < totalProjects - 1}
          canGoPrevProject={currentProjectIndex > 0}
          canGoNextImage={currentImageIndex < currentProjectImages.length - 1}
          canGoPrevImage={currentImageIndex > 0}
          categoryLabel="Rendering"
        />
      )}

      <section className="border-t border-white/12 py-16 md:py-20">
        <div className="container max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div>
              <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-[-0.05em] text-foreground">
                Rendering in Practice
              </h2>
              <p className="mt-5 max-w-[40rem] text-[1.04rem] leading-8 text-foreground/72">
                These renderings are built to align collaborators before scenic decisions harden into drafting,
                budgets, and construction. The focus is always readability: atmosphere, composition, material
                hierarchy, and staging intent made clear early enough to shape the conversation.
              </p>
            </div>
            <div className="max-w-[34rem]">
              <ul className="space-y-3 text-[1rem] leading-7 text-foreground/68">
                <li>Atmosphere and light studies for design alignment</li>
                <li>Visual communication for directors and collaborators</li>
                <li>Renderings that clarify scenic rhythm and staging focus</li>
                <li>Alternate views and exploratory image sets for process review</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <RenderingFAQ />

      <Footer />
    </div>
  );
}
