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
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TsVdekRTdTHOgGda.JPG", alt: "Teaching scenic design to students" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sgcZKfoZzxPeTUel.JPG", alt: "UC Irvine graduate school days" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/ZGRhzttUHjtimPXQ.JPG", alt: "Collaborating with mentors" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/fPNAESGBIUQCJmkQ.JPG", alt: "Working with creative teams" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/YgEJZLtqcTqihLMh.JPG", alt: "Creative collaborations" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/EeESHfPspBcRpEaU.JPG", alt: "Family and community" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/JbMFmQRXOBCttcpL.JPG", alt: "Design partnerships" },
    { url: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/GDSJlHzKeThOHVcF.JPG", alt: "Behind the scenes" },
  ];

  const navigationCards = [
    {
      title: "Resume/CV",
      description: "Over 130 realized productions since 2009 across scenic design and assistant scenic design roles",
      icon: FileText,
      href: "/resume",
      color: "from-orange-500/10 to-pink-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      title: "Creative Statement",
      description: "Architecture, history, and narrative storytelling — the foundations of my scenic design philosophy",
      icon: Lightbulb,
      href: "/creative-statement",
      color: "from-purple-500/10 to-pink-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      title: "Teaching Philosophy",
      description: "Equipping students with skills, confidence, and adaptability for today's evolving entertainment industry",
      icon: GraduationCap,
      href: "/about/philosophy",
      color: "from-cyan-500/10 to-blue-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      title: "Collaborators",
      description: "Directors, designers, theatre companies, and creative partners across 130+ productions",
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
          jobTitle: "Scenic and Experiential Designer",
          url: `${baseUrl}/about`,
          image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/jDUthZkmakLJRTiP.jpeg",
          description: "Scenic and experiential designer based in Southern California with over 120 design credits across regional theatre, summer stock, academic theatre, immersive experiences, and live entertainment. Member of USA 829. Educator teaching scenic design, rendering, and collaborative design processes at the university level.",
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
            "Theatrical Design",
            "Regional Theatre",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Event Design",
            "Concept Rendering",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Immersive Design",
            "Themed Entertainment",
            "Scenic Design Education",
          ],
        }}
      />
      <Header />
      <AboutNav />

      {/* Hero Section with Profile Picture */}
      <section className="container py-20 md:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[480px_1fr] gap-12 md:gap-16 items-center">
            {/* Profile Image - Left Side */}
            <div className="relative group animate-in fade-in slide-in-from-left-8 duration-700">
              <div
                className="aspect-[4/5] rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl shadow-primary/10 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-primary/20"
              >
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/jDUthZkmakLJRTiP.jpeg"
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
                <span className="text-sm uppercase tracking-widest text-primary font-bold">Scenic Designer</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-serif leading-[0.85] mb-8">
                Brandon<br />PT Davis
              </h1>

              <p className="text-lg md:text-2xl text-foreground/90 leading-relaxed max-w-2xl">
                Transforming theatrical spaces into <span className="text-primary font-bold">immersive visual landscapes</span> where story and space move together in harmony
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5" />
                  Get in Touch
                </a>
                <a
                  href="/resume"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-muted/50 text-foreground rounded-xl font-semibold hover:bg-muted transition-all duration-300 border border-border hover:border-primary/30"
                >
                  <FileText className="w-5 h-5" />
                  View Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="container py-32">
        <div className="max-w-4xl mx-auto">
          <div className="animate-in fade-in slide-in-from-bottom duration-700">
            <div className="prose prose-xl dark:prose-invert max-w-none space-y-8">
              <p className="text-2xl text-foreground/90 leading-relaxed first-letter:text-7xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                I believe scenic design is a form of storytelling—one that starts before the actors speak and lingers after the final bow. My work lives at the intersection of craft and concept, using physical space to shape emotion, tension, and rhythm.
              </p>

              <p className="text-xl text-foreground/80 leading-relaxed">
                With over 15 years of experience in theatre and immersive environments, I've designed 130+ productions across the country, from intimate black box theatres to grand regional stages. Each project is an opportunity to collaborate with inspiring directors, actors, and technicians—creative partnerships that push the boundaries of what a theatrical space can be.
              </p>

              <p className="text-xl text-foreground/80 leading-relaxed">
                As a proud member of United Scenic Artists Local 829, I bring both rigor and play to every project. My training includes an MFA in Scenic Design from UC Irvine and a BFA in Theatre Arts from Stephens College, where I learned that great design comes from equal parts vision and technical mastery.
              </p>

              <p className="text-xl text-foreground/80 leading-relaxed">
                Beyond the theatre, I work as a Senior Scenic and Experiential Designer at Adaptive Design Services, bringing theatrical storytelling techniques to branded events, theme parks, and immersive installations. I also teach scenic design, mentoring the next generation of designers and helping them navigate the complex, rewarding path of a creative career.
              </p>

              <p className="text-xl text-foreground/80 leading-relaxed">
                Whether I'm designing a musical, a contemporary drama, or an experiential activation, my goal is always the same: to create spaces that feel inevitable—as if the story could only happen here, in this world, at this moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards Section */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-32">
        <div className="container">
          <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom duration-700">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Explore More</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Dive deeper into my work, philosophy, and collaborations across scenic design, education, and creative partnerships.
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
            <h2 className="text-5xl md:text-7xl font-serif mb-6">Behind the Scenes</h2>
            <p className="text-xl text-foreground/70 max-w-3xl">
              Design is collaborative. These moments capture the partnerships, mentorships, and creative communities that shape my work.
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
