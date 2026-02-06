import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, MapPin, User, Heart, Eye } from "lucide-react";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";
import { useState } from "react";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  const [showFullNotes, setShowFullNotes] = useState(false);
  const [liked, setLiked] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      <Footer />
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
        <Footer />
    </div>
      <Footer />
    </div>
    );
  }

  const images = project.images || [];
  const productionPhotos = images.filter(img => img.imageType === 'production');
  const renderings = images.filter(img => img.imageType === 'rendering');
  const videos = images.filter(img => img.imageType === 'video');

  // Parse creative team from JSON
  const creativeTeam = project.creativeTeam as any || {};

  // Design notes with "Read More" functionality
  const designNotes = project.designNotes || '';
  const notesPreview = designNotes.length > 500 ? designNotes.substring(0, 500) + '...' : designNotes;
  const shouldShowReadMore = designNotes.length > 500;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Back Button */}
      <div className="container py-6">
        <Link href="/projects">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      <Footer />
    </div>

      {/* Hero Image */}
      {project.coverImageUrl && (
        <div className="container mb-12">
          <div className="aspect-[21/9] overflow-hidden rounded-lg">
            <img 
              src={project.coverImageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          <Footer />
    </div>
        <Footer />
    </div>
      )}

      {/* Project Content */}
      <div className="container pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Title and Meta */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                {project.metadata?.subcategory && (
                  <Badge variant="secondary" className="mb-3">
                    {project.metadata.subcategory}
                  </Badge>
                )}
              <Footer />
    </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{project.viewCount || 0}</span>
                <Footer />
    </div>
                <button 
                  onClick={() => setLiked(!liked)}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{(project.likeCount || 0) + (liked ? 1 : 0)}</span>
                </button>
              <Footer />
    </div>
            <Footer />
    </div>
            <h1 className="text-5xl font-serif mb-6">{project.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{project.excerpt}</p>
            
            {/* Project Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {project.client && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Client<Footer />
    </div>
                    <div className="text-sm text-muted-foreground">{project.client}<Footer />
    </div>
                  <Footer />
    </div>
                <Footer />
    </div>
              )}
              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Location<Footer />
    </div>
                    <div className="text-sm text-muted-foreground">{project.location}<Footer />
    </div>
                  <Footer />
    </div>
                <Footer />
    </div>
              )}
              {project.year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Year<Footer />
    </div>
                    <div className="text-sm text-muted-foreground">{project.year}<Footer />
    </div>
                  <Footer />
    </div>
                <Footer />
    </div>
              )}
            <Footer />
    </div>
          <Footer />
    </div>

          <Separator className="my-8" />

          {/* Description */}
          {project.description && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">About This Project</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg">{project.description}</p>
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Design Notes */}
          {designNotes && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">Design Notes</h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg whitespace-pre-wrap">
                  {showFullNotes ? designNotes : notesPreview}
                </p>
                {shouldShowReadMore && (
                  <Button 
                    variant="link" 
                    onClick={() => setShowFullNotes(!showFullNotes)}
                    className="px-0 mt-4"
                  >
                    {showFullNotes ? 'Show Less' : 'Read More'}
                  </Button>
                )}
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Production Photos Gallery */}
          {productionPhotos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">Production Photos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {productionPhotos.map((image) => (
                  <div key={image.id} className="group">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <img 
                        src={image.imageUrl || ''} 
                        alt={image.altText || image.caption || project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    <Footer />
    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-3 italic">{image.caption}</p>
                    )}
                  <Footer />
    </div>
                ))}
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Renderings Gallery */}
          {renderings.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">Renderings & Sketches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderings.map((image) => (
                  <div key={image.id} className="group">
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                      <img 
                        src={image.imageUrl || ''} 
                        alt={image.altText || image.caption || project.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    <Footer />
    </div>
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-3 italic">{image.caption}</p>
                    )}
                  <Footer />
    </div>
                ))}
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Video Embeds */}
          {videos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">Videos</h2>
              <div className="grid grid-cols-1 gap-8">
                {videos.map((video) => (
                  <div key={video.id} className="group">
                    <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                      {video.videoUrl && (
                        <iframe
                          src={video.videoUrl}
                          title={video.caption || project.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    <Footer />
    </div>
                    {video.caption && (
                      <p className="text-sm text-muted-foreground mt-3 italic">{video.caption}</p>
                    )}
                  <Footer />
    </div>
                ))}
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Creative Team */}
          {Object.keys(creativeTeam).length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-serif mb-6">Creative Team</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {creativeTeam.director && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Director<Footer />
    </div>
                        <div className="text-base">{creativeTeam.director}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.coScenicDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Co-Scenic Designer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.coScenicDesigner}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.costumeDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Costume Designer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.costumeDesigner}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.lightingDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Lighting Designer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.lightingDesigner}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.soundDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Sound Designer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.soundDesigner}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.musicDirector && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Music Director<Footer />
    </div>
                        <div className="text-base">{creativeTeam.musicDirector}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.choreographer && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Choreographer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.choreographer}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                    {creativeTeam.projectionDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Projection Designer<Footer />
    </div>
                        <div className="text-base">{creativeTeam.projectionDesigner}<Footer />
    </div>
                      <Footer />
    </div>
                    )}
                  <Footer />
    </div>
                </CardContent>
              </Card>
            <Footer />
    </div>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-xl font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag: any) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              <Footer />
    </div>
            <Footer />
    </div>
          )}

          {/* Navigation */}
          <Separator className="my-8" />
          <div className="flex justify-between items-center">
            <Link href="/projects">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <Link href="/contact">
              <Button>Discuss Your Project</Button>
            </Link>
          <Footer />
    </div>
        <Footer />
    </div>
      <Footer />
    </div>
    <Footer />
    </div>
  );
}
