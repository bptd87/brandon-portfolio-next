import { ExternalLink, Instagram, Linkedin, Mail, Youtube } from "lucide-react";
import { Link } from "wouter";

const FOOTER_SECTIONS = [
  {
    title: "Portfolio",
    accent: "#FF6A3D",
    links: [
      { label: "Scenic Design", href: "/projects", internal: true },
      { label: "Experiential", href: "/projects/experiential", internal: true },
      { label: "Rendering", href: "/projects/rendering", internal: true },
      { label: "Assistant Scenic Design", href: "/assistant-scenic-design", internal: true },
    ],
  },
  {
    title: "Studio",
    accent: "#00B8D9",
    links: [
      { label: "Articles", href: "/articles", internal: true },
      { label: "Tutorials", href: "/studio/tutorials", internal: true },
      { label: "App Studio", href: "/studio/apps", internal: true },
      { label: "Scenic Directory", href: "/studio/directory", internal: true },
    ],
  },
  {
    title: "Information",
    accent: "#E5484D",
    links: [
      { label: "About", href: "/about", internal: true },
      { label: "Resume", href: "/resume", internal: true },
      { label: "Contact", href: "/contact", internal: true },
      { label: "News Archive", href: "/news", internal: true },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brandonptdavis",
    icon: Linkedin,
    accent: "#FF6A3D",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/brandonptdavisdesign",
    icon: Instagram,
    accent: "#00B8D9",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@brandonptdavis",
    icon: Youtube,
    accent: "#E5484D",
  },
  {
    label: "Email",
    href: "mailto:info@brandonptdavis.com",
    icon: Mail,
    accent: "#D9A404",
  },
] as const;

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      <div className="container py-14 md:py-18">
        <div className="grid gap-12 border-b border-border/40 pb-12 md:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] md:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/50">
              Brandon PT Davis
            </p>
            <h2 className="max-w-[13ch] text-3xl font-semibold leading-[0.96] tracking-[-0.05em] text-foreground md:text-5xl">
              Scenic design practice for live performance.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Southern California based. USA 829. Portfolio, studio resources, articles, and
              supporting design documentation in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/12 bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Contact
            </Link>
            <a
              href="mailto:info@brandonptdavis.com"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/12 bg-background/55 px-5 py-3 text-sm font-semibold text-foreground/78 transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              Email
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="h-1.5 w-8 rounded-full"
                    style={{ backgroundColor: section.accent }}
                  />
                  <h3 className="text-sm font-semibold tracking-[-0.02em] text-foreground">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {section.links.map((item) => (
                    <li key={item.href}>
                      {item.internal ? (
                        <Link
                          href={item.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="space-y-5 md:min-w-[16rem]">
            <div>
              <p className="text-sm font-semibold tracking-[-0.02em] text-foreground">Connect</p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Follow current work, studio updates, and professional contact points.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/50 transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ color: item.accent }}
                    title={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              <a
                href="https://www.pinterest.com/BrandonPTDavis/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-background/50 transition-transform duration-300 hover:-translate-y-0.5"
                style={{ color: "#2C9B62" }}
                title="Pinterest"
              >
                <PinterestIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border/40 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Brandon PT Davis. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <Link href="/accessibility" className="transition-colors hover:text-foreground">
              Accessibility
            </Link>
            <Link href="/sitemap" className="transition-colors hover:text-foreground">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
