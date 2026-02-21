import { createElement } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageThemeWrapper from "@/components/PageThemeWrapper";
import ThemeToggle from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, ExternalLink, MapPin, Share2, ArrowLeft, Tag } from "lucide-react";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { Breadcrumb } from "@/components/Breadcrumb";
import { NewsDetailSkeleton } from "@/components/SkeletonLoaders";


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
  const { data: relatedNews } = trpc.news.list.useQuery({ status: "published" });
  const { data: category } = trpc.categories.getById.useQuery(
    { id: newsItem?.categoryId || 0 },
    { enabled: !!newsItem?.categoryId }
  );

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem?.title,
          text: newsItem?.excerpt || undefined,
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

  const getNewsDate = (item: any) => new Date(item?.date ?? item?.publishedAt ?? item?.createdAt ?? new Date());
  const normalizeUrl = (value?: string | null) => {
    if (!value) return "";
    try {
      const u = new URL(value);
      return `${u.origin}${u.pathname}`.replace(/\/+$/, "").toLowerCase();
    } catch {
      return String(value).trim().replace(/\/+$/, "").toLowerCase();
    }
  };
  const getLinkLabel = (block: any) => {
    const explicit = String(block?.label || "").trim();
    if (explicit) return explicit;
    const url = String(block?.url || "").trim();
    if (!url) return "Read Source";
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return `Read on ${host}`;
    } catch {
      return "Read Source";
    }
  };
  const parseBlocks = (raw: any) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [{ type: "text", content: raw }];
      } catch {
        return [{ type: "text", content: raw }];
      }
    }
    return [];
  };

  // Parse content blocks with migration fallback for legacy content payloads
  const contentBlocks = parseBlocks(newsItem.blocks).length > 0
    ? parseBlocks(newsItem.blocks)
    : parseBlocks(newsItem.content);
  const layoutVariant = newsItem.layoutVariant || "feature";

  // Get related news - chronologically nearby articles (within 6 months)
  const related = relatedNews
    ?.filter(n => n.id !== newsItem.id)
    .map(n => ({
      ...n,
      timeDiff: Math.abs(
        getNewsDate(n).getTime() -
        getNewsDate(newsItem).getTime()
      )
    }))
    .sort((a, b) => a.timeDiff - b.timeDiff)
    .slice(0, 3) || [];

  // Get prev/next articles chronologically
  const allNewsSorted = (relatedNews ? [...relatedNews] : [])
    .sort((a, b) =>
      getNewsDate(b).getTime() - getNewsDate(a).getTime()
    );
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
        publishedTime={getNewsDate(newsItem).toISOString()}
        modifiedTime={new Date(newsItem.updatedAt ?? newsItem.createdAt).toISOString()}
        url={`https://www.brandonptdavis.com/news/${newsItem.slug}`}
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
          datePublished: getNewsDate(newsItem).toISOString(),
          dateModified: newsItem.updatedAt ? new Date(newsItem.updatedAt).toISOString() : undefined,
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://www.brandonptdavis.com/android-chrome-512x512.png",
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
      {/* Event schema for production announcements with location/date */}
      {newsItem.location && newsItem.date && (
        <StructuredData
          type="Event"
          event={{
            name: newsItem.title,
            description: newsItem.excerpt || undefined,
            startDate: new Date(newsItem.date).toISOString(),
            location: {
              name: newsItem.location,
            },
            performer: {
              name: "Brandon PT Davis",
              jobTitle: "Scenic Designer",
              url: "https://www.brandonptdavis.com/about",
            },
            image: newsItem.coverImageUrl || undefined,
            url: `https://www.brandonptdavis.com/news/${newsItem.slug}`,
            eventStatus: "EventScheduled",
            eventAttendanceMode: "OfflineEventAttendanceMode",
          }}
        />
      )}
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

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link href="/news">
                <Button variant="ghost" className="px-0">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to News
                </Button>
              </Link>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-bold mb-5 leading-[1.02]">
              {newsItem.title}
            </h1>

            {newsItem.subtitle && (
              <p className="text-lg md:text-xl text-foreground/70 mb-4 leading-relaxed max-w-4xl">
                {newsItem.subtitle}
              </p>
            )}

            {newsItem.excerpt && (
              <p className="text-xl md:text-2xl text-foreground/85 mb-7 leading-relaxed max-w-3xl">
                {newsItem.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-foreground/70 rounded-2xl border border-border/50 bg-card/60 px-4 py-3 w-fit">
              {category && (
                <div className="flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary tracking-[0.08em] uppercase">{category.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {getNewsDate(newsItem).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {newsItem.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{newsItem.location}</span>
                </div>
              )}
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="ml-auto border-border/70"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {newsItem.coverImageUrl && (
            <div className="max-w-5xl mx-auto mt-10">
              <img
                src={newsItem.coverImageUrl}
                alt={newsItem.coverImageAltText || newsItem.title}
                className={`w-full object-cover border border-border/40 shadow-[0_24px_90px_-50px_rgba(0,0,0,0.8)] ${layoutVariant === "bulletin" ? "rounded-xl" : "rounded-3xl"}`}
                loading="eager"
                decoding="async"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto rounded-3xl border border-border/45 bg-card/50 backdrop-blur-sm p-6 md:p-10">
            {/* External Link Button */}
            {newsItem.externalLink && (
              <div className="mb-12">
                <a
                  href={newsItem.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl">
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
                  case 'paragraph':
                  case 'text':
                    return (
                      <div key={index} className="mb-7">
                        <p className="text-foreground/90 leading-[1.85] text-lg">{block.content || block.text || ""}</p>
                      </div>
                    );

                  case 'heading':
                  case 'header':
                    const headerLevel = block.level || 2;
                    const headerClasses = `font-['Playfair_Display'] italic font-bold text-foreground ${headerLevel === 3 ? 'text-2xl' : headerLevel === 4 ? 'text-xl' : 'text-3xl'
                      }`;
                    return (
                      <div key={index} className="mb-8 mt-10 first:mt-0">
                        {createElement(`h${headerLevel}`, { className: headerClasses }, block.content || block.text || "")}
                      </div>
                    );

                  case 'link':
                    if (normalizeUrl(block.url) && normalizeUrl(block.url) === normalizeUrl(newsItem.externalLink)) {
                      return null;
                    }
                    return (
                      <div key={index} className="mb-8">
                        <a
                          href={block.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block"
                        >
                          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                            <ExternalLink className="mr-2 h-5 w-5" />
                            {getLinkLabel(block)}
                          </Button>
                        </a>
                      </div>
                    );

                  case 'image':
                    return (
                      <div key={index} className="mb-12">
                        <img
                          src={block.url || block.imageUrl}
                          alt={block.alt || block.caption || block.content || newsItem.title}
                          className="w-full rounded-2xl border border-border/45 shadow-[0_20px_70px_-50px_rgba(0,0,0,0.8)]"
                          loading="lazy"
                          decoding="async"
                          sizes="(max-width: 1024px) 100vw, 1024px"
                        />
                        {(block.caption || block.description) && (
                          <p className="text-sm text-muted-foreground mt-3 text-center italic leading-relaxed">
                            {block.caption || block.description}
                          </p>
                        )}
                      </div>
                    );

                  case 'gallery':
                    const galleryImages = block.images || block.metadata?.images || [];
                    return (
                      <div key={index} className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {galleryImages?.map((img: any, imgIndex: number) => (
                            <img
                              key={imgIndex}
                              src={img.url}
                              alt={img.alt || img.caption || newsItem.title}
                              className="w-full aspect-square object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow"
                              loading="lazy"
                              decoding="async"
                              sizes="(max-width: 768px) 50vw, 33vw"
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
                        <blockquote className="rounded-2xl border border-primary/25 bg-primary/5 px-6 py-5">
                          <p className="text-2xl font-['Playfair_Display'] italic text-foreground mb-3 leading-relaxed">
                            {block.text || block.content}
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
                  case 'accordion':
                    return (
                      <div key={index} className="mb-12 rounded-2xl border border-border/45 bg-card/40 p-5 md:p-6">
                        <div className="space-y-4">
                          {block.items?.map((faqItem: any, faqIndex: number) => (
                            <div key={faqIndex} className="border-b border-border/45 pb-4 last:border-0">
                              <h4 className="text-lg font-bold text-foreground mb-2">{faqItem.question}</h4>
                              <p className="text-foreground/85 leading-relaxed">{faqItem.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'update_note':
                    return (
                      <div key={index} className="mb-8 rounded-2xl border border-primary/30 bg-primary/10 p-5">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-primary mb-2">Update</p>
                        <p className="text-foreground/90 leading-relaxed">
                          {block.text || block.content || block.note || ""}
                        </p>
                      </div>
                    );

                  case 'creative_team':
                  case 'team':
                    return (
                      <div key={index} className="mb-12 rounded-2xl border border-border/60 p-5">
                        {(block.title || 'Creative Team') && (
                          <h3 className="text-2xl font-bold mb-5 text-foreground">{block.title || 'Creative Team'}</h3>
                        )}
                        <div className="space-y-2">
                          {(block.members || []).map((member: any, memberIndex: number) => (
                            <div key={memberIndex} className="flex items-center justify-between gap-4 border-b border-border/40 pb-2 last:border-0 last:pb-0">
                              <span className="text-muted-foreground">{member.role}</span>
                              <span className="text-foreground font-medium text-right">{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );

                  case 'html':
                    return (
                      <div
                        key={index}
                        className="prose prose-lg max-w-none mb-8 dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: block.content || "" }}
                      />
                    );

                  default:
                    return null;
                }
              })
            ) : (
              <p className="text-muted-foreground py-12">No content available.</p>
            )}

            {/* Tags */}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border/60">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {newsItem.tags.map((tag: any) => (
                    <Link key={tag.id} href={`/tags/${tag.slug}`}>
                      <Badge className="text-sm font-normal px-4 py-2 rounded-full bg-muted text-foreground">
                        {tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {newsItem.relatedLinks && newsItem.relatedLinks.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border/60">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Related Links</h3>
                <div className="grid gap-3">
                  {newsItem.relatedLinks.map((link: any) => (
                    <a
                      key={link.id || `${link.url}-${link.label}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border/50 bg-card/55 px-4 py-3 hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <span className="text-foreground/90">{link.label}</span>
                        {link.linkType && (
                          <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/55 mt-1">
                            {link.linkType}
                          </p>
                        )}
                      </div>
                      <ExternalLink className="h-4 w-4 text-primary flex-shrink-0" />
                    </a>
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
                      <Card className="h-full transition-colors duration-300 group cursor-pointer p-6 border border-border/40 hover:border-primary/50">
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
                      <Card className="h-full transition-colors duration-300 group cursor-pointer p-6 text-right border border-border/40 hover:border-primary/50">
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
        <section className="py-24">
          <div className="container">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl font-['Playfair_Display'] italic font-bold mb-10">
              Related News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <Card className="h-full transition-colors duration-300 group cursor-pointer p-0 border border-border/40 hover:border-primary/50">
                      {item.coverImageUrl && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={item.coverImageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            sizes="(max-width: 768px) 100vw, 33vw"
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
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
