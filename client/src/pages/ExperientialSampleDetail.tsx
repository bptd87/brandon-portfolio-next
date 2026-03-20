import { AnimatedSection } from "@/components/AnimatedSection";
import Header from "@/components/Header";
import { Lightbox } from "@/components/Lightbox";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getVideoThumbnail } from "@/lib/videoUtils";
import {
  getLocalExperientialSampleBySlug,
  getLocalExperientialSampleHref,
  getLocalExperientialSamples,
  getLocalExperientialMediaItems,
  type LocalExperientialCategory,
} from "@shared/localPortfolios";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "wouter";

const CATEGORY_COPY: Record<LocalExperientialCategory, string> = {
  rendering:
    "Concept renderings built for review, alignment, and client-facing presentation before fabrication begins.",
  "technical-drawing":
    "Drafting and documentation samples built to translate creative direction into fabrication-ready information.",
  "live-events":
    "Installed experiential work shown in real venue conditions, where concept meets audience flow, schedule, and use.",
};

const CATEGORY_DETAIL_CONFIG: Record<
  LocalExperientialCategory,
  {
    heroFrameClass: string;
    thumbClass: string;
    imageClass: string;
    imageStageClass: string;
    heroImageClass: string;
  }
> = {
  rendering: {
    heroFrameClass: "overflow-hidden bg-black",
    thumbClass: "block w-full overflow-hidden text-left",
    imageClass: "aspect-[3/2] object-cover",
    imageStageClass: "bg-black",
    heroImageClass: "max-h-[62vh] w-full object-contain object-top",
  },
  "technical-drawing": {
    heroFrameClass: "overflow-hidden text-left",
    thumbClass: "block w-full overflow-hidden text-left",
    imageClass: "aspect-[3/2] object-contain",
    imageStageClass: "bg-white",
    heroImageClass: "h-full w-full object-contain",
  },
  "live-events": {
    heroFrameClass: "overflow-hidden bg-black",
    thumbClass: "block w-full overflow-hidden text-left",
    imageClass: "aspect-[3/2] object-cover",
    imageStageClass: "bg-black",
    heroImageClass: "max-h-[62vh] w-full object-contain object-top",
  },
};

function getYoutubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    return `https://www.youtube.com/embed/${parsed.searchParams.get("v") || url.split("/").pop()}`;
  } catch {
    return `https://www.youtube.com/embed/${url.split("/").pop()}`;
  }
}

export default function ExperientialSampleDetail() {
  const params = useParams<{ category: LocalExperientialCategory; slug: string }>();
  const [, setLocation] = useLocation();
  const category = params.category as LocalExperientialCategory;
  const slug = String(params.slug || "").trim().toLowerCase();

  const sample = getLocalExperientialSampleBySlug(category, slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryImages = useMemo(() => {
    if (!sample) return [];
    return getLocalExperientialMediaItems(sample);
  }, [sample]);
  const heroImage = useMemo(() => {
    if (!sample) return null;
    const fallbackAlt = sample.altText || sample.displayTitle;
    if (sample.imageUrl) {
      return {
        imageUrl: sample.imageUrl,
        altText: fallbackAlt,
        caption: "",
      };
    }
    return galleryImages[0] || null;
  }, [galleryImages, sample]);
  const detailGalleryImages = useMemo(() => {
    if (!heroImage) return galleryImages;
    return galleryImages.filter((image) => image.imageUrl !== heroImage.imageUrl);
  }, [galleryImages, heroImage]);
  const lightboxImages = useMemo(() => {
    const ordered = [];
    if (heroImage) ordered.push(heroImage);
    detailGalleryImages.forEach((image) => ordered.push(image));
    return ordered;
  }, [detailGalleryImages, heroImage]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || lightboxIndex !== null) return;
      setLocation("/projects/experiential");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, setLocation]);

  if (!sample) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="container flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 font-sans text-4xl tracking-[-0.05em]">Sample Not Found</h1>
            <Link
              href="/projects/experiential"
              className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm text-white/72 transition-colors hover:border-white/22 hover:text-white"
            >
              Back to Experiential
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryItems = getLocalExperientialSamples(category);
  const currentIndex = categoryItems.findIndex((item) => item.slug === sample.slug);
  const prevItem = currentIndex > 0 ? categoryItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < categoryItems.length - 1 ? categoryItems[currentIndex + 1] : null;
  const mediaPreview = sample.imageUrl || (sample.videoUrl ? getVideoThumbnail(sample.videoUrl) : "");
  const pageUrl = `https://www.brandonptdavis.com${getLocalExperientialSampleHref(sample)}`;
  const description = String(sample.description || "").trim() || CATEGORY_COPY[sample.category];
  const title = `${sample.displayTitle} | ${sample.categoryLabel} | Brandon PT Davis`;
  const categoryConfig = CATEGORY_DETAIL_CONFIG[sample.category];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={title}
        description={description}
        image={mediaPreview || undefined}
        type="website"
        url={pageUrl}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Experiential", url: "https://www.brandonptdavis.com/projects/experiential" },
          { name: sample.categoryLabel, url: `https://www.brandonptdavis.com/projects/experiential#${sample.category}` },
          { name: sample.displayTitle, url: pageUrl },
        ]}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: sample.displayTitle,
          description,
          image: mediaPreview || undefined,
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: sample.categoryLabel,
          mainEntityOfPage: pageUrl,
          url: pageUrl,
          dateCreated: sample.year ? `${sample.year}-01-01` : undefined,
        }}
      />
      <Header />

      {prevItem ? (
        <button
          onClick={() => setLocation(getLocalExperientialSampleHref(prevItem))}
          className="fixed left-5 top-1/2 z-50 hidden -translate-y-1/2 text-white/38 transition-colors hover:text-white/76 lg:block"
          aria-label={`Previous ${sample.categoryLabel.toLowerCase()} sample`}
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={1.55} />
        </button>
      ) : null}

      {nextItem ? (
        <button
          onClick={() => setLocation(getLocalExperientialSampleHref(nextItem))}
          className="fixed right-5 top-1/2 z-50 hidden -translate-y-1/2 text-white/38 transition-colors hover:text-white/76 lg:block"
          aria-label={`Next ${sample.categoryLabel.toLowerCase()} sample`}
        >
          <ArrowRight className="h-6 w-6" strokeWidth={1.55} />
        </button>
      ) : null}

      <div className="container max-w-6xl pb-20 pt-10 md:pt-12">
        <AnimatedSection>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
            <div className="space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/44">
                {sample.categoryLabel}
              </p>
              <div className="space-y-3">
                <h1 className="max-w-[10ch] font-sans text-[clamp(2.2rem,4.1vw,4.15rem)] font-medium leading-[0.92] tracking-[-0.06em] text-foreground">
                  {sample.displayTitle}
                </h1>
                <p className="max-w-[30rem] text-[clamp(0.98rem,1.1vw,1.08rem)] leading-[1.72] tracking-[-0.012em] text-foreground/64">
                  {description}
                  {sample.year ? ` ${sample.year}.` : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/projects/experiential"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[0.96rem] tracking-[-0.015em] text-foreground/72 transition-colors hover:border-white/20 hover:text-foreground"
                >
                  Back to Experiential
                </Link>
              </div>
            </div>

            {sample.videoUrl ? (
              <div className={categoryConfig.heroFrameClass}>
                <div className="aspect-video">
                  <iframe
                    className="h-full w-full"
                    src={getYoutubeEmbedUrl(sample.videoUrl)}
                    title={sample.displayTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : heroImage?.imageUrl ? (
              <button
                type="button"
                onClick={() => setLightboxIndex(0)}
                className={`block w-full text-left ${categoryConfig.heroFrameClass}`}
              >
                <div
                  className={`flex aspect-[3/2] items-center justify-center ${categoryConfig.imageStageClass} ${
                    sample.category === "technical-drawing" ? "" : "min-h-[18rem]"
                  }`}
                >
                  <img
                    src={heroImage.imageUrl}
                    alt={heroImage.altText}
                    className={categoryConfig.heroImageClass}
                  />
                </div>
              </button>
            ) : null}
          </div>
        </AnimatedSection>

        {detailGalleryImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 pt-6 md:grid-cols-3 lg:grid-cols-4">
            {detailGalleryImages.map((image, index) => (
              <AnimatedSection key={image.imageUrl}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index + 1)}
                  className={categoryConfig.thumbClass}
                >
                  <div className={`flex h-full w-full items-center justify-center ${categoryConfig.imageStageClass}`}>
                    <img
                      src={image.imageUrl}
                      alt={image.altText}
                      className={`w-full ${categoryConfig.imageClass}`}
                    />
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        ) : null}
      </div>

      {lightboxIndex !== null && lightboxImages.length > 0 ? (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((current) => (current === null ? 0 : Math.min(current + 1, lightboxImages.length - 1)))
          }
          onPrev={() => setLightboxIndex((current) => (current === null ? 0 : Math.max(current - 1, 0)))}
        />
      ) : null}
    </div>
  );
}
