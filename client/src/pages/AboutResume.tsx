import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Award, Briefcase, Download, GraduationCap } from "lucide-react";

export default function AboutResume() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <AboutNav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-serif mb-6 bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
              Resume / CV
            </h1>
            <p className="text-2xl text-foreground/70 mb-8">
              Education, professional experience, and recognition
            </p>
            <button className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-lg font-medium shadow-lg hover:shadow-xl hover:shadow-primary/30">
              <Download className="w-5 h-5" />
              Download PDF Resume
            </button>
          </div>
        </div>
      </section>

      {/* Education */}
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

      {/* Skills & Tools */}
      <section className="container py-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 font-pixel">TECHNICAL SKILLS</h2>
          <h3 className="text-5xl md:text-7xl font-serif mb-20">Tools & Expertise</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-8">
              <h4 className="text-2xl font-serif mb-6 text-primary">Design Software</h4>
              <ul className="space-y-3 text-lg text-foreground/80">
                <li>• Vectorworks Spotlight</li>
                <li>• AutoCAD</li>
                <li>• SketchUp Pro</li>
                <li>• Twinmotion</li>
                <li>• Adobe Creative Suite</li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-8">
              <h4 className="text-2xl font-serif mb-6 text-accent">Fabrication</h4>
              <ul className="space-y-3 text-lg text-foreground/80">
                <li>• 3D Printing</li>
                <li>• CNC Routing</li>
                <li>• Laser Cutting</li>
                <li>• Model Making</li>
                <li>• Scenic Painting</li>
              </ul>
            </div>

            <div className="backdrop-blur-md bg-card/50 border border-border/50 rounded-2xl p-8">
              <h4 className="text-2xl font-serif mb-6 text-blue-500">Specializations</h4>
              <ul className="space-y-3 text-lg text-foreground/80">
                <li>• Musicals</li>
                <li>• Contemporary Drama</li>
                <li>• Experiential Design</li>
                <li>• Immersive Environments</li>
                <li>• Technical Direction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
