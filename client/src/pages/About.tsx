import AboutNav from "@/components/AboutNav";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Sparkles } from "lucide-react";

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

      {/* Personal Gallery */}
      <section className="bg-gradient-to-b from-background to-muted/30 py-32">
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
