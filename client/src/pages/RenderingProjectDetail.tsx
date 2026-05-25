"use client";

import { Button } from "@/components/ui/button";
import { Check, Link2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Lightbox } from "@/components/Lightbox";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatePresence } from "framer-motion";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUtcDate } from "@/lib/date-format";
import { getLocalRenderingGallery, getLocalRenderingProjectBySlug, getLocalRenderingProjects } from "@shared/localPortfolios";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import ScenicRenderingGallery from "@/components/ScenicRenderingGallery";

type RenderingProjectDetailProps = {
  slug?: string;
  currentPath?: string;
  params?: {
    slug?: string;
  };
};

function inferEncodingFormat(url: string): string | undefined {
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.webp')) return 'image/webp';
  if (cleanUrl.endsWith('.png')) return 'image/png';
  if (cleanUrl.endsWith('.avif')) return 'image/avif';
  if (cleanUrl.endsWith('.gif')) return 'image/gif';
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) return 'image/jpeg';
  return undefined;
}

export default function RenderingProjectDetail({
  slug: slugProp,
  currentPath,
  params,
}: RenderingProjectDetailProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const resolvedPath =
    currentPath ||
    pathname ||
    "/projects/rendering";
  const normalizedSlug = String(
    slugProp ||
      params?.slug ||
      pathname?.split("/").filter(Boolean).pop() ||
      ""
  )
    .trim()
    .toLowerCase();
  const isExperientialRendering = resolvedPath.startsWith("/projects/experiential/rendering");
  const isRenderingRoute = resolvedPath.startsWith("/projects/rendering");
  const projectBasePath = isExperientialRendering
    ? "/projects/experiential/rendering"
    : isRenderingRoute
      ? "/projects/rendering"
      : "/projects";
  const project = getLocalRenderingProjectBySlug(normalizedSlug);
  const scenicProjects = getLocalScenicProjects();

  const projectUrl = project ? `https://www.brandonptdavis.com${projectBasePath}/${project.slug}` : undefined;
  const projectUpdatedDate = project?.updatedAt
    ? new Date(project.updatedAt).toISOString().split('T')[0]
    : undefined;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Not Found</h2>
          <Link href="/projects/rendering">
            <Button variant="outline">Back to Renderings</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = project.images || [];
  const renderings = images.length > 0
    ? images
    : project.coverImageUrl
      ? [{
          id: -1,
          imageUrl: project.coverImageUrl,
          altText: project.title,
          caption: "",
          sortOrder: 0,
        }]
      : [];

  // Parse tags for SEO (invisible)
  const tags = project.seoKeywords?.split(',').map(t => t.trim()).filter(Boolean) || [];

  const scenicProjectMatch =
    scenicProjects.find((entry) => {
      const sameTitle = entry.title.trim().toLowerCase() === project.title.trim().toLowerCase();
      if (!sameTitle) return false;
      const projectClient = String(project.client || "").trim().toLowerCase();
      const scenicClient = String(entry.client || "").trim().toLowerCase();
      if (projectClient && scenicClient && projectClient !== scenicClient) return false;
      if (project.year && entry.year && project.year !== entry.year) return false;
      return true;
    }) || null;
  const scenicProjectHref = scenicProjectMatch ? `/project/${scenicProjectMatch.slug}` : null;
  const relatedArticles = useMemo(() => {
    if (!scenicProjectMatch) return [];
    return getLocalArticles()
      .filter((article) => (article.linkedScenicProjectSlugs || []).includes(scenicProjectMatch.slug))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 2);
  }, [scenicProjectMatch]);
  const moreRenderingProjects = useMemo(() => {
    const getProjectTimestamp = (item: any) => {
      if (item.year) {
        const month = item.month && item.month >= 1 && item.month <= 12 ? item.month - 1 : 0;
        return new Date(item.year, month, 1).getTime();
      }
      const explicitDate = item.updatedAt || item.publishedAt || item.createdAt;
      if (explicitDate) return new Date(explicitDate).getTime();
      return 0;
    };

    const projects = getLocalRenderingProjects().filter((item) => !item.galleryOnly);
    const galleryItems = getLocalRenderingGallery();

    const galleryDisplayItems = galleryItems
      .map((item) => item.project)
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const galleryProjectIds = new Set(galleryDisplayItems.map((item) => item.id));
    const featuredDisplayItems = projects.filter((entry) => !galleryProjectIds.has(entry.id));

    return [...featuredDisplayItems, ...galleryDisplayItems]
      .filter((item) => item.slug !== project.slug)
      .sort((a, b) => {
        const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
        if (timeCompare !== 0) return timeCompare;
        return a.title.localeCompare(b.title);
      });
  }, [project.slug]);

  // Prepare lightbox images
  const lightboxImages = renderings.map(img => ({
    imageUrl: img.imageUrl,
    caption: img.caption,
    altText: img.altText
  }));

  const heroDescription = (() => {
    const customHeroExcerpt = String(project.heroExcerpt || "").trim();
    if (customHeroExcerpt) return customHeroExcerpt;
    const excerpt = String(project.excerpt || "").trim();
    if (!excerpt) return "";
    const firstSentenceMatch = excerpt.match(/^.+?[.!?](?=\s|$)/);
    return (firstSentenceMatch?.[0] || excerpt).trim();
  })();

  const renderingBodySections = useMemo(() => {
    if (project.bodySections?.length) return project.bodySections;

    const paragraphs = String(project.designNotes || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    if (paragraphs.length === 0) return [];

    const headingPool = [
      "Spatial Premise",
      "World and Atmosphere",
      "Material and Tone",
      "Composition and Focus",
      "Story Through Image",
      "How the Space Operates",
      "Mood, Scale, and Detail",
      "Rendering as Communication",
    ];

    const sectionCount = Math.max(1, Math.ceil(paragraphs.length / 2));
    const scenicHeadings =
      scenicProjectMatch?.sections
        .filter((section): section is Extract<typeof scenicProjectMatch.sections[number], { type: "text" }> => section.type === "text")
        .map((section) => section.heading?.trim())
        .filter((heading): heading is string => Boolean(heading))
        .slice(0, sectionCount) || [];

    return Array.from({ length: sectionCount }, (_, index) => {
      const start = index * 2;
      return {
        heading: scenicHeadings[index] || headingPool[index] || `Section ${index + 1}`,
        paragraphs: paragraphs.slice(start, start + 2),
      };
    });
  }, [scenicProjectMatch, project.bodySections, project.designNotes]);

  const projectDateLabel = project.year
    ? project.month && project.month >= 1 && project.month <= 12
      ? `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][project.month - 1]} ${project.year}`
      : `${project.year}`
    : null;

  // Generate SEO-optimized description from excerpt or designNotes
  const seoDescription = project.excerpt || project.designNotes?.substring(0, 160) ||
    `${project.title} - Architectural rendering by Brandon PT Davis`;

  const projectImages = renderings
    .filter((img) => !!img.imageUrl)
    .slice(0, 20)
    .map((img, index) => ({
      type: 'ImageObject' as const,
      contentUrl: img.imageUrl || '',
      caption: img.caption || undefined,
      name: img.altText || img.caption || `${project.title} rendering ${index + 1}`,
      description: img.caption || seoDescription,
      thumbnailUrl: img.imageUrl || undefined,
      encodingFormat: img.imageUrl ? inferEncodingFormat(img.imageUrl) : undefined,
    }));

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const imageIndexById = new Map(renderings.map((item, index) => [String(item.id), index]));

  const openLightboxFor = (mediaId: string) => {
    const index = imageIndexById.get(mediaId);
    if (index === undefined) return;
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < lightboxImages.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  const handleCopyLink = async () => {
    const copied = await copyTextToClipboard(projectUrl || "");
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (lightboxIndex !== null) return;
      event.preventDefault();
      router.push(isExperientialRendering ? "/projects/experiential" : "/projects/rendering");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExperientialRendering, lightboxIndex, router]);
  const renderingSeoTitle = `${project.title} Rendering${project.client ? ` | ${project.client}` : ""} | Brandon PT Davis`;
  const renderingSeoKeywords = Array.from(
    new Set(
      [
        ...tags,
        project.client,
        project.location,
        project.title,
        isExperientialRendering ? "experiential rendering" : "scenic rendering",
        "Brandon PT Davis",
      ].filter(Boolean)
    )
  ).join(", ");

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={renderingSeoTitle}
        description={seoDescription}
        image={project.coverImageUrl || undefined}
        imageAlt={renderings[0]?.altText || `${project.title} rendering`}
        type="website"
        keywords={renderingSeoKeywords}
        url={projectUrl}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          ...(isExperientialRendering
            ? [
                { name: "Experiential", url: "https://www.brandonptdavis.com/projects/experiential" },
                { name: "Rendering", url: "https://www.brandonptdavis.com/projects/experiential/rendering" },
              ]
            : [{ name: "Rendering", url: "https://www.brandonptdavis.com/projects/rendering" }]),
          { name: project.title, url: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}` },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: project.title,
          description: seoDescription,
          image: project.coverImageUrl || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          dateCreated: project.year ? `${project.year}-01-01` : undefined,
          datePublished: project.publishedAt ? new Date(project.publishedAt).toISOString().split('T')[0] : undefined,
          dateModified: projectUpdatedDate,
          genre: "Architectural Rendering",
          keywords: renderingSeoKeywords.split(", ").filter(Boolean),
          mainEntityOfPage: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}`,
          url: projectUrl || `https://www.brandonptdavis.com/project/${project.slug}`,
          workExample: projectImages.length > 0 ? projectImages : undefined,
          isPartOf: {
            name: isExperientialRendering ? "Experiential Rendering Portfolio" : "Rendering Portfolio",
            url: isExperientialRendering
              ? "https://www.brandonptdavis.com/projects/experiential/rendering"
              : "https://www.brandonptdavis.com/projects/rendering",
          },
          mentions: [
            ...(scenicProjectMatch
              ? [
                  {
                    type: "CreativeWork",
                    name: scenicProjectMatch.title,
                    url: `https://www.brandonptdavis.com/project/${scenicProjectMatch.slug}`,
                  },
                ]
              : []),
            ...relatedArticles.map((article) => ({
              type: "Article",
              name: article.title,
              url: `https://www.brandonptdavis.com/articles/${article.slug}`,
            })),
          ],
        }}
      />
      <Header />
      <main className="pb-20">
        <section className="px-6 pt-12 md:px-10 md:pt-16">
          <AnimatedSection>
            <header className="mx-auto flex w-full max-w-[62rem] flex-col items-center text-center">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.98rem] tracking-[-0.02em] text-white/56">
                {projectDateLabel ? <span>{projectDateLabel}</span> : null}
                <span>{isExperientialRendering ? "Experiential Rendering" : "Rendering"}</span>
              </div>
              <h1 className="mt-8 max-w-[12ch] font-sans text-[clamp(3rem,7vw,6.4rem)] font-normal leading-[0.9] tracking-[-0.07em] text-white">
                {project.title}
              </h1>
              {heroDescription ? (
                <p className="mt-8 max-w-[42rem] text-[clamp(1.08rem,1.5vw,1.36rem)] leading-[1.72] tracking-[-0.02em] text-white/68">
                  {heroDescription}
                </p>
              ) : null}
            </header>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10 md:pt-10">
          <AnimatedSection>
            <div className="mx-auto w-full max-w-[62rem]">
              {renderings[0] ? (
                <div className="cursor-pointer overflow-hidden bg-black" onClick={() => openLightbox(0)}>
                  <ProgressiveImage
                    src={renderings[0].imageUrl || ""}
                    alt={renderings[0].altText || `${project.title} rendering`}
                    className="block w-full max-h-[min(74vh,48rem)] object-contain"
                    objectFit="contain"
                    loading="eager"
                    fetchPriority="high"
                    sizes="(max-width: 768px) 100vw, 62rem"
                  />
                </div>
              ) : null}
            </div>
          </AnimatedSection>
        </section>

        <section className="px-6 pt-8 md:px-10">
          <AnimatedSection>
            <div className="mx-auto flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 py-4 text-white/72">
              <div className="flex flex-wrap items-center gap-5">
                {project.client ? (
                  <span className="text-[0.98rem] tracking-[-0.02em]">{project.client}</span>
                ) : null}
                {project.location ? (
                  <span className="text-[0.98rem] tracking-[-0.02em] text-white/56">{project.location}</span>
                ) : null}
              </div>
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-white"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  <span>{linkCopied ? "Link copied" : "Share"}</span>
                </button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        <section className="container max-w-5xl pt-14 md:pt-18">
          <div className="mx-auto max-w-[54rem] space-y-24 md:space-y-32">
            {renderingBodySections.length > 0 ? (
              <AnimatedSection>
                <div className="space-y-16 md:space-y-20">
                  {renderingBodySections.map((section, index) => (
                    <div key={`${section.heading}-${index}`} className="space-y-5">
                      <h2 className="font-sans text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">
                        {section.heading}
                      </h2>
                      <div className="space-y-8">
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <p
                            key={`${section.heading}-${paragraphIndex}`}
                            className="text-[1.03rem] leading-[1.9] tracking-[-0.01em] text-white/72"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            ) : null}

            {renderings.length > 1 ? (
              <AnimatedSection>
                <ScenicRenderingGallery
                  items={renderings.slice(1).map((image) => ({
                    id: String(image.id),
                    imageUrl: image.imageUrl || "",
                    altText: image.altText || `${project.title} rendering`,
                    caption: image.caption || undefined,
                  }))}
                  onOpen={openLightboxFor}
                  visibleCount={2}
                />
              </AnimatedSection>
            ) : null}

          </div>
        </section>

        {(relatedArticles.length > 0 || (scenicProjectHref && scenicProjectMatch)) ? (
          <section className="container max-w-[88rem] pt-18 md:pt-24">
            <AnimatedSection>
              <div>
                <div className="mb-12 h-px w-full bg-border/60" />
                {relatedArticles.length > 0 ? (
                  <div className="mb-14">
                    <p className="mb-8 font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                      Related Reading
                    </p>
                    <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
                      {relatedArticles.map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`} className="group flex items-start gap-5">
                          <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
                            {article.coverImageUrl ? (
                              <ProgressiveImage
                                src={article.coverImageUrl}
                                alt={article.coverImageAlt || `${article.title} article cover image`}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                sizes="9rem"
                              />
                            ) : null}
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.08)_0%,rgba(22,64,133,0.16)_55%,rgba(10,18,38,0.42)_100%)]" />
                          </div>
                          <div className="min-w-0 pt-1">
                            <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                              {article.title}
                            </h3>
                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                              <span>{article.series?.name || article.categoryName}</span>
                              <span>{formatUtcDate(article.publishedAt, "short")}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
                {scenicProjectHref && scenicProjectMatch ? (
                <div className="grid gap-x-12 gap-y-8 md:grid-cols-1">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <p className="font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                      Scenic Design Project
                    </p>
                  </div>
                    <Link href={scenicProjectHref} className="group flex items-start gap-5">
                      <div className="relative h-36 w-36 flex-none overflow-hidden bg-black/85">
                        {scenicProjectMatch.coverImageUrl ? (
                          <ProgressiveImage
                            src={scenicProjectMatch.coverImageUrl}
                            alt={`${scenicProjectMatch.title} scenic design project cover image`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            sizes="9rem"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,31,71,0.18)_0%,rgba(22,64,133,0.42)_55%,rgba(10,18,38,0.74)_100%)]" />
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="text-[1.22rem] leading-[1.18] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                          {scenicProjectMatch.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                          <span>Scenic Design Project</span>
                          {scenicProjectMatch.client ? <span>{scenicProjectMatch.client}</span> : null}
                          {scenicProjectMatch.year ? <span>{scenicProjectMatch.year}</span> : null}
                        </div>
                      </div>
                    </Link>
                </div>
                ) : null}
              </div>
            </AnimatedSection>
          </section>
        ) : null}

        {moreRenderingProjects.length > 0 ? (
          <section className="container max-w-[88rem] pt-18 md:pt-24">
            <AnimatedSection>
              <div>
                <div className="mb-12 h-px w-full bg-border/60" />
                <p className="mb-8 font-sans text-[1.15rem] tracking-[-0.02em] text-white">
                  All Renderings
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {moreRenderingProjects.map((item: any) => (
                    <Link key={item.id} href={`${projectBasePath}/${item.slug}`} className="group block">
                        <div className="relative aspect-[1/1] overflow-hidden bg-black/85">
                          {item.coverImageUrl ? (
                            <ProgressiveImage
                              src={item.coverImageUrl}
                              alt={`${item.title} rendering preview image`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : <div className="h-full w-full bg-muted" />}
                        </div>
                        <div className="pt-3">
                          <h3 className="text-[1.02rem] font-normal tracking-[-0.02em] text-white/88 transition-colors group-hover:text-white">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-[0.92rem] tracking-[-0.01em] text-white/52">
                            {[item.client, item.year].filter(Boolean).join("  ")}
                          </p>
                        </div>
                    </Link>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </section>
        ) : null}
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={lightboxImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
}
