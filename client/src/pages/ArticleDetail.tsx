import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEffect, useRef } from "react";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading } = trpc.articles.getBySlug.useQuery({ slug: slug! });
  const { data: category } = trpc.categories.getById.useQuery(
    { id: article?.categoryId || 0 },
    { enabled: !!article?.categoryId }
  );
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract and display WordPress galleries
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Find all WordPress gallery blocks
    const galleries = contentRef.current.querySelectorAll('.wp-block-gallery, .blocks-gallery-grid');
    galleries.forEach((gallery) => {
      gallery.classList.add('article-gallery');
    });

    // Find all WordPress images and ensure they're responsive
    const images = contentRef.current.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.classList.contains('wp-image')) {
        img.classList.add('article-image');
      }
    });
  }, [article]);

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

  // Parse content sections - handle both JSON and plain text
  let contentSections: any[] = [];
  try {
    contentSections = typeof article.content === 'string' 
      ? JSON.parse(article.content) 
      : article.content || [];
  } catch (e) {
    contentSections = [{ type: 'html', content: article.content }];
  }

  // Calculate read time
  const wordCount = JSON.stringify(contentSections).split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <article className="py-12 md:py-20">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Link href="/articles">
            <Button variant="ghost" className="mb-8 -ml-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6 text-sm uppercase tracking-wider">
              {category && (
                <Badge variant="secondary" className="font-bold bg-primary/10 text-primary hover:bg-primary/20">
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
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-['Playfair_Display'] italic font-normal mb-6 leading-tight">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
            )}
          </header>

          {/* Cover Image */}
          {article.coverImageUrl && (
            <figure className="mb-12 -mx-4 md:mx-0">
              <img 
                src={article.coverImageUrl} 
                alt={article.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </figure>
          )}

          {/* Article Content */}
          <div 
            ref={contentRef}
            className="article-content prose prose-lg max-w-none
              prose-headings:font-['Playfair_Display'] prose-headings:italic prose-headings:font-normal
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 
              prose-blockquote:italic prose-blockquote:text-xl prose-blockquote:my-8
              prose-ul:my-6 prose-ol:my-6
              prose-li:my-2
              prose-img:rounded-lg prose-img:my-8
              prose-figure:my-8
              prose-figcaption:text-sm prose-figcaption:text-muted-foreground prose-figcaption:text-center prose-figcaption:mt-2"
          >
            {Array.isArray(contentSections) && contentSections.map((section: any, index: number) => {
              switch (section.type) {
                case 'heading':
                  return (
                    <h2 key={index} className="scroll-mt-24">
                      {section.content}
                    </h2>
                  );
                
                case 'paragraph':
                  return (
                    <p key={index}>
                      {section.content}
                    </p>
                  );
                
                case 'quote':
                  return (
                    <blockquote key={index}>
                      "{section.content}"
                      {section.author && (
                        <footer className="text-sm text-muted-foreground mt-2 not-italic">
                          — {section.author}
                        </footer>
                      )}
                    </blockquote>
                  );
                
                case 'image':
                  return (
                    <figure key={index}>
                      <img 
                        src={section.url} 
                        alt={section.alt || section.caption || ''}
                        className="w-full"
                      />
                      {section.caption && (
                        <figcaption>
                          {section.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                
                case 'gallery':
                  return (
                    <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
                      {section.images?.map((img: any, imgIndex: number) => (
                        <figure key={imgIndex} className="m-0">
                          <img 
                            src={img.url} 
                            alt={img.alt || img.caption || ''}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {img.caption && (
                            <figcaption className="text-xs text-muted-foreground mt-2">
                              {img.caption}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  );
                
                case 'list':
                  const ListTag = section.listType === 'numbered' ? 'ol' : 'ul';
                  return (
                    <ListTag key={index} className={section.listType === 'numbered' ? 'list-decimal' : 'list-disc'}>
                      {section.items?.map((item: string, itemIndex: number) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ListTag>
                  );
                
                case 'text':
                  // Handle text blocks from WordPress import (contains HTML)
                  return (
                    <div 
                      key={index}
                      dangerouslySetInnerHTML={{ __html: section.content?.text || section.content }}
                    />
                  );
                
                case 'html':
                  // Render raw HTML from WordPress import
                  return (
                    <div 
                      key={index}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  );
                
                default:
                  return null;
              }
            })}
          </div>

          {/* Author Bio */}
          <div className="mt-16 pt-12 border-t">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-['Playfair_Display'] italic mb-2">Brandon PT Davis</h3>
                <p className="text-sm text-muted-foreground mb-4">Scenic & Experiential Designer</p>
                <p className="text-foreground/80 leading-relaxed">
                  Brandon PT Davis is a Scenic and Experiential Designer based in Los Angeles. 
                  His work explores the intersection of physical space, digital technology, and narrative storytelling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />

      <style>{`
        /* WordPress Gallery Styles */
        .article-content .wp-block-gallery,
        .article-content .blocks-gallery-grid,
        .article-content .article-gallery {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
          gap: 1rem !important;
          margin: 2rem 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }

        .article-content .wp-block-gallery figure,
        .article-content .blocks-gallery-grid figure,
        .article-content .article-gallery figure {
          margin: 0 !important;
        }

        .article-content .wp-block-gallery img,
        .article-content .blocks-gallery-grid img,
        .article-content .article-gallery img {
          width: 100% !important;
          height: 300px !important;
          object-fit: cover !important;
          border-radius: 0.5rem !important;
        }

        /* WordPress Image Styles */
        .article-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 0.5rem !important;
          margin: 2rem 0 !important;
        }

        /* WordPress Figure Styles */
        .article-content figure {
          margin: 2rem 0 !important;
        }

        .article-content figcaption {
          font-size: 0.875rem !important;
          color: hsl(var(--muted-foreground)) !important;
          text-align: center !important;
          margin-top: 0.5rem !important;
        }

        /* WordPress Accordion/FAQ Styles */
        .article-content .wp-block-accordion {
          margin: 2rem 0 !important;
        }

        .article-content .wp-block-accordion-item {
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 0.5rem !important;
          margin-bottom: 1rem !important;
          overflow: hidden !important;
        }

        .article-content .wp-block-accordion-heading__toggle {
          width: 100% !important;
          padding: 1rem !important;
          background: transparent !important;
          border: none !important;
          text-align: left !important;
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }

        .article-content .wp-block-accordion-heading__toggle:hover {
          background: hsl(var(--accent)) !important;
        }

        .article-content .wp-block-accordion-panel {
          padding: 0 1rem 1rem 1rem !important;
        }

        /* Remove default WordPress spacing */
        .article-content .wp-block-group,
        .article-content .wp-block-columns {
          margin: 0 !important;
        }
      `}</style>
    </div>
  );
}
