import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Sitemap() {
  const sections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", href: "/" },
        { name: "Contact", href: "/contact" },
        { name: "News", href: "/news" },
        { name: "Articles", href: "/articles" },
        { name: "Studio", href: "/studio" },
      ]
    },
    {
      title: "Portfolio",
      links: [
        { name: "All Projects", href: "/projects" },
        { name: "Scenic Design", href: "/projects?discipline=scenic_design" },
        { name: "Experiential Design", href: "/projects?discipline=experiential_design" },
        { name: "Renderings", href: "/projects?discipline=rendering" },
        { name: "Scenic Models", href: "/projects?discipline=scenic_models" },
      ]
    },
    {
      title: "About",
      links: [
        { name: "About Brandon", href: "/about" },
        { name: "Resume / CV", href: "/resume" },
        { name: "Teaching Philosophy", href: "/teaching-philosophy" },
        { name: "Creative Statement", href: "/creative-statement" },
      ]
    },
    {
      title: "Legal & Information",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "FAQ", href: "/faq" },
        { name: "Accessibility", href: "/accessibility" },
        { name: "Sitemap", href: "/sitemap" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-4">Sitemap</h1>
          <p className="text-muted-foreground mb-16">Navigate through all pages on brandonptdavis.com</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-sm font-black tracking-wider text-[#FF5722] mb-6">{section.title.toUpperCase()}</h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        href={link.href}
                        className="text-foreground/80 hover:text-[#FF5722] transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-20 p-8 bg-accent/30 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-foreground/80 mb-6">
              Use the search function or contact us directly for assistance navigating the site.
            </p>
            <a 
              href="/contact" 
              className="inline-block text-sm font-black tracking-wide bg-[#FF5722] text-white px-6 py-3 rounded-full hover:bg-[#FF5722]/90 hover:scale-105 transition-all"
            >
              CONTACT US
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
