import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Projects() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery({ status: 'published' });
  const { data: categories } = trpc.categories.list.useQuery({ type: 'project' });

  const featuredProjects = projects?.filter(p => p.featured);
  const otherProjects = projects?.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <nav className="flex items-center justify-between">
            <Link href="/">
              <a className="text-2xl font-bold tracking-tight">Brandon Davis</a>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/projects">
                <a className="text-sm font-medium text-primary">Projects</a>
              </Link>
              <Link href="/news">
                <a className="text-sm font-medium hover:text-primary transition-colors">News</a>
              </Link>
              <Link href="/articles">
                <a className="text-sm font-medium hover:text-primary transition-colors">Articles</a>
              </Link>
              <Link href="/studio">
                <a className="text-sm font-medium hover:text-primary transition-colors">Studio</a>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="mb-4">Portfolio</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            A collection of scenic design projects spanning theatrical productions, experiential installations, and architectural visualizations.
          </p>
          
          {/* Category Filter */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">All Projects</Button>
              {categories.map((cat) => (
                <Button key={cat.id} variant="ghost" size="sm">
                  {cat.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {isLoading ? (
        <div className="container py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Projects */}
          {featuredProjects && featuredProjects.length > 0 && (
            <section className="py-16 bg-secondary/30">
              <div className="container">
                <h2 className="mb-8">Featured Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <Card className="h-full hover:shadow-xl transition-all cursor-pointer group">
                        {project.coverImageUrl ? (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={project.coverImageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="mb-3">
                            <Badge variant="secondary" className="mb-2">
                              {project.metadata?.subcategory || 'Scenic Design'}
                            </Badge>
                          </div>
                          <h3 className="text-2xl font-semibold mb-2 group-hover:text-[var(--accent-scenic)] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {project.excerpt}
                          </p>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            {project.client && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{project.client}</span>
                              </div>
                            )}
                            {project.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{project.location}</span>
                              </div>
                            )}
                            {project.year && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{project.year}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Other Projects */}
          {otherProjects && otherProjects.length > 0 && (
            <section className="py-16">
              <div className="container">
                <h2 className="mb-8">All Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                        {project.coverImageUrl ? (
                          <div className="aspect-[4/3] overflow-hidden">
                            <img 
                              src={project.coverImageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground text-sm">No image</p>
                          </div>
                        )}
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {project.excerpt}
                          </p>
                          <div className="space-y-1 text-xs text-muted-foreground">
                            {project.client && <div>{project.client}</div>}
                            {project.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {project.location}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Empty State */}
          {(!projects || projects.length === 0) && (
            <div className="container py-16">
              <div className="text-center">
                <p className="text-muted-foreground">No projects yet. Check back soon!</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
