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
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();
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
  const technicalDrawings = images.filter(img => img.imageType === 'technical_drawing');
  const videos = images.filter(img => img.imageType === 'video');

  // Parse metadata for additional project info
  let metadata: any = {};
  try {
    if (typeof project.metadata === 'string') {
      metadata = JSON.parse(project.metadata);
    } else if (project.metadata) {
      metadata = project.metadata;
    }
  } catch (e) {
    console.error('Failed to parse metadata:', e);
  }

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
      <section className="relative h-[45vh] overflow-hidden">
        {project.coverImageUrl ? (
          <img 
            src={project.coverImageUrl} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-background" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        {/* Color accent overlay */}
        <div 
          className="absolute inset-0 mix-blend-multiply opacity-10"
          style={{ backgroundColor: accentColor }}
        />

        {/* Project info overlay - SIMPLIFIED HERO */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24">
          <div className="container max-w-5xl">
            
            {/* CLIENT LOGOS - Theme-Aware */}
            {((metadata.redBullLogoDark && metadata.redBullLogoLight) || (metadata.lumenatiLogoDark && metadata.lumenatiLogoLight)) && (
              <div className="mb-6">
                <div className="flex items-center gap-6 flex-wrap mb-4">
                  {(metadata.redBullLogoDark && metadata.redBullLogoLight) && (
                    <img 
                      src={metadata.redBullLogoLight} 
                      alt="Red Bull" 
                      className="h-10 md:h-12 w-auto"
                    />
                  )}
                  {(metadata.lumenatiLogoDark && metadata.lumenatiLogoLight) && (
                    <img 
                      src={theme === 'dark' ? metadata.lumenatiLogoDark : metadata.lumenatiLogoLight} 
                      alt="Lumenati" 
                      className="h-10 md:h-12 w-auto"
                    />
                  )}
                </div>
                <div className="text-xs font-pixel text-foreground/70 tracking-wider">
                  CLIENT: RED BULL  •  AGENCY: LUMENATI  •  ROLE: TECHNICAL DESIGNER
                </div>
              </div>
            )}
            
            {/* TITLE ONLY - Big & Bold */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
              {project.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="container max-w-5xl py-16 space-y-16">
        
        {/* PROJECT INTRO - Excerpt + Details */}
        <AnimatedSection>
          <div className="space-y-6">
            {project.excerpt && (
              <p className="text-2xl md:text-3xl font-semibold text-foreground/90 leading-relaxed">
                {project.excerpt}
              </p>
            )}
            <div className="flex items-center gap-6 text-foreground/70 flex-wrap text-base">
              {metadata.venue && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-semibold">{metadata.venue}</span>
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
        </AnimatedSection>

        {/* BIG STATS - Experiential Agency Style */}
        {metadata.venueCapacity && (
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 md:p-12 rounded-2xl border-2" style={{ borderColor: accentColor + '40' }}>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: accentColor }}>
                  {metadata.venueCapacity}
                </div>
                <div className="text-sm md:text-base font-semibold text-foreground/70 tracking-wider uppercase">
                  Fans in Attendance
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: accentColor }}>
                  1
                </div>
                <div className="text-sm md:text-base font-semibold text-foreground/70 tracking-wider uppercase">
                  Unforgettable Night
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: accentColor }}>
                  100%
                </div>
                <div className="text-sm md:text-base font-semibold text-foreground/70 tracking-wider uppercase">
                  Fan-Controlled Setlist
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* THE CHALLENGE - First text section */}
        {designNotes && designNotes.includes('THE CHALLENGE') && (
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: accentColor }}>
                THE CHALLENGE
              </h2>
              <div className="text-foreground/80 text-lg leading-relaxed">
                {designNotes.split('THE SOLUTION')[0].split('THE CHALLENGE')[1]?.trim().split('\n\n').map((p, idx) => (
                  <p key={idx} className="mb-4">{p}</p>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Technical Drawings - YOUR WORK SHOWCASE */}
        {technicalDrawings.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: accentColor }}>
                Technical Drawings
                <span className="ml-4 text-muted-foreground text-lg">({technicalDrawings.length})</span>
              </h2>
              
              {/* FULL-WIDTH GRID - Like Lumenati */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicalDrawings.map((img, idx) => (
                  <AnimatedSection key={img.id} delay={idx * 50}>
                    <div 
                      className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/2]"
                      onClick={() => {
                        setLightboxImages(technicalDrawings);
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={img.imageUrl || ''}
                        alt={img.altText || img.caption || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            </div>
          </AnimatedSection>
        )}

        {/* THE SOLUTION - Second text section */}
        {designNotes && designNotes.includes('THE SOLUTION') && (
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: accentColor }}>
                THE SOLUTION
              </h2>
              <div className="text-foreground/80 text-lg leading-relaxed">
                {designNotes.split('THE PROCESS')[0].split('THE SOLUTION')[1]?.trim().split('\n').map((line, idx) => {
                  if (line.startsWith('→') || line.startsWith('•')) {
                    return <p key={idx} className="mb-2 pl-4">{line}</p>;
                  }
                  return line.trim() ? <p key={idx} className="mb-4">{line}</p> : null;
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Event Photos Gallery */}
        {productionPhotos.filter(img => img.imageUrl !== project.coverImageUrl).length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: accentColor }}>
                Event Photos
                <span className="ml-4 text-muted-foreground text-lg">({productionPhotos.filter(img => img.imageUrl !== project.coverImageUrl).length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productionPhotos.filter(img => img.imageUrl !== project.coverImageUrl).map((img, idx) => (
                  <AnimatedSection key={img.id} delay={idx * 50}>
                    <div 
                      className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[16/9]"
                      onClick={() => {
                        setLightboxImages(productionPhotos.filter(img => img.imageUrl !== project.coverImageUrl));
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      <img
                        src={img.imageUrl || ''}
                        alt={img.altText || img.caption || project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-medium text-white drop-shadow-lg">{img.caption}</p>
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
            </div>
          </AnimatedSection>
        )}

        {/* THE PROCESS - Third text section */}
        {designNotes && designNotes.includes('THE PROCESS') && (
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: accentColor }}>
                THE PROCESS
              </h2>
              <div className="text-foreground/80 text-lg leading-relaxed">
                {designNotes.split('THE RESULT')[0].split('THE PROCESS')[1]?.trim().split('\n').map((line, idx) => {
                  if (line.startsWith('→') || line.startsWith('•')) {
                    return <p key={idx} className="mb-2 pl-4">{line}</p>;
                  }
                  return line.trim() ? <p key={idx} className="mb-4">{line}</p> : null;
                })}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* THE RESULT - Final text section */}
        {designNotes && designNotes.includes('THE RESULT') && (
          <AnimatedSection>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6" style={{ color: accentColor }}>
                THE RESULT
              </h2>
              <div className="text-foreground/80 text-lg leading-relaxed">
                {designNotes.split('THE RESULT')[1]?.trim().split('\n\n').map((p, idx) => (
                  <p key={idx} className="mb-4">{p}</p>
                ))}
              </div>
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

        {/* Project Video from Metadata */}
        {metadata.videoUrl && (
          <AnimatedSection>
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-8" style={{ color: accentColor }}>
                Event Footage
              </h2>
              <a 
                href={metadata.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl" style={{ borderColor: accentColor }}>
                  <div className="relative w-full bg-muted" style={{ paddingBottom: '56.25%' }}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: accentColor }}>
                        <svg className="w-10 h-10 text-background" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xl font-bold mb-2">Watch Event Footage</p>
                        <p className="text-sm text-muted-foreground">Brothers Osborne perform at Red Bull Jukebox Nashville</p>
                        <p className="text-xs text-muted-foreground mt-2">Opens on RedBull.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
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
