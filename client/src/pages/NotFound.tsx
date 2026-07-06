"use client";

import { type CSSProperties } from "react";

import AboutModelViewer from "@/components/AboutModelViewer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  useHomeDocumentTheme,
  useHomeTheme,
} from "@/lib/homeTheme";

const notFoundLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Scenic Design" },
  { href: "/studio", label: "Studio" },
  { href: "/search", label: "Search" },
] as const;
const ABOUT_MODEL_URL = "/assets/about/3d/brandon-pt-davis-3d-model.glb";

export default function NotFound() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  const pageStyle = {
    "--background": homeTheme.bg,
    "--border": homeTheme.ghost,
    "--foreground": homeTheme.ink,
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
    fontStretch: "condensed",
  } as CSSProperties;

  return (
    <div className="min-h-screen transition-colors duration-500" style={pageStyle}>
      <SEO
        title="404 | Brandon PT Davis"
        description="The page you’re looking for isn’t available."
        noindex={true}
        nofollow={true}
      />

      <Header />

      <main
        className="relative z-10 px-[clamp(1.25rem,5vw,5rem)]"
        style={{ backgroundColor: homeTheme.bg }}
      >
        <section className="mx-auto grid min-h-[100svh] max-w-[92rem] items-center gap-[clamp(2rem,6vw,6rem)] py-[clamp(6.5rem,10vw,9rem)] lg:grid-cols-[minmax(0,0.86fr)_minmax(16rem,0.54fr)]">
          <div>
            <p
              className="text-[clamp(5rem,17vw,13rem)] font-black uppercase leading-[0.78] tracking-[0]"
              style={displayStyle}
            >
              404
            </p>

            <h1
              className="mt-8 text-[clamp(2.35rem,6vw,5rem)] font-black uppercase leading-[0.86] tracking-[0]"
              style={displayStyle}
            >
              Page not found
            </h1>

            <p
              className="mt-6 max-w-[34rem] text-[clamp(1rem,1.6vw,1.2rem)] leading-8"
              style={{ color: homeTheme.muted }}
            >
              The page you were looking for is not available. Use one of these links to
              keep moving through the site.
            </p>

            <nav
              aria-label="404 navigation"
              className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t pt-6"
              style={{ borderColor: homeTheme.ghost }}
            >
              {notFoundLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[0.92rem] font-black uppercase leading-none underline-offset-4 transition-opacity hover:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35"
                  style={{
                    color: homeTheme.ink,
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mx-auto w-full max-w-[min(18rem,68vw)] lg:max-w-[24rem]">
            <AboutModelViewer
              src={ABOUT_MODEL_URL}
              downloadName="brandon-pt-davis-3d-model.glb"
              className="pt-0"
              showCaption={false}
              showOnMobile={true}
            />
          </div>
        </section>
      </main>

      <Footer
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
        variant="standard"
      />
    </div>
  );
}
