import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { RenderingFAQ } from "@/components/RenderingFAQ";
import { ProcessGalleryModal } from "@/components/ProcessGalleryModal";
import { useEffect, useMemo, useState } from "react";

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
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-32 border-b border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="space-y-12 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                Renderings
              </h1>

              <div className="space-y-8 max-w-3xl mx-auto">
                <p className="text-2xl md:text-3xl leading-relaxed font-extralight">
                  Rendering is not documentation.
                  <br />
                  It is <em className="font-['Playfair_Display'] not-italic">authored visual storytelling</em>—
                  <br />
                  a deliberate act of framing light, material, and atmosphere
                  <br />
                  to communicate emotion before function.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 1: Featured Projects (Full Pages) */}
      {featuredDisplayItems.length > 0 && (
        <section className="py-20">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
                Selected Works
              </h2>
            </AnimatedSection>

            <div className="space-y-24">
              {featuredDisplayItems.map((item, index) => {
                const accentColors = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
                const accentColor = accentColors[index % accentColors.length];
                return (
                <AnimatedSection key={item.id}>
                  <div className="group block relative">
                    <Link href={`/projects/rendering/${item.slug}`}>
                      <article className="space-y-6 cursor-pointer">
                        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                          {item.imageUrl ? (
                            <ProgressiveImage
                              src={item.imageUrl}
                              alt={item.altText}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:opacity-95 group-hover:scale-[1.005]"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              Image failed to load
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="bg-background/80 backdrop-blur px-4 py-2 rounded-full text-xs uppercase tracking-widest font-medium">View Project</span>
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <h2 className="text-3xl md:text-4xl font-bold transition-colors" style={{ color: accentColor }}>
                            {item.title}
                          </h2>
                          {item.year && (
                            <p className="text-sm text-muted-foreground tracking-wider">
                              {item.year}
                            </p>
                          )}
                        </div>
                      </article>
                    </Link>
                  </div>
                </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 border-t border-border bg-muted/15">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                  Rendering Approach
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  These renderings are developed as communication tools for directors, collaborators, and production teams. Each image is composed to clarify spatial intent, mood, and material hierarchy before fabrication.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  The objective is clarity with atmosphere: images that can guide conversation, reduce ambiguity, and keep artistic decisions aligned from concept to implementation.
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card/25 p-6 md:p-8">
                <h3 className="mb-4 text-xs uppercase tracking-[0.22em] text-muted-foreground font-semibold">
                  What This Section Shows
                </h3>
                <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                  <li>Concept-focused hero renderings</li>
                  <li>Archive studies and alternate directions</li>
                  <li>Material, light, and atmosphere decisions</li>
                  <li>Image sets used for team alignment</li>
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 2: Rendering Gallery (Modals) */}
      {galleryDisplayItems.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="container max-w-7xl">
            <AnimatedSection>
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
                Archive & Exploration
              </h2>
            </AnimatedSection>

            {/* 3-Column Grid for Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryDisplayItems.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.05}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => {
                      setCurrentProjectIndex(index);
                      setCurrentImageIndex(0);
                      setModalOpen(true);
                    }}
                  >
                    <div className="space-y-4">
                      <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                        {item.imageUrl && (
                          <ProgressiveImage
                            src={item.imageUrl}
                            alt={item.altText}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          />
                        )}
                        {/* Overlay Icon */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.year}</p>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
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

      <RenderingFAQ />

      <Footer />
    </div>
  );
}
