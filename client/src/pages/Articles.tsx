import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen } from "lucide-react";
import { Link } from "wouter";

// Decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export default function Articles() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({});

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-20 border-b border-border">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">ARTICLES</p>
          <h1 className="mb-4">Scenic Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Articles on design philosophy, process, and the craft of scenic design.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {article.coverImageUrl && (
                      <div className="aspect-[16/9] overflow-hidden bg-muted">
                        <img 
                          src={article.coverImageUrl} 
                          alt={`Cover image for article: ${decodeHTMLEntities(article.title)}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onLoad={(e) => e.currentTarget.style.opacity = '1'}
                          onError={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="225"%3E%3Crect fill="%23374151" width="400" height="225"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                          }}
                          style={{ opacity: 0, transition: 'opacity 0.3s ease-in' }}
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-[var(--accent-articles)]" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {article.readTime} min read
                        </span>
                        {article.featured && (
                          <Badge variant="secondary" className="ml-auto">Featured</Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{decodeHTMLEntities(article.title)}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt ? decodeHTMLEntities(article.excerpt) : ''}</p>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', { 
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
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
