import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, ArrowRight, Search, Rss } from "lucide-react";
import { Link } from "wouter";

export default function News() {
  return (
    <PageThemeWrapper forceTheme={null}>
      <NewsContent />
      <ThemeToggle />
    </PageThemeWrapper>
  );
}

function NewsContent() {
  const { data: newsItems = [], isLoading } = trpc.news.list.useQuery({});
  const { data: allCategories = [] } = trpc.categories.list.useQuery({});
  
  // Filter to show only news categories
  const newsCategories = useMemo(() => {
    return allCategories.filter(cat => cat.type === 'news');
  }, [allCategories]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter news items
  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      const matchesSearch = searchQuery === "" || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || 
        item.categoryId === parseInt(selectedCategory);
      
      return matchesSearch && matchesCategory;
    });
  }, [newsItems, searchQuery, selectedCategory]);

  // Group news by year
  const newsByYear = useMemo(() => {
    const grouped: Record<number, typeof newsItems> = {};
    
    filteredNews.forEach((item) => {
      const year = new Date(item.publishedAt || item.createdAt).getFullYear();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(item);
    });
    
    // Sort years descending
    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
      .map(([year, items]) => ({
        year: parseInt(year),
        items: items.sort((a, b) => 
          new Date(b.publishedAt || b.createdAt).getTime() - 
          new Date(a.publishedAt || a.createdAt).getTime()
        ),
      }));
  }, [filteredNews]);

  // Get most recent news item for hero
  const featuredNews = filteredNews[0];

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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-background to-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-bold mb-6 bg-gradient-to-r from-[#FF5722] to-[#FF1744] bg-clip-text text-transparent">
              News & Updates
            </h1>
            <p className="text-xl text-muted-foreground">
              Project launches, collaborations, and industry milestones
            </p>
          </div>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[250px] h-12 text-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {newsCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <a href="/api/news/rss" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-12">
                  <Rss className="h-5 w-5 mr-2" />
                  RSS Feed
                </Button>
              </a>
            </div>
          </div>

          {/* Featured News */}
          {featuredNews && (
            <div className="max-w-6xl mx-auto mb-16">
              <Link href={`/news/${featuredNews.slug}`}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border-2 border-primary/20 p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    {featuredNews.coverImageUrl && (
                      <div className="aspect-[16/9] md:aspect-auto overflow-hidden">
                        <img 
                          src={featuredNews.coverImageUrl} 
                          alt={featuredNews.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge className="mb-4 bg-[#00E5FF] text-black font-black tracking-wider text-sm w-fit">
                        LATEST NEWS
                      </Badge>
                      <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] italic font-bold mb-4 group-hover:text-primary transition-colors">
                        {featuredNews.title}
                      </h2>
                      {featuredNews.excerpt && (
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          {featuredNews.excerpt}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(featuredNews.publishedAt || featuredNews.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        {featuredNews.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{featuredNews.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                        Read More
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {newsByYear.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No news items found.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF5722] via-[#00E5FF] to-[#FF1744] hidden md:block" />

                {newsByYear.map(({ year, items }, yearIndex) => (
                  <div key={year} className="mb-16 last:mb-0">
                    {/* Year Header */}
                    <div className="flex items-center gap-6 mb-12">
                      <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FF1744] text-white font-black text-3xl shadow-2xl relative z-10 mx-auto">
                        {year}
                      </div>
                      <h2 className="md:hidden text-5xl font-['Playfair_Display'] italic font-bold bg-gradient-to-r from-[#FF5722] to-[#FF1744] bg-clip-text text-transparent">
                        {year}
                      </h2>
                    </div>

                    {/* News Items for this year */}
                    <div className="space-y-12">
                      {items.map((item, itemIndex) => {
                        const isLeft = itemIndex % 2 === 0;
                        const category = newsCategories.find(c => c.id === item.categoryId);
                        
                        return (
                          <div 
                            key={item.id} 
                            className={`relative ${isLeft ? 'md:pr-[calc(50%+3rem)]' : 'md:pl-[calc(50%+3rem)] md:ml-auto'}`}
                          >
                            {/* Timeline dot */}
                            <div className="hidden md:block absolute top-8 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#00E5FF] border-4 border-background shadow-lg z-10" />
                            
                            <Link href={`/news/${item.slug}`}>
                              <Card className="hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden p-0">
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
                                  {category && (
                                    <Badge className="mb-3 bg-primary/10 text-primary font-bold">
                                      {category.name}
                                    </Badge>
                                  )}
                                  <h3 className="text-2xl font-['Playfair_Display'] italic font-bold mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                  </h3>
                                  {item.excerpt && (
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                      {item.excerpt}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4" />
                                      <span>
                                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { 
                                          month: 'long', 
                                          day: 'numeric' 
                                        })}
                                      </span>
                                    </div>
                                    {item.location && (
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>{item.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
