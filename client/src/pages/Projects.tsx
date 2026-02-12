import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { trpc } from "@/lib/trpc";
import { Link, useLocation, useSearch } from "wouter";
import { StaggerList, StaggerItem } from "@/components/animations/Stagger";
import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";

export default function Projects() {
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const disciplineParam = searchParams.get('discipline') || 'scenic_design';
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: disciplineParam as any
  });

  // Get unique subcategories from projects
  const subcategories = useMemo(() => {
    if (!projects) return [];
    const cats = new Set(projects.map(p => p.subcategory).filter(Boolean));
    return Array.from(cats).sort();
  }, [projects]);

  // Filter projects by subcategory
  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (selectedSubcategory === 'all') return projects;
    return projects.filter(p => p.subcategory === selectedSubcategory);
  }, [projects, selectedSubcategory]);

  const disciplineInfo: Record<string, { title: string; subtitle: string }> = {
    scenic_design: {
      title: "Scenic Design",
      subtitle: "Spatial Storytelling & Environments"
    },
    experiential_design: {
      title: "Experiential Design",
      subtitle: "Immersive Brand Activations"
    },
    rendering: {
      title: "Rendering",
      subtitle: "Visualization & Concept"
    },
    scenic_models: {
      title: "Scenic Models",
      subtitle: "Scale Model Archive"
    }
  };

  const currentDiscipline = disciplineInfo[disciplineParam] || disciplineInfo.scenic_design;

  return (
    <div className="min-h-screen">
      <SEO
        title={`${currentDiscipline.title} | Brandon PT Davis`}
        description={`Explore ${currentDiscipline.title.toLowerCase()} projects by Brandon PT Davis. ${currentDiscipline.subtitle}.`}
      />
      <Header />

      {/* Page Header */}
      <section className="pt-32 pb-12 border-b border-border">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">PORTFOLIO</p>
          <h1 className="mb-4">{currentDiscipline.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {currentDiscipline.subtitle}
          </p>
        </div>
      </section>

      {/* Discipline Navigation Tabs */}
      <section className="py-6 border-b border-border glass">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            <Link href="/projects?discipline=scenic_design">
              <Button
                variant={disciplineParam === 'scenic_design' ? 'default' : 'outline'}
                size="sm"
                className="transition-smooth"
              >
                SCENIC DESIGN
              </Button>
            </Link>
            <Link href="/projects?discipline=experiential_design">
              <Button
                variant={disciplineParam === 'experiential_design' ? 'default' : 'outline'}
                size="sm"
                className="transition-smooth"
              >
                EXPERIENTIAL
              </Button>
            </Link>
            <Link href="/projects?discipline=rendering">
              <Button
                variant={disciplineParam === 'rendering' ? 'default' : 'outline'}
                size="sm"
                className="transition-smooth"
              >
                RENDERING
              </Button>
            </Link>
            <Link href="/projects?discipline=scenic_models">
              <Button
                variant={disciplineParam === 'scenic_models' ? 'default' : 'outline'}
                size="sm"
                className="transition-smooth"
              >
                SCENIC MODELS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subcategory Filters */}
      {subcategories.length > 0 && (
        <section className="py-8 border-b border-border glass">
          <div className="container">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubcategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubcategory('all')}
                className="transition-smooth"
              >
                ALL
              </Button>
              {subcategories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedSubcategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubcategory(cat || '')}
                  className="transition-smooth"
                >
                  {cat?.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading ? (
        <PortfolioGridSkeleton />
      ) : (
        <>
          {/* Projects Grid */}
          {filteredProjects && filteredProjects.length > 0 ? (
            <section className="py-16 overflow-visible">
              <div className="container overflow-visible">
                <StaggerList className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible">
                  {filteredProjects.map((project, index) => {
                    // Cycle through brand colors for variety
                    const brandColors = [
                      '#FF5722', // Orange
                      '#00BCD4', // Cyan
                      '#E91E63', // Pink
                      '#FFC107', // Amber
                    ];
                    const hoverColor = brandColors[index % brandColors.length];

                    return (
                      <StaggerItem key={project.id}>
                        <Link href={`/projects/${project.slug}`}>
                          <div className="relative overflow-hidden rounded-lg cursor-pointer group aspect-[3/2]">
                            {project.coverImageUrl ? (
                              <>
                                <ProgressiveImage
                                  src={project.coverImageUrl}
                                  alt={project.title}
                                  className="group-hover:scale-110 transition-transform duration-700"
                                  aspectRatio="3/2"
                                  smartPosition={true}
                                  loading="lazy"
                                />
                                {/* Gradient overlay - fades out on hover to reveal full image */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-all duration-500" />

                                {/* Project info - fades out on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:opacity-0 transition-all duration-500">
                                  {project.client && (
                                    <p className="text-xs tracking-widest mb-2 opacity-80">
                                      {project.client.toUpperCase()}
                                    </p>
                                  )}
                                  <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] italic mb-2" style={{ color: hoverColor }}>
                                    {project.title}
                                  </h3>
                                  {project.year && (
                                    <p className="text-sm opacity-80">
                                      {project.year}
                                    </p>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No image</p>
                              </div>
                            )}
                          </div>
                        </Link>
                      </StaggerItem>
                    );
                  })}
                </StaggerList>
              </div>
            </section>
          ) : (
            <div className="container py-16">
              <div className="text-center">
                <p className="text-muted-foreground">
                  {selectedSubcategory === 'all'
                    ? 'No projects in this discipline yet.'
                    : `No projects in the "${selectedSubcategory}" category.`}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <Footer />
    </div>
  );
}
