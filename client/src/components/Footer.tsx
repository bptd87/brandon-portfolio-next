"use client";

import { type CSSProperties, type WheelEvent, useEffect, useRef } from "react";
import { Link } from "wouter";

import { useHomeTheme } from "@/lib/homeTheme";

const SOCIAL_LINKS = [
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/brandonptdavisdesign",
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/brandonptdavis",
  },
] as const;

const UTILITY_LINKS = [
  { label: "PRIVACY", href: "/privacy" },
  { label: "TERMS", href: "/terms" },
  { label: "ACCESSIBILITY", href: "/accessibility" },
] as const;

const COPYRIGHT_YEAR = 2026;

export default function Footer({
  backgroundColor,
  className = "",
  displayTextColor,
  textColor,
  variant = "standard",
}: {
  tone?: "dark" | "light";
  backgroundColor?: string;
  className?: string;
  displayTextColor?: string;
  textColor?: string;
  variant?: "immersive" | "reveal" | "standard";
}) {
  const { homeTheme } = useHomeTheme();
  const phantomRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const titleRef = useRef<HTMLAnchorElement | null>(null);
  const resolvedBackgroundColor = backgroundColor || homeTheme.footerBg;
  const resolvedDisplayTextColor = displayTextColor || homeTheme.footerDisplay;
  const resolvedTextColor = textColor || homeTheme.footerInk;

  const handleFooterWheel = (event: WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;

    const homeScrollRoot = document.querySelector<HTMLElement>("[data-home-scroll-root]");
    if (!homeScrollRoot || homeScrollRoot.scrollHeight <= homeScrollRoot.clientHeight) return;

    const previousScrollTop = homeScrollRoot.scrollTop;
    homeScrollRoot.scrollTop += event.deltaY;

    if (homeScrollRoot.scrollTop !== previousScrollTop) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (variant !== "reveal") return undefined;

    const footer = footerRef.current;
    const phantom = phantomRef.current;
    const title = titleRef.current;
    if (!footer || !phantom || !title) return undefined;

    const coverLayers: Array<{
      element: HTMLElement;
      position: string;
      zIndex: string;
    }> = [];

    let coverLayer = phantom.previousElementSibling;
    while (coverLayer) {
      if (coverLayer instanceof HTMLElement) {
        const coverStyle = window.getComputedStyle(coverLayer);
        coverLayers.push({
          element: coverLayer,
          position: coverLayer.style.position,
          zIndex: coverLayer.style.zIndex,
        });
        if (coverStyle.position === "static") coverLayer.style.position = "relative";
        if (coverStyle.zIndex === "auto") coverLayer.style.zIndex = "1";
      }
      coverLayer = coverLayer.previousElementSibling;
    }

    let animationFrame = 0;
    const updateFooterProgress = () => {
      animationFrame = 0;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const scrollbarGutter = homeScrollRoot
        ? Math.max(homeScrollRoot.offsetWidth - homeScrollRoot.clientWidth, 0)
        : 0;
      const phantomViewportTop = phantom.getBoundingClientRect().top;
      const progress = Math.min(
        Math.max((viewportHeight - phantomViewportTop) / viewportHeight, 0),
        1
      );
      const titleBottom = title.offsetTop + title.clientHeight;
      const offsetY = (1 - progress) * Math.max(viewportHeight - titleBottom, 0);

      footer.style.setProperty("--footer-scale-y", progress.toFixed(4));
      footer.style.setProperty("--footer-offset-y", offsetY.toFixed(2));
      footer.style.setProperty("--footer-scrollbar-gutter", `${scrollbarGutter}px`);
      footer.style.visibility = progress > 0 ? "visible" : "hidden";
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateFooterProgress);
    };

    const homeScrollRoot = document.querySelector<HTMLElement>("[data-home-scroll-root]");
    const scrollTargets: Array<Window | HTMLElement> = [window];

    if (homeScrollRoot) scrollTargets.push(homeScrollRoot);

    scrollTargets.forEach(target => {
      target.addEventListener("scroll", requestUpdate, { passive: true });
    });
    window.addEventListener("resize", requestUpdate);

    updateFooterProgress();

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      scrollTargets.forEach(target => target.removeEventListener("scroll", requestUpdate));
      window.removeEventListener("resize", requestUpdate);
      coverLayers.forEach(({ element, position, zIndex }) => {
        element.style.position = position;
        element.style.zIndex = zIndex;
      });
    };
  }, [variant]);

  if (variant !== "reveal") {
    return (
      <footer
        className={`footer relative left-1/2 ml-[-50vw] flex w-screen flex-col items-center justify-end gap-7 overflow-hidden px-6 pb-12 pt-[clamp(7rem,14vw,11rem)] text-center transition-[background-color,color] duration-500 ${
          variant === "immersive"
            ? "min-h-[100dvh]"
            : "min-h-[clamp(24rem,48vw,38rem)]"
        } ${className}`}
        style={{
          backgroundColor: resolvedBackgroundColor,
          color: resolvedTextColor,
          fontFamily:
            '"Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Futura, Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif',
          fontStretch: "condensed",
        }}
      >
        <a
          href="/contact"
          className="m-0 block select-none whitespace-nowrap uppercase no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35"
          aria-label="Open contact form"
          style={{
            color: resolvedDisplayTextColor,
            fontFamily:
              '"Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Futura, Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontSize:
              variant === "immersive"
                ? "clamp(8rem, 26vw, 28rem)"
                : "clamp(5.5rem, 24vw, 23rem)",
            fontWeight: 900,
            fontStretch: "condensed",
            letterSpacing: "-0.012em",
            lineHeight: 0.78,
            textTransform: "uppercase",
          }}
        >
          CONTACT
        </a>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <ul className="m-0 flex list-none flex-col items-center gap-1 p-0">
            <li>
              <a
                href="mailto:brandon@brandonptdavis.com"
                aria-label="Email Brandon PT Davis"
                className="block text-[clamp(0.78rem,1vw,1rem)] font-black uppercase leading-none tracking-[-0.02em] transition-[color,transform] duration-150 hover:scale-y-110 hover:opacity-75"
              >
                BRANDON@BRANDONPTDAVIS.COM
              </a>
            </li>
          </ul>

          <ul
            className="m-0 flex list-none flex-col items-center gap-1 p-0 text-[clamp(0.72rem,0.86vw,0.88rem)] font-black uppercase leading-[0.95] tracking-[-0.015em]"
            aria-label="Footer social links"
          >
            {SOCIAL_LINKS.map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block origin-bottom transition-[color,transform,opacity] duration-150 hover:scale-y-110 hover:opacity-75"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          className="relative z-10 flex max-w-[min(26rem,82vw)] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[0.58rem] font-black uppercase tracking-[0.18em] opacity-76"
          aria-label="Footer utility links"
        >
          {UTILITY_LINKS.map(item => (
            <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </nav>

        <p
          className="relative z-10 text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-70"
          style={{ color: resolvedDisplayTextColor }}
        >
          ALL RIGHTS RESERVED {COPYRIGHT_YEAR} BRANDON PT DAVIS
        </p>
      </footer>
    );
  }

  return (
    <>
      <div
        ref={phantomRef}
        aria-hidden="true"
        className={`intersection-phantom pointer-events-none relative left-1/2 ml-[-50vw] min-h-[100dvh] w-screen ${className}`}
        style={{ backgroundColor: resolvedBackgroundColor }}
      />

      <footer
        ref={footerRef}
        onWheelCapture={handleFooterWheel}
        className={`footer pointer-events-none fixed bottom-0 left-0 z-0 flex min-h-[100dvh] flex-col items-center justify-end gap-8 overflow-hidden px-0 py-16 text-center transition-[background-color,color,opacity] duration-500 ${className}`}
        style={
          {
            backgroundColor: resolvedBackgroundColor,
            color: resolvedTextColor,
            container: "footer / inline-size",
            fontFamily:
              '"Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Futura, Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontStretch: "condensed",
            right: "var(--footer-scrollbar-gutter, 0px)",
            transform: "translateY(calc(var(--footer-offset-y) * 1px))",
            visibility: "hidden",
            "--footer-scale-y": 0,
            "--footer-offset-y": 120,
            "--footer-scrollbar-gutter": "0px",
          } as CSSProperties
        }
      >
        <a
          href="/contact"
          ref={titleRef}
          className="footer__title pointer-events-auto m-0 block select-none whitespace-nowrap uppercase no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/35"
          aria-label="Open contact form"
          style={{
            color: resolvedDisplayTextColor,
            fontFamily:
              '"Futura Now Headline", "Futura Condensed Extra Bold", "Futura Condensed", Futura, Impact, "Arial Narrow", "Arial Black", ui-sans-serif, system-ui, sans-serif',
            fontSize: "clamp(8rem, 26cqi, 28rem)",
            fontWeight: 900,
            fontStretch: "condensed",
            letterSpacing: "-0.012em",
            lineHeight: 0.8,
            marginLeft: "-0.05em",
            textTransform: "uppercase",
            transform: "scaleY(var(--footer-scale-y))",
            transformOrigin: "bottom",
          }}
        >
          <span className="relative top-[-0.1em]">CONTACT</span>
        </a>

        <div className="footer__links pointer-events-auto relative z-10 flex flex-col items-center gap-4 px-6">
          <ul className="footer__links__list m-0 flex list-none flex-col items-center gap-1 p-0">
            <li>
              <a
                href="mailto:brandon@brandonptdavis.com"
                aria-label="Email Brandon PT Davis"
                className="block text-[clamp(0.78rem,1vw,1rem)] font-black uppercase leading-none tracking-[-0.02em] transition-[color,transform] duration-150 hover:scale-y-110 hover:opacity-75"
              >
                BRANDON@BRANDONPTDAVIS.COM
              </a>
            </li>
          </ul>

          <ul
            className="footer__links__list m-0 flex list-none flex-col items-center gap-1 p-0 text-[clamp(0.72rem,0.86vw,0.88rem)] font-black uppercase leading-[0.95] tracking-[-0.015em]"
            aria-label="Footer social links"
          >
            {SOCIAL_LINKS.map(item => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block origin-bottom transition-[color,transform,opacity] duration-150 hover:scale-y-110 hover:opacity-75"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav
          className="pointer-events-auto relative z-10 flex max-w-[min(26rem,82vw)] flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 text-[0.58rem] font-black uppercase tracking-[0.18em] opacity-76"
          aria-label="Footer utility links"
        >
          {UTILITY_LINKS.map(item => (
            <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </nav>

        <p
          className="relative z-10 text-[0.6rem] font-bold uppercase tracking-[0.24em] opacity-70"
          style={{ color: resolvedDisplayTextColor }}
        >
          ALL RIGHTS RESERVED {COPYRIGHT_YEAR} BRANDON PT DAVIS
        </p>
      </footer>
    </>
  );
}
