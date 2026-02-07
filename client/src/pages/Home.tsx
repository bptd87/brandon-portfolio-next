import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({ featured: true, status: 'published' });
  const { data: newsItems } = trpc.news.list.useQuery({});
  const { data: articles } = trpc.articles.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  // Get the most recent featured project for the hero
  const featuredHeroProject = projects && projects.length > 0 ? projects[0] : null;

  return (
    <>
      <Header />
      
      {/* Hero Section - Theatrical Stage Framing */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Starfield background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000_100%)]">
          {/* Animated stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Stage lighting beams */}
        <div className="absolute top-0 left-1/4 w-96 h-full bg-gradient-to-b from-[#FF5722]/20 via-[#FF5722]/5 to-transparent blur-3xl" 
             style={{ clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)' }} />
        <div className="absolute top-0 right-1/4 w-96 h-full bg-gradient-to-b from-[#00E5FF]/20 via-[#00E5FF]/5 to-transparent blur-3xl" 
             style={{ clipPath: 'polygon(40% 0%, 60% 0%, 70% 100%, 30% 100%)' }} />
        
        {/* Wireframe proscenium arch */}
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
          {/* Left column */}
          <g stroke="#00E5FF" strokeWidth="1" fill="none">
            <rect x="200" y="150" width="120" height="800" />
            <rect x="210" y="160" width="100" height="20" />
            <rect x="210" y="190" width="100" height="740" />
            {/* Column details */}
            <circle cx="260" cy="170" r="8" />
            <circle cx="260" cy="930" r="8" />
          </g>
          
          {/* Right column */}
          <g stroke="#FF5722" strokeWidth="1" fill="none">
            <rect x="1600" y="150" width="120" height="800" />
            <rect x="1610" y="160" width="100" height="20" />
            <rect x="1610" y="190" width="100" height="740" />
            {/* Column details */}
            <circle cx="1660" cy="170" r="8" />
            <circle cx="1660" cy="930" r="8" />
          </g>
          
          {/* Arch */}
          <path d="M 320 200 Q 960 100 1600 200" stroke="#00E5FF" strokeWidth="2" fill="none" />
          <path d="M 340 220 Q 960 130 1580 220" stroke="#FF5722" strokeWidth="1" fill="none" />
          
          {/* Frame */}
          <rect x="350" y="230" width="1220" height="650" stroke="url(#frameGradient)" strokeWidth="2" fill="none" rx="20" />
          
          {/* Grid floor */}
          <g stroke="#00E5FF" strokeWidth="0.5" opacity="0.3">
            {[...Array(20)].map((_, i) => (
              <line key={`h${i}`} x1="350" y1={880 + i * 30} x2="1570" y2={880 + i * 30} />
            ))}
            {[...Array(30)].map((_, i) => (
              <line key={`v${i}`} x1={350 + i * 40} y1="880" x2={350 + i * 40} y2="1080" />
            ))}
          </g>
          
          <defs>
            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00E5FF" />
              <stop offset="50%" stopColor="#FF1744" />
              <stop offset="100%" stopColor="#FF5722" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Content */}
        <div className="relative z-10 container text-center px-4">
          {/* Featured Project Image/Centerpiece */}
          {featuredHeroProject?.coverImageUrl && (
            <div className="mb-12 relative">
              <div className="relative w-full max-w-4xl mx-auto aspect-[16/10] rounded-2xl overflow-hidden">
                <img 
                  src={featuredHeroProject.coverImageUrl} 
                  alt={featuredHeroProject.title}
                  className="w-full h-full object-cover"
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/30 via-transparent to-transparent" />
                {/* Particle sparkles */}
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                        opacity: 0.6,
                        animation: `float ${3 + Math.random() * 4}s infinite ${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Outline Typography */}
          <h1 className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black leading-[0.9] tracking-wider mb-8"
              style={{
                WebkitTextStroke: '2px currentColor',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255, 87, 34, 0.3)'
              }}>
            <span className="block">ART × TECHNOLOGY</span>
            <span className="block">DESIGN</span>
          </h1>

          {/* Currently Designing Status */}
          {featuredHeroProject && (
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="w-3 h-3 bg-[#00FF00] rounded-full animate-pulse" />
              <span className="text-lg md:text-xl text-foreground/80">
                Currently Designing: <span className="text-[#00E5FF] font-semibold">{featuredHeroProject.title}</span> {featuredHeroProject.year}
              </span>
            </div>
          )}

          {/* CTA */}
          <div className="flex items-center justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" className="text-base font-semibold px-8 py-6 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white">
                VIEW WORK
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6 border-2">
                GET IN TOUCH
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground/40 hover:text-foreground transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </button>

        {/* CSS Animations */}
        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          @keyframes float {
            0%, 100% { 
              transform: translateY(0) translateX(0); 
              opacity: 0;
            }
            10% { opacity: 0.6; }
            50% { 
              transform: translateY(-30px) translateX(10px); 
              opacity: 1;
            }
            90% { opacity: 0.6; }
          }
        `}</style>
      </section>

      {/* Featured Projects - Bold Grid */}
      <section className="py-32 bg-background">
        <div className="container">
          {/* Section Header */}
          <div className="mb-20">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">SELECTED WORK</p>
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
              Featured<br />Projects
            </h2>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <Link key={project.id} href={`/projects/${project.slug}`}>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-muted">
                      {project.coverImageUrl ? (
                        <img 
                          src={project.coverImageUrl} 
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <p className="text-muted-foreground">No image</p>
                        </div>
                      )}
                      {/* Color overlay on hover */}
                      <div 
                        className="absolute inset-0 mix-blend-multiply opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                        style={{
                          backgroundColor: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-8">
                        <Button variant="secondary" className="gap-2 font-semibold">
                          VIEW PROJECT <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        variant="outline" 
                        className="text-xs tracking-wider font-semibold"
                        style={{
                          borderColor: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744',
                          color: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744'
                        }}
                      >
                        SCENIC DESIGN
                      </Badge>
                      <span className="text-xs text-muted-foreground font-pixel">{project.year}</span>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold group-hover:text-[#FF5722] transition-colors leading-tight">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xl">No featured projects yet.</p>
          )}
          
          <div className="mt-20 text-center">
            <Link href="/projects">
              <Button variant="outline" size="lg" className="gap-2 text-base font-semibold px-8 py-6 border-2">
                VIEW ALL PROJECTS <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Carousel */}
      {newsItems && newsItems.length > 0 && (
        <section className="py-32 border-t border-border">
          <div className="container">
            <div className="mb-20">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">LATEST UPDATES</p>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
                News
              </h2>
            </div>
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-6" style={{ width: 'max-content' }}>
                {newsItems.map((item) => (
                  <Link key={item.id} href={`/news/${item.slug}`}>
                    <Card className="w-[400px] hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-2">
                      <CardContent className="p-8">
                        <Badge variant="outline" className="mb-4 text-xs tracking-wider font-semibold border-[#FF5722] text-[#FF5722]">
                          {item.categoryId && categories ? 
                            categories.find(c => c.id === item.categoryId)?.name || 'NEWS' 
                            : 'NEWS'
                          }
                        </Badge>
                        <h3 className="text-xl font-bold mb-3 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.excerpt}</p>
                        <div className="mt-6 text-xs text-muted-foreground font-pixel">
                          {new Date(item.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
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

      {/* Articles Section */}
      {articles && articles.length > 0 && (
        <section className="py-32 bg-secondary/20">
          <div className="container">
            <div className="mb-20">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">INSIGHTS & PROCESS</p>
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
                Articles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(0, 6).map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-2">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
