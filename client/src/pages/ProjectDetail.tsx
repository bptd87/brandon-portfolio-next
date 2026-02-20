import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProjectDetailSkeleton } from "@/components/SkeletonLoaders";
import { getProjectPath } from "@/lib/projectRoutes";

// Convert YouTube/Vimeo URLs to embed format
function getEmbedUrl(url: string): string {
  if (!url) return '';

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Already an embed URL or unknown format
  return url;
}

// Color rotation for consistency with homepage
const ACCENT_COLORS = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });
  // Fetch projects in same discipline for navigation
  const { data: allProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline || undefined },
    { enabled: !!project?.discipline }
  );

  // Fetch related projects (same discipline) for "More Projects" section
  const { data: allRelatedProjects } = trpc.projects.list.useQuery(
    { discipline: project?.discipline || undefined },
    { enabled: !!project?.discipline }
  );
  const relatedProjects = allRelatedProjects; // Show all projects
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{ imageUrl: string | null; caption: string | null; altText: string | null }>>([]);
  const [showFullNotes, setShowFullNotes] = useState(false);

  // Track project view
  useEffect(() => {
    if (project && typeof window !== 'undefined' && (window as any).analyticsTracker) {
      (window as any).analyticsTracker.trackProjectView(
        project.id,
        project.slug,
        project.title,
        project.discipline,
        project.subcategory
      );
    }
  }, [project?.id]);

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const productionPhotos = images.filter(img => img.imageType === 'production');
  const renderings = images.filter(img => img.imageType === 'rendering');
  const videos = images.filter(img => img.imageType === 'video');

  // Parse creative team from JSON array
  let creativeTeamArray: Array<{ name: string, role: string }> = [];
  try {
    if (typeof project.creativeTeam === 'string') {
      creativeTeamArray = JSON.parse(project.creativeTeam);
    } else if (Array.isArray(project.creativeTeam)) {
      creativeTeamArray = project.creativeTeam;
    }
  } catch (e) {
    console.error('Failed to parse creative team:', e);
  }

  // Design notes
  const designNotes = project.designNotes || '';
  const normalizedDesignNotes = designNotes.trim();
  const cleanedDesignNotes =
    normalizedDesignNotes === "[]" ||
    normalizedDesignNotes === "{}" ||
    normalizedDesignNotes.toLowerCase() === "n/a"
      ? ""
      : normalizedDesignNotes;
  const shortDesignNotes =
    cleanedDesignNotes.length > 420
      ? `${cleanedDesignNotes.slice(0, 417).trim()}...`
      : cleanedDesignNotes;
  const shouldTruncateNotes = cleanedDesignNotes.length > 420;

  const normalizedTitle = project.title.trim().toLowerCase();
  const normalizedClient = (project.client || "").trim().toLowerCase();
  const showProductionName = !!normalizedClient && normalizedClient !== normalizedTitle;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const projectDateLabel = project.year
    ? project.month && project.month >= 1 && project.month <= 12
      ? `${monthNames[project.month - 1]} ${project.year}`
      : `${project.year}`
    : null;
  const locationDateLabel = [project.location, projectDateLabel].filter(Boolean).join(" • ");

  const rawExternalArticles = (project as any).externalArticles;
  const externalArticles = (() => {
    const inferType = (item: any): "review" | "listing" => {
      const explicitType = item?.type;
      if (explicitType === "review" || explicitType === "listing") return explicitType;
      const text = `${item?.title || ""} ${item?.source || ""}`.toLowerCase();
      return /review|critic|interview|feature|press/.test(text) ? "review" : "listing";
    };
    const sortByType = (arr: any[]) =>
      arr
        .map((item) => ({ ...item, type: inferType(item) }))
        .sort((a, b) => (a.type === b.type ? 0 : a.type === "review" ? -1 : 1));

    if (Array.isArray(rawExternalArticles)) {
      return sortByType(rawExternalArticles.filter((item: any) => item?.url));
    }
    if (typeof rawExternalArticles === "string") {
      try {
        const parsed = JSON.parse(rawExternalArticles);
        return Array.isArray(parsed) ? sortByType(parsed.filter((item: any) => item?.url)) : [];
      } catch {
        return [];
      }
    }
    return [];
  })();
  const reviewArticles = externalArticles.filter((article: any) => article.type === "review");
  const listingArticles = externalArticles.filter((article: any) => article.type !== "review");

  // Get related projects excluding current one
  const relatedProjectsFiltered = relatedProjects?.filter(p => p.id !== project.id) || [];

  // Find prev/next projects from same discipline only
  const currentIndex = allProjects?.findIndex(p => p.id === project.id) ?? -1;
  const prevProject = currentIndex > 0 ? allProjects?.[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < (allProjects?.length ?? 0) - 1 ? allProjects?.[currentIndex + 1] : null;

  // Determine accent color per project (stable, full 5-color rotation)
  const accentColor = ACCENT_COLORS[Math.abs(project.id) % ACCENT_COLORS.length] || ACCENT_COLORS[0];

  // Prepare creative work schema data
  const projectImages = productionPhotos.slice(0, 5).map(img => ({
    type: 'ImageObject' as const,
    contentUrl: img.imageUrl || '',
    caption: img.caption || undefined,
    name: img.altText || undefined,
  })).filter(img => img.contentUrl);

  const contributors = creativeTeamArray.map(member => ({
    type: 'Person' as const,
    name: member.name,
    roleName: member.role,
  }));

  const projectUrl = `https://www.brandonptdavis.com${location}`;
  const disciplineLabel = project.discipline === 'scenic_design'
    ? 'Scenic Design'
    : project.discipline === 'experiential_design'
      ? 'Experiential'
      : project.discipline === 'rendering'
        ? 'Rendering'
        : 'Projects';
  const disciplineLink = project.discipline === 'rendering'
    ? '/projects/rendering'
    : project.discipline === 'experiential_design'
      ? '/projects/experiential'
      : project.discipline === 'scenic_design'
        ? '/projects/scenic-design'
        : '/projects';
  const moreProjectsLabel = project.discipline === 'scenic_design'
    ? 'More Scenic Design'
    : disciplineLabel === 'Projects'
      ? 'More Projects'
      : `More ${disciplineLabel}`;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-foreground" style={{ '--accent-color': accentColor } as React.CSSProperties}>
      <div className="relative">
        <SEO
          title={`${project.title} | Brandon PT Davis`}
          description={project.excerpt || `${project.title} - Scenic design project by Brandon PT Davis`}
          image={project.coverImageUrl || undefined}
          type="website"
          keywords={project.seoKeywords || undefined}
          url={projectUrl}
        />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Projects", url: "https://www.brandonptdavis.com/projects" },
          { name: project.title, url: projectUrl },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: project.excerpt || undefined,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString().split('T')[0] : undefined,
          genre: project.discipline?.replace('_', ' ') || 'Scenic Design',
          keywords: project.seoKeywords?.split(',').map(k => k.trim()) || [],
          locationCreated: project.client ? {
            name: project.client,
            ...(project.location && {
              address: {
                addressLocality: project.location.split(',')[0]?.trim(),
                addressRegion: project.location.split(',')[1]?.trim() || undefined,
                addressCountry: "US",
              },
            }),
          } : undefined,
          url: projectUrl,
          workExample: projectImages.length > 0 ? projectImages : undefined,
          about: project.designNotes || undefined,
          contributor: contributors.length > 0 ? contributors : undefined,
        }}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <Breadcrumb
          items={[
            { label: "Work", href: "/projects" },
            { label: disciplineLabel, href: disciplineLink },
            { label: project.title }
          ]}
        />
      </div>

      <section className="border-y border-border/50 bg-[#101014]">
        <div className="container py-10 lg:py-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
            <AnimatedSection className="lg:hidden">
              <aside
                className="space-y-6 rounded-xl border bg-[#0f0f13] p-6"
                style={{ borderColor: `${accentColor}55`, boxShadow: `inset 0 1px 0 ${accentColor}22` }}
              >
                <div className="space-y-4">
                  {project.subcategory && (
                    <Badge
                      variant="outline"
                      className="rounded-md border px-3 py-1 text-[10px] tracking-[0.18em] uppercase"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      {project.subcategory}
                    </Badge>
                  )}
                  <h1 className="text-4xl leading-[1.08] tracking-[-0.02em] font-light uppercase text-foreground/90">
                    {project.title}
                  </h1>
                  {showProductionName && project.client && (
                    <p className="text-xl font-light text-foreground/65" style={{ color: `${accentColor}` }}>
                      {project.client}
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                  {locationDateLabel ? (
                    <div className="grid grid-cols-[84px_1fr] gap-3 text-sm leading-relaxed">
                      <span className="text-foreground/45 uppercase tracking-[0.14em]">Locale</span>
                      <span className="text-foreground/75">{locationDateLabel}</span>
                    </div>
                  ) : null}
                </div>

                {project.excerpt && (
                  <div className="border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                    <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                      Project Context
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {project.excerpt}
                    </p>
                  </div>
                )}
              </aside>
            </AnimatedSection>

            <div className="space-y-6">
              {productionPhotos.length > 0 ? (
                productionPhotos.map((img, idx) => (
                  <AnimatedSection key={img.id} delay={idx * 30}>
                    <figure
                      className="group relative overflow-hidden rounded-xl bg-black/90 cursor-pointer shadow-lg"
                      onClick={() => {
                        setLightboxImages(productionPhotos);
                        setLightboxIndex(idx);
                        setLightboxOpen(true);
                      }}
                    >
                      <ProgressiveImage
                        src={img.imageUrl || ""}
                        alt={img.altText || img.caption || project.title}
                        className="transition-transform duration-500 group-hover:scale-[1.01]"
                        objectFit="contain"
                        smartPosition={true}
                        loading="lazy"
                      />
                    </figure>
                  </AnimatedSection>
                ))
              ) : project.coverImageUrl ? (
                <figure className="overflow-hidden rounded-xl bg-black/90 shadow-lg">
                  <ProgressiveImage
                    src={project.coverImageUrl}
                    alt={project.title}
                    objectFit="contain"
                    smartPosition={true}
                    loading="eager"
                  />
                </figure>
              ) : null}

              {renderings.length > 0 && (
                <AnimatedSection>
                  <div className="pt-4">
                    <h3 className="mb-4 text-xs font-semibold tracking-[0.22em] uppercase text-foreground/60">
                      Renderings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderings.map((img, idx) => (
                        <figure
                          key={img.id}
                          className="group overflow-hidden rounded-xl bg-black/90 cursor-pointer shadow-lg"
                          onClick={() => {
                            setLightboxImages(renderings);
                            setLightboxIndex(idx);
                            setLightboxOpen(true);
                          }}
                        >
                          <ProgressiveImage
                            src={img.imageUrl || ""}
                            alt={img.altText || img.caption || project.title}
                            className="transition-transform duration-500 group-hover:scale-[1.03]"
                            objectFit="contain"
                            smartPosition={true}
                            loading="lazy"
                          />
                        </figure>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              {videos.length > 0 && (
                <AnimatedSection>
                  <div className="pt-4">
                    <h3 className="mb-4 text-xs font-semibold tracking-[0.22em] uppercase text-foreground/60">
                      Video
                    </h3>
                    <div className="grid grid-cols-1 gap-6">
                      {videos.map((video) => (
                        <div key={video.id} className="overflow-hidden rounded-xl bg-black shadow-lg">
                          <div className="relative w-full pb-[56.25%]">
                            <iframe
                              src={getEmbedUrl(video.videoUrl || "")}
                              title={`Video: ${video.caption || "embedded video"}`}
                              className="absolute inset-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              )}

              <AnimatedSection className="lg:hidden">
                <aside
                  className="space-y-8 rounded-xl border bg-[#0f0f13] p-6"
                  style={{ borderColor: `${accentColor}55`, boxShadow: `inset 0 1px 0 ${accentColor}22` }}
                >
                  {creativeTeamArray.length > 0 && (
                    <div className="space-y-3">
                      {creativeTeamArray.map((member, idx) => {
                        const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                        return (
                          <Link key={idx} href={`/about/collaborators#${slug}`}>
                            <div className="group cursor-pointer">
                              <p className="text-sm text-foreground/60 leading-relaxed">
                                <span className="font-medium text-foreground/80" style={{ color: accentColor }}>{member.role}:</span>{" "}
                                <span className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>{member.name}</span>
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {cleanedDesignNotes && (
                    <div className={`${creativeTeamArray.length > 0 ? 'border-t pt-5' : ''}`} style={{ borderColor: `${accentColor}55` }}>
                      <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                        Design Notes
                      </h2>
                      <p className="text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap">
                        {showFullNotes || !shouldTruncateNotes ? cleanedDesignNotes : shortDesignNotes}
                      </p>
                      {shouldTruncateNotes && (
                        <button
                          type="button"
                          onClick={() => setShowFullNotes((prev) => !prev)}
                          className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60 hover:text-foreground"
                          style={{ color: accentColor }}
                        >
                          {showFullNotes ? "Show Less" : "Read Full Notes"}
                        </button>
                      )}
                    </div>
                  )}

                  {externalArticles.length > 0 && (
                    <div className="border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                      <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                        Public Articles
                      </h2>
                      <div className="space-y-4">
                        {reviewArticles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/50">Reviews</p>
                            {reviewArticles.map((article: any, index: number) => (
                              <a
                                key={`review-${article.url}-${index}`}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-sm leading-relaxed text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                              >
                                <span className="font-medium">{article.title || article.url}</span>
                                {article.source ? <span className="block text-xs text-foreground/50 mt-1">{article.source}</span> : null}
                              </a>
                            ))}
                          </div>
                        )}
                        {listingArticles.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/50">Project Listings</p>
                            {listingArticles.map((article: any, index: number) => (
                              <a
                                key={`listing-${article.url}-${index}`}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg border border-border/40 bg-background/20 px-3 py-2 text-sm leading-relaxed text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
                              >
                                {article.title || article.url}
                                {article.source ? <span className="block text-xs text-foreground/45 mt-1">{article.source}</span> : null}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </aside>
              </AnimatedSection>
            </div>

            <AnimatedSection>
              <aside
                className="hidden lg:block lg:sticky lg:top-24 space-y-8 rounded-xl border bg-[#0f0f13] p-6 md:p-7"
                style={{ borderColor: `${accentColor}55`, boxShadow: `inset 0 1px 0 ${accentColor}22` }}
              >
                <div className="space-y-4">
                  {project.subcategory && (
                    <Badge
                      variant="outline"
                      className="rounded-md border px-3 py-1 text-[10px] tracking-[0.18em] uppercase"
                      style={{ borderColor: accentColor, color: accentColor }}
                    >
                      {project.subcategory}
                    </Badge>
                  )}
                  <h1 className="text-5xl leading-[1.06] tracking-[-0.02em] font-light uppercase text-foreground/90">
                    {project.title}
                  </h1>
                  {showProductionName && project.client && (
                    <p className="text-2xl font-light text-foreground/65" style={{ color: `${accentColor}` }}>
                      {project.client}
                    </p>
                  )}
                </div>

                <div className="space-y-3 border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                  {locationDateLabel ? (
                    <div className="grid grid-cols-[84px_1fr] gap-3 text-sm leading-relaxed">
                      <span className="text-foreground/45 uppercase tracking-[0.14em]">Locale</span>
                      <span className="text-foreground/75">{locationDateLabel}</span>
                    </div>
                  ) : null}
                </div>

                {project.excerpt && (
                  <div className="border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                    <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                      Project Context
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {project.excerpt}
                    </p>
                  </div>
                )}

                {creativeTeamArray.length > 0 && (
                  <div className="space-y-3 border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                    {creativeTeamArray.map((member, idx) => {
                      const slug = member.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      return (
                        <Link key={idx} href={`/about/collaborators#${slug}`}>
                          <div className="group cursor-pointer">
                            <p className="text-sm text-foreground/60 leading-relaxed">
                              <span className="font-medium text-foreground/80" style={{ color: accentColor }}>{member.role}:</span>{" "}
                              <span className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>{member.name}</span>
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {cleanedDesignNotes && (
                  <div className="border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                    <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                      Design Notes
                    </h2>
                    <p className="text-sm leading-relaxed text-foreground/70 whitespace-pre-wrap">
                      {showFullNotes || !shouldTruncateNotes ? cleanedDesignNotes : shortDesignNotes}
                    </p>
                    {shouldTruncateNotes && (
                      <button
                        type="button"
                        onClick={() => setShowFullNotes((prev) => !prev)}
                        className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/60 hover:text-foreground"
                        style={{ color: accentColor }}
                      >
                        {showFullNotes ? "Show Less" : "Read Full Notes"}
                      </button>
                    )}
                  </div>
                )}

                {externalArticles.length > 0 && (
                  <div className="border-t pt-5" style={{ borderColor: `${accentColor}55` }}>
                    <h2 className="mb-3 text-xs font-semibold tracking-[0.18em] uppercase text-foreground/55" style={{ color: accentColor }}>
                      Public Articles
                    </h2>
                    <div className="space-y-4">
                      {reviewArticles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/50">Reviews</p>
                          {reviewArticles.map((article: any, index: number) => (
                            <a
                              key={`review-d-${article.url}-${index}`}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg border border-border/50 bg-background/30 px-3 py-2 text-sm leading-relaxed text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                            >
                              <span className="font-medium">{article.title || article.url}</span>
                              {article.source ? <span className="block text-xs text-foreground/50 mt-1">{article.source}</span> : null}
                            </a>
                          ))}
                        </div>
                      )}
                      {listingArticles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/50">Project Listings</p>
                          {listingArticles.map((article: any, index: number) => (
                            <a
                              key={`listing-d-${article.url}-${index}`}
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg border border-border/40 bg-background/20 px-3 py-2 text-sm leading-relaxed text-foreground/70 transition-colors hover:border-foreground/30 hover:text-foreground"
                            >
                              {article.title || article.url}
                              {article.source ? <span className="block text-xs text-foreground/45 mt-1">{article.source}</span> : null}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="container py-16">
        <Separator className="mb-12 bg-border/60" />

        {relatedProjectsFiltered.length > 0 && (
          <AnimatedSection>
            <div>
              <h2 className="mb-8 text-sm font-semibold tracking-[0.22em] uppercase text-foreground/65">
                {moreProjectsLabel}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedProjectsFiltered.map((relatedProject, idx) => (
                  <Link key={relatedProject.id} href={getProjectPath(relatedProject)}>
                    <Card className="group border-0 bg-transparent shadow-none">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/85">
                        {relatedProject.coverImageUrl ? (
                          <ProgressiveImage
                            src={relatedProject.coverImageUrl}
                            alt={relatedProject.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            aspectRatio="4/3"
                            smartPosition={true}
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <CardContent className="pt-3 px-0 text-center">
                        <h3
                          className="text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors group-hover:text-foreground"
                          style={{ color: ACCENT_COLORS[idx % ACCENT_COLORS.length], transitionDuration: '180ms' }}
                        >
                          {relatedProject.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
      </div>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setLightboxIndex((prev) => Math.min(prev + 1, lightboxImages.length - 1))}
          onPrev={() => setLightboxIndex((prev) => Math.max(prev - 1, 0))}
        />
      )}
    </div>
  );
}
