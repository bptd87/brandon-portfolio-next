"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import Image from "next/image";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";

import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import { formatUtcDate } from "@/lib/date-format";
import { getLocalArticles } from "@shared/localArticles";
import { getConfiguredSiteUrl } from "../../../lib/env/site";

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
    title: "Creative Statement",
    description:
      "Process, design philosophy, and the principles that shape the work.",
    href: "/creative-statement",
    label: "Process",
    image:
      resolveBlobMediaUrl("/assets/about/about-process-art.png") ||
      "/assets/about/about-process-art.png",
    imageTitle: "Creative Statement",
  },
  {
    title: "Resume & Credits",
    description: "Production history, union background, and the broader body of work.",
    href: "/resume",
    label: "Resume",
    image:
      resolveBlobMediaUrl("/assets/about/about-resume-art.png") ||
      "/assets/about/about-resume-art.png",
  },
  {
    title: "Teaching Philosophy",
    description: "Thoughts on scenic design education, mentorship, and professional growth.",
    href: "/about/teaching",
    label: "Teaching",
    image:
      resolveBlobMediaUrl("/assets/about/about-teaching-art.png") ||
      "/assets/about/about-teaching-art.png",
    imageTitle: "Teaching Philosophy",
  },
  {
    title: "Collaborators & Directors",
    description:
      "Creative partners, theatre companies, and long-running director relationships.",
    href: "/about/collaborators",
    label: "Collaboration",
    image:
      resolveBlobMediaUrl("/assets/about/about-collaborators-art.png") ||
      "/assets/about/about-collaborators-art.png",
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

const SITE_URL = getConfiguredSiteUrl();

export default function About() {
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const galleryItemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const bioArticles = getLocalArticles()
    .filter(
      (article) =>
        article.categoryName === "Profiles & Interviews" ||
        article.tags?.some((tag) => tag.slug === "biography" || tag.slug === "profile" || tag.slug === "interview")
    )
    .sort((a, b) => new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime())
    .slice(0, 4);

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
    <div className="min-h-screen bg-background">
      <SEO
        title="About Brandon PT Davis | Scenic Designer & Educator"
        description="Southern California scenic designer with 130+ production credits across regional theatre, summer stock, and education. USA 829 member based in Orange County."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, USA 829 scenic designer, scenic designer California, Orange County scenic designer, scenic design educator, UC Irvine, regional theatre scenic design"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: `${SITE_URL}/about`,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description:
            "Scenic designer and conceptual artist known for a dramaturgical approach to stage space, with work at South Coast Repertory and 130+ productions across regional theatre, contemporary drama, and classical repertoire. Member of USA 829.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US",
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavisdesign",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
            "https://www.pinterest.com/BrandonPTDavis/",
            "https://www.usa829.org/Member-Profile/MemberID/15357",
          ],
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu",
            },
            {
              name: "Stephens College",
              url: "https://www.stephens.edu",
            },
          ],
          knowsAbout: [
            "Scenic Design",
            "Conceptual Design",
            "Regional Theatre",
            "Contemporary Drama",
            "Dramaturgical Design",
            "Design Mentorship",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Scenic Design Education",
          ],
        }}
      />
      <StructuredData
        type="ProfilePage"
        profilePage={{
          url: `${SITE_URL}/about`,
          name: "About Brandon PT Davis",
          description:
            "Profile of Brandon PT Davis, scenic designer and USA 829 member based in Southern California.",
          primaryImageOfPage: ABOUT_HEADSHOT_URL,
          mainEntity: {
            name: "Brandon PT Davis",
            jobTitle: "Scenic Designer",
            url: `${SITE_URL}/about`,
            image: ABOUT_HEADSHOT_URL,
            description:
              "Scenic designer and conceptual artist with 130+ production credits across regional theatre and academic stages.",
            sameAs: [
              "https://www.instagram.com/brandonptdavisdesign",
              "https://www.linkedin.com/in/brandonptdavis",
              "https://www.youtube.com/@BrandonPTDavisDesign",
              "https://www.facebook.com/BrandonPTDavisA",
              "https://www.pinterest.com/BrandonPTDavis/",
              "https://www.usa829.org/Member-Profile/MemberID/15357",
            ],
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "About", url: `${SITE_URL}/about` },
        ]}
      />

      <Header />
      <AboutNav />

      <main>
        <section className="pb-14 pt-24 md:pb-16 md:pt-28">
          <div className="container max-w-[88rem]">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  About
                </p>
                <h1 className="mt-5 font-sans text-[clamp(2.8rem,5.8vw,5.15rem)] font-medium leading-[0.95] tracking-[-0.06em] text-foreground">
                  Brandon PT Davis
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-[1.08rem] leading-8 text-foreground/72 md:text-[1.18rem]">
                  Brandon PT Davis is a scenic designer whose work centers on creating expressive
                  theatrical environments that support storytelling through space, composition, and
                  collaboration.
                </p>

              </div>

              <div className="mx-auto mt-10 max-w-3xl md:mt-12">
                <div className="overflow-hidden rounded-[1.75rem] border border-border/40 bg-card/20">
                  <div className="relative aspect-square w-full">
                    <Image
                      src={ABOUT_HEADSHOT_URL}
                      alt="Brandon PT Davis - Scenic Designer"
                      fill
                      priority
                      fetchPriority="high"
                      quality={84}
                      sizes="(max-width: 768px) 92vw, 48rem"
                      className="object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-8 md:pb-20 md:pt-10">
          <div className="container max-w-[88rem]">
            <div className="border-t border-border/20 pt-10">
              <div className="mx-auto max-w-3xl space-y-6">
                <p className="text-[1rem] leading-8 text-foreground/78 md:text-[1.08rem]">
                  Brandon&apos;s approach combines traditional scenic craft with contemporary digital
                  visualization methods, allowing him to develop designs that are both conceptually
                  clear and practically buildable. He is particularly interested in how scenic
                  design can shape rhythm, movement, and emotional tone within a production.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  Based in Southern California, Brandon designs for regional theatres and academic
                  institutions across the United States. Recent projects include <em>The Glass
                  Menagerie</em>, productions with the New Swan Shakespeare Festival, and work with
                  South Coast Repertory. He also completed his 40th scenic design at Okoboji Summer
                  Theatre, marking a significant milestone in a career that has developed steadily
                  through long-term collaborations and diverse repertory experiences.
                </p>

                <div className="py-10 text-center md:py-14">
                  <blockquote className="mx-auto max-w-4xl font-sans text-[clamp(1.9rem,4vw,3.5rem)] font-medium leading-[1.14] tracking-[-0.045em] text-foreground">
                    “Expressive theatrical environments that support storytelling through space,
                    composition, and collaboration.”
                  </blockquote>
                </div>

                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  His work spans musicals, classical plays, and new works, often incorporating
                  flexible staging, projection surfaces, and symbolic architectural forms.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  In addition to his professional design practice, Brandon has taught scenic design
                  and rendering at the university level. His teaching emphasizes process, visual
                  communication, and the importance of adaptability within the evolving landscape of
                  theatre production. He continues to explore new workflows that integrate digital
                  tools while maintaining a strong connection to the collaborative traditions of
                  live performance.
                </p>
              </div>

              <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/40 bg-card/20 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Education
                  </p>
                  <div className="mt-5 space-y-5 text-[0.98rem] leading-7 text-foreground/62">
                    <div>
                      <p className="text-foreground/82">Master of Fine Arts</p>
                      <p>Scenic Design, University of California, Irvine</p>
                    </div>
                    <div className="border-t border-border/30 pt-5">
                      <p className="text-foreground/82">Bachelor of Fine Arts</p>
                      <p>Theatre, Stephens College</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/40 bg-card/20 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Practice
                  </p>
                  <div className="mt-5 space-y-5 text-[0.98rem] leading-7 text-foreground/62">
                    <div>
                      <p className="text-foreground/82">Areas of Specialization</p>
                      <p>Scenic Design for Theatre</p>
                      <p>Digital Rendering and Visualization</p>
                      <p>Model Building and Drafting</p>
                    </div>
                    <div className="border-t border-border/30 pt-5">
                      <p className="text-foreground/82">Interests</p>
                      <p>
                        Theatre history, visual storytelling, rendering technologies,
                        architecture, travel, and collaborative creative practice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/35 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Working Approach
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                A dramaturgical approach to scenic design.
              </h2>
              <p className="mt-5 text-[1rem] leading-7 text-foreground/60 md:text-[1.08rem]">
                The strongest scenic work doesn&apos;t call attention to itself first. It builds the
                conditions for story, movement, rhythm, and emotional focus.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {workingPrinciples.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-[1.5rem] border border-border/40 bg-card/15 p-6 md:p-7"
                >
                  <h3 className="font-sans text-[1.35rem] font-medium tracking-[-0.03em] text-foreground">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-foreground/58">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Learn More
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                Process, teaching, and long-form context.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {navigationCards.map((card) => (
                <Link key={card.href} href={card.href} className="group block">
                  <div className="relative overflow-hidden rounded-[1.35rem] border border-border/40 bg-card/20">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        unoptimized
                        quality={82}
                        loading="lazy"
                        sizes="(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 23vw"
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                    {card.imageTitle ? (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center">
                        <div className="absolute inset-0 bg-black/12" />
                        <p className="relative max-w-[10ch] font-sans text-[1.45rem] font-medium leading-[0.98] tracking-[-0.05em] text-white md:text-[1.65rem]">
                          {card.imageTitle}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-foreground/50">{card.label}</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="space-y-2">
                        <h3 className="font-sans text-[1.25rem] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-[0.96rem] leading-7 text-foreground/58">
                          {card.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/45 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {bioArticles.length > 0 ? (
              <div className="mt-16 border-t border-border/25 pt-10">
                <div className="mb-8 max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Bio Articles
                  </p>
                  <h3 className="mt-4 font-sans text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1] tracking-[-0.04em] text-foreground">
                    Interviews, profiles, and longer-form writing around the work.
                  </h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {bioArticles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                      <div className="grid gap-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-start">
                        <div className="relative aspect-square overflow-hidden rounded-[1.15rem] border border-border/35 bg-card/20">
                          {article.coverImageUrl ? (
                            <Image
                              src={article.coverImageUrl}
                              alt={article.coverImageAlt || article.title}
                              fill
                              quality={80}
                              loading="lazy"
                              sizes="(max-width: 640px) 42vw, 8.5rem"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="pt-1">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-foreground/50">
                            <span>{article.categoryName}</span>
                            <span>{formatUtcDate(article.publishedAt || article.createdAt, "short")}</span>
                          </div>
                          <h4 className="mt-3 font-sans text-[1.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-foreground transition-colors group-hover:text-foreground/84">
                            {article.title}
                          </h4>
                          <p className="mt-3 text-[0.97rem] leading-7 text-foreground/60">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="border-t border-border/35 py-16 md:py-20">
          <div className="container max-w-[88rem]">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("prev")}
                  disabled={activeGalleryIndex === 0}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                  aria-label="Scroll gallery left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("next")}
                  disabled={activeGalleryIndex === galleryImages.length - 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                  aria-label="Scroll gallery right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

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
                  <div className="overflow-hidden rounded-[1.5rem] bg-card/20">
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
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
