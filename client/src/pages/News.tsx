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
import { NewsListSkeleton } from "@/components/SkeletonLoaders";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function News() {
  return (
    <PageThemeWrapper forceTheme={null}>
      <NewsContent />
      <ThemeToggle />
    </PageThemeWrapper>
  );
}

function NewsContent() {
  const { data: newsItems = [], isLoading } = trpc.news.list.useQuery({ status: "published" });
  const { data: allCategories = [] } = trpc.categories.list.useQuery({});

  const getNewsTimestamp = (item: any) =>
    new Date(item.date ?? item.publishedAt ?? item.createdAt ?? 0).getTime();

  const newsCategories = useMemo(() => {
    return allCategories.filter((cat) => cat.type === "news");
  }, [allCategories]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredNews = useMemo(() => {
    return newsItems
      .filter((item) => {
        const matchesSearch =
          searchQuery === "" ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === "all" || item.categoryId === parseInt(selectedCategory);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => getNewsTimestamp(b) - getNewsTimestamp(a));
  }, [newsItems, searchQuery, selectedCategory]);

  const newsByYear = useMemo(() => {
    const grouped: Record<number, typeof newsItems> = {};

    filteredNews.forEach((item) => {
      const year = new Date(getNewsTimestamp(item)).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(item);
    });

    return Object.entries(grouped)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
      .map(([year, items]) => ({
        year: parseInt(year),
        items: items.sort((a, b) => getNewsTimestamp(b) - getNewsTimestamp(a)),
      }));
  }, [filteredNews, newsItems]);

  const featuredNews = filteredNews[0];
  const hasFilters = searchQuery.trim().length > 0 || selectedCategory !== "all";

  if (isLoading) {
    return (
      <>
        <Header />
        <NewsListSkeleton />
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Production News | Scenic Design Updates & Announcements"
        description="Latest scenic design production news, project announcements, and theatre industry updates from Brandon PT Davis. Regional theatre design news and achievements."
        keywords="scenic design news, production announcements, theatre design updates, Brandon PT Davis news, regional theatre productions, scenic designer announcements"
        image={featuredNews?.coverImageUrl || undefined}
        url="https://www.brandonptdavis.com/news"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "News", url: "https://www.brandonptdavis.com/news" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Production News",
          url: "https://www.brandonptdavis.com/news",
          description: "Production updates, press coverage, and milestones from scenic design projects.",
          about: "Scenic design news and press updates by Brandon PT Davis.",
          primaryImageOfPage: featuredNews?.coverImageUrl || undefined,
          mainEntity: {
            name: "News Stories",
            itemListElement: filteredNews.slice(0, 24).map((item, index) => ({
              position: index + 1,
              name: item.title,
              url: `https://www.brandonptdavis.com/news/${item.slug}`,
              datePublished: (() => {
                const raw = item.date ?? item.publishedAt ?? item.createdAt;
                if (!raw) return undefined;
                const parsed = new Date(raw);
                return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
              })(),
              image: item.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <Header />

      <section className="pt-28 pb-12">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-bold leading-[0.95] mb-4">
              Production News
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 max-w-3xl leading-relaxed">
              Project launches, press, and production milestones from the archive.
            </p>

            <div className="mt-8 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 md:p-6 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.65)]">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_150px] gap-3 items-stretch">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search headlines, excerpts, and locations"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 bg-background/90 border-border/70"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-11 bg-background/90 border-border/70">
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
                  <Button variant="outline" size="lg" className="h-11 w-full border-border/70">
                    <Rss className="h-4 w-4 mr-2" />
                    RSS Feed
                  </Button>
                </a>
              </div>

              {newsCategories.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-full border text-xs tracking-[0.14em] uppercase transition-colors ${
                      selectedCategory === "all"
                        ? "border-primary/70 text-primary bg-primary/10"
                        : "border-border/50 text-foreground/70 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    All
                  </button>
                  {newsCategories.map((cat) => {
                    const active = selectedCategory === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(String(cat.id))}
                        className={`px-3 py-1.5 rounded-full border text-xs tracking-[0.14em] uppercase transition-colors ${
                          active
                            ? "border-primary/70 text-primary bg-primary/10"
                            : "border-border/50 text-foreground/70 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {hasFilters && (
                <div className="mt-4 flex justify-start md:justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                    className="text-foreground/70 hover:text-primary"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {featuredNews && (
        <section className="pb-14">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <Link href={`/news/${featuredNews.slug}`}>
                <Card className="overflow-hidden transition-colors duration-300 group cursor-pointer border border-border/50 p-0 hover:border-primary/50 rounded-3xl shadow-[0_20px_80px_-45px_rgba(0,0,0,0.75)]">
                  <div className="aspect-[16/9] overflow-hidden">
                    {featuredNews.coverImageUrl ? (
                      <img
                        src={featuredNews.coverImageUrl}
                        alt={featuredNews.title}
                        className="w-full h-full object-cover"
                        loading="eager"
                        decoding="async"
                        sizes="(max-width: 1024px) 100vw, 1024px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/40" />
                    )}
                  </div>
                  <CardContent className="p-7 md:p-9">
                    <Badge className="mb-4 bg-primary/15 text-primary border border-primary/40 font-semibold tracking-wider text-[10px] uppercase">
                      Featured Update
                    </Badge>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-['Playfair_Display'] italic font-bold mb-4 group-hover:text-primary transition-colors leading-tight">
                      {featuredNews.title}
                    </h2>
                    {featuredNews.excerpt && (
                      <p className="text-base md:text-lg text-foreground/75 mb-5 leading-relaxed line-clamp-3">
                        {featuredNews.excerpt}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(getNewsTimestamp(featuredNews)).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {featuredNews.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{featuredNews.location}</span>
                        </div>
                      )}
                      <div className="ml-auto flex items-center gap-2 text-primary font-semibold">
                        Open Story
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="pb-24">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            {newsByYear.length > 0 && (
              <div className="mb-8 rounded-2xl border border-border/50 bg-card/60 p-4 md:p-5">
                <p className="text-xs tracking-[0.16em] uppercase text-foreground/55 mb-3">Jump To Year</p>
                <div className="flex flex-wrap gap-2">
                  {newsByYear.map(({ year }) => (
                    <a
                      key={year}
                      href={`#news-year-${year}`}
                      className="px-3 py-1.5 rounded-full border border-border/50 text-xs text-foreground/70 hover:border-primary/50 hover:text-primary transition-colors"
                    >
                      {year}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {newsByYear.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground">No news items found.</p>
              </div>
            ) : (
              <div className="space-y-14">
                {newsByYear.map(({ year, items }) => (
                  <div key={year} id={`news-year-${year}`} className="scroll-mt-24">
                    <div className="mb-4 flex items-end justify-between rounded-2xl border border-border/50 bg-card/60 px-4 py-3 shadow-[0_12px_40px_-30px_rgba(0,0,0,0.7)]">
                      <p className="text-2xl md:text-3xl font-bold tracking-tight">{year}</p>
                      <p className="text-xs tracking-[0.16em] uppercase text-foreground/55">
                        {items.length} {items.length === 1 ? "story" : "stories"}
                      </p>
                    </div>
                    <div className="space-y-0">
                      {items.map((item, index) => {
                        const category = newsCategories.find((c) => c.id === item.categoryId);
                        const isFirst = index === 0;
                        const isLast = index === items.length - 1;

                        return (
                          <Link key={item.id} href={`/news/${item.slug}`}>
                            <Card
                              className={`group cursor-pointer border border-border/50 hover:border-primary/50 p-0 overflow-hidden transition-colors duration-300 bg-card/70 ${
                                isFirst ? "rounded-t-2xl rounded-b-none" : ""
                              } ${isLast ? "rounded-b-2xl rounded-t-none" : ""} ${
                                !isFirst && !isLast ? "rounded-none" : ""
                              } ${!isFirst ? "-mt-px" : ""}`}
                            >
                              <div className="grid md:grid-cols-[220px_1fr] gap-0">
                                {item.coverImageUrl ? (
                                  <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                                    <img
                                      src={item.coverImageUrl}
                                      alt={item.title}
                                      className="w-full h-full object-cover"
                                      loading="lazy"
                                      decoding="async"
                                      sizes="(max-width: 768px) 100vw, 220px"
                                    />
                                  </div>
                                ) : (
                                  <div className="h-full min-h-[160px] bg-gradient-to-br from-muted to-muted/40" />
                                )}

                                <CardContent className="p-5 md:p-6">
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    {category && (
                                      <Badge className="bg-primary/10 text-primary border border-primary/35 font-medium text-[10px] tracking-[0.12em] uppercase">
                                        {category.name}
                                      </Badge>
                                    )}
                                    <span className="text-xs text-foreground/50">
                                      {new Date(getNewsTimestamp(item)).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>

                                  <h3 className="text-xl font-['Playfair_Display'] italic font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                  </h3>

                                  {item.excerpt && (
                                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed line-clamp-2">{item.excerpt}</p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-3 text-xs text-foreground/55">
                                    {item.location && (
                                      <div className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        <span className="line-clamp-1">{item.location}</span>
                                      </div>
                                    )}
                                    <div className="ml-auto flex items-center gap-1.5 text-primary">
                                      <span>Read</span>
                                      <ArrowRight className="h-3.5 w-3.5" />
                                    </div>
                                  </div>
                                </CardContent>
                              </div>
                            </Card>
                          </Link>
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
