import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
import { Link } from "wouter";

export default function CreativeStatement() {
  const { data: projects } = trpc.projects.list.useQuery({ 
    status: "published"
  });

  // Filter to scenic design and rendering projects only (exclude experiential_design)
  const scenicDesignProjects = (projects || []).filter(p => 
    p.discipline === 'scenic_design' || p.discipline === 'rendering'
  );

  // Get featured scenic design project for hero background
  const heroImage = scenicDesignProjects.find(p => p.featured)?.coverImageUrl || scenicDesignProjects[0]?.coverImageUrl;

  // Diversify images - spread across different projects instead of just first 6
  const allProjects = scenicDesignProjects;
  const totalProjects = scenicDesignProjects.length;
  
  // Select images from different parts of the portfolio for variety
  const processImages = totalProjects > 0 ? [
    allProjects[Math.floor(totalProjects * 0.2)] || allProjects[0],
    allProjects[Math.floor(totalProjects * 0.4)] || allProjects[1]
  ].filter(Boolean) : [];
  
  const collaborationImages = totalProjects > 0 ? [
    allProjects[Math.floor(totalProjects * 0.5)] || allProjects[2],
    allProjects[Math.floor(totalProjects * 0.7)] || allProjects[3]
  ].filter(Boolean) : [];
  
  const philosophyImages = totalProjects > 0 ? [
    allProjects[Math.floor(totalProjects * 0.8)] || allProjects[4],
    allProjects[Math.floor(totalProjects * 0.9)] || allProjects[5]
  ].filter(Boolean) : [];

  // Scroll animation refs
  const collaborationRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const pullQuote1Ref = useRef<HTMLDivElement>(null);
  const pullQuote2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    };

    const refs = [collaborationRef, processRef, philosophyRef, pullQuote1Ref, pullQuote2Ref, ctaRef];
    
    refs.forEach(ref => {
      if (ref.current) {
        const observer = new IntersectionObserver(animateOnScroll, observerOptions);
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Get hero project for Open Graph image
  const heroProject = scenicDesignProjects.find(p => p.featured) || scenicDesignProjects[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Creative Design Statement | Scenic & Experiential Design"
        description="Exploring the intersection of architecture, history, and storytelling through scenic design. Creative philosophy centered on spatial narratives and immersive environments."
        keywords="scenic design philosophy, creative statement, theatrical storytelling, architectural design, spatial narrative, immersive design, theatre design approach, experiential design philosophy"
        image={heroProject?.coverImageUrl}
        url="https://www.brandonptdavis.com/creative-statement"
        type="article"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic and Experiential Designer",
          url: "https://www.brandonptdavis.com",
          description: "Scenic designer exploring the intersection of architecture, history, and storytelling to create immersive spatial narratives for theatre and experiential design.",
          knowsAbout: [
            "Scenic Design",
            "Spatial Storytelling",
            "Architectural Design",
            "Immersive Environments",
            "Historical Research",
            "Theatrical Collaboration"
          ]
        }}
      />
      <Header />
      <AboutNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        {/* Parallax Background */}
        {heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              transform: 'translateZ(0)',
              willChange: 'transform',
              backgroundAttachment: 'fixed'
            }}
          />
        )}
        
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-background pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-8 text-center">CREATIVE STATEMENT</p>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-16 leading-tight text-center text-white">
            Architecture, History
            <br />
            & Narrative Storytelling
          </h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-white/90 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
              My passion for scenic design falls somewhere between a love of architecture, history, and narrative storytelling. I'm drawn to projects that have meaning and impact for the communities they serve. I'm especially interested in productions where the design does more than illustrate a setting and becomes part of how the story resonates.
            </p>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section 
        ref={collaborationRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Collaboration
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed">
                  I value every collaborator involved in bringing a production to life. That starts with the hidden collaborator, the playwright, and extends to the director, the creative team, and the production teams. I also enjoy working closely with company managers, carpenters, and artisans to realize the best version of the creative team's vision within each unique venue.
                </p>
              </div>

              {/* Collaboration Images */}
              {collaborationImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {collaborationImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote 1 */}
      <div 
        ref={pullQuote1Ref}
        className="relative py-24 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l-4 border-primary pl-8 md:pl-12">
            <p className="text-3xl md:text-4xl font-serif italic text-foreground/90 leading-relaxed">
              "I'm never afraid to start over, no matter where we are in the process."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Process Section */}
      <section 
        ref={processRef}
        className="relative py-32 px-6 bg-accent/5 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Process
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  My process often begins with a lot of ideas that pull in different directions. Early conversations with the director focus on the text: What do they see, and how can we shape a shared vision? From that point forward, I build digital models to explore and sculpt the world. I'm never afraid to start over, no matter where we are in the process.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  I love the energy of collaborative design conversations, when ideas start bouncing between departments and the production finds its rhythm. Technically, I thrive in the transition from rendering to drafting, translating concepts into fully buildable spaces. I'm drawn to designs where structure and detail work together, and where every choice supports both the narrative and the performers onstage.
                </p>
              </div>

              {/* Process Images */}
              {processImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {processImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote 2 */}
      <div 
        ref={pullQuote2Ref}
        className="relative py-24 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l-4 border-primary pl-8 md:pl-12">
            <p className="text-3xl md:text-4xl font-serif italic text-foreground/90 leading-relaxed">
              "Designs that feel inevitable once they're revealed."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Philosophy Section */}
      <section 
        ref={philosophyRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Philosophy
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-16">
                  Whether I'm working on a classic or a new play, my goal is to create environments that feel inevitable once they're revealed. Ideally, the design feels like it couldn't have been any other way, even if it took many revisions and collaborative breakthroughs to get there.
                </p>
              </div>

              {/* Philosophy Images */}
              {philosophyImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6 mb-16">
                  {philosophyImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Signature */}
              <div className="border-t border-border/50 pt-12">
                <div className="text-3xl font-serif mb-2">Brandon PT Davis</div>
                <div className="text-lg text-muted-foreground">Scenic Designer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Full Portfolio CTA */}
      <section 
        ref={ctaRef}
        className="relative py-32 px-6 bg-accent/10 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Explore the Full Portfolio
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover over 130 realized productions spanning scenic design, experiential design, and collaborative projects across regional theatres and beyond.
          </p>
          <Link href="/work" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold">
            <span>View Full Portfolio</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
