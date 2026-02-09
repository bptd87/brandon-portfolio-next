import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { AnimatedSection } from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";
import { useState, useEffect } from "react";

export default function Home() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.brandonptdavis.com';
  const { user } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({ featured: true, status: 'published' });
  const { data: newsItems } = trpc.news.list.useQuery({});
  const { data: articles } = trpc.articles.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hero images from top featured projects
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
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black leading-[0.9] tracking-tighter mb-8 text-white drop-shadow-2xl">
            <span className="block">BRANDON</span>
            <span className="block">PT DAVIS</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-xl md:text-2xl lg:text-3xl font-bold tracking-wider mb-12">
            <span className="text-[#FF5722] drop-shadow-lg">ART</span>
            <span className="text-white/60">×</span>
            <span className="text-[#00E5FF] drop-shadow-lg">TECHNOLOGY</span>
            <span className="text-white/60">×</span>
            <span className="text-[#FF1744] drop-shadow-lg">DESIGN</span>
          </div>

          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            Scenic & Experiential Designer transforming theatrical spaces into immersive visual landscapes
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/projects">
              <Button size="lg" className="text-base font-semibold px-8 py-6 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white shadow-2xl">
                VIEW WORK
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-base font-semibold px-8 py-6 border-2 border-white text-white hover:bg-white hover:text-black shadow-2xl">
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

      {/* Featured Work - HUGE Showcases */}
      {projects && projects.length > 0 && (
        <section className="py-0">
          {projects.slice(0, 4).map((project, index) => (
            <div key={project.id}>
              {/* Insert Article/News "Spark" after every 2 projects */}
              {index === 2 && articles && articles.length > 0 && (
                <div className="py-32 bg-secondary/20">
                  <div className="container">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">INSIGHTS</p>
                      <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8">
                        Latest Thinking
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                      {articles.slice(0, 2).map((article) => (
                        <Link key={article.id} href={`/articles/${article.slug}`}>
                          <Card className="h-full hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 bg-background p-0">
                            <CardContent className="p-10">
                              <h3 className="text-2xl font-bold mb-4 line-clamp-2">{article.title}</h3>
                              <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
                              <div className="mt-6 flex items-center gap-2 text-[#FF5722] font-semibold">
                                READ MORE <ArrowRight className="h-4 w-4" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Huge Project Showcase */}
              <AnimatedSection>
              <Link href={`/projects/${project.slug}`}>
                <div className="group cursor-pointer relative overflow-hidden">
                  {/* Full-width, tall image */}
                  <div className="relative w-full h-[70vh] md:h-[80vh] lg:h-[90vh]">
                    {project.coverImageUrl ? (
                      <img 
                        src={project.coverImageUrl} 
                        alt={`${project.title} - Scenic design by Brandon PT Davis`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-2xl">No image</p>
                      </div>
                    )}
                    
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Project info overlay - bottom left */}
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 text-white max-w-3xl">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-sm border-0 text-xs uppercase tracking-wider">
                          {project.discipline}
                        </Badge>
                        {project.year && (
                          <span className="text-sm text-white/70">{project.year}</span>
                        )}
                      </div>
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tight leading-none">
                        {project.title}
                      </h2>
                      {project.excerpt && (
                        <p className="text-lg md:text-xl text-white/80 mb-6 leading-relaxed line-clamp-2">
                          {project.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-4 transition-all">
                        VIEW PROJECT <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              </AnimatedSection>
            </div>
          ))}
        </section>
      )}

      <Footer />
    </>
  );
}
