import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from '@/components/ProgressiveImage';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { proxyImageUrl } from "@/lib/imageProxy";
import { Sparkles, Copy, Check, ChevronLeft, ChevronRight, Link as LinkIcon, Play, Pause } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalArticleRecordBySlug, getLocalArticles } from "@shared/localArticles";
import { getLocalScenicProjectBySlug } from "@shared/localScenicProjects";

// Decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const normalizeQuoteText = (text: string): string => {
  const decoded = decodeHTMLEntities(text || '').trim();
  return decoded.replace(/^["“”']+|["“”']+$/g, '').trim();
};

const getArticleMediaUrl = (url: string): string => {
  if (!url) return url;
  if (url.includes("supabase.co/storage/v1/object/public/")) {
    return url;
  }
  return proxyImageUrl(url, 1920);
};

// Process HTML content to proxy external images
const processHTMLImages = (html: string): string => {
  if (!html) return html;

  const div = document.createElement('div');
  div.innerHTML = html;

  // Find all img tags and proxy their source attrs
  const images = div.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy-src');
    const srcset = img.getAttribute('srcset') || img.getAttribute('data-srcset');

    if (src) {
      img.setAttribute('src', getArticleMediaUrl(src));
    } else if (srcset) {
      // Safari-safe fallback: use first candidate URL as src if src is missing.
      const firstCandidate = srcset
        .split(',')
        .map((entry) => entry.trim().split(/\s+/)[0])
        .find(Boolean);
      if (firstCandidate) {
        img.setAttribute('src', getArticleMediaUrl(firstCandidate));
      }
    }

    // Prevent malformed legacy srcset strings from breaking image selection.
    img.removeAttribute('srcset');
    img.removeAttribute('sizes');
  });

  return div.innerHTML;
};

export default function ArticleDetail() {
  return <ArticleDetailContent />;
}

function ArticleInlineVideo({ url, caption }: { url: string; caption?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;
    if (!frame || !video) return;

    video.muted = true;
    video.playsInline = true;
    video.loop = true;

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
    <figure className="my-12">
      <div
        ref={frameRef}
        className="group relative overflow-hidden rounded-[1rem] bg-black shadow-2xl"
      >
        <video
          ref={videoRef}
          className="h-auto w-full"
          playsInline
          muted
          loop
          preload="metadata"
        >
          <source src={url} type="video/mp4" />
        </video>
        <button
          type="button"
          aria-label={isPlaying ? "Pause video" : "Play video"}
          onClick={handleToggle}
          className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-black/40 text-white/80 opacity-0 backdrop-blur transition-all duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:border-white/24 hover:text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
        </button>
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/42">
          {decodeHTMLEntities(caption)}
        </figcaption>
      )}
    </figure>
  );
}

function ArticleDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const article = getLocalArticleRecordBySlug(slug);

  const galleryRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{ src: string; alt?: string }>>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioDurationSeconds, setAudioDurationSeconds] = useState<number | null>(null);
  const [audioCurrentTimeSeconds, setAudioCurrentTimeSeconds] = useState(0);

  const scrollGallery = (sectionIndex: number, direction: "prev" | "next") => {
    const container = galleryRefs.current[sectionIndex];
    if (!container) return;
    const figures = Array.from(container.querySelectorAll("figure")) as HTMLElement[];
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
        ? Math.min(figures.length - 1, currentIndex === 0 ? 2 : currentIndex + 2)
        : Math.max(0, currentIndex <= 2 ? 0 : currentIndex - 2);

    container.scrollTo({
      left: figures[targetIndex].offsetLeft,
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
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      toast.success("Link copied to clipboard");
      window.setTimeout(() => setLinkCopied(false), 1800);
    } catch {
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
    if (articleAudio?.durationLabel && !isAudioPlaying && !audioDurationSeconds) {
      return articleAudio.durationLabel;
    }

    if (!audioDurationSeconds || Number.isNaN(audioDurationSeconds)) {
      return articleAudio?.durationLabel || null;
    }

    if (!isAudioPlaying) {
      return articleAudio?.durationLabel || formatAudioDuration(audioDurationSeconds);
    }

    const remaining = Math.max(0, audioDurationSeconds - audioCurrentTimeSeconds);
    return formatAudioDuration(remaining);
  })();

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-['Playfair_Display'] italic mb-4">Article Not Found</h1>
          <p className="mb-8 text-white/62">The article you're looking for doesn't exist.</p>
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
    contentSections = typeof article.content === 'string'
      ? JSON.parse(article.content)
      : article.content || [];
  } catch (e) {
    contentSections = [{ type: 'html', content: article.content }];
  }

  // Detect and group FAQ sections
  const processedSections: any[] = [];
  let i = 0;
  while (i < contentSections.length) {
    const section = contentSections[i];

    // Check if this is an FAQ heading
    if (section.type === 'heading' && section.level === 2 &&
      (section.text || '').toLowerCase().includes('frequently asked questions')) {
      // Collect all FAQ items (H3 questions followed by paragraphs)
      const faqItems: Array<{ question: string; answer: string }> = [];
      i++; // Move past FAQ heading

      while (i < contentSections.length) {
        const current = contentSections[i];

        // FAQ question (H3 ending with ?)
        if (current.type === 'heading' && current.level === 3) {
          const question = (current.text || '').replace(/\+$/, ''); // Remove trailing +
          i++;

          // Collect answer text/paragraphs until next heading
          const answerParts: string[] = [];
          while (i < contentSections.length &&
            !(contentSections[i].type === 'heading')) {
            if (contentSections[i].type === 'paragraph' || contentSections[i].type === 'text') {
              answerParts.push(contentSections[i].content || contentSections[i].text || '');
            }
            i++;
          }

          faqItems.push({ question, answer: answerParts.join('\n\n') });

          // If we hit another H2, break out of FAQ section
          if (i < contentSections.length &&
            contentSections[i].type === 'heading' &&
            contentSections[i].level === 2) {
            break;
          }
        } else {
          break;
        }
      }

      if (faqItems.length > 0) {
        processedSections.push({ type: 'faq', items: faqItems });
      }
      continue; // Don't increment i, already moved past FAQ
    }

    // Check for plain-text FAQ format in HTML content (Q: and A: pattern)
    if (section.type === 'html' && section.content) {
      const htmlContent = section.content;


      // Extract text content from HTML to find Q&A pairs
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      const textContent = tempDiv.textContent || '';

      // Look for Q: and A: pattern in the text content
      const lines = textContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      const faqItems: Array<{ question: string; answer: string }> = [];


      let qCount = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('Q:')) {
          qCount++;
          const question = line.substring(2).trim();
          // Look for the corresponding A: on the next line
          if (i + 1 < lines.length && lines[i + 1].startsWith('A:')) {
            const answer = lines[i + 1].substring(2).trim();
            faqItems.push({ question, answer });
            i++; // Skip the answer line
          }
        }
      }


      // If we found FAQ items (at least 3 Q&A pairs), convert this section to FAQ accordion
      if (faqItems.length >= 3) {


        // Check if there's an FAQ heading in this section
        const faqHeadingMatch = htmlContent.match(/<h2[^>]*>.*?FAQ.*?<\/h2>/i);
        if (faqHeadingMatch) {
          const faqHeadingIndex = htmlContent.indexOf(faqHeadingMatch[0]);
          const beforeFaq = htmlContent.substring(0, faqHeadingIndex).trim();
          if (beforeFaq) {
            processedSections.push({ type: 'html', content: beforeFaq });
          }
        }

        // FAQ accordion
        processedSections.push({ type: 'faq', items: faqItems });

        continue;
      }
    }

    processedSections.push(section);
    i++;
  }

  // Calculate read time
  const wordCount = JSON.stringify(contentSections).split(/\s+/).length;

  const articleImageSlides: Array<{ key: string; src: string; alt?: string }> = [];
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
    setLightboxImages(articleImageSlides.map(({ src, alt }) => ({ src, alt })));
    setLightboxIndex(imageIndexByKey.get(key) ?? 0);
    setLightboxOpen(true);
  };

  const linkedScenicProjects = (article.linkedScenicProjectSlugs || [])
    .map((projectSlug: string) => getLocalScenicProjectBySlug(projectSlug))
    .filter(Boolean);

  const relatedCandidates = getLocalArticles()
    .map((candidate) => getLocalArticleRecordBySlug(candidate.slug))
    .filter((candidate): candidate is NonNullable<typeof article> => Boolean(candidate))
    .filter((candidate) => candidate.id !== article.id);

  const sameSeries = article.series
    ? relatedCandidates.filter((candidate) => candidate.series?.slug === article.series?.slug)
    : [];
  const sameCategory = relatedCandidates.filter((candidate) => candidate.categoryName === article.categoryName);
  const related = [...sameSeries, ...sameCategory].filter(
    (candidate, index, array) => array.findIndex((item) => item.id === candidate.id) === index
  ).slice(0, 4);
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

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.title} | Brandon PT Davis`}
        description={articleDescription}
        image={article.coverImageUrl || undefined}
        imageAlt={article.coverImageAlt || article.title}
        type="article"
        author="Brandon PT Davis"
        publishedTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
        modifiedTime={article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined}
        keywords={articleKeywords}
        url={`https://www.brandonptdavis.com/articles/${article.slug}`}
      />
      <StructuredData
        type="Article"
        article={{
          headline: article.title,
          description: articleDescription,
          image: article.coverImageUrl || undefined,
          author: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date(article.createdAt).toISOString(),
          dateModified: article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          },
          url: `https://www.brandonptdavis.com/articles/${article.slug}`,
          wordCount: wordCount,
          keywords: articleKeywords.split(',').map(k => k.trim()).filter(Boolean),
          ...(article.series
            ? {
                isPartOf: {
                  name: article.series.name,
                  url: `https://www.brandonptdavis.com/articles?series=${article.series.slug}`,
                },
              }
            : {}),
          about: [
            article.categoryName ? { type: "Thing", name: article.categoryName } : null,
            ...linkedScenicProjects
              .filter((project): project is NonNullable<(typeof linkedScenicProjects)[number]> => Boolean(project))
              .map((project) => ({
              type: "CreativeWork",
              name: project.title,
              url: `https://www.brandonptdavis.com/project/${project.slug}`,
              })),
          ].filter(Boolean) as Array<{ type?: string; name: string; url?: string }>,
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Articles", url: "https://www.brandonptdavis.com/articles" },
          { name: article.title, url: `https://www.brandonptdavis.com/articles/${article.slug}` },
        ]}

      />
      <Header />
      <article className="py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto max-w-5xl text-center">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-white/54">
              <time dateTime={new Date(article.publishedAt || article.createdAt).toISOString()}>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
              {article.categoryName ? (
                <Link
                  href={`/articles?category=${encodeURIComponent(article.categoryName)}`}
                  className="transition-colors hover:text-white"
                >
                  {article.categoryName}
                </Link>
              ) : null}
              {article.series ? (
                <span>{article.series.name}</span>
              ) : null}
            </div>

            <h1 className="mx-auto mt-5 max-w-[14ch] font-sans text-[clamp(2.7rem,5.8vw,5.9rem)] font-medium leading-[0.92] tracking-[-0.072em] text-white">
              {decodeHTMLEntities(article.title)}
            </h1>

            {article.excerpt && (
              <p className="mx-auto mt-5 max-w-[38rem] text-[clamp(1rem,1.45vw,1.34rem)] leading-[1.62] tracking-[-0.018em] text-white/68">
                {decodeHTMLEntities(article.excerpt)}
              </p>
            )}

            {article.series ? (
              <p className="mx-auto mt-5 max-w-[38rem] text-[0.88rem] font-medium uppercase tracking-[0.16em] text-white/42">
                Part {article.series.order} of {article.series.name}
              </p>
            ) : null}

            {article.coverImageUrl && (
              <div className="mx-auto mt-10 max-w-[82rem] overflow-hidden rounded-xl">
                <img
                  src={article.coverImageUrl}
                  alt={article.coverImageAlt || article.title}
                  loading="eager"
                  decoding="async"
                  className="h-auto w-full cursor-pointer object-cover"
                  onClick={() => openArticleLightboxAt("cover")}
                />
              </div>
            )}

            <div className="mx-auto mt-8 flex w-full max-w-[58rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-white/72">
              <div className="flex items-center gap-4 sm:gap-5">
                {articleAudio ? (
                  <>
                    <audio
                      ref={audioRef}
                      preload="metadata"
                      src={articleAudio.url}
                      onLoadedMetadata={(event) => setAudioDurationSeconds(event.currentTarget.duration || null)}
                      onTimeUpdate={(event) => setAudioCurrentTimeSeconds(event.currentTarget.currentTime || 0)}
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
                      className="inline-flex items-center gap-3 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-white"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/6">
                        {isAudioPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                      </span>
                      <span>{articleAudio.label || "Listen to article"}</span>
                    </button>
                    {displayedAudioTime ? (
                      <span className="text-[0.96rem] tracking-[-0.018em] text-white/62">
                        {displayedAudioTime}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-white"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </header>

          {linkedScenicProjects.length > 0 ? (
            <div className="mx-auto mt-12 max-w-[58rem] border-t border-white/12 pt-10">
              <p className="mb-6 font-sans text-[1.05rem] tracking-[-0.02em] text-white">
                Scenic Design Project
              </p>
              <div className="grid gap-6 md:grid-cols-2">
                {linkedScenicProjects.map((project) => {
                  if (!project) return null;
                  return (
                  <Link key={project.slug} href={`/project/${project.slug}`}>
                    <div className="group flex cursor-pointer items-start gap-5">
                      <div className="relative h-32 w-32 flex-none overflow-hidden rounded-xl bg-black/85">
                        {project.coverImageUrl ? (
                          <img
                            src={project.coverImageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 pt-1">
                        <h3 className="text-[1.18rem] leading-[1.16] tracking-[-0.03em] text-white/92 transition-colors group-hover:text-white">
                          {project.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-white/52">
                          <span>{project.subcategory || "Scenic Design"}</span>
                          {project.client ? <span>{project.client}</span> : null}
                          {project.year ? <span>{project.year}</span> : null}
                        </div>
                      </div>
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mx-auto mt-14 max-w-[58rem]">
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
                  className="article-content article-content-${article.id} article-html-content mx-auto max-w-[56ch]
                  prose prose-lg prose-invert
                  prose-headings:font-sans prose-headings:font-medium prose-headings:leading-[0.98] prose-headings:tracking-[-0.05em]
                  prose-h2:text-[clamp(2rem,2.75vw,2.8rem)] prose-h2:mt-20 prose-h2:mb-6 prose-h2:scroll-mt-24 prose-h2:text-white
                  prose-h3:text-[clamp(1.5rem,2vw,1.95rem)] prose-h3:mt-14 prose-h3:mb-4 prose-h3:leading-[1.02] prose-h3:text-white/98
                  prose-h4:text-[0.95rem] prose-h4:mt-10 prose-h4:mb-3 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-[0.18em] prose-h4:text-white/48
                  prose-p:text-white/80 prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-[1.02rem] md:prose-p:text-[1.06rem] prose-p:font-normal prose-p:tracking-[-0.01em]
                  prose-a:text-white prose-a:underline prose-a:decoration-white/35 prose-a:underline-offset-4 hover:prose-a:decoration-white/70 prose-a:font-medium
                  prose-strong:font-bold
                  prose-blockquote:border-0 prose-blockquote:pl-0 prose-blockquote:my-14 prose-blockquote:font-sans prose-blockquote:text-white
                  prose-ul:my-8 prose-ol:my-8 prose-ul:leading-[2] prose-ol:leading-[2] prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-8 prose-ol:pl-8
                  prose-li:my-1.5 prose-li:text-[1.0625rem] prose-li:leading-[1.75] prose-li:ml-0
                  [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item [&_li]:ml-0
                  prose-img:rounded-xl prose-img:my-12
                  prose-figure:my-12
                  prose-figcaption:text-[0.78rem] prose-figcaption:tracking-[0.12em] prose-figcaption:uppercase prose-figcaption:text-white/42 prose-figcaption:text-center prose-figcaption:mt-4
                  [&_iframe]:mx-auto [&_iframe]:w-full [&_iframe]:max-w-[58ch] [&_iframe]:my-12 [&_iframe]:rounded-xl [&_iframe]:aspect-[16/9] [&_iframe]:h-auto
                  [&_video]:mx-auto [&_video]:w-full [&_video]:max-w-[58ch] [&_video]:my-12 [&_video]:rounded-xl [&_video]:aspect-[16/9]
                  [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
                >
                  {Array.isArray(processedSections) && (() => {
                    let h2Index = 0;
                    return processedSections.map((section: any, index: number) => {
                    switch (section.type) {
                      case 'update_note':
                        return (
                          <div key={index} className="mb-12 p-6 rounded-xl border-2 border-primary/30 bg-primary/5 backdrop-blur-sm">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                              <p
                                className="text-sm leading-relaxed text-white/80 [&_strong]:text-base [&_strong]:font-bold [&_strong]:text-white"
                                dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.text || section.content || '') }}
                              />
                            </div>
                          </div>
                        );

                      case 'heading':
                        const level = section.level || 2;
                        const headingText = decodeHTMLEntities(section.text || section.content || '');
                        const isGhibliShowcaseHeading =
                          article.slug === "studio-ghibli-inspired-immersive-dining-experience" &&
                          level === 2 &&
                          headingText.trim().toLowerCase() === "visual showcase";
                        const numberedHeadingMatch = level === 3 ? headingText.match(/^(\d+)\.\s+(.+)$/) : null;
                        const headingClassName =
                          isGhibliShowcaseHeading
                            ? "mt-28 mb-12 text-center font-sans text-[clamp(3rem,4vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.075em] text-white"
                            : level === 2
                            ? "mt-24 mb-7 font-sans text-[clamp(2.3rem,3vw,3.2rem)] font-medium leading-[0.93] tracking-[-0.065em] text-white"
                            : level === 3
                              ? "mt-16 mb-5 font-sans text-[clamp(1.75rem,2.2vw,2.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-white"
                              : "mt-10 mb-3 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-white/48";

                        const headingId = level === 2
                          ? getHeadingId(headingText, h2Index)
                          : getHeadingId(headingText, index);

                        if (level === 2) {
                          h2Index += 1;
                        }

                        if (level === 2) {
                          return <h2 key={index} id={headingId} className={headingClassName}>{headingText}</h2>;
                        } else if (level === 3) {
                          if (numberedHeadingMatch) {
                            return (
                              <div key={index} className="mt-18 mb-7 border-t border-white/10 pt-6">
                                <div className="flex items-end gap-4 md:gap-5">
                                  <span className="shrink-0 font-sans text-[clamp(1.55rem,2.2vw,2rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white/34">
                                  {numberedHeadingMatch[1]}
                                  </span>
                                  <h3
                                    id={headingId}
                                    className="font-sans text-[clamp(2rem,2.35vw,2.5rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white"
                                  >
                                    {numberedHeadingMatch[2]}
                                  </h3>
                                </div>
                              </div>
                            );
                          }
                          return <h3 key={index} id={headingId} className={headingClassName}>{headingText}</h3>;
                        } else if (level === 4) {
                          return <h4 key={index} id={headingId} className={headingClassName}>{headingText}</h4>;
                        } else {
                          return <h2 key={index} id={headingId} className={headingClassName}>{headingText}</h2>;
                        }

                      case 'paragraph':
                        return (
                          <p
                            key={index}
                            className="mb-8 text-[1.02rem] leading-[1.9] tracking-[-0.01em] text-white/80 [&_strong]:font-bold [&_strong]:text-white"
                            dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.text || section.content || '') }}
                          />
                        );

                      case 'quote':
                        const quoteText = normalizeQuoteText(section.text || section.content || '');
                        return (
                          <blockquote key={index} className="my-16 py-2 text-center">
                            <p className="mx-auto max-w-[34rem] font-sans text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium leading-[1.28] tracking-[-0.04em] text-white/92">
                              <span aria-hidden="true" className="mr-[0.08em] text-white/54">“</span>
                              {quoteText}
                              <span aria-hidden="true" className="ml-[0.04em] text-white/54">”</span>
                            </p>
                            {section.author && (
                              <footer className="mt-5 text-[0.82rem] not-italic font-semibold uppercase tracking-[0.22em] text-white/42">
                                {decodeHTMLEntities(section.author)}
                              </footer>
                            )}
                          </blockquote>
                        );

                      case 'image':
                        if (section.display === 'artwork') {
                          return (
                            <figure
                              key={index}
                              className="relative left-1/2 my-12 w-screen max-w-[56rem] -translate-x-1/2 px-5 sm:px-6"
                            >
                              <div className="overflow-hidden rounded-[0.8rem]">
                                <img
                                  src={getArticleMediaUrl(section.url)}
                                  alt={section.alt || section.caption || ''}
                                  loading="lazy"
                                  decoding="async"
                                  className="h-auto w-full cursor-pointer transition-opacity hover:opacity-90"
                                  onClick={() => openArticleLightboxAt(`image-${index}`)}
                                />
                              </div>
                              {(section.caption || section.alt) && (
                                <figcaption className="mx-auto mt-4 max-w-[38rem] text-[0.78rem] font-medium uppercase tracking-[0.12em] leading-5 text-white/42">
                                  {decodeHTMLEntities(section.caption || section.alt || '')}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }

                        if (section.display === 'infographic') {
                          return (
                            <figure
                              key={index}
                              className="mx-auto my-8 max-w-[46rem]"
                            >
                              <img
                                src={getArticleMediaUrl(section.url)}
                                alt={section.alt || section.caption || ''}
                                loading="lazy"
                                decoding="async"
                                className="h-auto w-full cursor-pointer transition-opacity hover:opacity-95"
                                onClick={() => openArticleLightboxAt(`image-${index}`)}
                              />
                              {(section.caption || section.alt) && (
                                <figcaption className="mx-auto mt-3 max-w-[38rem] text-[0.78rem] font-medium uppercase tracking-[0.12em] leading-5 text-white/42">
                                  {decodeHTMLEntities(section.caption || section.alt || '')}
                                </figcaption>
                              )}
                            </figure>
                          );
                        }

                        return (
                          <figure key={index} className="rounded-xl overflow-hidden">
                            <img
                              src={getArticleMediaUrl(section.url)}
                              alt={section.alt || section.caption || ''}
                              loading="lazy"
                              decoding="async"
                              className="h-auto w-full cursor-pointer transition-opacity hover:opacity-90"
                              onClick={() => openArticleLightboxAt(`image-${index}`)}
                            />
                            {(section.caption || section.alt) && (
                              <figcaption>
                                {decodeHTMLEntities(section.caption || section.alt || '')}
                              </figcaption>
                            )}
                          </figure>
                        );

                      case 'image_placeholder':
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
                                {decodeHTMLEntities(section.title || 'Planned image')}
                              </p>
                              {section.note && (
                                <p className="max-w-[46rem] text-[0.98rem] leading-7 text-white/62">
                                  {decodeHTMLEntities(section.note)}
                                </p>
                              )}
                            </figcaption>
                          </figure>
                        );

                      case 'video':
                        const videoUrl = section.url || '';

                        if (videoUrl.toLowerCase().endsWith('.mp4')) {
                          return <ArticleInlineVideo key={index} url={videoUrl} caption={section.caption} />;
                        }

                        // Extract YouTube video ID from URL
                        const getYouTubeId = (url: string) => {
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                          const match = url.match(regExp);
                          return (match && match[2].length === 11) ? match[2] : null;
                        };

                        const videoId = getYouTubeId(videoUrl);

                        return (
                          <figure key={index} className="my-12">
                            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                              <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={section.caption || 'Video'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            {section.caption && (
                              <figcaption className="mt-4 text-center text-[0.78rem] font-medium uppercase tracking-[0.12em] text-white/42">
                                {decodeHTMLEntities(section.caption)}
                              </figcaption>
                            )}
                          </figure>
                        );

                      case 'gallery':
                        const galleryImages = section.images || [];
                        return (
                          <section key={index} className="my-16 relative left-1/2 w-screen max-w-[84rem] -translate-x-1/2 px-14 sm:px-18 lg:px-24">
                            <div className="mx-auto flex max-w-[72rem] items-center justify-center gap-2">
                              <div className="hidden items-center gap-2 md:flex">
                                <button
                                  type="button"
                                  aria-label="Previous gallery images"
                                  onClick={() => scrollGallery(index, "prev")}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-white/65 transition-colors hover:border-border hover:text-white"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Next gallery images"
                                  onClick={() => scrollGallery(index, "next")}
                                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-white/65 transition-colors hover:border-border hover:text-white"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-10 overflow-hidden">
                              <div
                                ref={(el) => {
                                  galleryRefs.current[index] = el;
                                }}
                                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:gap-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                              >
                                {galleryImages.map((img: any, imgIndex: number) => (
                                  <figure
                                    key={imgIndex}
                                    className={`flex-none snap-start ${
                                      imgIndex === 0
                                        ? "w-[58vw] sm:w-[47vw] md:w-[calc((100%-1.5rem)*0.54)]"
                                        : imgIndex === 1
                                          ? "w-[50vw] sm:w-[39vw] md:w-[calc((100%-1.5rem)*0.46)]"
                                          : "w-[50vw] sm:w-[39vw] md:w-[calc((100%-1.5rem)/2)]"
                                    }`}
                                  >
                                    <img
                                      src={getArticleMediaUrl(img.url)}
                                      alt={img.alt || img.caption || ''}
                                      loading="lazy"
                                      decoding="async"
                                      className="h-auto w-full cursor-pointer rounded-xl transition-opacity hover:opacity-90"
                                      onClick={() => openArticleLightboxAt(`gallery-${index}-${imgIndex}`)}
                                    />
                                    {img.caption && (
                                      <figcaption className="mt-4 max-w-[34rem] text-[0.86rem] leading-6 tracking-[-0.01em] text-white/56">
                                        {decodeHTMLEntities(img.caption)}
                                      </figcaption>
                                    )}
                                  </figure>
                                ))}
                              </div>
                            </div>
                          </section>
                        );

                      case 'list':
                        const ListTag = section.listType === 'numbered' ? 'ol' : 'ul';
                        return (
                          <ListTag
                            key={index}
                            className={`my-6 space-y-3 ml-6 ${section.listType === 'numbered' ? 'list-decimal' : 'list-disc'} [&_strong]:font-bold`}
                          >
                            {section.items?.map((item: string, itemIndex: number) => (
                              <li key={itemIndex} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(item) }} />
                            ))}
                          </ListTag>
                        );

                      case 'text':
                        return (
                          <div
                            key={index}
                            className="article-html-content [&_p]:mb-8 [&_p]:text-[1.02rem] [&_p]:leading-[1.9] [&_p]:tracking-[-0.01em] [&_p]:text-white/80"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(decodeHTMLEntities(section.content)) }}
                          />
                        );

                      case 'html':
                        return (
                          <div
                            key={index}
                            className="[&_p]:mb-8 [&_p]:text-[1.02rem] [&_p]:leading-[1.9] [&_p]:tracking-[-0.01em] [&_p]:text-white/80"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(section.content) }}
                          />
                        );

                      case 'faq':
                        return (
                          <section key={index} className="my-20 border-t border-white/12 pt-10">
                            <Accordion type="single" collapsible className="space-y-3">
                              {section.items?.map((item: any, faqIndex: number) => (
                                <AccordionItem
                                  key={faqIndex}
                                  value={`faq-${faqIndex}`}
                                  className="rounded-[1rem] border border-white/10 bg-white/[0.02] px-6 transition-colors data-[state=open]:border-white/16 data-[state=open]:bg-white/[0.035]"
                                >
                                  <AccordionTrigger className="py-5 text-left text-[1.04rem] font-medium leading-[1.35] tracking-[-0.02em] text-white hover:no-underline">
                                    {decodeHTMLEntities(item.question)}
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-6 pr-8 text-[0.98rem] leading-7 text-white/66">
                                    <div
                                      className="[&_p]:mb-4 [&_a]:text-white [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4"
                                      dangerouslySetInnerHTML={{ __html: item.answer }}
                                    />
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </section>
                        );

                      case 'ai_prompt':
                        return (
                          <div key={index} className="group relative my-10 rounded-xl border border-border/60 bg-white/[0.02] p-6">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-white/56 hover:bg-white/[0.04] hover:text-white"
                                onClick={() => {
                                  // Handle both flat (prompt) and nested (content) structures
                                  const text = section.prompt || section.content?.prompt || section.content || '';
                                  navigator.clipboard.writeText(text);
                                  toast.success("Prompt copied to clipboard!");
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
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/56">AI Prompt</p>
                                <p className="font-mono whitespace-pre-wrap text-sm leading-relaxed text-white/86">
                                  {section.prompt || section.content?.prompt || section.content || ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        );

                      default:
                        return null;
                    }
                  });
                  })()}
                </div>
              </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="mx-auto mt-16 max-w-[58ch] border-t border-white/12 pt-12">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/48">Tagged With</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <Badge
                          variant="outline"
                          className="text-sm font-normal px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer"
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}



              {/* Author Bio with Engagement */}
              <div className="mx-auto mt-16 max-w-[58ch] border-t border-white/12 pt-12">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-border/60 shadow-lg">
                      <img
                        src="/brandon%20pt%20davis.jpeg"
                        alt="Brandon PT Davis"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-sans font-normal tracking-[-0.04em]">Brandon PT Davis</h3>
                    <p className="mb-4 text-sm uppercase tracking-wider text-white/48">Scenic Designer</p>
                    <p className="mb-6 leading-relaxed text-white/80">
                      Brandon PT Davis is a scenic designer based in Los Angeles.
                      His work explores the intersection of physical space, digital technology, and narrative storytelling.
                    </p>

                  </div>
                </div>
              </div>

              {/* Related Articles */}
            </div>

          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pb-20">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <div className="border-t border-white/12 pt-12">
              <div className="mb-8 flex items-end justify-between">
                <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-[-0.05em]">
                  {article.series ? `More in ${article.series.name}` : "Keep reading"}
                </h2>
                <Link href="/articles" className="text-base text-white/72 transition-colors hover:text-white">
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {related.slice(0, 3).map((relatedArticle) => (
                  <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                    <div className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-0.5">
                      {relatedArticle.coverImageUrl && (
                        <div className="aspect-square overflow-hidden rounded-xl bg-white/[0.02]">
                          <img
                            src={relatedArticle.coverImageUrl}
                            alt={relatedArticle.coverImageAlt || decodeHTMLEntities(relatedArticle.title)}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="pt-4">
                        <h3 className="mb-3 text-[1.45rem] font-sans font-normal leading-[1.12] tracking-[-0.04em] text-white transition-colors line-clamp-3 group-hover:text-white/82">
                          {decodeHTMLEntities(relatedArticle.title)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] tracking-[-0.015em] text-white/52">
                          {relatedArticle.categoryName && <span>{relatedArticle.categoryName}</span>}
                          <span>
                            {relatedArticle.publishedAt && new Date(relatedArticle.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          {relatedArticle.readTime && (
                            <>
                              <span>•</span>
                              <span>{relatedArticle.readTime} min read</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="relative z-20 bg-background">
        <Footer />
      </div>

      <style>{`
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
          border-radius: 0.75rem !important;
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
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
        }}
      />
    </div>
  );
}
