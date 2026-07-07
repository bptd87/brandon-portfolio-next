"use client";

import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import AboutNav from "@/components/AboutNav";
import AboutModelViewer from "@/components/AboutModelViewer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
import { PROFILE_ARTICLE_LINKS } from "@shared/publicContent";

const ABOUT_PORTRAIT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
const ABOUT_MODEL_URL = "/assets/about/3d/brandon-pt-davis-3d-model.glb";

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
] as const;

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
    text: "Brandon PT Davis is a scenic designer interested in how spaces tell stories.",
  },
  {
    text: "His work is grounded in research, dramaturgy, collaboration, and a practical understanding of how scenery supports the people who use it: actors, directors, technicians, and audiences. Rather than treating a set as a backdrop, Brandon approaches each design as a working environment—something that shapes movement, frames attention, and helps clarify the emotional life of a production.",
  },
] as const;

const aboutStoryBlocks = [
  {
    kind: "paragraph",
    text: "I try not to arrive. The useful work usually starts somewhere past certainty, a little further out than feels comfortable.",
  },
  {
    kind: "paragraph",
    text: "That balance between clarity and uncertainty has shaped a career that has rarely moved in a straight line. Brandon grew up in Columbia, Missouri, a college town where the arts were part of the surrounding culture. His mother was involved in community theatre, and he was around rehearsals and performances early enough that theatre felt like a natural part of everyday life.",
  },
  {
    kind: "paragraph",
    text: "At Stephens College, where he attended on an apprenticeship scholarship, Brandon immersed himself in hands-on production work while studying the fundamentals of scenic design. After graduating, he spent several years moving between Kansas City, Chicago, and New York, building experience and trying to find his footing professionally. In 2016, he moved to California to work at The Great American Melodrama on the Central Coast, an experience that became a turning point and eventually led him to pursue his Master of Fine Arts in scenic design at the University of California, Irvine.",
  },
  {
    kind: "paragraph",
    text: "Graduate school gave Brandon the space to clarify his design voice while exploring both traditional scenic practice and emerging digital workflows. After completing his degree, he returned to the Midwest during the pandemic years and later joined the faculty at Stephens College, where he taught scenic design, rendering, drafting, and visual communication. Teaching became an extension of his professional practice: a way of helping emerging designers develop clearer process, stronger taste, and practical tools for collaboration.",
  },
  {
    kind: "imageFull",
    imageIndex: 0,
  },
  {
    kind: "paragraph",
    text: "Today, Brandon is based in Southern California and works across theatre, live events, and experiential design. He is a member of United Scenic Artists Local 829 and serves as a Senior Experiential Designer at Adaptive Design Services. His work has been seen at South Coast Repertory, Maples Repertory Theatre, Okoboji Summer Theatre, New Swan Shakespeare Festival, Utah Shakespeare Festival, Stephens College, the University of Missouri, and other regional, festival, and academic theatres across the United States.",
  },
  {
    kind: "paragraph",
    text: "His portfolio includes intimate dramas, musicals, Shakespeare, comedies, new work, and productions that move between realism, memory, and theatrical abstraction. Recent projects include co-designing Million Dollar Quartet at South Coast Repertory with Efren Delgadillo Jr., designing The Glass Menagerie at Maples Repertory Theatre, and creating the scenic environment for Romero at the University of Missouri. He has also continued work with New Swan Shakespeare Festival in Irvine, designing outdoor productions that require adaptability, clarity, and a strong relationship between performer, audience, and environment.",
  },
  {
    kind: "paragraph",
    text: "One of the clearest examples of Brandon’s evolving process is his relationship with The Glass Menagerie, a play he has designed three separate times. Each version was shaped by different tools, resources, and production realities. An early design used green scenic tones, pink rose imagery, and scrim walls that could dissolve to reveal the streets of St. Louis. A later production required a more restrained approach, using subtle rose patterns to suggest Laura’s inner world. Most recently, at Maples Repertory Theatre, Brandon explored Tennessee Williams’ original projection ideas through large-scale printed fabric “memory walls,” creating collaged fragments of Tom and Laura’s past.",
  },
  {
    kind: "statement",
    text: "The play stayed the same. The designer did not.",
  },
  {
    kind: "paragraph",
    text: "That willingness to revisit, revise, and keep learning is central to Brandon’s work. He is drawn to scenic design because it makes room for many kinds of thinking at once: art, history, engineering, architecture, technology, performance, and human behavior. A “jack-of-all-trades” curiosity becomes useful in a field where every project asks a different set of questions.",
  },
  {
    kind: "paragraph",
    text: "That interdisciplinary approach also informs his work in experiential design, where narrative, audience movement, spatial logic, and technical execution come together in physical environments. For Brandon, theatre and experiential design are connected by the same core question: how do people understand a story by moving through space?",
  },
  {
    kind: "paragraph",
    text: "Technology has become an important part of his practice, but not the center of it. Brandon uses 3D modeling, rendering, real-time visualization, and digital workflows as communication tools, helping directors, collaborators, and production teams understand spatial ideas earlier and more clearly. He is also interested in how artificial intelligence, automation, and new visualization platforms can support creative practice without replacing the fundamentals of design.",
  },
  {
    kind: "statement",
    text: "The goal is not to make the process more complicated. The goal is to make the storytelling clearer.",
  },
  {
    kind: "paragraph",
    text: "For Brandon, the strongest scenic designs are not always the loudest ones. They are the designs that help performers move with confidence, give directors useful choices, support the technical team, and allow the audience to enter the world of the production without resistance. Sometimes that means a bold visual gesture. Sometimes it means restraint. Often, it means knowing the difference.",
  },
  {
    kind: "paragraph",
    text: "Scenic design, at its best, builds trust. Brandon’s work aims for that kind of cohesion: environments that feel purposeful, evocative, and alive, while remaining grounded in the real needs of the production and the people making it.",
  },
] as const;

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
