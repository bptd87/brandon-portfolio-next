import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { StaggerList, StaggerItem } from "@/components/animations/Stagger";
import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";

export default function Projects() {
  const [location] = useLocation();
  const isScenicDesign = location.startsWith('/projects/scenic-design') || location === '/projects';
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    status: 'published'
  });

  const normalizeText = (value?: string | null) => {
    if (!value) return '';
    const normalized = value
      .replace(/[\s\u00A0]+/g, ' ')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return normalized;
  };

  const normalizedDiscipline = (discipline?: string | null) => {
    if (!discipline) return '';
    return normalizeText(discipline).replace(/[-\s]+/g, '_');
  };

  const disciplineProjects = useMemo(() => {
    if (!projects) return [];
    if (!isScenicDesign) return projects;
    return projects.filter((p) => {
      const normalized = normalizedDiscipline(p.discipline);
      return normalized === 'scenic_design' || normalized === '';
    });
  }, [projects, isScenicDesign]);

  // Get unique subcategories from projects
  const subcategories = useMemo(() => {
    if (!disciplineProjects.length) return [] as Array<{ key: string; label: string }>;
    const labels = new Map<string, string>();

    for (const project of disciplineProjects) {
      const key = normalizeText(project.subcategory);
      if (!key) continue;
      if (!labels.has(key)) {
        labels.set(key, project.subcategory!.trim());
      }
    }

    return Array.from(labels.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [disciplineProjects]);

  useEffect(() => {
    if (selectedSubcategory === 'all') return;
    const hasSelection = subcategories.some((cat) => cat.key === selectedSubcategory);
    if (!hasSelection) {
      setSelectedSubcategory('all');
    }
  }, [selectedSubcategory, subcategories]);

  // Filter projects by subcategory
  const filteredProjects = useMemo(() => {
    if (!disciplineProjects.length) return [];
    if (selectedSubcategory === 'all') return disciplineProjects;
    return disciplineProjects.filter(
      (p) => normalizeText(p.subcategory) === selectedSubcategory
    );
  }, [disciplineProjects, selectedSubcategory]);

  useEffect(() => {
    if (!projects) return;
    const subcategoryKeys = subcategories.map((cat) => cat.key);
    console.log('[Projects] count', {
      total: projects.length,
      scenic: disciplineProjects.length,
      filtered: filteredProjects.length,
      selected: selectedSubcategory,
      subcategories: subcategoryKeys,
    });
  }, [projects, disciplineProjects, filteredProjects, selectedSubcategory, subcategories]);

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

  const currentDiscipline = disciplineInfo.scenic_design;

  return (
    <div className="min-h-screen">
      <SEO
        title={`${currentDiscipline.title} | Brandon PT Davis`}
        description={`Explore ${currentDiscipline.title.toLowerCase()} projects by Brandon PT Davis. ${currentDiscipline.subtitle}.`}
        image={projects?.[0]?.coverImageUrl || undefined}
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
                  key={cat.key}
                  variant={selectedSubcategory === cat.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSubcategory(cat.key)}
                  className="transition-smooth"
                >
                  {cat.label.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading ? (
        <PortfolioGridSkeleton />
      ) : (
        <section className="py-16 overflow-visible">
          <div className="container overflow-visible">
            {filteredProjects && filteredProjects.length > 0 ? (
              <StaggerList
                key={`${selectedSubcategory}-${filteredProjects.length}`}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-visible"
              >
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
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {selectedSubcategory === 'all'
                    ? 'No projects in this discipline yet.'
                    : `No projects in the "${selectedSubcategory}" category.`}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
