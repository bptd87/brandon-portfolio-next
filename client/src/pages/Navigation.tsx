"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import {
  HOME_BODY_FONT,
  HOME_DISPLAY_FONT,
  type HomeColorTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import type { LocalScenicProject } from "@shared/localScenicProjects";

const ABOUT_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const SITE_CARD_COLORS = {
  blue: {
    background: "#1385f6",
    text: "#a8f4ff",
    accent: "#052f8b",
    muted: "rgba(5,47,139,0.78)",
  },
  green: {
    background: "#35ad62",
    text: "#baff00",
    accent: "#003f1c",
    muted: "rgba(0,63,28,0.76)",
  },
  orange: {
    background: "#ff6f00",
    text: "#20180f",
    accent: "#e9e1cf",
    muted: "rgba(32,24,15,0.72)",
  },
  purple: {
    background: "#3f0050",
    text: "#ffe3ff",
    accent: "#dc30ff",
    muted: "rgba(220,48,255,0.78)",
  },
};

type NavigationProps = {
  initialProjects: LocalScenicProject[];
};

type SectionCard = {
  label: string;
  href: string;
  image: string;
  items: string[];
  note?: string;
  external?: boolean;
  background: string;
  text: string;
  accent: string;
};

type NavFloatingImage = {
  url: string;
  alt: string;
};

type NavigationFeatureItem = {
  title: string;
  href: string;
  label: string;
  description: string;
  image?: string;
  color?: string;
  textColor?: string;
  mutedColor?: string;
  shortTitle?: string;
  accentColor?: string;
  accentTextColor?: string;
};

const featuredArticleLinks: NavigationFeatureItem[] = [
  {
    title: "What Does a Scenic Designer Do?",
    href: "/articles/what-does-a-scenic-designer-do",
    label: "Scenic Design",
    image:
      "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90010-gallery-150020-9c38d1a9.webp",
    color: SITE_CARD_COLORS.blue.background,
    textColor: SITE_CARD_COLORS.blue.text,
    mutedColor: SITE_CARD_COLORS.blue.accent,
    description:
      "A clear guide to the scenic designer's role, process, and relationship to the full production team.",
  },
  {
    title: "What Theatre Designers Get Paid",
    href: "/articles/what-theatre-designers-get-paid",
    label: "Career Development",
    image: "/images/articles/what-theatre-designers-get-paid/hero.png",
    color: SITE_CARD_COLORS.purple.background,
    textColor: SITE_CARD_COLORS.purple.text,
    mutedColor: SITE_CARD_COLORS.purple.accent,
    description:
      "A practical article about value, labor, sustainability, and the financial reality of theatre design.",
  },
  {
    title: "Understanding Design Layers",
    href: "/articles/understanding-design-layers",
    label: "Vectorworks Tutorial",
    image: "https://img.youtube.com/vi/CXBfG2L3ZmI/maxresdefault.jpg",
    color: SITE_CARD_COLORS.green.background,
    textColor: SITE_CARD_COLORS.green.accent,
    mutedColor: SITE_CARD_COLORS.green.muted,
    description:
      "A beginner-friendly tutorial for keeping drafting files readable, organized, and useful.",
  },
];

const studioAppLinks: NavigationFeatureItem[] = [
  {
    title: "Scale Calculator",
    href: "/studio/apps/scale-calculator",
    label: "Drafting",
    shortTitle: "Scale",
    color: "#b7653f",
    textColor: "#ffffff",
    mutedColor: "rgba(255,255,255,0.74)",
    accentColor: "#d06934",
    accentTextColor: "#17120b",
    description:
      "Convert real-world dimensions into common scenic design and architectural drafting scales.",
  },
  {
    title: "Dimension Reference",
    href: "/studio/apps/dimension-reference",
    label: "Reference",
    shortTitle: "Dims",
    color: "#c98f24",
    textColor: "#17120b",
    mutedColor: "rgba(23,18,11,0.68)",
    accentColor: "#c9891d",
    accentTextColor: "#17120b",
    description:
      "Quick checks for common theatre, drafting, furniture, and scenic construction dimensions.",
  },
  {
    title: "Rosco Paint Calculator",
    href: "/studio/apps/rosco-paint-calculator",
    label: "Paint Shop",
    shortTitle: "Rosco",
    color: "#be6241",
    textColor: "#ffffff",
    mutedColor: "rgba(255,255,255,0.74)",
    accentColor: "#3f5d62",
    accentTextColor: "#ffffff",
    description:
      "Calculate Rosco scenic paint mixes and color matching workflows.",
  },
  {
    title: "Commercial Paint Matcher",
    href: "/studio/apps/commercial-paint-matcher",
    label: "Paint Library",
    shortTitle: "Paint Match",
    color: "#758967",
    textColor: "#ffffff",
    mutedColor: "rgba(255,255,255,0.74)",
    accentColor: "#758967",
    accentTextColor: "#ffffff",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR libraries.",
  },
  {
    title: "Design History Timeline",
    href: "/studio/apps/design-history-timeline",
    label: "Research",
    shortTitle: "History",
    color: "#8a5432",
    textColor: "#ffffff",
    mutedColor: "rgba(255,255,255,0.74)",
    accentColor: "#8a5432",
    accentTextColor: "#ffffff",
    description:
      "Explore major design periods with visual references, palettes, and historical context.",
  },
];

const floatingImageFrames: Array<{
  className: string;
  style: CSSProperties;
  imageStyle?: CSSProperties;
}> = [
  {
    className:
      "left-[4%] top-[8%] aspect-[1.45/1] w-[clamp(8.5rem,18vw,18rem)] rotate-[-8deg]",
    style: { animationDelay: "0ms" },
    imageStyle: { objectPosition: "center" },
  },
  {
    className:
      "right-[7%] top-[2%] aspect-[0.78/1] w-[clamp(7rem,13vw,12.5rem)] rotate-[7deg]",
    style: { animationDelay: "90ms" },
    imageStyle: { objectPosition: "center top" },
  },
  {
    className:
      "left-[10%] bottom-[11%] aspect-[0.88/1] w-[clamp(7.5rem,14vw,13.5rem)] rotate-[5deg]",
    style: { animationDelay: "170ms" },
    imageStyle: { objectPosition: "center" },
  },
  {
    className:
      "right-[3%] bottom-[14%] aspect-[1.68/1] w-[clamp(9rem,19vw,19rem)] rotate-[-5deg]",
    style: { animationDelay: "240ms" },
    imageStyle: { objectPosition: "center" },
  },
  {
    className:
      "left-[32%] top-[0%] aspect-square w-[clamp(6rem,10vw,9.5rem)] rotate-[11deg]",
    style: { animationDelay: "310ms" },
    imageStyle: { objectPosition: "center" },
  },
  {
    className:
      "right-[31%] bottom-[4%] aspect-[1.18/1] w-[clamp(6.5rem,12vw,11rem)] rotate-[-10deg]",
    style: { animationDelay: "380ms" },
    imageStyle: { objectPosition: "center" },
  },
];

function getSectionCards(projects: LocalScenicProject[]): SectionCard[] {
  const portfolioImage =
    projects[0]?.coverImageUrl ||
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90051-gallery-150232-69e3ddad.webp";
  const instagramImage =
    projects[1]?.coverImageUrl ||
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150197-48389e80.webp";

  return [
    {
      label: "PORTFOLIO",
      href: "/projects",
      image: portfolioImage,
      items: ["Scenic", "Experiential", "Rendering", "Photography"],
      background: SITE_CARD_COLORS.blue.background,
      text: SITE_CARD_COLORS.blue.text,
      accent: SITE_CARD_COLORS.blue.accent,
    },
    {
      label: "ABOUT",
      href: "/about",
      image: ABOUT_IMAGE_URL,
      items: ["Resume", "Creative Statement", "Teaching"],
      background: SITE_CARD_COLORS.purple.background,
      text: SITE_CARD_COLORS.purple.text,
      accent: SITE_CARD_COLORS.purple.accent,
    },
    {
      label: "STUDIO",
      href: "/studio",
      image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
      items: ["Articles", "Tutorials", "Apps"],
      background: SITE_CARD_COLORS.green.background,
      text: SITE_CARD_COLORS.green.text,
      accent: SITE_CARD_COLORS.green.accent,
    },
    {
      label: "INSTAGRAM",
      href: "https://www.instagram.com/brandonptdavisdesign/",
      image: instagramImage,
      items: [],
      note: "@brandonptdavisdesign",
      external: true,
      background: SITE_CARD_COLORS.orange.background,
      text: SITE_CARD_COLORS.orange.text,
      accent: SITE_CARD_COLORS.orange.accent,
    },
  ];
}

function NavigationCard({ card }: { card: SectionCard }) {
  const content = (
    <>
      <img
        src={card.image}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-28 w-28 shrink-0 select-none rounded-[1.1rem] object-cover shadow-[0_1rem_2.2rem_rgba(0,0,0,0.18)] md:h-32 md:w-32"
      />
      <span className="flex min-w-0 flex-1 flex-col justify-center self-stretch py-1">
        <span
          className="block text-[clamp(1.55rem,3.2vw,2.85rem)] font-black uppercase leading-[0.84] tracking-[0.01em]"
          style={{ color: card.text }}
        >
          {card.label}
        </span>
        {card.items.length ? (
          <span
            className="mt-3 flex max-w-[22rem] flex-wrap gap-x-4 gap-y-1 text-[clamp(0.9rem,1.45vw,1.18rem)] font-black uppercase leading-[0.95] tracking-[0.035em]"
            style={{ color: card.accent }}
          >
            {card.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </span>
        ) : null}
        {card.note ? (
          <span
            className="mt-4 block text-[clamp(1rem,1.6vw,1.3rem)] font-black uppercase leading-none tracking-[0.04em]"
            style={{ color: card.accent }}
          >
            {card.note}
          </span>
        ) : null}
      </span>
    </>
  );

  const className =
    "group flex min-h-[10rem] items-center gap-6 rounded-[1.55rem] p-4 text-left shadow-[0_1.6rem_3.5rem_rgba(0,0,0,0.12)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:rotate-[-0.5deg] hover:shadow-[0_2.2rem_4.4rem_rgba(0,0,0,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 focus-visible:ring-offset-4";

  if (card.external) {
    return (
      <a
        href={card.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{ backgroundColor: card.background, color: card.text }}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={card.href}
      className={className}
      style={{ backgroundColor: card.background, color: card.text }}
    >
      {content}
    </Link>
  );
}

function RecentScenicDesign({
  projects,
  theme,
}: {
  projects: LocalScenicProject[];
  theme: HomeColorTheme;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeProject = activeIndex === null ? null : projects[activeIndex] || null;
  const floatingImages = useMemo<NavFloatingImage[]>(() => {
    if (activeProject) {
      const mediaImages = activeProject.media
        .filter((item) => item.type === "image" && item.imageUrl)
        .map((item) => ({
          url: item.imageUrl || "",
          alt: item.altText || `${activeProject.title} scenic design`,
        }));

      const fallbackImage = activeProject.coverImageUrl
        ? [
            {
              url: activeProject.coverImageUrl,
              alt: `${activeProject.title} scenic design`,
            },
          ]
        : [];

      return [...mediaImages, ...fallbackImage].slice(0, floatingImageFrames.length);
    }

    return [];
  }, [activeProject]);

  if (!projects.length) return null;

  return (
    <section
      id="recent-scenic-design"
      className="nav-load-item relative mx-auto flex w-full max-w-[96rem] flex-col items-center justify-center overflow-hidden px-5 pb-[clamp(5rem,8vw,7rem)] pt-[clamp(4rem,7vw,6rem)] text-center md:px-8"
      style={{ "--nav-load-delay": "460ms" } as CSSProperties}
    >
      <div className="relative min-h-[clamp(34rem,58vw,45rem)] w-full">
        <div className="pointer-events-none absolute inset-0 z-10 hidden md:block">
          {floatingImages.map((image, index) => {
            const frame = floatingImageFrames[index % floatingImageFrames.length];
            return (
              <div
                key={`${activeProject?.slug || "default"}-${image.url}-${index}`}
                className={`absolute overflow-hidden rounded-[1.15rem] shadow-[0_1.7rem_3.7rem_rgba(0,0,0,0.18)] motion-safe:animate-[nav-image-pop_520ms_cubic-bezier(0.18,1.15,0.3,1)_both] ${frame.className}`}
                style={frame.style}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                  style={frame.imageStyle}
                />
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-[4%] z-10 flex justify-between gap-3 md:hidden">
          {floatingImages.slice(0, 3).map((image, index) => (
            <div
              key={`${activeProject?.slug || "mobile-default"}-${image.url}-${index}`}
              className={[
                "overflow-hidden rounded-[1rem] shadow-[0_1.2rem_2.4rem_rgba(0,0,0,0.18)] motion-safe:animate-[nav-image-pop_520ms_cubic-bezier(0.18,1.15,0.3,1)_both]",
                index === 0 ? "aspect-[0.82/1] w-[30%] rotate-[-7deg]" : "",
                index === 1 ? "mt-8 aspect-[1.5/1] w-[38%] rotate-[5deg]" : "",
                index === 2 ? "aspect-square w-[28%] rotate-[10deg]" : "",
              ].join(" ")}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <img
                src={image.url}
                alt={image.alt}
                draggable={false}
                className="h-full w-full select-none object-cover"
              />
            </div>
          ))}
        </div>

        <div
          className="relative z-20 mx-auto flex min-h-[clamp(27rem,43vw,34rem)] max-w-[50rem] flex-col items-center justify-center pt-[clamp(8rem,13vw,10rem)] md:pt-0"
          onMouseLeave={() => setActiveIndex(null)}
          onPointerLeave={() => setActiveIndex(null)}
        >
          <h2
            className="mb-8 text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
            style={{ color: theme.ink }}
          >
            <span className="block">SCENIC</span>
            <span className="block">DESIGN</span>
          </h2>

          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <Link
                key={project.slug}
                href={getProjectPath(project)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseOver={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className="group py-1 md:py-2"
                style={{
                  color: activeIndex === null || isActive ? theme.ink : theme.muted,
                }}
              >
                <span
                  className="block text-[clamp(1.65rem,3.1vw,3.15rem)] font-black uppercase leading-[0.82] tracking-[0.01em] transition-[opacity,transform] duration-300 group-hover:scale-[1.025]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  {project.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function NavigationArticleCards({ theme }: { theme: HomeColorTheme }) {
  return (
    <section
      className="nav-load-item mx-auto flex w-full max-w-[84rem] items-center justify-center px-5 py-[clamp(4.5rem,8vw,7.5rem)] text-center md:px-8"
      style={{ "--nav-load-delay": "580ms" } as CSSProperties}
      aria-labelledby="navigation-articles"
    >
      <div className="mx-auto w-full">
        <p
          className="mb-7 text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
          style={{ color: theme.ink }}
        >
          ARTICLES
        </p>

        <div className="mx-auto grid max-w-[70rem] gap-4 md:grid-cols-3">
          {featuredArticleLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex min-h-[22rem] flex-col overflow-hidden rounded-[1.25rem] text-left shadow-[0_1.4rem_3rem_rgba(0,0,0,0.11)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:rotate-[-0.45deg] hover:shadow-[0_2rem_4rem_rgba(0,0,0,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
              style={{
                backgroundColor: item.color,
                color: item.textColor,
              }}
            >
              <span className="relative block aspect-[1.25/1] overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    draggable={false}
                    className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : null}
                <span className="absolute inset-0 bg-black/18" />
              </span>
              <span className="flex flex-1 flex-col justify-between p-5">
                <span
                  className="text-[0.66rem] font-black uppercase leading-none tracking-[0.1em]"
                  style={{ color: item.mutedColor, fontFamily: HOME_BODY_FONT }}
                >
                  {item.label}
                </span>
                <span>
                  <span
                    className="block text-[clamp(1.5rem,2.6vw,2.55rem)] font-black uppercase leading-[0.84] tracking-[0]"
                    style={{ fontFamily: HOME_DISPLAY_FONT }}
                  >
                    {item.title}
                  </span>
                  <span
                    className="mt-4 block text-[0.88rem] font-medium leading-[1.28]"
                    style={{ color: item.mutedColor, fontFamily: HOME_BODY_FONT }}
                  >
                    {item.description}
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>

        <Link
          href="/articles"
          className="mt-8 inline-flex rounded-full px-6 py-3 text-[0.78rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
          style={{
            backgroundColor: theme.controlBg,
            color: theme.controlInk,
            fontFamily: HOME_BODY_FONT,
          }}
        >
          READ ARTICLES
        </Link>
      </div>
    </section>
  );
}

function NavigationStudioApps({
  theme,
  onOpenApp,
}: {
  theme: HomeColorTheme;
  onOpenApp: (app: NavigationFeatureItem) => void;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section
      className="nav-load-item mx-auto flex w-full max-w-[74rem] items-center justify-center px-5 py-[clamp(4.5rem,8vw,7.5rem)] text-center md:px-8"
      style={{ "--nav-load-delay": "700ms" } as CSSProperties}
      aria-labelledby="navigation-studio-apps"
    >
      <div
        className="mx-auto flex min-h-[clamp(28rem,46vw,36rem)] max-w-[58rem] flex-col items-center justify-center"
        onMouseLeave={() => setActiveIndex(null)}
        onPointerLeave={() => setActiveIndex(null)}
      >
        <h2
          id="navigation-studio-apps"
          className="mb-7 text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
          style={{ color: theme.ink }}
        >
          STUDIO APPS
        </h2>

        <div className="flex flex-col items-center">
          {studioAppLinks.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => onOpenApp(item)}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseOver={() => setActiveIndex(index)}
                onPointerEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                className="group py-1 text-center md:py-2"
                style={{
                  color: activeIndex === null || isActive ? theme.ink : theme.muted,
                }}
              >
                <span
                  className="block text-[clamp(1.65rem,3.1vw,3.15rem)] font-black uppercase leading-[0.82] tracking-[0.01em] transition-[opacity,transform] duration-300 group-hover:scale-[1.025]"
                  style={{ fontFamily: HOME_DISPLAY_FONT }}
                >
                  {item.title}
                </span>
                <span
                  className={`mx-auto mt-3 block max-w-[32rem] text-[0.86rem] font-medium leading-[1.3] transition-[max-height,opacity] duration-300 ${
                    isActive ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                  }`}
                  style={{ color: theme.muted, fontFamily: HOME_BODY_FONT }}
                >
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href="/studio/apps"
          className="mt-8 inline-flex rounded-full px-6 py-3 text-[0.78rem] font-black uppercase leading-none tracking-[0.04em] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
          style={{
            backgroundColor: theme.controlBg,
            color: theme.controlInk,
            fontFamily: HOME_BODY_FONT,
          }}
        >
          ALL APPS
        </Link>
      </div>
    </section>
  );
}

function NavigationAbout({ theme }: { theme: HomeColorTheme }) {
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const paragraphs = [
    "Brandon PT Davis is a scenic designer whose work explores how space, architecture, and visual storytelling shape the experience of live performance. His designs are grounded in research, collaboration, and the belief that scenery should do more than create a setting—it should reveal character, clarify dramatic action, and give performers a world that evolves with the story. His portfolio spans dramas, comedies, Shakespeare, musicals, and new work for regional theatres, festivals, and universities across the United States.",
    "Professional collaborations include South Coast Repertory, Maples Repertory Theatre, Theatre SilCo, New Swan Shakespeare Festival, Okoboji Summer Theatre, the University of Missouri, and numerous academic and professional productions. Beyond the stage, Brandon spent several years as a designer and Senior Scenic & Experiential Designer at Adaptive Design Services, where he developed environments for live events, branded experiences, and immersive installations. That work expanded his practice into architectural visualization, digital rendering, fabrication workflows, and large-scale experiential design, perspectives that continue to inform his theatrical work.",
    "Alongside his professional practice, Brandon is a Lecturer in the School of Theatre, Television, and Film at San Diego State University. He has previously taught at the University of California, Irvine, the University of Texas at El Paso, and Stephens College, mentoring emerging designers in scenic design, rendering, drafting, digital visualization, and collaborative production. His teaching reflects the same values that guide his design work: curiosity, rigorous research, technical precision, and an ongoing commitment to storytelling through space.",
    "Brandon received his MFA in Scenic Design from the University of California, Irvine and his BFA in Theatre Arts from Stephens College. He has designed more than 130 productions and assisted on over 40 productions at regional theatres and Off-Broadway. He is a member of United Scenic Artists, Local USA 829, and the United States Institute for Theatre Technology (USITT).",
  ];

  return (
    <section
      id="about"
      className="nav-load-item mx-auto flex w-full max-w-[74rem] items-center justify-center px-5 pb-[clamp(6rem,10vw,9rem)] pt-[clamp(3rem,6vw,5rem)] text-center md:px-8"
      style={{ "--nav-load-delay": "340ms" } as CSSProperties}
    >
      <div className="mx-auto max-w-[56rem] space-y-7">
        <h2
          className="text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
          style={{ color: theme.ink }}
        >
          ABOUT
        </h2>
        <div className="mx-auto max-w-[54rem] space-y-5">
          {paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              tabIndex={0}
              onMouseEnter={() => setActiveParagraph(index)}
              onMouseLeave={() => setActiveParagraph(null)}
              onPointerEnter={() => setActiveParagraph(index)}
              onPointerLeave={() => setActiveParagraph(null)}
              onFocus={() => setActiveParagraph(index)}
              onBlur={() => setActiveParagraph(null)}
              className="text-[clamp(1.05rem,1.65vw,1.55rem)] font-semibold leading-[1.22] tracking-[0.005em] transition-colors duration-200 focus-visible:outline-none"
              style={
                {
                  color: activeParagraph === index ? theme.accent : theme.ink,
                } as React.CSSProperties
              }
            >
              {paragraph}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          {[
            { label: "Profile", href: "/about" },
            { label: "Resume", href: "/resume" },
            { label: "Creative", href: "/creative-statement" },
            { label: "Teaching", href: "/about/teaching" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-5 py-3 text-[0.74rem] font-black uppercase leading-none tracking-[0.06em] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
              style={{
                backgroundColor: theme.controlBg,
                color: theme.controlInk,
                fontFamily: HOME_BODY_FONT,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NavigationAppScreen({
  app,
  onBack,
}: {
  app: NavigationFeatureItem | null;
  onBack: () => void;
}) {
  if (!app) return null;

  const frameSrc = `${app.href}?studioFrame=1`;

  return (
    <div
      className="fixed inset-0 z-[2147483646] flex flex-col overflow-hidden bg-[#f3eee4] text-black md:grid md:place-items-center md:bg-black/72 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${app.title} app screen`}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f3eee4] md:h-[min(54rem,88vh)] md:w-full md:max-w-[28rem] md:flex-none md:rounded-[2.4rem] md:border md:border-black/12 md:shadow-[0_34px_140px_rgba(0,0,0,0.42)]">
        <div className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-black/10 bg-[#fbf7ef] px-4 shadow-[inset_0_1px_rgba(255,255,255,0.68)]">
          <button
            type="button"
            onClick={onBack}
            className="flex h-7 w-7 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.16)] transition-transform hover:scale-105"
            style={{
              backgroundColor: app.accentColor || app.color || "#2b2b2b",
              color: app.accentTextColor || app.textColor || "#ffffff",
            }}
            aria-label="Back to navigation"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-black/54">
              {app.shortTitle || app.title}
            </p>
          </div>
          <a
            href={app.href}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-black/46 transition-colors hover:bg-black/6 hover:text-black"
            aria-label={`Open ${app.title} as full page`}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="min-h-0 flex-1 bg-[#f3eee4]">
          <iframe
            key={app.href}
            title={app.title}
            src={frameSrc}
            className="h-full w-full border-0 bg-[#f3eee4]"
            loading="lazy"
            allow="clipboard-write"
          />
        </div>
      </div>
    </div>
  );
}

export default function Navigation({ initialProjects }: NavigationProps) {
  const { homeTheme } = useHomeTheme();
  const [activeStudioApp, setActiveStudioApp] = useState<NavigationFeatureItem | null>(null);
  const [navigationMounted, setNavigationMounted] = useState(false);

  const recentProjects = useMemo(
    () =>
      sortScenicProjectsChronologically(initialProjects)
        .filter((project) => Boolean(project.coverImageUrl))
        .slice(0, 6),
    [initialProjects]
  );
  const sectionCards = useMemo(() => getSectionCards(recentProjects), [recentProjects]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setNavigationMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!activeStudioApp) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveStudioApp(null);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStudioApp]);

  return (
    <div
      data-page-shell="navigation"
      data-navigation-mounted={navigationMounted ? "true" : "false"}
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: homeTheme.bg,
        color: homeTheme.ink,
        fontFamily: HOME_DISPLAY_FONT,
      }}
    >
      <SEO
        title="Navigation | Brandon PT Davis"
        description="A bright navigation page for Brandon PT Davis scenic design portfolio, studio tools, about page, and recent scenic design work."
        keywords="Brandon PT Davis navigation, scenic design portfolio, studio tools, scenic designer"
        url="https://www.brandonptdavis.com/navigation"
      />
      <Header />
      <style>{`
        @keyframes nav-image-pop {
          0% { opacity: 0; transform: scale(0.68) translateY(24px) rotate(-3deg); }
          62% { opacity: 1; transform: scale(1.06) translateY(-8px) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
        }

        @keyframes nav-load-in {
          0% { opacity: 0; transform: translateY(0.75rem) scaleY(0.94); filter: blur(8px); }
          64% { opacity: 1; transform: translateY(-0.16rem) scaleY(1.02); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); filter: blur(0); }
        }

        .nav-load-item {
          opacity: 0;
          transform: translateY(0.75rem) scaleY(0.94);
          transform-origin: bottom;
          will-change: opacity, transform, filter;
        }

        [data-navigation-mounted="true"] .nav-load-item {
          animation: nav-load-in 820ms cubic-bezier(0.16, 1.22, 0.32, 1) both;
          animation-delay: var(--nav-load-delay, 0ms);
        }

        @media (prefers-reduced-motion: reduce) {
          .nav-load-item {
            animation: none !important;
            filter: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>

      <main className="relative z-10">
        <div className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
          <section
            id="navigation-menu"
            className="mx-auto flex w-full max-w-[82rem] flex-col justify-center px-5 pb-[clamp(4rem,7vw,6rem)] pt-[clamp(8rem,12vw,11rem)] md:px-8"
          >
            <div className="mx-auto w-full max-w-[70rem] text-center">
              <h1
                className="nav-load-item mx-auto max-w-full text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
                style={
                  {
                    color: homeTheme.ink,
                    "--nav-load-delay": "120ms",
                  } as CSSProperties
                }
              >
                NAVIGATION
              </h1>
            </div>

            <div
              className="nav-load-item mx-auto mt-12 grid w-full max-w-[62rem] gap-5 md:grid-cols-2"
              style={{ "--nav-load-delay": "220ms" } as CSSProperties}
            >
              {sectionCards.map((card) => (
                <NavigationCard key={card.label} card={card} />
              ))}
            </div>
          </section>

          <NavigationAbout theme={homeTheme} />

          <RecentScenicDesign projects={recentProjects} theme={homeTheme} />

          <NavigationArticleCards theme={homeTheme} />

          <NavigationStudioApps
            theme={homeTheme}
            onOpenApp={setActiveStudioApp}
          />
        </div>

        <Footer
          tone="light"
          variant="immersive"
        />
      </main>

      <NavigationAppScreen
        app={activeStudioApp}
        onBack={() => setActiveStudioApp(null)}
      />
    </div>
  );
}
