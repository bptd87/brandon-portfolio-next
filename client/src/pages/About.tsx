"use client";

import { ArrowRight, Check, ChevronLeft, ChevronRight, Link2 } from "lucide-react";
import Image from "next/image";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import { copyTextToClipboard } from "@/lib/clipboard";
import { formatUtcDate } from "@/lib/date-format";
import { getLocalArticles, VOYAGELA_ARTICLE_SLUG, VOYAGELA_EXTERNAL_URL } from "@shared/localArticles";

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
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const navigationCards = [
  {
    title: "Upcoming Productions",
    description: "Current scenic design calendar, event pages, and selected production archive.",
    href: "/upcoming-productions",
    label: "Calendar",
    image: "/upcoming-productions/upcoming-productions-hero.webp",
  },
  {
    title: "Resume & Credits",
    description: "Production history, union background, and the broader body of work.",
    href: "/resume",
    label: "Resume",
    image:
      resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png") ||
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-resume-art.png",
  },
  {
    title: "Creative Statement",
    description:
      "Process, design philosophy, and the principles that shape the work.",
    href: "/creative-statement",
    label: "Process",
    image:
      resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png") ||
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-process-art.png",
    imageTitle: "Creative Statement",
  },
  {
    title: "Teaching Philosophy",
    description: "Thoughts on scenic design education, mentorship, and professional growth.",
    href: "/about/teaching",
    label: "Teaching",
    image:
      resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png") ||
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png",
    imageTitle: "Teaching Philosophy",
  },
  {
    title: "Collaborators & Directors",
    description:
      "Creative partners, theatre companies, and long-running director relationships.",
    href: "/about/collaborators",
    label: "Collaboration",
    image:
      resolveBlobMediaUrl("https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png") ||
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png",
  },
];

const recentMilestones = [
  "South Coast Repertory debut as co-scenic designer on Million Dollar Quartet.",
  "Designed Romero at the University of Missouri, shaping a spiritual and political memory play through scenography.",
  "Continued dual-track practice in regional theatre and experiential work while mentoring emerging designers in university classrooms.",
];

const workingPrinciples = [
  {
    title: "Story before image",
    description:
      "Every visual decision starts with the script, the director’s framework, and the emotional logic of the production.",
  },
  {
    title: "Space as collaboration",
    description:
      "The strongest scenic work comes from listening well and building environments that support performers, directors, and production teams together.",
  },
  {
    title: "Clarity in execution",
    description:
      "From research through drafting and fabrication conversations, the goal is always a design language that holds up in rehearsal and onstage.",
  },
];

const voyageLaProfileCard = {
  id: "voyagela-profile",
  title: "VoyageLA: Rising Stars Interview",
  excerpt:
    "VoyageLA's Rising Stars profile on Brandon PT Davis, scenic design practice, collaboration, and building a visible body of work.",
  categoryName: "Profiles & Interviews",
  publishedAt: "2026-02-10",
  coverImageUrl:
    resolveBlobMediaUrl(
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/local-articles/news-150001-cover-6b3d12c4.webp"
    ) ||
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/local-articles/news-150001-cover-6b3d12c4.webp",
  coverImageAlt: "VoyageLA Rising Stars interview feature",
  href: VOYAGELA_EXTERNAL_URL,
  external: true as const,
};

export default function About() {
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const galleryItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [pageLinkCopied, setPageLinkCopied] = useState(false);
  const bioArticles = getLocalArticles()
    .filter(
      (article) =>
        article.slug !== VOYAGELA_ARTICLE_SLUG &&
        (article.categoryName === "Profiles & Interviews" ||
          article.tags?.some((tag) => tag.slug === "biography" || tag.slug === "profile" || tag.slug === "interview"))
    )
    .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime())
    .slice(0, 4);
  const bioArticleCards = [
    voyageLaProfileCard,
    ...bioArticles.map((article) => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      categoryName: article.categoryName,
      publishedAt: article.publishedAt || article.createdAt || "",
      coverImageUrl: article.coverImageUrl,
      coverImageAlt: article.coverImageAlt || article.title,
      href: `/articles/${article.slug}`,
      external: false as const,
    })),
  ].slice(0, 4);

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

  const handleSharePage = async () => {
    const path = "/about";
    const url =
      typeof window === "undefined" ? `https://www.brandonptdavis.com${path}` : `${window.location.origin}${path}`;

    const copied = await copyTextToClipboard(url);
    if (copied) {
      setPageLinkCopied(true);
      window.setTimeout(() => setPageLinkCopied(false), 1800);
    } else {
      setPageLinkCopied(false);
    }
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
    <div className="min-h-screen bg-background">
      <SEO
        title="Profile | Brandon PT Davis Scenic Designer & Educator"
        description="San Diego-based scenic designer with 130+ production credits across regional theatre, summer stock, and education. USA 829 member working across Southern California and beyond."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, USA 829 scenic designer, San Diego scenic designer, scenic designer California, Southern California scenic designer, scenic design educator, UC Irvine, regional theatre scenic design"
      />

      <Header />
      <AboutNav />

      <main>
        <section className="pb-10 pt-24 md:pb-12 md:pt-28">
          <div className="container max-w-[88rem]">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  Profile
                </p>
                <h1 className="mt-5 font-sans text-[clamp(3.2rem,7vw,7.1rem)] font-medium leading-[0.86] tracking-[-0.065em] text-foreground">
                  Brandon PT Davis
                </h1>
                <p className="mx-auto mt-7 max-w-2xl text-[1.04rem] leading-8 tracking-[-0.01em] text-foreground/68 md:text-[1.14rem]">
                  Scenic designer for theatre, memory, architecture, and live
                  performance. Based in San Diego, working across regional
                  theatre, summer stock, and academic production.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={120} className="mx-auto mt-10 max-w-3xl md:mt-12">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-card/20">
                <Image
                  src={ABOUT_HEADSHOT_URL}
                  alt="Brandon PT Davis - Scenic Designer"
                  fill
                  priority
                  fetchPriority="high"
                  quality={84}
                  sizes="(max-width: 768px) 92vw, 48rem"
                  className="object-cover object-[50%_16%]"
                />
              </div>
              <div className="mt-8 flex w-full justify-end border-t border-white/14 py-4 text-foreground/72">
                <button
                  type="button"
                  onClick={handleSharePage}
                  className="inline-flex items-center justify-center gap-2 text-[0.98rem] tracking-[-0.02em] transition-colors hover:text-foreground"
                >
                  {pageLinkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  <span>{pageLinkCopied ? "Link copied" : "Share"}</span>
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container max-w-[88rem]">
            <AnimatedSection delay={180} className="mx-auto max-w-3xl">
            <article className="border-t border-border/35 pt-10">
              <div className="space-y-6">
                <p className="text-[1rem] leading-8 text-foreground/78 md:text-[1.08rem]">
                  Brandon&apos;s work begins with the pressure of a room: how a
                  space holds memory, how architecture shapes behavior, and how
                  scenic design can give a production its physical rhythm. His
                  practice combines traditional scenic craft with digital
                  visualization, moving from research and spatial study into
                  designs that are conceptually clear and practically buildable.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  Based in San Diego, California, Brandon designs for regional
                  theatres and academic institutions across the United States.
                  Recent projects include <em>The Glass Menagerie</em>,
                  productions with New Swan Shakespeare Festival, and work with
                  South Coast Repertory. He also completed his 40th scenic
                  design at Okoboji Summer Theatre, a milestone shaped by
                  long-term collaboration and repertory experience.
                </p>
              </div>

              <blockquote className="my-12 border-y border-border/35 py-8 font-sans text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.055em] text-foreground md:my-14 md:py-10">
                Expressive theatrical environments that support storytelling
                through space, composition, and collaboration.
              </blockquote>

              <div className="space-y-6">
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  His work spans musicals, classical plays, new works, and
                  contemporary drama, often using flexible staging, symbolic
                  architecture, and visual restraint to clarify the emotional
                  center of the production.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  In addition to his professional design practice, Brandon has
                  taught scenic design and rendering at the university level.
                  His teaching emphasizes process, visual communication, and
                  adaptability within the evolving landscape of theatre
                  production.
                </p>
              </div>

              <div className="mt-12 grid gap-8 border-y border-border/35 py-7 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Education
                  </p>
                  <div className="mt-5 divide-y divide-border/30 text-[0.98rem] leading-7 text-foreground/62">
                    <div className="pb-5">
                      <p className="text-foreground/84">Master of Fine Arts</p>
                      <p>Scenic Design, University of California, Irvine</p>
                    </div>
                    <div className="pt-5">
                      <p className="text-foreground/84">Bachelor of Fine Arts</p>
                      <p>Theatre, Stephens College</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Practice
                  </p>
                  <div className="mt-5 divide-y divide-border/30 text-[0.98rem] leading-7 text-foreground/62">
                    <div className="pb-5">
                      <p className="text-foreground/84">Areas of Specialization</p>
                      <p>Scenic Design for Theatre</p>
                      <p>Digital Rendering and Visualization</p>
                      <p>Model Building and Drafting</p>
                    </div>
                    <div className="pt-5">
                      <p className="text-foreground/84">Interests</p>
                      <p>
                        Theatre history, visual storytelling, rendering
                        technologies, architecture, travel, and collaborative
                        creative practice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 border-t border-border/35 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  Working Approach
                </p>
                <div className="mt-6 divide-y divide-border/30">
                  {workingPrinciples.map((principle) => (
                    <div
                      key={principle.title}
                      className="grid gap-3 py-5 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8"
                    >
                      <h2 className="font-sans text-[1.15rem] font-medium leading-[1.08] tracking-[-0.03em] text-foreground">
                        {principle.title}
                      </h2>
                      <p className="text-[0.98rem] leading-7 text-foreground/60">
                        {principle.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 border-t border-border/35 pt-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  Recent Notes
                </p>
                <div className="mt-5 divide-y divide-border/30 text-[0.98rem] leading-7 text-foreground/64">
                  {recentMilestones.map((milestone) => (
                    <p key={milestone} className="py-4">
                      {milestone}
                    </p>
                  ))}
                </div>
              </div>
            </article>
            </AnimatedSection>
          </div>
        </section>

        <section className="border-y border-border/35 py-14 md:py-20">
          <div className="container max-w-[88rem]">
            <AnimatedSection className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  Profile Sections
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                Biography, productions, resume, teaching, and collaboration.
              </h2>
            </AnimatedSection>

            <div className="mt-10 divide-y divide-border/35 border-y border-border/35">
              {navigationCards.map((card, index) => (
                <AnimatedSection key={card.href} delay={Math.min(index * 70, 300)}>
                  <Link
                    href={card.href}
                    className="group grid gap-5 py-5 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:items-center md:gap-8"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-card/20">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        unoptimized
                        quality={82}
                        loading="lazy"
                        sizes="(max-width: 768px) 92vw, 12rem"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/42">
                        {card.label}
                      </p>
                      <h3 className="mt-2 font-sans text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-foreground/58">
                        {card.description}
                      </p>
                    </div>
                    <ArrowRight className="hidden h-5 w-5 text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-foreground md:block" />
                  </Link>
                </AnimatedSection>
              ))}
            </div>

            {bioArticleCards.length > 0 ? (
              <AnimatedSection delay={160} className="mt-14 border-t border-border/35 pt-9">
                <div className="mb-8 max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Profiles
                  </p>
                  <h3 className="mt-4 font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1] tracking-[-0.04em] text-foreground">
                    Interviews and longer-form writing around the work.
                  </h3>
                </div>

                <div className="divide-y divide-border/35 border-y border-border/35">
                  {bioArticleCards.map((article) => {
                    const articleCard = (
                      <div className="group grid gap-5 py-5 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:items-center">
                        <div className="relative aspect-[4/3] overflow-hidden bg-card/20">
                          {article.coverImageUrl ? (
                            <Image
                              src={article.coverImageUrl}
                              alt={article.coverImageAlt}
                              fill
                              quality={80}
                              loading="lazy"
                              sizes="(max-width: 640px) 92vw, 9rem"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-foreground/50">
                            <span>{article.categoryName}</span>
                            <span>{formatUtcDate(article.publishedAt, "short")}</span>
                          </div>
                          <h4 className="mt-3 font-sans text-[1.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-foreground transition-colors group-hover:text-foreground/84">
                            {article.title}
                          </h4>
                          <p className="mt-3 max-w-2xl text-[0.97rem] leading-7 text-foreground/60">
                            {article.excerpt}
                          </p>
                        </div>
                        <ArrowRight className="hidden h-4 w-4 text-foreground/42 transition-transform group-hover:translate-x-1 group-hover:text-foreground sm:block" />
                      </div>
                    );

                    return article.external ? (
                      <a
                        key={article.id}
                        href={article.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {articleCard}
                      </a>
                    ) : (
                      <Link key={article.id} href={article.href} className="block">
                        {articleCard}
                      </Link>
                    );
                  })}
                </div>
              </AnimatedSection>
            ) : null}
          </div>
        </section>

        <section className="border-t border-border/35 py-14 md:py-20">
          <div className="container max-w-[88rem]">
            <AnimatedSection className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  Personal Archive
                </p>
                <h2 className="mt-4 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                  People, classrooms, shops, and collaborations around the work.
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("prev")}
                  disabled={activeGalleryIndex === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Scroll gallery left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("next")}
                  disabled={activeGalleryIndex === galleryImages.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Scroll gallery right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={140}>
            <div
              ref={galleryRailRef}
              className="mt-10 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryImages.map((image, index) => (
                <div
                  key={image.url}
                  ref={(node) => {
                    galleryItemRefs.current[index] = node;
                  }}
                  className="w-[min(84vw,36rem)] shrink-0 snap-start sm:w-[min(64vw,30rem)] md:w-[calc((100%-3rem)/3)]"
                >
                  <div className="overflow-hidden bg-card/20">
                    <img
                      src={image.url}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="block h-auto w-full"
                    />
                  </div>
                  <p className="mt-3 max-w-[36rem] text-[0.98rem] leading-7 text-foreground/62">
                    {image.caption}
                  </p>
                </div>
              ))}
            </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
