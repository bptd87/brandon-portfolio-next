import type { CSSProperties, ReactNode } from "react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

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
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const rootStyle = {
    "--background": homeTheme.bg,
    "--foreground": homeTheme.ink,
    "--border": `color-mix(in srgb, ${homeTheme.ink} 16%, transparent)`,
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  return (
    <div
      className="about-profile-light min-h-screen transition-[background-color,color] duration-500"
      style={rootStyle}
    >
      <SEO
        title={`${title} | Brandon PT Davis`}
        description={intro}
        url={canonicalUrl}
      />

      <Header />

      <main>
        <div className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
          <nav
            aria-label="Site information navigation"
            className="sticky top-[72px] z-30 border-b border-border"
            style={{ backgroundColor: "transparent" }}
          >
            <div className="mx-auto flex min-h-16 max-w-[76rem] flex-col items-center justify-center gap-3 px-[clamp(1.5rem,5vw,6rem)] py-3 text-center md:gap-4">
              <Link
                href="/privacy"
                className="text-[clamp(1.55rem,2.4vw,2.2rem)] font-black uppercase leading-none tracking-[0]"
                style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
              >
                Information
              </Link>

              <div className="max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center gap-2">
                  {infoPages.map((item) => {
                    const isCurrent = item.href === currentPath;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex h-10 items-center justify-center rounded-full px-4 text-[0.74rem] font-black uppercase tracking-[0.04em] transition-transform hover:scale-[1.02]"
                        style={{
                          backgroundColor: isCurrent ? homeTheme.controlBg : homeTheme.accentSoft,
                          color: isCurrent ? homeTheme.controlInk : homeTheme.ink,
                        }}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <section className="border-b border-border">
            <div className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-20">
              <div className="mx-auto max-w-4xl text-center">
                <p
                  className="mb-4 text-[0.72rem] font-black uppercase tracking-[0.18em]"
                  style={{ color: homeTheme.muted }}
                >
                  Site Information
                </p>
                <h1
                  className="mx-auto max-w-[12ch] text-[clamp(4.25rem,9vw,8.8rem)] font-black uppercase leading-[0.82] tracking-[0]"
                  style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
                >
                  {title}
                </h1>
                <p
                  className="mx-auto mt-6 max-w-[43rem] text-[clamp(1.06rem,1.35vw,1.22rem)] font-semibold leading-[1.55] tracking-[-0.025em]"
                  style={{ color: homeTheme.muted }}
                >
                  {intro}
                </p>
                {metaLabel ? (
                  <p
                    className="mt-4 text-[0.86rem] font-black uppercase tracking-[0.08em]"
                    style={{ color: homeTheme.muted }}
                  >
                    {metaLabel}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[76rem] px-[clamp(1.5rem,5vw,6rem)] py-14 md:py-16">
            {children}
          </section>
        </div>
      </main>

      <Footer
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
