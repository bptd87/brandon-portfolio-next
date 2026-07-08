"use client";

import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import { PROFILE_ARTICLE_LINKS } from "@shared/publicContent";

const ABOUT_PORTRAIT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
const ABOUT_MODEL_URL =
  "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/files/site-assets/assets/about/3d/brandon-pt-davis-3d-model.glb";
const AboutModelViewer = dynamic(() => import("@/components/AboutModelViewer"), {
  ssr: false,
});

const aboutImages = [
  {
    src: "/images/about/page/about-favorite-08.jpeg",
    alt: "Brandon PT Davis holding a scenic model during a design presentation at South Coast Repertory.",
    caption: "Design presentation at South Coast Rep, fall 2025.",
  },
  {
    src: "/images/about/page/about-favorite-07.jpeg",
    alt: "Brandon PT Davis scenic painting in a shop during winter 2025.",
    caption: "Scenic painting, winter 2025.",
  },
  {
    src: "/images/about/page/about-favorite-06.jpeg",
    alt: "Scenic designers Tom Buderwitz, Brandon PT Davis, and Gretchen Ugalde.",
    caption: "Scenic designers Tom Buderwitz, Brandon PT Davis, and Gretchen Ugalde.",
  },
  {
    src: "/images/about/page/about-favorite-05.jpeg",
    alt: "Brandon PT Davis and Gretchen Ugalde with lighting designer Lonnie Alcaraz.",
    caption: "Brandon and Gretchen with lighting designer Lonnie Alcaraz.",
  },
  {
    src: "/images/about/page/about-favorite-04.jpeg",
    alt: "Brandon PT Davis, Gretchen Ugalde, Katie Cohen, Ruth Ann Burke, and Michael Burke at Okoboji Summer Theatre.",
    caption: "Brandon, Gretchen, Katie Cohen, Ruth Ann Burke, and Michael Burke at Okoboji Summer Theatre.",
  },
  {
    src: "/images/about/page/about-favorite-03.jpeg",
    alt: "Brandon PT Davis and Gretchen Ugalde at Apple Park.",
    caption: "Brandon and Gretchen at Apple Park.",
  },
  {
    src: "/images/about/page/about-favorite-02.jpeg",
    alt: "Brandon PT Davis at Lake Michigan in Chicago in 2012.",
    caption: "Brandon at Lake Michigan in Chicago, 2012.",
  },
  {
    src: "/images/about/page/about-favorite-01.jpeg",
    alt: "Brandon PT Davis with his sister Megan at Christmas in the 1990s, holding cats Silvia and Christina.",
    caption: "Brandon with his sister Megan at Christmas in the 1990s, holding cats Silvia and Christina.",
  },
];

const afterArticleImages = [
  aboutImages[1],
  aboutImages[2],
  aboutImages[3],
  aboutImages[4],
  aboutImages[5],
  aboutImages[6],
  aboutImages[7],
] as const;

const aboutRelatedLinks = [
  { href: "/resume", label: "Resume" },
  { href: "/creative-statement", label: "Creative statement" },
  { href: "/about/teaching", label: "Teaching philosophy" },
  { href: "/projects", label: "Portfolio" },
  { href: "mailto:info@brandonptdavis.com", label: "Email" },
] as const;

const introParagraphs = [
  {
    text: "Brandon PT Davis is a scenic designer whose work explores how space, architecture, and visual storytelling shape the experience of live performance. His designs are grounded in research, collaboration, and the belief that scenery should do more than create a setting—it should reveal character, clarify dramatic action, and give performers a world that evolves with the story. His portfolio spans dramas, comedies, Shakespeare, musicals, and new work for regional theatres, festivals, and universities across the United States.",
  },
] as const;

type AboutStoryBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "statement"; text: string }
  | { kind: "imageFull"; imageIndex: number };

const aboutStoryBlocks: AboutStoryBlock[] = [
  {
    kind: "paragraph",
    text: "Professional collaborations include South Coast Repertory, Maples Repertory Theatre, Theatre SilCo, New Swan Shakespeare Festival, Okoboji Summer Theatre, the University of Missouri, and numerous academic and professional productions. Beyond the stage, Brandon spent several years as a designer and Senior Scenic & Experiential Designer at Adaptive Design Services, where he developed environments for live events, branded experiences, and immersive installations. That work expanded his practice into architectural visualization, digital rendering, fabrication workflows, and large-scale experiential design, perspectives that continue to inform his theatrical work.",
  },
  {
    kind: "paragraph",
    text: "Alongside his professional practice, Brandon is a Lecturer in the School of Theatre, Television, and Film at San Diego State University. He has previously taught at the University of California, Irvine, the University of Texas at El Paso, and Stephens College, mentoring emerging designers in scenic design, rendering, drafting, digital visualization, and collaborative production. His teaching reflects the same values that guide his design work: curiosity, rigorous research, technical precision, and an ongoing commitment to storytelling through space.",
  },
  {
    kind: "imageFull",
    imageIndex: 0,
  },
  {
    kind: "paragraph",
    text: "Brandon received his MFA in Scenic Design from the University of California, Irvine and his BFA in Theatre Arts from Stephens College. He has designed more than 130 productions and assisted on over 40 productions at regional theatres and Off-Broadway. He is a member of United Scenic Artists, Local USA 829, and the United States Institute for Theatre Technology (USITT).",
  },
];

export default function About() {
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);

  return (
    <div
      className="about-profile-light min-h-screen transition-colors duration-500"
      style={
        {
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
        } as CSSProperties
      }
    >
      <SEO
        title="About Brandon PT Davis"
        description="About Brandon PT Davis, a Southern California scenic designer and United Scenic Artists Local 829 member working across theatre, rendering, live events, and experiential design."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, United Scenic Artists Local 829 scenic designer, Southern California scenic designer, scenic design, theatre design, experiential design"
      />

      <Header />
      <AboutNav />

      <ProfileSectionHero
        canonicalPath="/about"
        description="What does it mean to build spaces that tell stories?"
        imageAlt=""
        imageSrc={ABOUT_PORTRAIT_URL}
        showImage={false}
        title="About Brandon PT Davis"
        lightBackgroundColor={homeTheme.bg}
        lightInkColor={homeTheme.ink}
        lightMutedColor={homeTheme.muted}
        titleContent={
          <>
            About
            {" "}
            <br />
            Brandon PT Davis
          </>
        }
        updatedAt="July 5, 2026"
      />

      <main
        className="px-[clamp(1.25rem,5vw,6rem)] pb-20 pt-10 transition-colors duration-500 md:pb-28 md:pt-14"
        style={{ backgroundColor: homeTheme.bg }}
      >
        <article className="mx-auto max-w-[76rem]">
          <div className="grid gap-10 md:grid-cols-[minmax(0,12rem)_minmax(0,1fr)] md:gap-12">
            <aside className="space-y-8 md:self-start md:pt-1">
              <nav
                aria-label="About related links"
                className="flex flex-wrap gap-2 md:flex-col"
                style={{ fontFamily: HOME_DISPLAY_FONT }}
              >
                {aboutRelatedLinks.map(link => (
                  <a
                    key={link.href}
                    className="inline-flex min-h-10 w-fit items-center rounded-full px-4 text-[0.75rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5"
                    href={link.href}
                    style={{
                      backgroundColor: homeTheme.accentSoft,
                      color: homeTheme.muted,
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="pt-24 md:pt-48">
                <AboutModelViewer
                  src={ABOUT_MODEL_URL}
                  downloadName="brandon-pt-davis-3d-model.glb"
                />
              </div>
            </aside>

            <div
              className="space-y-7 text-[1.06rem] font-medium leading-8 tracking-[-0.01em] md:text-[1.16rem] md:leading-9"
              style={{ color: homeTheme.ink }}
            >
              <figure className="my-8 md:float-right md:mb-6 md:ml-10 md:mt-1 md:w-[min(42%,24rem)]">
                <img
                  src={ABOUT_PORTRAIT_URL}
                  alt="Brandon PT Davis"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full rounded-[1.65rem] bg-black/[0.04]"
                />
                <figcaption
                  className="mt-3 text-[0.82rem] font-black uppercase leading-none tracking-[0.04em]"
                  style={{
                    color: homeTheme.muted,
                    fontFamily: HOME_DISPLAY_FONT,
                    fontStretch: "condensed",
                  }}
                >
                  Brandon PT Davis.
                </figcaption>
              </figure>

              {introParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph.text}
                  className={
                    index === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:text-[4.75rem] first-letter:font-black first-letter:uppercase first-letter:leading-[0.78] first-letter:tracking-[0]"
                      : undefined
                  }
                  style={index === 0 ? { fontFamily: HOME_BODY_FONT } : undefined}
                >
                  {paragraph.text}
                </p>
              ))}

              {aboutStoryBlocks.map((block, index) => {
                if (block.kind === "statement") {
                  return (
                    <p
                      key={`${block.kind}-${index}`}
                      className="my-10 max-w-[36rem] text-[clamp(1.7rem,3vw,2.65rem)] font-black uppercase leading-[0.92] tracking-[0]"
                      style={{ color: homeTheme.ink, fontFamily: HOME_DISPLAY_FONT }}
                    >
                      {block.text}
                    </p>
                  );
                }

                if (block.kind === "imageFull") {
                  const image = aboutImages[block.imageIndex];

                  return (
                    <div key={`${block.kind}-${index}`} className="clear-both">
                      <figure className="my-11 w-full">
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full rounded-[1.65rem] bg-black/[0.04]"
                        />
                        <figcaption
                          className="mt-3 text-[0.82rem] font-black uppercase leading-none tracking-[0.04em]"
                          style={{
                            color: homeTheme.muted,
                            fontFamily: HOME_DISPLAY_FONT,
                            fontStretch: "condensed",
                          }}
                        >
                          {image.caption}
                        </figcaption>
                      </figure>
                    </div>
                  );
                }

                return <p key={`${block.kind}-${index}`}>{block.text}</p>;
              })}

              <section
                aria-label="Profiles and related pages"
                className="pt-8 text-[0.98rem] leading-6 tracking-[-0.01em]"
              >
                <div>
                  <h2
                    className="text-[0.82rem] font-black uppercase leading-none tracking-[0.08em]"
                    style={{ color: homeTheme.muted, fontFamily: HOME_DISPLAY_FONT }}
                  >
                    Profiles
                  </h2>
                  <div className="mt-4 space-y-3">
                    {PROFILE_ARTICLE_LINKS.map(profileLink => (
                      <a
                        key={profileLink.href}
                        href={profileLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block font-semibold underline-offset-4 hover:underline"
                        style={{ color: homeTheme.ink }}
                      >
                        {profileLink.title}
                        <ArrowUpRight
                          className="ml-1 inline h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </article>

        <section
          aria-label="About image archive"
          className="mx-auto mt-16 max-w-[53rem] space-y-12 md:mt-20 md:space-y-14"
        >
          {afterArticleImages.map(image => (
            <figure key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full rounded-[1.65rem] bg-black/[0.04]"
              />
              <figcaption
                className="mt-3 text-[0.82rem] font-black uppercase leading-none tracking-[0.04em]"
                style={{
                  color: homeTheme.muted,
                  fontFamily: HOME_DISPLAY_FONT,
                  fontStretch: "condensed",
                }}
              >
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
