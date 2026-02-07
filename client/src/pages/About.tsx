import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Briefcase, GraduationCap, Mail, MapPin, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      <section className="container py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Profile */}
          <div className="grid lg:grid-cols-[350px_1fr] gap-16 items-start mb-24">
            {/* Profile Photo */}
            <div className="space-y-6">
              <div className="aspect-square bg-muted rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/naIhLlhRSRfxDbaW.webp" 
                  alt="Brandon PT Davis - Scenic Designer" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Quick Stats */}
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-foreground/80">Southern California, USA</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-primary" />
                  <a href="mailto:info@brandonptdavis.com" className="text-foreground/80 hover:text-primary transition-colors">
                    info@brandonptdavis.com
                  </a>
                </div>
                <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">15+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Years</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">130+</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">Projects</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Bio */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">SCENIC DESIGNER</p>
              <h1 className="text-5xl md:text-7xl font-serif mb-6 leading-tight">Brandon PT Davis</h1>
              <p className="text-2xl text-foreground/70 mb-8 leading-relaxed">
                Transforming theatrical spaces into immersive visual landscapes where story and space move together in harmony
              </p>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-justify mb-6">
                  I believe scenic design is a form of storytelling—one that starts before the actors speak and lingers after the final bow. My work lives at the intersection of craft and concept, using physical space to shape emotion, tension, and rhythm. With over 15 years of experience in theatre and immersive environments, I've designed productions across the country, collaborated with inspiring creatives, and mentored the next generation of designers.
                </p>
                <p className="text-foreground/90 leading-relaxed text-justify mb-6">
                  Based in Southern California, my work is rooted in a lifelong curiosity about how design shapes experience. What began as a high school obsession with set sketches in 2006 has evolved into a professional practice defined by artistic risk-taking, narrative sensitivity, and technical precision.
                </p>
                <p className="text-foreground/90 leading-relaxed text-justify">
                  At the core of my creative philosophy is a deep respect for storytelling: how visual environments can heighten emotion, clarify conflict, and create rhythm across a production. I draw from a wide range of influences—modern architecture, street art, mid-century design, theatrical history, and even pop culture ephemera—allowing each project to find its own unique visual language.
                </p>
              </div>
            </div>
          </div>

          {/* Approach & Philosophy */}
          <div className="mb-24">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel">DESIGN APPROACH</h2>
            <h3 className="text-4xl font-serif mb-12">Craft Meets Concept</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <h4 className="text-xl font-serif mb-4">Analog & Digital Fluency</h4>
                <p className="text-foreground/80 leading-relaxed text-justify">
                  I'm equally fluent in the analog and digital—combining traditional model-making and drafting with advanced workflows in 3D modeling, real-time rendering, and digital fabrication. My design process often includes tools like Vectorworks, Twinmotion, and 3D printing, allowing directors and collaborators to experience spatial ideas in living motion.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <h4 className="text-xl font-serif mb-4">Collaborative Excellence</h4>
                <p className="text-foreground/80 leading-relaxed text-justify">
                  As a proud member of United Scenic Artists Local 829, I bring both rigor and play to the collaborative table, supporting teams with conceptual clarity, high-fidelity renderings, and production-ready technical drawings. Whether working with a major regional theatre or an ambitious independent company, I approach each project with curiosity, adaptability, and a deep respect for the story being told.
                </p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="mb-24">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <GraduationCap className="w-4 h-4" />
              EDUCATION
            </h2>
            <h3 className="text-4xl font-serif mb-12">Academic Foundation</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <div className="text-sm text-primary font-pixel mb-3">MFA</div>
                <h4 className="text-2xl font-serif mb-2">University of California, Irvine</h4>
                <p className="text-lg text-foreground/70 mb-4">Drama [Scenic Design]</p>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Thesis production: <em>Company</em>. Designed five realized productions including <em>American Idiot</em>, <em>Parliament Square</em>, and <em>The Penelopiad</em>.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <div className="text-sm text-primary font-pixel mb-3">BFA</div>
                <h4 className="text-2xl font-serif mb-2">Stephens College</h4>
                <p className="text-lg text-foreground/70 mb-4">Theatre Arts</p>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  Capstone: <em>All My Sons</em>. Received Apprenticeship Scholarship requiring 20+ weekly hours in scene shop, gaining practical training in construction, painting, and technical support.
                </p>
              </div>
            </div>
          </div>

          {/* Professional Experience */}
          <div className="mb-24">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <Briefcase className="w-4 h-4" />
              PROFESSIONAL EXPERIENCE
            </h2>
            <h3 className="text-4xl font-serif mb-12">Current Roles</h3>
            
            <div className="space-y-6">
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-serif mb-2">Senior Scenic and Experiential Designer</h4>
                    <p className="text-lg text-foreground/70">Adaptive Design Services</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-pixel">2022–PRESENT</span>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Collaborating on branded events, architectural visualizations, and immersive environments. Bringing theatrical storytelling techniques to experiential design, theme parks, and concept pitches.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-serif mb-2">Freelance Scenic Designer</h4>
                    <p className="text-lg text-foreground/70">Regional Theatres Nationwide</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-pixel">2012–PRESENT</span>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  130+ productions designed across major regional theatres. Specializing in musicals, contemporary drama, and large-scale theatrical productions requiring complex technical solutions.
                </p>
              </div>
              
              <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-2xl font-serif mb-2">Professor of Scenic Design</h4>
                    <p className="text-lg text-foreground/70">Various Institutions</p>
                  </div>
                  <span className="text-sm text-muted-foreground font-pixel">2017–PRESENT</span>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  Teaching one or two courses each year. Passionate about mentoring the next generation of designers and helping others navigate the complex, rewarding path of a creative career.
                </p>
              </div>
            </div>
          </div>

          {/* Honors & Affiliations */}
          <div>
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-pixel flex items-center gap-3">
              <Award className="w-4 h-4" />
              HONORS & AFFILIATIONS
            </h2>
            <h3 className="text-4xl font-serif mb-12">Professional Recognition</h3>
            
            <div className="backdrop-blur-md bg-card/30 border border-border/50 rounded-xl p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-2xl font-serif mb-2">United Scenic Artists, Local USA 829</h4>
                  <p className="text-foreground/80 leading-relaxed">
                    Union member for professional scenic, lighting, and costume designers. Upholding the highest standards of theatrical design and professional practice.
                  </p>
                </div>
                <Award className="w-12 h-12 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
