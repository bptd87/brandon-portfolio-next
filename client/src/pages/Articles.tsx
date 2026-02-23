
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { trpc } from "@/lib/trpc";
import { getCategoryColor } from "@/lib/categoryColors";
import { Search } from "lucide-react";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

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
  const { data: articles, isLoading } = trpc.articles.list.useQuery({ status: "published" });
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
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_9%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(33,150,243,0.08),transparent_34%)]">
      <SEO
        title="Scenic Insights | Articles by Brandon PT Davis"
        description="Articles on scenic design philosophy, process, and production craft by Brandon PT Davis."
        image={articles?.[0]?.coverImageUrl || undefined}
        url="https://www.brandonptdavis.com/articles"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Articles", url: "https://www.brandonptdavis.com/articles" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Insights",
          url: "https://www.brandonptdavis.com/articles",
          description: "Article archive covering scenic design practice, production strategy, and theatre process.",
          about: "Scenic design writing and production insights by Brandon PT Davis.",
          primaryImageOfPage: articles?.[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: "Articles",
            itemListElement: (articles || []).slice(0, 24).map((article, index) => ({
              position: index + 1,
              name: decodeHTMLEntities(article.title),
              url: `https://www.brandonptdavis.com/articles/${article.slug}`,
              datePublished: article.publishedAt || article.createdAt || undefined,
              image: article.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <Header />

      {/* Page Header */}
      <section className="pt-14 md:pt-20 pb-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio / Articles</p>
            <h1 className="mb-5 text-5xl md:text-7xl font-serif tracking-tight leading-[0.92]">Scenic Insights</h1>
            <p className="text-lg md:text-xl text-foreground/75 max-w-4xl leading-relaxed">
              Articles on design philosophy, process, and the craft of scenic design.
            </p>

            {/* Search and Category Filter */}
            <div className="mt-6 rounded-2xl border border-border/60 bg-card/20 p-5 md:p-6 space-y-6">
              {/* Search Input */}
              <div className="relative w-full max-w-md">
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 border ${selectedCategory === null
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-background border border-border text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                >
                  All Articles
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${selectedCategory === category
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
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading articles...</p>
            </div>
          ) : filteredArticles && filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredArticles.map((article) => {
                const categoryColor = article.category?.name
                  ? getCategoryColor(article.category.name).hex
                  : '#FF6B35';

                return (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div className="group bg-card/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-border/60">
                      {/* Cover Image */}
                      {article.coverImageUrl && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={article.coverImageUrl}
                            alt={`Cover image for article: ${decodeHTMLEntities(article.title)}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-5 md:p-6 flex flex-col min-h-[14rem]">
                        {/* Category Label */}
                        {article.category && (
                          <p
                            className="text-[10px] uppercase tracking-[0.26em] mb-3 font-medium"
                            style={{ color: categoryColor }}
                          >
                            {article.category.name}
                          </p>
                        )}

                        <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-3 transition-colors line-clamp-2 min-h-[3.8rem]"
                          style={{ color: 'inherit' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                          {decodeHTMLEntities(article.title)}
                        </h3>

                        {article.excerpt && (
                          <p className="text-base text-muted-foreground line-clamp-2 mb-3 leading-relaxed min-h-[3.1rem]">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
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
        </div>
      </section>

      {/* Musical Theatre & Cinema Section */}
      {!selectedCategory && !searchQuery && musicalTheatreArticles.length > 0 && (
        <section className="py-16 border-t border-border/50">
          <div className="container">
            <div className="mb-12 max-w-6xl mx-auto">
              <p className="text-xs tracking-[0.2em] text-muted-foreground mb-4 font-semibold uppercase">Course Materials</p>
              <h2 className="text-4xl font-['Playfair_Display'] italic mb-4">Musical Theatre & Cinema</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Articles from a course I taught exploring the history and evolution of musical theatre and cinema.
              </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicalTheatreArticles.map((article) => {
                const categoryColor = article.category ? getCategoryColor(article.category.name).hex : '#9CA3AF';
                return (
                  <Link key={article.id} href={`/articles/${article.slug}`}>
                    <div className="group bg-card/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
                      {/* Cover Image */}
                      {article.coverImageUrl && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={article.coverImageUrl}
                            alt={`Cover image for article: ${decodeHTMLEntities(article.title)}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext fill="%239CA3AF" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not available%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      )}

                      <div className="p-5 md:p-6 flex flex-col min-h-[14rem]">
                        {/* Category Label */}
                        {article.category && (
                          <p
                            className="text-[10px] uppercase tracking-[0.26em] mb-3 font-medium"
                            style={{ color: categoryColor }}
                          >
                            {article.category.name}
                          </p>
                        )}

                        <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-3 transition-colors line-clamp-2 min-h-[3.8rem]"
                          style={{ color: 'inherit' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                          {decodeHTMLEntities(article.title)}
                        </h3>

                        {article.excerpt && (
                          <p className="text-base text-muted-foreground line-clamp-2 mb-3 leading-relaxed min-h-[3.1rem]">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
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
                );
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
