import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from '@/components/ui/card';
import { ProgressiveImage } from '@/components/ProgressiveImage';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowLeft, Share2, Twitter, Linkedin, Mail, Link as LinkIcon, Heart, Eye, User } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getCategoryColor } from "@/lib/categoryColors";
import Comments from "@/components/Comments";

// Decode HTML entities
const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug: slug! });
  const { data: category } = trpc.categories.getById.useQuery(
    { id: article?.categoryId || 0 },
    { enabled: !!article?.categoryId }
  );
  const { data: relatedArticles } = trpc.articles.list.useQuery({});
  
  const contentRef = useRef<HTMLDivElement>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [activeHeading, setActiveHeading] = useState<string>("");
  const [readProgress, setReadProgress] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  const incrementViews = trpc.articles.incrementViews.useMutation();
  const toggleLikeMutation = trpc.articles.toggleLike.useMutation();
  
  // Track view on page load
  useEffect(() => {
    if (article?.id) {
      incrementViews.mutate({ id: article.id });
    }
  }, [article?.id]);
  
  const handleLikeToggle = async () => {
    if (!article?.id) return;
    
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    
    await toggleLikeMutation.mutateAsync({ 
      id: article.id, 
      liked: newLikedState 
    });
  };

  // Extract headings for TOC
  useEffect(() => {
    if (!contentRef.current) return;
    
    const h2Elements = contentRef.current.querySelectorAll('h2');
    const extractedHeadings = Array.from(h2Elements).map((heading, index) => {
      // Use existing ID if present, otherwise create one
      let id = heading.id;
      if (!id) {
        id = `heading-${index}`;
        heading.id = id;
      }
      return {
        id,
        text: heading.textContent || '',
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

  // Get related articles
  const related = relatedArticles?.filter(a => a.id !== article.id && a.categoryId === article.categoryId).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

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
                <div className="flex items-center gap-3 mb-6 text-sm uppercase tracking-wider">
                  {category && (
                    <Badge 
                      variant="secondary" 
                      className="font-bold"
                      style={{
                        backgroundColor: `${getCategoryColor(category.name).hex}20`,
                        color: getCategoryColor(category.name).hex,
                        borderColor: `${getCategoryColor(category.name).hex}40`
                      }}
                    >
                      {category.name}
                    </Badge>
                  )}
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <time dateTime={new Date(article.publishedAt || article.createdAt).toISOString()}>
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </time>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{readTime} min read</span>
                  </div>
                  <span className="text-muted-foreground">|</span>
                  <button 
                    onClick={handleLikeToggle}
                    className="flex items-center gap-2 transition-colors hover:scale-110 transform"
                    style={hasLiked && category ? {
                      color: getCategoryColor(category.name).hex
                    } : undefined}
                  >
                    <Heart className={`h-3 w-3 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{article.likes || 0}</span>
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{article.views || 0}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-['Playfair_Display'] italic font-normal mb-8 leading-[1.15] tracking-tight">
                  {decodeHTMLEntities(article.title)}
                </h1>



                {article.excerpt && (
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                    {decodeHTMLEntities(article.excerpt)}
                  </p>
                )}

                {/* Cover Image */}
                {article.coverImageUrl && (
                  <div className="mt-12 -mx-4 md:mx-0 rounded-2xl overflow-hidden shadow-2xl">
                    <ProgressiveImage
                      src={article.coverImageUrl}
                      alt={article.title}
                      loading="eager"
                      aspectRatio="16/9"
                      objectFit="cover"
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
              <div>
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
                  }
                `}</style>
                
                <div 
                  ref={contentRef}
                  className="article-content article-content-${article.id} article-html-content max-w-[65ch] mx-auto
                  prose prose-lg prose-invert
                  prose-headings:font-['Playfair_Display'] prose-headings:font-bold prose-headings:font-normal prose-headings:leading-[1.2]
                  prose-h2:text-[2.5rem] prose-h2:mt-24 prose-h2:mb-6 prose-h2:scroll-mt-24 prose-h2:leading-[1.2]
                  prose-h3:text-[1.75rem] prose-h3:mt-12 prose-h3:mb-4 prose-h3:leading-[1.3]
                  prose-p:text-foreground/90 prose-p:leading-[2] prose-p:mb-8 prose-p:text-[1.125rem] prose-p:font-normal prose-p:tracking-normal prose-p:text-justify
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:font-semibold
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-8 
                  prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:my-12 prose-blockquote:font-['Playfair_Display'] prose-blockquote:leading-[1.6]
                  prose-ul:my-8 prose-ol:my-8 prose-ul:leading-[2] prose-ol:leading-[2] prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-8 prose-ol:pl-8
                  prose-li:my-2 prose-li:text-[1.125rem] prose-li:leading-[2] prose-li:ml-0
                  [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item [&_li]:ml-0
                  prose-img:rounded-2xl prose-img:my-12 prose-img:shadow-xl
                  prose-figure:my-12
                  prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:text-center prose-figcaption:mt-4
                  [&_iframe]:w-full [&_iframe]:max-w-[65ch] [&_iframe]:mx-auto [&_iframe]:my-12 [&_iframe]:rounded-2xl [&_iframe]:shadow-xl [&_iframe]:aspect-[16/9] [&_iframe]:h-auto
                  [&_video]:w-full [&_video]:max-w-[65ch] [&_video]:mx-auto [&_video]:my-12 [&_video]:rounded-2xl [&_video]:shadow-xl [&_video]:aspect-[16/9]
                  [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased]"
              >
                {Array.isArray(processedSections) && processedSections.map((section: any, index: number) => {
                  switch (section.type) {
                    case 'heading':
                      const categoryColorObj = category ? getCategoryColor(category.name) : undefined;
                      return (
                        <h2 
                          key={index}
                          style={categoryColorObj ? { color: `${categoryColorObj.hex} !important` } : undefined}
                        >
                          {decodeHTMLEntities(section.text || section.content || '')}
                        </h2>
                      );
                    
                    case 'paragraph':
                      return (
                        <p key={index} className={index === 0 ? 'first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-[\'Playfair_Display\'] first-letter:leading-[0.8]' : ''}>
                          {decodeHTMLEntities(section.content)}
                        </p>
                      );
                    
                    case 'quote':
                      return (
                        <blockquote key={index}>
                          "{decodeHTMLEntities(section.text || section.content || '')}"
                          {section.author && (
                            <footer className="text-base text-muted-foreground mt-4 not-italic font-sans">
                              — {decodeHTMLEntities(section.author)}
                            </footer>
                          )}
                        </blockquote>
                      );
                    
                    case 'image':
                      return (
                        <figure key={index} className="rounded-xl overflow-hidden">
                          <ProgressiveImage
                            src={section.url}
                            alt={section.alt || section.caption || ''}
                            loading="lazy"
                            aspectRatio="16/9"
                            objectFit="cover"
                            className="cursor-pointer hover:scale-[1.02] transition-transform"
                            onClick={() => window.open(section.url, '_blank')}
                          />
                          {section.caption && (
                            <figcaption>
                              {decodeHTMLEntities(section.caption)}
                            </figcaption>
                          )}
                        </figure>
                      );
                    
                    case 'gallery':
                      return (
                        <div key={index} className="my-12 -mx-4 md:mx-0">
                          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted">
                            {section.images?.map((img: any, imgIndex: number) => (
                              <figure key={imgIndex} className="flex-none w-[80%] md:w-[60%] snap-center rounded-2xl overflow-hidden shadow-xl">
                                <ProgressiveImage
                                  src={img.url}
                                  alt={img.alt || img.caption || ''}
                                  loading="lazy"
                                  aspectRatio="16/9"
                                  objectFit="cover"
                                  className="cursor-pointer hover:scale-[1.02] transition-transform h-[400px]"
                                  onClick={() => window.open(img.url, '_blank')}
                                />
                                {img.caption && (
                                  <figcaption className="text-sm text-muted-foreground mt-4 text-center">
                                    {decodeHTMLEntities(img.caption)}
                                  </figcaption>
                                )}
                              </figure>
                            ))}
                          </div>
                        </div>
                      );
                    
                    case 'list':
                      const ListTag = section.listType === 'numbered' ? 'ol' : 'ul';
                      return (
                        <ListTag key={index} className={section.listType === 'numbered' ? 'list-decimal' : 'list-disc'}>
                          {section.items?.map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>{decodeHTMLEntities(item)}</li>
                          ))}
                        </ListTag>
                      );
                    
                    case 'text':
                      return (
                        <div 
                          key={index}
                          className="article-html-content [&_p]:mb-8 [&_p]:leading-[2] [&_p]:text-justify"
                          dangerouslySetInnerHTML={{ __html: decodeHTMLEntities(section.content) }}
                        />
                      );
                    
                    case 'html':
                      return (
                        <div 
                          key={index}
                          className="[&_p]:mb-8 [&_p]:leading-[2] [&_p]:text-justify"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      );
                    
                    case 'faq':
                      return (
                        <div key={index} className="my-16">
                          <h2 className="text-3xl font-['Playfair_Display'] italic mb-8">Frequently Asked Questions</h2>
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
                    
                    default:
                      return null;
                  }
                 })}
              </div>
            </div>

              {/* Tags Section */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-16 pt-12 border-t max-w-[65ch] mx-auto">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Tagged With</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag: any) => (
                      <Badge 
                        key={tag.id} 
                        variant="outline" 
                        className="text-sm font-normal px-4 py-2 rounded-full transition-all hover:scale-105"
                        style={category ? {
                          borderColor: `${getCategoryColor(category.name).hex}40`,
                          color: getCategoryColor(category.name).hex,
                          backgroundColor: `${getCategoryColor(category.name).hex}10`
                        } : undefined}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="max-w-[65ch] mx-auto">
                <Comments 
                  articleId={article.id} 
                  accentColor={category ? getCategoryColor(category.name).hex : '#06B6D4'} 
                />
              </div>

              {/* Author Bio with Engagement */}
              <div className="mt-16 pt-12 border-t max-w-[65ch] mx-auto">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <User className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-['Playfair_Display'] italic mb-2">Brandon PT Davis</h3>
                    <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Scenic & Experiential Designer</p>
                    <p className="text-foreground/80 leading-relaxed mb-6">
                      Brandon PT Davis is a Scenic and Experiential Designer based in Los Angeles. 
                      His work explores the intersection of physical space, digital technology, and narrative storytelling.
                    </p>
                    
                    {/* Engagement Metrics */}
                    <div className="flex items-center gap-6 text-sm">
                      <button 
                        onClick={handleLikeToggle}
                        className="flex items-center gap-2 transition-colors hover:scale-110 transform"
                        style={hasLiked && category ? {
                          color: getCategoryColor(category.name).hex
                        } : undefined}
                      >
                        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                        <span className="font-medium">{article?.likes || 0}</span>
                      </button>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Eye className="w-5 h-5" />
                        <span>{article?.views || 0} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Articles */}
              {related.length > 0 && (
                <div className="mt-20 pt-12 border-t">
                  <h2 className="text-3xl font-['Playfair_Display'] italic mb-8">Continue Reading</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {related.map((relatedArticle) => (
                      <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`}>
                        <div className="group cursor-pointer">
                          {relatedArticle.coverImageUrl && (
                            <div className="mb-4 overflow-hidden rounded-xl">
                              <img 
                                src={relatedArticle.coverImageUrl}
                                alt={decodeHTMLEntities(relatedArticle.title)}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"

                              />
                            </div>
                          )}
                          <h3 className="text-xl font-['Playfair_Display'] italic group-hover:text-primary transition-colors">
                            {decodeHTMLEntities(relatedArticle.title)}
                          </h3>
                          {relatedArticle.excerpt && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {decodeHTMLEntities(relatedArticle.excerpt)}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table of Contents - Desktop - Sticky Position */}
            {headings.length > 0 && (
              <div className="hidden lg:block lg:w-64 flex-shrink-0">
                <div className="sticky top-28 w-64 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-4 font-semibold">Table of Contents</h3>
                  <nav className="space-y-2">
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block text-sm py-1 border-l-2 pl-4 transition-colors cursor-pointer ${
                          activeHeading === heading.id
                            ? 'font-medium'
                            : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                        }`}
                        style={activeHeading === heading.id && category ? {
                          borderColor: getCategoryColor(category.name).hex,
                          color: getCategoryColor(category.name).hex
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
          height: 400px !important;
          object-fit: cover !important;
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

        /* Drop Cap First Letter */
        .article-content p:first-of-type::first-letter {
          font-size: 4.5rem;
          font-weight: bold;
          line-height: 0.8;
          float: left;
          margin-right: 0.75rem;
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
}
