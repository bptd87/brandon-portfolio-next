import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Heart, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

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

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  const { data: allRelatedProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline },
    { enabled: !!project?.discipline }
  );
  const relatedProjects = allRelatedProjects?.slice(0, 10);
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [liked, setLiked] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [renderingsOpen, setRenderingsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);
  const [videosOpen, setVideosOpen] = useState(true);

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
  
  // Find prev/next projects from related projects
  const currentIndex = relatedProjects?.findIndex(p => p.id === project.id) ?? -1;
  const prevProject = currentIndex > 0 ? relatedProjects?.[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < (relatedProjects?.length ?? 0) - 1 ? relatedProjects?.[currentIndex + 1] : null;

  return (
    <div className="min-h-screen relative">
      {/* Fixed Blurred Background */}
      <div className="fixed inset-0 z-0">
        {project.coverImageUrl ? (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${project.coverImageUrl})`,
              filter: 'blur(40px) brightness(0.3)',
              transform: 'scale(1.2)'
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        <Header />

        {/* Hero Section - Same width as content */}
        <div className="container max-w-3xl py-20">
          <div className="backdrop-blur-sm bg-background/10 rounded-2xl p-8 md:p-12 border border-white/10 text-center">
            {project.metadata?.subcategory && (
              <p className="text-xs font-pixel text-white/80 mb-4">
                {project.metadata.subcategory}
              </p>
            )}
            
            <h1 className="text-5xl md:text-6xl font-serif italic text-white mb-6">
              {project.title}
            </h1>
            
            <div className="flex items-center gap-6 text-white/90 justify-center flex-wrap text-sm">
              {project.client && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{project.client}</span>
                </div>
              )}
              {project.location && (
                <span>· {project.location}</span>
              )}
              {project.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{project.year}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-6 text-white/80 justify-center">
              <button 
                onClick={() => setLiked(!liked)}
                className="flex items-center gap-1 hover:text-red-400 transition-colors"
              >
                <Heart className={`h-5 w-5 ${liked ? 'fill-red-400 text-red-400' : ''}`} />
                <span>{(project.likeCount || 0) + (liked ? 1 : 0)}</span>
              </button>
              <div className="flex items-center gap-1">
                <Eye className="h-5 w-5" />
                <span>{project.viewCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Glass Morphism */}
        <div className="container max-w-3xl pb-16">
          {/* Design Notes - Glass Card */}
          {designNotes && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <h2 className="text-xs font-pixel text-white/60 mb-6">
                PROJECT OVERVIEW
              </h2>
              <div className="prose prose-lg prose-invert max-w-none">
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-lg">
                  {showFullNotes ? designNotes : notesPreview}
                </p>
                {shouldShowReadMore && (
                  <Button 
                    variant="link" 
                    onClick={() => setShowFullNotes(!showFullNotes)}
                    className="px-0 mt-4 text-white/80 hover:text-white"
                  >
                    {showFullNotes ? '...Show Less' : '...Read More'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Gallery Section - Full Width Images */}
          {productionPhotos.length > 0 && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <button
                onClick={() => setGalleryOpen(!galleryOpen)}
                className="flex items-center justify-between w-full mb-6 group"
              >
                <h2 className="text-xs font-pixel text-white/60">
                  GALLERY ({productionPhotos.length})
                </h2>
                {galleryOpen ? (
                  <ChevronUp className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                )}
              </button>
              
              {galleryOpen && (
                <div className="grid grid-cols-1 gap-6">
                  {productionPhotos.map((image) => (
                    <div key={image.id} className="group">
                      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
                        <img 
                          src={image.imageUrl || ''} 
                          alt={image.altText || image.caption || project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {image.caption && (
                        <p className="text-sm text-white/60 mt-3 italic">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Renderings Section - Full Width */}
          {renderings.length > 0 && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <button
                onClick={() => setRenderingsOpen(!renderingsOpen)}
                className="flex items-center justify-between w-full mb-6 group"
              >
                <h2 className="text-xs font-pixel text-white/60">
                  RENDERINGS ({renderings.length})
                </h2>
                {renderingsOpen ? (
                  <ChevronUp className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                )}
              </button>
              
              {renderingsOpen && (
                <div className="grid grid-cols-1 gap-6">
                  {renderings.map((image) => (
                    <div key={image.id} className="group">
                      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
                        <img 
                          src={image.imageUrl || ''} 
                          alt={image.altText || image.caption || project.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      {image.caption && (
                        <p className="text-sm text-white/60 mt-3 italic">{image.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Embeds - Glass Card */}
          {videos.length > 0 && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <button
                onClick={() => setVideosOpen(!videosOpen)}
                className="flex items-center justify-between w-full mb-6 group"
              >
                <h2 className="text-xs font-pixel text-white/60">
                  VIDEOS ({videos.length})
                </h2>
                {videosOpen ? (
                  <ChevronUp className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                )}
              </button>
              
              {videosOpen && (
                <div className="grid grid-cols-1 gap-8">
                  {videos.map((video) => (
                    <div key={video.id} className="group">
                      <div className="aspect-video overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/5">
                        {video.videoUrl && (
                          <iframe
                            src={getEmbedUrl(video.videoUrl)}
                            title={video.caption || project.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                      {video.caption && (
                        <p className="text-sm text-white/60 mt-3 italic">{video.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Creative Team - Glass Card */}
          {creativeTeamArray.length > 0 && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <button
                onClick={() => setTeamOpen(!teamOpen)}
                className="flex items-center justify-between w-full mb-6 group"
              >
                <h2 className="text-xs font-pixel text-white/60">
                  CREATIVE TEAM
                </h2>
                {teamOpen ? (
                  <ChevronUp className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                )}
              </button>
              
              {teamOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {creativeTeamArray.map((member, index) => (
                    <div key={index} className="flex justify-between items-baseline border-b border-white/10 pb-2">
                      <span className="text-sm text-white/60">{member.role}</span>
                      <span className="text-base text-white/90">{member.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          <div className="flex items-center justify-between mb-12">
            {prevProject ? (
              <button
                onClick={() => setLocation(`/projects/${prevProject.slug}`)}
                className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Previous</span>
              </button>
            ) : (
              <div />
            )}
            
            {nextProject ? (
              <button
                onClick={() => setLocation(`/projects/${nextProject.slug}`)}
                className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-lg transition-colors"
              >
                <span className="text-sm">Next</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div />
            )}
          </div>

          {/* Related Projects */}
          {relatedProjectsFiltered.length > 0 && (
            <div className="mb-12 backdrop-blur-md bg-background/40 rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl">
              <h2 className="text-xs font-pixel text-white/60 mb-8">
                MORE FROM {project.discipline?.replace('_', ' ').toUpperCase()}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProjectsFiltered.map((relatedProject) => (
                  <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-black/20 backdrop-blur-sm border border-white/5 mb-3">
                        {relatedProject.coverImageUrl && (
                          <img 
                            src={relatedProject.coverImageUrl} 
                            alt={relatedProject.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        )}
                      </div>
                      <h3 className="text-white font-serif italic text-lg group-hover:text-white/80 transition-colors">
                        {relatedProject.title}
                      </h3>
                      {relatedProject.year && (
                        <p className="text-white/60 text-sm">{relatedProject.year}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back to Portfolio */}
          <div className="flex justify-center mt-16">
            <Link href={`/projects?discipline=${project.discipline}`}>
              <Button 
                variant="outline" 
                size="lg" 
                className="gap-2 backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                BACK TO PORTFOLIO
              </Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
