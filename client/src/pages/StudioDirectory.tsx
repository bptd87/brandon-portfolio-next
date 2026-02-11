import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Heart } from "lucide-react";
import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

export default function StudioDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: resources = [], isLoading } = trpc.scenicDirectory.list.useQuery();

  const categories = [
    { slug: "industry", name: "Industry", color: "bg-red-500/10 text-red-500 border-red-500/30" },
    { slug: "research", name: "Research", color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    { slug: "software", name: "Software", color: "bg-purple-500/10 text-purple-500 border-purple-500/30" },
    { slug: "modeling", name: "3D Modeling", color: "bg-green-500/10 text-green-500 border-green-500/30" },
    { slug: "supplies", name: "Supplies", color: "bg-orange-500/10 text-orange-500 border-orange-500/30" },
  ];

  const filteredResources = useMemo(() => resources.filter((resource: any) => {
    if (selectedCategory && resource.categorySlug !== selectedCategory) return false;
    return true;
  }), [resources, selectedCategory]);

  const getCategoryColor = (categorySlug: string) => {
    return categories.find(c => c.slug === categorySlug)?.color || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-20 border-b border-border bg-gradient-to-br from-[#F44336]/5 to-transparent">
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
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse border-2 border-border rounded-lg p-6 space-y-3">
                <div className="h-5 bg-muted rounded w-20" />
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource: any) => (
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
        )}

        {!isLoading && filteredResources.length === 0 && (
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
