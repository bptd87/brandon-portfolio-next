import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: featuredProjects, isLoading: projectsLoading } = trpc.projects.list.useQuery({ 
    status: 'published', 
    featured: true 
  });
  const { data: recentNews, isLoading: newsLoading } = trpc.news.list.useQuery({ 
    status: 'published' 
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Brandon Davis</h1>
              <p className="text-muted-foreground">Architecture & Design Portfolio</p>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/projects">
                <a className="text-sm font-medium hover:text-primary transition-colors">Projects</a>
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
              {isAuthenticated && user?.role === 'admin' && (
                <Link href="/admin">
                  <a className="text-sm font-medium hover:text-primary transition-colors">Admin</a>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-bold mb-6">
            Crafting Spaces That Tell Stories
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A portfolio showcasing innovative architecture and scenic design projects, 
            from theatrical productions to experiential installations.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/projects">
                <a>View Projects</a>
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">
                <a>About Me</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold">Featured Projects</h3>
              <p className="text-muted-foreground mt-2">Selected works from my portfolio</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/projects">
                <a className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </a>
              </Link>
            </Button>
          </div>

          {projectsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProjects && featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 6).map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {project.coverImageUrl && (
                    <div className="aspect-video bg-muted" />
                  )}
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>
                      {project.year && `${project.year} • `}
                      {project.location || 'Various Locations'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No featured projects yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent News */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold">Latest News</h3>
              <p className="text-muted-foreground mt-2">Recent updates and announcements</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/news">
                <a className="flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </a>
              </Link>
            </Button>
          </div>

          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentNews && recentNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentNews.slice(0, 4).map((newsItem) => (
                <Card key={newsItem.id}>
                  <CardHeader>
                    <CardTitle>{newsItem.title}</CardTitle>
                    <CardDescription>
                      {new Date(newsItem.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                      {newsItem.location && ` • ${newsItem.location}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {newsItem.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No news items yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 mt-16">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Brandon Davis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
