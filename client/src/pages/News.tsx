import { useMemo, useState } from "react";
import { CalendarDays, ExternalLink, Search } from "lucide-react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";
import {
  ASSISTANT_SCENIC_DESIGN_PATH,
  VOYAGELA_ARTICLE_PATH,
  getLegacyCanonicalDestination,
} from "@shared/publicContent";

export default function News() {
  return (
    <PageThemeWrapper forceTheme={null}>
      <NewsArchiveContent />
      <ThemeToggle />
    </PageThemeWrapper>
  );
}

function NewsArchiveContent() {
  const { data: newsItems = [], isLoading } = trpc.news.list.useQuery({ status: "published" });
  const [searchQuery, setSearchQuery] = useState("");

  const sortedNews = useMemo(() => {
    return [...newsItems].sort((a, b) => {
      const aTime = new Date(a.date ?? a.publishedAt ?? a.createdAt ?? 0).getTime();
      const bTime = new Date(b.date ?? b.publishedAt ?? b.createdAt ?? 0).getTime();
      return bTime - aTime;
    });
  }, [newsItems]);

  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return sortedNews;
    const searchLower = searchQuery.toLowerCase();
    return sortedNews.filter((item) => {
      return (
        item.title.toLowerCase().includes(searchLower) ||
        item.excerpt?.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower)
      );
    });
  }, [searchQuery, sortedNews]);

  const archiveHero = filteredNews[0] || sortedNews[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="News Archive | Brandon PT Davis"
        description="Legacy news archive for production updates, press links, and earlier site content."
        image={archiveHero?.coverImageUrl || undefined}
        url="https://www.brandonptdavis.com/news"
        noindex={true}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "News Archive", url: "https://www.brandonptdavis.com/news" },
        ]}
      />
      <Header />

      <section className="border-b border-border py-20 md:py-24">
        <div className="container max-w-5xl">
          <div className="space-y-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-muted-foreground">
              Archive
            </p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">News Archive</h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              News URLs remain live, but assistant scenic design and editorial profile content now
              live in more durable sections of the site.
            </p>

            <div className="grid gap-4 pt-4 md:grid-cols-2">
              <Link href={ASSISTANT_SCENIC_DESIGN_PATH}>
                <div className="cursor-pointer rounded-2xl border border-border/60 bg-card/20 p-6 text-left transition-colors hover:border-[#FFB000]/60">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FFB000]">
                    Portfolio
                  </p>
                  <h2 className="mb-2 text-2xl font-bold">Assistant Scenic Design</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Portfolio-style one-page home for assistant scenic design credits and season work.
                  </p>
                </div>
              </Link>

              <Link href={VOYAGELA_ARTICLE_PATH}>
                <div className="cursor-pointer rounded-2xl border border-border/60 bg-card/20 p-6 text-left transition-colors hover:border-[#FF9800]/60">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#FF9800]">
                    Articles
                  </p>
                  <h2 className="mb-2 text-2xl font-bold">VoyageLA Interview</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Editorial/profile content has moved into Articles rather than staying in News.
                  </p>
                </div>
              </Link>
            </div>

            <div className="mx-auto w-full max-w-xl pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search archived news"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container max-w-6xl">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading archive...</div>
          ) : filteredNews.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No archived news matched that search.</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredNews.map((item) => {
                const destination = getLegacyCanonicalDestination(item.slug);
                const itemDate = new Date(item.date ?? item.publishedAt ?? item.createdAt ?? 0);

                return (
                  <article
                    key={item.id}
                    className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/20"
                  >
                    {item.coverImageUrl && (
                      <div className="aspect-[16/10] overflow-hidden bg-muted/20">
                        <img
                          src={item.coverImageUrl}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      {destination && (
                        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFB000]">
                          Now in {destination.destinationLabel}
                        </p>
                      )}
                      <h2 className="mb-3 text-2xl font-bold leading-tight">{item.title}</h2>
                      {item.excerpt && (
                        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                      )}
                      <div className="mt-auto space-y-4">
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {itemDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          {item.location && <span>{item.location}</span>}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {destination && (
                            <a
                              href={destination.displayPath}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFB000]"
                            >
                              Current home
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <a
                            href={`/news/${item.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/75"
                          >
                            Legacy entry
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
