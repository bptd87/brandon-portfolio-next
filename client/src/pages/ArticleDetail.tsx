import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Card } from '@/components/ui/card';
import { ProgressiveImage } from '@/components/ProgressiveImage';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { proxyImageUrl } from "@/lib/imageProxy";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Mail, Link as LinkIcon, Sparkles, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { getCategoryColor } from "@/lib/categoryColors";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";

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
  return (
    <ArticleThemeWrapper>
      <ArticleDetailContent />
      <ThemeToggle />
    </ArticleThemeWrapper>
  );
}

// Special wrapper for articles that enables theme switching
function ArticleThemeWrapper({ children }: { children: React.ReactNode }) {
  const { setForceTheme } = useTheme();

  useEffect(() => {
    // Allow theme switching on articles (remove force)
    setForceTheme(null);

    // When leaving article page, force back to dark mode
    return () => {
      setForceTheme('dark');
    };
  }, [setForceTheme]);

  return <>{children}</>;
}

function ArticleDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug: slug! });
  const { data: category } = trpc.categories.getById.useQuery(
    { id: article?.categoryId || 0 },
    { enabled: !!article?.categoryId }
  );
  const { data: relatedArticles } = trpc.articles.list.useQuery({ status: "published" });

  const contentRef = useRef<HTMLDivElement>(null);
  const galleryRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<Array<{ src: string; alt?: string }>>([]);

  const scrollGallery = (sectionIndex: number, direction: "prev" | "next") => {
    const container = galleryRefs.current[sectionIndex];
    if (!container) return;
    const offset = Math.round(container.clientWidth * 0.75) * (direction === "next" ? 1 : -1);
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

  // Extract headings for TOC
  useEffect(() => {
    if (!contentRef.current) return;

    const h2Elements = contentRef.current.querySelectorAll('h2');
    const extractedHeadings = Array.from(h2Elements).map((heading, index) => {
      let id = heading.id;
      if (!id) {
        const text = heading.textContent || "";
        id = getHeadingId(text, index);
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || "",
        level: 2
      };
    });

    setHeadings(extractedHeadings);
  }, [article]);

  // Track scroll progress and active heading
  useEffect(() => {
    // Detect Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Skip scroll tracking on Safari to prevent ResizeObserver errors
    if (isSafari) {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Calculate read progress
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight - windowHeight;
          const scrolled = window.scrollY;
          const progress = (scrolled / documentHeight) * 100;
          setReadProgress(Math.min(progress, 100));

          // Find active heading
          const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
          const current = headingElements.find((el, index) => {
            const next = headingElements[index + 1];
            const rect = el!.getBoundingClientRect();
            if (!next) return rect.top <= 200;
            const nextRect = next.getBoundingClientRect();
            return rect.top <= 200 && nextRect.top > 200;
          });

          if (current) {
            setActiveHeading(current.id);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email' | 'copy') => {
    const url = window.location.href;
    const title = article?.title || '';
    const text = article?.excerpt || '';

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
  const readTime = Math.ceil(wordCount / 200);

  const articleImageSlides: Array<{ key: string; src: string; alt?: string }> = [];
  if (article.coverImageUrl) {
    articleImageSlides.push({
      key: "cover",
      src: proxyImageUrl(article.coverImageUrl, 1920),
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
  const related = relatedArticles?.filter(a => a.id !== article.id && a.categoryId === article.categoryId).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.title} | Brandon PT Davis`}
        description={article.excerpt || `${article.title} - Article by Brandon PT Davis`}
        image={article.coverImageUrl || undefined}
        type="article"
        author="Brandon PT Davis"
        publishedTime={article.publishedAt?.toISOString()}
        modifiedTime={article.updatedAt?.toISOString()}
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

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <Breadcrumb
          items={[
            { label: "Articles", href: "/articles" },
            { label: category?.name || "Uncategorized", href: `/articles?category=${category?.slug || ''}` },
            { label: article.title }
          ]}
        />
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/30 z-50">
        <div
          className="h-full transition-all duration-150"
          style={{
            width: `${readProgress}%`,
            backgroundColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'
          }}
        />
      </div>

      <article className="py-12 md:py-20 relative">
        <div className="container max-w-7xl relative">
          {/* Back Button */}
          <Link href="/articles">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
            {/* Main Content */}
            <div className="min-w-0">
              {/* Article Header */}
              <header className="mb-12">
                <div
                  className="inline-flex flex-wrap items-center gap-3 gap-y-2 mb-6 text-[11px] md:text-xs uppercase tracking-[0.25em] px-4 py-2 rounded-2xl border"
                  style={category ? {
                    backgroundColor: `${getCategoryColor(category.name).hex}12`,
                    borderColor: `${getCategoryColor(category.name).hex}40`
                  } : undefined}
                >
                  {category && (
                    <span
                      className="font-bold flex-shrink-0"
                      style={{ color: getCategoryColor(category.name).hex }}
                    >
                      {category.name}
                    </span>
                  )}
                  <span className="text-muted-foreground/70 hidden md:inline">•</span>
                  <div className="flex items-center gap-1 md:gap-2 text-muted-foreground/80 flex-shrink-0">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={new Date(article.publishedAt || article.createdAt).toISOString()}>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </time>
                  </div>
                  <span className="text-muted-foreground/70 hidden md:inline">•</span>
                  <div className="flex items-center gap-1 md:gap-2 text-muted-foreground/80 flex-shrink-0">
                    <Clock className="h-3 w-3" />
                    <span>{readTime} min read</span>
                  </div>
                </div>

                <div
                  className="inline-flex items-center gap-3 mb-4 px-4 py-2 rounded-full border text-[11px] uppercase tracking-[0.3em]"
                  style={category ? {
                    borderColor: `${getCategoryColor(category.name).hex}40`,
                    color: getCategoryColor(category.name).hex,
                    backgroundColor: `${getCategoryColor(category.name).hex}10`
                  } : undefined}
                >
                  Feature
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Playfair_Display'] italic font-normal mb-6 leading-[1.1] tracking-tight">
                  {decodeHTMLEntities(article.title)}
                </h1>

                <div
                  className="h-1 w-20 rounded-full mb-8"
                  style={{ backgroundColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))' }}
                />



                {article.excerpt && (
                  <div
                    className="max-w-3xl border-l-4 pl-6"
                    style={{ borderColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))' }}
                  >
                    <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                      {decodeHTMLEntities(article.excerpt)}
                    </p>
                  </div>
                )}

                {/* Cover Image */}
                {article.coverImageUrl && (
                  <div className="mt-12 -mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    <ProgressiveImage
                      src={proxyImageUrl(article.coverImageUrl, 1920)}
                      alt={article.title}
                      loading="eager"
                      className="w-full h-auto cursor-pointer"
                      onClick={() => openArticleLightboxAt("cover")}
                    />
                  </div>
                )}

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mt-8">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Share:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('email')}
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </Button>
                </div>
              </header>

              {/* Article Content */}
              <div className="relative">
                <div
                  className="hidden lg:block absolute -left-10 top-0 bottom-0 w-[2px] rounded-full"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, ${category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'}55, ${category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'}05)`
                  }}
                />
                <div
                  className="hidden lg:block absolute -left-[46px] top-0 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'
                  }}
                />
                {/* Category-colored bullets and bold text */}
                <style>{`
                  .article-content-${article.id} ul li::marker {
                    color: ${category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'};
                  }
                  .article-content-${article.id} ol li::marker {
                    color: ${category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'};
                  }
                  .article-content-${article.id} strong {
                    color: ${category ? getCategoryColor(category.name).hex : 'hsl(var(--foreground))'};
                    font-weight: 700;
                    font-size: 1.125rem;
                  }
                `}</style>

                <div
                  ref={contentRef}
                  className="article-content article-content-${article.id} article-html-content max-w-[65ch] mx-auto
                  prose prose-lg prose-invert
                  prose-headings:font-['Playfair_Display'] prose-headings:font-bold prose-headings:font-normal prose-headings:leading-[1.2]
                  prose-h2:text-[1.5rem] prose-h2:mt-16 prose-h2:mb-4 prose-h2:scroll-mt-24 prose-h2:leading-[1.3]
                  prose-h3:text-[1.125rem] prose-h3:mt-10 prose-h3:mb-3 prose-h3:leading-[1.4]
                  prose-h4:text-[1rem] prose-h4:mt-8 prose-h4:mb-2 prose-h4:leading-[1.4]
                  prose-p:text-foreground/90 prose-p:leading-[1.75] prose-p:mb-6 prose-p:text-[1.0625rem] prose-p:font-normal prose-p:tracking-normal
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:font-bold prose-strong:text-[1.125rem]
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-8 
                  prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:my-10 prose-blockquote:font-['Playfair_Display'] prose-blockquote:leading-[1.6]
                  prose-ul:my-8 prose-ol:my-8 prose-ul:leading-[2] prose-ol:leading-[2] prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-8 prose-ol:pl-8
                  prose-li:my-1.5 prose-li:text-[1.0625rem] prose-li:leading-[1.75] prose-li:ml-0
                  [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item [&_li]:ml-0
                  prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-xl
                  prose-figure:my-12
                  prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:text-center prose-figcaption:mt-4
                  [&_iframe]:w-full [&_iframe]:max-w-[65ch] [&_iframe]:mx-auto [&_iframe]:my-12 [&_iframe]:rounded-2xl [&_iframe]:shadow-xl [&_iframe]:aspect-[16/9] [&_iframe]:h-auto
                  [&_video]:w-full [&_video]:max-w-[65ch] [&_video]:mx-auto [&_video]:my-12 [&_video]:rounded-2xl [&_video]:shadow-xl [&_video]:aspect-[16/9]
                  [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
                >
                  {Array.isArray(processedSections) && (() => {
                    let h2Index = 0;
                    return processedSections.map((section: any, index: number) => {
                    // Track if this is the first paragraph (for drop cap)
                    const isFirstParagraph = section.type === 'paragraph' &&
                      !processedSections.slice(0, index).some((s: any) => s.type === 'paragraph');

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
                        const categoryColorObj = category ? getCategoryColor(category.name) : undefined;
                        const level = section.level || 2;
                        const headingClassName = level === 2 ? "mt-12 mb-8" : level === 3 ? "mt-10 mb-6" : "mt-8 mb-4";
                        const headingStyle = categoryColorObj ? { color: `${categoryColorObj.hex} !important` } : undefined;
                        const headingText = decodeHTMLEntities(section.text || section.content || '');

                        const headingId = level === 2
                          ? getHeadingId(headingText, h2Index)
                          : getHeadingId(headingText, index);

                        if (level === 2) {
                          h2Index += 1;
                        }

                        if (level === 2) {
                          return <h2 key={index} id={headingId} className={headingClassName} style={headingStyle}>{headingText}</h2>;
                        } else if (level === 3) {
                          return <h3 key={index} id={headingId} className={headingClassName} style={headingStyle}>{headingText}</h3>;
                        } else if (level === 4) {
                          return <h4 key={index} id={headingId} className={headingClassName} style={headingStyle}>{headingText}</h4>;
                        } else {
                          return <h2 key={index} id={headingId} className={headingClassName} style={headingStyle}>{headingText}</h2>;
                        }

                      case 'paragraph':
                        const categoryColor = category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))';
                        return (
                          <p
                            key={index}
                            className={`mb-6 leading-relaxed [&_strong]:font-bold [&_strong]:text-[1.125rem] ${isFirstParagraph ? 'first-paragraph-drop-cap' : ''}`}
                            style={{
                              ['--strong-color' as any]: categoryColor
                            }}
                            dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.text || section.content || '') }}
                          />
                        );

                      case 'quote':
                        const quoteText = normalizeQuoteText(section.text || section.content || '');
                        return (
                          <blockquote key={index} className="my-10 rounded-xl border-l-4 border-primary bg-primary/5 px-6 py-5 shadow-sm">
                            <p className="text-xl md:text-2xl italic leading-relaxed text-foreground/95">
                              {quoteText}
                            </p>
                            {section.author && (
                              <footer className="text-base text-muted-foreground mt-4 not-italic font-sans font-medium">
                                — {decodeHTMLEntities(section.author)}
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
                        return (
                          <div key={index} className="my-12 -mx-4 md:mx-0 relative">
                            <div
                              ref={(el) => {
                                galleryRefs.current[index] = el;
                              }}
                              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted"
                            >
                              {section.images?.map((img: any, imgIndex: number) => (
                                <figure key={imgIndex} className="flex-none w-[80%] md:w-[60%] snap-center rounded-2xl overflow-hidden shadow-xl">
                                  <ProgressiveImage
                                    src={proxyImageUrl(img.url, 1920)}
                                    alt={img.alt || img.caption || ''}
                                    loading="lazy"
                                    className="w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => openArticleLightboxAt(`gallery-${index}-${imgIndex}`)}
                                  />
                                  {img.caption && (
                                    <figcaption className="text-sm text-muted-foreground mt-4 text-center">
                                      {decodeHTMLEntities(img.caption)}
                                    </figcaption>
                                  )}
                                </figure>
                              ))}
                            </div>
                            <button
                              type="button"
                              aria-label="Previous gallery images"
                              onClick={() => scrollGallery(index, "prev")}
                              className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 border border-border shadow-lg hover:bg-background transition-colors"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              aria-label="Next gallery images"
                              onClick={() => scrollGallery(index, "next")}
                              className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/85 border border-border shadow-lg hover:bg-background transition-colors"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        );

                      case 'list':
                        const ListTag = section.listType === 'numbered' ? 'ol' : 'ul';
                        const listCategoryColor = category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))';
                        return (
                          <ListTag
                            key={index}
                            className={`my-6 space-y-3 ml-6 ${section.listType === 'numbered' ? 'list-decimal' : 'list-disc'} [&_strong]:font-bold [&_strong]:text-[1.125rem]`}
                            style={{
                              ['--strong-color' as any]: listCategoryColor
                            }}
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
                            className="article-html-content [&_p]:mb-8 [&_p]:leading-[2] [&_p]:text-justify"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(decodeHTMLEntities(section.content)) }}
                          />
                        );

                      case 'html':
                        return (
                          <div
                            key={index}
                            className="[&_p]:mb-8 [&_p]:leading-[2] [&_p]:text-justify"
                            dangerouslySetInnerHTML={{ __html: processHTMLImages(section.content) }}
                          />
                        );

                      case 'faq':
                        return (
                          <div key={index} className="my-16">
                            <h2 className="text-xl font-['Playfair_Display'] italic mb-8">Frequently Asked Questions</h2>
                            <Accordion type="single" collapsible className="space-y-4">
                              {section.items?.map((item: any, faqIndex: number) => (
                                <AccordionItem key={faqIndex} value={`faq-${faqIndex}`} className="border border-border rounded-lg px-6">
                                  <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                                    {decodeHTMLEntities(item.question)}
                                  </AccordionTrigger>
                                  <AccordionContent className="text-muted-foreground pb-6">
                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        );

                      case 'ai_prompt':
                        return (
                          <div key={index} className="my-10 p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 relative group">
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
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
                              <div className="mt-1 p-1.5 rounded-md bg-purple-500/10 text-purple-400">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">AI Prompt</p>
                                <p className="font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
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
                <div className="mt-16 pt-12 border-t max-w-[65ch] mx-auto">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Tagged With</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <Link key={tag.id} href={`/tags/${tag.slug}`}>
                        <Badge
                          variant="outline"
                          className="text-sm font-normal px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer"
                          style={category ? {
                            borderColor: `${getCategoryColor(category.name).hex}40`,
                            color: getCategoryColor(category.name).hex,
                            backgroundColor: `${getCategoryColor(category.name).hex}10`
                          } : undefined}
                        >
                          {tag.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}



              {/* Author Bio with Engagement */}
              <div className="mt-16 pt-12 border-t max-w-[65ch] mx-auto">
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
                    <h3 className="text-2xl font-['Playfair_Display'] italic mb-2">Brandon PT Davis</h3>
                    <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Scenic Designer</p>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                      Brandon PT Davis is a scenic designer based in Los Angeles.
                      His work explores the intersection of physical space, digital technology, and narrative storytelling.
                    </p>

                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mt-20 pt-12 border-t">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <div
                        className="h-1 w-12 rounded-full mb-4"
                        style={{ backgroundColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))' }}
                      />
                      <h2 className="text-2xl md:text-3xl font-['Playfair_Display'] italic">Continue Reading</h2>
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Related</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {related.map((relatedArticle) => {
                      const categoryColor = relatedArticle.category?.name
                        ? getCategoryColor(relatedArticle.category.name).hex
                        : '#FF6B35';
                      return (
                        <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                          <div className="group bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer border border-border">
                            <div className="h-1 w-full" style={{ backgroundColor: categoryColor }} />
                            {/* Cover Image */}
                            {relatedArticle.coverImageUrl && (
                              <div className="aspect-[16/9] overflow-hidden">
                                <img
                                  src={relatedArticle.coverImageUrl}
                                  alt={decodeHTMLEntities(relatedArticle.title)}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  loading="lazy"
                                />
                              </div>
                            )}

                            <div className="p-5 md:p-6">
                              {/* Category Badge */}
                              {relatedArticle.category && (
                                <Badge
                                  className="text-[11px] uppercase tracking-[0.3em] px-3 py-1 rounded-full border"
                                  style={{
                                    borderColor: `${categoryColor}55`,
                                    color: categoryColor,
                                    backgroundColor: `${categoryColor}10`
                                  }}
                                >
                                  {relatedArticle.category.name}
                                </Badge>
                              )}

                              <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-3 transition-colors line-clamp-2"
                                style={{ color: 'inherit' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                                {decodeHTMLEntities(relatedArticle.title)}
                              </h3>

                              {relatedArticle.excerpt && (
                                <p className="text-base text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                  {decodeHTMLEntities(relatedArticle.excerpt)}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Table of Contents - Desktop */}
            {headings.length > 0 && (
              <div className="hidden lg:block lg:w-64 flex-shrink-0 fixed top-28 right-8 xl:right-[calc((100vw-1280px)/2+2rem)]">
                <div className="w-64 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-border/60 bg-background/70 backdrop-blur px-5 py-6 shadow-xl shadow-black/10">
                  <div
                    className="h-1 w-10 rounded-full mb-4"
                    style={{ backgroundColor: category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))' }}
                  />
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Table of Contents</h3>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm py-1.5 border-l-2 pl-4 rounded-r-md transition-colors cursor-pointer ${activeHeading === heading.id
                          ? 'font-semibold'
                          : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                          }`}
                        style={activeHeading === heading.id && category ? {
                          borderColor: getCategoryColor(category.name).hex,
                          color: getCategoryColor(category.name).hex,
                          backgroundColor: `${getCategoryColor(category.name).hex}12`
                        } : undefined}
                        onClick={(e) => {
                          e.preventDefault();
                          const element = document.getElementById(heading.id);
                          if (element) {
                            const yOffset = -100; // Offset for fixed header
                            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>

      <Footer />

      <style>{`
        /* Category-specific H2 colors */
        .article-content h2 {
          color: ${category ? getCategoryColor(category.name).hex : 'inherit'} !important;
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
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3) !important;
          cursor: pointer !important;
          transition: transform 0.3s ease !important;
        }

        .article-content .wp-block-gallery img:hover,
        .article-content .blocks-gallery-grid img:hover {
          transform: scale(1.02) !important;
        }

        /* WordPress Image Styles - Beveled */
        .article-content img {
          border-radius: 1rem !important;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.3) !important;
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
          background: hsl(var(--primary));
          border-radius: 4px;
        }

        .article-content ::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.8);
        }

        /* Drop Cap First Letter - only on first paragraph, not update notes */
        .article-content .first-paragraph-drop-cap::first-letter {
          font-size: 4.5rem;
          font-weight: bold;
          line-height: 0.8;
          float: left;
          margin-right: 0.75rem;
          font-family: 'Playfair Display', serif;
          color: ${category ? getCategoryColor(category.name).hex : 'hsl(var(--primary))'};
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
