"use client";

import { Link } from "wouter";

import InfoPageShell from "@/components/InfoPageShell";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const sections = [
  {
    title: "Portfolio",
    links: [
      { name: "Scenic Design", href: "/projects" },
      { name: "Experiential Design", href: "/projects/experiential" },
      { name: "Rendering", href: "/projects/rendering" },
    ],
  },
  {
    title: "Profile",
    links: [
      { name: "Profile", href: "/about" },
      { name: "Resume", href: "/resume" },
      { name: "Creative Statement", href: "/creative-statement" },
      { name: "Teaching Philosophy", href: "/about/teaching" },
    ],
  },
  {
    title: "Publish & Studio",
    links: [
      { name: "Studio", href: "/studio" },
      { name: "Articles", href: "/articles" },
      { name: "Scenic Directory", href: "/studio/directory" },
      { name: "Studio Apps", href: "/studio/apps" },
    ],
  },
  {
    title: "Studio Tools",
    links: [
      { name: "Scale Calculator", href: "/studio/apps/scale-calculator" },
      { name: "Dimension Reference", href: "/studio/apps/dimension-reference" },
      { name: "Rosco Paint Calculator", href: "/studio/apps/rosco-paint-calculator" },
      { name: "Commercial Paint Matcher", href: "/studio/apps/commercial-paint-matcher" },
      { name: "Design History Timeline", href: "/studio/apps/design-history-timeline" },
      { name: "Scenic 3D Converter", href: "/studio/apps/scenic-3d-converter" },
    ],
  },
  {
    title: "General",
    links: [
      { name: "Home", href: "/" },
      { name: "Contact", href: "/contact" },
      { name: "Search", href: "/search" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Accessibility", href: "/accessibility" },
      { name: "Sitemap", href: "/sitemap" },
    ],
  },
  {
    title: "Feeds & XML Sitemaps",
    links: [
      { name: "XML Sitemap", href: "/sitemap.xml" },
      { name: "Projects RSS", href: "/projects/rss.xml" },
      { name: "Articles RSS", href: "/articles/rss.xml" },
      { name: "Image Sitemap", href: "/image-sitemap.xml" },
      { name: "Video Sitemap", href: "/video-sitemap.xml" },
    ],
  },
];

export default function Sitemap() {
  const allLinks = sections.flatMap((section) => section.links);

  return (
    <>
      <SEO
        title="Sitemap | Brandon PT Davis"
        description="Sitemap for Brandon PT Davis covering scenic design projects, profile pages, published resources, tools, and public site information."
        url="https://www.brandonptdavis.com/sitemap"
      />
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
          description:
            "Complete navigation map of portfolio, profile, publish, and studio tool pages.",
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

      <InfoPageShell
        title="Sitemap"
        intro="A current navigation map of the portfolio, profile, publishing, studio tool, and information pages."
        currentPath="/sitemap"
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[1.75rem] border border-border bg-card p-6 shadow-[0_1rem_3rem_rgba(0,0,0,0.08)]"
            >
              <h2 className="mb-5 font-display text-[clamp(2.3rem,4vw,3.7rem)] font-black uppercase leading-[0.88] tracking-[0] text-foreground">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {section.title === "Feeds & XML Sitemaps" ? (
                      <a
                        href={link.href}
                        className="text-[1rem] font-semibold leading-[1.45] tracking-[-0.02em] text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[1rem] font-semibold leading-[1.45] tracking-[-0.02em] text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </InfoPageShell>
    </>
  );
}
