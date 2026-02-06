import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Articles() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({});

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
                <a className="text-sm font-medium hover:text-primary transition-colors">News</a>
              </Link>
              <Link href="/articles">
                <a className="text-sm font-medium text-primary">Articles</a>
              </Link>
              <Link href="/studio">
                <a className="text-sm font-medium hover:text-primary transition-colors">Studio</a>
              </Link>
            <Footer />
    </div>
          </nav>
        <Footer />
    </div>
      </header>

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <h1 className="mb-4">Scenic Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Articles on design philosophy, process, and the craft of scenic design.
          </p>
        <Footer />
    </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            <Footer />
    </div>
          ) : articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {article.coverImageUrl && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={article.coverImageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      <Footer />
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
                      <Footer />
    </div>
                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                      <div className="mt-4 text-xs text-muted-foreground">
                        {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      <Footer />
    </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            <Footer />
    </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles yet. Check back soon!</p>
            <Footer />
    </div>
          )}
        <Footer />
    </div>
      </section>
    <Footer />
    </div>
  );
}
