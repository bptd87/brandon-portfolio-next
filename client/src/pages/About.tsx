"use client";

import { ArrowRight, ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import Image from "next/image";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import { VOYAGELA_EXTERNAL_URL } from "@shared/publicContent";

const galleryImages = [
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-uci-144f3c95.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-uci-144f3c95.webp",
    alt: "Brandon PT Davis and Gretchen at Apple Park during UC Irvine graduate school years",
    caption: "Brandon and Gretchen at Apple Park in 2022.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teaching-8566b656.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teaching-8566b656.webp",
    alt: "Brandon PT Davis teaching scenic design to Stephens College students during a production strike",
    caption: "Brandon with Stephens College students during the strike.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teams-ee0e5092.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-teams-ee0e5092.webp",
    alt: "Brandon PT Davis with Gretchen and lighting designer Lonnie Alcaraz in Costa Mesa",
    caption: "Brandon, Gretchen, and Lonnie Alcaraz [Lighting Designer] in Costa Mesa in 2023.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-mentors-de7b3237.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-mentors-de7b3237.webp",
    alt: "Brandon PT Davis with Gretchen and scenic and production designer Alan Muraoka at South Coast Rep",
    caption: "Brandon, Gretchen, and Alan Muraoka [Scenic and Production Designer] at South Coast Rep in 2024.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-collaborations-3a11416a.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-collaborations-3a11416a.webp",
    alt: "Brandon PT Davis with Gretchen, Michael and Ruth Anne Burek, and Katie Cohen at the Okoboji Association Party",
    caption: "Brandon, Gretchen, Michael and Ruth Anne Burek, and Katie Cohen at the Association Party in Okoboji, Iowa, in 2023.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-family-305c20d0.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-family-305c20d0.webp",
    alt: "Brandon PT Davis with the Ugalde Burks family at Thanksgiving in 2023",
    caption: "Brandon with the Ugalde Burks family at Thanksgiving in 2023.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-partnerships-081c8f6b.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-partnerships-081c8f6b.webp",
    alt: "Brandon PT Davis with Gretchen and scenic designer Tom Buderwitz in Santa Monica",
    caption: "Brandon, Gretchen, and Tom Buderwitz [Scenic Designer] in Santa Monica, California.",
  },
  {
    url: resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-behind-scenes-56903846.webp") || "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/gallery-behind-scenes-56903846.webp",
    alt: "Brandon PT Davis working in the scene shop at The Great American Melodrama",
    caption: "Brandon in the scene shop at The Great American Melodrama.",
  },
];

const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/brandon-pt-davis-about-home.jpg";

const navigationCards = [
  {
    title: "Upcoming Productions",
    description: "Current scenic design calendar, event pages, and selected production archive.",
    href: "/upcoming-productions",
    label: "Calendar",
    image: "/images/about/icons/upcoming-icon.png",
  },
  {
    title: "Resume & Credits",
    description: "Production history, union background, and the broader body of work.",
    href: "/resume",
    label: "Resume",
    image: "/images/about/icons/resume-icon.png",
  },
  {
    title: "Creative Statement",
    description:
      "Process, design philosophy, and the principles that shape the work.",
    href: "/creative-statement",
    label: "Process",
    image: "/images/about/icons/creative-statement-icon.png",
    imageTitle: "Creative Statement",
  },
  {
    title: "Teaching Philosophy",
    description: "Thoughts on scenic design education, mentorship, and professional growth.",
    href: "/about/teaching",
    label: "Teaching",
    image: "/images/about/icons/teaching-icon.png",
    imageTitle: "Teaching Philosophy",
  },
  {
    title: "Collaborators & Directors",
    description:
      "Creative partners, theatre companies, and long-running director relationships.",
    href: "/about/collaborators",
    label: "Collaboration",
    image: "/images/about/icons/collaboration-icon.png",
  },
];

export default function About() {
  const exploreRailRef = useRef<HTMLDivElement | null>(null);
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const galleryItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const scrollExploreBy = (direction: "prev" | "next") => {
    const rail = exploreRailRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction === "next" ? rail.clientWidth * 0.82 : -rail.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  const scrollGalleryBy = (direction: "prev" | "next") => {
    const nextIndex =
      direction === "next"
        ? Math.min(activeGalleryIndex + 1, galleryImages.length - 1)
        : Math.max(activeGalleryIndex - 1, 0);

    const target = galleryItemRefs.current[nextIndex];
    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  useEffect(() => {
    const rail = galleryRailRef.current;
    if (!rail) return;

    const updateActiveIndex = () => {
      const railLeft = rail.getBoundingClientRect().left;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      galleryItemRefs.current.forEach((item, index) => {
        if (!item) return;
        const distance = Math.abs(item.getBoundingClientRect().left - railLeft);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveGalleryIndex(closestIndex);
    };

    updateActiveIndex();
    rail.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);

    return () => {
      rail.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, []);

  return (
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Profile | Brandon PT Davis Scenic Designer & Educator"
        description="San Diego-based scenic designer with 130+ production credits across regional theatre, summer stock, and education. USA 829 member working across Southern California and beyond."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, USA 829 scenic designer, San Diego scenic designer, scenic designer California, Southern California scenic designer, scenic design educator, UC Irvine, regional theatre scenic design"
      />

      <Header />
      <AboutNav />

      <main>
        <section className="relative min-h-[82svh] overflow-hidden bg-[#c66f46]">
          <Image
            src={ABOUT_HEADSHOT_URL}
            alt="Brandon PT Davis against an orange wall"
            fill
            priority
            fetchPriority="high"
            quality={86}
            sizes="100vw"
            className="site-media-square object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.70)_0%,rgba(0,0,0,0.38)_34%,rgba(0,0,0,0.04)_68%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/34 to-transparent" />

          <div className="relative flex min-h-[82svh] items-center px-[clamp(1.5rem,5vw,6rem)] py-20 md:py-28">
            <AnimatedSection className="max-w-[54rem]">
              <p className="section-kicker text-white/58">
                Profile
              </p>
              <h1 className="mt-5 font-sans text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.86] tracking-[-0.075em] text-white">
                Brandon PT Davis
              </h1>
              <p className="mt-7 max-w-2xl text-[1.04rem] font-medium leading-8 tracking-[-0.015em] text-white/76 md:text-[1.14rem]">
                Scenic designer for theatre, memory, architecture, and live
                performance. Based in San Diego, working across regional
                theatre, summer stock, and academic production.
              </p>
            </AnimatedSection>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container max-w-[88rem]">
            <AnimatedSection delay={120} className="mx-auto max-w-[78rem]">
              <article>
                <div className="mx-auto max-w-[62rem] space-y-8 text-[1.18rem] font-medium leading-9 tracking-[-0.026em] text-foreground/84 md:text-[1.34rem] md:leading-10">
                  <p>
                    Brandon PT Davis is a scenic designer whose work begins with
                    the pressure of a room: how a space holds memory, how
                    architecture shapes behavior, and how scenery can give a
                    production its physical rhythm. His designs are built from
                    research, dramaturgy, collaboration, and a belief that the
                    stage picture should clarify the emotional life of a play.
                  </p>
                  <p>
                    Based in San Diego, California, Brandon designs for regional
                    theatres, summer stock companies, festivals, and academic
                    institutions across the United States. His portfolio spans
                    intimate dramas, musicals, Shakespeare, comedies, new work,
                    and productions that move between realism, memory, and
                    theatrical abstraction.
                  </p>

                  <blockquote className="py-8 md:py-10">
                    <p className="font-sans text-[clamp(2rem,4.4vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.075em]">
                    <span className="bg-gradient-to-r from-[#2458ff] via-[#7b2cff] to-[#c77dff] bg-clip-text text-transparent">
                      Expressive theatrical environments that support
                      storytelling through space.
                    </span>
                    </p>
                  </blockquote>

                  <p>
                    His recent work includes productions for South Coast
                    Repertory, Maples Repertory Theatre, Okoboji Summer Theatre,
                    New Swan Theatre Festival, Utah Shakespeare Festival,
                    Stephens College, and the University of Missouri. Across
                    those rooms, the goal remains consistent: create scenic
                    environments that support actors, directors, technicians,
                    and audiences in the same act of storytelling.
                  </p>
                  <p>
                    Alongside professional design practice, Brandon teaches
                    scenic design, rendering, drafting, and visual
                    communication. His classroom work is connected to his
                    professional work: helping emerging designers build clear
                    process, stronger taste, and practical tools for
                    collaboration.
                  </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-[62rem] gap-5 md:grid-cols-2">
                  <div className="overflow-hidden rounded-[1.5rem] bg-[#101010] p-6 text-white shadow-[0_18px_54px_rgba(17,17,17,0.12)]">
                    <p className="inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-[-0.02em] text-white/58">
                      <GraduationCap className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                      Education
                    </p>
                    <p className="mt-9 text-[1.28rem] font-medium leading-tight tracking-[-0.045em] text-white">
                      MFA Scenic Design
                    </p>
                    <p className="mt-2 text-[0.96rem] leading-6 text-white/58">
                      University of California, Irvine
                    </p>
                    <p className="mt-6 text-[1.28rem] font-medium leading-tight tracking-[-0.045em] text-white">
                      BFA Theatre
                    </p>
                    <p className="mt-2 text-[0.96rem] leading-6 text-white/58">
                      Stephens College
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_18px_54px_rgba(17,17,17,0.07)]">
                    <p className="text-[0.95rem] font-medium tracking-[-0.02em] text-foreground/48">
                      Practice
                    </p>
                    <div className="mt-8 grid gap-3 text-[1.08rem] leading-6 tracking-[-0.03em] text-foreground/76">
                      <p>Scenic Design</p>
                      <p>Digital Rendering</p>
                      <p>Model Building</p>
                      <p>Drafting and Visualization</p>
                    </div>
                  </div>
                </div>

                <div className="mx-auto mt-5 max-w-[62rem]">
                  <a
                    href={VOYAGELA_EXTERNAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid gap-6 rounded-[1.5rem] bg-white/78 p-6 shadow-[0_18px_54px_rgba(17,17,17,0.055)] transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_68px_rgba(17,17,17,0.08)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
                  >
                    <div>
                      <p className="text-[0.95rem] font-medium tracking-[-0.02em] text-foreground/46">
                        Profile article
                      </p>
                      <h3 className="mt-2 font-sans text-[1.65rem] font-medium leading-[1] tracking-[-0.055em] text-foreground md:text-[2rem]">
                        VoyageLA: Rising Stars Interview
                      </h3>
                      <p className="mt-3 max-w-2xl text-[0.98rem] leading-6 tracking-[-0.02em] text-foreground/58">
                        A press profile on Brandon&apos;s scenic design practice. Future
                        interviews and academic profiles can collect here as they publish.
                      </p>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/18 px-5 py-3 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground/70 transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
                      Read profile
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </a>
                </div>
              </article>
            </AnimatedSection>

          </div>
        </section>

        <section className="overflow-hidden bg-[#f1f0ec] py-16 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <AnimatedSection>
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-4 text-[1.15rem] font-medium tracking-[-0.035em] text-foreground/54">
                    Explore Brandon
                  </p>
                  <h2 className="font-sans text-[clamp(2.25rem,4.8vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.078em] text-foreground">
                    Calendar, resume, teaching, and collaboration.
                  </h2>
                </div>
                <Link
                  href="/resume"
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/24 px-5 py-3 text-[0.98rem] font-medium tracking-[-0.02em] text-foreground/76 transition-colors hover:border-foreground hover:text-foreground"
                >
                  View resume
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={120}>
            <div
              ref={exploreRailRef}
              className="mt-10 overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-max snap-x snap-mandatory gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                {navigationCards.map((card, index) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group relative flex h-[30rem] w-[min(21rem,78vw)] shrink-0 snap-start flex-col overflow-hidden rounded-[2rem] bg-[#f7f6f2] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.08)] ring-1 ring-black/[0.025] transition duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_26px_70px_rgba(17,17,17,0.12)] md:w-[22rem]"
                    style={{ transitionDelay: `${Math.min(index * 35, 140)}ms` }}
                  >
                    <div className="relative z-10">
                      <p className="text-[0.95rem] font-semibold tracking-[-0.02em] text-foreground/58">
                        {card.label}
                      </p>
                      <h3 className="mt-3 max-w-[16rem] font-sans text-[1.9rem] font-medium leading-[0.98] tracking-[-0.065em] text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-4 max-w-[17rem] text-[0.98rem] leading-6 tracking-[-0.02em] text-foreground/62">
                        {card.description}
                      </p>
                    </div>
                    <div className="relative mt-auto h-[11rem] w-full">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        unoptimized
                        quality={86}
                        loading="lazy"
                        sizes="(max-width: 768px) 78vw, 22rem"
                        className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="absolute bottom-5 right-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#1d1d1f] text-white transition-transform group-hover:scale-105">
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
            <button
              type="button"
              onClick={() => scrollExploreBy("prev")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white"
              aria-label="Scroll Explore Brandon left"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollExploreBy("next")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white"
              aria-label="Scroll Explore Brandon right"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="overflow-hidden bg-[#f1f0ec] py-16 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <AnimatedSection className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="mb-4 text-[1.15rem] font-medium tracking-[-0.035em] text-foreground/54">
                  Personal archive
                </p>
                <h2 className="font-sans text-[clamp(2.25rem,4.8vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.078em] text-foreground">
                  People, classrooms, shops, and collaborations.
                </h2>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={140}>
            <div
              ref={galleryRailRef}
              className="mt-10 overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex min-w-max snap-x snap-mandatory items-stretch gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
                {galleryImages.map((image, index) => (
                  <div
                    key={image.url}
                    ref={(node) => {
                      galleryItemRefs.current[index] = node;
                    }}
                    className="w-[min(28rem,78vw)] shrink-0 snap-start md:w-[30rem]"
                  >
                    <div className="group relative aspect-[4/3] h-full overflow-hidden rounded-[1.6rem] bg-white shadow-[0_18px_54px_rgba(17,17,17,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_76px_rgba(17,17,17,0.12)]">
                      <img
                        src={image.url}
                        alt={image.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent" />
                      <p className="absolute bottom-0 left-0 max-w-[28rem] p-6 text-[1rem] font-medium leading-7 tracking-[-0.025em] text-white/88">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="-mt-5 flex justify-end gap-3 px-[clamp(1.5rem,5vw,6rem)]">
            <button
              type="button"
              onClick={() => scrollGalleryBy("prev")}
              disabled={activeGalleryIndex === 0}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.08] text-black/62 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Scroll gallery left"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollGalleryBy("next")}
              disabled={activeGalleryIndex === galleryImages.length - 1}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/[0.12] text-black/72 transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Scroll gallery right"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
