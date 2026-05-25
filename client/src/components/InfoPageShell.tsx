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
    <div className="about-profile-light min-h-screen bg-white text-[#111111] [--background:#ffffff] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title={`${title} | Brandon PT Davis`}
        description={intro}
        url={canonicalUrl}
      />

      <Header />

      <main>
        <nav
          aria-label="Site information navigation"
          className="sticky top-[72px] z-30 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl"
        >
          <div className="mx-auto flex min-h-16 max-w-[76rem] flex-col gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 md:flex-row md:items-center md:justify-between md:gap-8">
            <Link
              href="/privacy"
              className="text-[1.35rem] font-semibold leading-none tracking-[-0.045em] text-[#111111]"
            >
              Information
            </Link>

            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max items-center gap-6 md:gap-8">
                {infoPages.map((item) => {
                  const isCurrent = item.href === currentPath;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-[0.95rem] tracking-[-0.025em] transition-colors ${
                        isCurrent ? "text-[#111111]" : "text-[#777169] hover:text-[#111111]"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        <section className="border-b border-black/10">
          <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
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
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-16">
          {children}
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
