import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";

export default function Studio() {
  // Main portrait cards - "Everything you need to design better"
  const mainCards = [
    {
      title: "Tutorials",
      description: "Video walkthroughs on Vectorworks, 3D modeling, and project breakdowns.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ajNdCYyYHHxMHYpa.webp",
      href: "/studio/tutorials",
      accentColor: "#2196F3",
      available: true,
    },
    {
      title: "App Studio",
      description: "Free web apps—scale calculators, dimension references, paint mixers.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/SincpZXApafHunxX.webp",
      href: "/studio/apps",
      accentColor: "#FF5722",
      available: true,
    },
    {
      title: "Vault",
      description: "Vectorworks library—venue files, furniture, props, hardware, architectural elements.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/aklRRdcLtUXFvueu.webp",
      href: "#",
      accentColor: "#9C27B0",
      available: false,
      comingSoon: true,
    },
    {
      title: "Scenic Directory",
      description: "Curated links to organizations, software, suppliers, and archives.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TcrVOnNvNKeMFytS.webp",
      href: "/studio/directory",
      accentColor: "#F44336",
      available: true,
    },
  ];

  // Tool cards - "Quick access to tools"
  const toolCards = [
    {
      title: "Scale Calculator",
      description: "Convert between architectural and model scales",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/pUUxwGnztzjjGFym.webp",
      href: "/studio/apps/scale-calculator",
      accentColor: "#00E5FF",
    },
    {
      title: "Dimension Reference",
      description: "Quick reference for standard dimensions",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/dUkThrifpMxEkplH.webp",
      href: "/studio/apps/dimension-reference",
      accentColor: "#FF1744",
    },
    {
      title: "Paint Calculator",
      description: "Calculate paint coverage and mixing ratios",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/MtnVhwckqruzlJNJ.webp",
      href: "/studio/apps/paint-calculator",
      accentColor: "#00E676",
    },
    {
      title: "Design History",
      description: "Timeline of theatrical design movements",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JWtmSLqTxNiBvvea.webp",
      href: "/studio/apps/design-history",
      accentColor: "#FFEA00",
    },
    {
      title: "Classical Orders",
      description: "Reference guide for classical architecture",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/XPuTTIxLVRHncWpw.webp",
      href: "/studio/apps/classical-orders",
      accentColor: "#D500F9",
    },
    {
      title: "Paint Finder",
      description: "Search and compare theatrical paint colors",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/abfCgRFgIIVNtmbG.webp",
      href: "/studio/apps/paint-finder",
      accentColor: "#FF6D00",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Studio | Brandon PT Davis"
        description="Design resources and tools for scenic designers. Video tutorials, interactive apps, Vectorworks vault, and curated directory."
        url="https://www.brandonptdavis.com/studio"
        type="website"
      />
      <Header />

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <AnimatedSection>
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-6 font-semibold">STUDIO</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              Everything you need<br />to design better
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              A comprehensive collection of tutorials, interactive tools, assets, and curated resources 
              to support your scenic design workflow.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Main Portrait Cards Grid */}
      <section className="container pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCards.map((card, index) => (
            <AnimatedSection key={card.title} delay={index * 100}>
              <Link
                href={card.available ? card.href : "#"}
                className={`block group ${!card.available ? "cursor-not-allowed" : ""}`}
              >
                <Card 
                  className={`h-full border-2 border-border ${card.available ? "hover:border-primary" : ""} transition-all duration-300 ${card.available ? "hover:shadow-2xl hover:-translate-y-1" : "opacity-70"} relative overflow-hidden rounded-2xl`}
                >
                  {card.comingSoon && (
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider z-10 border border-border">
                      Coming Soon
                    </div>
                  )}
                  
                  {/* Portrait Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img 
                      src={card.image} 
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
                    
                    {/* Color accent overlay */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: card.accentColor }}
                    />
                  </div>

                  {/* Card Content Overlay */}
                  <CardContent className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <h3 className="text-2xl font-black tracking-tight mb-2" style={{ color: card.accentColor }}>
                      {card.title}
                    </h3>
                    <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                      {card.description}
                    </p>
                    
                    {card.available ? (
                      <div className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all duration-300" style={{ color: card.accentColor }}>
                        Explore <ArrowRight className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="text-muted-foreground font-semibold text-sm">
                        Available Soon
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Quick Access Tools Section */}
      <section className="container pb-24">
        <AnimatedSection>
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Quick access to tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Essential calculators and references for your daily design work
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolCards.map((tool, index) => (
            <AnimatedSection key={tool.title} delay={index * 80}>
              <Link href={tool.href} className="block group">
                <Card className="h-full border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden rounded-2xl">
                  {/* Tool Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={tool.image} 
                      alt={tool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
                    
                    {/* Color accent */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ backgroundColor: tool.accentColor }}
                    />
                  </div>

                  {/* Tool Content */}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-black tracking-tight mb-2" style={{ color: tool.accentColor }}>
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all duration-300" style={{ color: tool.accentColor }}>
                      Launch <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container pb-24">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary/5 to-primary/0 border-2 border-border rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Built for Scenic Designers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Every tool, tutorial, and resource in the Studio is designed specifically for theatrical 
              and experiential design professionals.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-black mb-2" style={{ color: "#2196F3" }}>18</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Video Tutorials</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2" style={{ color: "#FF5722" }}>10+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Interactive Tools</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2" style={{ color: "#9C27B0" }}>Soon</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Vault Assets</div>
              </div>
              <div>
                <div className="text-5xl font-black mb-2" style={{ color: "#F44336" }}>50+</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Curated Resources</div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
