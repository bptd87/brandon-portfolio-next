
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { getCategoryBadgeClasses, getCategoryColor } from "@/lib/categoryColors";
import { Search } from "lucide-react";
import { Link } from "wouter";

// Decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export default function Articles() {
  return (
    <PageThemeWrapper forceTheme={null}>
      <ArticlesContent />
      <ThemeToggle />
    </PageThemeWrapper>
  );
}

function ArticlesContent() {
  const { data: articles, isLoading } = trpc.articles.list.useQuery({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Get unique categories
  const categories = React.useMemo(() => {
    if (!articles) return [];
    const uniqueCategories = new Set<string>();
    articles.forEach(article => {
      if (article.category?.name) {
        uniqueCategories.add(article.category.name);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [articles]);

  // Filter articles by search and category
  const filteredArticles = React.useMemo(() => {
    if (!articles) return [];

    let filtered = articles;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(article => article.category?.name === selectedCategory);
    } else {
      // If no category selected, exclude Musical Theatre & Cinema from main grid
      filtered = filtered.filter(article => article.category?.name !== 'Musical Theatre & Cinema');
    }

    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(article => (
        article.title.toLowerCase().includes(searchLower) ||
        (article.excerpt && article.excerpt.toLowerCase().includes(searchLower))
      ));
    }

    return filtered;
  }, [articles, searchQuery, selectedCategory]);

  // Get Musical Theatre & Cinema articles for separate section
  const musicalTheatreArticles = React.useMemo(() => {
    if (!articles) return [];
    return articles.filter(article => article.category?.name === 'Musical Theatre & Cinema');
  }, [articles]);
  


  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-20 border-b border-border">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">ARTICLES</p>
          <h1 className="mb-4">Scenic Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Articles on design philosophy, process, and the craft of scenic design.
          </p>

          {/* Search and Category Filter */}
          <div className="mt-8 space-y-6">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                }`}
              >
                All Articles
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    selectedCategory === category
                      ? 'shadow-lg'
                      : 'bg-background border border-border hover:shadow-md'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category ? getCategoryColor(category).hex : undefined,
                    color: selectedCategory === category ? '#000' : undefined,
                    borderColor: selectedCategory !== category ? getCategoryColor(category).hex + '40' : undefined,
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = getCategoryColor(category).hex;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.currentTarget.style.borderColor = getCategoryColor(category).hex + '40';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => {
                const categoryColor = article.category?.name 
                  ? getCategoryColor(article.category.name).hex
                  : '#FF6B35';
                
                return (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:scale-[1.02] transition-all duration-500">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                      {article.coverImageUrl ? (
                        <img 
                          src={article.coverImageUrl} 
                          alt={`Cover image for article: ${decodeHTMLEntities(article.title)}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <div className="text-muted-foreground">No image</div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    
                    <div className="p-0">
                      {article.category && (
                        <Badge 
                          variant="secondary" 
                          className="mb-3 text-xs font-bold"
                          style={{ 
                            backgroundColor: `${categoryColor}20`,
                            color: categoryColor,
                            borderColor: `${categoryColor}40`
                          }}
                        >
                          {article.category.name}
                        </Badge>
                      )}
                      
                      <h3 className="text-xl font-bold mb-2 transition-colors line-clamp-2"
                        style={{ color: 'inherit' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                        {decodeHTMLEntities(article.title)}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', { 
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        {article.readTime && (
                          <>
                            <span>•</span>
                            <span>{article.readTime} min read</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
              })}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching "{searchQuery}". Try a different search term.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Musical Theatre & Cinema Section */}
      {!selectedCategory && !searchQuery && musicalTheatreArticles.length > 0 && (
        <section className="py-16 border-t border-border/50">
          <div className="container">
            <div className="mb-12">
              <p className="text-xs tracking-widest text-muted-foreground mb-4">COURSE MATERIALS</p>
              <h2 className="text-4xl font-['Playfair_Display'] italic mb-4">Musical Theatre & Cinema</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Articles from a course I taught exploring the history and evolution of musical theatre and cinema.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {musicalTheatreArticles.map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <div 
                    className="group relative h-[400px] rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
                    style={{
                      border: article.category ? `1px solid ${getCategoryColor(article.category.name).hex}` : '1px solid rgb(55, 65, 81)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }}
                    onMouseEnter={(e) => {
                      if (article.category) {
                        e.currentTarget.style.boxShadow = `0 0 30px ${getCategoryColor(article.category.name).hex}80, 0 10px 15px -3px rgba(0, 0, 0, 0.1)`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                  >
                    {/* Cover Image */}
                    {article.coverImageUrl && (
                      <img 
                        src={article.coverImageUrl} 
                        alt={`Cover image for article: ${decodeHTMLEntities(article.title)}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 transition-all duration-300" />
                    
                    {/* Category Badge */}
                    {article.category && (
                      <div className="absolute top-4 left-4">
                        <span 
                          className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: getCategoryColor(article.category.name).hex }}
                        >
                          {article.category.name}
                        </span>
                      </div>
                    )}
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-xl md:text-2xl font-['Playfair_Display'] italic font-normal text-white mb-3 leading-tight">
                        {decodeHTMLEntities(article.title)}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs uppercase tracking-wider">
                        <span style={{ color: article.category ? getCategoryColor(article.category.name).hex : '#9CA3AF' }}>
                          {article.publishedAt && new Date(article.publishedAt).toLocaleDateString('en-US', { 
                            month: 'numeric', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-white/40">|</span>
                        <span style={{ color: article.category ? getCategoryColor(article.category.name).hex : '#9CA3AF' }}>
                          {article.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
