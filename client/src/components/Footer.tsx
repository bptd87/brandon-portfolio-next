import { Link } from "wouter";
import { Linkedin, Instagram, Youtube, Mail, Theater, Sparkles, Monitor, Box } from "lucide-react";

export default function Footer() {
  const disciplines = [
    {
      name: "Scenic Design",
      slug: "scenic_design",
      description: "Spatial Storytelling & Environments",
      icon: Theater,
    },
    {
      name: "Experiential Design",
      slug: "experiential_design",
      description: "Immersive Brand Activations",
      icon: Sparkles,
    },
    {
      name: "Rendering",
      slug: "rendering",
      description: "Visualization & Concept",
      icon: Monitor,
    },
    {
      name: "Scenic Models",
      slug: "scenic_models",
      description: "Scale Model Archive",
      icon: Box,
    },
  ];

  return (
    <footer className="border-t border-border mt-24">
      {/* Other Portfolios Section */}
      <section className="bg-card/30 backdrop-blur-sm py-16">
        <div className="container">
          <p className="text-xs tracking-widest text-muted-foreground mb-8">EXPLORE MORE</p>
          <h2 className="text-4xl font-['Playfair_Display'] mb-12">Other Portfolios</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplines.map((discipline) => {
              const Icon = discipline.icon;
              return (
                <Link
                  key={discipline.slug}
                  href={`/projects?discipline=${discipline.slug}`}
                  className="glass hover-lift rounded-2xl p-8 transition-smooth group"
                >
                  <Icon className="w-12 h-12 mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-['Playfair_Display'] mb-2">{discipline.name}</h3>
                  <p className="text-sm text-muted-foreground">{discipline.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
            {/* Branding */}
            <div className="lg:col-span-4">
              <h3 className="text-4xl font-['Playfair_Display'] mb-4">
                BRANDON PT<br />DAVIS
              </h3>
              <p className="text-sm text-muted-foreground mb-2">CALIFORNIA, USA</p>
              <p className="text-xs text-muted-foreground">37.09° N, 95.71° W</p>
            </div>

            {/* Selected Work */}
            <div className="lg:col-span-2">
              <h4 className="text-xs tracking-widest text-primary mb-4">SELECTED WORK</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/projects?discipline=scenic_design" className="text-sm hover:text-primary transition-smooth">
                    Scenic Design
                  </Link>
                </li>
                <li>
                  <Link href="/projects?discipline=experiential_design" className="text-sm hover:text-primary transition-smooth">
                    Experiential
                  </Link>
                </li>
                <li>
                  <Link href="/projects?discipline=rendering" className="text-sm hover:text-primary transition-smooth">
                    Rendering
                  </Link>
                </li>
                <li>
                  <Link href="/projects?discipline=scenic_models" className="text-sm hover:text-primary transition-smooth">
                    Scenic Models
                  </Link>
                </li>
              </ul>
            </div>

            {/* Studio */}
            <div className="lg:col-span-3">
              <h4 className="text-xs tracking-widest text-primary mb-4">STUDIO</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/articles" className="text-sm hover:text-primary transition-smooth">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-sm hover:text-primary transition-smooth">
                    The Vault
                  </Link>
                </li>
                <li>
                  <Link href="/studio" className="text-sm hover:text-primary transition-smooth">
                    App Studio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="lg:col-span-3">
              <h4 className="text-xs tracking-widest text-primary mb-4">CONNECT</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-sm hover:text-primary transition-smooth">
                    Start a Project
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm hover:text-primary transition-smooth">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/about#cv" className="text-sm hover:text-primary transition-smooth">
                    CV / Resume
                  </Link>
                </li>
                <li>
                  <Link href="/about#philosophy" className="text-sm hover:text-primary transition-smooth">
                    Philosophy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
            <a
              href="https://www.linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover-lift transition-smooth hover:text-primary"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover-lift transition-smooth hover:text-primary"
              title="Follow on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover-lift transition-smooth hover:text-primary"
              title="Subscribe on YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="mailto:info@brandonptdavis.com"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover-lift transition-smooth hover:text-primary"
              title="Email Me"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} BRANDON PT DAVIS. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="hover:text-primary transition-smooth">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-smooth">
                Terms
              </Link>
              <Link href="/faq" className="hover:text-primary transition-smooth">
                FAQ
              </Link>
              <Link href="/accessibility" className="hover:text-primary transition-smooth">
                Accessibility
              </Link>
              <Link href="/sitemap" className="hover:text-primary transition-smooth">
                Sitemap
              </Link>
              <Link href="/admin" className="hover:text-primary transition-smooth">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
