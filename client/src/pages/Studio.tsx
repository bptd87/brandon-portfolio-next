import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { PlayCircle, Grid3x3, Archive, Compass, ArrowRight } from "lucide-react";

// Custom theatrical icons for each section
const TutorialsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#2196F3]">
    <circle cx="12" cy="12" r="10" />
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" opacity="0.3" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeOpacity="0.5" />
  </svg>
);

const AppsIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#FF5722]">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="6.5" cy="17.5" r="1" fill="currentColor" />
    <circle cx="17.5" cy="17.5" r="1" fill="currentColor" />
  </svg>
);

const VaultIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#9C27B0]">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M7 4V2M17 4V2M3 8h18" strokeOpacity="0.5" />
  </svg>
);

const DirectoryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#F44336]">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" strokeOpacity="0.3" />
    <path d="M12 8l3 4-3 4-3-4 3-4z" fill="currentColor" opacity="0.2" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

export default function Studio() {
  const sections = [
    {
      title: "Tutorials",
      description: "Video walkthroughs on Vectorworks, 3D modeling, and project breakdowns.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/glkMbWtRSBKanCOl.jpg",
      href: "/studio/tutorials",
      textColor: "text-[#2196F3]",
      available: true,
    },
    {
      title: "App Studio",
      description: "Free web apps—scale calculators, dimension references, paint mixers.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/tSaXMqrtcUgnIQCF.jpg",
      href: "/studio/apps",
      textColor: "text-[#FF5722]",
      available: true,
    },
    {
      title: "Vault",
      description: "Vectorworks library—venue files, furniture, props, hardware, architectural elements...",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/RWSBCIIYxitqYRjK.jpg",
      href: "#",
      textColor: "text-[#9C27B0]",
      available: false,
      comingSoon: true,
    },
    {
      title: "Scenic Directory",
      description: "Curated links to organizations, software, suppliers, and archives.",
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/dPlaaiwbIXjywSPw.jpg",
      href: "/studio/directory",
      textColor: "text-[#F44336]",
      available: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container py-20 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-widest text-muted-foreground mb-4">STUDIO</p>
          <h1 className="mb-6">Design Resources & Tools</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive collection of tutorials, interactive tools, assets, and curated resources 
            to support your scenic design workflow.
          </p>
        </div>
      </section>

      {/* Studio Sections Grid */}
      <section className="container py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.available ? section.href : "#"}
              className={`block group ${!section.available ? "cursor-not-allowed" : ""}`}
            >
              <Card 
                className={`h-full border-2 border-border ${section.available ? "hover:border-primary" : ""} transition-all duration-300 ${section.available ? "hover:shadow-2xl" : "opacity-60"} relative overflow-hidden bg-black`}
              >
                {section.comingSoon && (
                  <div className="absolute top-4 right-4 bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">
                    Coming Soon
                  </div>
                )}
                
                {/* Card Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>

                <CardContent className="relative -mt-20 z-10 pb-6">
                  <h3 className="text-2xl font-bold mb-2 text-white">{section.title}</h3>
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    {section.description}
                  </p>
                  
                  {section.available ? (
                    <div className={`inline-flex items-center gap-2 ${section.textColor} font-semibold text-sm group-hover:gap-3 transition-all duration-300`}>
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
          ))}
        </div>
      </section>

      {/* Quick Stats or Info Section */}
      <section className="container pb-24">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-primary/5 to-primary/0 border border-border rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Built for Scenic Designers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Every tool, tutorial, and resource in the Studio is designed specifically for theatrical 
            and experiential design professionals. From beginner-friendly Vectorworks tutorials to 
            advanced production calculators, find everything you need in one place.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div>
              <div className="text-4xl font-black text-[#2196F3] mb-2">20+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Video Tutorials</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#FF5722] mb-2">10+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Interactive Tools</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#9C27B0] mb-2">Soon</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Vault Assets</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#F44336] mb-2">50+</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Curated Resources</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
