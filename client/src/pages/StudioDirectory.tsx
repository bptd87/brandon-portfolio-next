import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";

// Helper function to get favicon URL from domain
function getFaviconUrl(url: string, size = 64) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return '/default-favicon.png';
  }
}

export default function StudioDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'category'>('alphabetical');
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources = [], isLoading } = trpc.scenicDirectory.list.useQuery();

  const categories = [
    { slug: "industry", name: "Industry" },
    { slug: "research", name: "Research" },
    { slug: "software", name: "Software" },
    { slug: "modeling", name: "3D Modeling" },
    { slug: "supplies", name: "Supplies" },
  ];

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((resource: any) => {
      if (selectedCategory && resource.category_slug !== selectedCategory) return false;
      if (searchQuery && !resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    if (sortBy === 'category') {
      filtered.sort((a: any, b: any) => {
        const byCategory = (a.category_slug || '').localeCompare(b.category_slug || '');
        if (byCategory !== 0) return byCategory;
        return (a.name || '').localeCompare(b.name || '');
      });
    } else {
      filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [resources, selectedCategory, searchQuery, sortBy]);

  const getCategoryTextClass = (slug: string) => {
    switch (slug) {
      case 'industry': return 'text-red-400';
      case 'research': return 'text-blue-400';
      case 'software': return 'text-purple-400';
      case 'modeling': return 'text-green-400';
      case 'supplies': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryPillClass = (slug: string) => {
    switch (slug) {
      case 'industry': return 'bg-red-500/15 text-red-300 border-red-500/40';
      case 'research': return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
      case 'software': return 'bg-purple-500/15 text-purple-300 border-purple-500/40';
      case 'modeling': return 'bg-green-500/15 text-green-300 border-green-500/40';
      case 'supplies': return 'bg-orange-500/15 text-orange-300 border-orange-500/40';
      default: return 'bg-primary text-primary-foreground border-primary';
    }
  };

  const handleResourceClick = (resource: any) => {
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_9%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(33,150,243,0.08),transparent_34%)] selection:bg-[#F44336] selection:text-white">
      <SEO
        title="Scenic Directory | Brandon PT Davis"
        description="A curated collection of essential resources for scenic designers—industry organizations, software, suppliers, and research archives."
        keywords="scenic design resources, theatre suppliers, design software, theatrical organizations, scenic design community"
        type="website"
      />

      <Header />

      {/* Hero Section */}
      <section className="pt-14 md:pt-20 pb-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio / Resources</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-[0.92] mb-5">Scenic Directory</h1>
            <p className="text-lg md:text-xl text-foreground/75 max-w-4xl leading-relaxed">
              Curated links to industry organizations, research archives, software tools, and suppliers used in professional scenic design.
            </p>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="container py-6">
        <div className="max-w-6xl mx-auto rounded-2xl border border-border/60 bg-card/20 p-5 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 border ${selectedCategory === null
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 border ${selectedCategory === category.slug
                      ? `${getCategoryPillClass(category.slug)} shadow-lg`
                      : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-border h-9 text-sm rounded-full"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('alphabetical')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border transition-all ${
                    sortBy === 'alphabetical'
                      ? 'bg-[#00BCD4]/15 text-[#80deea] border-[#00BCD4]/40'
                      : 'bg-background border-border text-muted-foreground hover:border-[#00BCD4]/40 hover:text-[#80deea]'
                  }`}
                >
                  A-Z
                </button>
                <button
                  onClick={() => setSortBy('category')}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] border transition-all ${
                    sortBy === 'category'
                      ? 'bg-[#FF5722]/15 text-[#ff9c7a] border-[#FF5722]/40'
                      : 'bg-background border-border text-muted-foreground hover:border-[#FF5722]/40 hover:text-[#ff9c7a]'
                  }`}
                >
                  Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="container py-12 min-h-[50vh]">
        <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredResources.map((resource: any) => {
              const category = categories.find(c => c.slug === resource.category_slug);
              const categoryTextClass = getCategoryTextClass(resource.category_slug);

              return (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className="group relative flex flex-col h-full rounded-2xl border border-border/60 bg-card/25 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl cursor-pointer overflow-hidden"
                >
                  <div className="p-6 flex flex-col h-full relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <img
                          src={resource.cover_image || getFaviconUrl(resource.url, 64)}
                          onError={(e) => { e.currentTarget.src = '/default-favicon.png'; }}
                          className="w-8 h-8 object-contain"
                          alt=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-[0.12em] mb-1 block ${categoryTextClass}`}>
                            {category?.name}
                          </span>
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2 pr-2">
                          {resource.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex-1 mb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {resource.description}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">Open Resource</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2">No resources found</h3>
            <p className="text-muted-foreground max-w-md">
              Try adjusting your search or category filter. We couldn't find anything matching your criteria.
            </p>
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
              className="mt-6 text-primary hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        </div>
      </section>

      {/* Submission CTA - Premium */}
      <section className="container py-24">
        <div className="max-w-6xl mx-auto relative rounded-3xl overflow-hidden border border-border/60 bg-card/20 p-12 lg:p-20 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10" />

          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-6">Missing a Resource?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Help cultivate this collection. If you know of an invaluable tool for scenic design that isn't listed, please submit it for review.
          </p>
          <a
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white text-black px-8 text-sm font-medium transition-transform hover:scale-105 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
          >
            Submit Suggestion
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
