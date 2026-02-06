import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Calendar, ExternalLink, MapPin, Share2 } from "lucide-react";
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem?.title,
        text: newsItem?.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"><Footer />
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
          <h1 className="mb-4">News Item Not Found</h1>
          <p className="text-muted-foreground mb-8">The news item you're looking for doesn't exist.</p>
          <Link href="/news">
            <Button>Back to News</Button>
          </Link>
        <Footer />
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

      {/* Hero Section with Full-Width Image */}
      <section className="relative h-[70vh] min-h-[500px] bg-black">
        {newsItem.coverImageUrl ? (
          <img 
            src={newsItem.coverImageUrl} 
            alt={newsItem.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background"><Footer />
    </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"><Footer />
    </div>
        
        <div className="relative h-full container flex flex-col justify-end pb-16">
          <div className="max-w-4xl">
            {category && (
              <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500 text-xs font-bold tracking-wider">
                {category.name.toUpperCase()}
              </Badge>
            )}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] font-bold text-white mb-6 leading-tight">
              {newsItem.title}
            </h1>
            {newsItem.excerpt && (
              <p className="text-xl text-white/90 mb-8 max-w-3xl">
                {newsItem.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <Footer />
    </div>
              {newsItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{newsItem.location}</span>
                <Footer />
    </div>
              )}
            <Footer />
    </div>
          <Footer />
    </div>
          
          <Button 
            onClick={handleShare}
            size="icon"
            variant="outline"
            className="absolute top-8 right-8 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
          >
            <Share2 className="h-4 w-4 text-white" />
          </Button>
        <Footer />
    </div>
      </section>

      {/* Content Section */}
      <section className="bg-[#1a2332] text-white py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            {/* Render Content Blocks */}
            {Array.isArray(contentBlocks) && contentBlocks.map((block: any, index: number) => {
              switch (block.type) {
                case 'text':
                  return (
                    <div key={index} className="prose prose-lg prose-invert max-w-none mb-8">
                      <p className="text-white/90 leading-relaxed">{block.content}</p>
                    <Footer />
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
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold">
                          {block.label || 'READ MORE'}
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    <Footer />
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
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ))}
                    <Footer />
    </div>
                  );
                
                case 'quote':
                  return (
                    <blockquote key={index} className="border-l-4 border-yellow-400 pl-6 my-8 italic text-xl text-white/80">
                      "{block.content}"
                      {block.author && (
                        <footer className="text-sm text-white/60 mt-2 not-italic">
                          — {block.author}
                        </footer>
                      )}
                    </blockquote>
                  );
                
                default:
                  return null;
              }
            })}

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag) => (
                    <span 
                      key={tag.id}
                      className="text-xs text-white/60 hover:text-white/80 transition-colors"
                    >
                      {tag.name}
                    </span>
                  ))}
                <Footer />
    </div>
              <Footer />
    </div>
            )}
          <Footer />
    </div>
        <Footer />
    </div>
      </section>

      {/* Related News Section */}
      {related.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-semibold">Read Next</h2>
              <Link href="/news">
                <Button variant="outline">View Archive</Button>
              </Link>
            <Footer />
    </div>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                    {item.coverImageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={item.coverImageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      <Footer />
    </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.categoryId}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      <Footer />
    </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                      {item.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            <Footer />
    </div>
          <Footer />
    </div>
        </section>
      )}
    <Footer />
    </div>
  );
}
