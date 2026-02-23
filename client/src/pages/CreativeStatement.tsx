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

  const getProjectTypeLabel = (project?: { discipline?: string | null } | null) =>
    project?.discipline === "rendering" ? "Rendering" : "Scenic Design";

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
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_14%_10%,rgba(255,87,34,0.08),transparent_34%),radial-gradient(circle_at_84%_14%,rgba(0,188,212,0.08),transparent_30%)]">
      <SEO
        title="Creative Design Statement | Scenic Design Philosophy"
        description="Exploring architecture, history, and storytelling through scenic design. A creative statement centered on narrative space, dramaturgy, and production collaboration."
        keywords="scenic design philosophy, creative statement scenic designer, theatrical storytelling, architectural design for stage, spatial narrative, theatre design approach"
        image={heroProject?.coverImageUrl ?? undefined}
        url="https://www.brandonptdavis.com/creative-statement"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
          { name: "Creative Statement", url: "https://www.brandonptdavis.com/creative-statement" },
        ]}
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: "https://www.brandonptdavis.com",
          description: "Scenic designer exploring architecture, history, and storytelling to create narrative stage environments for theatre production.",
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
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Creative Statement: Architecture, History & Narrative Storytelling",
          description: "A scenic design creative statement by Brandon PT Davis, articulating process, collaboration, and story-led spatial design.",
          url: "https://www.brandonptdavis.com/creative-statement",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: "2026-01-01",
          genre: "Scenic Design",
          keywords: [
            "creative statement",
            "scenic design philosophy",
            "theatre design process",
            "story-led design",
          ],
          image: heroProject?.coverImageUrl || undefined,
          about: "Scenic design philosophy and production collaboration",
        }}
      />
      <Header />
      <AboutNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-36 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/72 to-background pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,87,34,0.18),transparent_30%),radial-gradient(circle_at_82%_24%,rgba(0,188,212,0.16),transparent_30%)] pointer-events-none"></div>
        
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-white/60 mb-8 text-center">CREATIVE STATEMENT</p>
          
          <h1 className="text-6xl md:text-8xl font-serif mb-14 leading-[0.9] tracking-tight text-center text-white">
            Architecture, History
            <br />
            & Narrative Storytelling
          </h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-white/90 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
              My passion for scenic design falls somewhere between a love of architecture, history, and narrative storytelling. I'm drawn to projects that have meaning and impact for the communities they serve. I'm especially interested in productions where the design does more than illustrate a setting and becomes part of how the story resonates.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            <div className="rounded-xl border border-white/20 bg-black/35 backdrop-blur-sm px-4 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1">Union</p>
              <p className="text-sm font-semibold text-white">USA 829</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-black/35 backdrop-blur-sm px-4 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1">Practice</p>
              <p className="text-sm font-semibold text-white">Scenic Design</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-black/35 backdrop-blur-sm px-4 py-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/60 mb-1">Focus</p>
              <p className="text-sm font-semibold text-white">Story-Led Space</p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section 
        ref={collaborationRef}
        className="relative py-32 px-6 border-y border-border/40 bg-card/10 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Collaboration
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
                  I value every collaborator involved in <span className="text-foreground font-medium">bringing a production to life</span>. That starts with the hidden collaborator, the playwright, and extends to the director, the creative team, and the production teams. I also enjoy working closely with company managers, carpenters, and artisans to realize the best version of the creative team's vision within each unique venue.
                </p>
              </div>

              {/* Collaboration Visual Break */}
              {collaborationImages.length > 0 && (
                <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-border/50">
                  <img 
                    src={collaborationImages[0]?.coverImageUrl || ''} 
                    alt={collaborationImages[0]?.title || "Collaboration project"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-[10px] uppercase tracking-[0.2em] mb-2">{getProjectTypeLabel(collaborationImages[0])}</p>
                    <p className="text-white font-serif text-xl">{collaborationImages[0]?.title}</p>
                  </div>
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
          <blockquote className="border-l-4 border-primary pl-8 md:pl-12 bg-card/20 rounded-r-xl py-6 pr-6">
            <p className="text-3xl md:text-4xl font-serif italic text-foreground/90 leading-relaxed">
              "I'm never afraid to start over, no matter where we are in the process."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Process Section */}
      <section 
        ref={processRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Process
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
                  My process often begins with a lot of ideas that pull in different directions. Early conversations with the director focus on the text: What do they see, and how can we shape a shared vision? From that point forward, I build digital models to <span className="text-foreground font-medium">explore and sculpt the world</span>. I'm never afraid to start over, no matter where we are in the process.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  I love the energy of collaborative design conversations, when ideas start bouncing between departments and the production finds its rhythm. Technically, I thrive in the transition from rendering to drafting, translating concepts into fully buildable spaces. I'm drawn to designs where structure and detail work together, and where every choice supports both the narrative and the performers onstage.
                </p>
              </div>

              {/* Process Visual Break */}
              {processImages.length > 0 && (
                <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-border/50">
                  <img 
                    src={processImages[0]?.coverImageUrl || ''} 
                    alt={processImages[0]?.title || "Process project"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-[10px] uppercase tracking-[0.2em] mb-2">{getProjectTypeLabel(processImages[0])}</p>
                    <p className="text-white font-serif text-xl">{processImages[0]?.title}</p>
                  </div>
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
          <blockquote className="border-l-4 border-primary pl-8 md:pl-12 bg-card/20 rounded-r-xl py-6 pr-6">
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
                <p className="text-xl text-foreground/90 leading-relaxed mb-16 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
                  Whether I'm working on a classic or a new play, my goal is to create environments that <span className="text-foreground font-medium">feel inevitable once they're revealed</span>. Ideally, the design feels like it couldn't have been any other way, even if it took many revisions and collaborative breakthroughs to get there.
                </p>
              </div>

              {/* Philosophy Visual Break */}
              {philosophyImages.length > 0 && (
                <div className="group relative overflow-hidden rounded-2xl aspect-[16/9] border border-border/50 mb-16">
                  <img 
                    src={philosophyImages[0]?.coverImageUrl || ''} 
                    alt={philosophyImages[0]?.title || "Philosophy project"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-[10px] uppercase tracking-[0.2em] mb-2">{getProjectTypeLabel(philosophyImages[0])}</p>
                    <p className="text-white font-serif text-xl">{philosophyImages[0]?.title}</p>
                  </div>
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
        className="relative py-32 px-6 border-y border-border/40 bg-card/10 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Explore the Full Portfolio
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Discover over 130 realized productions spanning scenic design, experiential design, and collaborative projects across regional theatres and beyond.
          </p>
          <Link href="/projects" className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold">
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
