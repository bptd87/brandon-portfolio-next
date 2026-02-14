import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, TrendingUp, ArrowUpDown, Search } from "lucide-react";
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
  const [sortBy, setSortBy] = useState<'popular' | 'alphabetical'>('popular');
  const [searchQuery, setSearchQuery] = useState("");

  const { data: resources = [], isLoading } = trpc.scenicDirectory.list.useQuery();
  const trackClick = trpc.analytics.trackScenicDirectoryClick?.useMutation();
  const toggleLike = trpc.scenicDirectory.toggleLike?.useMutation({
    onSuccess: () => {
      // Refetch to update counts
      trpc.useContext().scenicDirectory.list.invalidate();
    }
  });

  const categories = [
    { slug: "industry", name: "Industry", color: "text-red-400 border-red-500/30 bg-red-500/5 group-hover:bg-red-500/10" },
    { slug: "research", name: "Research", color: "text-blue-400 border-blue-500/30 bg-blue-500/5 group-hover:bg-blue-500/10" },
    { slug: "software", name: "Software", color: "text-purple-400 border-purple-500/30 bg-purple-500/5 group-hover:bg-purple-500/10" },
    { slug: "modeling", name: "3D Modeling", color: "text-green-400 border-green-500/30 bg-green-500/5 group-hover:bg-green-500/10" },
    { slug: "supplies", name: "Supplies", color: "text-orange-400 border-orange-500/30 bg-orange-500/5 group-hover:bg-orange-500/10" },
  ];

  const filteredResources = useMemo(() => {
    let filtered = resources.filter((resource: any) => {
      if (selectedCategory && resource.category_slug !== selectedCategory) return false;
      if (searchQuery && !resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !resource.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    // Sort by popularity (likes + clicks) or alphabetically
    if (sortBy === 'popular') {
      filtered.sort((a: any, b: any) => {
        const aScore = (a.like_count || 0) * 2 + (a.click_count || 0);
        const bScore = (b.like_count || 0) * 2 + (b.click_count || 0);
        if (bScore !== aScore) return bScore - aScore;
        return a.name.localeCompare(b.name);
      });
    } else {
      filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [resources, selectedCategory, sortBy, searchQuery]);

  // Helper to extract background color for the accent line
  const getAccentBgClass = (slug: string) => {
    const category = categories.find(c => c.slug === slug);
    if (!category) return 'bg-muted';
    // Mapping slug to specific Tailwind bg classes to be safe with dynamic classes
    switch (slug) {
      case 'industry': return 'bg-red-500';
      case 'research': return 'bg-blue-500';
      case 'software': return 'bg-purple-500';
      case 'modeling': return 'bg-green-500';
      case 'supplies': return 'bg-orange-500';
      default: return 'bg-white';
    }
  };

  const handleResourceClick = (resource: any) => {
    if (trackClick) {
      trackClick.mutate({ id: resource.id });
    }
    window.open(resource.url, '_blank', 'noopener,noreferrer');
  };

  const handleLike = (e: React.MouseEvent, resourceId: number) => {
    e.stopPropagation();
    if (toggleLike) {
      toggleLike.mutate({ id: resourceId });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-[#F44336] selection:text-white">
      <SEO
        title="Scenic Directory | Brandon PT Davis"
        description="A curated collection of essential resources for scenic designers—industry organizations, software, suppliers, and research archives."
        keywords="scenic design resources, theatre suppliers, design software, theatrical organizations, scenic design community"
        type="website"
      />

      <Header />

      {/* Hero Section with Ambient Background */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />

        <div className="container">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.2em] text-[#F44336] mb-6 uppercase">Studio / Resources</p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[0.9]">
              Scenic <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Directory</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              A curated collection of essential tools for the modern scenic designer.
              From industry standards to hidden gems.
            </p>
          </div>
        </div>
      </section>

      {/* Controls Section (Sticky-ish) */}
      <section className="sticky top-20 z-40 backdrop-blur-xl border-y border-white/5 bg-background/80 supports-[backdrop-filter]:bg-background/20">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">

            {/* Categories */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide mask-fade-right">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === null
                    ? 'bg-white text-black border-white shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]'
                    : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5'
                  }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === category.slug
                      ? 'bg-white/10 text-white border-white/20 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]'
                      : 'bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Search & Sort */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10 focus:border-white/20 h-9 text-sm rounded-full"
                />
              </div>
              <div className="flex gap-1 bg-white/5 p-1 rounded-full border border-white/10">
                <button
                  onClick={() => setSortBy('popular')}
                  className={`p-1.5 rounded-full transition-all ${sortBy === 'popular' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
                  title="Popular"
                >
                  <TrendingUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSortBy('alphabetical')}
                  className={`p-1.5 rounded-full transition-all ${sortBy === 'alphabetical' ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-white'}`}
                  title="Alphabetical"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Layout */}
      <section className="container py-12 min-h-[50vh]">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource: any) => {
              const category = categories.find(c => c.slug === resource.category_slug);
              // Extract the base color from the tailwind class for the border/accent
              const accentBgClass = getAccentBgClass(resource.category_slug);

              return (
                <div
                  key={resource.id}
                  onClick={() => handleResourceClick(resource)}
                  className="group relative flex flex-col rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden"
                >
                  {/* Category Accent Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${accentBgClass} opacity-50 group-hover:opacity-100 transition-opacity`} />

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 to-transparent" />

                  <div className="p-6 flex flex-col h-full relative z-10">
                    {/* Header: Favicon + Title */}
                    <div className="flex items-start gap-4 mb-4">
                      {/* Favicon Container - White bg for dark mode logos */}
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                        <img
                          src={resource.cover_image || getFaviconUrl(resource.url, 64)}
                          onError={(e) => { e.currentTarget.src = '/default-favicon.png'; }}
                          className="w-8 h-8 object-contain"
                          alt=""
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 block ${category?.color.split(' ')[0]}`}>
                            {category?.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-white/40">
                            <ExternalLink className="w-3 h-3 group-hover:text-white transition-colors" />
                          </div>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-white group-hover:text-primary transition-colors leading-tight truncate pr-2">
                          {resource.name}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1 mb-6">
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 group-hover:text-white/70 transition-colors">
                        {resource.description}
                      </p>
                    </div>

                    {/* Footer: Stats Grid */}
                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-lg overflow-hidden border border-white/5">
                      <button
                        onClick={(e) => handleLike(e, resource.id)}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-black/20 hover:bg-white/10 transition-colors group/like text-sm"
                      >
                        <Heart className={`w-4 h-4 transition-all ${resource.user_liked ? 'fill-[#F44336] text-[#F44336]' : 'text-white/40 group-hover/like:text-[#F44336]'}`} />
                        <span className={`font-mono ${resource.user_liked ? 'text-[#F44336]' : 'text-white/60'}`}>
                          {resource.like_count || 0}
                        </span>
                      </button>

                      <div className="flex items-center justify-center gap-2 py-2 px-3 bg-black/20 text-sm border-l border-white/5">
                        <TrendingUp className="w-4 h-4 text-white/40" />
                        <span className="font-mono text-white/60">
                          {resource.click_count || 0}
                        </span>
                      </div>
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
      </section>

      {/* Submission CTA - Premium */}
      <section className="container py-24">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl p-12 lg:p-20 text-center">
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
