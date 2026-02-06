import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Newspaper } from "lucide-react";
import { Link } from "wouter";

export default function News() {
  const { data: newsItems, isLoading } = trpc.news.list.useQuery({});

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
                <a className="text-sm font-medium hover:text-primary transition-colors">Projects</a>
              </Link>
              <Link href="/news">
                <a className="text-sm font-medium text-primary">News</a>
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
          <h1 className="mb-4">News & Updates</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Latest announcements, project launches, and career milestones.
          </p>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : newsItems && newsItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {item.coverImageUrl && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Newspaper className="h-4 w-4 text-[var(--accent-news)]" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      {item.location && (
                        <p className="text-sm text-muted-foreground mb-2">📍 {item.location}</p>
                      )}
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
    </div>
  );
}
