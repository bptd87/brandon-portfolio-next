import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Wrench, Compass, Play, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import StructuredData from "@/components/StructuredData";

const featuredTools = [
  {
    title: "Dimension Reference",
    description: "Quick reference for standard dimensions used in scenic and experiential planning.",
    href: "/studio/apps/dimension-reference",
    accentColor: "#FF1744",
  },
  {
    title: "Rosco Paint Calculator",
    description: "Mix Rosco Off-Broadway paints to match target color values.",
    href: "/studio/apps/rosco-paint-calculator",
    accentColor: "#00E676",
  },
  {
    title: "Design History Timeline",
    description: "Interactive timeline for major movements in theatrical design history.",
    href: "/studio/apps/design-history-timeline",
    accentColor: "#FFEA00",
  },
];

const comingSoonTools = ["Classical Orders", "Paint Finder"];

export default function Studio() {
  const { data: articles } = trpc.articles.list.useQuery({
    status: "published",
  });

  return (
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_9%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(33,150,243,0.08),transparent_34%)]">
      <SEO
        title="Scenic Design Education Studio | Free Tools & Tutorials"
        description="Scenic design education hub with articles, Vectorworks tutorials, interactive tools, and curated references for theatre designers."
        keywords="scenic design education, Vectorworks tutorials, scenic design tools, theatre design resources, stage design learning"
        type="website"
        url="https://www.brandonptdavis.com/studio"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Studio",
          url: "https://www.brandonptdavis.com/studio",
          description: "Studio hub for scenic design tools, tutorials, and articles.",
          about: "Scenic design education and workflow resources by Brandon PT Davis.",
          primaryImageOfPage: articles?.[0]?.coverImageUrl || undefined,
          mainEntity: {
            name: "Studio Articles",
            itemListElement: (articles || []).slice(0, 12).map((article, index) => ({
              position: index + 1,
              name: article.title,
              url: `https://www.brandonptdavis.com/articles/${article.slug}`,
              datePublished: article.publishedAt || article.createdAt || undefined,
              image: article.coverImageUrl || undefined,
            })),
          },
        }}
      />
      <Header />

      <section className="container pt-16 md:pt-24 pb-12">
        <AnimatedSection>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-[0.92] mb-5">
              Scenic Design Studio Resources
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 max-w-3xl mx-auto leading-relaxed">
              A focused hub for scenic designers: practical articles, video tutorials, and production-ready tools.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <section className="container pb-16">
        <AnimatedSection>
          <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto items-stretch">
            <Link href="/articles">
              <Card className="h-full border border-border/60 bg-card/30 hover:border-[#FF5722]/60 transition-colors flex">
                <CardContent className="p-5 flex flex-col w-full">
                  <BookOpen className="w-5 h-5 text-[#FF5722] mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Articles</h2>
                  <p className="text-sm text-foreground/70">Process, workflow, and scenic design practice.</p>
                  <div className="mt-auto pt-4 text-xs uppercase tracking-[0.12em] text-[#FF5722]">Explore</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/studio/tutorials">
              <Card className="h-full border border-border/60 bg-card/30 hover:border-[#2196F3]/60 transition-colors flex">
                <CardContent className="p-5 flex flex-col w-full">
                  <Play className="w-5 h-5 text-[#2196F3] mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Tutorials</h2>
                  <p className="text-sm text-foreground/70">Video walkthroughs for Vectorworks and rendering pipelines.</p>
                  <div className="mt-auto pt-4 text-xs uppercase tracking-[0.12em] text-[#2196F3]">Watch</div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/studio/apps">
              <Card className="h-full border border-border/60 bg-card/30 hover:border-[#4CAF50]/60 transition-colors flex">
                <CardContent className="p-5 flex flex-col w-full">
                  <Wrench className="w-5 h-5 text-[#4CAF50] mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Tools</h2>
                  <p className="text-sm text-foreground/70">Calculators and references for fast production decisions.</p>
                  <div className="mt-auto pt-4 text-xs uppercase tracking-[0.12em] text-[#4CAF50]">Open</div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="container pb-16 md:pb-20">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-2">Latest Articles</h2>
              <p className="text-foreground/70">Recent writing on scenic storytelling, process, and production craft.</p>
            </div>
            <Link href="/articles">
              <div className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </AnimatedSection>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {articles.slice(0, 3).map((article, index) => (
              <AnimatedSection key={article.id} delay={index * 80}>
                <Link href={`/articles/${article.slug}`}>
                  <Card className="group h-full border border-border/50 bg-card/20 hover:border-primary/50 transition-colors overflow-hidden flex flex-col py-0 gap-0">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {article.coverImageUrl ? (
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover block group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      {article.category && (
                        <Badge variant="secondary" className="mb-3 text-[10px] uppercase tracking-[0.12em]">
                          {article.category.name}
                        </Badge>
                      )}
                      <h3 className="text-lg font-semibold leading-snug mb-2 line-clamp-2 min-h-[3.4rem]">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2 min-h-[2.75rem]">{article.excerpt}</p>
                      )}
                      {article.publishedAt && (
                        <div className="mt-auto pt-4 flex items-center gap-1.5 text-xs text-foreground/60">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-60" />
            <p>Articles coming soon.</p>
          </div>
        )}
      </section>

      <section className="container pb-16 md:pb-20">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-2">Studio Tools</h2>
              <p className="text-foreground/70">Fast references and calculators built for design workflow.</p>
            </div>
            <Link href="/studio/apps">
              <div className="hidden md:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                View All Tools <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {featuredTools.map((tool, index) => (
            <AnimatedSection key={tool.title} delay={index * 80}>
              <Link href={tool.href}>
                <Card className="h-full border border-border/60 bg-card/20 hover:border-primary/50 transition-colors flex">
                  <CardContent className="p-5 flex flex-col w-full">
                    <Wrench className="w-5 h-5 mb-3" style={{ color: tool.accentColor }} />
                    <h3 className="text-xl font-semibold mb-2" style={{ color: tool.accentColor }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-foreground/70">{tool.description}</p>
                    <div className="mt-auto pt-4 text-xs uppercase tracking-[0.12em]" style={{ color: tool.accentColor }}>
                      Open Tool
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={220}>
          <div className="mt-6 flex flex-wrap gap-2">
            {comingSoonTools.map((tool) => (
              <Badge key={tool} variant="outline" className="text-[10px] uppercase tracking-[0.12em]">
                {tool} / Coming Soon
              </Badge>
            ))}
          </div>
        </AnimatedSection>
      </section>

      <section className="container pb-24">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <Link href="/studio/tutorials" className="block group">
              <Card className="h-full border border-border/60 bg-card/25 hover:border-[#2196F3]/55 transition-colors overflow-hidden py-0 gap-0">
                <div className="grid md:grid-cols-[1.15fr_1fr] gap-0 h-full">
                  <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ajNdCYyYHHxMHYpa.webp"
                      alt="Studio Tutorials"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-[#2196F3] mb-3">
                      <Play className="w-5 h-5" />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">Tutorials</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-3">Vectorworks Video Tutorials</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                      Step-by-step lessons covering drafting, modeling, and rendering workflows for scenic designers.
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#2196F3] font-semibold group-hover:gap-3 transition-all">
                      Watch Tutorials <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>

            <Link href="/studio/directory" className="block group">
              <Card className="h-full border border-border/60 bg-card/25 hover:border-[#F44336]/55 transition-colors overflow-hidden py-0 gap-0">
                <div className="grid md:grid-cols-[1.15fr_1fr] gap-0 h-full">
                  <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TcrVOnNvNKeMFytS.webp"
                      alt="Scenic Directory"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 text-[#F44336] mb-3">
                      <Compass className="w-5 h-5" />
                      <span className="text-xs font-semibold uppercase tracking-[0.14em]">Directory</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif mb-3">Scenic Resource Directory</h3>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-4">
                      Curated links to organizations, references, vendors, and archives used by working scenic designers.
                    </p>
                    <div className="inline-flex items-center gap-2 text-[#F44336] font-semibold group-hover:gap-3 transition-all">
                      Browse Directory <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
