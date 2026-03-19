import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalRenderingProjectBySlug, getLocalRenderingProjects } from "@shared/localPortfolios";
import { trpc } from "@/lib/trpc";

function inferEncodingFormat(url: string): string | undefined {
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.avif')) return 'image/avif';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  return undefined;
}

export default function RenderingProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  const isExperientialRendering = location.startsWith("/projects/experiential/rendering");
  const isRenderingRoute = location.startsWith("/projects/rendering");
  const projectBasePath = isExperientialRendering
    ? "/projects/experiential/rendering"
    : isRenderingRoute
      ? "/projects/rendering"
      : "/projects";
  const project = getLocalRenderingProjectBySlug(normalizedSlug);
  const allProjects = getLocalRenderingProjects().filter((entry) => !entry.galleryOnly);
  const { data: scenicProjects = [] } = trpc.projects.list.useQuery(
    { discipline: "scenic_design" },
    { staleTime: 1000 * 60 * 10 }
  );

  const projectUrl = project ? `https://www.brandonptdavis.com${projectBasePath}/${project.slug}` : undefined;
  const projectUpdatedDate = project?.updatedAt
    ? new Date(project.updatedAt).toISOString().split('T')[0]
    : undefined;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
  const renderings = images.length > 0
    ? images
    : project.coverImageUrl
      ? [{
          id: -1,
          imageUrl: project.coverImageUrl,
          altText: project.title,
          caption: "",
          sortOrder: 0,
        }]
      : [];

  // Parse tags for SEO (invisible)
  const tags = project.seoKeywords?.split(',').map(t => t.trim()).filter(Boolean) || [];

  // Find prev/next projects from rendering discipline only
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;
  const scenicProjectMatch =
    scenicProjects.find((entry) => {
      const sameTitle = entry.title.trim().toLowerCase() === project.title.trim().toLowerCase();
      if (!sameTitle) return false;
      const projectClient = String(project.client || "").trim().toLowerCase();
      const scenicClient = String(entry.client || "").trim().toLowerCase();
      if (projectClient && scenicClient && projectClient !== scenicClient) return false;
      if (project.year && entry.year && project.year !== entry.year) return false;
      return true;
    }) || null;
  const scenicProjectHref = scenicProjectMatch ? `/project/${scenicProjectMatch.slug}` : null;

  // Prepare lightbox images
  const lightboxImages = renderings.map(img => ({
    imageUrl: img.imageUrl,
    caption: img.caption,
    altText: img.altText
  }));

  const heroDescription = (() => {
    const excerpt = String(project.excerpt || "").trim();
    if (!excerpt) return project.year ? `${project.year}` : "";
    if (!project.year) return excerpt;
    const yearLabel = String(project.year);
    return excerpt.includes(yearLabel) ? excerpt : `${excerpt} ${yearLabel}.`;
  })();

  // Generate SEO-optimized description from excerpt or designNotes
  const seoDescription = project.excerpt || project.designNotes?.substring(0, 160) ||
    `${project.title} - Architectural rendering by Brandon PT Davis`;

  const projectImages = renderings
    .filter((img) => !!img.imageUrl)
    .slice(0, 20)
    .map((img, index) => ({
      type: 'ImageObject' as const,
      contentUrl: img.imageUrl || '',
      caption: img.caption || undefined,
      name: img.altText || img.caption || `${project.title} rendering ${index + 1}`,
      description: img.caption || seoDescription,
      thumbnailUrl: img.imageUrl || undefined,
      encodingFormat: img.imageUrl ? inferEncodingFormat(img.imageUrl) : undefined,
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lightboxIndex !== null) return;
      event.preventDefault();
      setLocation(isExperientialRendering ? "/projects/experiential" : "/projects/rendering");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExperientialRendering, lightboxIndex, setLocation]);

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
          { name: project.title, url: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}` },
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
          dateModified: projectUpdatedDate,
          genre: "Architectural Rendering",
          keywords: tags,
          mainEntityOfPage: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}`,
          url: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}`,
          workExample: projectImages.length > 0 ? projectImages : undefined,
        }}
      />
      <Header />

      {/* Sticky Navigation Arrows */}
      {prevProject && (
        <button
          onClick={() => setLocation(`${projectBasePath}/${prevProject.slug}`)}
          className="fixed left-5 top-1/2 z-50 -translate-y-1/2 text-white/44 transition-colors hover:text-white/78"
          aria-label="Previous rendering"
        >
          <ArrowLeft className="h-7 w-7" strokeWidth={1.6} />
        </button>
      )}

      {nextProject && (
        <button
          onClick={() => setLocation(`${projectBasePath}/${nextProject.slug}`)}
          className="fixed right-5 top-1/2 z-50 -translate-y-1/2 text-white/44 transition-colors hover:text-white/78"
          aria-label="Next rendering"
        >
          <ArrowRight className="h-7 w-7" strokeWidth={1.6} />
        </button>
      )}

      {/* Editorial Rendering Detail Layout */}
      <div className="container max-w-6xl pb-16 pt-8 space-y-8 md:pt-10 md:space-y-10">

        {/* Hero: Title + Featured Rendering */}
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
            <div className="space-y-5">
              <div className="space-y-3">
                <h1 className="max-w-[10ch] font-sans text-[clamp(2.2rem,4.2vw,4.2rem)] font-medium leading-[0.92] tracking-[-0.065em] text-foreground">
                  {project.title}
                </h1>
                {heroDescription && (
                  <p className="max-w-[30rem] text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.72] tracking-[-0.012em] text-foreground/64">
                    {heroDescription}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={isExperientialRendering ? "/projects/experiential" : "/projects/rendering"}
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/70 transition-colors hover:border-white/20 hover:text-foreground"
                >
                  Back to Renderings
                </Link>
                {scenicProjectHref ? (
                  <Link
                    href={scenicProjectHref}
                    className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/76 transition-colors hover:border-white/20 hover:text-foreground"
                  >
                    View Scenic Design Project
                  </Link>
                ) : null}
              </div>
            </div>

            {renderings.length > 0 ? (
              <div
                className="cursor-pointer group lg:pt-1"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={renderings[0].imageUrl || ''}
                  alt={renderings[0].altText || `${project.title} - Rendering by Brandon PT Davis`}
                  className="w-full max-h-[64vh] rounded-2xl object-contain object-top transition-opacity group-hover:opacity-95"
                />
              </div>
            ) : null}
          </div>
        </AnimatedSection>

        {/* Additional Images (if any) - Clean Grid */}
        {renderings.length > 1 && (
          <div className="grid grid-cols-2 gap-4 pt-1 md:grid-cols-3 lg:grid-cols-4">
            {renderings.slice(1).map((image, index) => (
              <AnimatedSection key={image.id}>
                <div
                  className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-xl"
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
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
