import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Box, Ruler, Search } from "lucide-react";
import { useState } from "react";
import { GalleryInfoModal } from "@/components/GalleryInfoModal";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function ScenicModelsPortfolio() {
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: 'scenic_models'
  });

  const { data: galleryItems, isLoading: galleryLoading } = trpc.modelGallery.list.useQuery(undefined, {
    retry: false
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  const isLoading = projectsLoading || galleryLoading;

  // 1. Process Gallery Items
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
    excerpt: item.project?.excerpt
  })) || [];

  // 2. Process Featured Items (only those NOT in gallery)
  const galleryProjectIds = new Set(galleryDisplayItems.map(item => item.id));
  const featuredProjects = projects?.filter(p => !galleryProjectIds.has(p.id)) || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Craftsmanship Focus */}
      <section className="py-28 border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-5xl">
          <AnimatedSection>
            <div className="flex items-center gap-4 mb-8">
              <Box className="w-10 h-10 text-pink-500" />
              <Ruler className="w-8 h-8 text-cyan-500" />
            </div>
            <p className="text-xs tracking-widest text-muted-foreground mb-4">SCENIC MODELS</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Scale Model<br />
              Archive
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Handcrafted scale models that capture the essence of theatrical design.
              Each piece represents meticulous attention to detail, materiality, and spatial relationships.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 1: Featured Projects (Full Case Studies not in gallery) */}
      {featuredProjects.length > 0 && (
        <section className="py-20 border-b border-border/50">
          <div className="container max-w-6xl">
            <AnimatedSection>
              <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-12">
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
                        {project.coverImageUrl && (
                          <ProgressiveImage
                            src={project.coverImageUrl}
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

                        {(project.client || project.year) && (
                          <p className="text-sm text-muted-foreground">
                            {project.client && <span>{project.client}</span>}
                            {project.client && project.year && <span className="mx-2">·</span>}
                            {project.year && <span>{project.year}</span>}
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

      {/* SECTION 2: Model Gallery (Grid + Modal) */}
      <section className="py-20">
        <div className="container max-w-7xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-[0.3em] text-muted-foreground font-medium text-center mb-16">
              Model Archive & Details
            </h2>
          </AnimatedSection>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : galleryDisplayItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryDisplayItems.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.05}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => {
                      setCurrentProjectIndex(index);
                      setModalOpen(true);
                    }}
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border/50">
                      {item.imageUrl && (
                        <ProgressiveImage
                          src={item.imageUrl}
                          alt={item.altText}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          <div className="bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2">
                            <Search className="w-3 h-3" />
                            View Detail
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-sm truncate group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.year}</p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-xl">
              <p className="text-muted-foreground">Gallery is being curated.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      <GalleryInfoModal
        isOpen={modalOpen}
        project={galleryDisplayItems[currentProjectIndex]}
        onClose={() => setModalOpen(false)}
        onNext={() => setCurrentProjectIndex((prev) => (prev + 1) % galleryDisplayItems.length)}
        onPrev={() => setCurrentProjectIndex((prev) => (prev - 1 + galleryDisplayItems.length) % galleryDisplayItems.length)}
        hasNext={galleryDisplayItems.length > 1}
        hasPrev={galleryDisplayItems.length > 1}
      />

      <Footer />
    </div>
  );
}
