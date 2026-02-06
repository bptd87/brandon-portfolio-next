import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, MapPin, User } from "lucide-react";
import { Link, useParams } from "wouter";
import Header from "@/components/Header";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  // Images will be added later when the getImages endpoint is implemented
  const images: any[] = [];

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
          </div>
        </div>
      )}

      {/* Project Content */}
      <div className="container pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Title and Meta */}
          <div className="mb-8">
            <div className="mb-4">
              {project.metadata?.subcategory && (
                <Badge variant="secondary" className="mb-3">
                  {project.metadata.subcategory}
                </Badge>
              )}
            </div>
            <h1 className="mb-6">{project.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{project.excerpt}</p>
            
            {/* Project Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {project.client && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Client</div>
                    <div className="text-sm text-muted-foreground">{project.client}</div>
                  </div>
                </div>
              )}
              {project.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{project.location}</div>
                  </div>
                </div>
              )}
              {project.year && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="text-sm font-medium">Year</div>
                    <div className="text-sm text-muted-foreground">{project.year}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-8" />

          {/* Description */}
          {project.description && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-4">About This Project</h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed">{project.description}</p>
              </div>
            </div>
          )}

          {/* Credits */}
          {project.metadata && Object.keys(project.metadata).length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Credits</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.metadata.director && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Director</div>
                        <div className="text-sm">{project.metadata.director}</div>
                      </div>
                    )}
                    {project.metadata.coDesigner && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Co-Designer</div>
                        <div className="text-sm">{project.metadata.coDesigner}</div>
                      </div>
                    )}
                    {project.metadata.venue && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Venue</div>
                        <div className="text-sm">{project.metadata.venue}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Image Gallery */}
          {images && images.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6">Gallery</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image: any) => (
                  <div key={image.id} className="aspect-[4/3] overflow-hidden rounded-lg">
                    <img 
                      src={image.imageUrl} 
                      alt={image.caption || project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {image.caption && (
                      <p className="text-sm text-muted-foreground mt-2">{image.caption}</p>
                    )}
                  </div>
                ))}
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}
