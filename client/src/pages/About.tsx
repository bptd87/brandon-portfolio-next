"use client";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  FileText,
  GraduationCap,
  Mail,
  PenLine,
} from "lucide-react";
import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import { PROFILE_ARTICLE_LINKS } from "@shared/publicContent";

const ABOUT_PORTRAIT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const aboutImages = [
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-behind-scenes-56903846.webp",
    alt: "Brandon PT Davis working in the scene shop at The Great American Melodrama",
    caption: "Scene shop work at The Great American Melodrama.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teaching-8566b656.webp",
    alt: "Brandon PT Davis teaching scenic design to Stephens College students during a production strike",
    caption: "Teaching scenic design through the work of production.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-uci-144f3c95.webp",
    alt: "Brandon PT Davis and Gretchen at Apple Park during UC Irvine graduate school years",
    caption: "Graduate school years in California.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-mentors-de7b3237.webp",
    alt: "Brandon PT Davis with Gretchen and scenic and production designer Alan Muraoka at South Coast Rep",
    caption: "With Gretchen and Alan Muraoka at South Coast Rep.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teams-ee0e5092.webp",
    alt: "Brandon PT Davis with Gretchen and lighting designer Lonnie Alcaraz in Costa Mesa",
    caption: "With Gretchen and Lonnie Alcaraz in Costa Mesa.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-collaborations-3a11416a.webp",
    alt: "Brandon PT Davis with Gretchen, Michael and Ruth Anne Burek, and Katie Cohen at the Okoboji Association Party",
    caption: "Okoboji Summer Theatre community and collaborators.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-family-305c20d0.webp",
    alt: "Brandon PT Davis with the Ugalde Burks family at Thanksgiving in 2023",
    caption: "Family, place, and the life around the work.",
  },
  {
    src: "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-partnerships-081c8f6b.webp",
    alt: "Brandon PT Davis with Gretchen and scenic designer Tom Buderwitz in Santa Monica",
    caption: "With Gretchen and Tom Buderwitz in Santa Monica.",
  },
] as const;

const afterArticleImages = [
  aboutImages[0],
  aboutImages[2],
  aboutImages[3],
  aboutImages[4],
  aboutImages[5],
  aboutImages[6],
  aboutImages[7],
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
    imageIndex: 1,
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
  return (
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111] [--background:#f1f0ec] [--foreground:#111111]">
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
        titleClassName="!max-w-[16ch] !text-[clamp(3rem,5.4vw,5.65rem)] !leading-[0.94] !tracking-[-0.068em]"
        titleContent={
          <>
            About
            <br />
            Brandon PT Davis
          </>
        }
        updatedAt="May 22, 2026"
      />

      <main className="bg-[#f1f0ec] px-[clamp(1rem,5vw,6rem)] pb-20 pt-12 md:pb-28 md:pt-16">
        <article className="mx-auto max-w-[76rem]">
          <div className="grid gap-10 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] md:gap-12">
            <aside className="space-y-8 md:sticky md:top-28 md:self-start md:pt-1">
              <nav
                aria-label="About related links"
                className="space-y-3.5 text-[0.98rem] font-semibold leading-6 tracking-[-0.015em] text-black"
              >
                <a
                  className="flex items-center gap-2.5 underline-offset-4 hover:underline"
                  href="/resume"
                >
                  <FileText className="h-4 w-4 flex-none stroke-[2.1]" aria-hidden="true" />
                  Resume
                </a>
                <a
                  className="flex items-center gap-2.5 underline-offset-4 hover:underline"
                  href="/creative-statement"
                >
                  <PenLine className="h-4 w-4 flex-none stroke-[2.1]" aria-hidden="true" />
                  Creative statement
                </a>
                <a
                  className="flex items-center gap-2.5 underline-offset-4 hover:underline"
                  href="/about/teaching"
                >
                  <GraduationCap className="h-4 w-4 flex-none stroke-[2.1]" aria-hidden="true" />
                  Teaching philosophy
                </a>
                <a
                  className="flex items-center gap-2.5 underline-offset-4 hover:underline"
                  href="/projects"
                >
                  <BriefcaseBusiness className="h-4 w-4 flex-none stroke-[2.1]" aria-hidden="true" />
                  Portfolio
                </a>
                <a
                  className="flex items-center gap-2.5 underline-offset-4 hover:underline"
                  href="mailto:info@brandonptdavis.com"
                >
                  <Mail className="h-4 w-4 flex-none stroke-[2.1]" aria-hidden="true" />
                  Email
                </a>
              </nav>
            </aside>

            <div className="space-y-7 text-[1.12rem] font-medium leading-8 tracking-[-0.015em] text-black/78 md:text-[1.22rem] md:leading-9">
              <figure className="my-8 md:float-right md:mb-6 md:ml-10 md:mt-1 md:w-[min(42%,24rem)]">
                <img
                  src={ABOUT_PORTRAIT_URL}
                  alt="Brandon PT Davis"
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full bg-black/[0.04]"
                />
                <figcaption className="mt-3 font-sans text-[0.9rem] font-medium leading-5 tracking-[-0.01em] text-black/42">
                  Brandon PT Davis.
                </figcaption>
              </figure>

              {introParagraphs.map((paragraph, index) => (
                <p
                  key={paragraph.text}
                  className={
                    index === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:font-sans first-letter:text-[4.75rem] first-letter:font-medium first-letter:leading-[0.78] first-letter:tracking-[-0.08em] first-letter:text-black"
                      : undefined
                  }
                >
                  {paragraph.text}
                </p>
              ))}

              {aboutStoryBlocks.map((block, index) => {
                if (block.kind === "statement") {
                  return (
                    <p
                      key={`${block.kind}-${index}`}
                      className="my-9 max-w-[34rem] border-l border-black/16 pl-5 font-sans text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.055em] text-black"
                    >
                      {block.text}
                    </p>
                  );
                }

                if (block.kind === "imageFull") {
                  const image = aboutImages[block.imageIndex];

                  return (
                    <figure
                      key={`${block.kind}-${index}`}
                      className="clear-both my-11"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-auto w-full bg-black/[0.04]"
                      />
                      <figcaption className="mt-3 font-sans text-[0.9rem] font-medium leading-5 tracking-[-0.01em] text-black/42">
                        {image.caption}
                      </figcaption>
                    </figure>
                  );
                }

                return (
                  <p
                    key={`${block.kind}-${index}`}
                  >
                    {block.text}
                  </p>
                );
              })}

              <section
                aria-label="Profiles and related pages"
                className="border-t border-black/12 pt-8 text-[0.98rem] leading-6 tracking-[-0.01em]"
              >
                <div>
                  <h2 className="font-sans text-[0.95rem] font-semibold leading-none tracking-[-0.01em] text-black/48">
                    Profiles
                  </h2>
                  <div className="mt-4 space-y-3">
                    {PROFILE_ARTICLE_LINKS.map((profileLink) => (
                      <a
                        key={profileLink.href}
                        href={profileLink.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group block font-semibold text-black underline-offset-4 hover:underline"
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
          {afterArticleImages.map((image) => (
            <figure key={image.src}>
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                className="h-auto w-full bg-black/[0.04]"
              />
              <figcaption className="mt-3 font-sans text-[0.9rem] font-medium leading-5 tracking-[-0.01em] text-black/42">
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
