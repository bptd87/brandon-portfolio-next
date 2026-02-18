import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProjectDetailSkeleton } from "@/components/SkeletonLoaders";
import { getProjectPath } from "@/lib/projectRoutes";

// Convert YouTube/Vimeo URLs to embed format
function getEmbedUrl(url: string): string {
  if (!url) return '';

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Already an embed URL or unknown format
  return url;
}

// Color rotation for consistency with homepage
const ACCENT_COLORS = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  // Fetch projects in same discipline for navigation
  const { data: allProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline || undefined },
    { enabled: !!project?.discipline }
  );

  // Fetch related projects (same discipline) for "More Projects" section
  const { data: allRelatedProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline || undefined },
    { enabled: !!project?.discipline }
  );
  const relatedProjects = allRelatedProjects; // Show all projects
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{ imageUrl: string | null; caption: string | null; altText: string | null }>>([]);

  // Track project view
  useEffect(() => {
    if (project && typeof window !== 'undefined' && (window as any).analyticsTracker) {
      (window as any).analyticsTracker.trackProjectView(
        project.id,
        project.slug,
        project.title,
        project.discipline,
        project.subcategory
      );
    }
  }, [project?.id]);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const productionPhotos = images.filter(img => img.imageType === 'production');
  const renderings = images.filter(img => img.imageType === 'rendering');
  const videos = images.filter(img => img.imageType === 'video');

  // Parse creative team from JSON array
  let creativeTeamArray: Array<{ name: string, role: string }> = [];
  try {
    if (typeof project.creativeTeam === 'string') {
      creativeTeamArray = JSON.parse(project.creativeTeam);
    } else if (Array.isArray(project.creativeTeam)) {
      creativeTeamArray = project.creativeTeam;
    }
  } catch (e) {
    console.error('Failed to parse creative team:', e);
  }

  // Design notes with "Read More" functionality
  const designNotes = project.designNotes || '';
  const notesPreview = designNotes.length > 800 ? designNotes.substring(0, 800) + '...' : designNotes;
  const shouldShowReadMore = designNotes.length > 800;

  // Get related projects excluding current one
  const relatedProjectsFiltered = relatedProjects?.filter(p => p.id !== project.id) || [];

  // Find prev/next projects from same discipline only
  const currentIndex = allProjects?.findIndex(p => p.id === project.id) ?? -1;
  const prevProject = currentIndex > 0 ? allProjects?.[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < (allProjects?.length ?? 0) - 1 ? allProjects?.[currentIndex + 1] : null;

  // Determine accent color based on project index
  const accentColor = ACCENT_COLORS[currentIndex % 3] || ACCENT_COLORS[0];

  // Prepare creative work schema data
  const projectImages = productionPhotos.slice(0, 5).map(img => ({
    type: 'ImageObject' as const,
    contentUrl: img.imageUrl || '',
    caption: img.caption || undefined,
    name: img.altText || undefined,
  })).filter(img => img.contentUrl);

  const contributors = creativeTeamArray.map(member => ({
    type: 'Person' as const,
    name: member.name,
    roleName: member.role,
  }));

  const projectUrl = `https://www.brandonptdavis.com${location}`;
  const disciplineLabel = project.discipline === 'scenic_design'
    ? 'Scenic Design'
    : project.discipline === 'experiential_design'
      ? 'Experiential'
      : project.discipline === 'rendering'
        ? 'Rendering'
        : 'Projects';
  const disciplineLink = project.discipline === 'rendering'
    ? '/projects/rendering'
    : project.discipline === 'experiential_design'
      ? '/projects/experiential'
      : project.discipline === 'scenic_design'
        ? '/projects/scenic-design'
        : '/projects';
  const moreProjectsLabel = project.discipline === 'scenic_design'
    ? 'More Scenic Design'
    : disciplineLabel === 'Projects'
      ? 'More Projects'
      : `More ${disciplineLabel}`;

  return (
    <div 
      className="relative min-h-screen bg-[#0b0b0d]" 
      style={{ '--accent-rgb': accentColor } as React.CSSProperties}
    >
      {/* Gradient background blobs - subtle neutral tones for sophisticated look */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary blur - top left */}
        <div className="absolute -top-40 left-1/4 h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,_rgba(100,200,255,0.12)_0%,_rgba(11,11,13,0)_60%)] blur-3xl" />
        {/* Secondary blur - bottom right */}
        <div className="absolute -bottom-20 right-1/4 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,_rgba(100,200,255,0.08)_0%,_rgba(11,11,13,0)_65%)] blur-3xl" />
        {/* Tertiary blur - left side */}
        <div className="absolute top-1/2 -left-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(100,200,255,0.06)_0%,_rgba(11,11,13,0)_70%)] blur-3xl" />
      </div>

      <div className="relative z-10">
        <SEO
          title={`${project.title} | Brandon PT Davis`}
          description={project.excerpt || `${project.title} - Scenic design project by Brandon PT Davis`}
          image={project.coverImageUrl || undefined}
          type="website"
          keywords={project.seoKeywords || undefined}
          url={projectUrl}
        />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Projects", url: "https://www.brandonptdavis.com/projects" },
          { name: project.title, url: projectUrl },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: project.excerpt || undefined,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString().split('T')[0] : undefined,
          genre: project.discipline?.replace('_', ' ') || 'Scenic Design',
          keywords: project.seoKeywords?.split(',').map(k => k.trim()) || [],
          locationCreated: project.client ? {
            name: project.client,
            ...(project.location && {
              address: {
                addressLocality: project.location.split(',')[0]?.trim(),
                addressRegion: project.location.split(',')[1]?.trim() || undefined,
                addressCountry: "US",
              },
            }),
          } : undefined,
          url: projectUrl,
          workExample: projectImages.length > 0 ? projectImages : undefined,
          about: project.designNotes || undefined,
          contributor: contributors.length > 0 ? contributors : undefined,
        }}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <Breadcrumb
          items={[
            { label: "Work", href: "/projects" },
            { label: disciplineLabel, href: disciplineLink },
            { label: project.title }
          ]}
        />
      </div>

      {/* Minimal Header Section */}
      <section className="border-b border-border/30">
        <div 
          className="container py-12"
          style={{ '--accent-color': accentColor } as React.CSSProperties}
        >
          <div className="space-y-6">
            {/* Subcategory badge */}
            {project.subcategory && (
              <Badge
                variant="outline"
                className="text-xs tracking-widest font-bold px-4 py-1.5 border-2 rounded-full"
                style={{
                  borderColor: accentColor,
                  color: accentColor
                }}
              >
                {project.subcategory.toUpperCase()}
              </Badge>
            )}

            {/* Project title */}
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight" style={{ color: accentColor }}>
              {project.title}
            </h1>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-6 text-foreground/70 text-base">
              {project.client && (
                <div>
                  <span className="font-semibold">{project.client}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{project.location}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>{project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div 
        className="container py-16 space-y-16"
        style={{ '--accent-color': accentColor } as React.CSSProperties}
      >

        {/* Creative Team */}
        {creativeTeamArray.length > 0 && (
          <AnimatedSection>
            <div className="md:max-w-[calc(50%-12px)]">
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: `var(--accent-color)` }}>
                Creative Team
              </h2>
              <div className="space-y-3">
                  {creativeTeamArray.map((member, idx) => {
                    // Create slug from name for collaborator link
                    const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                    return (
                      <Link key={idx} href={`/about/collaborators#${slug}`}>
                        <div className="flex items-baseline gap-4 group cursor-pointer">
                          <p className="font-semibold text-foreground transition-colors flex-1" style={{ borderColor: accentColor }} onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Production Photos Gallery */}
        {productionPhotos.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: `var(--accent-color)` }}>
                Production Photos
                <span className="ml-4 text-muted-foreground text-lg">({productionPhotos.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productionPhotos.map((img, idx) => {
                    const accentColors = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
                    const accentColor = accentColors[idx % accentColors.length];
                    return (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div
                        className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
                        onClick={() => {
                          setLightboxImages(productionPhotos);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <ProgressiveImage
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                          aspectRatio="3/2"
                          smartPosition={true}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6">
                            <p className="text-sm font-semibold" style={{ color: accentColor }}>{img.caption}</p>
                          </div>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                            <p className="text-xs font-semibold">Click to expand</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                    );
                  })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Renderings */}
        {renderings.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: `var(--accent-color)` }}>
                Renderings
                <span className="ml-4 text-muted-foreground text-lg">({renderings.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderings.map((img, idx) => {
                    const accentColors = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
                    const accentColor = accentColors[idx % accentColors.length];
                    return (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div
                        className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
                        onClick={() => {
                          setLightboxImages(renderings);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <ProgressiveImage
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                          aspectRatio="3/2"
                          smartPosition={true}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6">
                            <p className="text-sm font-semibold" style={{ color: accentColor }}>{img.caption}</p>
                          </div>
                        )}

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                            <p className="text-xs font-semibold">Click to expand</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                    );
                  })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Design Notes */}
        {designNotes && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: `var(--accent-color)` }}>
                Design Notes
              </h2>
              <div 
                className="relative py-6 md:max-w-[calc(50%-12px)]"
                style={{ borderLeftColor: `var(--accent-color)` }}
              >
                <div className="text-foreground/85 leading-relaxed whitespace-pre-wrap text-lg text-justify px-8">
                  {(() => {
                    const text = showFullNotes ? designNotes : notesPreview;
                    const firstLetterIdx = text.search(/[a-zA-Z]/);
                    if (firstLetterIdx === -1) return text;
                    
                    const before = text.substring(0, firstLetterIdx);
                    const firstLetter = text[firstLetterIdx];
                    const after = text.substring(firstLetterIdx + 1);
                    
                    return (
                      <>
                        {before}
                        <span 
                          style={{
                            float: 'left',
                            fontSize: '3.5rem',
                            lineHeight: '2.8rem',
                            paddingRight: '0.5rem',
                            color: `var(--accent-color)`,
                            fontWeight: 'bold'
                          }}
                        >
                          {firstLetter}
                        </span>
                        {after}
                      </>
                    );
                  })()}
                </div>
                {shouldShowReadMore && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowFullNotes(!showFullNotes)}
                    className="mt-6 gap-2"
                    style={{ color: accentColor }}
                  >
                    {showFullNotes ? (
                      <>Show Less <ChevronUp className="h-4 w-4" /></>
                    ) : (
                      <>Read More <ChevronDown className="h-4 w-4" /></>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: `var(--accent-color)` }}>
                Videos
                <span className="ml-4 text-muted-foreground text-lg">({videos.length})</span>
              </h2>
              <div className="grid grid-cols-1 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="relative rounded-lg overflow-hidden border-2 border-border">
                      <div className="relative w-full pb-[56.25%]">
                        <iframe
                          src={getEmbedUrl(video.videoUrl || '')}
                          title={`Video: ${video.caption || 'embedded video'}`}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      {video.caption && (
                        <div className="p-4 bg-muted">
                          <p className="text-sm text-foreground/90">{video.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        <Separator className="my-16" />

        {/* More Scenic Design */}
        {relatedProjectsFiltered.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-12" style={{ color: `var(--accent-color)` }}>
                {moreProjectsLabel}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProjectsFiltered.map((relatedProject, idx) => {
                  const accentColors = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
                  const accentColor = accentColors[idx % accentColors.length];

                  return (
                    <Link key={relatedProject.id} href={getProjectPath(relatedProject)}>
                      <Card className="group border-0 bg-transparent shadow-none">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-md">
                          {relatedProject.coverImageUrl ? (
                            <ProgressiveImage
                              src={relatedProject.coverImageUrl}
                              alt={relatedProject.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              aspectRatio="16/9"
                              smartPosition={true}
                              loading="lazy"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="pt-2 text-center">
                          <h3
                            className="text-xs font-semibold tracking-[0.3em] uppercase"
                            style={{ color: accentColor }}
                          >
                            {relatedProject.title}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setLightboxIndex((prev) => Math.min(prev + 1, lightboxImages.length - 1))}
          onPrev={() => setLightboxIndex((prev) => Math.max(prev - 1, 0))}
        />
      )}
    </div>
  );
}
