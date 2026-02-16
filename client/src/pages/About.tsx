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
      href: "/about/philosophy",
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
    <div className="min-h-screen bg-background">
      <SEO
        title="About Brandon PT Davis | Scenic Designer & Educator"
        description="Learn about Brandon PT Davis, a scenic and experiential designer with over 15 years of experience in theatre, themed entertainment, and education."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon Davis scenic designer, USA 829, theatrical designer California, experiential designer, scenic design educator, UC Irvine, regional theatre designer"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: ["Scenic Designer", "Conceptual Artist"],
          url: `${baseUrl}/about`,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description: "Scenic designer and conceptual artist working at the intersection of Art × Technology × Design. Known for dramaturgical approach to scenic design with work at South Coast Repertory and 130+ productions across regional theatre, contemporary drama, and immersive experiences. Member of USA 829.",
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
            "https://getadaptive.com/about-us/",
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
            "Experiential Design",
            "Conceptual Design",
            "Regional Theatre",
            "Contemporary Drama",
            "Dramaturgical Design",
            "Immersive Design",
            "Themed Entertainment",
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
      <section className="container py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[480px_1fr] gap-12 md:gap-16 items-center">
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
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700 delay-200">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/30 mb-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm uppercase tracking-widest text-primary font-bold">Scenic Designer & Artist</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-serif leading-[0.85] mb-8">
                Brandon<br />PT Davis
              </h1>

              <div className="space-y-6">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  Art × Technology × Design
                </p>
                <p className="text-lg text-foreground/80 leading-relaxed max-w-2xl">
                  Scenic designer creating conceptual landscapes where design serves dramatic truth. Recent work includes co-design at South Coast Repertory and a body of work in contemporary and classical theatre across the US.
                </p>
              </div>

              {/* CTA Buttons - Clarified Hierarchy */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/resume"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  <FileText className="w-5 h-5" />
                  View Full Resume
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-muted/50 text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-300 border border-border hover:border-primary/30"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary/5 border-y border-primary/10 py-16">
        <div className="container">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-in fade-in duration-700">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2">130+</div>
              <div className="text-sm uppercase tracking-wider text-foreground/60">Productions Designed</div>
            </div>
            <div className="text-center animate-in fade-in duration-700 delay-100">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2">15</div>
              <div className="text-sm uppercase tracking-wider text-foreground/60">Years Experience</div>
            </div>
            <div className="text-center animate-in fade-in duration-700 delay-200">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2">USA</div>
              <div className="text-sm uppercase tracking-wider text-foreground/60">829 Member</div>
            </div>
            <div className="text-center animate-in fade-in duration-700 delay-300">
              <div className="text-5xl md:text-6xl font-black text-primary mb-2">SCR</div>
              <div className="text-sm uppercase tracking-wider text-foreground/60">Recent Debut</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="container py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-[1fr_400px] gap-16 items-start">
            {/* Left: Text Content */}
            <div className="animate-in fade-in slide-in-from-left duration-700">
              <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">Background & Training</h2>
              
              <div className="space-y-6 text-lg text-foreground/80 leading-relaxed text-justify">
                <p>
                  I'm a scenic designer and artist working at the intersection of craft, technology, and dramatic storytelling. With over 15 years in theatre and immersive design, I've designed more than 130 productions across regional theatre, summer stock, academic theatre, and themed entertainment.
                </p>

                <p>
                  My training includes an <span className="font-medium text-foreground">MFA in Scenic Design from UC Irvine</span> and a <span className="font-medium text-foreground">BFA in Theatre Arts from Stephens College</span>. I'm a proud member of <span className="font-medium text-foreground">United Scenic Artists Local 829</span>, the union representing professional designers across live theatre, film, and television.
                </p>

                <p>
                  Beyond the theatre, I work as a Senior Scenic and Experiential Designer at Adaptive Design Services, translating theatrical storytelling techniques into branded experiences and immersive installations. I also teach scenic design at the university level, mentoring emerging designers through the technical mastery and creative courage required for sustainable artistic careers.
                </p>
              </div>
            </div>

            {/* Right: Milestone Callout */}
            <div className="animate-in fade-in slide-in-from-right duration-700 delay-200">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 border border-primary/20 sticky top-24">
                <div className="text-6xl font-black text-primary/20 mb-4">✦</div>
                <h3 className="text-2xl font-serif mb-4 text-foreground">Recent Milestone</h3>
                <p className="text-foreground/80 leading-relaxed mb-6 text-justify">
                  South Coast Repertory debut as co-scenic designer on <span className="font-medium text-foreground">Million Dollar Quartet</span>—a milestone representing movement toward the kind of regional professional work I'm building toward.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">LORT Theatre</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">Co-Design</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy - Visual Pull Quotes */}
      <section className="bg-gradient-to-b from-muted/30 via-background to-background py-32">
        <div className="container">
          <div className="max-w-6xl mx-auto mb-20">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Design Philosophy</h2>
            <p className="text-xl text-foreground/70">
              What I've learned from designing 130+ productions: design is dramaturg, collaborator, and ghost.
            </p>
          </div>

         {/* Memory & Impression */}
          <div className="max-w-6xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom duration-700">
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              <div className="md:sticky md:top-24">
                <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Project</div>
                <h3 className="text-3xl font-serif text-foreground">The Glass Menagerie</h3>
                <div className="text-sm text-foreground/60 mt-2">Maples Repertory, 2025</div>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-primary/30 pl-8">
                  <blockquote className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed mb-4">
                    "A fluid, impressionistic landscape shaped by recollection. Not a literal apartment, but memory made spatial."
                  </blockquote>
                </div>
                <p className="text-lg text-foreground/70 leading-relaxed text-justify">
                  The design sought to feel unstable and permeable—allowing memory to drift, overlap, and distort. The end result was a <span className="font-medium text-foreground">theatrical memoryscape shaped by absence as much as presence</span>. This is how I approach memory plays: not reconstruction, but impression.
                </p>
              </div>
            </div>
          </div>

          {/* Holding Space */}
          <div className="max-w-6xl mx-auto mb-24 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
              <div className="md:sticky md:top-24">
                <div className="text-sm uppercase tracking-widest text-primary font-bold mb-2">Project</div>
                <h3 className="text-3xl font-serif text-foreground">Romero</h3>
                <div className="text-sm text-foreground/60 mt-2">University of Missouri, 2025</div>
              </div>
              <div className="space-y-6">
                <div className="border-l-4 border-primary/30 pl-8">
                  <blockquote className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed mb-4">
                    "The design had to hold more than history—it had to hold ghosts."
                  </blockquote>
                </div>
                <p className="text-lg text-foreground/70 leading-relaxed text-justify">
                  Set in the final hours of Archbishop Óscar Romero's life, the play bends time and invites the dead to speak. The scenic world emerged from tension between sacredness and rupture. Designing this work meant <span className="font-medium text-foreground">listening, holding space, and letting the silence speak</span>.
                </p>
              </div>
            </div>
          </div>

          {/* Core Philosophy */}
          <div className="max-w-4xl mx-auto animate-in fade-in duration-700 delay-200">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-12 text-center">
              <div className="text-7xl font-black text-primary/20 mb-6">✦</div>
              <blockquote className="text-3xl md:text-4xl font-serif text-foreground mb-8 leading-tight">
                "The strongest scenic work is invisible."
              </blockquote>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto text-justify">
                Whether designing a memory play, a spiritual ritual, or grounded realism, every choice serves the same goal: <span className="font-medium text-foreground">clarity of intent</span>. I've worked across minimalism and conceptual design, using constraint as creative fuel. The play is always the boss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Learn More</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Dive into my process, teaching philosophy, full portfolio of work across theatre and experiential design, and the directors and designers I've had the privilege to collaborate with.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
            {navigationCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link key={card.href} href={card.href}>
                  <div
                    className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer animate-in fade-in slide-in-from-bottom duration-700`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="p-4 rounded-xl bg-background/50 backdrop-blur-sm group-hover:bg-background/70 transition-colors">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-foreground/70 leading-relaxed mb-4">
                          {card.description}
                        </p>
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <span>Learn more</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Personal Gallery */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Art Requires Community</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Design lives in collaboration. These moments capture the partnerships, mentorships, and creative communities that make the work possible. Also: the people who've influenced me most.
            </p>
          </div>

          {/* Masonry-style Gallery Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Large featured image */}
              <div className="lg:col-span-2 lg:row-span-2 animate-in fade-in zoom-in-50 duration-700">
                <div className="relative aspect-square overflow-hidden rounded-2xl group">
                  {/* Skeleton placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
                  <img
                    src={galleryImages[0].url}
                    alt={galleryImages[0].alt}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Smaller images */}
              {galleryImages.slice(1, 5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl group animate-in fade-in zoom-in-50 duration-700"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  {/* Skeleton placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}

              {/* Bottom row */}
              {galleryImages.slice(5).map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-2xl group animate-in fade-in zoom-in-50 duration-700"
                  style={{ animationDelay: `${(index + 5) * 100}ms` }}
                >
                  {/* Skeleton placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
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
