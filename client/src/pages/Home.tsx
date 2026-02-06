import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({ featured: true, status: 'published' });
  const { data: newsItems } = trpc.news.list.useQuery({});
  const { data: articles } = trpc.articles.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container py-4">
          <nav className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2">
                <span className="text-2xl font-bold">B</span>
                <div className="flex flex-col leading-tight">
                  <span className="text-xs font-semibold tracking-wider">BRANDON PT DAVIS</span>
                  <span className="text-[10px] text-muted-foreground tracking-wider">SCENIC DESIGNER</span>
                </div>
              </a>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/projects">
                <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">PORTFOLIO</a>
              </Link>
              <Link href="/news">
                <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">NEWS</a>
              </Link>
              <Link href="/about">
                <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">ABOUT</a>
              </Link>
              <Link href="/articles">
                <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">ARTICLES</a>
              </Link>
              <Link href="/studio">
                <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">STUDIO</a>
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <a className="text-xs font-medium tracking-wider hover:text-primary transition-colors">ADMIN</a>
                </Link>
              )}
              <Link href="/contact">
                <Button size="sm" className="text-xs tracking-wider">CONTACT</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - placeholder for now */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503095396549-807759245b35?w=1920')] bg-cover bg-center opacity-40" />
        
        {/* Hero Content */}
        <div className="relative z-20 text-center">
          <h1 className="mb-6 text-white">Brandon PT Davis</h1>
          <p className="text-xl md:text-2xl tracking-widest text-white/90 font-light">
            ART × TECHNOLOGY × DESIGN
          </p>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </button>
      </section>

      {/* News Carousel */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h2 className="mb-8">Latest News</h2>
          {newsItems && newsItems.length > 0 ? (
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {newsItems.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <Card className="w-[400px] hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3 text-xs tracking-wider">
                          {item.categoryId && categories ? 
                            categories.find(c => c.id === item.categoryId)?.name || 'NEWS' 
                            : 'NEWS'
                          }
                        </Badge>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
                        <div className="mt-4 text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No news items yet.</p>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-12">Featured Work</h2>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg mb-4">
                      {project.coverImageUrl ? (
                        <img 
                          src={project.coverImageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">No image</p>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                        <Button variant="secondary" className="gap-2">
                          VIEW CASE STUDY <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs tracking-wider">
                        SCENIC DESIGN
                      </Badge>
                      <span className="text-xs text-muted-foreground">{project.year}</span>
                    </div>
                    <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No featured projects yet.</p>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2">
                VIEW FULL ARCHIVE <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      {articles && articles.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <h2 className="mb-12">Articles & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4 text-sm tracking-wider">BRANDON PT DAVIS</h3>
              <p className="text-sm text-muted-foreground">
                Scenic & Experiential Designer
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">PORTFOLIO</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/projects"><a className="text-muted-foreground hover:text-foreground transition-colors">Projects</a></Link></li>
                <li><Link href="/news"><a className="text-muted-foreground hover:text-foreground transition-colors">News</a></Link></li>
                <li><Link href="/articles"><a className="text-muted-foreground hover:text-foreground transition-colors">Articles</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">RESOURCES</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/studio"><a className="text-muted-foreground hover:text-foreground transition-colors">Studio Tools</a></Link></li>
                <li><Link href="/about"><a className="text-muted-foreground hover:text-foreground transition-colors">About</a></Link></li>
                <li><Link href="/contact"><a className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm tracking-wider">CONNECT</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Get in touch to discuss your next project.
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">Contact Me</Button>
              </Link>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Brandon PT Davis. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
