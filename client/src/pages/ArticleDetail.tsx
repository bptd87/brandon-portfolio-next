"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PublishingTopBar } from "@/components/PublishingTopBar";
import { AnimatedSection } from "@/components/AnimatedSection";
import MotionReveal from "@/components/MotionReveal";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { proxyImageUrl } from "@/lib/imageProxy";
import {
  Sparkles,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Play,
  Pause,
  ArrowUpRight,
  Mail,
  Linkedin,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { SEO } from "@/components/SEO";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUtcDate } from "@/lib/date-format";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import {
  getLocalArticleRecordBySlug,
  getLocalArticles,
} from "@shared/localArticles";
import {
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalScenicProjectBySlug } from "@shared/localScenicProjects";
import DeferredYouTubeEmbed from "@/components/DeferredYouTubeEmbed";

const Lightbox = dynamic(
  () => import("@/components/Lightbox").then(mod => mod.Lightbox),
  {
    ssr: false,
  }
);

const AUTHOR_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
  hellip: "...",
  ndash: "-",
  mdash: "-",
  lsquo: "'",
  rsquo: "'",
  ldquo: '"',
  rdquo: '"',
};

// Decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  if (!text) return "";

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  return text
    .replace(/&#(\d+);/g, (_, value) => {
      const code = Number.parseInt(value, 10);
      return Number.isNaN(code) ? _ : String.fromCodePoint(code);
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => {
      const code = Number.parseInt(value, 16);
      return Number.isNaN(code) ? _ : String.fromCodePoint(code);
    })
    .replace(
      /&([a-z]+);/gi,
      (entity, name) => NAMED_HTML_ENTITIES[name.toLowerCase()] ?? entity
    );
};

const normalizeQuoteText = (text: string): string => {
  const decoded = decodeHTMLEntities(text || "").trim();
  return decoded.replace(/^["“”']+|["“”']+$/g, "").trim();
};

const getArticleMediaUrl = (url: string): string => {
  if (!url) return url;
  if (url.startsWith("/") || url.includes("blob.vercel-storage.com")) {
    return url;
  }
  return proxyImageUrl(url, 1920);
};

const getHtmlTextContent = (html: string): string => {
  if (!html) return "";

  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || "";
  }

  return decodeHTMLEntities(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|blockquote|section|article)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const MIN_TUTORIAL_UPDATED_DATE = new Date(
  "2025-05-01T00:00:00.000Z"
).getTime();

const getDisplayUpdatedDate = (
  dateString: string | Date | null | undefined
) => {
  const timestamp = dateString ? new Date(dateString).getTime() : Number.NaN;
  return new Date(
    Number.isFinite(timestamp)
      ? Math.max(timestamp, MIN_TUTORIAL_UPDATED_DATE)
      : MIN_TUTORIAL_UPDATED_DATE
  ).toISOString();
};

const getImageAttribute = (tag: string, name: string) => {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  if (match) return match[2];

  const unquoted = tag.match(new RegExp(`${name}\\s*=\\s*([^\\s>]+)`, "i"));
  return unquoted?.[1] || null;
};

const removeImageAttribute = (tag: string, name: string) =>
  tag.replace(
    new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "gi"),
    ""
  );

const setImageAttribute = (tag: string, name: string, value: string) => {
  const escapedValue = value.replace(/"/g, "&quot;");
  if (new RegExp(`\\s${name}\\s*=`, "i").test(tag)) {
    return tag.replace(
      new RegExp(`\\s${name}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "i"),
      ` ${name}="${escapedValue}"`
    );
  }
  return tag.replace(/^<img/i, `<img ${name}="${escapedValue}"`);
};

// Process HTML content to proxy external images
const processHTMLImages = (html: string): string => {
  if (!html) return html;

  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;

    // Find all img tags and proxy their source attrs
    const images = div.querySelectorAll("img");
    images.forEach(img => {
      const src =
        img.getAttribute("src") ||
        img.getAttribute("data-src") ||
        img.getAttribute("data-lazy-src");
      const srcset =
        img.getAttribute("srcset") || img.getAttribute("data-srcset");

      if (src) {
        img.setAttribute("src", getArticleMediaUrl(src));
      } else if (srcset) {
        // Safari-safe fallback: use first candidate URL as src if src is missing.
        const firstCandidate = srcset
          .split(",")
          .map(entry => entry.trim().split(/\s+/)[0])
          .find(Boolean);
        if (firstCandidate) {
          img.setAttribute("src", getArticleMediaUrl(firstCandidate));
        }
      }

      // Prevent malformed legacy srcset strings from breaking image selection.
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.removeAttribute("width");
      img.removeAttribute("height");
      img.removeAttribute("style");
      img.removeAttribute("data-image-dimensions");
    });

    return div.innerHTML;
  }

  return html.replace(/<img\b[^>]*>/gi, tag => {
    const src =
      getImageAttribute(tag, "src") ||
      getImageAttribute(tag, "data-src") ||
      getImageAttribute(tag, "data-lazy-src");
    const srcset =
      getImageAttribute(tag, "srcset") || getImageAttribute(tag, "data-srcset");

    let nextTag = removeImageAttribute(
      removeImageAttribute(tag, "srcset"),
      "sizes"
    );
    if (src) {
      nextTag = setImageAttribute(nextTag, "src", getArticleMediaUrl(src));
      return nextTag;
    }

    if (srcset) {
      const firstCandidate = srcset
        .split(",")
        .map(entry => entry.trim().split(/\s+/)[0])
        .find(Boolean);
      if (firstCandidate) {
        nextTag = setImageAttribute(
          nextTag,
          "src",
          getArticleMediaUrl(firstCandidate)
        );
      }
    }

    return nextTag;
  });
};

type ArticleDetailProps = {
  slug?: string;
  article?: ReturnType<typeof getLocalArticleRecordBySlug>;
  variant?: "article" | "tutorial";
  params?: {
    slug?: string;
  };
};

export default function ArticleDetail({
  slug,
  article,
  variant,
}: ArticleDetailProps = {}) {
  return (
    <ArticleDetailContent slug={slug} article={article} variant={variant} />
  );
}

function getArticleVideoMimeType(url: string) {
  const normalizedUrl = url.toLowerCase().split("?")[0] || "";
  if (normalizedUrl.endsWith(".mov")) return undefined;
  if (normalizedUrl.endsWith(".m4v")) return "video/x-m4v";
  return "video/mp4";
}

function isArticleInlineVideoUrl(url: string) {
  const normalizedUrl = url.toLowerCase().split("?")[0] || "";
  return [".mp4", ".m4v", ".mov"].some(extension =>
    normalizedUrl.endsWith(extension)
  );
}

function ArticleInlineVideo({
  url,
  caption,
}: {
  url: string;
  caption?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.loop = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("autoplay", "");

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          try {
            await videoRef.current.play();
            setIsPlaying(true);
          } catch {
            setIsPlaying(false);
          }
          return;
        }

        videoRef.current.pause();
        setIsPlaying(false);
      },
      {
        threshold: [0, 0.25, 0.55, 0.8],
      }
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const handleToggle = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  return (
    <figure className="article-inline-video my-16">
      <div
        ref={frameRef}
        className="group relative mx-auto max-w-[64rem] overflow-hidden bg-transparent"
      >
        <video
          ref={videoRef}
          className="aspect-[16/9] h-auto w-full bg-black object-contain"
          autoPlay
          playsInline
          muted
          loop
          preload="metadata"
          controls
        >
          <source src={url} type={getArticleVideoMimeType(url)} />
        </video>
        <button
          type="button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          onClick={handleToggle}
          className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/40 text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:border-white/24 hover:text-white"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" />
          )}
        </button>
      </div>
      {caption && (
        <figcaption className="mx-auto mt-4 max-w-[46rem] text-center text-[0.88rem] italic leading-6 text-white/58">
          {decodeHTMLEntities(caption)}
        </figcaption>
      )}
    </figure>
  );
}

function ArticleImageCompare({ section }: { section: any }) {
  const [divider, setDivider] = useState(50);
  const beforeLabel = decodeHTMLEntities(section.beforeLabel || "Before");
  const afterLabel = decodeHTMLEntities(section.afterLabel || "After");
  const isNested = section.nested === true;

  return (
    <section
      className={
        isNested
          ? "my-10"
          : "relative left-1/2 my-16 w-screen max-w-[76rem] -translate-x-1/2 px-5 sm:px-6"
      }
    >
      <div className={isNested ? "max-w-[62rem]" : "mx-auto max-w-[62rem]"}>
        {section.eyebrow && (
          <p className="mb-4 text-center text-[0.74rem] font-semibold uppercase tracking-[0.28em] text-white/36">
            {decodeHTMLEntities(section.eyebrow)}
          </p>
        )}
        {section.title && (
          <h2 className="mx-auto mb-5 max-w-[44rem] text-center font-sans text-[clamp(2rem,3vw,3.05rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
            {decodeHTMLEntities(section.title)}
          </h2>
        )}
        {section.intro && (
          <p className="mx-auto mb-8 max-w-[44rem] text-center text-[1.02rem] leading-8 tracking-[-0.015em] text-white/66">
            {decodeHTMLEntities(section.intro)}
          </p>
        )}

        <div className="relative overflow-hidden border border-white/10 bg-white/[0.03]">
          <div className="relative aspect-[16/9]">
            <img
              src={getArticleMediaUrl(section.afterUrl)}
              alt={section.afterAlt || afterLabel}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <img
              src={getArticleMediaUrl(section.beforeUrl)}
              alt={section.beforeAlt || beforeLabel}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              style={{ clipPath: `inset(0 ${100 - divider}% 0 0)` }}
            />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between p-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white/86">
              <span className="rounded-full bg-black/48 px-3 py-1 backdrop-blur">
                {beforeLabel}
              </span>
              <span className="rounded-full bg-black/48 px-3 py-1 backdrop-blur">
                {afterLabel}
              </span>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 w-px bg-white/90 shadow-[0_0_22px_rgba(255,255,255,0.45)]"
              style={{ left: `${divider}%` }}
            >
              <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/40 bg-black/72 text-white shadow-2xl">
                <span className="h-3 w-px bg-white/70" />
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={divider}
              aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
              onChange={event => setDivider(Number(event.target.value))}
              className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleSettingStep({
  section,
  onImageClick,
}: {
  section: any;
  onImageClick?: () => void;
}) {
  const paragraphs = Array.isArray(section.paragraphs)
    ? section.paragraphs
    : [];

  return (
    <section className="relative left-1/2 my-10 w-screen max-w-[74rem] -translate-x-1/2 px-5 sm:px-6">
      <div className="mx-auto grid max-w-[62rem] gap-8 border-t border-white/10 pt-10 md:grid-cols-[minmax(15rem,23rem)_minmax(0,1fr)] md:items-start">
        <figure>
          <ProgressiveImage
            src={getArticleMediaUrl(section.imageUrl)}
            alt={section.imageAlt || section.caption || section.title || ""}
            loading="lazy"
            enableScrollAnimation={false}
            containerClassName="w-full"
            sizes="(min-width: 1024px) 20rem, 100vw"
            className="mx-auto max-h-[21rem] w-full cursor-pointer bg-transparent object-contain transition-opacity hover:opacity-95"
            onClick={onImageClick}
          />
          {(section.caption || section.imageAlt) && (
            <figcaption className="mt-3 text-[0.78rem] italic leading-5 text-white/58">
              {decodeHTMLEntities(section.caption || section.imageAlt || "")}
            </figcaption>
          )}
        </figure>
        <div>
          {section.number && (
            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/34">
              Step {decodeHTMLEntities(section.number)}
            </p>
          )}
          <h3 className="mb-5 font-sans text-[clamp(1.8rem,2.4vw,2.55rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
            {decodeHTMLEntities(section.title || "")}
          </h3>
          {paragraphs.map((paragraph: string, paragraphIndex: number) => (
            <p
              key={paragraphIndex}
              className="mb-6 text-[1.02rem] leading-8 tracking-[-0.015em] text-white/74 last:mb-0"
            >
              {decodeHTMLEntities(paragraph)}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleRenderChoice({
  section,
  onImageClick,
}: {
  section: any;
  onImageClick?: (choiceIndex: number) => void;
}) {
  const choices = Array.isArray(section.choices) ? section.choices : [];
  if (choices.length === 0) return null;

  return (
    <section className="relative left-1/2 my-12 w-screen max-w-[74rem] -translate-x-1/2 px-5 sm:px-6">
      <div className="mx-auto max-w-[62rem] border-t border-white/10 pt-10">
        {section.number && (
          <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/34">
            Step {decodeHTMLEntities(section.number)}
          </p>
        )}
        <h3 className="mb-5 max-w-[42rem] font-sans text-[clamp(1.9rem,2.7vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.058em] text-white">
          {decodeHTMLEntities(section.title || "")}
        </h3>
        {section.intro && (
          <p className="mb-9 max-w-[46rem] text-[1.02rem] leading-8 tracking-[-0.015em] text-white/70">
            {decodeHTMLEntities(section.intro)}
          </p>
        )}

        {section.compare && (
          <ArticleImageCompare
            section={{
              ...section.compare,
              nested: true,
            }}
          />
        )}

        <div className="space-y-9">
          {choices.map((choice: any, choiceIndex: number) => {
            const paragraphs = Array.isArray(choice.paragraphs)
              ? choice.paragraphs
              : [];
            return (
              <article
                key={choice.label || choiceIndex}
                className="grid gap-7 md:grid-cols-[minmax(13rem,19rem)_minmax(0,1fr)] md:items-start"
              >
                <figure>
                  <ProgressiveImage
                    src={getArticleMediaUrl(choice.imageUrl)}
                    alt={
                      choice.imageAlt || choice.caption || choice.label || ""
                    }
                    loading="lazy"
                    enableScrollAnimation={false}
                    containerClassName="w-full"
                    sizes="(min-width: 1024px) 19rem, 100vw"
                    className="mx-auto max-h-[20rem] w-full cursor-pointer bg-transparent object-contain transition-opacity hover:opacity-95"
                    onClick={() => onImageClick?.(choiceIndex)}
                  />
                  {(choice.caption || choice.imageAlt) && (
                    <figcaption className="mt-3 text-[0.76rem] italic leading-5 text-white/56">
                      {decodeHTMLEntities(
                        choice.caption || choice.imageAlt || ""
                      )}
                    </figcaption>
                  )}
                </figure>
                <div>
                  <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/34">
                    Option {choiceIndex + 1}
                  </p>
                  <h4 className="mb-4 font-sans text-[clamp(1.45rem,2vw,2rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
                    {decodeHTMLEntities(choice.label || "")}
                  </h4>
                  {paragraphs.map(
                    (paragraph: string, paragraphIndex: number) => (
                      <p
                        key={paragraphIndex}
                        className="mb-5 text-[1rem] leading-8 tracking-[-0.015em] text-white/72 last:mb-0"
                      >
                        {decodeHTMLEntities(paragraph)}
                      </p>
                    )
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ArticleMediaTabs({ section }: { section: any }) {
  const items = Array.isArray(section.items) ? section.items : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];

  if (!activeItem) return null;

  const isSettingsLayout = section.layout === "settings";
  const settingsRows = Array.isArray(activeItem.settings)
    ? activeItem.settings
    : [];
  const activeParagraphs = Array.isArray(activeItem.paragraphs)
    ? activeItem.paragraphs
    : [];
  const shouldCropImage = section.crop === "inset";

  return (
    <section className="relative left-1/2 my-16 w-screen max-w-[78rem] -translate-x-1/2 px-5 sm:px-6">
      <div className="mx-auto max-w-[64rem]">
        {section.eyebrow && (
          <p className="mb-4 text-center text-[0.76rem] font-semibold uppercase tracking-[0.28em] text-white/36">
            {decodeHTMLEntities(section.eyebrow)}
          </p>
        )}
        {section.title && (
          <h2 className="mx-auto mb-5 max-w-[48rem] text-center font-sans text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white">
            {decodeHTMLEntities(section.title)}
          </h2>
        )}
        {section.intro && (
          <p className="mx-auto mb-9 max-w-[42rem] text-center text-[1.02rem] leading-8 tracking-[-0.015em] text-white/62">
            {decodeHTMLEntities(section.intro)}
          </p>
        )}
        <div className="mx-auto flex w-fit max-w-full overflow-x-auto rounded-full border border-white/16 bg-white/[0.025] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item: any, itemIndex: number) => {
            const isActive = itemIndex === activeIndex;
            return (
              <button
                key={item.id || item.label || itemIndex}
                type="button"
                onClick={() => setActiveIndex(itemIndex)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[0.9rem] tracking-[-0.025em] transition-colors ${
                  isActive
                    ? "bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.12)]"
                    : "text-white/58 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {decodeHTMLEntities(
                  item.label || item.title || `Item ${itemIndex + 1}`
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isSettingsLayout ? (
        <div className="mx-auto mt-8 max-w-[70rem]">
          <figure>
            <div className="border border-white/10 bg-white/[0.03] p-2">
              <ProgressiveImage
                src={getArticleMediaUrl(activeItem.url)}
                alt={activeItem.alt || activeItem.title || section.title || ""}
                loading="lazy"
                enableScrollAnimation={false}
                containerClassName="w-full"
                sizes="(min-width: 1280px) 70rem, 100vw"
                className="max-h-[46rem] w-full bg-white/[0.02] object-contain"
              />
            </div>
            {(activeItem.caption || activeItem.alt) && (
              <figcaption className="mt-3 text-left text-[0.84rem] italic leading-6 text-white/58">
                {decodeHTMLEntities(activeItem.caption || activeItem.alt || "")}
              </figcaption>
            )}
          </figure>

          <div className="mx-auto mt-10 max-w-[45rem]">
            {activeItem.kicker && (
              <p className="mb-4 text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-white/36">
                {decodeHTMLEntities(activeItem.kicker)}
              </p>
            )}
            {activeItem.title && (
              <h3 className="mb-5 font-sans text-[clamp(1.7rem,2.6vw,2.55rem)] font-medium leading-[1] tracking-[-0.052em] text-white">
                {decodeHTMLEntities(activeItem.title)}
              </h3>
            )}
            {activeItem.body && (
              <p className="mb-7 text-[1.04rem] leading-8 tracking-[-0.015em] text-white/72">
                {decodeHTMLEntities(activeItem.body)}
              </p>
            )}
            {activeParagraphs.map(
              (paragraph: string, paragraphIndex: number) => (
                <p
                  key={paragraphIndex}
                  className="mb-7 text-[1.04rem] leading-8 tracking-[-0.015em] text-white/72 last:mb-0"
                >
                  {decodeHTMLEntities(paragraph)}
                </p>
              )
            )}
            {settingsRows.length > 0 && (
              <div className="mt-10">
                <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-white/34">
                  Reference values
                </p>
                <dl className="border-y border-white/10">
                  {settingsRows.map((row: any, rowIndex: number) => (
                    <div
                      key={`${row.label || "setting"}-${rowIndex}`}
                      className="grid gap-2 border-b border-white/10 py-4 last:border-b-0 sm:grid-cols-[8rem_1fr]"
                    >
                      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-white/38">
                        {decodeHTMLEntities(row.label || "")}
                      </dt>
                      <dd className="text-[0.98rem] leading-7 tracking-[-0.012em] text-white/76">
                        {decodeHTMLEntities(row.value || "")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto mt-8 grid max-w-[70rem] gap-8">
          <figure>
            <ProgressiveImage
              src={getArticleMediaUrl(activeItem.url)}
              alt={activeItem.alt || activeItem.title || section.title || ""}
              loading="lazy"
              enableScrollAnimation={false}
              containerClassName="w-full"
              sizes="(min-width: 1280px) 70rem, 100vw"
              className={`w-full bg-white/[0.02] object-cover ${
                shouldCropImage ? "scale-[1.09]" : ""
              }`}
            />
            {(activeItem.caption || activeItem.alt) && (
              <figcaption className="mt-3 text-left text-[0.84rem] italic leading-6 text-white/58">
                {decodeHTMLEntities(activeItem.caption || activeItem.alt || "")}
              </figcaption>
            )}
          </figure>

          <div className="mx-auto max-w-[48rem] text-center">
            {activeItem.kicker && (
              <p className="mb-4 text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-white/36">
                {decodeHTMLEntities(activeItem.kicker)}
              </p>
            )}
            {activeItem.title && (
              <h3 className="mb-4 font-sans text-[clamp(1.55rem,2.4vw,2.35rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                {decodeHTMLEntities(activeItem.title)}
              </h3>
            )}
            {activeItem.body && (
              <p className="text-[1.02rem] leading-8 tracking-[-0.015em] text-white/68">
                {decodeHTMLEntities(activeItem.body)}
              </p>
            )}
            {Array.isArray(activeItem.points) &&
              activeItem.points.length > 0 && (
                <ul className="mt-6 space-y-3 text-left">
                  {activeItem.points.map(
                    (point: string, pointIndex: number) => (
                      <li
                        key={pointIndex}
                        className="border-t border-white/10 pt-3 text-[0.98rem] leading-7 tracking-[-0.012em] text-white/64"
                      >
                        {decodeHTMLEntities(point)}
                      </li>
                    )
                  )}
                </ul>
              )}
          </div>
        </div>
      )}
    </section>
  );
}

function ArticleDetailContent({
  slug: slugProp,
  article: initialArticle,
  variant,
  params,
}: ArticleDetailProps) {
  const slug = slugProp || params?.slug || "";
  const article = initialArticle || getLocalArticleRecordBySlug(slug);
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const articleThemeStyle = {
    "--article-bg": homeTheme.bg,
    "--article-ink": homeTheme.ink,
    "--article-muted": homeTheme.muted,
    "--article-ghost": homeTheme.ghost,
    "--article-accent": homeTheme.accent,
    "--article-accent-soft": homeTheme.accentSoft,
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  const galleryRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const relatedArticleRailRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxImages, setLightboxImages] = useState<
    Array<{
      imageUrl: string | null;
      caption: string | null;
      altText: string | null;
    }>
  >([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<
    number | null
  >(null);
  const [audioCurrentTimeSeconds, setAudioCurrentTimeSeconds] = useState(0);
  const scrollGallery = (sectionIndex: number, direction: "prev" | "next") => {
    const container = galleryRefs.current[sectionIndex];
    if (!container) return;
    const figures = Array.from(
      container.querySelectorAll("figure")
    ) as HTMLElement[];
    if (!figures.length) return;

    const currentScroll = container.scrollLeft;
    let currentIndex = 0;

    for (let i = 0; i < figures.length; i += 1) {
      if (figures[i].offsetLeft <= currentScroll + 8) {
        currentIndex = i;
      } else {
        break;
      }
    }

    const targetIndex =
      direction === "next"
        ? Math.min(
            figures.length - 1,
            currentIndex === 0 ? 2 : currentIndex + 2
          )
        : Math.max(0, currentIndex <= 2 ? 0 : currentIndex - 2);

    container.scrollTo({
      left: figures[targetIndex].offsetLeft,
      behavior: "smooth",
    });
  };

  const scrollRelatedArticles = (direction: "previous" | "next") => {
    relatedArticleRailRef.current?.scrollBy({
      left: direction === "next" ? 360 : -360,
      behavior: "smooth",
    });
  };

  const getHeadingId = (text: string, index: number) => {
    const base = text
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return base ? `${base}-${index}` : `heading-${index}`;
  };

  const handleShare = async () => {
    const url = window.location.href;
    const copied = await copyTextToClipboard(url);
    if (copied) {
      setLinkCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setLinkCopied(false), 1800);
    } else {
      setLinkCopied(false);
    }
  };

  const articleAudio = article?.audio;

  const handleAudioToggle = async () => {
    if (!audioRef.current || !articleAudio) return;

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
        setIsAudioPlaying(true);
      } catch {
        setIsAudioPlaying(false);
        toast.error("Unable to play audio");
      }
      return;
    }

    audioRef.current.pause();
    setIsAudioPlaying(false);
  };

  const formatAudioDuration = (seconds: number | null) => {
    if (!seconds || Number.isNaN(seconds)) return null;
    const rounded = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(rounded / 60);
    const remainingSeconds = rounded % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const displayedAudioTime = (() => {
    if (
      articleAudio?.durationLabel &&
      !isAudioPlaying &&
      !audioDurationSeconds
    ) {
      return articleAudio.durationLabel;
    }

    if (!audioDurationSeconds || Number.isNaN(audioDurationSeconds)) {
      return articleAudio?.durationLabel || null;
    }

    if (!isAudioPlaying) {
      return (
        articleAudio?.durationLabel || formatAudioDuration(audioDurationSeconds)
      );
    }

    const remaining = Math.max(
      0,
      audioDurationSeconds - audioCurrentTimeSeconds
    );
    return formatAudioDuration(remaining);
  })();

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="mb-4 font-sans text-4xl font-medium tracking-[-0.05em]">
            Article Not Found
          </h1>
          <p className="mb-8 text-white/62">
            The article you're looking for doesn't exist.
          </p>
          <Link href="/articles">
            <Button>Back to Articles</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse content sections
  let contentSections: any[] = [];
  try {
    contentSections =
      typeof article.content === "string"
        ? JSON.parse(article.content)
        : article.content || [];
  } catch (e) {
    contentSections = [{ type: "html", content: article.content }];
  }

  // Detect and group FAQ sections
  const processedSections: any[] = [];
  let i = 0;
  while (i < contentSections.length) {
    const section = contentSections[i];

    if (
      section.type === "heading" &&
      section.level === 2 &&
      (section.text || "").toLowerCase().includes("faq") &&
      contentSections[i + 1]?.type === "faq"
    ) {
      processedSections.push({
        ...contentSections[i + 1],
        heading: section.text || "Frequently Asked Questions",
      });
      i += 2;
      continue;
    }

    // Check if this is an FAQ heading
    if (
      section.type === "heading" &&
      section.level === 2 &&
      (section.text || "").toLowerCase().includes("frequently asked questions")
    ) {
      // Collect all FAQ items (H3 questions followed by paragraphs)
      const faqItems: Array<{ question: string; answer: string }> = [];
      i++; // Move past FAQ heading

      while (i < contentSections.length) {
        const current = contentSections[i];

        // FAQ question (H3 ending with ?)
        if (current.type === "heading" && current.level === 3) {
          const question = (current.text || "").replace(/\+$/, ""); // Remove trailing +
          i++;

          // Collect answer text/paragraphs until next heading
          const answerParts: string[] = [];
          while (
            i < contentSections.length &&
            !(contentSections[i].type === "heading")
          ) {
            if (
              contentSections[i].type === "paragraph" ||
              contentSections[i].type === "text"
            ) {
              answerParts.push(
                contentSections[i].content || contentSections[i].text || ""
              );
            }
            i++;
          }

          faqItems.push({ question, answer: answerParts.join("\n\n") });

          // If we hit another H2, break out of FAQ section
          if (
            i < contentSections.length &&
            contentSections[i].type === "heading" &&
            contentSections[i].level === 2
          ) {
            break;
          }
        } else {
          break;
        }
      }

      if (faqItems.length > 0) {
        processedSections.push({
          type: "faq",
          heading: section.text || "Frequently Asked Questions",
          items: faqItems,
        });
      }
      continue; // Don't increment i, already moved past FAQ
    }

    // Check for plain-text FAQ format in HTML content (Q: and A: pattern)
    if (section.type === "html" && section.content) {
      const htmlContent = section.content;

      // Extract text content from HTML to find Q&A pairs
      const textContent = getHtmlTextContent(htmlContent);

      // Look for Q: and A: pattern in the text content
      const lines = textContent
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);
      const faqItems: Array<{ question: string; answer: string }> = [];

      let qCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith("Q:")) {
          qCount++;
          const question = line.substring(2).trim();
          // Look for the corresponding A: on the next line
          if (i + 1 < lines.length && lines[i + 1].startsWith("A:")) {
            const answer = lines[i + 1].substring(2).trim();
            faqItems.push({ question, answer });
            i++; // Skip the answer line
          }
        }
      }

      // If we found FAQ items (at least 3 Q&A pairs), convert this section to FAQ accordion
      if (faqItems.length >= 3) {
        // Check if there's an FAQ heading in this section
        const faqHeadingMatch = htmlContent.match(/<h2[^>]*>(.*?)<\/h2>/i);
        if (faqHeadingMatch) {
          const faqHeadingIndex = htmlContent.indexOf(faqHeadingMatch[0]);
          const beforeFaq = htmlContent.substring(0, faqHeadingIndex).trim();
          if (beforeFaq) {
            processedSections.push({ type: "html", content: beforeFaq });
          }
        }

        // FAQ accordion
        processedSections.push({
          type: "faq",
          heading: faqHeadingMatch
            ? getHtmlTextContent(faqHeadingMatch[1])
            : "Frequently Asked Questions",
          items: faqItems,
        });

        continue;
      }
    }

    processedSections.push(section);
    i++;
  }

  // Calculate read time
  const wordCount = JSON.stringify(contentSections).split(/\s+/).length;

  const articleImageSlides: Array<{ key: string; src: string; alt?: string }> =
    [];
  if (article.coverImageUrl) {
    articleImageSlides.push({
      key: "cover",
      src: article.coverImageUrl,
      alt: article.title,
    });
  }
  processedSections.forEach((section: any, sectionIndex: number) => {
    if (section.type === "image" && section.url) {
      articleImageSlides.push({
        key: `image-${sectionIndex}`,
        src: getArticleMediaUrl(section.url),
        alt: section.alt || section.caption || "",
      });
    }
    if (section.type === "setting_step" && section.imageUrl) {
      articleImageSlides.push({
        key: `setting-step-${sectionIndex}`,
        src: getArticleMediaUrl(section.imageUrl),
        alt: section.imageAlt || section.caption || section.title || "",
      });
    }
    if (section.type === "render_choice" && Array.isArray(section.choices)) {
      section.choices.forEach((choice: any, choiceIndex: number) => {
        if (!choice?.imageUrl) return;
        articleImageSlides.push({
          key: `render-choice-${sectionIndex}-${choiceIndex}`,
          src: getArticleMediaUrl(choice.imageUrl),
          alt: choice.imageAlt || choice.caption || choice.label || "",
        });
      });
    }
    if (section.type === "gallery" && Array.isArray(section.images)) {
      section.images.forEach((img: any, imgIndex: number) => {
        if (!img?.url) return;
        articleImageSlides.push({
          key: `gallery-${sectionIndex}-${imgIndex}`,
          src: getArticleMediaUrl(img.url),
          alt: img.alt || img.caption || "",
        });
      });
    }
  });

  const imageIndexByKey = new Map<string, number>();
  articleImageSlides.forEach((slide, idx) => {
    imageIndexByKey.set(slide.key, idx);
  });

  const openArticleLightboxAt = (key: string) => {
    if (articleImageSlides.length === 0) return;
    setLightboxImages(
      articleImageSlides.map(({ src, alt }) => ({
        imageUrl: src,
        caption: null,
        altText: alt || null,
      }))
    );
    setLightboxIndex(imageIndexByKey.get(key) ?? 0);
  };

  const linkedScenicProjects = (article.linkedScenicProjectSlugs || [])
    .map((projectSlug: string) => getLocalScenicProjectBySlug(projectSlug))
    .filter(Boolean);

  const relatedCandidates = getLocalArticles()
    .map(candidate => getLocalArticleRecordBySlug(candidate.slug))
    .filter((candidate): candidate is NonNullable<typeof article> =>
      Boolean(candidate)
    )
    .filter(candidate => candidate.id !== article.id)
    .filter(candidate => !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(candidate.slug))
    .filter(
      candidate =>
        LEARNING_PORTAL_ARTICLE_SLUG_SET.has(candidate.slug) ===
        LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug)
    );

  const sameSeries = article.series
    ? relatedCandidates.filter(
        candidate => candidate.series?.slug === article.series?.slug
      )
    : [];
  const sameCategory = relatedCandidates.filter(
    candidate => candidate.categoryName === article.categoryName
  );
  const related = [...sameSeries, ...sameCategory, ...relatedCandidates]
    .filter(
      (candidate, index, array) =>
        array.findIndex(item => item.id === candidate.id) === index
    )
    .slice(0, 8);
  const articleKeywords = article.seoKeywords
    ? article.seoKeywords
    : [
        article.categoryName,
        article.series?.name,
        ...(article.tags || []).map((tag: any) => tag.name),
        "Brandon PT Davis",
        "scenic design article",
      ]
        .filter(Boolean)
        .join(", ");
  const articleDescription =
    article.excerpt ||
    `${article.title} by Brandon PT Davis on scenic design, production thinking, and visual storytelling.`;
  const isLearningPortalArticle =
    variant === "tutorial" ||
    LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug);
  const isNarrativeArticle = !isLearningPortalArticle;
  const articleBasePath = "/articles";
  const articleUrl = `https://www.brandonptdavis.com${articleBasePath}/${article.slug}`;
  const articleDisplayUpdatedAt = getDisplayUpdatedDate(
    article.updatedAt || article.publishedAt || article.createdAt
  );
  const encodedArticleUrl = encodeURIComponent(articleUrl);
  const encodedArticleTitle = encodeURIComponent(
    decodeHTMLEntities(article.title)
  );
  const emailShareUrl = `mailto:?subject=${encodedArticleTitle}&body=${encodedArticleTitle}%0A%0A${encodedArticleUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedArticleUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedArticleUrl}`;
  return (
    <div
      className={`article-detail-page min-h-screen transition-colors duration-500 ${
        isNarrativeArticle ? "" : "publish-editorial"
      }`}
      style={articleThemeStyle}
    >
      <SEO
        title={`${article.title} | Brandon PT Davis`}
        description={articleDescription}
        image={article.coverImageUrl || undefined}
        imageAlt={article.coverImageAlt || article.title}
        type="article"
        author="Brandon PT Davis"
        publishedTime={
          article.publishedAt
            ? new Date(article.publishedAt).toISOString()
            : undefined
        }
        modifiedTime={
          article.updatedAt
            ? new Date(article.updatedAt).toISOString()
            : undefined
        }
        keywords={articleKeywords}
        url={articleUrl}
      />
      <Header />
      {isNarrativeArticle ? null : (
        <PublishingTopBar active="articles" tone="light" />
      )}
      <article
        className={
          isNarrativeArticle
            ? "article-editorial article-editorial-article overflow-hidden pb-16 md:pb-24"
            : "article-editorial article-editorial-light article-editorial-learning overflow-hidden pb-16 md:pb-24"
        }
      >
        {isNarrativeArticle ? (
          <section
            className="flex min-h-[100svh] items-center justify-center"
            style={
              {
                "--article-hero-pad": "clamp(2rem, 5vw, 5rem)",
                backgroundColor: homeTheme.bg,
                padding: "var(--article-hero-pad)",
              } as CSSProperties
            }
          >
            <div
              className="relative mx-auto flex w-full max-w-[88rem] overflow-hidden rounded-[1.75rem] shadow-[0_1.6rem_5rem_rgba(0,0,0,0.2)]"
              style={{
                minHeight:
                  "calc(100svh - var(--article-hero-pad) - var(--article-hero-pad))",
              }}
            >
              {article.coverImageUrl ? (
                <Image
                  src={article.coverImageUrl}
                  alt={article.coverImageAlt || article.title}
                  fill
                  priority
                  quality={84}
                  unoptimized
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 900px) 100vw, 88rem"
                  className="object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/42 to-black/10" />
              <header className="relative z-10 mt-auto grid w-full gap-[clamp(2rem,5vw,5rem)] px-[clamp(1.35rem,4vw,4rem)] pb-[clamp(2.5rem,7vh,5rem)] pt-[clamp(9rem,24vh,16rem)] lg:grid-cols-[minmax(0,0.62fr)_minmax(18rem,0.38fr)] lg:items-center">
                <MotionReveal eager>
                  <div>
                    <h1
                      className="max-w-[13ch] text-[clamp(2.45rem,4.9vw,5.6rem)] font-black leading-[0.88] tracking-[0]"
                      style={{ color: "#ffffff", fontFamily: HOME_DISPLAY_FONT }}
                    >
                      {decodeHTMLEntities(article.title)}
                    </h1>
                  </div>
                </MotionReveal>

                <MotionReveal eager delay={140}>
                  <div className="max-w-[30rem] pt-5 lg:justify-self-end">
                    {article.excerpt ? (
                      <p
                        className="max-w-[31rem] text-[clamp(1rem,1.25vw,1.24rem)] font-normal leading-[1.52] tracking-[-0.025em]"
                        style={{ color: "rgba(255,255,255,0.7)" }}
                      >
                        {decodeHTMLEntities(article.excerpt)}
                      </p>
                    ) : null}
                    <div
                      className="mt-6 flex items-center gap-2"
                      style={{ color: "rgba(255,255,255,0.62)" }}
                    >
                      <button
                        type="button"
                        onClick={handleShare}
                        aria-label={
                          linkCopied ? "Article link copied" : "Copy article link"
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        {linkCopied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <LinkIcon className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={emailShareUrl}
                        aria-label="Share article by email"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                      <a
                        href={linkedInShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share article on LinkedIn"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share article on Facebook"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none text-white/62 no-underline transition-colors hover:bg-white/[0.08] hover:text-white"
                      >
                        f
                      </a>
                    </div>
                  </div>
                </MotionReveal>
              </header>
            </div>
          </section>
        ) : isLearningPortalArticle ? (
          <section className="px-5 pb-6 pt-16 sm:px-8 md:pt-24 lg:px-10">
            <AnimatedSection>
              <header className="mx-auto max-w-[48rem] text-left">
                <div className="text-[1rem] font-medium leading-6 tracking-[-0.02em] text-[#6e6e73]">
                  <p className="text-[0.92rem] tracking-[-0.02em] text-[#6e6e73]/82">
                    Updated
                  </p>
                  <time
                    className="mt-1 block"
                    dateTime={articleDisplayUpdatedAt}
                  >
                    {formatUtcDate(articleDisplayUpdatedAt, "long")}
                  </time>
                </div>

                <h1 className="mt-8 max-w-[14ch] text-balance font-sans text-[clamp(2.7rem,5.2vw,5.2rem)] font-semibold leading-[0.98] tracking-[-0.058em] text-[#1d1d1f]">
                  {decodeHTMLEntities(article.title)}
                </h1>

                {article.excerpt && (
                  <p className="mt-7 max-w-[43rem] text-balance text-[clamp(1.18rem,1.85vw,1.56rem)] font-medium leading-[1.28] tracking-[-0.034em] text-[#35312c]">
                    {decodeHTMLEntities(article.excerpt)}
                  </p>
                )}

                <div className="mt-10 flex flex-wrap items-center gap-3 text-[#6e6e73]">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label={
                      linkCopied ? "Article link copied" : "Copy article link"
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/[0.05] hover:text-black"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <LinkIcon className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={emailShareUrl}
                    aria-label="Share article by email"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-black/[0.05] hover:text-black"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                  <a
                    href={linkedInShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share article on LinkedIn"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors hover:bg-black/[0.05] hover:text-black"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share article on Facebook"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none no-underline transition-colors hover:bg-black/[0.05] hover:text-black"
                  >
                    f
                  </a>
                </div>
              </header>
            </AnimatedSection>

            {article.coverImageUrl ? (
              <AnimatedSection delay={120}>
                <button
                  type="button"
                  aria-label="Open tutorial article image"
                  className="group relative mx-auto mt-16 block aspect-video w-full max-w-[68rem] overflow-hidden rounded-[1.7rem] bg-[#e5e3dc] shadow-[0_24px_70px_rgba(29,29,31,0.08)]"
                  onClick={() => openArticleLightboxAt("cover")}
                >
                  <Image
                    src={article.coverImageUrl}
                    alt={article.coverImageAlt || article.title}
                    fill
                    priority
                    unoptimized
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1280px) 1088px, calc(100vw - 2.5rem)"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                  />
                </button>
              </AnimatedSection>
            ) : null}
          </section>
        ) : (
          <section className="px-[clamp(1.5rem,5vw,6rem)] py-12 md:py-16">
            <AnimatedSection>
              <header className="mx-auto max-w-[62rem] text-center">
                <div className="mb-5 text-[0.86rem] font-semibold tracking-[-0.02em] text-[#777169]">
                  Tutorial
                </div>

                <h1 className="mx-auto max-w-[15ch] text-balance font-sans text-[clamp(2.45rem,5.1vw,5.35rem)] font-semibold leading-[0.94] tracking-[-0.074em] text-[#111111]">
                  {decodeHTMLEntities(article.title)}
                </h1>

                {article.excerpt && (
                  <p className="mx-auto mt-6 max-w-[42rem] text-balance text-[clamp(1rem,1.4vw,1.28rem)] font-medium leading-[1.5] tracking-[-0.028em] text-[#5f5a52]">
                    {decodeHTMLEntities(article.excerpt)}
                  </p>
                )}
              </header>
            </AnimatedSection>

            {article.coverImageUrl ? (
              <AnimatedSection delay={120}>
                <button
                  type="button"
                  aria-label="Open tutorial article image"
                  className="group relative mx-auto mt-10 block aspect-video w-full max-w-[88rem] overflow-hidden rounded-[1.4rem] bg-black/[0.04]"
                  onClick={() => openArticleLightboxAt("cover")}
                >
                  <Image
                    src={article.coverImageUrl}
                    alt={article.coverImageAlt || article.title}
                    fill
                    priority
                    unoptimized
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 1280px) 1120px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                  />
                </button>
              </AnimatedSection>
            ) : null}
          </section>
        )}

        {!isLearningPortalArticle ? (
          <section className="px-[clamp(1.5rem,5vw,6rem)] py-10 md:py-14">
            <div
              className={`mx-auto flex max-w-[44rem] items-center justify-between gap-5 border-y py-4 ${isNarrativeArticle ? "border-white/16" : "border-black/10"}`}
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.98rem] font-semibold tracking-[-0.025em]">
                {article.categoryName ? (
                  <Link
                    href={`/articles?category=${encodeURIComponent(article.categoryName)}`}
                    className="rounded-full px-4 py-1.5 no-underline transition-opacity hover:opacity-72"
                    style={{
                      backgroundColor: homeTheme.controlBg,
                      color: homeTheme.controlInk,
                      fontFamily: HOME_DISPLAY_FONT,
                      fontStretch: "condensed",
                    }}
                  >
                    {article.categoryName}
                  </Link>
                ) : null}
                <time
                  dateTime={new Date(
                    article.publishedAt || article.createdAt
                  ).toISOString()}
                  className={
                    isNarrativeArticle ? "text-white/54" : "text-[#777169]"
                  }
                >
                  {formatUtcDate(
                    article.publishedAt || article.createdAt,
                    "long"
                  )}
                </time>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {articleAudio ? (
                  <>
                    <audio
                      ref={audioRef}
                      preload="metadata"
                      src={articleAudio.url}
                      onLoadedMetadata={event =>
                        setAudioDurationSeconds(
                          event.currentTarget.duration || null
                        )
                      }
                      onTimeUpdate={event =>
                        setAudioCurrentTimeSeconds(
                          event.currentTarget.currentTime || 0
                        )
                      }
                      onEnded={() => {
                        setIsAudioPlaying(false);
                        setAudioCurrentTimeSeconds(0);
                      }}
                      onPause={() => setIsAudioPlaying(false)}
                      onPlay={() => setIsAudioPlaying(true)}
                    />
                    <button
                      type="button"
                      onClick={handleAudioToggle}
                      aria-label={
                        isAudioPlaying
                          ? "Pause article audio"
                          : "Play article audio"
                      }
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isNarrativeArticle ? "text-white/56 hover:bg-white/[0.08] hover:text-white" : "text-black/48 hover:bg-black/[0.06] hover:text-black"}`}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="ml-0.5 h-4 w-4" />
                      )}
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label={
                    linkCopied ? "Article link copied" : "Copy article link"
                  }
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isNarrativeArticle ? "text-white/56 hover:bg-white/[0.08] hover:text-white" : "text-black/48 hover:bg-black/[0.06] hover:text-black"}`}
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                </button>
                <a
                  href={emailShareUrl}
                  aria-label="Share article by email"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors ${isNarrativeArticle ? "text-white/56 hover:bg-white/[0.08] hover:text-white" : "text-black/48 hover:bg-black/[0.06] hover:text-black"}`}
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href={linkedInShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share article on LinkedIn"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full no-underline transition-colors ${isNarrativeArticle ? "text-white/56 hover:bg-white/[0.08] hover:text-white" : "text-black/48 hover:bg-black/[0.06] hover:text-black"}`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href={facebookShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share article on Facebook"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-[1rem] font-semibold leading-none no-underline transition-colors ${isNarrativeArticle ? "text-white/56 hover:bg-white/[0.08] hover:text-white" : "text-black/48 hover:bg-black/[0.06] hover:text-black"}`}
                >
                  f
                </a>
              </div>
            </div>
          </section>
        ) : null}

        <div
          className={`mx-auto w-full max-w-[960px] px-4 sm:px-6 lg:px-8 ${isLearningPortalArticle ? "mt-14" : ""}`}
        >
          <AnimatedSection delay={120} className="mx-auto max-w-[44rem]">
            <div>
              <div className="min-w-0">
                <div className="relative">
                  <style>{`
                  .article-content-${article.id} ul li::marker {
                    color: rgba(255,255,255,0.55);
                  }
                  .article-content-${article.id} ol li::marker {
                    color: rgba(255,255,255,0.55);
                  }
                  .article-content-${article.id} strong {
                    color: rgba(255,255,255,0.96);
                    font-weight: 700;
                  }
                `}</style>

                  <div
                    className="article-content article-content-${article.id} article-html-content mx-auto max-w-none
                  prose prose-lg prose-invert
                  prose-headings:font-sans prose-headings:font-medium prose-headings:leading-[0.98] prose-headings:tracking-[-0.05em]
                  prose-h2:text-[clamp(2rem,2.75vw,2.8rem)] prose-h2:mt-20 prose-h2:mb-6 prose-h2:scroll-mt-24 prose-h2:text-white
                  prose-h3:text-[clamp(1.5rem,2vw,1.95rem)] prose-h3:mt-14 prose-h3:mb-4 prose-h3:leading-[1.02] prose-h3:text-white/98
                  prose-h4:text-[0.95rem] prose-h4:mt-10 prose-h4:mb-3 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-[0.18em] prose-h4:text-white/48
                  prose-p:text-white/80 prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-[1.04rem] md:prose-p:text-[1.08rem] prose-p:font-normal prose-p:tracking-[-0.01em]
                  prose-a:text-white prose-a:underline prose-a:decoration-white/35 prose-a:underline-offset-4 hover:prose-a:decoration-white/70 prose-a:font-medium
                  prose-strong:font-bold
                  prose-blockquote:border-0 prose-blockquote:pl-0 prose-blockquote:my-14 prose-blockquote:font-sans prose-blockquote:text-white
                  prose-ul:my-8 prose-ol:my-8 prose-ul:leading-[2] prose-ol:leading-[2] prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-8 prose-ol:pl-8
                  prose-li:my-1.5 prose-li:text-[1.0625rem] prose-li:leading-[1.75] prose-li:ml-0
                  [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item [&_li]:ml-0
                  prose-img:my-12
                  prose-figure:my-12
                  prose-figcaption:text-[0.88rem] prose-figcaption:italic prose-figcaption:text-white prose-figcaption:text-center prose-figcaption:mt-4
                  [&_iframe]:mx-auto [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:my-12 [&_iframe]:rounded-xl [&_iframe]:aspect-[16/9] [&_iframe]:h-auto
                  [&_video]:mx-auto [&_video]:w-full [&_video]:max-w-full [&_video]:my-12 [&_video]:rounded-xl [&_video]:aspect-[16/9]
                  [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
                  >
                    {Array.isArray(processedSections) &&
                      (() => {
                        let h2Index = 0;
                        let paragraphIndex = 0;
                        return processedSections.map(
                          (section: any, index: number) => {
                            const renderedSection = (() => {
                              switch (section.type) {
                                case "update_note":
                                  return (
                                    <div
                                      key={index}
                                      className="mb-12 p-6 rounded-xl border-2 border-primary/30 bg-primary/5 backdrop-blur-sm"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                                        <p
                                          className="text-sm leading-relaxed text-white/80 [&_strong]:text-base [&_strong]:font-bold [&_strong]:text-white"
                                          dangerouslySetInnerHTML={{
                                            __html: decodeHTMLEntities(
                                              section.text ||
                                                section.content ||
                                                ""
                                            ),
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );

                                case "heading":
                                  const level = section.level || 2;
                                  const headingText = decodeHTMLEntities(
                                    section.text || section.content || ""
                                  );
                                  const isGhibliShowcaseHeading =
                                    article.slug ===
                                      "studio-ghibli-inspired-immersive-dining-experience" &&
                                    level === 2 &&
                                    headingText.trim().toLowerCase() ===
                                      "visual showcase";
                                  const numberedHeadingMatch =
                                    level === 3
                                      ? headingText.match(/^(\d+)\.\s+(.+)$/)
                                      : null;
                                  const headingClassName =
                                    isGhibliShowcaseHeading
                                      ? "mt-28 mb-12 text-center font-sans text-[clamp(3rem,4vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.075em] text-white"
                                      : isLearningPortalArticle && level === 2
                                        ? "mt-20 mb-6 font-sans text-[clamp(1.95rem,2.55vw,2.75rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#1d1d1f]"
                                        : isLearningPortalArticle && level === 3
                                          ? "mt-12 mb-4 font-sans text-[clamp(1.35rem,1.75vw,1.7rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-[#24211f]"
                                          : isLearningPortalArticle
                                            ? "mt-9 mb-3 font-sans text-[1.08rem] font-medium leading-[1.28] tracking-[-0.025em] text-[#3d3832]"
                                            : level === 2
                                              ? "mt-24 mb-7 font-sans text-[clamp(2.3rem,3vw,3.2rem)] font-medium leading-[0.93] tracking-[-0.065em] text-white"
                                              : level === 3
                                                ? "mt-16 mb-5 font-sans text-[clamp(1.75rem,2.2vw,2.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white"
                                                : "mt-10 mb-3 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-white/48";

                                  const headingId =
                                    level === 2
                                      ? getHeadingId(headingText, h2Index)
                                      : getHeadingId(headingText, index);

                                  if (level === 2) {
                                    h2Index += 1;
                                  }

                                  if (level === 2) {
                                    return (
                                      <h2
                                        key={index}
                                        id={headingId}
                                        className={headingClassName}
                                      >
                                        {headingText}
                                      </h2>
                                    );
                                  } else if (level === 3) {
                                    if (numberedHeadingMatch) {
                                      if (isLearningPortalArticle) {
                                        return (
                                          <h2
                                            key={index}
                                            id={headingId}
                                            className="article-learning-numbered-heading mt-20 mb-6 font-sans text-[clamp(1.95rem,2.55vw,2.75rem)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#1d1d1f]"
                                          >
                                            {headingText}
                                          </h2>
                                        );
                                      }

                                      return (
                                        <div
                                          key={index}
                                          className="mt-18 mb-7 border-t border-white/10 pt-6"
                                        >
                                          <div className="flex items-end gap-4 md:gap-5">
                                            <span
                                              className={`shrink-0 font-sans text-[clamp(1.55rem,2.2vw,2rem)] font-medium leading-[0.92] tracking-[-0.05em] ${isLearningPortalArticle ? "text-black/24" : "text-white/34"}`}
                                            >
                                              {numberedHeadingMatch[1]}
                                            </span>
                                            <h3
                                              id={headingId}
                                              className={`font-sans text-[clamp(2rem,2.35vw,2.5rem)] font-medium leading-[0.98] tracking-[-0.05em] ${isLearningPortalArticle ? "text-[#1d1d1f]" : "text-white"}`}
                                            >
                                              {numberedHeadingMatch[2]}
                                            </h3>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return (
                                      <h3
                                        key={index}
                                        id={headingId}
                                        className={headingClassName}
                                      >
                                        {headingText}
                                      </h3>
                                    );
                                  } else if (level === 4) {
                                    return (
                                      <h4
                                        key={index}
                                        id={headingId}
                                        className={headingClassName}
                                      >
                                        {headingText}
                                      </h4>
                                    );
                                  } else {
                                    return (
                                      <h2
                                        key={index}
                                        id={headingId}
                                        className={headingClassName}
                                      >
                                        {headingText}
                                      </h2>
                                    );
                                  }

                                case "paragraph":
                                  paragraphIndex += 1;
                                  return (
                                    <p
                                      key={index}
                                      className={isLearningPortalArticle ? "mb-7 text-[1.06rem] leading-[1.82] tracking-[-0.015em] text-[#38342f] [&_a]:text-[#111111] [&_a]:underline [&_a]:decoration-black/28 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-black/62 [&_strong]:font-semibold [&_strong]:text-[#111111]" : "mb-7 text-[1.07rem] leading-[1.78] tracking-[0] text-white/80 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/28 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:decoration-white/70 [&_strong]:font-bold [&_strong]:text-white"}
                                      dangerouslySetInnerHTML={{
                                        __html: decodeHTMLEntities(
                                          section.text || section.content || ""
                                        ),
                                      }}
                                    />
                                  );

                                case "resource_callout":
                                  return (
                                    <Link
                                      key={index}
                                      href={section.href || "#"}
                                      className="group my-10 block rounded-[1.1rem] border border-white/12 bg-white/[0.025] p-6 transition-colors hover:border-white/24 hover:bg-white/[0.045] md:p-7"
                                    >
                                      <div className="flex items-start justify-between gap-5">
                                        <div>
                                          {section.eyebrow && (
                                            <p className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-white/38">
                                              {decodeHTMLEntities(
                                                section.eyebrow
                                              )}
                                            </p>
                                          )}
                                          <h3 className="font-sans text-[clamp(1.35rem,2vw,1.95rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                                            {decodeHTMLEntities(
                                              section.title || ""
                                            )}
                                          </h3>
                                          {section.description && (
                                            <p className="mt-4 max-w-[42rem] text-[0.98rem] leading-7 tracking-[-0.01em] text-white/62">
                                              {decodeHTMLEntities(
                                                section.description
                                              )}
                                            </p>
                                          )}
                                        </div>
                                        <span className="mt-1 grid h-10 w-10 flex-none place-items-center rounded-full border border-white/12 text-white/58 transition-colors group-hover:border-white/28 group-hover:text-white">
                                          <ArrowUpRight className="h-4 w-4" />
                                        </span>
                                      </div>
                                    </Link>
                                  );

                                case "quote":
                                  const quoteText = normalizeQuoteText(
                                    section.text || section.content || ""
                                  );
                                  const repeatsHeroExcerpt =
                                    index === 0 &&
                                    article.excerpt &&
                                    quoteText.toLowerCase() ===
                                      normalizeQuoteText(
                                        article.excerpt
                                      ).toLowerCase();

                                  if (repeatsHeroExcerpt) return null;

                                  return (
                                    <blockquote
                                      key={index}
                                      className="my-16 py-2 text-center"
                                    >
                                      <p className="mx-auto max-w-[42rem] font-sans text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium leading-[1.28] tracking-[-0.04em] text-white/92">
                                        <span
                                          aria-hidden="true"
                                          className="mr-[0.08em] text-white/54"
                                        >
                                          “
                                        </span>
                                        {quoteText}
                                        <span
                                          aria-hidden="true"
                                          className="ml-[0.04em] text-white/54"
                                        >
                                          ”
                                        </span>
                                      </p>
                                      {section.author && (
                                        <footer className="mt-5 text-[0.82rem] not-italic font-semibold uppercase tracking-[0.22em] text-white/42">
                                          {decodeHTMLEntities(section.author)}
                                        </footer>
                                      )}
                                    </blockquote>
                                  );

                                case "media_tabs":
                                  return (
                                    <ArticleMediaTabs
                                      key={index}
                                      section={section}
                                    />
                                  );

                                case "image_compare":
                                  return (
                                    <ArticleImageCompare
                                      key={index}
                                      section={section}
                                    />
                                  );

                                case "setting_step":
                                  return (
                                    <ArticleSettingStep
                                      key={index}
                                      section={section}
                                      onImageClick={() =>
                                        openArticleLightboxAt(
                                          `setting-step-${index}`
                                        )
                                      }
                                    />
                                  );

                                case "render_choice":
                                  return (
                                    <ArticleRenderChoice
                                      key={index}
                                      section={section}
                                      onImageClick={choiceIndex =>
                                        openArticleLightboxAt(
                                          `render-choice-${index}-${choiceIndex}`
                                        )
                                      }
                                    />
                                  );

                                case "image":
                                  if (section.display === "artwork") {
                                    return (
                                      <figure
                                        key={index}
                                        className="relative left-1/2 my-12 flex w-screen max-w-[68rem] -translate-x-1/2 flex-col items-center px-5 sm:px-6"
                                      >
                                        <div className="w-full">
                                          <ProgressiveImage
                                            src={getArticleMediaUrl(
                                              section.url
                                            )}
                                            alt={
                                              section.alt ||
                                              section.caption ||
                                              ""
                                            }
                                            loading="lazy"
                                            enableScrollAnimation={false}
                                            containerClassName="w-full"
                                            sizes="(min-width: 1280px) 1088px, 100vw"
                                            className="mx-auto w-full cursor-pointer bg-white/[0.02] transition-opacity hover:opacity-90"
                                            onClick={() =>
                                              openArticleLightboxAt(
                                                `image-${index}`
                                              )
                                            }
                                          />
                                        </div>
                                        {(section.caption || section.alt) && (
                                          <figcaption className="mt-4 w-full max-w-[min(100%,46rem)] text-left text-[0.88rem] italic leading-6 text-white">
                                            {decodeHTMLEntities(
                                              section.caption ||
                                                section.alt ||
                                                ""
                                            )}
                                          </figcaption>
                                        )}
                                      </figure>
                                    );
                                  }

                                  if (section.display === "infographic") {
                                    return (
                                      <figure
                                        key={index}
                                        className="mx-auto my-8 flex w-full max-w-[58rem] flex-col items-center"
                                      >
                                        <ProgressiveImage
                                          src={getArticleMediaUrl(section.url)}
                                          alt={
                                            section.alt || section.caption || ""
                                          }
                                          loading="lazy"
                                          enableScrollAnimation={false}
                                          containerClassName="w-full"
                                          sizes="(min-width: 1024px) 58rem, 100vw"
                                          className="mx-auto w-full cursor-pointer bg-white/[0.02] transition-opacity hover:opacity-95"
                                          onClick={() =>
                                            openArticleLightboxAt(
                                              `image-${index}`
                                            )
                                          }
                                        />
                                        {(section.caption || section.alt) && (
                                          <figcaption className="mt-3 w-full max-w-[min(100%,46rem)] text-left text-[0.88rem] italic leading-6 text-white">
                                            {decodeHTMLEntities(
                                              section.caption ||
                                                section.alt ||
                                                ""
                                            )}
                                          </figcaption>
                                        )}
                                      </figure>
                                    );
                                  }

                                  if (section.display === "settings") {
                                    return (
                                      <figure
                                        key={index}
                                        className="relative left-1/2 my-10 flex w-screen max-w-[64rem] -translate-x-1/2 flex-col items-center px-5 sm:px-6"
                                      >
                                        <ProgressiveImage
                                          src={getArticleMediaUrl(section.url)}
                                          alt={
                                            section.alt || section.caption || ""
                                          }
                                          loading="lazy"
                                          enableScrollAnimation={false}
                                          containerClassName="w-full"
                                          sizes="(min-width: 1024px) 64rem, 100vw"
                                          className="mx-auto max-h-[54rem] w-full cursor-pointer bg-transparent object-contain transition-opacity hover:opacity-95"
                                          onClick={() =>
                                            openArticleLightboxAt(
                                              `image-${index}`
                                            )
                                          }
                                        />
                                        {(section.caption || section.alt) && (
                                          <figcaption className="mt-3 w-full max-w-[min(100%,46rem)] text-left text-[0.88rem] italic leading-6 text-white/72">
                                            {decodeHTMLEntities(
                                              section.caption ||
                                                section.alt ||
                                                ""
                                            )}
                                          </figcaption>
                                        )}
                                      </figure>
                                    );
                                  }

                                  return (
                                    <figure
                                      key={index}
                                      className="flex w-full flex-col items-center"
                                    >
                                      <ProgressiveImage
                                        src={getArticleMediaUrl(section.url)}
                                        alt={
                                          section.alt || section.caption || ""
                                        }
                                        loading="lazy"
                                        enableScrollAnimation={false}
                                        containerClassName="w-full"
                                        sizes="(min-width: 1024px) 58rem, 100vw"
                                        className="mx-auto w-full cursor-pointer bg-white/[0.02] transition-opacity hover:opacity-90"
                                        onClick={() =>
                                          openArticleLightboxAt(
                                            `image-${index}`
                                          )
                                        }
                                      />
                                      {(section.caption || section.alt) && (
                                        <figcaption className="mt-3 w-full max-w-[min(100%,46rem)] text-left text-[0.88rem] italic leading-6 text-white">
                                          {decodeHTMLEntities(
                                            section.caption || section.alt || ""
                                          )}
                                        </figcaption>
                                      )}
                                    </figure>
                                  );

                                case "image_placeholder":
                                  return (
                                    <figure
                                      key={index}
                                      className="my-10 rounded-[0.8rem] border border-dashed border-white/16 bg-white/[0.02] p-6 md:p-8"
                                    >
                                      <div className="aspect-[16/9] rounded-[0.65rem] border border-white/10 bg-black/20" />
                                      <figcaption className="mt-5 space-y-2">
                                        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.18em] text-white/42">
                                          Image Placeholder
                                        </p>
                                        <p className="font-sans text-[1.08rem] font-medium tracking-[-0.03em] text-white">
                                          {decodeHTMLEntities(
                                            section.title || "Planned image"
                                          )}
                                        </p>
                                        {section.note && (
                                          <p className="max-w-[56rem] text-[0.98rem] leading-7 text-white/62">
                                            {decodeHTMLEntities(section.note)}
                                          </p>
                                        )}
                                      </figcaption>
                                    </figure>
                                  );

                                case "video":
                                  const videoUrl = section.url || "";

                                  if (isArticleInlineVideoUrl(videoUrl)) {
                                    return (
                                      <ArticleInlineVideo
                                        key={index}
                                        url={videoUrl}
                                        caption={section.caption}
                                      />
                                    );
                                  }

                                  // Extract YouTube video ID from URL
                                  const getYouTubeId = (url: string) => {
                                    const regExp =
                                      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                                    const match = url.match(regExp);
                                    return match && match[2].length === 11
                                      ? match[2]
                                      : null;
                                  };

                                  const videoId = getYouTubeId(videoUrl);

                                  return (
                                    <figure key={index} className="my-12">
                                      <div className="mx-auto max-w-[64rem]">
                                        <DeferredYouTubeEmbed
                                          videoId={videoId || ""}
                                          title={
                                            section.caption || "Article video"
                                          }
                                          className="bg-transparent"
                                          playbackMode={
                                            section.playbackMode === "dialog"
                                              ? "dialog"
                                              : "inline"
                                          }
                                        />
                                      </div>
                                      {section.caption && (
                                        <figcaption className="mx-auto mt-4 max-w-[46rem] text-center text-[0.88rem] italic leading-6 text-white/58">
                                          {decodeHTMLEntities(section.caption)}
                                        </figcaption>
                                      )}
                                    </figure>
                                  );

                                case "gallery":
                                  const galleryImages = section.images || [];
                                  return (
                                    <section
                                      key={index}
                                      className={`article-image-gallery relative left-1/2 my-24 w-screen max-w-[92rem] -translate-x-1/2 px-5 sm:px-8 lg:px-12 ${isNarrativeArticle ? "article-image-gallery-dark" : "article-image-gallery-light"}`}
                                    >
                                      <div className="mx-auto mb-4 flex max-w-[78rem] items-center justify-end">
                                        <div className="hidden items-center gap-1.5 md:flex">
                                          <button
                                            type="button"
                                            aria-label="Previous gallery images"
                                            onClick={() =>
                                              scrollGallery(index, "prev")
                                            }
                                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${isNarrativeArticle ? "bg-white/[0.055] text-white/58 hover:bg-white/[0.1] hover:text-white" : "bg-black/[0.045] text-black/52 hover:bg-black/[0.08] hover:text-black"}`}
                                          >
                                            <ChevronLeft className="h-4 w-4" />
                                          </button>
                                          <button
                                            type="button"
                                            aria-label="Next gallery images"
                                            onClick={() =>
                                              scrollGallery(index, "next")
                                            }
                                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${isNarrativeArticle ? "bg-white/[0.055] text-white/58 hover:bg-white/[0.1] hover:text-white" : "bg-black/[0.045] text-black/52 hover:bg-black/[0.08] hover:text-black"}`}
                                          >
                                            <ChevronRight className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="overflow-hidden">
                                        <div
                                          ref={el => {
                                            galleryRefs.current[index] = el;
                                          }}
                                          className="flex gap-4 overflow-x-auto pb-5 snap-x snap-mandatory sm:gap-5 md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                                        >
                                          {galleryImages.map(
                                            (img: any, imgIndex: number) => (
                                              <figure
                                                key={imgIndex}
                                                className="group/gallery-card flex-none w-[82vw] max-w-[52rem] snap-start sm:w-[66vw] md:w-[min(62vw,52rem)] lg:w-[min(54vw,52rem)]"
                                              >
                                                <ProgressiveImage
                                                  src={getArticleMediaUrl(
                                                    img.url
                                                  )}
                                                  alt={
                                                    img.alt || img.caption || ""
                                                  }
                                                  loading="lazy"
                                                  enableScrollAnimation={false}
                                                  sizes="(min-width: 1024px) 52rem, 82vw"
                                                  className="cursor-pointer transition duration-300 group-hover/gallery-card:opacity-92"
                                                  onClick={() =>
                                                    openArticleLightboxAt(
                                                      `gallery-${index}-${imgIndex}`
                                                    )
                                                  }
                                                />
                                                {img.caption && (
                                                  <figcaption
                                                    className={`mt-3 max-w-[34rem] text-[0.86rem] leading-6 tracking-[-0.01em] ${isNarrativeArticle ? "text-white/52" : "text-black/52"}`}
                                                  >
                                                    {decodeHTMLEntities(
                                                      img.caption
                                                    )}
                                                  </figcaption>
                                                )}
                                              </figure>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </section>
                                  );

                                case "list":
                                  const ListTag =
                                    section.listType === "numbered"
                                      ? "ol"
                                      : "ul";
                                  return (
                                    <ListTag
                                      key={index}
                                      className={`my-8 list-outside space-y-3 pl-7 ${section.listType === "numbered" ? "list-decimal" : "list-disc"} [&_strong]:font-bold`}
                                    >
                                      {section.items?.map(
                                        (item: string, itemIndex: number) => (
                                          <li
                                            key={itemIndex}
                                            className="pl-1 leading-[1.72]"
                                            dangerouslySetInnerHTML={{
                                              __html: decodeHTMLEntities(item),
                                            }}
                                          />
                                        )
                                      )}
                                    </ListTag>
                                  );

                                case "text":
                                  return (
                                    <div
                                      key={index}
                                      className="article-html-content [&_p]:mb-7 [&_p]:text-[1.07rem] [&_p]:leading-[1.78] [&_p]:tracking-[0]"
                                      dangerouslySetInnerHTML={{
                                        __html: processHTMLImages(
                                          decodeHTMLEntities(section.content)
                                        ),
                                      }}
                                    />
                                  );

                                case "html":
                                  return (
                                    <div
                                      key={index}
                                      className="[&_p]:mb-7 [&_p]:text-[1.07rem] [&_p]:leading-[1.78] [&_p]:tracking-[0]"
                                      dangerouslySetInnerHTML={{
                                        __html: processHTMLImages(
                                          section.content
                                        ),
                                      }}
                                    />
                                  );

                                case "faq":
                                  return (
                                    <section
                                      key={index}
                                      className="mb-20 mt-16 max-w-[44rem]"
                                    >
                                      <h2
                                        className="mb-5 text-[clamp(1.9rem,2.8vw,2.7rem)] font-black uppercase leading-[0.9] tracking-[0]"
                                        style={{
                                          color: homeTheme.ink,
                                          fontFamily: HOME_DISPLAY_FONT,
                                          fontStretch: "condensed",
                                        }}
                                      >
                                        {decodeHTMLEntities(
                                          section.heading ||
                                            "Frequently Asked Questions"
                                        )}
                                      </h2>
                                      <div
                                        className="border-y bg-transparent"
                                        style={{ borderColor: homeTheme.ghost }}
                                      >
                                        <Accordion
                                          type="single"
                                          collapsible
                                          className="space-y-0"
                                        >
                                          {section.items?.map(
                                            (item: any, faqIndex: number) => (
                                              <AccordionItem
                                                key={faqIndex}
                                                value={`faq-${faqIndex}`}
                                                className="border-b last:border-b-0"
                                                style={{ borderColor: homeTheme.ghost }}
                                              >
                                                <AccordionTrigger
                                                  className="group/faq rounded-none bg-transparent py-0 text-left hover:bg-transparent hover:no-underline focus-visible:border-transparent focus-visible:ring-0 [&:focus-visible_.faq-plus-ring]:ring-2 [&:focus-visible_.faq-plus-ring]:ring-black/20 [&[data-state=open]_.faq-plus-ring]:scale-95 [&[data-state=open]_.faq-plus-ring]:bg-black [&[data-state=open]_.faq-plus-line]:bg-white [&[data-state=open]_.faq-plus-vertical]:rotate-90 [&[data-state=open]_.faq-plus-vertical]:opacity-0"
                                                  style={{
                                                    backgroundColor: "transparent",
                                                    color: homeTheme.ink,
                                                  }}
                                                >
                                                  <div className="flex w-full items-center justify-between gap-5 py-4">
                                                    <div
                                                      className="pr-2 text-[1.02rem] font-semibold leading-[1.38] tracking-[0] md:text-[1.08rem]"
                                                      style={{ color: homeTheme.ink }}
                                                    >
                                                      {decodeHTMLEntities(
                                                        item.question
                                                      )}
                                                    </div>
                                                    <span
                                                      aria-hidden="true"
                                                      className="faq-plus-ring relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-300 ease-out group-hover/faq:scale-105"
                                                      style={{
                                                        backgroundColor: homeTheme.accentSoft,
                                                        borderColor: homeTheme.ghost,
                                                      }}
                                                    >
                                                      <span
                                                        className="faq-plus-line absolute h-[2px] w-4 rounded-full transition-colors duration-300"
                                                        style={{ backgroundColor: homeTheme.ink }}
                                                      />
                                                      <span
                                                        className="faq-plus-line faq-plus-vertical absolute h-[2px] w-4 rotate-90 rounded-full transition-all duration-300"
                                                        style={{ backgroundColor: homeTheme.ink }}
                                                      />
                                                    </span>
                                                  </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pb-5">
                                                  <div
                                                    className="max-w-3xl pr-8 text-[0.98rem] leading-7 tracking-[0] [&_p]:mb-4 [&_a]:underline [&_a]:underline-offset-4"
                                                    style={{ color: homeTheme.muted }}
                                                    dangerouslySetInnerHTML={{
                                                      __html: item.answer,
                                                    }}
                                                  />
                                                </AccordionContent>
                                              </AccordionItem>
                                            )
                                          )}
                                        </Accordion>
                                      </div>
                                    </section>
                                  );

                                case "ai_prompt":
                                  return (
                                    <div
                                      key={index}
                                      className="group relative my-10 rounded-xl border border-border/60 bg-white/[0.02] p-6"
                                    >
                                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-white/56 hover:bg-white/[0.04] hover:text-white"
                                          onClick={async () => {
                                            // Handle both flat (prompt) and nested (content) structures
                                            const text =
                                              section.prompt ||
                                              section.content?.prompt ||
                                              section.content ||
                                              "";
                                            const copied =
                                              await copyTextToClipboard(text);
                                            if (copied)
                                              toast.success(
                                                "Prompt copied to clipboard!"
                                              );
                                          }}
                                        >
                                          <Copy className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="flex items-start gap-3">
                                        <div className="mt-1 rounded-md bg-white/[0.04] p-1.5 text-white/62">
                                          <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/56">
                                            AI Prompt
                                          </p>
                                          <p className="font-mono whitespace-pre-wrap text-sm leading-relaxed text-white/86">
                                            {section.prompt ||
                                              section.content?.prompt ||
                                              section.content ||
                                              ""}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );

                                default:
                                  return null;
                              }
                            })();

                            if (!renderedSection) return null;

                            return (
                              <MotionReveal
                                key={`article-content-section-${index}`}
                                className="article-body-reveal"
                                delay={(index % 4) * 45}
                              >
                                {renderedSection}
                              </MotionReveal>
                            );
                          }
                        );
                      })()}
                  </div>
                </div>

                {/* Tags Section */}
                {article.tags && article.tags.length > 0 && (
                  <MotionReveal className="article-body-reveal" delay={80}>
                    <div
                      className="mx-auto mt-16 max-w-[54rem] border-t pt-12"
                      style={{ borderColor: homeTheme.ghost }}
                    >
                      <h3
                        className="mb-4 text-[1.08rem] font-semibold tracking-[0]"
                        style={{
                          color: homeTheme.muted,
                          fontFamily: HOME_DISPLAY_FONT,
                          fontStretch: "condensed",
                        }}
                      >
                        Tagged With
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {article.tags.map((tag: any) => (
                          <span
                            key={tag.id}
                            className="rounded-full border px-4 py-2 text-[0.86rem] font-medium leading-none tracking-[0]"
                            style={{
                              backgroundColor: homeTheme.accentSoft,
                              borderColor: homeTheme.ghost,
                              color: homeTheme.ink,
                            }}
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </MotionReveal>
                )}

                {/* Author Bio with Engagement */}
                <MotionReveal className="article-body-reveal" delay={80}>
                  <div
                    className="mx-auto mt-16 max-w-[54rem] pt-12"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-border/60 shadow-lg">
                          <img
                            src={AUTHOR_HEADSHOT_URL}
                            alt="Brandon PT Davis"
                            className="h-full w-full translate-y-[16%] scale-[1.34] object-cover object-center"
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="mb-2 text-2xl font-semibold tracking-[0]"
                          style={{
                            color: homeTheme.ink,
                            fontFamily: HOME_DISPLAY_FONT,
                            fontStretch: "condensed",
                          }}
                        >
                          Brandon PT Davis
                        </h3>
                        <p
                          className="mb-4 text-sm font-medium tracking-[0]"
                          style={{ color: homeTheme.muted }}
                        >
                          Scenic Designer
                        </p>
                        <p
                          className="mb-6 leading-relaxed tracking-[0]"
                          style={{ color: homeTheme.muted }}
                        >
                          Brandon PT Davis is a scenic designer based in San
                          Diego. His work explores the intersection of physical
                          space, digital technology, and narrative storytelling.
                        </p>
                      </div>
                    </div>
                  </div>
                </MotionReveal>

                {/* Related Articles */}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </article>

      {linkedScenicProjects.length > 0 && (
        <section className={`article-editorial article-editorial-light ${related.length > 0 ? "pb-10" : "pb-20"}`}>
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <div
              className="border-t pt-12"
              style={{ borderColor: homeTheme.ghost }}
            >
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p
                    className="mb-3 text-[0.72rem] font-medium uppercase tracking-[0.18em]"
                    style={{ color: homeTheme.muted }}
                  >
                    Scenic Design Project
                  </p>
                  <h2
                    className="text-2xl font-semibold tracking-[0] md:text-3xl"
                    style={{
                      color: homeTheme.ink,
                      fontFamily: HOME_DISPLAY_FONT,
                      fontStretch: "condensed",
                    }}
                  >
                    Related production
                  </h2>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 gap-6 ${linkedScenicProjects.length === 1 ? "lg:grid-cols-6" : "lg:grid-cols-3"}`}
              >
                {linkedScenicProjects.map(project => {
                  if (!project) return null;
                  const singleProject = linkedScenicProjects.length === 1;
                  return (
                    <Link
                      key={project.slug}
                      href={`/project/${project.slug}`}
                      className={`${singleProject ? "lg:col-span-2 xl:col-span-1" : ""} no-underline`}
                    >
                      <div
                        className="group h-full cursor-pointer overflow-hidden rounded-lg border transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          backgroundColor: homeTheme.accentSoft,
                          borderColor: homeTheme.ghost,
                        }}
                      >
                        <div className="aspect-square overflow-hidden bg-black/[0.035]">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : null}
                        </div>

                        <div className="p-4">
                          <h3
                            className={`${singleProject ? "line-clamp-2 text-[1.35rem]" : "line-clamp-3 text-[1.45rem]"} mb-3 font-semibold leading-[1.08] tracking-[0] transition-opacity group-hover:opacity-75`}
                            style={{
                              color: homeTheme.ink,
                              fontFamily: HOME_DISPLAY_FONT,
                              fontStretch: "condensed",
                            }}
                          >
                            {project.title}
                          </h3>
                          <div
                            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] tracking-[0]"
                            style={{ color: homeTheme.muted }}
                          >
                            <span>
                              {project.subcategory || "Scenic Design"}
                            </span>
                            {project.client ? (
                              <span>{project.client}</span>
                            ) : null}
                            {project.year ? <span>{project.year}</span> : null}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="article-editorial article-editorial-light pb-20">
          <div className="w-full px-[clamp(1.5rem,5vw,6rem)]">
            <div
              className="border-t pt-12 md:pt-14"
              style={{ borderColor: homeTheme.ghost }}
            >
              <MotionReveal className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p
                    className="mb-4 text-[clamp(1rem,1.25vw,1.12rem)] font-medium leading-[1.08] tracking-[0]"
                    style={{ color: homeTheme.muted }}
                  >
                    {isLearningPortalArticle
                      ? "Scenic design archive"
                      : "Scenic design writing"}
                  </p>
                  <h2
                    className="max-w-[12ch] text-[clamp(2.25rem,4.2vw,4.2rem)] font-semibold leading-[0.92] tracking-[0]"
                    style={{
                      color: homeTheme.ink,
                      fontFamily: HOME_DISPLAY_FONT,
                      fontStretch: "condensed",
                    }}
                  >
                    {isLearningPortalArticle
                      ? "Keep learning."
                      : article.series
                        ? `More in ${article.series.name}`
                        : "Keep reading."}
                  </h2>
                </div>
                <Link
                  href={articleBasePath}
                  className="inline-flex h-11 w-fit items-center justify-center rounded-full border px-5 text-[0.95rem] font-semibold tracking-[0] shadow-[0_10px_30px_rgba(17,17,17,0.12)] transition-opacity hover:opacity-75 md:justify-self-end"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    borderColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
                >
                  View articles
                </Link>
              </MotionReveal>

              <div
                ref={relatedArticleRailRef}
                className="overflow-x-auto pb-7 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="flex min-w-max snap-x snap-mandatory gap-5 pr-5">
                  {related.map((relatedArticle, index) => {
                    const relatedTitle = decodeHTMLEntities(
                      isLearningPortalArticle
                        ? relatedArticle.title
                            .replace(/^Vectorworks Tutorial:\s*/i, "")
                            .replace(/^Vectorworks Quick Tip:\s*/i, "")
                            .trim()
                        : relatedArticle.title
                    );
                    const dateLabel = formatUtcDate(
                      relatedArticle.publishedAt,
                      "short"
                    );
                    const metadata = [
                      dateLabel,
                      relatedArticle.readTime
                        ? `${relatedArticle.readTime} min read`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ");
                    const relatedDescription = getHtmlTextContent(
                      relatedArticle.excerpt ||
                        relatedArticle.seoDescription ||
                        ""
                    );
                    const relatedExcerpt =
                      relatedDescription.length > 112
                        ? `${relatedDescription.slice(0, 109).trim()}...`
                        : relatedDescription;

                    return (
                      <MotionReveal
                        key={relatedArticle.id}
                        className="h-full w-[min(18.5rem,78vw)] flex-none snap-start sm:w-[19.5rem] lg:w-[21rem]"
                        delay={(index % 6) * 80}
                      >
                        <Link
                          href={`${articleBasePath}/${relatedArticle.slug}`}
                          className="publish-motion-card group relative flex h-[25rem] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-black p-5 text-white no-underline shadow-[0_12px_28px_rgba(0,0,0,0.2)] ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(0,0,0,0.24)] md:h-[28rem] md:rounded-[1.5rem] md:p-6"
                          aria-label={`Article: ${relatedTitle}`}
                        >
                          {relatedArticle.coverImageUrl ? (
                            <img
                              src={relatedArticle.coverImageUrl}
                              alt={
                                relatedArticle.coverImageAlt ||
                                decodeHTMLEntities(relatedArticle.title)
                              }
                              className="site-media-square absolute inset-0 h-full w-full object-cover motion-safe:scale-[1.015] motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-black" />
                          )}
                          <div className="absolute inset-0 bg-black/18" />
                          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/48 to-transparent" />
                          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/28 to-transparent" />

                          <div className="relative z-10">
                            <p className="text-[0.74rem] font-semibold tracking-[0] text-white/68">
                              {relatedArticle.categoryName || "Article"}
                            </p>
                            <h3 className="mt-3 line-clamp-3 max-w-[13ch] text-[1.64rem] font-medium leading-[0.98] tracking-[0] text-white transition-opacity duration-500 group-hover:opacity-85">
                              {relatedTitle}
                            </h3>
                            {relatedExcerpt ? (
                              <p className="mt-4 line-clamp-3 max-w-[18rem] text-[0.94rem] leading-6 tracking-[0] text-white/68">
                                {relatedExcerpt}
                              </p>
                            ) : null}
                            {metadata ? (
                              <p className="mt-5 text-[0.78rem] font-semibold tracking-[0] text-white/64">
                                {metadata}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                      </MotionReveal>
                    );
                  })}
                </div>
              </div>

              <div className="-mt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => scrollRelatedArticles("previous")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-75"
                  style={{
                    backgroundColor: homeTheme.accentSoft,
                    borderColor: homeTheme.ghost,
                    color: homeTheme.ink,
                  }}
                  aria-label="Previous related article cards"
                >
                  <ChevronLeft
                    className="h-5 w-5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRelatedArticles("next")}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-opacity hover:opacity-75"
                  style={{
                    backgroundColor: homeTheme.controlBg,
                    borderColor: homeTheme.controlBg,
                    color: homeTheme.controlInk,
                  }}
                  aria-label="Next related article cards"
                >
                  <ChevronRight
                    className="h-5 w-5"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div
        className="relative z-20"
        style={{ backgroundColor: homeTheme.bg, color: homeTheme.ink }}
      >
        <Footer tone="light" variant="standard" />
      </div>

      <style>{`
        .article-detail-page {
          --article-body-font: ${HOME_BODY_FONT};
          --article-display-font: ${HOME_DISPLAY_FONT};
          --article-copy: color-mix(in srgb, var(--article-ink) 84%, transparent);
          --article-copy-strong: var(--article-ink);
          --article-copy-muted: var(--article-muted);
          --article-rule: var(--article-ghost);
        }

        .article-editorial {
          color: var(--article-ink);
          font-family: var(--article-body-font);
        }

        .article-editorial h1,
        .article-editorial h2,
        .article-editorial h3,
        .article-editorial h4 {
          font-family: var(--article-display-font);
          letter-spacing: 0;
        }

        .article-editorial-article {
          color: var(--article-ink);
        }

        .article-editorial-article > section:not(:first-child) {
          color: var(--article-ink);
        }

        .article-editorial-article > section:not(:first-child) [class*="text-white"] {
          color: var(--article-muted) !important;
        }

        .article-editorial-article > section:not(:first-child) [class*="border-white"] {
          border-color: var(--article-rule) !important;
        }

        .article-editorial-article > section:not(:first-child) [class*="hover:text-white"]:hover {
          color: var(--article-ink) !important;
        }

        .article-editorial-article .article-content,
        .article-editorial-article .article-content p,
        .article-editorial-article .article-content li,
        .article-editorial-article .article-content dd,
        .article-editorial-article .article-content figcaption {
          color: var(--article-copy) !important;
        }

        .article-editorial-article .article-content p,
        .article-editorial-article .article-content li {
          font-size: clamp(1.04rem, 1.18vw, 1.12rem) !important;
          font-weight: 430 !important;
          line-height: 1.76 !important;
          letter-spacing: 0 !important;
        }

        .article-editorial-article .article-content [class*="text-white"] {
          color: var(--article-copy) !important;
        }

        .article-editorial-article .article-content [class*="bg-white"] {
          background-color: var(--article-accent-soft) !important;
        }

        .article-editorial-article .article-content h2,
        .article-editorial-article .article-content h3,
        .article-editorial-article .article-content h4,
        .article-editorial-article .article-content strong,
        .article-editorial-article .article-content blockquote p {
          color: var(--article-copy-strong) !important;
        }

        .article-editorial-article .article-content h2 {
          font-weight: 900 !important;
          line-height: 0.9 !important;
          letter-spacing: 0 !important;
          text-transform: uppercase;
        }

        .article-editorial-article .article-content h3 {
          font-weight: 850 !important;
          line-height: 0.96 !important;
          letter-spacing: 0 !important;
        }

        .article-editorial-article .article-content h4 {
          font-weight: 760 !important;
          letter-spacing: 0.04em !important;
        }

        .article-editorial-article .article-content a {
          color: var(--article-copy-strong) !important;
          text-decoration-color: var(--article-copy-muted) !important;
        }

        .article-editorial-article .article-content p::first-letter {
          float: none !important;
          margin: 0 !important;
          color: inherit !important;
          font: inherit !important;
          letter-spacing: inherit !important;
          line-height: inherit !important;
        }

        .article-editorial-article .article-content [class*="border-white"] {
          border-color: var(--article-rule) !important;
        }

        .article-editorial .article-content [data-slot="accordion-trigger"] {
          background-color: transparent !important;
          background-image: none !important;
        }

        .article-editorial-article .article-content ul li::marker,
        .article-editorial-article .article-content ol li::marker {
          color: var(--article-copy-muted) !important;
        }

        .article-editorial-light {
          color: var(--article-ink);
        }

        .article-editorial-light .article-content,
        .article-editorial-light .article-content p,
        .article-editorial-light .article-content li,
        .article-editorial-light .article-content figcaption {
          color: rgba(17, 17, 17, 0.72) !important;
        }

        .article-editorial-light .article-content h2,
        .article-editorial-light .article-content h3,
        .article-editorial-light .article-content h4,
        .article-editorial-light .article-content strong {
          color: #111111 !important;
        }

        .article-editorial-light .article-content a {
          color: #111111 !important;
          text-decoration-color: rgba(17, 17, 17, 0.32) !important;
        }

        .article-editorial-light .article-content p::first-letter {
          color: #111111 !important;
        }

        .article-editorial-learning .article-content {
          font-family: var(--article-body-font);
        }

        .article-editorial-learning .article-content h2 {
          margin-top: 5rem !important;
          margin-bottom: 1.5rem !important;
          color: #1d1d1f !important;
          font-size: clamp(1.5rem, 2.15vw, 1.95rem) !important;
          font-weight: 650 !important;
          line-height: 1.04 !important;
          letter-spacing: -0.045em !important;
          text-wrap: balance;
        }

        .article-editorial-learning .article-content h3 {
          margin-top: 3rem !important;
          margin-bottom: 1rem !important;
          color: #24211f !important;
          font-size: clamp(1.35rem, 1.75vw, 1.7rem) !important;
          font-weight: 620 !important;
          line-height: 1.1 !important;
          letter-spacing: -0.035em !important;
          text-wrap: balance;
        }

        .article-editorial-learning .article-content .article-learning-numbered-heading {
          margin-top: 5rem !important;
          margin-bottom: 1.5rem !important;
          color: #1d1d1f !important;
          font-size: clamp(1.5rem, 2.15vw, 1.95rem) !important;
          font-weight: 650 !important;
          line-height: 1.04 !important;
          letter-spacing: -0.045em !important;
          text-wrap: balance;
        }

        .article-editorial-learning .article-content h4 {
          margin-top: 2.25rem !important;
          margin-bottom: 0.75rem !important;
          color: rgba(17, 17, 17, 0.72) !important;
          font-size: 1.08rem !important;
          font-weight: 540 !important;
          line-height: 1.28 !important;
          letter-spacing: -0.025em !important;
          text-transform: none !important;
        }

        .article-editorial-learning .article-content p,
        .article-editorial-learning .article-content li {
          color: rgba(17, 17, 17, 0.74) !important;
          font-size: 1.06rem !important;
          font-weight: 400 !important;
          line-height: 1.82 !important;
          letter-spacing: -0.015em !important;
        }

        .article-editorial-learning .article-content blockquote p {
          color: #111111 !important;
          font-size: clamp(1.28rem, 1.85vw, 1.72rem) !important;
          font-weight: 560 !important;
          line-height: 1.22 !important;
          letter-spacing: -0.04em !important;
        }

        .article-editorial-learning .article-content figcaption {
          color: rgba(17, 17, 17, 0.58) !important;
          font-size: 0.92rem !important;
          line-height: 1.55 !important;
          letter-spacing: -0.01em !important;
        }

        .article-editorial-learning .article-content p::first-letter {
          float: none !important;
          margin: 0 !important;
          color: inherit !important;
          font: inherit !important;
          letter-spacing: inherit !important;
          line-height: inherit !important;
        }

        .article-editorial-learning .uppercase {
          text-transform: none !important;
          letter-spacing: -0.018em !important;
        }

        .article-editorial .article-content ul,
        .article-editorial .article-content ol {
          list-style-position: outside !important;
          padding-left: 1.75rem !important;
        }

        .article-editorial .article-content ul {
          list-style-type: disc !important;
        }

        .article-editorial .article-content ol {
          list-style-type: decimal !important;
        }

        .article-editorial .article-content li {
          display: list-item !important;
          padding-left: 0.2rem !important;
        }

        .article-editorial .article-content ul li::marker,
        .article-editorial .article-content ol li::marker {
          color: var(--article-copy-strong) !important;
          font-weight: 700 !important;
        }

        .article-editorial .article-content img,
        .article-editorial .article-content video,
        .article-editorial .article-content iframe {
          border-radius: 1.35rem !important;
          box-shadow: none;
        }

        .article-editorial .article-content figure img,
        .article-editorial .article-content figure video,
        .article-editorial .article-content figure iframe {
          overflow: hidden;
        }

        .article-editorial .article-inline-video {
          margin-left: auto;
          margin-right: auto;
        }

        .article-editorial .article-inline-video > div {
          border-radius: 1.35rem !important;
          background: transparent !important;
          box-shadow: none !important;
        }

        .article-editorial .article-inline-video video {
          border-radius: 1.35rem !important;
          background: #050505 !important;
          box-shadow: none !important;
        }

        /* WordPress Gallery Styles - Horizontal Scroll */
        .article-content .wp-block-gallery,
        .article-content .blocks-gallery-grid {
          display: flex !important;
          gap: 1rem !important;
          overflow-x: auto !important;
          scroll-snap-type: x mandatory !important;
          padding-bottom: 1rem !important;
          margin: 3rem -1rem !important;
          list-style: none !important;
        }

        .article-content .wp-block-gallery figure,
        .article-content .blocks-gallery-grid figure {
          flex: none !important;
          width: 80% !important;
          scroll-snap-align: center !important;
          margin: 0 !important;
        }

        .article-content .wp-block-gallery img,
        .article-content .blocks-gallery-grid img {
          width: 100% !important;
          height: auto !important;
          object-fit: contain !important;
          border-radius: 1rem !important;
          cursor: pointer !important;
          transition: transform 0.3s ease !important;
        }

        .article-content .wp-block-gallery img:hover,
        .article-content .blocks-gallery-grid img:hover {
          transform: scale(1.02) !important;
        }

        /* WordPress Image Styles - Beveled */
        .article-content img {
          border-radius: 0 !important;
        }

        /* Scrollbar Styling */
        .article-content ::-webkit-scrollbar {
          height: 8px;
        }

        .article-content ::-webkit-scrollbar-track {
          background: hsl(var(--muted));
          border-radius: 4px;
        }

        .article-content ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.22);
          border-radius: 4px;
        }

        .article-content ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.32);
        }
      `}</style>

      {/* Lightbox for image viewing */}
      {lightboxIndex !== null && lightboxImages.length > 0 ? (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex(current =>
              current === null
                ? 0
                : Math.min(current + 1, lightboxImages.length - 1)
            )
          }
          onPrev={() =>
            setLightboxIndex(current =>
              current === null ? 0 : Math.max(current - 1, 0)
            )
          }
        />
      ) : null}
    </div>
  );
}
