import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { RenderingInfoModal } from "@/components/RenderingInfoModal";
import { ScenicModelsFAQ } from "@/components/ScenicModelsFAQ";
import { useState } from "react";
import { Loader2, Box, Ruler, ExternalLink } from "lucide-react";

interface DisplayItem {
  id: number;
  title: string;
  imageUrl: string | null;
  altText: string;
  slug: string;
  year: number | null;
  venue?: string | null;
  client?: string | null;
  designNotes?: string | null;
  excerpt?: string | null;
  images?: Array<{
    id: number;
    url: string;
    caption?: string | null;
    altText?: string | null;
  }>;
}

export default function ScenicModelsPortfolio() {
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: 'scenic_models'
  });

  const { data: galleryItems, isLoading: galleryLoading } = trpc.modelGallery.list.useQuery(undefined, {
    retry: false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  const isLoading = projectsLoading || galleryLoading;

  // Process Gallery Items (for the modal gallery)
  const galleryDisplayItems: DisplayItem[] = galleryItems?.map(item => ({
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

  // Process Featured Items (projects NOT in gallery)
  const galleryProjectIds = new Set(galleryDisplayItems.map(item => item.id));
  const featuredProjects = projects?.filter(p => !galleryProjectIds.has(p.id)).map(p => ({
    id: p.id,
    title: p.title,
    imageUrl: p.coverImageUrl || null,
    altText: p.title,
    slug: p.slug,
    year: p.year,
    excerpt: p.excerpt
  })) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-32 border-b border-border">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="space-y-12 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tight">
                Scenic Models
              </h1>

              <div className="space-y-8 max-w-3xl mx-auto">
                <p className="text-2xl md:text-3xl leading-relaxed font-extralight">
                  The model is the first reality.
                  <br />
                  <em className="font-['Playfair_Display'] not-italic">Tangible spatial exploration</em>—
                  <br />
                  where scale, texture, and volume
                  <br />
                  meet to define the physical world.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 1: Featured Projects (Full Case Studies) */}
      {featuredProjects.length > 0 && (
        <section className="py-20 border-b border-border/50">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
                Selected Works
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProjects.map((project, index) => (
                <AnimatedSection key={project.id} delay={index * 0.1}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="group block"
                  >
                    <article className="space-y-5">
                      {/* Square Model Image */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
                        {project.imageUrl && (
                          <ProgressiveImage
                            src={project.imageUrl}
                            alt={`${project.title} - Scale Model by Brandon PT Davis`}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          />
                        )}

                        {/* Corner Detail Indicator */}
                        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Project Info */}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold group-hover:text-pink-500 transition-colors">
                          {project.title}
                        </h2>

                        {(project.year) && (
                          <p className="text-sm text-muted-foreground">
                            {project.year}
                          </p>
                        )}
                      </div>
                    </article>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: Model Archive Gallery (Modal-Based) */}
      <section className="py-20">
        <div className="container max-w-7xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
              Model Archive
            </h2>
          </AnimatedSection>

          {galleryDisplayItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryDisplayItems.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.05}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => {
                      setCurrentItemIndex(index);
                      setModalOpen(true);
                    }}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border/50">
                      {item.imageUrl && (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                          <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-black">
                            View Details
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{item.title}</h3>
                      {item.year && (
                        <p className="text-xs text-muted-foreground">{item.year}</p>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border rounded-lg bg-muted/10">
              <p className="text-muted-foreground text-lg">Model archive is being curated.</p>
            </div>
          )}
        </div>
      </section>

      {/* The Physical Process Section */}
      <section className="py-32 border-t border-border bg-muted/30">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
              The Physical Process
            </h2>
          </AnimatedSection>

          <div className="space-y-24">
            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">White Models</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    The initial sketch in three dimensions. White models focus purely on massing,
                    volume, and spatial relationships without the distraction of color or texture.
                    This is where the architecture of the play is discovered.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Laser Cutting</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Precision through technology. Laser cutting enables intricate architectural details,
                    ornamental patterns, and scaled elements that would be impossible to handcraft.
                    This technique bridges digital precision with physical craftsmanship.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">3D Printing</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Rapid prototyping for complex organic forms and intricate components.
                    3D printing allows exploration of sculptural elements, furniture details,
                    and architectural features at scale with accuracy and speed.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Texture & Finish</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Scale textures bring the world to life. From worn floorboards to peeling wallpaper,
                    every surface is treated to reflect the history and atmosphere of the environment.
                    The model becomes a tactile guide for the scenic artists.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="grid md:grid-cols-[1fr,2fr] gap-12 items-start">
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold">Final Presentation</h3>
                  <div className="w-16 h-0.5 bg-foreground" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    The final model is the contract. It is the shared vision between director,
                    designer, and production team. It serves as the primary reference for construction,
                    lighting, and blocking before the set ever hits the stage.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 3D Printing Tools & Resources Section */}
      <section className="py-32 border-t border-border">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
              Digital Tools & Resources
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedSection>
              <div className="p-8 border border-border rounded-2xl bg-muted/50 hover:bg-muted/75 transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Box className="w-8 h-8 text-cyan-500" />
                    <h3 className="text-2xl font-bold">3D Printing & Fabrication</h3>
                  </div>
                  <div className="w-12 h-0.5 bg-foreground" />
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Explore my dedicated architecture & scale design application for generating 3D models
                    optimized for 3D printing. Perfect for prototyping detailed architectural elements,
                    furniture components, and complex sculptural forms at scale.
                  </p>
                  <a
                    href="https://scale.brandonptdavis.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity group-hover:gap-3"
                  >
                    Launch Scale App
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="p-8 border border-border rounded-2xl bg-muted/50 hover:bg-muted/75 transition-colors group">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-8 h-8 text-pink-500" />
                    <h3 className="text-2xl font-bold">Laser Cutting Precision</h3>
                  </div>
                  <div className="w-12 h-0.5 bg-foreground" />
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Laser cutting enables pixel-perfect architectural details and intricate vector patterns.
                    From ornamental trim to scaled stonework, this technology creates components that would
                    be nearly impossible to achieve through traditional handcrafting alone.
                  </p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Specifications for laser cutting available upon request for specific fabrication projects.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Modal Gallery */}
      {galleryDisplayItems.length > 0 && (
        <RenderingInfoModal
          isOpen={modalOpen}
          project={galleryDisplayItems[currentItemIndex] || null}
          onClose={() => setModalOpen(false)}
          onNext={() => setCurrentItemIndex((prev) => (prev + 1) % galleryDisplayItems.length)}
          onPrev={() => setCurrentItemIndex((prev) => (prev - 1 + galleryDisplayItems.length) % galleryDisplayItems.length)}
          hasNext={galleryDisplayItems.length > 1}
          hasPrev={galleryDisplayItems.length > 1}
        />
      )}

      <ScenicModelsFAQ />

      <Footer />
    </div>
  );
}
