import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function News() {
  const { data: newsItems, isLoading } = trpc.news.list.useQuery({});

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

  const featuredNews = newsItems?.[0];
  const remainingNews = newsItems?.slice(1) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-medium text-primary mb-4 tracking-wider">NEWS & UPDATES</p>
            <h1 className="text-5xl md:text-6xl font-['Playfair_Display'] italic font-normal mb-6">
              Latest Announcements
            </h1>
            <p className="text-xl text-muted-foreground">
              Project launches, career milestones, press features, and industry recognition.
            </p>
          </div>
        </div>
      </section>

      {/* Featured News Hero */}
      {featuredNews && (
        <section className="py-16 bg-muted/30">
          <div className="container">
            <Link href={`/news/${featuredNews.slug}`}>
              <div className="grid lg:grid-cols-2 gap-8 items-center group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {featuredNews.coverImageUrl ? (
                    <img 
                      src={featuredNews.coverImageUrl} 
                      alt={featuredNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Calendar className="h-24 w-24 text-primary/20" />
                    </div>
                  )}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-primary text-primary-foreground font-bold tracking-wider">
                      LATEST
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
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

                  <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-normal mb-4 group-hover:text-primary transition-colors">
                    {featuredNews.title}
                  </h2>

                  {featuredNews.excerpt && (
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                      {featuredNews.excerpt}
                    </p>
                  )}

                  <Button className="group/btn">
                    Read Full Story
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* News Grid */}
      {remainingNews.length > 0 && (
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-['Playfair_Display'] italic font-normal mb-8">
              More News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary/50">
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
                      <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-3 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      {item.location && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                      )}
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
