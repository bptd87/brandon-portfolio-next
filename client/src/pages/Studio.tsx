import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, BookOpen, Wrench, Archive, Compass, Play, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { ProgressiveImage } from "@/components/ProgressiveImage";

export default function Studio() {
  // Fetch latest articles
  const { data: articles } = trpc.articles.list.useQuery({
    status: 'published'
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Scenic Design Education Studio | Free Tools & Tutorials"
        description="Scenic design education hub: Vectorworks tutorials, interactive tools, calculators, and industry resources. Complete learning portal for theatrical designers."
        keywords="scenic design education, Vectorworks tutorials, theatrical design learning, scenic design tools, theatre design resources, stage design education, professional design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio"
      />
      <Header />

      {/* Hero Section - Narrative Introduction */}
      <section className="container py-16 md:py-24">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-6 font-semibold">STUDIO</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              Learn. Create.<br />Design Better.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Your complete learning hub for scenic design—from foundational articles and video tutorials
              to interactive tools and curated resources. Everything you need to grow as a designer.
            </p>

            {/* Learning Path Visual */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Read Articles
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 text-primary" />
                Watch Tutorials
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" />
                Use Tools
              </span>
              <ArrowRight className="w-4 h-4" />
              <span className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-primary" />
                Access Resources
              </span>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Articles Section - Top Priority */}
      <section className="container pb-16 md:pb-24">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Latest Articles
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                In-depth guides, technical breakdowns, and design philosophy to deepen your understanding
              </p>
            </div>
            <Link href="/articles">
              <div className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300">
                View All <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </AnimatedSection>

        {articles && articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article, index) => {
              // Category color mapping
              const categoryColors: Record<string, string> = {
                'Tutorials': '#2196F3',
                'Technical': '#FF5722',
                'Design Theory': '#9C27B0',
                'Industry': '#F44336',
                'default': '#FF6B35'
              };
              const categoryColor = article.category?.name
                ? categoryColors[article.category.name] || categoryColors.default
                : categoryColors.default;

              return (
                <AnimatedSection key={article.id} delay={index * 100}>
                  <Link href={`/articles/${article.slug}`}>
                    <Card className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:scale-[1.02] transition-all duration-500">
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                        {article.coverImageUrl ? (
                          <ProgressiveImage
                            src={article.coverImageUrl}
                            alt={article.title}
                            className="group-hover:scale-110 transition-transform duration-700"
                            aspectRatio="16/9"
                            smartPosition={true}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      <CardContent className="p-0">
                        {article.category && (
                          <Badge
                            variant="secondary"
                            className="mb-3 text-xs font-bold"
                            style={{
                              backgroundColor: `${categoryColor}20`,
                              color: categoryColor,
                              borderColor: `${categoryColor}40`
                            }}
                          >
                            {article.category.name}
                          </Badge>
                        )}

                        <h3 className="text-xl font-bold mb-2 transition-colors line-clamp-2"
                          style={{ color: 'inherit' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = categoryColor}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>
                          {article.title}
                        </h3>

                        {article.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                        )}

                        {article.publishedAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </AnimatedSection>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Articles coming soon</p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/articles">
            <div className="inline-flex items-center gap-2 text-primary font-bold">
              View All Articles <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Video Tutorials Section */}
      <section className="container pb-16 md:pb-24">
        <AnimatedSection>
          <Link href="/studio/tutorials" className="block group">
            <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl overflow-hidden rounded-2xl">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative aspect-[16/9] md:aspect-auto overflow-hidden">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ajNdCYyYHHxMHYpa.webp"
                    alt="Video Tutorials"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 md:to-background"></div>
                  <div className="absolute inset-0 bg-[#2196F3]/20 mix-blend-multiply"></div>
                </div>

                {/* Content Side */}
                <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Play className="w-8 h-8 text-[#2196F3]" />
                    <Badge variant="secondary" className="text-xs">VIDEO LEARNING</Badge>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4 text-[#2196F3]">
                    Video Tutorials
                  </h3>

                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Step-by-step video walkthroughs covering Vectorworks techniques, 3D modeling workflows,
                    rendering strategies, and complete project breakdowns from concept to execution.
                  </p>

                  <div className="inline-flex items-center gap-2 font-bold text-[#2196F3] group-hover:gap-3 transition-all duration-300">
                    Watch Tutorials <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </AnimatedSection>
      </section>

      {/* Interactive Tools Section */}
      <section className="container pb-16 md:pb-24">
        <AnimatedSection>
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Interactive Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Web-based tools to solve everyday design challenges—scale calculations, dimension references,
              paint mixing, and historical research tools
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Dimension Reference",
              description: "Quick reference for standard dimensions",
              icon: <Wrench className="w-6 h-6" />,
              href: "/studio/apps/dimension-reference",
              accentColor: "#FF1744",
              available: true,
            },
            {
              title: "Rosco Paint Calculator",
              description: "Mix Rosco Off-Broadway paints to match any color",
              icon: <Wrench className="w-6 h-6" />,
              href: "/studio/apps/rosco-paint-calculator",
              accentColor: "#00E676",
              available: true,
            },
            {
              title: "Design History Timeline",
              description: "Interactive timeline of theatrical design movements",
              icon: <Compass className="w-6 h-6" />,
              href: "/studio/apps/design-history-timeline",
              accentColor: "#FFEA00",
              available: true,
            },
            {
              title: "Model Scaler",
              description: "Convert between architectural and model scales",
              icon: <Wrench className="w-6 h-6" />,
              href: "/studio/apps/model-scaler",
              accentColor: "#00E5FF",
              available: false,
            },
            {
              title: "Classical Orders",
              description: "Reference guide for classical architecture",
              icon: <Compass className="w-6 h-6" />,
              href: "/studio/apps/classical-orders",
              accentColor: "#D500F9",
              available: false,
            },
            {
              title: "Paint Finder",
              description: "Search and compare theatrical paint colors",
              icon: <Wrench className="w-6 h-6" />,
              href: "/studio/apps/paint-finder",
              accentColor: "#FF6D00",
              available: false,
            },
          ].map((tool, index) => (
            <AnimatedSection key={tool.title} delay={index * 100}>
              <Link
                href={tool.available ? tool.href : "#"}
                className={`block group ${!tool.available ? "cursor-not-allowed" : ""}`}
              >
                <Card className={`border-2 border-border transition-all duration-300 overflow-hidden rounded-2xl ${tool.available ? 'hover:border-primary hover:shadow-xl hover:-translate-y-1' : 'opacity-60'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${tool.accentColor}20` }}
                      >
                        <div style={{ color: tool.accentColor }}>
                          {tool.icon}
                        </div>
                      </div>

                      {!tool.available && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          Coming Soon
                        </Badge>
                      )}
                    </div>

                    <h3 className="text-xl font-black tracking-tight mb-2" style={{ color: tool.accentColor }}>
                      {tool.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={300}>
          <div className="mt-8 text-center">
            <Link href="/studio/apps">
              <div className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300">
                View All Tools <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Resources */}
      <section className="container pb-24">
        <AnimatedSection>
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Design Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Curated links to support your entire design process
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-3xl">
          <AnimatedSection delay={100}>
            <Link href="/studio/directory" className="block group">
              <Card className="border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TcrVOnNvNKeMFytS.webp"
                    alt="Scenic Directory"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                  <div className="absolute inset-0 bg-[#F44336]/20 mix-blend-multiply"></div>
                </div>

                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Compass className="w-6 h-6 text-[#F44336]" />
                    <h3 className="text-2xl font-black tracking-tight text-[#F44336]">
                      Scenic Directory
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    Curated collection of links to professional organizations, software resources,
                    supplier catalogs, historical archives, and industry publications.
                  </p>

                  <div className="inline-flex items-center gap-2 font-bold text-[#F44336] group-hover:gap-3 transition-all duration-300">
                    Browse Directory <ArrowRight className="w-5 h-5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
