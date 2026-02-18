import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";
import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Download } from "lucide-react";
import { Helmet } from 'react-helmet-async';

export default function TeachingPhilosophy() {
  const { data: projects } = trpc.projects.list.useQuery({ 
    status: "published"
  });

  const generatePDF = trpc.system.generateTeachingPhilosophyPDF.useMutation();

  // Filter to scenic design and rendering projects only
  const scenicDesignProjects = (projects || []).filter(p => 
    p.discipline === 'scenic_design' || p.discipline === 'rendering'
  );

  // Get a colorful hero background - prefer middle of portfolio for variety
  const heroImage = scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.35)]?.coverImageUrl || scenicDesignProjects.find(p => p.featured)?.coverImageUrl || scenicDesignProjects[0]?.coverImageUrl;

  // Diversify images across sections - ensure all 6 images are completely different
  const totalProjects = scenicDesignProjects.length;
  
  // Select 6 evenly distributed unique images from the portfolio
  const selectedIndices = totalProjects >= 6 ? [
    Math.floor(totalProjects * 0.1),
    Math.floor(totalProjects * 0.25),
    Math.floor(totalProjects * 0.4),
    Math.floor(totalProjects * 0.55),
    Math.floor(totalProjects * 0.7),
    Math.floor(totalProjects * 0.85)
  ] : [0, 1, 2, 3, 4, 5].slice(0, totalProjects);
  
  const foundationImages = totalProjects > 0 ? [
    scenicDesignProjects[selectedIndices[0]],
    scenicDesignProjects[selectedIndices[1]]
  ].filter(Boolean) : [];
  
  const pedagogyImages = totalProjects > 0 ? [
    scenicDesignProjects[selectedIndices[2]],
    scenicDesignProjects[selectedIndices[3]]
  ].filter(Boolean) : [];
  
  const mentorshipImages = totalProjects > 0 ? [
    scenicDesignProjects[selectedIndices[4]],
    scenicDesignProjects[selectedIndices[5]]
  ].filter(Boolean) : [];

  // Scroll animation refs
  const foundationRef = useRef<HTMLElement>(null);
  const pedagogyRef = useRef<HTMLElement>(null);
  const mentorshipRef = useRef<HTMLElement>(null);
  const researchRef = useRef<HTMLElement>(null);
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

    const refs = [foundationRef, pedagogyRef, mentorshipRef, researchRef, pullQuote1Ref, pullQuote2Ref, ctaRef];
    
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
  const heroProject = scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.35)] || scenicDesignProjects.find(p => p.featured) || scenicDesignProjects[0];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Scenic Design Teaching Philosophy | MFA Educator | UCI"
        description="Comprehensive scenic design education philosophy from MFA educator. Equipping students with skills, confidence, and adaptability for the entertainment industry."
        keywords="scenic design education, theatre design teaching, Vectorworks instruction, scenic design pedagogy, MFA scenic design, design technology education, theatrical design teaching philosophy, UC Irvine, UCI MFA"
        image={heroProject?.coverImageUrl}
        url="https://www.brandonptdavis.com/teaching-philosophy"
        type="article"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer and Educator",
          url: "https://www.brandonptdavis.com",
          description: "MFA-trained scenic designer and educator specializing in comprehensive design education, Vectorworks training, and professional development for emerging designers.",
          knowsAbout: [
            "Scenic Design Education",
            "Theatre Design Pedagogy",
            "Vectorworks Training",
            "Design Visualization",
            "Professional Development",
            "MFA Instruction"
          ],
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu"
            }
          ]
        }}
      />
      <Header />

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
          <p className="text-xs uppercase tracking-widest text-white/60 mb-8 text-center">TEACHING PHILOSOPHY</p>
          
          <h1 className="text-5xl md:text-7xl font-serif mb-16 leading-tight text-center text-white">
            Education
            <br />
            & Mentorship
          </h1>

          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-white/90 leading-relaxed mb-8 first-letter:text-6xl first-letter:font-serif first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary">
              As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.
            </p>
          </div>
        </div>
      </section>

      {/* Foundation Section */}
      <section 
        ref={foundationRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Foundation
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.
                </p>
              </div>

              {/* Foundation Images */}
              {foundationImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {foundationImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                          {project.year && <p className="text-white/70 text-sm">{project.year}</p>}
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
              "Recognizing that each student learns differently, I employ versatile teaching strategies."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Pedagogy Section */}
      <section 
        ref={pedagogyRef}
        className="relative py-32 px-6 bg-accent/5 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start mb-16">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Pedagogy
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas's immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.
                </p>
              </div>

              {/* Pedagogy Images */}
              {pedagogyImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {pedagogyImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                          {project.year && <p className="text-white/70 text-sm">{project.year}</p>}
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
              "I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Mentorship Section */}
      <section 
        ref={mentorshipRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Mentorship
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.
                </p>
              </div>

              {/* Mentorship Images */}
              {mentorshipImages.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {mentorshipImages.map((project) => (
                    <div key={project.id} className="group relative overflow-hidden rounded-lg aspect-[4/3]">
                      <img 
                        src={project.coverImageUrl || ''} 
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <p className="text-white font-serif text-lg">{project.title}</p>
                          {project.year && <p className="text-white/70 text-sm">{project.year}</p>}
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

      {/* Research Section */}
      <section 
        ref={researchRef}
        className="relative py-32 px-6 bg-accent/5 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[200px_1fr] gap-12 items-start">
            <div className="text-sm uppercase tracking-widest text-muted-foreground md:sticky md:top-32">
              Research
            </div>
            <div>
              <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                <p className="text-xl text-foreground/90 leading-relaxed mb-8">
                  I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.
                </p>
              </div>

              {/* Course Syllabi */}
              <div className="mt-16">
                <h3 className="text-2xl font-serif mb-6">Course Syllabi</h3>
                <p className="text-lg text-foreground/80 mb-8">
                  Explore detailed syllabi from courses I've taught, showcasing the curriculum, projects, and learning objectives that guide students through comprehensive design education.
                </p>
                <div className="grid gap-4">
                  <Link href="/syllabus/experiential-design" className="block bg-gradient-to-br from-orange-500/20 to-pink-500/20 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 hover:from-orange-500/30 hover:to-pink-500/30 transition-all duration-300 group">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">Experiential Design</h4>
                    <p className="text-sm text-foreground/70">Theme parks, restaurants, museums, and immersive experiences — bridging theatrical design with commercial storytelling.</p>
                  </Link>
                  <Link href="/syllabus/3d-modeling" className="block bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md border border-blue-500/30 rounded-2xl p-6 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 group">
                    <h4 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">3D Modeling and Rendering</h4>
                    <p className="text-sm text-foreground/70">THA 211: Vectorworks — Advanced CAD workflows, 3D modeling, and industry-standard construction documentation.</p>
                  </Link>
                </div>
              </div>

              {/* Teaching Experience & Courses */}
              <div className="grid md:grid-cols-2 gap-8 mt-16">
                <div className="border-l-4 border-purple-500/50 pl-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-r-lg">
                  <h3 className="text-lg uppercase tracking-widest text-muted-foreground mb-6">Teaching Experience</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold">Stephens College</h4>
                      <p className="text-sm text-muted-foreground">Lecturer (Remote)</p>
                      <p className="text-sm text-muted-foreground">2024 – 2025</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">Stephens College</h4>
                      <p className="text-sm text-muted-foreground">Lecturer</p>
                      <p className="text-sm text-muted-foreground">2021 – 2024</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">University of Texas at El Paso</h4>
                      <p className="text-sm text-muted-foreground">Visiting Assistant Professor</p>
                      <p className="text-sm text-muted-foreground">2021</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold">University of California, Irvine</h4>
                      <p className="text-sm text-muted-foreground">Adjunct Lecturer & TA</p>
                      <p className="text-sm text-muted-foreground">2017 – 2020</p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-cyan-500/50 pl-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 p-6 rounded-r-lg">
                  <h3 className="text-lg uppercase tracking-widest text-muted-foreground mb-6">Courses Taught</h3>
                  <ul className="space-y-2 text-foreground/80">
                    <li>• Scenic Design</li>
                    <li>• Introduction to Scenic Design</li>
                    <li>• Digital Rendering</li>
                    <li>• Entertainment Design & Collaboration</li>
                    <li>• Vectorworks (Drafting & 3D Modeling)</li>
                    <li>• Technical Theatre</li>
                    <li>• Properties Supervisor (TA)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="relative py-32 px-6 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Explore My Work
          </h2>
          <p className="text-xl text-muted-foreground mb-12">
            See examples of scenic design projects that inform my teaching practice
          </p>
          <Link 
            href="/work"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            View Portfolio
          </Link>
        </div>
      </section>

      {/* Download Button Section */}
      <section className="relative py-16 px-6 bg-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <button
            onClick={async () => {
              try {
                const result = await generatePDF.mutateAsync();
                if (result.success && result.url) {
                  window.open(result.url, '_blank');
                }
              } catch (error) {
                console.error('Failed to generate PDF:', error);
              }
            }}
            disabled={generatePDF.isPending}
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download Teaching Philosophy (PDF)
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            For hiring committees and academic review
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
