import type { ReactNode } from "react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";

const infoPages = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
  { name: "FAQ", href: "/faq" },
  { name: "Accessibility", href: "/accessibility" },
  { name: "Sitemap", href: "/sitemap" },
];

type InfoPageShellProps = {
  title: string;
  intro: string;
  currentPath: string;
  metaLabel?: string;
  children: ReactNode;
};

export default function InfoPageShell({
  title,
  intro,
  currentPath,
  metaLabel,
  children,
}: InfoPageShellProps) {
  const canonicalUrl = `https://www.brandonptdavis.com${currentPath}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${title} | Brandon PT Davis`}
        description={intro}
        url={canonicalUrl}
      />

      <Header />

      <main>
        <section className="border-b border-border">
          <div className="container max-w-[88rem] py-16 md:py-20">
            <div className="max-w-4xl">
              <p className="mb-4 section-kicker text-foreground/42">
                Site Information
              </p>
              <h1 className="max-w-[12ch] font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.07em] text-foreground">
                {title}
              </h1>
              <p className="mt-6 max-w-[43rem] text-[clamp(1rem,1.35vw,1.18rem)] leading-[1.7] tracking-[-0.015em] text-foreground/64">
                {intro}
              </p>
              {metaLabel ? (
                <p className="mt-4 text-[0.94rem] leading-[1.65] tracking-[-0.01em] text-foreground/46">
                  {metaLabel}
                </p>
              ) : null}
              <nav className="mt-8 flex flex-wrap gap-3">
                {infoPages.map((item) => {
                  const isCurrent = item.href === currentPath;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`inline-flex items-center rounded-full border px-4 py-2 text-[0.8rem] font-medium tracking-[-0.01em] transition-colors ${
                        isCurrent
                          ? "border-white/20 bg-white/6 text-foreground"
                          : "border-white/10 text-foreground/58 hover:border-white/18 hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </section>

        <section className="container max-w-[88rem] py-14 md:py-16">{children}</section>
      </main>

      <Footer />
    </div>
  );
}
