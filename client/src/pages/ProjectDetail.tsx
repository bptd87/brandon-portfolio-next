import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, MapPin, Calendar, Heart, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [liked, setLiked] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(true);
  const [renderingsOpen, setRenderingsOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Background Image */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        {project.coverImageUrl && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${project.coverImageUrl})`,
              filter: 'blur(8px) brightness(0.4)',
              transform: 'scale(1.1)'
            }}
          />
        )}
        
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          {project.metadata?.subcategory && (
            <p className="text-sm uppercase tracking-widest text-white/80 mb-4">
              {project.metadata.subcategory}
            </p>
          )}
          
          <h1 className="text-6xl md:text-7xl font-serif italic text-white mb-6">
            {project.title}
          </h1>
          
          <div className="flex items-center gap-6 text-white/90">
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

          <div className="flex items-center gap-4 mt-6 text-white/80">
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

      {/* Main Content */}
      <div className="container max-w-4xl py-16">
        {/* Design Notes - Primary Content */}
        {designNotes && (
          <div className="mb-16">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              PROJECT OVERVIEW
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="font-semibold mb-4">**Design Notes**</p>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {showFullNotes ? designNotes : notesPreview}
              </p>
              {shouldShowReadMore && (
                <Button 
                  variant="link" 
                  onClick={() => setShowFullNotes(!showFullNotes)}
                  className="px-0 mt-4"
                >
                  {showFullNotes ? '...Show Less' : '...Read More'}
                </Button>
              )}
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Gallery Section - Collapsible */}
        {productionPhotos.length > 0 && (
          <div className="mb-12">
            <button
              onClick={() => setGalleryOpen(!galleryOpen)}
              className="flex items-center justify-between w-full mb-6 group"
            >
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                GALLERY ({productionPhotos.length})
              </h2>
              {galleryOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
            
            {galleryOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productionPhotos.map((image) => (
                  <div key={image.id} className="group">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img 
                        src={image.imageUrl || ''} 
                        alt={image.altText || image.caption || project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-3 italic">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Renderings Section - Collapsible */}
        {renderings.length > 0 && (
          <div className="mb-12">
            <button
              onClick={() => setRenderingsOpen(!renderingsOpen)}
              className="flex items-center justify-between w-full mb-6 group"
            >
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                RENDERINGS ({renderings.length})
              </h2>
              {renderingsOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
            
            {renderingsOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderings.map((image) => (
                  <div key={image.id} className="group">
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img 
                        src={image.imageUrl || ''} 
                        alt={image.altText || image.caption || project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-3 italic">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Video Embeds */}
        {videos.length > 0 && (
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              VIDEOS ({videos.length})
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {videos.map((video) => (
                <div key={video.id} className="group">
                  <div className="aspect-video overflow-hidden bg-muted">
                    {video.videoUrl && (
                      <iframe
                        src={video.videoUrl}
                        title={video.caption || project.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                  {video.caption && (
                    <p className="text-sm text-muted-foreground mt-3 italic">{video.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-12" />

        {/* Creative Team - Collapsible */}
        {creativeTeamArray.length > 0 && (
          <div className="mb-12">
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center justify-between w-full mb-6 group"
            >
              <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                CREATIVE TEAM
              </h2>
              {teamOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
            
            {teamOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {creativeTeamArray.map((member, index) => (
                  <div key={index} className="flex justify-between items-baseline border-b border-border/50 pb-2">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    <span className="text-base">{member.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <Separator className="my-12" />
        <div className="flex justify-center">
          <Link href="/projects">
            <Button variant="outline" size="lg" className="gap-2">
              BACK TO PORTFOLIO
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
