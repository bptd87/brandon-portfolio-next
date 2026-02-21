import { Card } from "@/components/ui/card";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { getProjectPath } from "@/lib/projectRoutes";
import { StaggerList, StaggerItem } from "@/components/animations/Stagger";
import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { PortfolioGridSkeleton } from "@/components/SkeletonLoaders";
import { AnimatedSection } from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";

export default function Projects() {
  const [, setLocation] = useLocation();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const accentPalette = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
  


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
  const pageSubtitle = "Scenic environments built for story, performance, and collaboration.";
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;
  const animateCardDeparture = async (target: HTMLElement) => {
    const card = target.querySelector(".transition-card") as HTMLElement | null;
    if (!card || typeof card.animate !== "function") return;
    const animation = card.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.975)", filter: "brightness(1.08)" },
      ],
      { duration: 150, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    try {
      await animation.finished;
    } catch {
      // ignore interrupted animation
    }
  };
  const navigateWithTransition = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    const anchor = event.currentTarget;
    const navigate = () => setLocation(href);
    const performNavigation = async () => {
      await animateCardDeparture(anchor);
      navigate();
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        void performNavigation();
      });
    } else {
      void performNavigation();
    }
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={`${pageTitle} | Brandon PT Davis`}
        description={`Explore ${pageTitle.toLowerCase()} projects by Brandon PT Davis. ${pageSubtitle}.`}
        image={projects?.[0]?.coverImageUrl || undefined}
        url="https://www.brandonptdavis.com/projects"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Scenic Design Portfolio", url: "https://www.brandonptdavis.com/projects" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Portfolio",
          url: "https://www.brandonptdavis.com/projects",
          description: "Portfolio archive of scenic design productions by Brandon PT Davis.",
          about: "Scenic design projects in regional theatre, summer stock, and academic production.",
          primaryImageOfPage: projects?.[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: "Scenic Design Projects",
            itemListElement: (filteredProjects || []).slice(0, 40).map((project, index) => ({
              position: index + 1,
              name: project.title,
              url: `https://www.brandonptdavis.com${getProjectPath(project)}`,
              datePublished: project.year ? `${project.year}-01-01` : undefined,
              image: project.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Scenic Design Portfolio",
          description: "A curated body of scenic design productions by Brandon PT Davis across regional theatre, summer stock, and academic performance.",
          url: "https://www.brandonptdavis.com/projects",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Scenic Design",
          about: "Professional scenic design portfolio",
          keywords: [
            "scenic design portfolio",
            "theatre set design",
            "USA 829 scenic designer",
            "Brandon PT Davis",
          ],
          image: (filteredProjects || [])
            .slice(0, 12)
            .map((project) => project.coverImageUrl)
            .filter((url): url is string => Boolean(url)),
          workExample: (filteredProjects || []).slice(0, 20).map((project) => ({
            type: "ImageObject" as const,
            contentUrl: project.coverImageUrl || "",
            name: project.title,
            caption: `${project.title} scenic design by Brandon PT Davis`,
          })).filter((item) => item.contentUrl),
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="space-y-8 text-center max-w-4xl mx-auto">
              <p className="text-xs font-semibold tracking-[0.24em] uppercase text-muted-foreground">
                Portfolio
              </p>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                {pageTitle}
              </h1>

              <div className="max-w-3xl mx-auto space-y-4">
                <p className="text-xl md:text-2xl leading-relaxed font-light text-muted-foreground">
                  {pageSubtitle}
                </p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground/90">
                  A professional body of scenic design work across regional theatre, summer stock, and academic production.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Subcategory Filters */}
      {subcategories.length > 0 && (
        <section className="py-6 border-b border-border/40">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/50 mb-3">
                Filter Productions
              </p>
              <div className="flex justify-center">
                <div className="inline-flex max-w-full gap-2 rounded-2xl border border-border/50 bg-card/20 p-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200"
                    style={selectedSubcategory === 'all'
                      ? {
                          color: accentPalette[0],
                          backgroundColor: `${accentPalette[0]}22`,
                          boxShadow: `inset 0 0 0 1px ${accentPalette[0]}66`,
                        }
                      : undefined}
                  >
                    All
                  </button>
                  {subcategories.map((cat, idx) => {
                    const accent = accentPalette[(idx + 1) % accentPalette.length];
                    const isActive = selectedSubcategory === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => setSelectedSubcategory(cat.key)}
                        className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-white/5"
                        style={isActive
                          ? {
                              color: accent,
                              backgroundColor: `${accent}22`,
                              boxShadow: `inset 0 0 0 1px ${accent}66`,
                            }
                          : undefined}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible"
              >
                {filteredProjects.map((project, index) => {
                  const accentColor = accentPalette[index % accentPalette.length];
                  const href = getProjectPath(project);

                  return (
                    <StaggerItem key={project.id} dramatic={true}>
                      <a href={href} onClick={(event) => navigateWithTransition(event, href)}>
                        <Card className="group border-0 bg-transparent shadow-none">
                          <div
                            className="transition-card relative aspect-[16/9] overflow-hidden rounded-md"
                            style={{ viewTransitionName: `project-card-${project.slug}` } as CSSProperties}
                          >
                            {project.coverImageUrl ? (
                              <ProgressiveImage
                                src={project.coverImageUrl}
                                alt={scenicAlt(project.title)}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                aspectRatio="16/9"
                                smartPosition={true}
                                loading="lazy"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted" />
                            )}
                          </div>
                          <div className="pt-2 text-center">
                            <h3
                              className="text-xs font-semibold tracking-[0.3em] uppercase"
                              style={{ color: accentColor }}
                            >
                              {project.title}
                            </h3>
                          </div>
                        </Card>
                      </a>
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

      <section className="py-20 border-t border-border bg-muted/10">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="space-y-5">
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                  Scenic Design Portfolio in Practice
                </h2>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  As a USA 829 scenic designer, this portfolio documents professional work across regional theatre, summer stock, and academic production. Projects include concept development, ground plans, white models, renderings, and realized stage photography.
                </p>
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  My process starts with script analysis and collaborative alignment, then moves through visual research, iterative design studies, drafting coordination, and production execution. The goal is always the same: design spaces that support story, actor movement, and audience focus.
                </p>
              </div>
              <div className="space-y-4 rounded-xl bg-card/30 p-6 md:p-8">
                <h3 className="text-xs uppercase tracking-[0.22em] font-semibold text-muted-foreground">
                  Core Focus Areas
                </h3>
                <ul className="space-y-3 text-sm md:text-base text-muted-foreground">
                  <li>Scenic design for plays and musicals</li>
                  <li>Drafting and build documentation for production teams</li>
                  <li>Rendering studies for visual communication and alignment</li>
                  <li>Collaboration with lighting, costume, and technical teams</li>
                  <li>Story-driven environments for live performance</li>
                </ul>
                <p className="pt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground/80">
                  USA 829 • Southern California • Available Nationally
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
