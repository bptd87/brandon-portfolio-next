import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { PlayCircle, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Tutorial data - will be replaced with database content later
  const tutorials = [
    {
      id: 1,
      title: "Vectorworks Tutorial: Navigating the User Interface",
      slug: "navigating-user-interface",
      youtubeId: "jRI33g1oSt0",
      youtubeUrl: "https://www.youtube.com/watch?v=jRI33g1oSt0",
      description: "Learn the fundamentals of Vectorworks interface, workspace setup, and essential navigation tools for scenic design.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 634, // 10:34 in seconds
      thumbnailUrl: `https://img.youtube.com/vi/jRI33g1oSt0/maxresdefault.jpg`,
    },
  ];

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

  // Filter tutorials
  const filteredTutorials = tutorials.filter(tutorial => {
    if (selectedCategory && tutorial.category !== selectedCategory) return false;
    if (selectedDifficulty && tutorial.difficultyLevel !== selectedDifficulty) return false;
    return true;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const getCategoryColor = (categorySlug: string) => {
    return categories.find(c => c.slug === categorySlug)?.color || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-20 border-b border-border bg-gradient-to-br from-[#2196F3]/5 to-transparent">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">STUDIO / TUTORIALS</p>
          <h1 className="mb-4">Vectorworks Tutorials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Master scenic design software with step-by-step video tutorials covering everything from 
            basic workspace setup to advanced 3D modeling techniques.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container py-8 border-b border-border">
        <div className="space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                  selectedCategory === null
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                    selectedCategory === category.slug
                      ? category.color + ' shadow-lg'
                      : 'bg-background border-border text-muted-foreground hover:border-primary hover:text-foreground'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Difficulty</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDifficulty(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                  selectedDifficulty === null
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
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                    selectedDifficulty === difficulty.slug
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

      {/* Tutorials Grid */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTutorials.map(tutorial => (
            <Link key={tutorial.id} href={tutorial.slug ? `/studio/tutorials/${tutorial.slug}` : tutorial.youtubeUrl}>
            <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 h-full">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <img 
                  src={tutorial.thumbnailUrl} 
                  alt={tutorial.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to gradient if thumbnail fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                
                {/* Duration badge */}
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(tutorial.duration)}
                </div>
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getCategoryColor(tutorial.category)} border`}>
                    {categories.find(c => c.slug === tutorial.category)?.name}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {tutorial.difficultyLevel}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg leading-tight group-hover:text-[#2196F3] transition-colors">
                  {tutorial.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Watch button */}
                <div className="inline-flex items-center gap-2 text-[#2196F3] font-semibold text-sm group-hover:gap-3 transition-all duration-300">
                  {tutorial.slug ? 'View Tutorial' : 'Watch on YouTube'} <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No tutorials found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSelectedDifficulty(null);
              }}
              className="mt-4 text-primary hover:underline font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Additional Resources */}
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
