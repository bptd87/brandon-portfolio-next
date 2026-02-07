import { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, ArrowRight, Search, Rss } from "lucide-react";
import { Link } from "wouter";

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

// News card with dynamic gradient background
function NewsCard({ item }: { item: any }) {
  const [gradient, setGradient] = useState<string>("");
  
  useEffect(() => {
    if (item.coverImageUrl) {
      createPixelatedGradient(item.coverImageUrl, setGradient);
    }
  }, [item.coverImageUrl]);
  
  return (
    <Link href={`/news/${item.slug}`}>
      <Card 
        className="h-full hover:shadow-2xl transition-all duration-500 group cursor-pointer border-0 overflow-hidden relative"
        style={{
          background: gradient ? gradient : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundBlendMode: 'overlay',
          backgroundSize: '200% 200%',
        }}
      >
        {/* Pixelated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage: gradient || 'none',
            filter: 'blur(40px)',
          }}
        />
        
        {/* Image with title overlay */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {item.coverImageUrl ? (
            <>
              <img 
                src={item.coverImageUrl} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Dark gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              
              {/* Title overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-bold text-white mb-2 leading-tight group-hover:text-[#00E5FF] transition-colors">
                  {item.title}
                </h3>
                {item.location && (
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.location}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <Calendar className="h-24 w-24 text-primary/20" />
            </div>
          )}
        </div>
        
        {/* Card content */}
        <CardContent className="p-6 relative z-10 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          {item.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {item.excerpt}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function News() {
  const { data: newsItems, isLoading } = trpc.news.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [heroGradient, setHeroGradient] = useState<string>("");
  
  // Filter news based on search and category
  const filteredNews = useMemo(() => {
    if (!newsItems) return [];
    
    return newsItems.filter(item => {
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        item.categoryId?.toString() === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [newsItems, searchQuery, selectedCategory]);

  const featuredNews = filteredNews?.[0];
  const remainingNews = filteredNews?.slice(1) || [];
  
  // Generate gradient for hero
  useEffect(() => {
    if (featuredNews?.coverImageUrl) {
      createPixelatedGradient(featuredNews.coverImageUrl, setHeroGradient);
    }
  }, [featuredNews]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading news...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-primary mb-4 tracking-wider">NEWS & UPDATES</p>
            <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] italic font-bold mb-6 bg-gradient-to-r from-[#00E5FF] via-[#FF5722] to-[#FF1744] bg-clip-text text-transparent">
              Latest Announcements
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Project launches, career milestones, press features, and industry recognition.
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mt-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search news by title, location, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[200px] h-12">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <a href="/api/news/rss" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="h-12 w-full md:w-auto">
                  <Rss className="h-4 w-4 mr-2" />
                  RSS Feed
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured News Hero with Title Overlay */}
      {featuredNews && (
        <section 
          className="relative py-0 overflow-hidden"
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
          
          <div className="container relative z-10">
            <Link href={`/news/${featuredNews.slug}`}>
              <div className="relative aspect-[21/9] overflow-hidden group cursor-pointer">
                {/* Hero Image */}
                {featuredNews.coverImageUrl ? (
                  <>
                    <img 
                      src={featuredNews.coverImageUrl} 
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-12 md:p-16">
                      <Badge className="bg-[#00E5FF] text-black font-black tracking-wider mb-6 text-sm px-4 py-2">
                        LATEST NEWS
                      </Badge>
                      
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-bold text-white mb-6 leading-tight max-w-4xl group-hover:text-[#00E5FF] transition-colors">
                        {featuredNews.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-6 mb-6 text-white/90">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span className="text-lg font-medium">
                            {new Date(featuredNews.publishedAt || featuredNews.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {featuredNews.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            <span className="text-lg font-medium">{featuredNews.location}</span>
                          </div>
                        )}
                      </div>

                      {featuredNews.excerpt && (
                        <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                          {featuredNews.excerpt}
                        </p>
                      )}

                      <Button size="lg" className="bg-[#FF5722] hover:bg-[#FF5722]/90 text-white font-bold text-lg px-8 py-6">
                        Read Full Story
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Calendar className="h-32 w-32 text-primary/20" />
                  </div>
                )}
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* News Grid with Dynamic Gradients */}
      {remainingNews.length > 0 && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-bold mb-12 bg-gradient-to-r from-[#FF5722] to-[#FF1744] bg-clip-text text-transparent">
              More News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {(!newsItems || newsItems.length === 0) && !isLoading && (
        <section className="py-20">
          <div className="container text-center">
            <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">No news items yet. Check back soon!</p>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
