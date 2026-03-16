import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Link, useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { AnimatePresence } from "framer-motion";
import { Check, Link2 } from "lucide-react";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
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

function inferEncodingFormat(url: string): string | undefined {
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.avif')) return 'image/avif';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  return undefined;
}

// Color rotation for consistency with homepage
const ACCENT_COLORS = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [location] = useLocation();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });

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
  const [linkCopied, setLinkCopied] = useState(false);

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
  // Keep DB sort_order, but force renderings to the end of the sequence.
  const mediaItems = [...images]
    .filter((img) => (img.imageType === 'video' ? Boolean(img.videoUrl) : Boolean(img.imageUrl)))
    .sort((a, b) => {
      const aWeight = a.imageType === "rendering" ? 1 : 0;
      const bWeight = b.imageType === "rendering" ? 1 : 0;
      return aWeight - bWeight;
    });
  const lightboxSourceImages = mediaItems.filter((img) => img.imageType !== 'video' && !!img.imageUrl);
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;

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

  // Determine accent color per project (stable, full 5-color rotation)
  const accentColor = ACCENT_COLORS[Math.abs(project.id) % ACCENT_COLORS.length] || ACCENT_COLORS[0];

  // Prepare creative work schema data
  const projectImages = lightboxSourceImages.slice(0, 20).map((img, index) => ({
    type: 'ImageObject' as const,
    contentUrl: img.imageUrl || '',
    caption: img.caption || undefined,
    name: img.altText || img.caption || `${project.title} image ${index + 1}`,
    description: img.caption || project.excerpt || undefined,
    thumbnailUrl: img.imageUrl || undefined,
    encodingFormat: img.imageUrl ? inferEncodingFormat(img.imageUrl) : undefined,
  })).filter(img => img.contentUrl);

  const contributors = creativeTeamArray.map(member => ({
    type: 'Person' as const,
    name: member.name,
    roleName: member.role,
  }));

  const projectUrl = `https://www.brandonptdavis.com${location}`;
  const projectUpdatedDate = (project as any).updatedAt
    ? new Date((project as any).updatedAt).toISOString().split('T')[0]
    : undefined;
  const heroTransitionName = `project-card-${project.slug}`;
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
        ? '/projects'
        : '/projects';
  const moreProjectsLabel = project.discipline === 'scenic_design'
    ? 'More Scenic Design'
    : disciplineLabel === 'Projects'
      ? 'More Projects'
      : `More ${disciplineLabel}`;
  const featuredMedia = mediaItems[0] || null;
  const secondaryMedia = mediaItems.slice(1);
  const venueDateLabel = [project.client, projectDateLabel].filter(Boolean).join(" • ");
  const openLightboxFor = (imageId: number) => {
    setLightboxImages(lightboxSourceImages);
    const lightboxIndexFromId = lightboxSourceImages.findIndex((img) => img.id === imageId);
    setLightboxIndex(lightboxIndexFromId >= 0 ? lightboxIndexFromId : 0);
    setLightboxOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(projectUrl);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      setLinkCopied(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-foreground" style={{ '--accent-color': accentColor } as React.CSSProperties}>
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
          dateModified: projectUpdatedDate,
          genre: project.discipline?.replace('_', ' ') || 'Scenic Design',
          keywords: project.seoKeywords?.split(',').map(k => k.trim()) || [],
          mainEntityOfPage: projectUrl,
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

      <main className="pb-20">
        <section className="container max-w-6xl pt-8 md:pt-10">
          <AnimatedSection>
            <div className="pt-10">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
                <div className="space-y-6 text-center">
                  <div className="flex flex-wrap items-center justify-center gap-4 text-[0.96rem] tracking-[-0.02em] text-foreground/58">
                    {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                    {project.client ? <span>{project.client}</span> : null}
                    {!project.client && project.subcategory ? <span>{project.subcategory}</span> : null}
                  </div>

                  <div className="space-y-4">
                    <h1 className="mx-auto max-w-[16ch] font-sans text-[clamp(2rem,4.2vw,3.95rem)] font-normal leading-[0.95] tracking-[-0.05em] text-foreground">
                      {project.title}
                    </h1>
                    {project.subcategory && project.client ? (
                      <p className="text-[0.96rem] tracking-[-0.01em] text-foreground/46">
                        {disciplineLabel} {project.subcategory ? `• ${project.subcategory}` : ""}
                      </p>
                    ) : null}
                  </div>

                  {project.excerpt ? (
                    <p className="mx-auto max-w-[42rem] text-[clamp(1rem,1.3vw,1.28rem)] leading-[1.52] tracking-[-0.018em] text-foreground/78">
                      {project.excerpt}
                    </p>
                  ) : null}

                  <div className="mx-auto flex w-full max-w-[18rem] justify-center border-t border-border/35 pt-5">
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-3 rounded-full px-4 py-2 text-[0.98rem] tracking-[-0.02em] text-foreground/70 transition-colors hover:bg-white/[0.03] hover:text-foreground"
                    >
                      {linkCopied ? <Check className="h-4.5 w-4.5" /> : <Link2 className="h-4.5 w-4.5" />}
                      <span>{linkCopied ? "Link copied" : "Share"}</span>
                    </button>
                  </div>
                </div>
                <div aria-hidden="true" className="hidden lg:block" />
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="container max-w-6xl pt-10 md:pt-12">
          <AnimatedSection>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
              <div className="space-y-6">
                {featuredMedia ? (
                  featuredMedia.imageType === "video" ? (
                    <div className="overflow-hidden rounded-2xl bg-black shadow-lg">
                      <div className="relative h-[min(74vh,48rem)] w-full">
                        <iframe
                          src={getEmbedUrl(featuredMedia.videoUrl || "")}
                          title={`Video: ${featuredMedia.caption || "embedded video"}`}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    <figure
                      className="group cursor-pointer"
                      style={{ viewTransitionName: heroTransitionName } as CSSProperties}
                      onClick={() => openLightboxFor(featuredMedia.id)}
                    >
                      <img
                        src={featuredMedia.imageUrl || ""}
                        alt={featuredMedia.altText || featuredMedia.caption || scenicAlt(project.title)}
                        className="block w-full rounded-xl object-contain object-top transition-transform duration-500 group-hover:scale-[1.01]"
                        style={{ maxHeight: "min(74vh, 48rem)" }}
                        loading="eager"
                        decoding="async"
                      />
                    </figure>
                  )
                ) : project.coverImageUrl ? (
                  <figure
                    className=""
                    style={{ viewTransitionName: heroTransitionName } as CSSProperties}
                  >
                    <img
                      src={project.coverImageUrl}
                      alt={scenicAlt(project.title)}
                      className="block w-full rounded-xl object-contain object-top"
                      style={{ maxHeight: "min(74vh, 48rem)" }}
                      loading="eager"
                      decoding="async"
                    />
                  </figure>
                ) : null}

                {featuredMedia?.caption ? (
                  <p className="text-sm text-foreground/46">{featuredMedia.caption}</p>
                ) : null}

                {secondaryMedia.length > 0 ? (
                  <div className="space-y-6">
                    {secondaryMedia.map((item) =>
                      item.imageType === "video" ? (
                        <div key={item.id} className="overflow-hidden rounded-2xl bg-black shadow-lg">
                          <div className="relative h-[min(64vh,38rem)] w-full">
                            <iframe
                              src={getEmbedUrl(item.videoUrl || "")}
                              title={`Video: ${item.caption || "embedded video"}`}
                              className="absolute inset-0 h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      ) : (
                        <figure
                          key={item.id}
                          className="group cursor-pointer"
                          onClick={() => openLightboxFor(item.id)}
                        >
                          <img
                            src={item.imageUrl || ""}
                            alt={item.altText || item.caption || scenicAlt(project.title)}
                            className="block w-full rounded-xl object-contain object-top transition-transform duration-500 group-hover:scale-[1.01]"
                            style={{ maxHeight: "min(64vh, 38rem)" }}
                            loading="lazy"
                            decoding="async"
                          />
                          {item.caption ? (
                            <figcaption className="px-1 pt-3 text-sm text-foreground/44">
                              {item.caption}
                            </figcaption>
                          ) : null}
                        </figure>
                      )
                    )}
                  </div>
                ) : null}
              </div>

              <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
                {creativeTeamArray.length > 0 ? (
                  <section className="border-t border-border/35 pt-6">
                    <p
                      className="text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: accentColor }}
                    >
                      Creative Team
                    </p>
                    <div className="mt-6 divide-y divide-border/30 border-y border-border/30">
                      {creativeTeamArray.map((member, idx) => {
                        const memberSlug = member.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-|-$/g, "");

                        return (
                          <Link key={idx} href={`/about/collaborators#${memberSlug}`}>
                            <a className="block py-4 transition-colors hover:text-foreground">
                              <span className="block text-[11px] uppercase tracking-[0.16em] text-foreground/42">
                                {member.role}
                              </span>
                              <span className="mt-2 block text-[1.02rem] leading-7 text-foreground/72">
                                {member.name}
                              </span>
                            </a>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ) : null}

                {cleanedDesignNotes ? (
                  <section className="border-t border-border/35 pt-6">
                    <p
                      className="text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: accentColor }}
                    >
                      Design Notes
                    </p>
                    <div className="mt-5">
                      <p className="whitespace-pre-wrap text-[0.98rem] leading-8 text-foreground/68">
                        {showFullNotes || !shouldTruncateNotes ? cleanedDesignNotes : shortDesignNotes}
                      </p>
                      {shouldTruncateNotes ? (
                        <button
                          type="button"
                          onClick={() => setShowFullNotes((prev) => !prev)}
                          className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/58 hover:text-foreground"
                          style={{ color: accentColor }}
                        >
                          {showFullNotes ? "Show Less" : "Read Full Notes"}
                        </button>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                {externalArticles.length > 0 ? (
                  <section className="border-t border-border/35 pt-6">
                    <p
                      className="text-[11px] uppercase tracking-[0.18em]"
                      style={{ color: accentColor }}
                    >
                      Public Articles
                    </p>

                    <div className="mt-6 space-y-8">
                      {reviewArticles.length > 0 ? (
                        <div>
                          <p className="text-sm text-foreground/45">Reviews and features</p>
                          <div className="mt-4 divide-y divide-border/30 border-y border-border/30">
                            {reviewArticles.map((article: any, index: number) => (
                              <a
                                key={`review-${article.url}-${index}`}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid gap-2 py-4 transition-colors hover:text-foreground"
                              >
                                <span className="text-[1rem] tracking-[-0.02em] text-foreground/82">
                                  {article.title || article.url}
                                </span>
                                {article.source ? (
                                  <span className="text-sm text-foreground/46">{article.source}</span>
                                ) : null}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {listingArticles.length > 0 ? (
                        <div>
                          <p className="text-sm text-foreground/45">Listings and press links</p>
                          <div className="mt-4 divide-y divide-border/30 border-y border-border/30">
                            {listingArticles.map((article: any, index: number) => (
                              <a
                                key={`listing-${article.url}-${index}`}
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="grid gap-2 py-4 transition-colors hover:text-foreground"
                              >
                                <span className="text-[0.96rem] tracking-[-0.02em] text-foreground/74">
                                  {article.title || article.url}
                                </span>
                                {article.source ? (
                                  <span className="text-sm text-foreground/44">{article.source}</span>
                                ) : null}
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </section>
                ) : null}

              </aside>
            </div>
          </AnimatedSection>
        </section>

        <div className="container max-w-6xl py-16">
          <Separator className="mb-12 bg-border/60" />

          {relatedProjectsFiltered.length > 0 ? (
            <AnimatedSection>
              <div>
                <h2 className="mb-8 text-sm font-semibold tracking-[0.22em] uppercase text-foreground/65">
                  {moreProjectsLabel}
                </h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {relatedProjectsFiltered.map((relatedProject, idx) => (
                    <Link key={relatedProject.id} href={getProjectPath(relatedProject)}>
                      <a className="group block">
                        <div className="relative aspect-[1/1] overflow-hidden rounded-xl bg-black/85">
                          {relatedProject.coverImageUrl ? (
                            <ProgressiveImage
                              src={relatedProject.coverImageUrl}
                              alt={relatedProject.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              aspectRatio="1/1"
                              smartPosition={true}
                              loading="lazy"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="pt-3">
                          <h3
                            className="text-[1.02rem] font-normal tracking-[-0.02em] transition-colors group-hover:text-foreground"
                            style={{ color: ACCENT_COLORS[idx % ACCENT_COLORS.length], transitionDuration: "180ms" }}
                          >
                            {relatedProject.title}
                          </h3>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ) : null}
        </div>
      </main>
      </div>

      <Footer />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNext={() => setLightboxIndex((prev) => Math.min(prev + 1, lightboxImages.length - 1))}
            onPrev={() => setLightboxIndex((prev) => Math.max(prev - 1, 0))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
