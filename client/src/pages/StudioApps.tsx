import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";

export default function StudioApps() {
  // Individual app cards
  const apps = [
    {
      title: "Scale Calculator",
      description: "Convert between architectural and model scales. Essential for drafting and model building.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/pUUxwGnztzjjGFym.webp",
      href: "/studio/apps/scale-calculator",
      accentColor: "#00E5FF",
      category: "Calculator",
    },
    {
      title: "Dimension Reference",
      description: "Quick reference for standard dimensions and unit conversions.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/dUkThrifpMxEkplH.webp",
      href: "/studio/apps/dimension-reference",
      accentColor: "#FF1744",
      category: "Reference",
    },
    {
      title: "Rosco Paint Calculator",
      description: "Professional scenic paint mixing calculator with advanced 5-step color matching engine for Rosco Off-Broadway paints.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/MtnVhwckqruzlJNJ.webp",
      href: "/studio/apps/rosco-paint-calculator",
      accentColor: "#00E676",
      category: "Calculator",
    },
    {
      title: "Design History Timeline",
      description: "Explore 30 major design periods from Ancient Egypt to Contemporary architecture with detailed information, color palettes, and key figures.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JWtmSLqTxNiBvvea.webp",
      href: "/studio/apps/design-history-timeline",
      accentColor: "#FFEA00",
      category: "Reference",
    },
    {
      title: "Classical Orders",
      description: "Reference guide for classical architecture and column orders.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/XPuTTIxLVRHncWpw.webp",
      href: "/studio/apps/classical-orders",
      accentColor: "#D500F9",
      category: "Reference",
    },
    {
      title: "Paint Finder",
      description: "Search and compare theatrical paint colors from major manufacturers.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/abfCgRFgIIVNtmbG.webp",
      href: "/studio/apps/paint-finder",
      accentColor: "#FF6D00",
      category: "Tool",
    },
    {
      title: "Model Scaler",
      description: "Calculate dimensions for scale models and physical mockups.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/yoZOkgjsdFdxjSBl.webp",
      href: "/studio/apps/model-scaler",
      accentColor: "#00BFA5",
      category: "Calculator",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="App Studio | Brandon PT Davis"
        description="Free web apps for scenic designers. Scale calculators, dimension references, paint mixers, and design tools."
        url="https://www.brandonptdavis.com/studio/apps"
        type="website"
      />
      <Header />

      {/* Hero Section */}
      <section className="container py-16 md:py-24">
        <AnimatedSection>
          <Link href="/studio">
            <Button variant="ghost" className="mb-8 -ml-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Studio
            </Button>
          </Link>
          
          <div className="max-w-4xl">
            <p className="text-xs tracking-[0.3em] text-muted-foreground mb-6 font-semibold">STUDIO / APP STUDIO</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
              Tools built for<br />scenic designers
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
              A collection of practical web apps for theatrical design professionals. Calculate scales, 
              convert dimensions, reference standards, and explore design history—all in your browser.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Apps Grid */}
      <section className="container pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app, index) => (
            <AnimatedSection key={app.title} delay={index * 80}>
              <Link href={app.href} className="block group">
                <Card className="h-full border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 overflow-hidden rounded-2xl">
                  {/* App Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
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
                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-border">
                      {app.category}
                    </div>
                  </div>

                  {/* App Content */}
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-black tracking-tight mb-3" style={{ color: app.accentColor }}>
                      {app.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {app.description}
                    </p>
                    
                    <div className="inline-flex items-center gap-2 font-bold text-sm group-hover:gap-3 transition-all duration-300" style={{ color: app.accentColor }}>
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
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-primary/0 border-2 border-border rounded-3xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">Mobile-First Design</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each app is designed to work seamlessly on your phone, tablet, or desktop. 
              Access these tools on-site during tech rehearsals, in the shop, or at your drafting table. 
              No installation required—just open and use.
            </p>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
