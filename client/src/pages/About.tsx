import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Sparkles, FileText, Lightbulb, GraduationCap, Users, ArrowRight, Briefcase, Award, Linkedin } from "lucide-react";
import StructuredData from "@/components/StructuredData";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { useState, useEffect } from "react";

export default function About() {
  const [scrollY, setScrollY] = useState(0);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.brandonptdavis.com';

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const galleryImages = [
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teaching.webp", alt: "Teaching scenic design to students" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-uci.webp", alt: "UC Irvine graduate school days" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-mentors.webp", alt: "Collaborating with mentors" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teams.webp", alt: "Working with creative teams" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-collaborations.webp", alt: "Creative collaborations" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-family.webp", alt: "Family and community" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-partnerships.webp", alt: "Design partnerships" },
    { url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-behind-scenes.webp", alt: "Behind the scenes" },
  ];

  const navigationCards = [
    {
      title: "Process & Philosophy",
      description: "How I approach design: from dramaturgical research to final realization. Why clarity and intention matter.",
      icon: Lightbulb,
      href: "/creative-statement",
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Full Portfolio & Credits",
      description: "Resume, credits across 130+ productions, and work in theatre, experiential design, and immersive environments.",
      icon: FileText,
      href: "/resume",
      color: "from-orange-500/10 to-pink-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Teaching & Mentorship",
      description: "Perspectives on scenic design education, helping designers navigate craft, career, and artistic integrity.",
      icon: GraduationCap,
      href: "/about/teaching",
      color: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      title: "Collaborators & Directors",
      description: "Directors, designers, theatre companies, and creative partners across 130+ productions. Some relationships span decades.",
      icon: Users,
      href: "/about/collaborators",
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background [background-image:radial-gradient(circle_at_12%_8%,rgba(255,87,34,0.10),transparent_34%),radial-gradient(circle_at_88%_16%,rgba(0,188,212,0.09),transparent_34%)]">
      <SEO
        title="About Brandon PT Davis | Scenic Designer & Educator"
        description="Southern California scenic designer with 130+ production credits across regional theatre, summer stock, and education. USA 829 member based in Orange County."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, USA 829 scenic designer, scenic designer California, Orange County scenic designer, scenic design educator, UC Irvine, regional theatre scenic design"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: `${baseUrl}/about`,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description: "Scenic designer and conceptual artist known for a dramaturgical approach to stage space, with work at South Coast Repertory and 130+ productions across regional theatre, contemporary drama, and classical repertoire. Member of USA 829.",
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
            "Conceptual Design",
            "Regional Theatre",
            "Contemporary Drama",
            "Dramaturgical Design",
            "Design Mentorship",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Scenic Design Education",
          ],
        }}
      />
      <Header />
      <AboutNav />

      {/* Hero Section - Credibility First */}
      <section className="container py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-10 md:gap-14 items-center">
            {/* Profile Image - Left Side */}
            <div className="relative group animate-in fade-in slide-in-from-left-8 duration-700">
              <div
                className="aspect-[4/5] rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/10 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/20"
              >
                <img
                  src="https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/profile-headshot.webp"
                  alt="Brandon PT Davis - Scenic Designer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              {/* Enhanced decorative elements with parallax */}
              <div
                className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"
                style={{ transform: `translateY(${scrollY * 0.1}px)` }}
              ></div>
              <div
                className="absolute -top-8 -left-8 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10"
                style={{ transform: `translateY(${scrollY * 0.2}px)` }}
              ></div>
            </div>

            {/* Text Content - Right Side */}
            <div className="space-y-7 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">
                Union Scenic Designer
              </p>

              <h1 className="text-6xl md:text-8xl font-serif leading-[0.88] mb-6 tracking-tight">
                Brandon<br />PT Davis
              </h1>

              <div className="space-y-5">
                <p className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
                  Art × Technology × Design
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed max-w-xl">
                  Union scenic designer creating conceptual landscapes where design serves dramatic truth. Recent work includes co-design at South Coast Repertory and a body of work in contemporary and classical theatre across the US.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Union</p>
                  <p className="text-sm font-semibold">USA 829</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Training</p>
                  <p className="text-sm font-semibold">MFA Scenic Design</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Credits</p>
                  <p className="text-sm font-semibold">130+ Productions</p>
                </div>
              </div>

              {/* CTA Buttons - Clarified Hierarchy */}
              <div className="flex flex-col sm:flex-row gap-4 pt-3">
                <a
                  href="/resume"
                  className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-md border border-[#FF5722] bg-[#FF5722] text-[11px] font-bold tracking-[0.14em] uppercase text-white hover:bg-[#ff6a3a] hover:border-[#ff6a3a] transition-all duration-300"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 h-11 px-7 rounded-md border border-border text-[11px] font-bold tracking-[0.14em] uppercase text-foreground hover:border-[#FF5722] hover:text-[#FF5722] transition-all duration-300"
                >
                  <Mail className="w-4 h-4" />
                  Professional Inquiries
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="container py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_360px] gap-12 items-start">
            {/* Left: Text Content */}
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight tracking-tight">Background & Training</h2>
              
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed text-justify">
                <p>
                  I'm a scenic designer and artist working at the intersection of craft, technology, and dramatic storytelling. With over 15 years in theatre, I've designed more than 130 productions across regional theatre, summer stock, academic theatre, and classical work.
                </p>

                <p>
                  My training includes an <span className="font-medium text-foreground">MFA in Scenic Design from UC Irvine</span> and a <span className="font-medium text-foreground">BFA in Theatre Arts from Stephens College</span>. I'm a proud member of <span className="font-medium text-foreground">United Scenic Artists Local 829</span>, the union representing professional designers across live theatre, film, and television.
                </p>

                <p>
                  Beyond traditional stage work, I collaborate on installation-based environments where theatrical storytelling informs audience experience. I also teach scenic design at the university level, mentoring emerging designers in craft, process, and visual storytelling.
                </p>
              </div>
            </div>

            {/* Right: Milestones */}
            <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="sticky top-24">
                <h3 className="text-2xl font-serif mb-4 text-foreground">Recent Milestones</h3>
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/50 bg-card/30 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">2025</p>
                    <p className="text-foreground/85 leading-relaxed">
                      South Coast Repertory debut as co-scenic designer on <span className="font-medium text-foreground">Million Dollar Quartet</span>.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card/30 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">2025</p>
                    <p className="text-foreground/85 leading-relaxed">
                      Designed <span className="font-medium text-foreground">Romero</span> at the University of Missouri, shaping a spiritual and political memory play through scenography.
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-card/30 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-primary font-semibold mb-1">2025</p>
                    <p className="text-foreground/85 leading-relaxed">
                      Continued dual-track practice in regional theatre and experiential work while mentoring emerging designers in university classrooms.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy - Visual Pull Quotes */}
      <section className="py-24 border-y border-border/40 bg-card/10">
        <div className="container">
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">Design Philosophy</h2>
            <p className="text-xl text-foreground/70">
              What I've learned from designing 130+ productions: design is dramaturg, collaborator, and ghost.
            </p>
          </div>

         {/* Memory & Impression */}
          <div className="max-w-6xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              <div className="md:sticky md:top-24">
                <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Project</div>
                <h3 className="text-3xl font-serif text-foreground">The Glass Menagerie</h3>
                <div className="text-sm text-foreground/60 mt-2">Maples Repertory, 2025</div>
              </div>
              <div className="space-y-6">
                <blockquote className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed mb-4">
                  "A fluid, impressionistic landscape shaped by recollection. Not a literal apartment, but memory made spatial."
                </blockquote>
                <p className="text-lg text-foreground/70 leading-relaxed text-justify">
                  The design sought to feel unstable and permeable—allowing memory to drift, overlap, and distort. The end result was a <span className="font-medium text-foreground">theatrical memoryscape shaped by absence as much as presence</span>. This is how I approach memory plays: not reconstruction, but impression.
                </p>
              </div>
            </div>
          </div>

          {/* Holding Space */}
          <div className="max-w-6xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              <div className="md:sticky md:top-24">
                <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Project</div>
                <h3 className="text-3xl font-serif text-foreground">Romero</h3>
                <div className="text-sm text-foreground/60 mt-2">University of Missouri, 2025</div>
              </div>
              <div className="space-y-6">
                <blockquote className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed mb-4">
                  "The design had to hold more than history—it had to hold ghosts."
                </blockquote>
                <p className="text-lg text-foreground/70 leading-relaxed text-justify">
                  Set in the final hours of Archbishop Óscar Romero's life, the play bends time and invites the dead to speak. The scenic world emerged from tension between sacredness and rupture. Designing this work meant <span className="font-medium text-foreground">listening, holding space, and letting the silence speak</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Dramaturgy & Rhythm */}
          <div className="max-w-6xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              <div className="md:sticky md:top-24">
                <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Project</div>
                <h3 className="text-3xl font-serif text-foreground">Guys on Ice</h3>
                <div className="text-sm text-foreground/60 mt-2">The Great American Melodrama, 2025</div>
              </div>
              <div className="space-y-6">
                <blockquote className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed mb-4">
                  "Comedy works when the environment is precise: architecture sets the rhythm before the actors land the joke."
                </blockquote>
                <p className="text-lg text-foreground/70 leading-relaxed text-justify">
                  This design balanced regional texture with sharp theatrical timing. Material choices and spatial framing supported fast transitions and sightline clarity, proving that <span className="font-medium text-foreground">form and comedic pacing can reinforce each other</span> without sacrificing craft.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Manifesto Quote */}
      <section className="py-24 border-y border-border/40 bg-[linear-gradient(180deg,rgba(255,87,34,0.08)_0%,rgba(11,11,13,0.94)_45%,rgba(11,11,13,1)_100%)]">
        <div className="container">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/60 mb-5">Manifesto</p>
            <blockquote className="text-4xl md:text-6xl font-serif text-white mb-10 leading-[1.05] tracking-tight">
              “The strongest scenic work is invisible.”
            </blockquote>
            <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed">
              Whether designing a memory play, a spiritual ritual, or grounded realism, every choice serves the same goal: <span className="text-white font-medium">clarity of intent</span>. I&apos;ve worked across minimalism and conceptual design, using constraint as creative fuel. The play is always the boss.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="py-24 border-b border-border/40">
        <div className="container">
          <div className="max-w-6xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">Learn More</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Dive into my process, teaching philosophy, full portfolio of work across theatre and experiential design, and the directors and designers I've had the privilege to collaborate with.
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-6">
            {navigationCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href}>
                  <div
                    className="flex items-start gap-4 pb-5 border-b border-border/40 hover:border-primary/50 transition-colors cursor-pointer animate-in fade-in slide-in-from-bottom duration-700"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <Icon className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="text-2xl font-serif mb-2 hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary mt-1.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visual Rhythm */}
      <section className="py-24 border-y border-border/40 bg-card/10">
        <div className="container">
          <div className="max-w-6xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight">Art Requires Community</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Design lives in collaboration. These moments mark mentorship, rehearsal rooms, and creative partnerships that shape the work.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryImages.slice(0, 4).map((image, index) => (
                <div key={index} className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-border/50">
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
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
