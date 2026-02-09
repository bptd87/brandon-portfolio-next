import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { PlayCircle, Clock, TrendingUp, ArrowRight, Search, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function StudioTutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Get current user
  const { data: user } = trpc.auth.me.useQuery();
  
  // Fetch tutorial progress for logged-in users
  const { data: progressData = [] } = trpc.tutorialProgress.getProgress.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Create a map of tutorial slug to watched status
  const watchedMap = new Map(progressData.map(p => [p.tutorialSlug, p.watched]));

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
      publishDate: "Jan 24, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/jRI33g1oSt0/maxresdefault.jpg`,
    },
    {
      id: 2,
      title: "Vectorworks Tutorial: Understanding Classes",
      slug: "understanding-classes",
      youtubeId: "tXQcTdGiwT4",
      youtubeUrl: "https://www.youtube.com/watch?v=tXQcTdGiwT4",
      description: "Master the organization system that controls graphic attributes, textures, and visibility in Vectorworks using classes and hierarchies.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 587, // 9:47 in seconds
      publishDate: "Jan 24, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/tXQcTdGiwT4/maxresdefault.jpg`,
    },
    {
      id: 3,
      title: "Vectorworks Tutorial: Understanding Design Layers",
      slug: "understanding-design-layers",
      youtubeId: "CwCxmhQAFwI",
      youtubeUrl: "https://www.youtube.com/watch?v=CwCxmhQAFwI",
      description: "Master the layer organization system that allows you to separate and manage different elements of your scenic design across multiple drawing planes.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 474, // 7:54 in seconds
      publishDate: "Jan 25, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/CwCxmhQAFwI/maxresdefault.jpg`,
    },
    {
      id: 4,
      title: "Vectorworks Tutorial: Installing a Workspace and Template",
      slug: "installing-workspace-template",
      youtubeId: "CXBfG2L3ZmI",
      youtubeUrl: "https://www.youtube.com/watch?v=CXBfG2L3ZmI",
      description: "Learn how to properly install and configure a Vectorworks workspace and template provided by your organization to ensure standardized communication and workflow.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 340, // 5:40 in seconds
      publishDate: "Jan 25, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/CXBfG2L3ZmI/maxresdefault.jpg`,
    },
    {
      id: 5,
      title: "Vectorworks Tutorial: Basics Tool Palette",
      slug: "basics-tool-palette",
      youtubeId: "orjqcNYveOg",
      youtubeUrl: "https://www.youtube.com/watch?v=orjqcNYveOg",
      description: "Master the essential 2D drawing tools including selection, drawing, and modification tools that form the foundation of scenic design drafting in Vectorworks.",
      category: "2d-drafting",
      difficultyLevel: "beginner",
      duration: 897, // 14:57 in seconds
      publishDate: "Jan 27, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/orjqcNYveOg/maxresdefault.jpg`,
    },
    {
      id: 6,
      title: "Vectorworks Tutorial: Sheet Layers",
      slug: "sheet-layers",
      youtubeId: "D4AXwNQgdBI",
      youtubeUrl: "https://www.youtube.com/watch?v=D4AXwNQgdBI",
      description: "Learn how to use sheet layers for laying out pages for printing, including creating viewports, adding title blocks, and managing drawing scales.",
      category: "2d-drafting",
      difficultyLevel: "beginner",
      duration: 476, // 7:56 in seconds
      publishDate: "Jan 27, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/D4AXwNQgdBI/maxresdefault.jpg`,
    },
    {
      id: 7,
      title: "Vectorworks Quick Tip: Creating Trim Profiles with the Polyline Tool",
      slug: "creating-trim-profiles-polyline",
      youtubeId: "EZB5O-Wmsk4",
      youtubeUrl: "https://www.youtube.com/watch?v=EZB5O-Wmsk4",
      description: "Learn how to quickly create accurate trim and molding profiles by tracing reference images using the polyline tool and converting them to reusable 2D symbols.",
      category: "2d-drafting",
      difficultyLevel: "intermediate",
      duration: 374, // 6:14 in seconds
      publishDate: "Jan 28, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/EZB5O-Wmsk4/maxresdefault.jpg`,
    },
    {
      id: 8,
      title: "Vectorworks Tutorial: 2D Edit and Modify Tricks",
      slug: "2d-edit-modify-tricks",
      youtubeId: "8lTla9cvIPk",
      youtubeUrl: "https://www.youtube.com/watch?v=8lTla9cvIPk",
      description: "Master essential 2D editing and modification tools including Mirror, Reshape, Offset, Split, Connect/Combine, and advanced Modify menu commands for efficient drafting workflows.",
      category: "2d-drafting",
      difficultyLevel: "intermediate",
      duration: 767, // 12:47 in seconds
      publishDate: "Jan 29, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/8lTla9cvIPk/maxresdefault.jpg`,
    },
    {
      id: 9,
      title: "Vectorworks Tutorial: Resource Manager Basics",
      slug: "resource-manager-basics",
      youtubeId: "Y7trPdHxRxM",
      youtubeUrl: "https://www.youtube.com/watch?v=Y7trPdHxRxM",
      description: "Learn how to create, apply, and manage resources in Vectorworks using the Resource Manager, including textures, symbols, and custom libraries.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 348, // 5:48 in seconds
      publishDate: "Jan 30, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/Y7trPdHxRxM/maxresdefault.jpg`,
    },
    {
      id: 10,
      title: "Vectorworks Tutorial: Understanding Symbols",
      slug: "understanding-symbols",
      youtubeId: "ib2-H14Cx5I",
      youtubeUrl: "https://www.youtube.com/watch?v=ib2-H14Cx5I",
      description: "Master the creation and management of 2D, 3D, and hybrid symbols in Vectorworks, including symbol types, scaling methods, and editing workflows.",
      category: "getting-started",
      difficultyLevel: "beginner",
      duration: 501, // 8:21 in seconds
      publishDate: "Jan 31, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/ib2-H14Cx5I/maxresdefault.jpg`,
    },
    {
      id: 11,
      title: "Vectorworks Tutorial: 2D Annotations and Dimensioning",
      slug: "2d-annotations-dimensioning",
      youtubeId: "JOlFjmY_R7o",
      youtubeUrl: "https://www.youtube.com/watch?v=JOlFjmY_R7o",
      description: "Master the complete workflow for creating viewports, dimensioning drawings, adding drawing labels, section markers, callouts, detail viewports, and publishing to PDF.",
      category: "2d-drafting",
      difficultyLevel: "intermediate",
      duration: 1631, // 27:11 in seconds
      publishDate: "Feb 01, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/JOlFjmY_R7o/maxresdefault.jpg`,
    },
    {
      id: 12,
      title: "Vectorworks Tutorial: 3D Modeling Basics",
      slug: "3d-modeling-basics",
      youtubeId: "Jjz1zXDXafs",
      youtubeUrl: "https://www.youtube.com/watch?v=Jjz1zXDXafs",
      description: "Master essential 3D modeling operations including Extrude, Add/Subtract/Intersect Solids, Section Solids, Multiple Extrude, Tapered Extrude, Sweep, and Extrude Along Path.",
      category: "3d-modeling",
      difficultyLevel: "intermediate",
      duration: 1274, // 21:14 in seconds
      publishDate: "Feb 03, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/Jjz1zXDXafs/maxresdefault.jpg`,
    },
    {
      id: 13,
      title: "Vectorworks Tutorial: Hybrid Symbols",
      slug: "hybrid-symbols",
      youtubeId: "XeBfq6Kv1LY",
      youtubeUrl: "https://www.youtube.com/watch?v=XeBfq6Kv1LY",
      description: "Learn how to create hybrid symbols that combine 2D and 3D representations, including manual tracing and auto-generation methods for Top/Plan views.",
      category: "3d-modeling",
      difficultyLevel: "intermediate",
      duration: 306, // 5:06 in seconds
      publishDate: "Feb 05, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/XeBfq6Kv1LY/maxresdefault.jpg`,
    },
    {
      id: 14,
      title: "Vectorworks Tutorial: Basics of Textures",
      slug: "basics-of-textures",
      youtubeId: "9iApEa1XTug",
      youtubeUrl: "https://www.youtube.com/watch?v=9iApEa1XTug",
      description: "Learn how to apply, edit, and create custom Renderworks textures to bring life to your 3D models in Vectorworks.",
      category: "3d-modeling",
      difficultyLevel: "intermediate",
      duration: 801, // 13:21 in seconds
      publishDate: "Feb 08, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/9iApEa1XTug/maxresdefault.jpg`,
    },
    {
      id: 15,
      title: "Vectorworks Tutorial: 3D Modeling Tools",
      slug: "3d-modeling-tools",
      youtubeId: "8dm9ZMTXypE",
      youtubeUrl: "https://www.youtube.com/watch?v=8dm9ZMTXypE",
      description: "Master the essential 3D modeling tools in Vectorworks including primitive objects, push/pull, extract, fillet, chamfer, taper, deform, and shell solid.",
      category: "3d-modeling",
      difficultyLevel: "intermediate",
      duration: 1099, // 18:19 in seconds
      publishDate: "Feb 08, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/8dm9ZMTXypE/maxresdefault.jpg`,
    },
    {
      id: 16,
      title: "Vectorworks Tutorial: Creating 24x36 PDFs Without a Plotter",
      slug: "creating-24x36-pdfs",
      youtubeId: "Gd9_hB5USkQ",
      youtubeUrl: "https://www.youtube.com/watch?v=Gd9_hB5USkQ",
      description: "Learn how to export large format sheets (24x36) to PDF when you don't have Adobe PDF or a plotter connected to your computer.",
      category: "2d-drafting",
      difficultyLevel: "beginner",
      duration: 208, // 3:28 in seconds
      publishDate: "Feb 10, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/Gd9_hB5USkQ/maxresdefault.jpg`,
    },
    {
      id: 17,
      title: "Vectorworks Tutorial: Modeling a Table",
      slug: "modeling-a-table",
      youtubeId: "TdZeKdL-DVc",
      youtubeUrl: "https://www.youtube.com/watch?v=TdZeKdL-DVc",
      description: "Master the complete workflow for 3D modeling furniture from a reference image, including scaling, drafting profiles, creating sweeps, solid modeling operations, texturing, and creating hybrid symbols.",
      category: "3d-modeling",
      difficultyLevel: "advanced",
      duration: 2268, // 37:48 in seconds
      publishDate: "Feb 12, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/TdZeKdL-DVc/maxresdefault.jpg`,
    },
    {
      id: 18,
      title: "Vectorworks Tutorial: Creating a Camera and Rendering",
      slug: "creating-camera-rendering",
      youtubeId: "Jp4eG5n3esc",
      youtubeUrl: "https://www.youtube.com/watch?v=Jp4eG5n3esc",
      description: "Learn the complete workflow for creating cameras, setting up dramatic lighting, configuring viewports, and exporting high-quality renderings in Vectorworks.",
      category: "rendering",
      difficultyLevel: "intermediate",
      duration: 636, // 10:36 in seconds
      publishDate: "Feb 15, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/Jp4eG5n3esc/maxresdefault.jpg`,
    },
    {
      id: 19,
      title: "Vectorworks Tutorial: Creating 2D Drafting from 3D Models",
      slug: "creating-2d-drafting-from-3d",
      youtubeId: "Q-oM0jkKuS0",
      youtubeUrl: "https://www.youtube.com/watch?v=Q-oM0jkKuS0",
      description: "Master the complete workflow for generating professional construction drawings from 3D models, including viewports, sections, details, and dimensioning.",
      category: "2d-drafting",
      difficultyLevel: "advanced",
      duration: 1440, // 24:00 in seconds
      publishDate: "Feb 18, 2021",
      thumbnailUrl: `https://img.youtube.com/vi/Q-oM0jkKuS0/maxresdefault.jpg`,
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
    // Category filter
    if (selectedCategory && tutorial.category !== selectedCategory) return false;
    // Difficulty filter
    if (selectedDifficulty && tutorial.difficultyLevel !== selectedDifficulty) return false;
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = tutorial.title.toLowerCase().includes(query);
      const matchesDescription = tutorial.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }
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
                <span>{progressData.filter(p => p.watched).length} of {tutorials.length} tutorials completed</span>
              </div>
              <div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${Math.round((progressData.filter(p => p.watched).length / tutorials.length) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-muted-foreground">
                {Math.round((progressData.filter(p => p.watched).length / tutorials.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Search Bar */}
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
      <section className="container py-16 overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-visible">
          {filteredTutorials.map(tutorial => (
            <Link key={tutorial.id} href={tutorial.slug ? `/studio/tutorials/${tutorial.slug}` : tutorial.youtubeUrl}>
            <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-[#2196F3]/50 rounded-lg bg-card p-0">
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
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-black fill-white" />
                  </div>
                </div>
                
                {/* Duration badge */}
                <div className="absolute bottom-3 right-3 bg-black/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {formatDuration(tutorial.duration)}
                </div>
                
                {/* Watched checkmark badge */}
                {user && watchedMap.get(tutorial.slug) && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>

              <CardContent className="p-4 space-y-3 bg-card">
                {/* Title */}
                <h3 className="font-bold text-base leading-tight group-hover:text-[#2196F3] transition-colors line-clamp-2">
                  {tutorial.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {tutorial.description}
                </p>

                {/* Date */}
                <div className="text-xs text-muted-foreground">
                  {tutorial.publishDate}
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
