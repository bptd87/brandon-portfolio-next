import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  // Fetch ALL projects for navigation
  const { data: allProjects } = trpc.projects.list.useQuery({});
  
  // Fetch related projects (same discipline) for "More Projects" section
  const { data: allRelatedProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline },
    { enabled: !!project?.discipline }
  );
  const relatedProjects = allRelatedProjects?.slice(0, 10);
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
  const relatedProjectsFiltered = relatedProjects?.filter(p => p.id !== project.id).slice(0, 3) || [];
  
  // Find prev/next projects from ALL projects (not just same discipline)
  const currentIndex = allProjects?.findIndex(p => p.id === project.id) ?? -1;
  const prevProject = currentIndex > 0 ? allProjects?.[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < (allProjects?.length ?? 0) - 1 ? allProjects?.[currentIndex + 1] : null;

  // Determine accent color based on project index
  const accentColor = ACCENT_COLORS[currentIndex % 3] || ACCENT_COLORS[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${project.title} | Brandon PT Davis`}
        description={project.excerpt || project.description || `${project.title} - Scenic design project by Brandon PT Davis`}
        image={project.coverImageUrl || undefined}
        url={`https://www.brandonptdavis.com/projects/${project.slug}`}
        type="website"
      />
      <Header />

      {/* Sticky Navigation Arrows */}
      {prevProject && (
        <button
          onClick={() => setLocation(`/projects/${prevProject.slug}`)}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          style={{ borderColor: accentColor }}
          aria-label="Previous project"
        >
          <ArrowLeft className="h-6 w-6" style={{ color: accentColor }} />
        </button>
      )}
      
      {nextProject && (
        <button
          onClick={() => setLocation(`/projects/${nextProject.slug}`)}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-50 backdrop-blur-md bg-background/80 border-2 hover:bg-background p-4 rounded-full transition-all hover:scale-110"
          style={{ borderColor: accentColor }}
          aria-label="Next project"
        >
          <ArrowRight className="h-6 w-6" style={{ color: accentColor }} />
        </button>
      )}

      {/* Full-Screen Hero Section */}
      <section className="relative h-[85vh] overflow-hidden">
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

        {/* Project info overlay - bottom positioned */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24">
          <div className="container max-w-5xl">
            <div className="flex items-center gap-4 mb-6">
              <Badge 
                variant="outline" 
                className="text-sm tracking-wider font-semibold bg-background/80 backdrop-blur-sm px-4 py-2 border-2"
                style={{
                  borderColor: accentColor,
                  color: accentColor
                }}
              >
                {project.discipline?.toUpperCase() || 'PROJECT'}
              </Badge>
              {project.year && (
                <span className="text-sm text-foreground/80 font-pixel">{project.year}</span>
              )}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-tight">
              {project.title}
            </h1>

            <div className="flex items-center gap-6 text-foreground/90 flex-wrap text-base mb-8">
              {project.client && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{project.client}</span>
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
                  <Calendar className="h-5 w-5" />
                  <span>{project.year}</span>
                </div>
              )}
            </div>

            <Link href="/projects">
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 font-semibold text-base px-8 py-6 border-2"
              >
                <ArrowLeft className="h-5 w-5" />
                BACK TO PROJECTS
              </Button>
            </Link>
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
                <div className="space-y-8">
                  {productionPhotos.map((img, idx) => (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div 
                        className="group relative overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => {
                          setLightboxImages(productionPhotos);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="w-full h-auto object-cover group-hover:scale-102 group-hover:brightness-110 transition-all duration-500"
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
                <div className="space-y-8">
                  {renderings.map((img, idx) => (
                    <AnimatedSection key={img.id} delay={idx * 50}>
                      <div 
                        className="group relative overflow-hidden rounded-lg cursor-pointer"
                        onClick={() => {
                          setLightboxImages(renderings);
                          setLightboxIndex(idx);
                          setLightboxOpen(true);
                        }}
                      >
                        <img
                          src={img.imageUrl || ''}
                          alt={img.altText || img.caption || project.title}
                          className="w-full h-auto object-cover group-hover:scale-102 group-hover:brightness-110 transition-all duration-500"
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
                  {creativeTeamArray.map((member, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProjectsFiltered.map((relatedProject, idx) => (
                  <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
                    <div className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg mb-4 border-2 border-border hover:border-foreground/20 transition-all">
                        {relatedProject.coverImageUrl ? (
                          <img
                            src={relatedProject.coverImageUrl}
                            alt={relatedProject.title}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-64 bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-foreground/70 transition-colors">
                        {relatedProject.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {relatedProject.year} • {relatedProject.client}
                      </p>
                    </div>
                  </Link>
                ))}
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
