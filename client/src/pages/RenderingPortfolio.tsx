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
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: 'rendering'
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
    venue: item.project?.venue,
    client: item.project?.client,
    designNotes: item.project?.designNotes,
    excerpt: item.project?.excerpt,
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
          description: currentProject.excerpt || null,
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

    return [...coverImage, ...galleryImages].filter((img) => img.imageUrl);
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
              {featuredDisplayItems.map((item, index) => (
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
                          <h2 className="text-3xl md:text-4xl font-bold group-hover:text-foreground/70 transition-colors">
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Art-Led Principles */}
      <section className="py-32 border-t border-border bg-muted/30">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-20">
              Art Before Tools
            </h2>
          </AnimatedSection>

          <div className="space-y-24">
            {/* Composition */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Composition</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Every frame is a deliberate choice. Where the eye enters. Where it rests.
                    What remains in shadow. Composition is not about filling space—it's about
                    directing attention and building visual hierarchy that serves the narrative.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Light */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Light</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Light is emotion. It defines time, temperature, and tension. A rendering
                    without considered lighting is merely geometry. Light transforms space into
                    place, data into atmosphere, and structure into story.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Material */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Material</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Texture carries memory. Worn wood tells a different story than polished steel.
                    Material choices communicate history, use, and intention. These details are not
                    decoration—they are narrative devices that ground the viewer in a believable world.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Atmosphere */}
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Atmosphere</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    The space between objects matters as much as the objects themselves. Fog, haze,
                    depth—these atmospheric elements create separation, mystery, and scale. They remind
                    us that rendering is about capturing a moment in time, not just documenting form.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
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
          currentProject={currentProject ? { displayTitle: currentProject.title, description: currentProject.excerpt || currentProject.designNotes } : undefined}
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

      {/* Process as Layers */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-20">
              Process as Layers
            </h2>
          </AnimatedSection>

          <div className="space-y-16">
            {/* Layer 1 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">01</span>
                  <h3 className="text-2xl font-bold">Authored 3D Modeling</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  Every rendering begins with intentional geometry. Not generic assets—authored forms
                  that serve the specific vision of the project. The foundation is built with purpose.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 2 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">02</span>
                  <h3 className="text-2xl font-bold">Lighting & Material Development</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  Light and material are developed in tandem. This is where mood emerges—where technical
                  accuracy meets artistic interpretation. The rendering engine becomes a canvas.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 3 */}
            <AnimatedSection>
              <div className="space-y-4 pb-16 border-b border-border/50">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">03</span>
                  <h3 className="text-2xl font-bold">Composite Post-Production</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  The final image is refined through layering—color grading, atmospheric effects, and
                  compositional adjustments. This is where the rendering transcends technical output and
                  becomes a finished work.
                </p>
              </div>
            </AnimatedSection>

            {/* Layer 4 */}
            <AnimatedSection>
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-sm text-muted-foreground font-mono">04</span>
                  <h3 className="text-2xl font-bold">AI-Assisted Visualization</h3>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground ml-12">
                  When appropriate, AI tools support the post-production phase—texture generation,
                  atmospheric enhancement, or rapid iteration. These are instruments in service of the
                  vision, not replacements for craft.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <RenderingFAQ />

      <Footer />
    </div>
  );
}
