import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import StructuredData from "@/components/StructuredData";

export default function StudioApps() {
  // Individual app cards
  const apps = [
    {
      title: "Scale Calculator",
      description: "Convert between architectural and model scales. Essential for drafting and model building.",
      image: "/assets/studio/scale-calculator.webp",
      href: "/studio/apps/scale-calculator",
      accentColor: "#00E5FF",
      category: "Calculator",
    },
    {
      title: "Dimension Reference",
      description: "Quick reference for standard dimensions and unit conversions.",
      image: "/assets/studio/dimension-ref.webp",
      href: "/studio/apps/dimension-reference",
      accentColor: "#FF1744",
      category: "Reference",
    },
    {
      title: "Rosco Paint Calculator",
      description: "Professional scenic paint mixing calculator with advanced 5-step color matching engine for Rosco Off-Broadway paints.",
      image: "/assets/studio/rosco-paint.webp",
      href: "/studio/apps/rosco-paint-calculator",
      accentColor: "#00E676",
      category: "Calculator",
    },
    {
      title: "Design History Timeline",
      description: "Explore 30 major design periods from Ancient Egypt to Contemporary architecture with detailed information, color palettes, and key figures.",
      image: "/assets/studio/design-history.webp",
      href: "/studio/apps/design-history-timeline",
      accentColor: "#FFEA00",
      category: "Reference",
    },
    {
      title: "Classical Orders",
      description: "Reference guide for classical architecture and column orders.",
      image: "/assets/studio/classical-orders.webp",
      href: "/studio/apps/classical-orders",
      accentColor: "#D500F9",
      category: "Reference",
      needsRebuild: true,
    },
    {
      title: "Paint Finder",
      description: "Search and compare theatrical paint colors from major manufacturers.",
      image: "/assets/studio/paint-finder.webp",
      href: "/studio/apps/paint-finder",
      accentColor: "#FF6D00",
      category: "Tool",
      needsRebuild: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_9%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_85%_16%,rgba(33,150,243,0.08),transparent_34%)]">
      <SEO
        title="Scenic Design Tools | Professional Calculators & Resources"
        description="Web-based tools for scenic designers: scale calculators, dimension references, paint mixers, and design resources. Professional apps for theatrical designers."
        keywords="scenic design calculator, architecture scale converter, paint mixing calculator, Rosco paint, design history timeline, theatrical design tools, scenic design apps, web-based design tools"
        type="website"
        url="https://www.brandonptdavis.com/studio/apps"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Studio", url: "https://www.brandonptdavis.com/studio" },
          { name: "Apps", url: "https://www.brandonptdavis.com/studio/apps" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Scenic Design Tools",
          url: "https://www.brandonptdavis.com/studio/apps",
          description: "Browser-based scenic design calculators, references, and utility apps.",
          about: "Studio applications for scenic design workflow.",
          primaryImageOfPage: "https://www.brandonptdavis.com/assets/studio/scale-calculator.webp",
          mainEntity: {
            name: "Studio Apps",
            itemListElement: apps.map((app, index) => ({
              position: index + 1,
              name: app.title,
              url: `https://www.brandonptdavis.com${app.href}`,
              image: `https://www.brandonptdavis.com${app.image}`,
            })),
          },
        }}
      />
      {/* SoftwareApplication schemas for key apps */}
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Scale Calculator - Scenic Design Tool",
          description: "Convert between architectural and model scales. Essential for drafting and model building in theatrical design.",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/scale-calculator",
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Rosco Paint Calculator - Scenic Paint Mixing",
          description: "Professional scenic paint mixing calculator with advanced 5-step color matching engine for Rosco Off-Broadway paints. Web-based tool for theatrical designers.",
          applicationCategory: "DesignApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/rosco-paint-calculator",
        }}
      />
      <StructuredData
        type="SoftwareApplication"
        softwareApplication={{
          name: "Design History Timeline - Architecture Reference",
          description: "Explore 30 major design periods from Ancient Egypt to Contemporary architecture with detailed information, color palettes, and key figures. Interactive educational resource for designers.",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          offers: {
            price: "0",
            priceCurrency: "USD",
          },
          url: "https://www.brandonptdavis.com/studio/apps/design-history-timeline",
        }}
      />
      <Header />

      {/* Hero Section */}
      <section className="container pt-16 md:pt-24 pb-12">
        <AnimatedSection>
          <Link href="/studio">
            <Button variant="ghost" className="mb-8 -ml-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Studio
            </Button>
          </Link>

          <div className="max-w-5xl">
            <p className="text-xs tracking-[0.24em] text-muted-foreground mb-4 font-semibold uppercase">Studio / Apps</p>
            <h1 className="text-5xl md:text-7xl font-serif tracking-tight mb-5 leading-[0.92]">
              Scenic Design Tools
            </h1>
            <p className="text-lg md:text-xl text-foreground/75 max-w-3xl leading-relaxed">
              Practical tools for day-to-day production workflow: scale conversion, dimension references, paint math, and design research.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Apps Grid */}
      <section className="container pb-16 md:pb-20">
        <AnimatedSection>
          <div className="mb-7">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-2">All Studio Apps</h2>
            <p className="text-foreground/70">Browser-based utilities built for scenic and production design workflows.</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <AnimatedSection key={app.title} delay={index * 80}>
              <Link href={app.href} className="block group">
                <Card className="h-[29rem] border border-border/60 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden rounded-2xl bg-card/20 py-0 gap-0">
                  {/* App Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={app.image}
                      alt={app.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

                    {/* Color accent */}
                    <div
                      className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: app.accentColor }}
                    />

                    {/* Category badge */}
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider border border-border">
                      {app.category}
                    </div>
                    {app.needsRebuild && (
                      <div className="absolute top-4 left-4 bg-amber-500/90 backdrop-blur-sm text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.1em]">
                        Back Soon 😜
                      </div>
                    )}
                  </div>

                  {/* App Content */}
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold tracking-tight mb-3 line-clamp-2 min-h-[3.6rem]" style={{ color: app.accentColor }}>
                      {app.title}
                    </h3>
                    <p className="text-sm text-foreground/70 mb-4 leading-relaxed line-clamp-3 min-h-[4.5rem]">
                      {app.description}
                    </p>

                    <div className="mt-auto inline-flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all duration-300" style={{ color: app.accentColor }}>
                      Launch App <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="container pb-24">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/8 to-primary/0 border border-border/60 rounded-3xl p-10 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4 text-center">Use On Phone or Tablet</h2>
            <p className="text-lg text-foreground/75 max-w-2xl mx-auto leading-relaxed text-center mb-6">
              These tools are built for on-site use during build, paint, and tech.
            </p>
            <ol className="max-w-2xl mx-auto space-y-2 text-sm md:text-base text-foreground/80 leading-relaxed list-decimal pl-5">
              <li>Open the tool from this page and save it to your home screen/bookmarks.</li>
              <li>Use portrait for quick checks and landscape for detailed tables or references.</li>
              <li>Keep one tool per tab during tech so values are easy to revisit fast.</li>
              <li>For low signal spaces, open tools before call so assets are cached locally.</li>
            </ol>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
