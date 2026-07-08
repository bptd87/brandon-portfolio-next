"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import {
  getProjectArtifactCollectionBySlug,
  PROJECT_ARTIFACT_CATEGORY_LABELS,
  type ProjectArtifactItem,
} from "@shared/projectArtifacts";

type ProjectArtifactDetailProps = {
  slug?: string;
};

function isDocumentArtifact(item: ProjectArtifactItem) {
  return item.category !== "research";
}

function getArtifactFrameClass(item: ProjectArtifactItem) {
  return isDocumentArtifact(item)
    ? "flex h-full w-full items-center justify-center overflow-hidden bg-white p-[clamp(0.2rem,0.45vw,0.4rem)]"
    : "h-full w-full overflow-hidden bg-white";
}

function getArtifactImageClass(item: ProjectArtifactItem) {
  return isDocumentArtifact(item)
    ? "block h-full w-full object-contain object-center transition-opacity duration-500 group-hover:opacity-90"
    : "block h-full w-full object-cover object-center transition-opacity duration-500 group-hover:opacity-90";
}

export default function ProjectArtifactDetail({ slug = "the-glass-menagerie" }: ProjectArtifactDetailProps) {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const collection = getProjectArtifactCollectionBySlug(slug);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const lightboxScrollRef = useRef<HTMLDivElement | null>(null);
  const activeItem = activeIndex === null || !collection ? null : collection.items[activeIndex] || null;
  const categories = useMemo(
    () =>
      collection
        ? [...new Set(collection.items.map((item) => PROJECT_ARTIFACT_CATEGORY_LABELS[item.category]))]
        : [],
    [collection]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let isInsideFrame = false;

    try {
      isInsideFrame = window.self !== window.top;
    } catch {
      isInsideFrame = true;
    }

    setIsEmbedded(params.get("embedded") === "1" || isInsideFrame);
  }, []);

  useEffect(() => {
    if (!activeItem) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (!collection) return;
      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index === null ? 0 : (index + 1) % collection.items.length));
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === null ? 0 : (index - 1 + collection.items.length) % collection.items.length
        );
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeItem, collection]);

  useEffect(() => {
    if (!activeItem || activeIndex === null) return;

    window.requestAnimationFrame(() => {
      const selectedImage = lightboxScrollRef.current?.querySelector<HTMLElement>(
        `[data-lightbox-index="${activeIndex}"]`
      );
      selectedImage?.scrollIntoView({ block: "nearest", inline: "center" });
    });
  }, [activeItem, activeIndex]);

  if (!collection) {
    return (
      <div className="min-h-screen px-6 py-24" style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}>
        Artifact collection not found.
      </div>
    );
  }

  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const portfolioLandingHref = "/projects/scenic-design";

  return (
    <div className="flex min-h-screen flex-col transition-colors duration-500" style={pageStyle}>
      <SEO
        title={`${collection.projectTitle} Artifacts | Scenic Design Process`}
        description={collection.summary}
        url={`https://www.brandonptdavis.com/projects/artifacts/${collection.slug}`}
        image={collection.coverImageUrl}
      />
      {!isEmbedded ? <Header /> : null}
      {isEmbedded ? (
        <a
          href={portfolioLandingHref}
          target="_top"
          aria-label={`Close ${collection.projectTitle} artifacts and return to the scenic design portfolio`}
          className="fixed right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[80] inline-flex h-11 w-11 items-center justify-center rounded-full shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
          style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </a>
      ) : null}
      <main className="relative z-10 flex-1" style={{ backgroundColor: homeTheme.bg }}>
        <section
          className={[
            "px-[clamp(2rem,8vw,9rem)] pb-[clamp(2.25rem,5vw,3.5rem)]",
            isEmbedded ? "pt-[clamp(3rem,7vw,5.5rem)]" : "pt-[clamp(8rem,12vw,10.5rem)]",
          ].join(" ")}
        >
          <header className="mx-auto w-full max-w-[56rem] text-center">
            {!isEmbedded ? (
              <Link
                href="/projects/artifacts"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 text-[0.72rem] font-black uppercase tracking-[0.18em] no-underline transition-opacity hover:opacity-70"
                style={{ color: homeTheme.muted }}
              >
                <ArrowUp className="h-[0.72rem] w-[0.72rem] stroke-[3]" aria-hidden="true" />
                Artifacts
              </Link>
            ) : null}
              <h1
              className="mx-auto mt-3 max-w-[12ch] text-balance text-[clamp(3.2rem,7vw,6.8rem)] font-black uppercase leading-[0.84] tracking-[0]"
                style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
              >
                {collection.projectTitle}
              </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-[clamp(1rem,1.35vw,1.2rem)] font-medium leading-[1.45]" style={{ color: homeTheme.muted }}>
                {collection.summary}
              </p>
            <p className="mx-auto mt-5 text-[0.72rem] font-black uppercase tracking-[0.16em]" style={{ color: homeTheme.muted }}>
                {categories.join(" / ")}
              </p>
          </header>
        </section>

        <section className="px-[clamp(1.5rem,7vw,8rem)] pb-[clamp(5rem,9vw,8rem)]">
          <div className="mx-auto w-full max-w-[76rem]">
            {collection.items[0] ? (
              <figure className="mb-[clamp(1rem,2vw,1.6rem)]">
                <button
                  type="button"
                  onClick={() => setActiveIndex(0)}
                  className="group block aspect-[16/9] w-full overflow-hidden rounded-[1.35rem] bg-white text-left shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/40"
                >
                  <div className={getArtifactFrameClass(collection.items[0])}>
                    <img
                      src={collection.items[0].imageUrl}
                      alt={collection.items[0].altText}
                      className={getArtifactImageClass(collection.items[0])}
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                </button>
              </figure>
            ) : null}
            <div className="grid grid-cols-1 gap-[clamp(1rem,2vw,1.6rem)] md:grid-cols-2">
          {collection.items.slice(1).map((item, itemIndex) => {
            const index = itemIndex + 1;
            return (
            <figure key={item.id}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                  className="group block aspect-[3/2] w-full overflow-hidden rounded-[1.35rem] bg-white text-left shadow-[0_1.4rem_4rem_rgba(0,0,0,0.16)] focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-black/40"
              >
                <div className={getArtifactFrameClass(item)}>
                <img
                  src={item.imageUrl}
                  alt={item.altText}
                    className={getArtifactImageClass(item)}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
                </div>
              </button>
            </figure>
            );
          })}
            </div>
          </div>
          {!isEmbedded ? (
            <div className="mx-auto mt-[clamp(3rem,6vw,5rem)] flex w-full max-w-[76rem] justify-center">
            <Link
              href={portfolioLandingHref}
              className="inline-flex flex-col items-center gap-1 rounded-full px-5 py-3 text-center text-[0.95rem] font-black uppercase tracking-[0.06em] no-underline transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
            >
              Back to portfolio
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          ) : null}
        </section>
      </main>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/58 p-[clamp(0.75rem,2vw,1.5rem)] backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} artifact`}
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            className="absolute right-[clamp(1rem,2.6vw,2rem)] top-[clamp(1rem,2.6vw,2rem)] z-[122] inline-flex h-11 w-11 items-center justify-center rounded-full text-[1.45rem] shadow-[0_1rem_2.5rem_rgba(0,0,0,0.18)] transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
            onClick={() => setActiveIndex(null)}
            aria-label="Close artifact"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="relative h-full w-full overflow-hidden rounded-[1.65rem] shadow-[0_2rem_6rem_rgba(0,0,0,0.28)]"
            style={{ backgroundColor: homeTheme.bg }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              ref={lightboxScrollRef}
              className="flex h-full snap-x snap-mandatory items-center gap-[clamp(1.25rem,4vw,4rem)] overflow-x-auto overflow-y-hidden px-[clamp(1.5rem,7vw,8rem)] py-[clamp(3.5rem,7vh,6rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {collection.items.map((item, index) => (
                <figure
                  key={item.id}
                  data-lightbox-index={index}
                  className="flex h-full min-w-[min(82vw,72rem)] snap-center items-center justify-center"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.altText}
                    className="max-h-full w-auto max-w-full rounded-[1.1rem] object-contain"
                    draggable={false}
                  />
                </figure>
              ))}
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
