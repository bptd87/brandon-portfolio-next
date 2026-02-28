import { Link } from "wouter";
import { Linkedin, Instagram, Youtube, Mail } from "lucide-react";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-32">
      {/* Main Footer - Bold Design */}
      <div className="bg-gradient-to-b from-background to-background/50 py-16 md:py-20">
        <div className="container">
          {/* Top Section - Branding & CTA */}
          <div className="mb-14 pb-14 border-b border-border/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Bold Branding */}
              <div>
                <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-5">
                  BRANDON<br />
                  <span className="text-[#FF5722]">PT</span> DAVIS
                </h2>
                <p className="text-lg text-foreground/70 mb-1">Scenic Designer</p>
                <p className="text-sm text-muted-foreground">USA 829 • California, USA</p>
                <a
                  href="mailto:info@brandonptdavis.com"
                  className="inline-block mt-3 text-xs tracking-[0.16em] uppercase text-muted-foreground hover:text-[#FF5722] transition-colors"
                >
                  info@brandonptdavis.com
                </a>
              </div>

              {/* Right: CTA */}
              <div className="lg:text-right">
                <p className="text-2xl font-bold mb-6 leading-tight max-w-[30ch] lg:max-w-[24ch] lg:ml-auto">
                  Scenic design inquiries for professional productions.
                </p>
                <Link 
                  href="/contact"
                  className="inline-flex items-center justify-center h-11 px-7 rounded-md border border-[#FF5722] bg-[#FF5722] text-[11px] font-bold tracking-[0.14em] uppercase text-white hover:bg-[#ff6a3a] hover:border-[#ff6a3a] transition-all duration-300"
                >
                  CONTACT FOR SCENIC DESIGN
                </Link>
              </div>
            </div>
          </div>

          {/* Middle Section - Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
            {/* Work */}
            <div>
              <h3 className="text-sm font-black tracking-wider text-[#FF5722] mb-6">WORK</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/projects" className="text-foreground/70 hover:text-[#00E5FF] transition-colors font-medium">
                    Scenic Design
                  </Link>
                </li>
                <li>
                  <Link href="/projects/rendering" className="text-foreground/70 hover:text-[#00E5FF] transition-colors font-medium">
                    Rendering
                  </Link>
                </li>
                <li>
                  <Link href="/projects/experiential" className="text-foreground/70 hover:text-[#00E5FF] transition-colors font-medium">
                    Experiential Design
                  </Link>
                </li>
              </ul>
            </div>

            {/* Studio */}
            <div>
              <h3 className="text-sm font-black tracking-wider text-[#9C27B0] mb-6">STUDIO</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/studio/tutorials" className="text-foreground/70 hover:text-[#9C27B0] transition-colors font-medium">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="/studio/apps" className="text-foreground/70 hover:text-[#9C27B0] transition-colors font-medium">
                    App Studio
                  </Link>
                </li>
                <li>
                  <Link href="/studio/directory" className="text-foreground/70 hover:text-[#9C27B0] transition-colors font-medium">
                    Scenic Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* Content */}
            <div>
              <h3 className="text-sm font-black tracking-wider text-[#FF9800] mb-6">CONTENT</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/articles" className="text-foreground/70 hover:text-[#FF9800] transition-colors font-medium">
                    Articles
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-foreground/70 hover:text-[#FF9800] transition-colors font-medium">
                    News
                  </Link>
                </li>
              </ul>
            </div>

            {/* About */}
            <div>
              <h3 className="text-sm font-black tracking-wider text-[#FF1744] mb-6">ABOUT</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-foreground/70 hover:text-[#FF5722] transition-colors font-medium">
                    About Brandon
                  </Link>
                </li>
                <li>
                  <Link href="/resume" className="text-foreground/70 hover:text-[#FF5722] transition-colors font-medium">
                    Resume
                  </Link>
                </li>
                <li>
                  <Link href="/about/teaching" className="text-foreground/70 hover:text-[#FF5722] transition-colors font-medium">
                    Teaching
                  </Link>
                </li>
                <li>
                  <Link href="/creative-statement" className="text-foreground/70 hover:text-[#FF5722] transition-colors font-medium">
                    Creative Statement
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-sm font-black tracking-wider text-[#00E5FF] mb-6">CONNECT</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-foreground/70 hover:text-[#FF1744] transition-colors font-medium">
                    Contact
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:info@brandonptdavis.com"
                    className="text-foreground/70 hover:text-[#FF1744] transition-colors font-medium"
                  >
                    Email
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/brandonptdavis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-[#FF1744] transition-colors font-medium"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/brandonptdavisdesign"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-[#FF1744] transition-colors font-medium"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.pinterest.com/BrandonPTDavis/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 hover:text-[#FF1744] transition-colors font-medium"
                  >
                    Pinterest
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons - Larger & More Prominent */}
          <div className="flex items-center justify-center gap-6 mb-16 pb-16 border-b border-border/30">
            <a
              href="https://www.linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#FF5722]/10 flex items-center justify-center hover:bg-[#FF5722] hover:scale-110 transition-all group"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-[#FF5722] group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.instagram.com/brandonptdavisdesign"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#00E5FF]/10 flex items-center justify-center hover:bg-[#00E5FF] hover:scale-110 transition-all group"
              title="Follow on Instagram"
            >
              <Instagram className="w-6 h-6 text-[#00E5FF] group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.youtube.com/@brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#FF1744]/10 flex items-center justify-center hover:bg-[#FF1744] hover:scale-110 transition-all group"
              title="Subscribe on YouTube"
            >
              <Youtube className="w-6 h-6 text-[#FF1744] group-hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.pinterest.com/BrandonPTDavis/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#E60023]/10 flex items-center justify-center hover:bg-[#E60023] hover:scale-110 transition-all group"
              title="Follow on Pinterest"
            >
              <PinterestIcon className="w-6 h-6 text-[#E60023] group-hover:text-white transition-colors" />
            </a>
            <a
              href="mailto:info@brandonptdavis.com"
              className="w-14 h-14 rounded-full bg-[#9C27B0]/10 flex items-center justify-center hover:bg-[#9C27B0] hover:scale-110 transition-all group"
              title="Email Me"
            >
              <Mail className="w-6 h-6 text-[#9C27B0] group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Bottom Section - Legal & Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} <span className="font-bold text-foreground">BRANDON PT DAVIS</span>. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link href="/privacy" className="text-muted-foreground hover:text-[#FF5722] transition-colors font-medium">
                Privacy
              </Link>
              <span className="text-border">•</span>
              <Link href="/terms" className="text-muted-foreground hover:text-[#00E5FF] transition-colors font-medium">
                Terms
              </Link>
              <span className="text-border">•</span>
              <Link href="/faq" className="text-muted-foreground hover:text-[#FF1744] transition-colors font-medium">
                FAQ
              </Link>
              <span className="text-border">•</span>
              <Link href="/accessibility" className="text-muted-foreground hover:text-[#FF5722] transition-colors font-medium">
                Accessibility
              </Link>
              <span className="text-border">•</span>
              <Link href="/sitemap" className="text-muted-foreground hover:text-[#00E5FF] transition-colors font-medium">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
