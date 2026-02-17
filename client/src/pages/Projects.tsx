import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { getProjectPath } from "@/lib/projectRoutes";
import { StaggerList, StaggerItem } from "@/components/animations/Stagger";
import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function Projects() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const { data: projects, isLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: 'scenic_design'
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

  // Get unique subcategories from projects
  const subcategories = useMemo(() => {
    if (!projects?.length) return [] as Array<{ key: string; label: string }>;
    const labels = new Map<string, string>();

    for (const project of projects) {
      const key = normalizeText(project.subcategory);
      if (!key) continue;
      if (!labels.has(key)) {
        labels.set(key, project.subcategory!.trim());
      }
    }

    return Array.from(labels.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, label]) => ({ key, label }));
  }, [projects]);

  useEffect(() => {
    if (selectedSubcategory === 'all') return;
    const hasSelection = subcategories.some((cat) => cat.key === selectedSubcategory);
    if (!hasSelection) {
      setSelectedSubcategory('all');
    }
  }, [selectedSubcategory, subcategories]);

  // Filter projects by subcategory
  const filteredProjects = useMemo(() => {
    if (!projects?.length) return [];
    if (selectedSubcategory === 'all') return projects;
    return projects.filter(
      (p) => normalizeText(p.subcategory) === selectedSubcategory
    );
  }, [projects, selectedSubcategory]);

  // Performance monitoring removed for production

  const pageTitle = "Scenic Design";
  const pageSubtitle = "Spatial Storytelling & Environments";

  return (
    <div className="min-h-screen">
      <SEO
        title={`${pageTitle} | Brandon PT Davis`}
        description={`Explore ${pageTitle.toLowerCase()} projects by Brandon PT Davis. ${pageSubtitle}.`}
        image={projects?.[0]?.coverImageUrl || undefined}
        url="https://www.brandonptdavis.com/projects"
      />
      <Header />

      {/* Hero Section - Minimalist & Dramatic */}
      <section className="py-32 md:py-40 border-b border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="space-y-8 text-center">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                {pageTitle}
              </h1>

              <div className="max-w-2xl mx-auto">
                <p className="text-xl md:text-2xl leading-relaxed font-extralight text-muted-foreground">
                  {pageSubtitle}
                </p>
              </div>
            </div>
          </AnimatedSection>
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
                  const brandColors = [
                    '#FF5722',
                    '#00BCD4',
                    '#E91E63',
                    '#FFC107',
                  ];
                  const hoverColor = brandColors[index % brandColors.length];

                  return (
                    <StaggerItem key={project.id} dramatic={true}>
                      <Link href={getProjectPath(project)}>
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
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:opacity-0 transition-all duration-500" />

                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white group-hover:opacity-0 transition-all duration-500">
                                {project.client && (
                                  <p className="text-xs tracking-widest mb-2 opacity-80">
                                    {project.client.toUpperCase()}
                                  </p>
                                )}
                                <h3 className="text-2xl md:text-3xl font-playfair italic mb-2" style={{ color: hoverColor }}>
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

      <section className="py-32 border-t border-border">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="space-y-16">
              <h2 className="text-5xl md:text-7xl font-black leading-tight">
                Every space
                <br />
                tells a story.
              </h2>
              
              <div className="space-y-12 text-xl md:text-2xl leading-relaxed text-muted-foreground font-light">
                <p>
                  I design for live performance—regional theatre, summer stock, academic productions, 
                  immersive experiences. Each project starts the same way: with a script, a director's 
                  vision, and the question <em className="font-playfair italic">"What does this story need?"</em>
                </p>

                <p>
                  The best scenic design doesn't call attention to itself. It serves the narrative, 
                  supports the performers, and creates spatial opportunities that wouldn't exist without it. 
                  It solves problems. It builds worlds worth believing in.
                </p>

                <p>
                  I work collaboratively, iterate constantly, and embrace constraints as creative fuel. 
                  Whether it's a black box or a 1,200-seat proscenium, the goal remains the same: 
                  <strong>make theatre that matters</strong>.
                </p>

                <div className="pt-8 text-sm uppercase tracking-[0.3em] text-center">
                  Member of USA 829 • Based in Southern California • Working nationally
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="container max-w-7xl">
          <AnimatedSection>
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-medium text-center mb-16">
              Featured Work
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProjects.slice(0, 6).map((project, index) => (
              <AnimatedSection key={project.id}>
                <Link href={getProjectPath(project)}>
                  <div className="group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer">
                    {project.coverImageUrl ? (
                      <>
                        <ProgressiveImage
                          src={project.coverImageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          aspectRatio="4/5"
                          smartPosition={true}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-500">
                          <h3 className="text-xl md:text-2xl font-bold mb-2">
                            {project.title}
                          </h3>
                          {project.venue && (
                            <p className="text-sm opacity-80 mb-1">
                              {project.venue}
                            </p>
                          )}
                          {project.year && (
                            <p className="text-xs opacity-60">
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-border bg-muted/20">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                Design Notes
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thoughts on process, philosophy, and the work itself.
              </p>
            </div>
          </AnimatedSection>

          <div className="space-y-16">
            <AnimatedSection>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  On Collaboration
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Theatre is a team sport. The best work happens when designers, directors, and performers 
                  trust each other enough to take risks. I listen first—understanding the vision, the needs, 
                  the constraints. Then I contribute, iterate, adapt. Good collaboration isn't about defending 
                  your ideas; it's about serving the story and lifting each other's work.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  On Constraints
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Every project has limits—budget, space, time, crew capacity. The best designs aren't made 
                  in spite of constraints; they're made <em>because</em> of them. Constraints force clarity. 
                  They eliminate the unnecessary. A great design doesn't require unlimited resources—it requires 
                  intentional choices.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  On Research
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Research grounds imagination. Whether it's period architecture, cultural context, or material 
                  history, research provides the vocabulary for design choices. It's not about literal replication—it's 
                  about understanding the rules so you know when and how to break them. Research informs authenticity, 
                  even when the design is stylized or abstract.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  On Tools
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Sketches, models, renderings, drawings—each tool has a purpose. Early in the process, I work 
                  fast and loose, exploring multiple directions. As the design solidifies, I refine and detail. 
                  White models show form and space. Renderings communicate atmosphere and mood. Construction drawings 
                  translate vision into buildable reality. The art is knowing which tool to use when.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">
                  On Story
                </h3>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Everything I design is in service of the story. The set should feel inevitable—as if the play 
                  couldn't happen anywhere else. It should guide the audience's focus, support the emotional arc, 
                  and create opportunities for staging that wouldn't exist without it. Scenic design is spatial 
                  storytelling. If it's not serving the narrative, it doesn't belong on stage.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
