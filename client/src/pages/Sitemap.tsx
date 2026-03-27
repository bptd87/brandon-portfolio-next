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
      { name: "Rendering", href: "/projects/rendering" },
      { name: "Experiential Design", href: "/projects/experiential" },
      { name: "Assistant Scenic Design", href: "/assistant-scenic-design" },
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
    title: "Archive",
    links: [{ name: "News Archive", href: "/news" }],
  },
  {
    title: "Studio",
    links: [
      { name: "Studio Home", href: "/studio" },
      { name: "Articles", href: "/articles" },
      { name: "Tutorials", href: "/studio/tutorials" },
      { name: "Apps", href: "/studio/apps" },
      { name: "Scenic 3D Converter (Mac)", href: "/studio/apps/scenic-3d-converter" },
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
  {
    title: "RSS Feeds",
    links: [
      { name: "Projects RSS", href: "/projects/rss.xml" },
      { name: "Articles RSS", href: "/articles/rss.xml" },
      { name: "News RSS", href: "/news/rss.xml" },
      { name: "Tutorials RSS", href: "/studio/tutorials/rss.xml" },
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
        description="Sitemap for Brandon PT Davis covering scenic design projects, renderings, articles, studio resources, teaching pages, and public site information."
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
            "Complete navigation map of portfolio, assistant scenic design, articles, about, and studio pages.",
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
        intro="A complete navigation map of the current portfolio, studio, archive, and information pages."
        currentPath="/sitemap"
      >
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-white/10 pt-5">
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">
                {section.title}
              </h2>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {section.title === "RSS Feeds" ? (
                      <a
                        href={link.href}
                        className="text-[1rem] leading-[1.65] tracking-[-0.01em] text-white/72 transition-colors hover:text-white"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-[1rem] leading-[1.65] tracking-[-0.01em] text-white/72 transition-colors hover:text-white"
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
