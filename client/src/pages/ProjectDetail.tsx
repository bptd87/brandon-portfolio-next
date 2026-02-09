import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, MapPin, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";

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
const ACCENT_COLORS = ['#FF5722', '#00E5FF', '#FF1744'];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  // Fetch projects in same discipline for navigation
  const { data: allProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline },
    { enabled: !!project?.discipline }
  );
  
  // Fetch related projects (same discipline) for "More Projects" section
  const { data: allRelatedProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline },
    { enabled: !!project?.discipline }
  );
  const relatedProjects = allRelatedProjects; // Show all projects
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [renderingsOpen, setRenderingsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);
  const [videosOpen, setVideosOpen] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{imageUrl: string | null; caption: string | null; altText: string | null}>>([]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
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
  let creativeTeamArray: Array<{name: string, role: string}> = [];
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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.title} | Brandon PT Davis`}
        description={project.excerpt || project.description || `${project.title} - Scenic design project by Brandon PT Davis`}
        image={project.coverImageUrl || undefined}
        type="website"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Projects", url: "https://www.brandonptdavis.com/projects" },
          { name: project.title, url: `https://www.brandonptdavis.com/projects/${project.slug}` },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: project.excerpt || project.description || undefined,
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
          url: `https://www.brandonptdavis.com/projects/${project.slug}`,
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
            { label: project.discipline === 'scenic_design' ? 'Scenic Design' : project.discipline === 'experiential_design' ? 'Experiential' : project.discipline === 'rendering' ? 'Rendering' : 'Scenic Models', href: `/projects?discipline=${project.discipline}` },
            { label: project.title }
          ]}
        />
      </div>

      {/* Navigation arrows removed per user request */}

      {/* Full-Screen Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {project.coverImageUrl ? (
          <img 
            src={project.coverImageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-2xl">No cover image</p>
          </div>
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Color accent overlay */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-10"
          style={{ backgroundColor: accentColor }}
        />

        {/* Project info overlay - centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container max-w-4xl text-center px-8">
            {/* Subcategory badge */}
            <div className="flex justify-center mb-6">
              <Badge 
                variant="outline" 
                className="text-xs tracking-widest font-bold bg-background/90 backdrop-blur-md px-6 py-2.5 border-2 rounded-full"
                style={{
                  borderColor: accentColor,
                  color: accentColor
                }}
              >
                {project.subcategory?.toUpperCase() || project.discipline?.replace('_', ' ').toUpperCase() || 'PROJECT'}
              </Badge>
            </div>
            
            {/* Project title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              {project.title}
            </h1>

            {/* Metadata row with icons */}
            <div className="flex items-center justify-center gap-8 text-foreground/90 flex-wrap text-lg mb-4">
              {project.client && (
                <div className="flex items-center gap-2.5">
                  <MapPin className="h-5 w-5" style={{ color: accentColor }} />
                  <span className="font-medium">{project.client}</span>
                </div>
              )}
              {project.location && (
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">•</span>
                  <span className="font-medium">{project.location}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-2.5">
                  <span className="text-muted-foreground">•</span>
                  <Calendar className="h-5 w-5" style={{ color: accentColor }} />
                  <span className="font-medium">{project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container max-w-5xl py-16 space-y-16">
        
        {/* Design Notes */}
        {designNotes && (
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: accentColor }}>
                Design Notes
              </h2>
              <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {showFullNotes ? designNotes : notesPreview}
              </div>
              {shouldShowReadMore && (
                <Button
                  variant="ghost"
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  className="mt-4 gap-2"
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
          </AnimatedSection>
        )}

        {/* Production Photos Gallery */}
        {productionPhotos.length > 0 && (
          <AnimatedSection>
            <div>
              <button
                onClick={() => setGalleryOpen(!galleryOpen)}
                className="flex items-center justify-between w-full mb-8 group"
              >
                <h2 className="text-4xl font-black tracking-tighter" style={{ color: accentColor }}>
                  Production Photos
                  <span className="ml-4 text-muted-foreground text-lg">({productionPhotos.length})</span>
                </h2>
                {galleryOpen ? (
                  <ChevronUp className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
              
              {galleryOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {productionPhotos.map((img, idx) => (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div 
                        className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
                        onClick={() => {
                          setLightboxImages(productionPhotos);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6">
                            <p className="text-sm text-foreground/90">{img.caption}</p>
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                            <p className="text-xs font-semibold">Click to expand</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Renderings */}
        {renderings.length > 0 && (
          <AnimatedSection>
            <div>
              <button
                onClick={() => setRenderingsOpen(!renderingsOpen)}
                className="flex items-center justify-between w-full mb-8 group"
              >
                <h2 className="text-4xl font-black tracking-tighter" style={{ color: accentColor }}>
                  Renderings
                  <span className="ml-4 text-muted-foreground text-lg">({renderings.length})</span>
                </h2>
                {renderingsOpen ? (
                  <ChevronUp className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
              
              {renderingsOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderings.map((img, idx) => (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div 
                        className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
                        onClick={() => {
                          setLightboxImages(renderings);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-6">
                            <p className="text-sm text-foreground/90">{img.caption}</p>
                          </div>
                        )}
                        
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm border border-border">
                            <p className="text-xs font-semibold">Click to expand</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <AnimatedSection>
            <div>
              <button
                onClick={() => setVideosOpen(!videosOpen)}
                className="flex items-center justify-between w-full mb-8 group"
              >
                <h2 className="text-4xl font-black tracking-tighter" style={{ color: accentColor }}>
                  Videos
                  <span className="ml-4 text-muted-foreground text-lg">({videos.length})</span>
                </h2>
                {videosOpen ? (
                  <ChevronUp className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
              
              {videosOpen && (
                <div className="grid grid-cols-1 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="relative rounded-lg overflow-hidden border-2 border-border">
                      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          src={getEmbedUrl(video.videoUrl || '')}
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
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Creative Team */}
        {creativeTeamArray.length > 0 && (
          <AnimatedSection>
            <div>
              <button
                onClick={() => setTeamOpen(!teamOpen)}
                className="flex items-center justify-between w-full mb-8 group"
              >
                <h2 className="text-4xl font-black tracking-tighter" style={{ color: accentColor }}>
                  Creative Team
                </h2>
                {teamOpen ? (
                  <ChevronUp className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                ) : (
                  <ChevronDown className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
              
              {teamOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creativeTeamArray.map((member, idx) => {
                    // Create slug from name for collaborator link
                    const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                    
                    return (
                      <Link key={idx} href={`/about/collaborators#${slug}`}>
                        <div 
                          className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:bg-muted transition-all duration-300 cursor-pointer group"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = accentColor;
                            const nameEl = e.currentTarget.querySelector('p.font-semibold') as HTMLElement;
                            if (nameEl) nameEl.style.color = accentColor;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                            const nameEl = e.currentTarget.querySelector('p.font-semibold') as HTMLElement;
                            if (nameEl) nameEl.style.color = '';
                          }}
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-foreground transition-colors">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </AnimatedSection>
        )}

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <AnimatedSection>
            <div className="mt-16">
              <h2 className="text-3xl font-black tracking-tighter mb-6" style={{ color: accentColor }}>
                Tags
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag: any) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`}>
                    <span
                      className="px-5 py-2.5 rounded-full text-sm font-semibold text-background transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                      style={{ backgroundColor: accentColor }}
                    >
                      {tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        <Separator className="my-16" />

        {/* Related Projects */}
        {relatedProjectsFiltered.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: accentColor }}>
                More {project.discipline} Projects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedProjectsFiltered.map((relatedProject, idx) => {
                  // Cycle through brand colors for variety
                  const brandColors = [
                    '#FF5722', // Orange
                    '#00BCD4', // Cyan
                    '#E91E63', // Pink
                    '#FFC107', // Amber
                  ];
                  const hoverColor = brandColors[idx % brandColors.length];
                  
                  return (
                  <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
                    <Card className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:scale-[1.02] transition-all duration-500">
                      <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
                        {relatedProject.coverImageUrl ? (
                          <img
                            src={relatedProject.coverImageUrl}
                            alt={`${relatedProject.title} - Scenic design by Brandon PT Davis`}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        {/* Gradient overlay - fades out on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500">
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                              {relatedProject.client}
                            </p>
                            <h3 className="text-2xl font-bold text-white italic font-serif">
                              {relatedProject.title}
                            </h3>
                            {relatedProject.year && (
                              <p className="text-sm text-white/80 mt-2">{relatedProject.year}</p>
                            )}
                          </div>
                        </div>
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
