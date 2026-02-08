import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import { useState } from "react";

export default function StudioDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Directory data - will be replaced with database content later
  const resources = [
    {
      id: 1,
      title: "Control Booth Forum",
      url: "https://www.controlbooth.com/",
      description: "Online forums for technical theatre and scenic design discussions.",
      categorySlug: "industry",
      likes: 0,
    },
    {
      id: 2,
      title: "Skene",
      url: "https://www.skene.pub/",
      description: "A digital magazine connecting performers and creators across theatre, opera, and dance—on stage, backstage, and around the world!",
      categorySlug: "industry",
      likes: 4,
    },
    {
      id: 3,
      title: "United States Institute of Theatre Technology",
      url: "https://www.usitt.org/",
      description: "Professional organization for theatre technology and design.",
      categorySlug: "industry",
      likes: 1,
    },
    {
      id: 4,
      title: "United Scenic Artists, Local 829",
      url: "https://www.usa829.org/",
      description: "A labor union for scenic designers and artists in entertainment.",
      categorySlug: "industry",
      likes: 4,
    },
    {
      id: 5,
      title: "Rise Theatre",
      url: "https://www.risetheatre.org/",
      description: "A directory connecting underrepresented theatre professionals with job opportunities.",
      categorySlug: "industry",
      likes: 2,
    },
    {
      id: 6,
      title: "Fonts in Use",
      url: "https://fontsinuse.com",
      description: "This site offers visual examples of real-world design application across print, film, branding, and stage.",
      categorySlug: "research",
      likes: 2,
    },
    {
      id: 7,
      title: "Archive.org",
      url: "https://archive.org/",
      description: "Historic scenic design documents and period research.",
      categorySlug: "research",
      likes: 0,
    },
    {
      id: 8,
      title: "Love the Work More",
      url: "https://lovetheworkmore.com",
      description: "A free archive of Cannes Lions-winning ad campaigns from 1954 to today.",
      categorySlug: "research",
      likes: 1,
    },
    {
      id: 9,
      title: "PureRef",
      url: "https://www.pureref.com/",
      description: "Free tool for organizing reference images.",
      categorySlug: "software",
      likes: 2,
    },
    {
      id: 10,
      title: "Twinmotion",
      url: "https://www.twinmotion.com/",
      description: "Visualization tool for architecture and scenic design.",
      categorySlug: "software",
      likes: 2,
    },
    {
      id: 11,
      title: "Convert3D",
      url: "https://convert3d.org/",
      description: "Found the perfect model, but it's not compatible with your software. Use this site.",
      categorySlug: "modeling",
      likes: 1,
    },
    {
      id: 12,
      title: "AFR Furniture Rental",
      url: "https://www.afrevents.com/AFR_Events_3D/",
      description: "An event company offering a large free collection of 3D models.",
      categorySlug: "modeling",
      likes: 1,
    },
    {
      id: 13,
      title: "fab.com",
      url: "https://www.fab.com/",
      description: "Epic Games' new 3D asset marketplace.",
      categorySlug: "modeling",
      likes: 2,
    },
    {
      id: 14,
      title: "SketchUp 3D Warehouse",
      url: "https://3dwarehouse.sketchup.com",
      description: "Free 3D models compatible with Vectorworks.",
      categorySlug: "modeling",
      likes: 0,
    },
    {
      id: 15,
      title: "Gladsbuy",
      url: "https://www.gladsbuy.com/",
      description: "Affordable Backdrop Printer",
      categorySlug: "supplies",
      likes: 2,
    },
    {
      id: 16,
      title: "Paramount Studios",
      url: "https://www.paramountstudios.com/wood-moulding.html",
      description: "Downloadable DWGs for scenic moulding profiles.",
      categorySlug: "supplies",
      likes: 1,
    },
    {
      id: 17,
      title: "Rose Brand",
      url: "https://www.rosebrand.com/",
      description: "Theatrical fabrics, materials, and scenic supplies.",
      categorySlug: "supplies",
      likes: 0,
    },
  ];

  const categories = [
    { slug: "industry", name: "Industry", color: "bg-red-500/10 text-red-500 border-red-500/30" },
    { slug: "research", name: "Research", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    { slug: "software", name: "Software", color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
    { slug: "modeling", name: "3D Modeling", color: "bg-green-500/10 text-green-500 border-green-500/30" },
    { slug: "supplies", name: "Supplies", color: "bg-orange-500/10 text-orange-500 border-orange-500/30" },
  ];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    if (selectedCategory && resource.categorySlug !== selectedCategory) return false;
    return true;
  });

  const getCategoryColor = (categorySlug: string) => {
    return categories.find(c => c.slug === categorySlug)?.color || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-20 border-b border-border bg-gradient-to-br from-[#F44336]/5 to-transparent">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">STUDIO / SCENIC DIRECTORY</p>
          <h1 className="mb-4">Scenic Directory</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A curated collection of essential resources for scenic designers—organizations, software, 
            suppliers, research archives, and professional communities.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="container py-8 border-b border-border">
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
              All Resources
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
      </section>

      {/* Resources Grid */}
      <section className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-[#F44336]/50">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={`${getCategoryColor(resource.categorySlug)} border`}>
                    {categories.find(c => c.slug === resource.categorySlug)?.name}
                  </Badge>
                  {resource.likes > 0 && (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>{resource.likes}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-[#F44336] transition-colors">
                  {resource.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {resource.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#F44336] font-semibold text-sm hover:gap-3 transition-all duration-300"
                >
                  Visit Site <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No resources found in this category.</p>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-4 text-primary hover:underline font-semibold"
            >
              View all resources
            </button>
          </div>
        )}
      </section>

      {/* Contribution CTA */}
      <section className="container pb-24">
        <div className="bg-gradient-to-br from-[#F44336]/10 to-transparent border border-[#F44336]/30 rounded-2xl p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Know a Great Resource?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            This directory is curated to help scenic designers discover valuable tools, communities, 
            and suppliers. If you know of a resource that should be included, let me know!
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#F44336] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#D32F2F] transition-colors"
          >
            Suggest a Resource
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
