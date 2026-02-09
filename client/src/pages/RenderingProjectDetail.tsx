import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function RenderingProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  
  // Fetch projects in same discipline for navigation
  const { data: allProjects } = trpc.projects.list.useQuery(
    { discipline: 'rendering' },
    { enabled: !!project }
  );
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading rendering...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Rendering Not Found</h2>
          <Link href="/projects/rendering">
            <Button variant="outline">Back to Renderings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const renderings = images.filter(img => img.imageType === 'rendering' || img.imageType === 'production');
  
  // Parse tags
  const tags = project.seoKeywords?.split(',').map(t => t.trim()).filter(Boolean) || [];
  
  // Extract software from design notes or use defaults
  const softwareUsed = ['Vectorworks', 'Twinmotion', 'Photoshop'];

  // Find prev/next projects from rendering discipline only
  const currentIndex = allProjects?.findIndex(p => p.id === project.id) ?? -1;
  const prevProject = currentIndex > 0 ? allProjects?.[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < (allProjects?.length ?? 0) - 1 ? allProjects?.[currentIndex + 1] : null;

  // Prepare lightbox images
  const lightboxImages = renderings.map(img => ({
    imageUrl: img.imageUrl,
    caption: img.caption,
    altText: img.altText
  }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < lightboxImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  // Generate SEO-optimized description
  const seoDescription = project.excerpt || project.description || 
    `${project.title} - Architectural rendering and visualization by Brandon PT Davis. Created using ${softwareUsed.join(', ')}.`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.title} | Rendering | Brandon PT Davis`}
        description={seoDescription}
        image={project.coverImageUrl || undefined}
        url={`https://www.brandonptdavis.com/projects/${project.slug}`}
        type="website"
        keywords={tags.join(', ')}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Rendering", url: "https://www.brandonptdavis.com/projects/rendering" },
          { name: project.title, url: `https://www.brandonptdavis.com/projects/${project.slug}` },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: seoDescription,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString().split('T')[0] : undefined,
          genre: "Architectural Rendering",
          keywords: tags,
          url: `https://www.brandonptdavis.com/projects/${project.slug}`,
          about: project.designNotes || undefined,
        }}
      />
      <Header />

      {/* Sticky Navigation Arrows */}
      {prevProject && (
        <button
          onClick={() => setLocation(`/projects/${prevProject.slug}`)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 border-border hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          aria-label="Previous rendering"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}
      
      {nextProject && (
        <button
          onClick={() => setLocation(`/projects/${nextProject.slug}`)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 border-border hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          aria-label="Next rendering"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}

      {/* Main Content Container */}
      <div className="container max-w-6xl py-16 space-y-16">
        
        {/* Header Section */}
        <AnimatedSection>
          <div className="space-y-6">
            <Link href="/projects/rendering">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Renderings
              </Button>
            </Link>

            <div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
                {project.title}
              </h1>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-6">
                {project.year && <span>{project.year}</span>}
                {project.client && (
                  <>
                    <span>•</span>
                    <span>{project.client}</span>
                  </>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className="text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Main Rendering Image - Full Width */}
        {renderings.length > 0 && (
          <AnimatedSection>
            <div 
              className="cursor-pointer group rounded-2xl overflow-hidden"
              onClick={() => openLightbox(0)}
            >
              <img
                src={renderings[0].imageUrl || ''}
                alt={renderings[0].altText || project.title}
                className="w-full h-auto transition-opacity group-hover:opacity-95"
              />
            </div>
          </AnimatedSection>
        )}

        {/* Narrative Section */}
        {project.designNotes && (
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-sm tracking-widest uppercase text-muted-foreground mb-8">
                Narrative
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {project.designNotes}
                </p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Technical Details */}
        <AnimatedSection>
          <div className="max-w-3xl mx-auto border-t border-border pt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                  Software
                </h3>
                <div className="space-y-1">
                  {softwareUsed.map(software => (
                    <div key={software} className="text-foreground/80">
                      {software}
                    </div>
                  ))}
                </div>
              </div>
              
              {project.year && (
                <div>
                  <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
                    Year
                  </h3>
                  <div className="text-foreground/80">{project.year}</div>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Additional Images (if any) */}
        {renderings.length > 1 && (
          <div className="space-y-12">
            {renderings.slice(1).map((image, index) => (
              <AnimatedSection key={image.id}>
                <div 
                  className="cursor-pointer group rounded-2xl overflow-hidden"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img
                    src={image.imageUrl || ''}
                    alt={image.altText || `${project.title} - Image ${index + 2}`}
                    className="w-full h-auto transition-opacity group-hover:opacity-95"
                  />
                  {image.caption && (
                    <p className="text-center text-sm text-muted-foreground mt-4 italic">
                      {image.caption}
                    </p>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      <Footer />
    </div>
  );
}
