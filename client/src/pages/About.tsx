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

      {/* Bio Section */}
      <section className="container py-32 border-b border-border/30">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-12">Who I Am</h2>
            
            <div className="space-y-6 text-lg text-foreground/80 leading-relaxed">
              <p>
                I'm a scenic designer and artist working at the intersection of craft, technology, and dramatic storytelling. With over 15 years in theatre and immersive design, I've designed more than 130 productions across regional theatre, summer stock, academic theatre, and themed entertainment.
              </p>

              <p>
                I'm a proud member of United Scenic Artists Local 829, which represents professional designers across live theatre, film, and television. My training includes an MFA in Scenic Design from UC Irvine and a BFA in Theatre Arts from Stephens College. Beyond the theatre, I work as a Senior Scenic and Experiential Designer at Adaptive Design Services, translating theatrical storytelling techniques into branded experiences and immersive installations.
              </p>

              <p>
                I teach scenic design at the university level, mentoring the next generation of designers and helping them navigate both the technical mastery and creative courage required for a sustainable career in the arts.
              </p>

              <p>
                My work has taken me across the US to regional theatres, university programs, summer stock, and experiential companies. Recently, I made my South Coast Repertory debut as co-scenic designer on Million Dollar Quartet—a milestone that represents moving toward the kind of artistic work I aspire to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Artistic Approach Section */}
      <section className="container py-32">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-12">How I Work</h2>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-primary">Memory & Impression</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  The Glass Menagerie was built around a single architectural idea: <span className="font-medium">a fluid, impressionistic landscape shaped by Tom's recollection</span>. Not a literal apartment, but memory made spatial. The design sought to feel unstable and permeable—allowing memory to drift, overlap, and distort. The end result was <span className="font-medium">a theatrical memoryscape shaped by absence as much as presence</span>.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-primary">Holding Space for Transformation</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  When I first read Xiomara Cornejo's Romero, I knew the design had to hold more than history—it had to <span className="font-medium">hold ghosts</span>. Set in the final hours of Archbishop Óscar Romero's life, the play bends time and invites the dead to speak. The scenic world emerged from tension between sacredness and rupture. Designing Romero meant <span className="font-medium">listening, holding space, and letting the silence speak</span>.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-primary">Disappearing into Story</h3>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  The strongest scenic work is invisible. By committing fully to realism, a set can create a stable, believable world in which the play's humor, relationships, and undertones unfold organically. <span className="font-medium">The scenic design aims to disappear into the storytelling</span>, allowing performance and text to drive the experience.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="text-lg text-foreground/80 leading-relaxed">
                  Whether designing a memory play, a spiritual ritual, or a grounded domestic realism, every choice serves the same goal: <span className="font-medium">clarity of intent</span>. I've worked across minimalism and conceptual design, using constraint as creative fuel. With my South Coast Repertory debut on Million Dollar Quartet, I'm exploring how scenic design captures not just place, but the transformative moment when artists create something that matters.
                </p>
              </div>
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
