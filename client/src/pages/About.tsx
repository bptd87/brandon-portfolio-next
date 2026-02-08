import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Briefcase, GraduationCap, Mail, MapPin } from "lucide-react";

export default function About() {
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

      {/* Hero Section - Full Width with Large Typography */}
      <section className="relative overflow-hidden">
        <div className="container py-32">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6 font-pixel">SCENIC DESIGNER</p>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif mb-8 leading-[0.9]">
              Brandon<br />PT Davis
            </h1>
            <p className="text-3xl md:text-4xl text-foreground/70 max-w-4xl leading-relaxed mb-12">
              Transforming theatrical spaces into immersive visual landscapes where story and space move together in harmony
            </p>
            
            {/* Quick Stats - Redesigned */}
            <div className="flex flex-wrap gap-12 mb-16">
              <div>
                <div className="text-6xl font-serif text-primary mb-2">15+</div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">Years Experience</div>
              </div>
              <div>
                <div className="text-6xl font-serif text-primary mb-2">130+</div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">Productions Designed</div>
              </div>
              <div>
                <div className="text-6xl font-serif text-primary mb-2">USA 829</div>
                <div className="text-sm uppercase tracking-widest text-muted-foreground">United Scenic Artists</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-8 text-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-foreground/80">Southern California</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@brandonptdavis.com" className="text-foreground/80 hover:text-primary transition-colors">
                  info@brandonptdavis.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Gallery Section - Bold & Art-Based */}
      <section className="bg-muted/30 py-24">
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
                <div key={index} className="aspect-square overflow-hidden rounded-2xl group">
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
                <div key={index} className="aspect-square overflow-hidden rounded-2xl group relative">
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

      {/* Philosophy Section - Large Typography */}
      <section className="container py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight">
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

            <div className="space-y-12">
              <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-10">
                <h3 className="text-3xl font-serif mb-6">Analog & Digital Fluency</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  I'm equally fluent in the analog and digital—combining traditional model-making and drafting with advanced workflows in 3D modeling, real-time rendering, and digital fabrication. My design process often includes tools like Vectorworks, Twinmotion, and 3D printing, allowing directors and collaborators to experience spatial ideas in living motion.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-10">
                <h3 className="text-3xl font-serif mb-6">Collaborative Excellence</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  As a proud member of United Scenic Artists Local 829, I bring both rigor and play to the collaborative table, supporting teams with conceptual clarity, high-fidelity renderings, and production-ready technical drawings. Whether working with a major regional theatre or an ambitious independent company, I approach each project with curiosity, adaptability, and a deep respect for the story being told.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education - Bold Layout */}
      <section className="bg-muted/30 py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <GraduationCap className="w-4 h-4" />
              EDUCATION
            </h2>
            <h3 className="text-5xl md:text-7xl font-serif mb-20">Academic Foundation</h3>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
                <div className="text-2xl text-primary font-pixel mb-4">MFA</div>
                <h4 className="text-4xl font-serif mb-3">University of California, Irvine</h4>
                <p className="text-2xl text-foreground/70 mb-6">Drama [Scenic Design]</p>
                <p className="text-lg text-foreground/60 leading-relaxed">
                  Thesis production: <em>Company</em>. Designed five realized productions including <em>American Idiot</em>, <em>Parliament Square</em>, and <em>The Penelopiad</em>.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
                <div className="text-2xl text-primary font-pixel mb-4">BFA</div>
                <h4 className="text-4xl font-serif mb-3">Stephens College</h4>
                <p className="text-2xl text-foreground/70 mb-6">Theatre Arts</p>
                <p className="text-lg text-foreground/60 leading-relaxed">
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
            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Senior Scenic and Experiential Designer</h4>
                  <p className="text-xl text-foreground/70">Adaptive Design Services</p>
                </div>
                <span className="text-lg text-muted-foreground font-pixel mt-4 md:mt-0">2022–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Collaborating on branded events, architectural visualizations, and immersive environments. Bringing theatrical storytelling techniques to experiential design, theme parks, and concept pitches.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Freelance Scenic Designer</h4>
                  <p className="text-xl text-foreground/70">Regional Theatres Nationwide</p>
                </div>
                <span className="text-lg text-muted-foreground font-pixel mt-4 md:mt-0">2012–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                130+ productions designed across major regional theatres. Specializing in musicals, contemporary drama, and large-scale theatrical productions requiring complex technical solutions.
              </p>
            </div>
            
            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div>
                  <h4 className="text-3xl font-serif mb-3">Professor of Scenic Design</h4>
                  <p className="text-xl text-foreground/70">Various Institutions</p>
                </div>
                <span className="text-lg text-muted-foreground font-pixel mt-4 md:mt-0">2017–PRESENT</span>
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Teaching one or two courses each year. Passionate about mentoring the next generation of designers and helping others navigate the complex, rewarding path of a creative career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honors & Affiliations */}
      <section className="bg-muted/30 py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <Award className="w-4 h-4" />
              HONORS & AFFILIATIONS
            </h2>
            <h3 className="text-5xl md:text-7xl font-serif mb-20">Professional Recognition</h3>
            
            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-12">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-4xl font-serif mb-4">United Scenic Artists, Local USA 829</h4>
                  <p className="text-xl text-foreground/80 leading-relaxed max-w-4xl">
                    Union member for professional scenic, lighting, and costume designers. Upholding the highest standards of theatrical design and professional practice.
                  </p>
                </div>
                <Award className="w-16 h-16 text-primary/30 hidden lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
