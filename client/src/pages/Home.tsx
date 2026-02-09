import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { AnimatedSection } from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";
import { useState, useEffect } from "react";

export default function Home() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.brandonptdavis.com';
  const { user } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({ featured: true, status: 'published', discipline: 'scenic_design' });
  const { data: newsItems } = trpc.news.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero images from top featured scenic design projects
  const heroImages = projects?.slice(0, 5).filter(p => p.coverImageUrl).map(p => ({
    url: p.coverImageUrl!,
    title: p.title,
    slug: p.slug
  })) || [];

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || heroImages.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    setIsAutoPlaying(false);
  };

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <>
      <StructuredData
        type="Both"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic and Experiential Designer",
          url: baseUrl,
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YiqCsZPgtoSSsQyE.png",
          description: "Scenic and experiential designer based in Southern California with over 120 design credits across regional theatre, summer stock, academic theatre, immersive experiences, and live entertainment. Member of USA 829.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US",
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavis",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
            "https://www.usa829.org/Member-Profile/MemberID/15357",
          ],
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu",
            },
            {
              name: "Stephens College",
              url: "https://www.stephens.edu",
            },
          ],
          knowsAbout: [
            "Scenic Design",
            "Experiential Design",
            "Theatrical Design",
            "Regional Theatre",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Event Design",
            "Concept Rendering",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Immersive Design",
            "Themed Entertainment",
          ],
        }}
        organization={{
          name: "Brandon PT Davis Design",
          url: baseUrl,
          logo: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YiqCsZPgtoSSsQyE.png",
          description: "Professional scenic and experiential design studio specializing in regional theatre, summer stock, academic theatre, immersive experiences, event design, and themed entertainment.",
          founder: {
            name: "Brandon PT Davis",
            url: `${baseUrl}/about`,
          },
          foundingDate: "2015",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US",
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavis",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
          ],
        }}
      />
      <Header />

      {/* Hero Section - Full-Screen Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Images */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={`${image.title} - Scenic design by Brandon PT Davis`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        {heroImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all text-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content Overlay */}
        <div className="relative z-10 container text-center px-4">
          <h1 className="text-[8vw] md:text-[6vw] lg:text-[5vw] font-black leading-[0.9] tracking-tighter mb-6 text-white drop-shadow-2xl">
            <span className="block">BRANDON</span>
            <span className="block">PT DAVIS</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 text-base md:text-lg lg:text-xl font-bold tracking-wider mb-8">
            <span className="text-[#FF5722] drop-shadow-lg">ART</span>
            <span className="text-white/60">×</span>
            <span className="text-[#00E5FF] drop-shadow-lg">TECHNOLOGY</span>
            <span className="text-white/60">×</span>
            <span className="text-[#FF1744] drop-shadow-lg">DESIGN</span>
          </div>

          <p className="text-sm md:text-base text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed drop-shadow-lg">
            Scenic & Experiential Designer transforming theatrical spaces into immersive visual landscapes
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/projects">
              <Button size="default" className="text-sm font-semibold px-6 py-5 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white shadow-2xl">
                VIEW WORK
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="default" variant="outline" className="text-sm font-semibold px-6 py-5 border-2 border-white text-white hover:bg-white hover:text-black shadow-2xl">
                GET IN TOUCH
              </Button>
            </Link>
          </div>
        </div>

        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 hover:text-white transition-colors"
          aria-label="Scroll to content"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </button>
      </section>

      {/* Featured Scenic Design Projects - 2-Column Grid */}
      {projects && projects.length > 0 && (
        <AnimatedSection>
          <section className="py-24 md:py-32 bg-background">
            <div className="container">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">PORTFOLIO</p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
                    Featured Scenic Design
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Selected works from regional theatre, summer stock, and academic productions
                  </p>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {projects.slice(0, 8).map((project, index) => {
                    // Cycle through brand colors for variety
                    const brandColors = [
                      '#FF5722', // Orange
                      '#00BCD4', // Cyan
                      '#E91E63', // Pink
                      '#FFC107', // Amber
                    ];
                    const hoverColor = brandColors[index % brandColors.length];
                    
                    return (
                    <Link key={project.id} href={`/projects/${project.slug}`}>
                      <Card className="group cursor-pointer overflow-hidden border-0 bg-transparent hover:scale-[1.02] transition-all duration-500">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={`${project.title} - Scenic design by Brandon PT Davis`}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Project info on hover */}
                          <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0 text-xs">
                                {project.discipline?.replace('_', ' ').toUpperCase()}
                              </Badge>
                              {project.year && (
                                <span className="text-xs text-white/80">{project.year}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-white font-semibold text-sm">
                              VIEW PROJECT <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-6 bg-card">
                          <h3 
                            className="text-2xl font-bold mb-2 transition-colors"
                            style={{ '--hover-color': hoverColor } as React.CSSProperties}
                            onMouseEnter={(e) => (e.currentTarget.style.color = hoverColor)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                          >
                            {project.title}
                          </h3>
                          {project.client && (
                            <p className="text-sm font-medium text-foreground mb-1">{project.client}</p>
                          )}
                          {project.location && (
                            <p className="text-sm text-muted-foreground mb-3">{project.location}</p>
                          )}
                          {project.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                              {project.excerpt}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                    );
                  })}
                </div>

                {/* View All Projects Button */}
                <div className="text-center">
                  <Link href="/projects/scenic-design">
                    <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6">
                      VIEW ALL SCENIC DESIGN PROJECTS
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      {/* Latest News Section */}
      {newsItems && newsItems.length > 0 && (
        <AnimatedSection>
          <section className="py-24 md:py-32 bg-secondary/20">
            <div className="container">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">UPDATES</p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-6">
                    Latest News
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Recent announcements, show openings, and design updates
                  </p>
                </div>

                {/* News Grid - 3 columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {newsItems.slice(0, 3).map((news) => (
                    <Link key={news.id} href={`/news/${news.slug}`}>
                      <Card className="h-full hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 bg-background overflow-hidden group">
                        {news.coverImageUrl && (
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <img
                              src={news.coverImageUrl}
                              alt={news.title}
                              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          {news.publishedAt && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              <span>{new Date(news.publishedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}</span>
                            </div>
                          )}
                          <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[#FF5722] transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                            {news.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-[#FF5722] font-semibold text-sm">
                            READ MORE <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* View All News Button */}
                <div className="text-center">
                  <Link href="/news">
                    <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6">
                      VIEW ALL NEWS
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </AnimatedSection>
      )}

      <Footer />
    </>
  );
}
