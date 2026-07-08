"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import { getProjectArtifactCollections } from "@shared/projectArtifacts";

export default function ProjectArtifactsIndex() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const collections = [...getProjectArtifactCollections()].sort((a, b) =>
    a.projectTitle.localeCompare(b.projectTitle)
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const pageStyle = {
    backgroundColor: homeTheme.bg,
    color: homeTheme.ink,
    fontFamily: HOME_BODY_FONT,
  } as CSSProperties;

  return (
    <div className="flex min-h-screen flex-col" style={pageStyle}>
      <SEO
        title="Project Artifacts | Scenic Design Process"
        description="A project-by-project index of scenic design artifacts including research, graphics, sketches, drafting, and paint elevations."
        url="https://www.brandonptdavis.com/projects/artifacts"
      />
      <Header />
      <main className="flex-1 px-[clamp(1.25rem,5vw,6rem)] pb-[clamp(8rem,16vw,14rem)] pt-[clamp(8.5rem,14vw,12rem)]">
        <section className="mx-auto max-w-[62rem] text-center">
          <h1
            className="mx-auto max-w-[9ch] text-[clamp(4.4rem,12vw,11rem)] font-black uppercase leading-[0.78] tracking-[0]"
            style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
          >
            Artifacts
          </h1>
          <p className="mx-auto mt-7 max-w-[44rem] text-[clamp(1.05rem,1.6vw,1.35rem)] leading-8" style={{ color: homeTheme.muted }}>
            Research, graphics, sketches, drafting, paint elevations, and other process documents connected to portfolio projects.
          </p>
        </section>

        <section className="mx-auto mt-[clamp(4rem,8vw,7rem)] flex max-w-[58rem] justify-center">
          <div
            className="flex flex-col items-center text-center"
            onMouseLeave={() => setActiveIndex(null)}
            onPointerLeave={() => setActiveIndex(null)}
          >
          {collections.map((collection, index) => {
            const isActive = index === activeIndex;

            return (
              <Link
                key={collection.slug}
                href={`/projects/artifacts/${collection.slug}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseOver={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className="group py-1 text-center no-underline md:py-2"
                style={{
                  color: activeIndex === null || isActive ? homeTheme.ink : homeTheme.muted,
                }}
              >
                <span
                  className="block text-[clamp(1.8rem,3.8vw,4rem)] font-black uppercase leading-[0.82] tracking-[0.01em] transition-[opacity,transform] duration-300 group-hover:scale-[1.025]"
                  style={{ fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}
                >
                  {collection.projectTitle}
                </span>
                <span
                  className={`mx-auto mt-3 block max-w-[34rem] text-[0.86rem] font-medium leading-[1.3] transition-[max-height,opacity] duration-300 ${
                    isActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ color: homeTheme.muted, fontFamily: HOME_BODY_FONT }}
                >
                  {collection.client} / {collection.year}
                </span>
              </Link>
            );
          })}
          </div>
        </section>
      </main>
      <Footer
        tone="light"
        backgroundColor={homeTheme.footerBg}
        displayTextColor={homeTheme.footerDisplay}
        textColor={homeTheme.footerInk}
      />
    </div>
  );
}
