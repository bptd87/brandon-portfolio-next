import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Mail, MapPin, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

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
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Work Showcase - 4 FEATURED PROJECTS */}
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

            {/* Large Image Grid - Only 4 projects */}
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
              {projects.slice(0, 4).map((project, index) => (
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

            {/* CTA to see all work */}
            <div className="max-w-7xl mx-auto text-center">
              <Link href="/work">
                <a className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 text-lg font-medium shadow-lg hover:shadow-xl hover:shadow-primary/30">
                  View All Projects
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Philosophy Section - BRIEF */}
      <section className="container py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-12 leading-tight bg-gradient-to-br from-foreground to-primary bg-clip-text text-transparent">
              Design as Storytelling
            </h2>
            <div className="prose prose-xl dark:prose-invert max-w-none space-y-6">
              <p className="text-xl text-foreground/90 leading-relaxed">
                I believe scenic design is a form of storytelling—one that starts before the actors speak and lingers after the final bow. My work lives at the intersection of craft and concept, using physical space to shape emotion, tension, and rhythm.
              </p>
              <p className="text-xl text-foreground/90 leading-relaxed">
                With over 15 years of experience in theatre and immersive environments, I've designed 130+ productions across the country, collaborated with inspiring creatives, and mentored the next generation of designers. As a proud member of United Scenic Artists Local 829, I bring both rigor and play to every project.
              </p>
            </div>

            {/* CTAs to sub-pages */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Link href="/about/resume">
                <a className="group backdrop-blur-md bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-2">
                  <h3 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">Resume / CV</h3>
                  <p className="text-foreground/70 mb-4">Education, experience, and professional recognition</p>
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-sm font-medium">View Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </Link>

              <Link href="/about/teaching">
                <a className="group backdrop-blur-md bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 hover:-translate-y-2">
                  <h3 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors">Teaching Philosophy</h3>
                  <p className="text-foreground/70 mb-4">Mentoring the next generation of designers</p>
                  <div className="flex items-center gap-2 text-accent">
                    <span className="text-sm font-medium">Read More</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </Link>

              <Link href="/about/philosophy">
                <a className="group backdrop-blur-md bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-2 border-blue-500/20 rounded-2xl p-8 hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-2">
                  <h3 className="text-2xl font-serif mb-3 group-hover:text-blue-500 transition-colors">Creative Statement</h3>
                  <p className="text-foreground/70 mb-4">Process, approach, and artistic vision</p>
                  <div className="flex items-center gap-2 text-blue-500">
                    <span className="text-sm font-medium">Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Gallery - AT BOTTOM */}
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
