import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Briefcase, GraduationCap, Mail, MapPin, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function About() {
  // Fetch some featured projects to showcase design work
  const { data: projects } = trpc.projects.list.useQuery({});

  const galleryImages = [
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TsVdekRTdTHOgGda.JPG", alt: "Teaching scenic design to students" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sgcZKfoZzxPeTUel.JPG", alt: "UC Irvine graduate school days" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ZGRhzttUHjtimPXQ.JPG", alt: "Collaborating with mentors" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/fPNAESGBIUQCJmkQ.JPG", alt: "Working with creative teams" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YgEJZLtqcTqihLMh.JPG", alt: "Creative collaborations" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/EeESHfPspBcRpEaU.JPG", alt: "Family and community" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JbMFmQRXOBCttcpL.JPG", alt: "Design partnerships" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/GDSJlHzKeThOHVcF.JPG", alt: "Behind the scenes" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      {/* Hero Section with Profile Picture */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjU3MjIiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE0aDI0djI0SDM2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="container relative py-20 md:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Text Content */}
              <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-pixel uppercase tracking-wider text-primary">Scenic Designer</span>
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.9] bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Brandon<br />PT Davis
                </h1>
                
                <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed max-w-2xl">
                  Transforming theatrical spaces into <span className="text-primary font-semibold">immersive visual landscapes</span> where story and space move together in harmony
                </p>
                
                {/* Contact Info */}
                <div className="flex flex-wrap gap-6 text-lg pt-4">
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground/80">Southern California</span>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <a href="mailto:info@brandonptdavis.com" className="text-foreground/80 hover:text-primary transition-colors">
                      info@brandonptdavis.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Right: Profile Picture */}
              <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-300">
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20 group">
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sAwMHaupahiCjmgJ.webp" 
                    alt="Brandon PT Davis Portrait"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="text-sm font-pixel uppercase tracking-wider">Fig. 01 — Portrait</p>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
              </div>
            </div>

            {/* Stats - Colorful Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-1">
                <div className="text-5xl md:text-6xl font-serif text-primary mb-2 group-hover:scale-110 transition-transform duration-500">15+</div>
                <div className="text-xs uppercase tracking-widest text-foreground/70">Years Experience</div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 p-8 hover:shadow-lg hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-1">
                <div className="text-5xl md:text-6xl font-serif text-accent mb-2 group-hover:scale-110 transition-transform duration-500">130+</div>
                <div className="text-xs uppercase tracking-widest text-foreground/70">Productions Designed</div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 p-8 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="text-5xl md:text-6xl font-serif text-blue-500 mb-2 group-hover:scale-110 transition-transform duration-500">MFA</div>
                <div className="text-xs uppercase tracking-widest text-foreground/70">UC Irvine</div>
              </div>
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 p-8 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1">
                <div className="text-5xl md:text-6xl font-serif text-purple-500 mb-2 group-hover:scale-110 transition-transform duration-500">829</div>
                <div className="text-xs uppercase tracking-widest text-foreground/70">USA Union Member</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Work Showcase - BIG IMAGES */}
      {projects && projects.length > 0 && (
        <section className="py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container">
            <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700">
              <h2 className="text-xs uppercase tracking-[0.3em] text-primary mb-4 font-pixel">SELECTED WORK</h2>
              <h3 className="text-5xl md:text-7xl font-serif mb-6">Design in Action</h3>
              <p className="text-xl text-foreground/70 max-w-3xl">
                From intimate black box theatres to grand regional stages, each project tells a unique visual story.
              </p>
            </div>

            {/* Large Image Grid */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
              {projects.slice(0, 6).map((project, index) => (
                <div 
                  key={project.id} 
                  className={`group relative overflow-hidden rounded-3xl ${
                    index === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-[4/3]'
                  } animate-in fade-in slide-in-from-bottom duration-700`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {project.coverImageUrl && (
                    <>
                      <img 
                        src={project.coverImageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <p className="text-sm font-pixel uppercase tracking-wider text-primary mb-2">{project.year || 'Recent'}</p>
                        <h4 className="text-3xl md:text-4xl font-serif mb-2">{project.title}</h4>
                        {project.location && (
                          <p className="text-lg text-white/80">{project.location}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section */}
      <section className="container py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
                Design as Storytelling
              </h2>
              <div className="prose prose-xl dark:prose-invert max-w-none space-y-6">
                <p className="text-xl text-foreground/90 leading-relaxed">
                  I believe scenic design is a form of storytelling—one that starts before the actors speak and lingers after the final bow. My work lives at the intersection of craft and concept, using physical space to shape emotion, tension, and rhythm.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  With over 15 years of experience in theatre and immersive environments, I've designed productions across the country, collaborated with inspiring creatives, and mentored the next generation of designers.
                </p>
                <p className="text-xl text-foreground/90 leading-relaxed">
                  Based in Southern California, my work is rooted in a lifelong curiosity about how design shapes experience. What began as a high school obsession with set sketches in 2006 has evolved into a professional practice defined by artistic risk-taking, narrative sensitivity, and technical precision.
                </p>
              </div>
            </div>

            <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700 delay-300">
              <div className="group relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-3xl p-10 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-3xl font-serif mb-6 relative">Analog & Digital Fluency</h3>
                <p className="text-lg text-foreground/80 leading-relaxed relative">
                  I'm equally fluent in the analog and digital—combining traditional model-making and drafting with advanced workflows in 3D modeling, real-time rendering, and digital fabrication. My design process often includes tools like Vectorworks, Twinmotion, and 3D printing, allowing directors and collaborators to experience spatial ideas in living motion.
                </p>
              </div>
              
              <div className="group relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20 rounded-3xl p-10 hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-3xl font-serif mb-6 relative">Collaborative Excellence</h3>
                <p className="text-lg text-foreground/80 leading-relaxed relative">
                  As a proud member of United Scenic Artists Local 829, I bring both rigor and play to the collaborative table, supporting teams with conceptual clarity, high-fidelity renderings, and production-ready technical drawings. Whether working with a major regional theatre or an ambitious independent company, I approach each project with curiosity, adaptability, and a deep respect for the story being told.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education - Colorful Cards */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <GraduationCap className="w-4 h-4" />
              EDUCATION
            </h2>
            <h3 className="text-5xl md:text-7xl font-serif mb-20">Academic Foundation</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="group relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-3xl p-12 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="text-3xl text-blue-500 font-pixel mb-4 relative">MFA</div>
                <h4 className="text-4xl font-serif mb-3 relative">University of California, Irvine</h4>
                <p className="text-2xl text-foreground/70 mb-6 relative">Drama [Scenic Design]</p>
                <p className="text-lg text-foreground/60 leading-relaxed relative">
                  Thesis production: <em>Company</em>. Designed five realized productions including <em>American Idiot</em>, <em>Parliament Square</em>, and <em>The Penelopiad</em>.
                </p>
              </div>
              
              <div className="group relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-2 border-purple-500/20 rounded-3xl p-12 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="text-3xl text-purple-500 font-pixel mb-4 relative">BFA</div>
                <h4 className="text-4xl font-serif mb-3 relative">Stephens College</h4>
                <p className="text-2xl text-foreground/70 mb-6 relative">Theatre Arts</p>
                <p className="text-lg text-foreground/60 leading-relaxed relative">
                  Capstone: <em>All My Sons</em>. Received Apprenticeship Scholarship requiring 20+ weekly hours in scene shop, gaining practical training in construction, painting, and technical support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Experience */}
      <section className="container py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel flex items-center gap-3">
            <Briefcase className="w-4 h-4" />
            PROFESSIONAL EXPERIENCE
          </h2>
          <h3 className="text-5xl md:text-7xl font-serif mb-20">Current Roles</h3>
          
          <div className="space-y-8">
            <div className="group backdrop-blur-md bg-card/50 border-2 border-border/50 rounded-3xl p-12 hover:shadow-xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Senior Scenic and Experiential Designer</h4>
                  <p className="text-xl text-foreground/70">Adaptive Design Services</p>
                </div>
                <span className="text-lg text-primary font-pixel mt-4 md:mt-0">2022–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Collaborating on branded events, architectural visualizations, and immersive environments. Bringing theatrical storytelling techniques to experiential design, theme parks, and concept pitches.
              </p>
            </div>
            
            <div className="group backdrop-blur-md bg-card/50 border-2 border-border/50 rounded-3xl p-12 hover:shadow-xl hover:border-accent/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Freelance Scenic Designer</h4>
                  <p className="text-xl text-foreground/70">Regional Theatres Nationwide</p>
                </div>
                <span className="text-lg text-accent font-pixel mt-4 md:mt-0">2012–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                130+ productions designed across major regional theatres. Specializing in musicals, contemporary drama, and large-scale theatrical productions requiring complex technical solutions.
              </p>
            </div>
            
            <div className="group backdrop-blur-md bg-card/50 border-2 border-border/50 rounded-3xl p-12 hover:shadow-xl hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Professor of Scenic Design</h4>
                  <p className="text-xl text-foreground/70">Various Institutions</p>
                </div>
                <span className="text-lg text-blue-500 font-pixel mt-4 md:mt-0">2017–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Teaching one or two courses each year. Passionate about mentoring the next generation of designers and helping others navigate the complex, rewarding path of a creative career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honors */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <Award className="w-4 h-4" />
              HONORS & AFFILIATIONS
            </h2>
            <h3 className="text-5xl md:text-7xl font-serif mb-20">Professional Recognition</h3>
            
            <div className="group relative overflow-hidden backdrop-blur-md bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 rounded-3xl p-16 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-start justify-between relative">
                <div>
                  <h4 className="text-5xl font-serif mb-6">United Scenic Artists, Local USA 829</h4>
                  <p className="text-2xl text-foreground/80 leading-relaxed max-w-4xl">
                    Union member for professional scenic, lighting, and costume designers. Upholding the highest standards of theatrical design and professional practice.
                  </p>
                </div>
                <Award className="w-24 h-24 text-primary/30 hidden lg:block group-hover:rotate-12 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Gallery - MOVED TO BOTTOM */}
      <section className="bg-background py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto mb-16">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Behind the Scenes</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Design is collaborative. These moments capture the partnerships, mentorships, and creative communities that shape my work.
            </p>
          </div>

          {/* Masonry-style Gallery Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Large featured image */}
              <div className="lg:col-span-2 lg:row-span-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl group">
                  <img 
                    src={galleryImages[0].url} 
                    alt={galleryImages[0].alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Smaller images */}
              {galleryImages.slice(1, 5).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-2xl group">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}

              {/* Bottom row */}
              {galleryImages.slice(5).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-2xl group">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
