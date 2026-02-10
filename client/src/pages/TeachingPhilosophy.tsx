import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useEffect } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";

export default function TeachingPhilosophy() {
  const { data: projects } = trpc.projects.list.useQuery({ 
    status: "published"
  });
  
  const generatePDF = trpc.pdf.generateTeachingPhilosophy.useMutation();

  // Filter to scenic design and rendering projects only
  const scenicDesignProjects = (projects || []).filter(p => 
    p.discipline === 'scenic_design' || p.discipline === 'rendering'
  );

  // Select diverse images for galleries
  const diverseProjects = scenicDesignProjects.length > 0 
    ? [
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.2)],
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.4)],
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.5)],
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.7)],
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.8)],
        scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.9)],
      ].filter(Boolean)
    : [];

  const heroImage = scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.3)]?.coverImageUrl;

  // Scroll-triggered animations
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const animatedElements = document.querySelectorAll('.fade-in-up');
    
    animatedElements.forEach((el) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-in-up');
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Teaching Philosophy | Brandon PT Davis</title>
        <meta name="description" content="Preparing the next generation of scenic designers for theatre, film, television, events, and themed entertainment through comprehensive foundation and adaptive pedagogy." />
        
        {/* Open Graph */}
        <meta property="og:title" content="Teaching Philosophy | Brandon PT Davis - Scenic Designer" />
        <meta property="og:description" content="Equipping students with skills, confidence, and adaptability for careers across theatre, film, TV, events, and themed entertainment." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brandonptdavis.com/about/philosophy" />
        {heroImage && <meta property="og:image" content={heroImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Teaching Philosophy | Brandon PT Davis" />
        <meta name="twitter:description" content="Preparing the next generation of scenic designers for theatre, film, television, events, and themed entertainment." />
        {heroImage && <meta name="twitter:image" content={heroImage} />}
      </Helmet>
      
      <Header />

      {/* Hero Section with Parallax Background */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
        {/* Parallax Background */}
        {heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/70" />
          </div>
        )}
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h1 className="text-6xl md:text-7xl font-serif mb-6 leading-tight">
            Teaching Philosophy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Preparing the next generation of scenic designers for theatre, film, television, events, and themed entertainment
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 bg-background">
        <div className="container max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-12">
            
            {/* Sticky Section Labels */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <div className="fade-in-up opacity-0">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Foundation
                  </div>
                </div>
                <div className="fade-in-up opacity-0">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Pedagogy
                  </div>
                </div>
                <div className="fade-in-up opacity-0">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Mentorship
                  </div>
                </div>
                <div className="fade-in-up opacity-0">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Research
                  </div>
                </div>
              </div>
            </aside>

            {/* Content Sections */}
            <div className="space-y-24">
              
              {/* Foundation Section */}
              <section className="fade-in-up opacity-0">
                <h2 className="text-3xl font-serif mb-8 lg:hidden">Foundation</h2>
                
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p className="text-lg first-letter:text-7xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:mt-1">
                    As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.
                  </p>
                  
                  <p>
                    While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.
                  </p>
                  
                  <p>
                    I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.
                  </p>
                </div>

                {/* Image Gallery */}
                {diverseProjects.length >= 2 && (
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {diverseProjects.slice(0, 2).map((project) => (
                      <Link key={project.id} href={`/work/${project.slug}`}>
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={project.coverImageUrl || ''}
                            alt={`${project.title} - Scenic Design by Brandon PT Davis`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-gray-300">{new Date(project.createdAt).getFullYear()}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Pull Quote 1 */}
              <div className="fade-in-up opacity-0 my-16">
                <blockquote className="text-3xl md:text-4xl font-serif italic text-center max-w-3xl mx-auto border-l-4 border-primary pl-8 py-4">
                  "By layering old and new methods, I encourage students to respect process while embracing innovation"
                </blockquote>
              </div>

              {/* Pedagogy Section */}
              <section className="fade-in-up opacity-0">
                <h2 className="text-3xl font-serif mb-8 lg:hidden">Pedagogy</h2>
                
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.
                  </p>
                  
                  <p>
                    Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas's immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.
                  </p>
                </div>

                {/* Image Gallery */}
                {diverseProjects.length >= 4 && (
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {diverseProjects.slice(2, 4).map((project) => (
                      <Link key={project.id} href={`/work/${project.slug}`}>
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={project.coverImageUrl || ''}
                            alt={`${project.title} - Scenic Design by Brandon PT Davis`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-gray-300">{new Date(project.createdAt).getFullYear()}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Mentorship Section */}
              <section className="fade-in-up opacity-0">
                <h2 className="text-3xl font-serif mb-8 lg:hidden">Mentorship</h2>
                
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.
                  </p>
                  
                  <p>
                    Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.
                  </p>
                </div>

                {/* Image Gallery */}
                {diverseProjects.length >= 6 && (
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {diverseProjects.slice(4, 6).map((project) => (
                      <Link key={project.id} href={`/work/${project.slug}`}>
                        <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={project.coverImageUrl || ''}
                            alt={`${project.title} - Scenic Design by Brandon PT Davis`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                              <div className="font-medium">{project.title}</div>
                              <div className="text-sm text-gray-300">{new Date(project.createdAt).getFullYear()}</div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Pull Quote 2 */}
              <div className="fade-in-up opacity-0 my-16">
                <blockquote className="text-3xl md:text-4xl font-serif italic text-center max-w-3xl mx-auto border-l-4 border-primary pl-8 py-4">
                  "The classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes"
                </blockquote>
              </div>

              {/* Research Section */}
              <section className="fade-in-up opacity-0">
                <h2 className="text-3xl font-serif mb-8 lg:hidden">Research</h2>
                
                <div className="prose prose-lg max-w-none text-foreground/90 leading-relaxed space-y-6">
                  <p>
                    I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.
                  </p>
                  
                  <p>
                    For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.
                  </p>
                </div>
              </section>

              {/* Course Syllabi Section */}
              <section className="fade-in-up opacity-0">
                <h2 className="text-3xl font-serif mb-6">Course Syllabi</h2>
                <p className="text-foreground/90 leading-relaxed mb-6">
                  Explore detailed syllabi from courses I've taught, showcasing the curriculum, projects, and learning objectives that guide students through comprehensive design education.
                </p>
                <div className="grid gap-4">
                  <Link href="/syllabus/experiential-design" className="block bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:bg-card/50 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">Experiential Design</h3>
                    <p className="text-sm text-muted-foreground">Theme parks, restaurants, museums, and immersive experiences — bridging theatrical design with commercial storytelling.</p>
                  </Link>
                  <Link href="/syllabus/3d-modeling" className="block bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 hover:bg-card/50 transition-colors">
                    <h3 className="text-xl font-semibold mb-2">3D Modeling and Rendering</h3>
                    <p className="text-sm text-muted-foreground">THA 211: Vectorworks — Advanced CAD workflows, 3D modeling, and industry-standard construction documentation.</p>
                  </Link>
                </div>
              </section>

              {/* Signature & Download */}
              <div className="fade-in-up opacity-0 pt-12 border-t border-border">
                <div className="text-3xl font-serif mb-2">Brandon PT Davis</div>
                <div className="text-lg text-muted-foreground mb-8">Scenic Designer & Educator</div>
                
                {/* Download PDF Button */}
                <button 
                  onClick={async () => {
                    try {
                      const result = await generatePDF.mutateAsync();
                      const blob = new Blob(
                        [Uint8Array.from(atob(result.data), c => c.charCodeAt(0))],
                        { type: 'application/pdf' }
                      );
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = result.filename;
                      a.click();
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('PDF generation failed:', error);
                      alert('Failed to generate PDF. Please try again.');
                    }
                  }}
                  disabled={generatePDF.isPending}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" x2="12" y1="15" y2="3"/>
                  </svg>
                  <span>{generatePDF.isPending ? 'Generating PDF...' : 'Download Teaching Philosophy (PDF)'}</span>
                </button>
              </div>

              {/* View Full Portfolio CTA */}
              <div className="fade-in-up opacity-0 bg-muted/30 rounded-2xl p-12 text-center">
                <h3 className="text-3xl font-serif mb-4">Explore My Work</h3>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Discover how these teaching principles inform my professional scenic design practice across theatre, film, and themed entertainment.
                </p>
                <Link 
                  href="/work" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors"
                >
                  View Full Portfolio
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
