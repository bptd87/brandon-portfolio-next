import { useEffect, useState, createElement } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, ExternalLink, MapPin, Share2, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsDetailSkeleton } from "@/components/SkeletonLoaders";

// Helper function to create pixelated gradient from image
function createPixelatedGradient(imageUrl: string, callback: (gradient: string) => void) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl;
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Sample colors from image
    canvas.width = 10;
    canvas.height = 10;
    ctx.drawImage(img, 0, 0, 10, 10);
    
    const imageData = ctx.getImageData(0, 0, 10, 10);
    const pixels = imageData.data;
    
    // Extract dominant colors
    const colors: string[] = [];
    for (let i = 0; i < pixels.length; i += 40) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    // Create pixelated gradient
    const gradient = `
      repeating-linear-gradient(
        45deg,
        ${colors[0]} 0px,
        ${colors[1]} 20px,
        ${colors[2]} 40px,
        ${colors[3]} 60px,
        ${colors[4]} 80px
      ),
      repeating-linear-gradient(
        -45deg,
        ${colors[5] || colors[0]} 0px,
        ${colors[6] || colors[1]} 20px,
        ${colors[7] || colors[2]} 40px,
        ${colors[8] || colors[3]} 60px,
        ${colors[9] || colors[4]} 80px
      )
    `;
    
    callback(gradient);
  };
}

export default function NewsDetail() {
  return (
    <PageThemeWrapper forceTheme={null}>
      <NewsDetailContent />
      <ThemeToggle />
    </PageThemeWrapper>
  );
}

function NewsDetailContent() {
  const { slug } = useParams<{ slug: string }>();
  const { data: newsItem, isLoading } = trpc.news.getBySlug.useQuery({ slug: slug! });
  const { data: relatedNews } = trpc.news.list.useQuery({});
  const { data: category } = trpc.categories.getById.useQuery(
    { id: newsItem?.categoryId || 0 },
    { enabled: !!newsItem?.categoryId }
  );
  
  const [heroGradient, setHeroGradient] = useState<string>("");

  // Generate gradient for hero
  useEffect(() => {
    if (newsItem?.coverImageUrl) {
      createPixelatedGradient(newsItem.coverImageUrl, setHeroGradient);
    }
  }, [newsItem]);

  // SEO: Update page title and meta description
  useEffect(() => {
    if (newsItem) {
      document.title = `${newsItem.title} | Brandon PT Davis`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', newsItem.excerpt || newsItem.title);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = newsItem.excerpt || newsItem.title;
        document.head.appendChild(meta);
      }

      // Open Graph tags
      const updateOrCreateMeta = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateMeta('og:title', newsItem.title);
      updateOrCreateMeta('og:description', newsItem.excerpt || newsItem.title);
      updateOrCreateMeta('og:type', 'article');
      updateOrCreateMeta('og:url', window.location.href);
      if (newsItem.coverImageUrl) {
        updateOrCreateMeta('og:image', newsItem.coverImageUrl);
      }

      // Twitter Card tags
      const updateOrCreateTwitterMeta = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      };

      updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
      updateOrCreateTwitterMeta('twitter:title', newsItem.title);
      updateOrCreateTwitterMeta('twitter:description', newsItem.excerpt || newsItem.title);
      if (newsItem.coverImageUrl) {
        updateOrCreateTwitterMeta('twitter:image', newsItem.coverImageUrl);
      }
    }

    return () => {
      document.title = 'Brandon PT Davis';
    };
  }, [newsItem]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem?.title,
          text: newsItem?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <NewsDetailSkeleton />
        <Footer />
      </>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-4xl font-['Playfair_Display'] italic mb-4">News Item Not Found</h1>
          <p className="text-muted-foreground mb-8">The news item you're looking for doesn't exist.</p>
          <Link href="/news">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to News
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Parse content blocks
  const contentBlocks = newsItem.blocks || [];

  // Get related news - chronologically nearby articles (within 6 months)
  const related = relatedNews
    ?.filter(n => n.id !== newsItem.id)
    .map(n => ({
      ...n,
      timeDiff: Math.abs(
        new Date(n.publishedAt || n.createdAt).getTime() - 
        new Date(newsItem.publishedAt || newsItem.createdAt).getTime()
      )
    }))
    .sort((a, b) => a.timeDiff - b.timeDiff)
    .slice(0, 3) || [];
  
  // Get prev/next articles chronologically
  const allNewsSorted = relatedNews
    ?.sort((a, b) => 
      new Date(b.publishedAt || b.createdAt).getTime() - 
      new Date(a.publishedAt || a.createdAt).getTime()
    ) || [];
  const currentIndex = allNewsSorted.findIndex(n => n.id === newsItem.id);
  const prevArticle = currentIndex > 0 ? allNewsSorted[currentIndex - 1] : null;
  const nextArticle = currentIndex < allNewsSorted.length - 1 ? allNewsSorted[currentIndex + 1] : null;

  // Calculate word count from content blocks
  const wordCount = Array.isArray(contentBlocks) ? contentBlocks.reduce((count: number, block: any) => {
    if (block.type === 'text' && block.content) {
      return count + block.content.split(/\s+/).length;
    }
    return count;
  }, 0) : 0;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${newsItem.title} | Brandon PT Davis`}
        description={newsItem.excerpt || `${newsItem.title} - News from Brandon PT Davis`}
        image={newsItem.coverImageUrl || undefined}
        type="article"
        publishedTime={newsItem.date?.toISOString()}
        modifiedTime={newsItem.updatedAt?.toISOString()}
      />
      <StructuredData
        type="Article"
        article={{
          headline: newsItem.title,
          description: newsItem.excerpt || undefined,
          image: newsItem.coverImageUrl || undefined,
          author: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: newsItem.date ? new Date(newsItem.date).toISOString() : new Date(newsItem.createdAt).toISOString(),
          dateModified: newsItem.updatedAt ? new Date(newsItem.updatedAt).toISOString() : undefined,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YiqCsZPgtoSSsQyE.png",
          },
          url: `https://www.brandonptdavis.com/news/${newsItem.slug}`,
          wordCount: wordCount > 0 ? wordCount : undefined,
          keywords: newsItem.tags ? newsItem.tags.map((tag: any) => tag.name) : [],
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "News", url: "https://www.brandonptdavis.com/news" },
          { name: newsItem.title, url: `https://www.brandonptdavis.com/news/${newsItem.slug}` },
        ]}
      />
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="container py-6">
        <Breadcrumb
          items={[
            { label: "News", href: "/news" },
            { label: newsItem.title }
          ]}
        />
      </div>

      {/* Hero Section with Title Overlay */}
      <section 
        className="relative min-h-[70vh] overflow-hidden"
        style={{
          background: heroGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Pixelated gradient background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: heroGradient || 'none',
            filter: 'blur(60px)',
          }}
        />
        
        {newsItem.coverImageUrl && (
          <>
            <img 
              src={newsItem.coverImageUrl} 
              alt={newsItem.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </>
        )}
        
        <div className="relative container h-full flex items-end pb-16 pt-32 min-h-[70vh]">
          <div className="max-w-5xl w-full">
            {/* Navigation Row: Back Button + Category Badge */}
            <div className="flex items-center justify-between mb-8">
              <Link href="/news">
                <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to News
                </Button>
              </Link>
              
              {category && (
                <Badge className="bg-[#00E5FF] text-black font-black tracking-wider text-sm px-4 py-2">
                  {category.name.toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Title Overlay */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-bold text-white mb-6 leading-tight">
              {newsItem.title}
            </h1>

            {/* Excerpt */}
            {newsItem.excerpt && (
              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                {newsItem.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              {newsItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg font-medium">{newsItem.location}</span>
                </div>
              )}
              <Button 
                onClick={handleShare}
                variant="outline"
                size="lg"
                className="ml-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* External Link Button */}
            {newsItem.externalLink && (
              <div className="mb-12">
                <a 
                  href={newsItem.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="lg" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Visit {newsItem.location || 'Link'}
                  </Button>
                </a>
              </div>
            )}

            {/* Render Content Blocks */}
            {Array.isArray(contentBlocks) && contentBlocks.length > 0 ? (
              contentBlocks.map((block: any, index: number) => {
                switch (block.type) {
                  case 'text':
                    return (
                      <div key={index} className="prose prose-lg max-w-none mb-8">
                        <p className="text-foreground/90 leading-relaxed text-lg">{block.content}</p>
                      </div>
                    );
                  
                  case 'header':
                    const headerLevel = block.level || 2;
                    const headerClasses = `font-['Playfair_Display'] italic font-bold text-foreground ${
                      headerLevel === 3 ? 'text-2xl' : headerLevel === 4 ? 'text-xl' : 'text-3xl'
                    }`;
                    return (
                      <div key={index} className="mb-8">
                        {createElement(`h${headerLevel}`, { className: headerClasses }, block.content)}
                      </div>
                    );
                  
                  case 'link':
                    return (
                      <div key={index} className="mb-8">
                        <a 
                          href={block.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button size="lg" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {block.label || 'Visit Link'}
                          </Button>
                        </a>
                      </div>
                    );
                  
                  case 'image':
                    return (
                      <div key={index} className="mb-12">
                        <img 
                          src={block.url} 
                          alt={block.caption || ''}
                          className="w-full rounded-xl shadow-lg"
                        />
                        {block.caption && (
                          <p className="text-sm text-muted-foreground mt-3 text-center italic">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  
                  case 'gallery':
                    return (
                      <div key={index} className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {block.images?.map((img: any, imgIndex: number) => (
                            <img 
                              key={imgIndex}
                              src={img.url} 
                              alt={img.caption || ''}
                              className="w-full aspect-square object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                            />
                          ))}
                        </div>
                      </div>
                    );
                  
                  case 'details':
                    return (
                      <div key={index} className="mb-12">
                        {block.title && (
                          <h3 className="text-2xl font-bold mb-6 text-foreground">{block.title}</h3>
                        )}
                        <div className="space-y-2">
                          {block.items?.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                              <span className="text-foreground/90 font-medium">{item.label}</span>
                              <span className="text-muted-foreground text-right ml-4">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  
                  case 'quote':
                    return (
                      <div key={index} className="mb-12">
                        <blockquote className="border-l-4 border-[#FF5722] pl-6 py-4 bg-accent/30 rounded-r-lg">
                          <p className="text-xl font-['Playfair_Display'] italic text-foreground mb-4 leading-relaxed">
                            "{block.text}"
                          </p>
                          {(block.author || block.source) && (
                            <footer className="text-sm text-muted-foreground">
                              {block.author && <span className="font-semibold">— {block.author}</span>}
                              {block.source && <span className="ml-2">({block.source})</span>}
                            </footer>
                          )}
                        </blockquote>
                      </div>
                    );
                  
                  case 'team':
                    return (
                      <div key={index} className="mb-12">
                        {block.title && (
                          <h3 className="text-2xl font-bold mb-6 text-foreground">{block.title}</h3>
                        )}
                        <div className="space-y-3">
                          {block.members?.map((member: any, memberIndex: number) => (
                            <div key={memberIndex} className="flex justify-between items-center py-2">
                              <span className="text-muted-foreground font-medium">{member.role}</span>
                              <span className="text-foreground font-semibold">{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  
                  case 'list':
                    const ListTag = block.ordered ? 'ol' : 'ul';
                    return (
                      <div key={index} className="mb-8">
                        <ListTag className={block.ordered ? "list-decimal list-inside space-y-2 text-foreground/90 text-lg" : "list-disc list-inside space-y-2 text-foreground/90 text-lg"}>
                          {block.items?.map((item: string, itemIndex: number) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ListTag>
                      </div>
                    );
                  
                  case 'video':
                    return (
                      <div key={index} className="mb-12">
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                          <iframe
                            src={block.url}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        {block.caption && (
                          <p className="text-sm text-muted-foreground mt-3 text-center italic">
                            {block.caption}
                          </p>
                        )}
                      </div>
                    );
                  
                  case 'faq':
                    return (
                      <div key={index} className="mb-12">
                        <div className="space-y-4">
                          {block.items?.map((faqItem: any, faqIndex: number) => (
                            <div key={faqIndex} className="border-b border-border/50 pb-4 last:border-0">
                              <h4 className="text-lg font-bold text-foreground mb-2">{faqItem.question}</h4>
                              <p className="text-foreground/90 leading-relaxed">{faqItem.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  
                  default:
                    return null;
                }
              })
            ) : (
              <p className="text-muted-foreground text-center py-12">No content available.</p>
            )}

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag: any) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                      <Badge 
                        variant="outline" 
                        className="text-sm font-normal px-4 py-2 rounded-full transition-all hover:scale-105 cursor-pointer"
                        style={{
                          borderColor: `hsl(var(--accent))`,
                          color: `hsl(var(--accent-foreground))`,
                          backgroundColor: `hsl(var(--accent) / 0.1)`
                        }}
                      >
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Prev/Next Navigation */}
            {(prevArticle || nextArticle) && (
              <div className="mt-16 pt-8 border-t border-border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {prevArticle && (
                    <Link href={`/news/${prevArticle.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all group cursor-pointer p-6">
                        <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4" />
                          Previous Article
                        </div>
                        <h4 className="text-lg font-['Playfair_Display'] italic font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {prevArticle.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(prevArticle.publishedAt || prevArticle.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  )}
                  {nextArticle && (
                    <Link href={`/news/${nextArticle.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all group cursor-pointer p-6 text-right">
                        <div className="text-sm text-muted-foreground mb-2 flex items-center justify-end gap-2">
                          Next Article
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </div>
                        <h4 className="text-lg font-['Playfair_Display'] italic font-bold group-hover:text-primary transition-colors line-clamp-2">
                          {nextArticle.title}
                        </h4>
                        <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mt-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(nextArticle.publishedAt || nextArticle.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </Card>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related News */}
      {related.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-4xl font-['Playfair_Display'] italic font-bold mb-12 bg-gradient-to-r from-[#FF5722] to-[#FF1744] bg-clip-text text-transparent">
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer p-0">
                    {item.coverImageUrl && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
