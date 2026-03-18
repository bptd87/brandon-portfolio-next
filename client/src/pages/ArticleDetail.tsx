import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from '@/components/ProgressiveImage';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { proxyImageUrl } from "@/lib/imageProxy";
import { Sparkles, Copy, Check, ChevronLeft, ChevronRight, Link as LinkIcon, Play, Pause } from "lucide-react";
import { Link, useParams } from "wouter";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { getLocalArticleRecordBySlug, getLocalArticles } from "@shared/localArticles";

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
      img.setAttribute('src', proxyImageUrl(src, 1920));
    } else if (srcset) {
      // Safari-safe fallback: use first candidate URL as src if src is missing.
      const firstCandidate = srcset
        .split(',')
        .map((entry) => entry.trim().split(/\s+/)[0])
        .find(Boolean);
      if (firstCandidate) {
        img.setAttribute('src', proxyImageUrl(firstCandidate, 1920));
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
    const firstFigure = container.querySelector("figure");
    const figureWidth = firstFigure instanceof HTMLElement ? firstFigure.offsetWidth : Math.round(container.clientWidth * 0.5);
    const gap = 24;
    const offset = (figureWidth + gap) * (direction === "next" ? 1 : -1);
    container.scrollBy({ left: offset, behavior: "smooth" });
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
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
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
        src: proxyImageUrl(section.url, 1920),
        alt: section.alt || section.caption || "",
      });
    }
    if (section.type === "gallery" && Array.isArray(section.images)) {
      section.images.forEach((img: any, imgIndex: number) => {
        if (!img?.url) return;
        articleImageSlides.push({
          key: `gallery-${sectionIndex}-${imgIndex}`,
          src: proxyImageUrl(img.url, 1920),
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

  // Get related articles
  const related = getLocalArticles()
    .map((candidate) => getLocalArticleRecordBySlug(candidate.slug))
    .filter((candidate): candidate is NonNullable<typeof article> => Boolean(candidate))
    .filter((candidate) => candidate.id !== article.id && candidate.categoryName === article.categoryName)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.title} | Brandon PT Davis`}
        description={article.excerpt || `${article.title} - Article by Brandon PT Davis`}
        image={article.coverImageUrl || undefined}
        type="article"
        author="Brandon PT Davis"
        publishedTime={article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined}
        modifiedTime={article.updatedAt ? new Date(article.updatedAt).toISOString() : undefined}
      />
      <StructuredData
        type="Article"
        article={{
          headline: article.title,
          description: article.excerpt || undefined,
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
          keywords: article.seoKeywords?.split(',').map(k => k.trim()) || [],
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
            <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-foreground/54">
              <time dateTime={new Date(article.publishedAt || article.createdAt).toISOString()}>
                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
              {article.categoryName ? (
                <Link href={`/articles?category=${encodeURIComponent(article.categoryName)}`}>
                  <a className="transition-colors hover:text-foreground">{article.categoryName}</a>
                </Link>
              ) : null}
            </div>

            <h1 className="mx-auto mt-5 max-w-[14ch] font-sans text-[clamp(2.7rem,5.8vw,5.9rem)] font-medium leading-[0.92] tracking-[-0.072em] text-foreground">
              {decodeHTMLEntities(article.title)}
            </h1>

            {article.excerpt && (
              <p className="mx-auto mt-5 max-w-[38rem] text-[clamp(1rem,1.45vw,1.34rem)] leading-[1.62] tracking-[-0.018em] text-foreground/68">
                {decodeHTMLEntities(article.excerpt)}
              </p>
            )}

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

            <div className="mx-auto mt-8 flex w-full max-w-[58rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-foreground/72">
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
                      className="inline-flex items-center gap-3 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-foreground"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/18 bg-white/6">
                        {isAudioPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
                      </span>
                      <span>{articleAudio.label || "Listen to article"}</span>
                    </button>
                    {displayedAudioTime ? (
                      <span className="text-[0.96rem] tracking-[-0.018em] text-foreground/62">
                        {displayedAudioTime}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-foreground"
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
                <span>{linkCopied ? "Link copied" : "Share"}</span>
              </button>
            </div>
          </header>

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
                    color: hsl(var(--foreground));
                    font-weight: 700;
                  }
                `}</style>

                <div
                  className="article-content article-content-${article.id} article-html-content mx-auto max-w-[56ch]
                  prose prose-lg prose-invert
                  prose-headings:font-sans prose-headings:font-medium prose-headings:leading-[0.98] prose-headings:tracking-[-0.05em]
                  prose-h2:text-[clamp(2rem,2.75vw,2.8rem)] prose-h2:mt-20 prose-h2:mb-6 prose-h2:scroll-mt-24 prose-h2:text-foreground
                  prose-h3:text-[clamp(1.5rem,2vw,1.95rem)] prose-h3:mt-14 prose-h3:mb-4 prose-h3:leading-[1.02] prose-h3:text-foreground/98
                  prose-h4:text-[0.95rem] prose-h4:mt-10 prose-h4:mb-3 prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-[0.18em] prose-h4:text-foreground/48
                  prose-p:text-foreground/80 prose-p:leading-[1.9] prose-p:mb-8 prose-p:text-[1.02rem] md:prose-p:text-[1.06rem] prose-p:font-normal prose-p:tracking-[-0.01em]
                  prose-a:text-foreground prose-a:underline prose-a:decoration-white/35 prose-a:underline-offset-4 hover:prose-a:decoration-white/70 prose-a:font-medium
                  prose-strong:font-bold
                  prose-blockquote:border-0 prose-blockquote:pl-0 prose-blockquote:my-14 prose-blockquote:font-sans prose-blockquote:text-foreground
                  prose-ul:my-8 prose-ol:my-8 prose-ul:leading-[2] prose-ol:leading-[2] prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-8 prose-ol:pl-8
                  prose-li:my-1.5 prose-li:text-[1.0625rem] prose-li:leading-[1.75] prose-li:ml-0
                  [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item [&_li]:ml-0
                  prose-img:rounded-xl prose-img:my-12
                  prose-figure:my-12
                  prose-figcaption:text-sm prose-figcaption:text-foreground/48 prose-figcaption:text-center prose-figcaption:mt-4
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
                                className="text-sm leading-relaxed text-foreground/80 [&_strong]:font-bold [&_strong]:text-primary [&_strong]:text-base"
                                dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.text || section.content || '') }}
                              />
                            </div>
                          </div>
                        );

                      case 'heading':
                        const level = section.level || 2;
                        const headingClassName =
                          level === 2
                            ? "mt-20 mb-6 font-sans text-[clamp(2rem,2.75vw,2.8rem)] font-medium leading-[0.96] tracking-[-0.055em] text-foreground"
                            : level === 3
                              ? "mt-14 mb-4 font-sans text-[clamp(1.5rem,2vw,1.95rem)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground/98"
                              : "mt-10 mb-3 font-sans text-[0.95rem] font-semibold uppercase tracking-[0.18em] text-foreground/48";
                        const headingText = decodeHTMLEntities(section.text || section.content || '');

                        const headingId = level === 2
                          ? getHeadingId(headingText, h2Index)
                          : getHeadingId(headingText, index);

                        if (level === 2) {
                          h2Index += 1;
                        }

                        if (level === 2) {
                          return <h2 key={index} id={headingId} className={headingClassName}>{headingText}</h2>;
                        } else if (level === 3) {
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
                            className="mb-8 text-[1.02rem] leading-[1.9] tracking-[-0.01em] text-foreground/80 [&_strong]:font-bold [&_strong]:text-foreground"
                            dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.text || section.content || '') }}
                          />
                        );

                      case 'quote':
                        const quoteText = normalizeQuoteText(section.text || section.content || '');
                        return (
                          <blockquote key={index} className="my-16 py-2 text-center">
                            <p className="mx-auto max-w-[34rem] font-sans text-[clamp(1.35rem,2.1vw,1.9rem)] font-medium leading-[1.28] tracking-[-0.04em] text-foreground/92">
                              <span aria-hidden="true" className="mr-[0.08em] text-foreground/54">“</span>
                              {quoteText}
                              <span aria-hidden="true" className="ml-[0.04em] text-foreground/54">”</span>
                            </p>
                            {section.author && (
                              <footer className="mt-5 text-[0.82rem] not-italic font-semibold uppercase tracking-[0.22em] text-foreground/42">
                                {decodeHTMLEntities(section.author)}
                              </footer>
                            )}
                          </blockquote>
                        );

                      case 'image':
                        return (
                          <figure key={index} className="rounded-xl overflow-hidden">
                            <ProgressiveImage
                              src={proxyImageUrl(section.url, 1920)}
                              alt={section.alt || section.caption || ''}
                              loading="lazy"
                              objectFit="contain"
                              className="cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openArticleLightboxAt(`image-${index}`)}
                            />
                            {section.caption && (
                              <figcaption>
                                {decodeHTMLEntities(section.caption)}
                              </figcaption>
                            )}
                          </figure>
                        );

                      case 'video':
                        // Extract YouTube video ID from URL
                        const getYouTubeId = (url: string) => {
                          const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                          const match = url.match(regExp);
                          return (match && match[2].length === 11) ? match[2] : null;
                        };

                        const videoId = getYouTubeId(section.url || '');

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
                              <figcaption className="text-sm text-muted-foreground mt-4 text-center">
                                {decodeHTMLEntities(section.caption)}
                              </figcaption>
                            )}
                          </figure>
                        );

                      case 'gallery':
                        const galleryImages = section.images || [];
                        const hasGalleryOverflow = galleryImages.length > 2;
                        return (
                          <section key={index} className="my-16 relative left-1/2 w-screen max-w-[84rem] -translate-x-1/2 px-14 sm:px-18 lg:px-24">
                            <div className="overflow-hidden">
                              <div
                                ref={(el) => {
                                  galleryRefs.current[index] = el;
                                }}
                                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory md:gap-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                              >
                                {galleryImages.map((img: any, imgIndex: number) => (
                                  <figure
                                    key={imgIndex}
                                    className="flex-none snap-start w-[58vw] sm:w-[46vw] md:w-[calc((100%-2rem)/2)]"
                                  >
                                    <ProgressiveImage
                                      src={proxyImageUrl(img.url, 1920)}
                                      alt={img.alt || img.caption || ''}
                                      loading="lazy"
                                      className="h-auto w-full cursor-pointer rounded-xl hover:opacity-90 transition-opacity"
                                      onClick={() => openArticleLightboxAt(`gallery-${index}-${imgIndex}`)}
                                    />
                                    {img.caption && (
                                      <figcaption className="mt-4 max-w-[34rem] text-sm leading-6 text-foreground/58">
                                        {decodeHTMLEntities(img.caption)}
                                      </figcaption>
                                    )}
                                  </figure>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              aria-label="Previous gallery images"
                              onClick={() => scrollGallery(index, "prev")}
                              className="hidden md:flex items-center justify-center absolute left-5 top-[40%] -translate-y-1/2 h-10 w-10 text-white/78 transition-colors hover:text-white"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Next gallery images"
                              onClick={() => scrollGallery(index, "next")}
                              className="hidden md:flex items-center justify-center absolute right-5 top-[40%] -translate-y-1/2 h-10 w-10 text-white/78 transition-colors hover:text-white"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
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
                            className="article-html-content [&_p]:mb-8 [&_p]:text-[1.02rem] [&_p]:leading-[1.9] [&_p]:tracking-[-0.01em] [&_p]:text-foreground/80"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(decodeHTMLEntities(section.content)) }}
                          />
                        );

                      case 'html':
                        return (
                          <div
                            key={index}
                            className="[&_p]:mb-8 [&_p]:text-[1.02rem] [&_p]:leading-[1.9] [&_p]:tracking-[-0.01em] [&_p]:text-foreground/80"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(section.content) }}
                          />
                        );

                      case 'faq':
                        return (
                          <section key={index} className="my-20 border-t border-white/12 pt-10">
                            <div className="mb-8 flex items-end justify-between gap-6">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-foreground/38">
                                  FAQ
                                </p>
                                <h2 className="mt-3 text-[1.65rem] font-sans font-normal tracking-[-0.04em] text-foreground">
                                  Frequently Asked Questions
                                </h2>
                              </div>
                            </div>
                            <Accordion type="single" collapsible className="space-y-3">
                              {section.items?.map((item: any, faqIndex: number) => (
                                <AccordionItem
                                  key={faqIndex}
                                  value={`faq-${faqIndex}`}
                                  className="rounded-[1rem] border border-white/10 bg-white/[0.02] px-6 transition-colors data-[state=open]:border-white/16 data-[state=open]:bg-white/[0.035]"
                                >
                                  <AccordionTrigger className="py-5 text-left text-[1.04rem] font-medium leading-[1.35] tracking-[-0.02em] text-foreground hover:no-underline">
                                    {decodeHTMLEntities(item.question)}
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-6 pr-8 text-[0.98rem] leading-7 text-foreground/66">
                                    <div
                                      className="[&_p]:mb-4 [&_a]:text-foreground [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4"
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
                                className="h-8 w-8 text-foreground/56 hover:bg-white/[0.04] hover:text-foreground"
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
                              <div className="mt-1 rounded-md bg-white/[0.04] p-1.5 text-foreground/62">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-foreground/56">AI Prompt</p>
                                <p className="font-mono text-sm leading-relaxed text-foreground/86 whitespace-pre-wrap">
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
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/48">Tagged With</h3>
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
                    <p className="mb-4 text-sm uppercase tracking-wider text-foreground/48">Scenic Designer</p>
                    <p className="mb-6 leading-relaxed text-foreground/80">
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
                <h2 className="text-2xl md:text-3xl font-sans font-normal tracking-[-0.05em]">Keep reading</h2>
                <Link href="/articles">
                  <a className="text-base text-foreground/72 transition-colors hover:text-foreground">View all</a>
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
                            alt={decodeHTMLEntities(relatedArticle.title)}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <div className="pt-4">
                        <h3 className="mb-3 text-[1.45rem] font-sans font-normal leading-[1.12] tracking-[-0.04em] text-foreground transition-colors line-clamp-3 group-hover:text-foreground/82">
                          {decodeHTMLEntities(relatedArticle.title)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] tracking-[-0.015em] text-foreground/52">
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
