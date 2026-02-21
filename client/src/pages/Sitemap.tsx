import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import StructuredData from "@/components/StructuredData";

const infoPages = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap" },
];

const sections = [
  {
    title: "Portfolio",
    links: [
      { name: "Scenic Design", href: "/projects/scenic-design" },
      { name: "Rendering", href: "/projects/rendering" },
      { name: "Experiential Design", href: "/projects/experiential" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "About", href: "/about" },
      { name: "Resume", href: "/resume" },
      { name: "Creative Statement", href: "/creative-statement" },
      { name: "Teaching Philosophy", href: "/about/teaching" },
      { name: "Collaborators", href: "/about/collaborators" },
    ],
  },
  {
    title: "Publishing",
    links: [
      { name: "News", href: "/news" },
      { name: "Articles", href: "/articles" },
    ],
  },
  {
    title: "Studio",
    links: [
      { name: "Studio Home", href: "/studio" },
      { name: "Tutorials", href: "/studio/tutorials" },
      { name: "Apps", href: "/studio/apps" },
      { name: "Scenic Directory", href: "/studio/directory" },
    ],
  },
  {
    title: "General",
    links: [
      { name: "Home", href: "/" },
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Accessibility", href: "/accessibility" },
    ],
  },
];

export default function Sitemap() {
  const allLinks = sections.flatMap((section) => section.links);

  return (
    <div className="min-h-screen bg-background">
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Sitemap", url: "https://www.brandonptdavis.com/sitemap" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Sitemap",
          url: "https://www.brandonptdavis.com/sitemap",
          description: "Complete navigation map of portfolio, about, news, articles, and studio pages.",
          mainEntity: {
            name: "Site Pages",
            itemListElement: allLinks.map((link, index) => ({
              position: index + 1,
              name: link.name,
              url: `https://www.brandonptdavis.com${link.href}`,
            })),
          },
        }}
      />
      <Header />

      <main className="container py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground/60 mb-4">Site Info</p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Sitemap</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Updated navigation map for the current portfolio, studio, and information pages.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {infoPages.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md border text-xs font-semibold tracking-[0.08em] uppercase transition-colors ${
                  item.href === "/sitemap"
                    ? "border-[#FF5722] text-[#FF5722] bg-[#FF5722]/10"
                    : "border-border text-foreground/70 hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, idx) => (
              <section
                key={section.title}
                className="rounded-2xl border border-border/60 bg-card/20 p-6"
                style={{ boxShadow: `inset 0 1px 0 ${["#FF5722", "#00BCD4", "#E91E63", "#FFC107", "#7CFF6B"][idx % 5]}33` }}
              >
                <h2 className="text-sm font-black tracking-[0.16em] uppercase text-foreground mb-4">{section.title}</h2>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-foreground/80 hover:text-[#FF5722] transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
