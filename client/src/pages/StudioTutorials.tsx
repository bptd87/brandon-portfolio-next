import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { PlayCircle, Clock, TrendingUp, ArrowRight, Search } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: tutorials = [], isLoading } = trpc.tutorials.list.useQuery();

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
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_9%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(33,150,243,0.08),transparent_34%)]">
      <SEO
        title="Vectorworks Tutorials | Brandon PT Davis"
        description="Free Vectorworks tutorials for scenic designers. Step-by-step video lessons covering 2D drafting, 3D modeling, rendering, and advanced techniques for theatrical design."
        keywords="Vectorworks tutorials, scenic design software, 3D modeling theatre, rendering tutorials, CAD for theatre, Vectorworks training, theatrical design software"
        type="website"
        url="https://www.brandonptdavis.com/studio/tutorials"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Tutorials", url: "https://www.brandonptdavis.com/studio/tutorials" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Vectorworks Tutorials",
          url: "https://www.brandonptdavis.com/studio/tutorials",
          description: "Structured tutorial paths for scenic designers using Vectorworks and rendering workflows.",
          about: "Tutorial videos and walkthroughs by Brandon PT Davis.",
          primaryImageOfPage: tutorials?.[0]?.cover_image || undefined,
          mainEntity: {
            name: "Tutorials",
            itemListElement: tutorials.slice(0, 60).map((tutorial: any, index: number) => ({
              position: index + 1,
              name: tutorial.title,
              url: `https://www.brandonptdavis.com/studio/tutorials/${tutorial.slug || tutorial.id}`,
              image: tutorial.cover_image || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="Course"
        course={{
          name: "Vectorworks Tutorials for Scenic Designers",
          description: "A structured tutorial library covering drafting, modeling, rendering, and production-ready documentation workflows.",
          url: "https://www.brandonptdavis.com/studio/tutorials",
          provider: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
            type: "EducationalOrganization",
          },
          teaches: [
            "2D drafting workflows",
            "3D scenic modeling",
            "Rendering and visualization",
            "Production documentation",
          ],
          inLanguage: "en-US",
          keywords: [
            "vectorworks tutorials",
            "scenic design education",
            "theatre drafting training",
          ],
        }}
      />
      <Header />

      <section className="pt-14 md:pt-20 pb-8">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio / Tutorials</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-[0.92] mb-5">Vectorworks Tutorials</h1>
            <p className="text-lg md:text-xl text-foreground/75 max-w-4xl leading-relaxed">
              Structured tutorial paths for scenic designers, from drafting fundamentals to advanced modeling and rendering workflows.
            </p>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border/60 bg-card/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Total</p>
                <p className="text-2xl font-semibold">{tutorials.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Filtered</p>
                <p className="text-2xl font-semibold">{filteredTutorials.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Path</p>
                <p className="text-sm text-foreground/75 mt-1">Beginner to Advanced</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Format</p>
                <p className="text-sm text-foreground/75 mt-1">Video + Steps</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-6">
        <div className="max-w-6xl mx-auto rounded-2xl border border-border/60 bg-card/20 p-5 md:p-6">
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
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="min-w-0">
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

            <div className="min-w-0">
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
        </div>
      </section>

      <section className="container py-16 overflow-visible">
        <div className="max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible items-stretch">
            {filteredTutorials.map((tutorial: any) => {
              const slug = tutorial.slug || tutorial.id.toString();
              return (
                <Link key={tutorial.id} href={`/studio/tutorials/${slug}`}>
                  <Card className="group h-full hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-[#2196F3]/50 rounded-lg bg-card py-0 gap-0 flex flex-col">
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
                    </div>

                    <CardContent className="p-5 flex flex-col flex-1 bg-card">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-[0.12em]">
                          {tutorial.category?.replace("-", " ") || "Tutorial"}
                        </Badge>
                        {tutorial.difficulty && (
                          <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/60">{tutorial.difficulty}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg leading-snug group-hover:text-[#2196F3] transition-colors line-clamp-2 min-h-[3.4rem]">
                        {tutorial.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 min-h-[4.2rem] mt-2">
                        {tutorial.description}
                      </p>
                      <div className="mt-auto pt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#2196F3] uppercase tracking-[0.12em]">
                        Watch Tutorial <ArrowRight className="w-3.5 h-3.5" />
                      </div>
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
        </div>
      </section>

      <section className="container pb-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#2196F3]/10 to-transparent border border-[#2196F3]/30 rounded-2xl p-10 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif tracking-tight mb-4">Looking for More?</h2>
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
