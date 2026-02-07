import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";

export default function Projects() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
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
      <Header />

      {/* Page Header */}
      <section className="py-20 border-b border-border">
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
        <div className="container py-16">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          {filteredProjects && filteredProjects.length > 0 ? (
            <section className="py-16">
              <div className="container">
                <div className="flex flex-col gap-6">
                  {filteredProjects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <div className="glass hover-lift rounded-2xl overflow-hidden transition-smooth cursor-pointer group flex flex-col md:flex-row">
                        {project.coverImageUrl ? (
                          <div className="md:w-2/5 aspect-[16/10] md:aspect-auto overflow-hidden flex-shrink-0">
                            <img 
                              src={project.coverImageUrl} 
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ) : (
                          <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                          </div>
                        )}
                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                          {project.subcategory && (
                            <Badge variant="secondary" className="mb-3">
                              {project.subcategory.toUpperCase()}
                            </Badge>
                          )}
                          <h3 className="text-2xl font-['Playfair_Display'] mb-2 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          {project.client && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {project.client} · {project.year}
                            </p>
                          )}
                          {project.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
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
