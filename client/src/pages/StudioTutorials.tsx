import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { PlayCircle, Clock, TrendingUp, ArrowRight, Search, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: user } = trpc.auth.me.useQuery();
  const { data: tutorials = [], isLoading } = trpc.tutorials.list.useQuery();
  const { data: progressData = [] } = trpc.tutorialProgress.getProgress.useQuery(undefined, {
    enabled: !!user,
  });

  const watchedMap = new Map(progressData.map((p: any) => [p.tutorialSlug, p.watched]));

  // Slug comes from the database

  const categories = [
    { slug: "getting-started", name: "Getting Started", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    { slug: "2d-drafting", name: "2D Drafting", color: "bg-green-500/10 text-green-500 border-green-500/30" },
    { slug: "3d-modeling", name: "3D Modeling", color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
    { slug: "rendering", name: "Rendering", color: "bg-orange-500/10 text-orange-500 border-orange-500/30" },
    { slug: "advanced", name: "Advanced", color: "bg-red-500/10 text-red-500 border-red-500/30" },
  ];

  const difficulties = [
    { slug: "beginner", name: "Beginner" },
    { slug: "intermediate", name: "Intermediate" },
    { slug: "advanced", name: "Advanced" },
  ];

  const filteredTutorials = useMemo(() => tutorials.filter((tutorial: any) => {
    if (selectedCategory && tutorial.category !== selectedCategory) return false;
    if (selectedDifficulty && tutorial.difficulty !== selectedDifficulty) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      if (!tutorial.title.toLowerCase().includes(query) && !tutorial.description?.toLowerCase().includes(query)) return false;
    }
    return true;
  }), [tutorials, selectedCategory, selectedDifficulty, searchQuery]);

  const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)} min`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Vectorworks Tutorials | Brandon PT Davis"
        description="Free Vectorworks tutorials for scenic designers. Step-by-step video lessons covering 2D drafting, 3D modeling, rendering, and advanced techniques for theatrical design."
        keywords="Vectorworks tutorials, scenic design software, 3D modeling theatre, rendering tutorials, CAD for theatre, Vectorworks training, theatrical design software"
        type="website"
      />
      <Header />

      <section className="pt-32 pb-20 border-b border-border bg-gradient-to-br from-[#2196F3]/5 to-transparent">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">STUDIO / TUTORIALS</p>
          <h1 className="mb-4">Vectorworks Tutorials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Master scenic design software with step-by-step video tutorials covering everything from
            basic workspace setup to advanced 3D modeling techniques.
          </p>
          {user && progressData.length > 0 && (
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{progressData.filter((p: any) => p.watched).length} of {tutorials.length} tutorials completed</span>
              </div>
              <div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.round((progressData.filter((p: any) => p.watched).length / tutorials.length) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {Math.round((progressData.filter((p: any) => p.watched).length / tutorials.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="container py-8 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tutorials by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredTutorials.length} tutorial{filteredTutorials.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </p>
          )}
        </div>
      </section>

      <section className="container py-8 border-b border-border">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${selectedCategory === null
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${selectedCategory === category.slug
                    ? category.color + ' shadow-lg'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${selectedDifficulty === null
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                  : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
              >
                All Levels
              </button>
              {difficulties.map(difficulty => (
                <button
                  key={difficulty.slug}
                  onClick={() => setSelectedDifficulty(difficulty.slug)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${selectedDifficulty === difficulty.slug
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                    }`}
                >
                  {difficulty.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 overflow-visible">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3 bg-card rounded-b-lg border border-t-0 border-border">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
            {filteredTutorials.map((tutorial: any) => {
              const slug = tutorial.slug || tutorial.id.toString();
              return (
                <Link key={tutorial.id} href={`/studio/tutorials/${slug}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-[#2196F3]/50 rounded-lg bg-card p-0">
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      <img
                        src={tutorial.cover_image}
                        alt={tutorial.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                          <PlayCircle className="w-8 h-8 text-black fill-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDuration(tutorial.duration)}
                      </div>
                      {user && watchedMap.get(tutorial.slug || '') && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3 bg-card">
                      <h3 className="font-bold text-base leading-tight group-hover:text-[#2196F3] transition-colors line-clamp-2">
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {tutorial.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {!isLoading && filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No tutorials found matching your filters.</p>
            <button
              onClick={() => { setSelectedCategory(null); setSelectedDifficulty(null); }}
              className="mt-4 text-primary hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      <section className="container pb-24">
        <div className="bg-gradient-to-br from-[#2196F3]/10 to-transparent border border-[#2196F3]/30 rounded-2xl p-12">
          <h2 className="text-2xl font-bold mb-4">Looking for More?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            These tutorials are designed to complement your scenic design education. For official Vectorworks
            training and certification, visit Vectorworks University.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://university.vectorworks.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#2196F3] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1976D2] transition-colors"
            >
              Visit Vectorworks University
              <TrendingUp className="w-4 h-4" />
            </a>
            <a
              href="/articles?category=technology-tutorials"
              className="inline-flex items-center gap-2 bg-background border-2 border-border px-6 py-3 rounded-lg font-semibold hover:border-[#2196F3] transition-colors"
            >
              Read Related Articles
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
