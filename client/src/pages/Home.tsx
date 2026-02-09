import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "wouter";
import { AnimatedSection } from "@/components/AnimatedSection";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.brandonptdavis.com';
  const { user } = useAuth();
  const { data: projects } = trpc.projects.list.useQuery({ featured: true, status: 'published' });
  const { data: newsItems } = trpc.news.list.useQuery({});
  const { data: articles } = trpc.articles.list.useQuery({});
  const { data: categories } = trpc.categories.list.useQuery({});

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
      
      {/* Hero Section - Simple, Bold Typography */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FF5722] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#00E5FF] rounded-full blur-[120px] opacity-10" />
        
        {/* Hero Content */}
        <div className="relative z-10 container text-center px-4">
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[9vw] font-black leading-[0.9] tracking-tighter mb-8">
            <span className="block text-foreground">BRANDON</span>
            <span className="block text-foreground">PT DAVIS</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 text-xl md:text-2xl lg:text-3xl font-bold tracking-wider mb-12">
            <span className="text-[#FF5722]">ART</span>
            <span className="text-foreground/40">×</span>
            <span className="text-[#00E5FF]">TECHNOLOGY</span>
            <span className="text-foreground/40">×</span>
            <span className="text-[#FF1744]">DESIGN</span>
          </div>

          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Scenic & Experiential Designer transforming theatrical spaces into immersive visual landscapes
          </p>

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

        <button 
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-foreground/40 hover:text-foreground transition-colors"
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
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-2xl">No image</p>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                    
                    {/* Color accent on hover */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                      style={{
                        backgroundColor: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744'
                      }}
                    />

                    {/* Project info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24">
                      <div className="container">
                        <div className="max-w-4xl">
                          <div className="flex items-center gap-4 mb-6">
                            <Badge 
                              variant="outline" 
                              className="text-sm tracking-wider font-semibold bg-background/80 backdrop-blur-sm px-4 py-2"
                              style={{
                                borderColor: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744',
                                color: index % 3 === 0 ? '#FF5722' : index % 3 === 1 ? '#00E5FF' : '#FF1744'
                              }}
                            >
                              SCENIC DESIGN
                            </Badge>
                            <span className="text-sm text-foreground/80 font-pixel">{project.year}</span>
                          </div>
                          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 group-hover:text-[#FF5722] transition-colors leading-tight">
                            {project.title}
                          </h2>
                          <Button 
                            size="lg" 
                            variant="secondary" 
                            className="gap-2 font-semibold text-base px-8 py-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          >
                            VIEW PROJECT <ArrowRight className="h-5 w-5" />
                          </Button>
                        </div>
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

      {/* News Section - Integrated */}
      {newsItems && newsItems.length > 0 && (
        <section className="py-32 bg-background border-t border-border">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">UPDATES</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8">
                Latest News
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {newsItems.slice(0, 3).map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <Card className="h-full hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 p-0">
                    <CardContent className="p-8">
                      <Badge variant="outline" className="mb-4 text-xs tracking-wider font-semibold border-[#00E5FF] text-[#00E5FF]">
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
            <div className="mt-16 text-center">
              <Link href="/news">
                <Button variant="outline" size="lg" className="gap-2 text-base font-semibold px-8 py-6 border-2">
                  VIEW ALL NEWS <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* More Articles */}
      {articles && articles.length > 2 && (
        <section className="py-32 bg-secondary/20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">MORE INSIGHTS</p>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8">
                Articles & Process
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {articles.slice(2, 5).map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover:shadow-2xl transition-all hover:scale-[1.02] cursor-pointer border-2 bg-background p-0">
                    <CardContent className="p-8">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
                      <div className="mt-6 flex items-center gap-2 text-[#FF5722] font-semibold text-sm">
                        READ MORE <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-16 text-center">
              <Link href="/articles">
                <Button variant="outline" size="lg" className="gap-2 text-base font-semibold px-8 py-6 border-2">
                  VIEW ALL ARTICLES <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-32 bg-background border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8">
              Let's Create<br />Something Amazing
            </h2>
            <p className="text-xl text-foreground/70 mb-12 leading-relaxed">
              Ready to transform your vision into an immersive visual experience?
            </p>
            <Link href="/contact">
              <Button size="lg" className="text-lg font-semibold px-12 py-8 bg-[#FF5722] hover:bg-[#FF5722]/90 text-white">
                START A PROJECT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
