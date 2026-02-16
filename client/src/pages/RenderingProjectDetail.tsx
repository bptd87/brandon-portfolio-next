import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";

export default function RenderingProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const isExperientialRendering = location.startsWith("/projects/experiential/rendering");
  const isRenderingRoute = location.startsWith("/projects/rendering");
  const projectBasePath = isExperientialRendering
    ? "/projects/experiential/rendering"
    : isRenderingRoute
      ? "/projects/rendering"
      : "/projects";
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });

  const projectUrl = project ? `https://www.brandonptdavis.com${projectBasePath}/${project.slug}` : undefined;

  // Fetch projects in same discipline for navigation
  const { data: allProjects } = trpc.projects.list.useQuery(
    { discipline: 'rendering', status: 'published' },
    { enabled: !!project }
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Found</h2>
          <Link href="/projects/rendering">
            <Button variant="outline">Back to Renderings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const renderings = images.filter(img => img.imageType === 'rendering' || img.imageType === 'production');

  // Parse tags for SEO (invisible)
  const tags = project.seoKeywords?.split(',').map(t => t.trim()).filter(Boolean) || [];

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

  // Generate SEO-optimized description from excerpt or designNotes
  const seoDescription = project.excerpt || project.designNotes?.substring(0, 160) ||
    `${project.title} - Architectural rendering by Brandon PT Davis`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.title} | Rendering | Brandon PT Davis`}
        description={seoDescription}
        image={project.coverImageUrl || undefined}
        type="website"
        keywords={tags.join(', ')}
        url={projectUrl}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          ...(isExperientialRendering
            ? [
                { name: "Experiential", url: "https://www.brandonptdavis.com/projects/experiential" },
                { name: "Rendering", url: "https://www.brandonptdavis.com/projects/experiential/rendering" },
              ]
            : [{ name: "Rendering", url: "https://www.brandonptdavis.com/projects/rendering" }]),
          { name: project.title, url: projectUrl || `https://www.brandonptdavis.com/projects/${project.slug}` },
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
          url: projectUrl || `https://www.brandonptdavis.com/projects/${project.slug}`,
        }}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <Breadcrumb
          items={isExperientialRendering
            ? [
                { label: "Work", href: "/projects" },
                { label: "Experiential", href: "/projects/experiential" },
                { label: "Rendering", href: "/projects/experiential/rendering" },
                { label: project.title }
              ]
            : [
                { label: "Work", href: "/projects" },
                { label: "Rendering", href: "/projects/rendering" },
                { label: project.title }
              ]}
        />
      </div>

      {/* Sticky Navigation Arrows */}
      {prevProject && (
        <button
          onClick={() => setLocation(`${projectBasePath}/${prevProject.slug}`)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 border-border hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          aria-label="Previous rendering"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}

      {nextProject && (
        <button
          onClick={() => setLocation(`${projectBasePath}/${nextProject.slug}`)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 border-border hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          aria-label="Next rendering"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      )}

      {/* Ultra-Minimal Gallery Layout */}
      <div className="container max-w-7xl pt-32 pb-16 space-y-12">

        {/* Back Button - Subtle */}
        <AnimatedSection>
          <Link href={isExperientialRendering ? "/projects/experiential" : "/projects/rendering"}>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </AnimatedSection>

        {/* Main Image */}
        {renderings.length > 0 && (
          <AnimatedSection>
            <div
              className="cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <img
                src={renderings[0].imageUrl || ''}
                alt={renderings[0].altText || `${project.title} - Rendering by Brandon PT Davis`}
                className="w-full h-auto rounded-2xl transition-opacity group-hover:opacity-95"
              />
            </div>
          </AnimatedSection>
        )}

        {/* Title + Caption - Centered, Minimal */}
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              {project.title}
            </h1>

            {project.year && (
              <p className="text-sm text-muted-foreground tracking-wider">
                {project.year}
              </p>
            )}

            {/* Short Poetic Caption (50-75 words from excerpt) */}
            {project.excerpt && (
              <p className="text-base leading-relaxed text-foreground/80 italic">
                {project.excerpt}
              </p>
            )}
          </div>
        </AnimatedSection>

        {/* Additional Images (if any) - Clean Grid */}
        {renderings.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
            {renderings.slice(1).map((image, index) => (
              <AnimatedSection key={image.id}>
                <div
                  className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-[16/9]"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img
                    src={image.imageUrl || ''}
                    alt={image.altText || `${project.title} - Image ${index + 2} - Rendering by Brandon PT Davis`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
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
