import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, ExternalLink, MapPin, Share2, ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: newsItem, isLoading } = trpc.news.getBySlug.useQuery({ slug: slug! });
  const { data: relatedNews } = trpc.news.list.useQuery({});
  const { data: category } = trpc.categories.getById.useQuery(
    { id: newsItem?.categoryId || 0 },
    { enabled: !!newsItem?.categoryId }
  );

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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
        <Footer />
      </div>
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

  // Get related news (exclude current)
  const related = relatedNews?.filter(n => n.id !== newsItem.id).slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] bg-gradient-to-br from-background to-muted/30 py-20">
        {newsItem.coverImageUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: `url(${newsItem.coverImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        )}
        
        <div className="relative container">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Link href="/news">
              <Button variant="ghost" className="mb-8 -ml-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
              </Button>
            </Link>

            {/* Category Badge */}
            {category && (
              <Badge className="mb-6 bg-primary text-primary-foreground font-bold tracking-wider text-sm">
                {category.name.toUpperCase()}
              </Badge>
            )}

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-normal mb-6 leading-tight">
              {newsItem.title}
            </h1>

            {/* Excerpt */}
            {newsItem.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {newsItem.excerpt}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              {newsItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{newsItem.location}</span>
                </div>
              )}
              <Button 
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="ml-auto"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cover Image (if exists) */}
      {newsItem.coverImageUrl && (
        <section className="py-8">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <img 
                src={newsItem.coverImageUrl} 
                alt={newsItem.title}
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
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
                  
                  case 'link':
                    return (
                      <div key={index} className="mb-8">
                        <a 
                          href={block.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button size="lg" className="font-semibold">
                            {block.label || 'Read More'}
                            <ExternalLink className="ml-2 h-5 w-5" />
                          </Button>
                        </a>
                      </div>
                    );
                  
                  case 'gallery':
                    return (
                      <div key={index} className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                        {block.images?.map((img: string, imgIndex: number) => (
                          <img 
                            key={imgIndex}
                            src={img} 
                            alt={`Gallery image ${imgIndex + 1}`}
                            className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                          />
                        ))}
                      </div>
                    );
                  
                  case 'quote':
                    return (
                      <blockquote key={index} className="border-l-4 border-primary pl-6 my-8 italic text-2xl text-foreground/80">
                        "{block.content}"
                        {block.author && (
                          <footer className="text-base text-muted-foreground mt-3 not-italic">
                            — {block.author}
                          </footer>
                        )}
                      </blockquote>
                    );
                  
                  default:
                    return null;
                }
              })
            ) : (
              <p className="text-muted-foreground italic">No additional content available.</p>
            )}

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border">
                <p className="text-sm font-medium text-muted-foreground mb-3">TAGS</p>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag) => (
                    <Badge 
                      key={tag.id}
                      variant="secondary"
                      className="text-sm"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related News Section */}
      {related.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-['Playfair_Display'] italic font-normal">Read Next</h2>
              <Link href="/news">
                <Button variant="outline">View All News</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full group border-2 hover:border-primary/50">
                    {item.coverImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      )}
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
