import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowRight, BookOpen, Newspaper } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({ featured: true, status: 'published' });
  const { data: newsItems, isLoading: newsLoading } = trpc.news.list.useQuery({});
  const { data: articles, isLoading: articlesLoading } = trpc.articles.list.useQuery({});

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container py-6">
          <nav className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Brandon Davis</h1>
              <p className="text-sm text-muted-foreground">Architecture & Design Portfolio</p>
            </div>
            <div className="flex items-center gap-6">
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
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <a className="text-sm font-medium hover:text-primary transition-colors">Admin</a>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl">
            <h1 className="mb-6">
              Crafting Spaces That Tell Stories
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              A portfolio showcasing innovative architecture and scenic design projects, from theatrical productions to experiential installations.
            </p>
            <div className="flex gap-4">
              <Link href="/projects">
                <Button size="lg" className="gap-2">
                  View Projects <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  About Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="mb-2">Featured Projects</h2>
              <p className="text-muted-foreground">Selected works from my portfolio</p>
            </div>
            <Link href="/projects">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {projectsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {project.coverImageUrl ? (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={project.coverImageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-muted" />
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {project.excerpt}
                      </p>
                      <Button variant="link" className="p-0 h-auto gap-2">
                        View Project <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured projects yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent News */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="mb-2">Recent News</h2>
              <p className="text-muted-foreground">Latest updates and announcements</p>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {newsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : newsItems && newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Newspaper className="h-4 w-4 text-[var(--accent-news)]" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No news items yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Scenic Insights (Articles) */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="mb-2">Scenic Insights</h2>
              <p className="text-muted-foreground">Articles on design philosophy and process</p>
            </div>
            <Link href="/articles">
              <Button variant="ghost" className="gap-2">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {articlesLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-[var(--accent-articles)]" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {article.readTime} min read
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Brandon Davis</h3>
              <p className="text-sm text-muted-foreground">
                Scenic designer and architect creating immersive spaces for theatre and beyond.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Portfolio</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/projects"><a className="text-muted-foreground hover:text-foreground transition-colors">Projects</a></Link></li>
                <li><Link href="/news"><a className="text-muted-foreground hover:text-foreground transition-colors">News</a></Link></li>
                <li><Link href="/articles"><a className="text-muted-foreground hover:text-foreground transition-colors">Articles</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/studio"><a className="text-muted-foreground hover:text-foreground transition-colors">Studio Tools</a></Link></li>
                <li><Link href="/about"><a className="text-muted-foreground hover:text-foreground transition-colors">About</a></Link></li>
                <li><Link href="/contact"><a className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get in touch to discuss your next project.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">Contact Me</Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Brandon Davis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
