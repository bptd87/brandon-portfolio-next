"use client";

import { Button } from "@/components/ui/button";
import { Check, ChevronDown, ChevronUp, Link2, Linkedin, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useMemo, useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";
import { getLocalRenderingGallery, getLocalRenderingProjectBySlug, getLocalRenderingProjects } from "@shared/localPortfolios";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

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
  const [linkCopied, setLinkCopied] = useState(false);
  const [isProjectDetailsOpen, setIsProjectDetailsOpen] = useState(false);

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
      })
      .slice(0, 6);
  }, [project.slug]);

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
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(
    `${project.title}\n\n${projectUrl || ""}`
  )}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(projectUrl || "")}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(projectUrl || "")}`;
  const renderingDescriptionParagraphs = [
    heroDescription,
    ...renderingBodySections.flatMap((section) => section.paragraphs),
  ].filter((paragraph, index, paragraphs): paragraph is string => {
    if (!paragraph) return false;
    return paragraphs.indexOf(paragraph) === index;
  });
  const portfolioNoteLinks = [
    scenicProjectHref && scenicProjectMatch
      ? {
          label: scenicProjectMatch.title,
          href: scenicProjectHref,
          meta: "Scenic Design Project",
        }
      : null,
    ...relatedArticles.slice(0, 2).map((article) => ({
      label: article.title,
      href: `/articles/${article.slug}`,
      meta: article.series?.name || article.categoryName,
    })),
  ].filter((item): item is { label: string; href: string; meta: string } => Boolean(item));
  const portfolioNoteSections = renderingBodySections.length
    ? renderingBodySections
    : [
        {
          heading: "Rendering Note",
          paragraphs: renderingDescriptionParagraphs,
        },
      ];

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
      event.preventDefault();
      router.push(isExperientialRendering ? "/projects/experiential" : "/projects/rendering");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExperientialRendering, router]);
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
      <main className="-mt-[64px] bg-[#111111] md:-mt-[74px]">
        <section className="relative bg-black text-white">
          <div className="relative flex h-[100svh] items-center justify-center overflow-hidden">
            {renderings[0] ? (
              <img
                src={renderings[0].imageUrl || ""}
                alt={renderings[0].altText || `${project.title} rendering`}
                className="site-media-square h-full w-full object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            ) : null}
          </div>
        </section>

        <section className="border-t border-white/10 bg-black px-[clamp(1.5rem,5vw,5.5rem)] py-5 text-white">
          <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[0.95rem] font-medium tracking-[-0.015em] text-white/68">
                {isExperientialRendering ? "Experiential Rendering" : "Rendering"}
              </p>
              <h1 className="mt-2 max-w-[14ch] font-sans text-[clamp(2.3rem,4.8vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">
                {project.title}
              </h1>
            </div>

            <nav aria-label="Share this rendering" className="flex items-center gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label={linkCopied ? "Rendering link copied" : "Copy rendering link"}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                </button>
                <a
                  href={emailShareUrl}
                  aria-label="Share rendering by email"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share rendering on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share rendering on Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  f
                </a>
              </nav>
          </header>
        </section>

        <section className="border-y border-white/12 bg-black px-[clamp(1.5rem,5vw,5.5rem)] text-white">
          <button
            type="button"
            onClick={() => setIsProjectDetailsOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-5 py-4 text-left text-[0.92rem] tracking-[-0.015em] text-white/72 transition-colors hover:text-white"
            aria-expanded={isProjectDetailsOpen}
            aria-controls="rendering-project-details"
          >
            <span>Details</span>
            <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-right">
              {project.client ? <span className="text-white/62">{project.client}</span> : null}
              {projectDateLabel ? <span className="text-white/38">{projectDateLabel}</span> : null}
              {isProjectDetailsOpen ? <ChevronUp className="h-4 w-4 text-white/48" /> : <ChevronDown className="h-4 w-4 text-white/48" />}
            </span>
          </button>

          {isProjectDetailsOpen ? (
            <div
              id="rendering-project-details"
              className="mx-auto grid w-full max-w-[88rem] gap-x-10 gap-y-10 border-t border-white/10 py-8 text-[0.92rem] leading-[1.38] tracking-[-0.018em] md:grid-cols-[minmax(24rem,1fr)_minmax(17rem,0.58fr)_minmax(14rem,0.46fr)] md:py-10"
            >
              <div className="text-[0.98rem] leading-[1.66] text-white md:text-[0.9rem] md:leading-[1.48]">
                <p className="mb-5 text-[0.96rem] font-medium tracking-[-0.02em] text-white">
                  Description
                </p>
                <div className="space-y-6 md:space-y-5">
                  {portfolioNoteSections.map((section, sectionIndex) => (
                    <div key={`${section.heading}-${sectionIndex}`} className="space-y-3.5 md:space-y-2.5">
                      <p className="font-medium text-white">{section.heading}</p>
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-5 text-[0.96rem] font-medium tracking-[-0.02em] text-white">
                  Project
                </p>
                <dl className="space-y-2.5">
                  <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-4">
                    <dt className="text-white/48">Format</dt>
                    <dd className="text-white/76">{isExperientialRendering ? "Experiential Rendering" : "Rendering"}</dd>
                  </div>
                  {project.client ? (
                    <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-4">
                      <dt className="text-white/48">Company</dt>
                      <dd className="text-white/76">{project.client}</dd>
                    </div>
                  ) : null}
                  {project.location ? (
                    <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-4">
                      <dt className="text-white/48">Location</dt>
                      <dd className="text-white/76">{project.location}</dd>
                    </div>
                  ) : null}
                  {projectDateLabel ? (
                    <div className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-4">
                      <dt className="text-white/48">Date</dt>
                      <dd className="text-white/76">{projectDateLabel}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div>
                {portfolioNoteLinks.length > 0 ? (
                  <>
                    <p className="mb-5 text-[0.96rem] font-medium tracking-[-0.02em] text-white">
                      Links
                    </p>
                    <div className="space-y-2.5">
                      {portfolioNoteLinks.map((item) => (
                        <Link key={item.href} href={item.href} className="block text-white/60 no-underline transition-colors hover:text-white">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          ) : null}
        </section>

        {renderings.length > 1 ? (
          <section className="bg-[#111111] [contain-intrinsic-size:1px_1400px] [content-visibility:auto]">
            <div className="grid grid-cols-1 border-t border-white/10 md:grid-cols-2">
              {renderings.slice(1).map((image) => (
                <figure key={image.id} className="border-b border-r border-white/10">
                  <div className="flex min-h-[70vh] items-center justify-center overflow-hidden bg-[#111111]">
                    <img
                      src={image.imageUrl || ""}
                      alt={image.altText || `${project.title} rendering`}
                      className="site-media-square h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {image.caption ? (
                    <figcaption className="p-4 text-[0.92rem] leading-6 tracking-[-0.01em] text-white/56">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        {moreRenderingProjects.length > 0 ? (
          <section className="border-t border-white/12 bg-[#111111] pt-16 text-white [contain-intrinsic-size:1px_960px] [content-visibility:auto] md:pt-24">
            <AnimatedSection>
              <div className="px-[clamp(1.5rem,5vw,6rem)] pb-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <h2 className="max-w-[12ch] font-sans text-[clamp(2.6rem,5.6vw,6rem)] font-medium leading-[0.88] tracking-[-0.07em] text-white">
                    More rendering.
                  </h2>
                  <Link
                    href="/projects/rendering"
                    className="inline-flex h-11 w-fit items-center justify-center rounded-full border border-white/18 px-5 font-sans text-sm font-medium tracking-[-0.02em] text-white/72 transition-colors hover:border-white/38 hover:text-white"
                  >
                    Rendering index
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 border-l border-white/12 md:grid-cols-4">
                  {moreRenderingProjects.map((item: any, index: number) => (
                    <Link
                      key={item.slug}
                      href={`${projectBasePath}/${item.slug}`}
                      className={`group block border-b border-r border-white/12 text-white ${
                        index % 6 < 2 ? "md:col-span-2" : ""
                      }`}
                    >
                        <div className="site-media-square relative aspect-[4/3] overflow-hidden rounded-none bg-[#181818]">
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={`${item.title} rendering preview image`}
                              className="site-media-square block h-full w-full rounded-none object-cover transition-opacity duration-500 group-hover:opacity-90"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : <div className="h-full w-full bg-muted" />}
                        </div>
                        <div className="min-h-[8.5rem] border-t border-white/12 p-[clamp(0.9rem,1.5vw,1.2rem)] text-white">
                          <h3 className="max-w-[18ch] font-sans text-[clamp(1.2rem,1.7vw,1.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white transition-colors group-hover:text-white/72">
                            {item.title}
                          </h3>
                          <p className="mt-2 max-w-[18ch] font-sans text-[0.94rem] leading-tight tracking-[-0.025em] text-white/52">
                            {[item.client, item.year].filter(Boolean).join("  ")}
                          </p>
                        </div>
                    </Link>
                  ))}
                </div>
            </AnimatedSection>
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
