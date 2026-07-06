"use client";

import { useMemo, useState } from "react";
import { Link } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import {
  HOME_DISPLAY_FONT,
  type HomeColorTheme,
  useHomeTheme,
} from "@/lib/homeTheme";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import type { LocalScenicProject } from "@shared/localScenicProjects";

const ABOUT_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

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
      background: "#496784",
      text: "#f7f7f2",
      accent: "#b9d8ef",
    },
    {
      label: "ABOUT",
      href: "/about",
      image: ABOUT_IMAGE_URL,
      items: ["Resume", "Creative Statement", "Teaching"],
      background: "#b2633f",
      text: "#fff8e7",
      accent: "#efbd9b",
    },
    {
      label: "STUDIO",
      href: "/studio",
      image: "/assets/studio-apps/icons/scenic-3d-converter-card-2026.jpg",
      items: ["Articles", "Apps"],
      background: "#62764c",
      text: "#fff8e7",
      accent: "#c8dca8",
    },
    {
      label: "INSTAGRAM",
      href: "https://www.instagram.com/brandonptdavisdesign/",
      image: instagramImage,
      items: [],
      note: "@brandonptdavisdesign",
      external: true,
      background: "#d39a24",
      text: "#17120a",
      accent: "#f7df9f",
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
  const activeImages = useMemo(() => {
    const mediaImages =
      activeProject?.media
        .filter((item) => item.type === "image" && item.imageUrl)
        .map((item) => ({
          url: item.imageUrl || "",
          alt: item.altText,
        })) || [];

    const fallbackImage = activeProject?.coverImageUrl
      ? [
          {
            url: activeProject.coverImageUrl,
            alt: `${activeProject.title} scenic design`,
          },
        ]
      : [];

    return [...mediaImages, ...fallbackImage].slice(0, 3);
  }, [activeProject]);

  if (!projects.length) return null;

  return (
    <section
      id="recent-scenic-design"
      className="relative mx-auto flex w-full max-w-[92rem] flex-col items-center justify-center overflow-hidden px-5 pb-[clamp(5rem,8vw,7rem)] pt-[clamp(4rem,7vw,6rem)] text-center md:px-8"
    >
      <div className="relative z-10 mb-[-0.5rem] aspect-square w-[clamp(7rem,13vw,10.5rem)]">
        {activeProject && activeImages[1] ? (
          <div
            className="h-full w-full overflow-hidden rounded-[1.15rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.16)]"
            style={{
              filter: "saturate(1.14)",
              transform: "rotate(6deg)",
            }}
          >
            <img
              src={activeImages[1].url}
              alt={activeImages[1].alt}
              draggable={false}
              className="h-full w-full select-none object-cover motion-safe:animate-[nav-image-pop_420ms_cubic-bezier(0.18,1.15,0.3,1)_both]"
              style={{
                objectPosition: activeProject.coverImagePosition || "center",
              }}
            />
          </div>
        ) : null}
      </div>
      <h2
        className="relative z-20 text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
        style={{ color: theme.ink }}
      >
        DESIGN
      </h2>

      <div className="relative mt-8 grid min-h-[24rem] w-full max-w-[76rem] grid-cols-1 items-center gap-8 md:grid-cols-[13rem_minmax(0,1fr)_13rem] md:gap-10">
        <div className="pointer-events-none relative z-10 mx-auto hidden aspect-square w-full max-w-[11rem] md:block">
          {activeProject && activeImages[0] ? (
            <div className="h-full w-full overflow-hidden rounded-[1.15rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.16)]">
              <img
                src={activeImages[0].url}
                alt={activeImages[0].alt}
                draggable={false}
                className="h-full w-full select-none object-cover motion-safe:animate-[nav-image-pop_420ms_cubic-bezier(0.18,1.15,0.3,1)_both]"
                style={{
                  objectPosition: activeProject.coverImagePosition || "center",
                }}
              />
            </div>
          ) : null}
        </div>

        <div
          className="relative z-20 mx-auto flex max-w-[42rem] flex-col"
          onMouseLeave={() => setActiveIndex(null)}
          onPointerLeave={() => setActiveIndex(null)}
        >
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

        <div className="pointer-events-none relative z-10 mx-auto hidden aspect-square w-full max-w-[11rem] md:block">
          {activeProject && activeImages[2] ? (
            <div className="h-full w-full overflow-hidden rounded-[1.15rem] shadow-[0_2rem_4rem_rgba(0,0,0,0.16)]">
              <img
                src={activeImages[2].url}
                alt={activeImages[2].alt}
                draggable={false}
                className="h-full w-full select-none object-cover motion-safe:animate-[nav-image-pop_420ms_cubic-bezier(0.18,1.15,0.3,1)_both]"
                style={{
                  objectPosition: activeProject.coverImagePosition || "center",
                  animationDelay: "140ms",
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function NavigationAbout({ theme }: { theme: HomeColorTheme }) {
  const [activeParagraph, setActiveParagraph] = useState<number | null>(null);
  const paragraphs = [
    "Brandon PT Davis is a scenic designer based in San Diego. He designs spaces for theatre that are clear, playable, and built around the needs of the story. His work ranges from intimate interiors to larger theatrical worlds, with an emphasis on strong composition and practical stage use.",
    "He is interested in how scenery shapes the way performers move, enter, wait, hide, gather, and leave. His process often begins with the physical life of a scene, then builds outward into research, sketches, renderings, drafting, and collaboration with the full production team.",
    "Brandon has worked with South Coast Repertory, Maples Repertory Theatre, Theatre SilCo, New Swan Shakespeare Festival, and Okoboji Summer Theatre.",
  ];

  return (
    <section
      id="about"
      className="mx-auto flex w-full max-w-[74rem] items-center justify-center px-5 pb-[clamp(6rem,10vw,9rem)] pt-[clamp(3rem,6vw,5rem)] text-center md:px-8"
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
      </div>
    </section>
  );
}

export default function Navigation({ initialProjects }: NavigationProps) {
  const { homeTheme } = useHomeTheme();

  const recentProjects = useMemo(
    () =>
      sortScenicProjectsChronologically(initialProjects)
        .filter((project) => Boolean(project.coverImageUrl))
        .slice(0, 6),
    [initialProjects]
  );
  const sectionCards = useMemo(() => getSectionCards(recentProjects), [recentProjects]);

  return (
    <div
      data-page-shell="navigation"
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
      `}</style>

      <main className="relative z-10">
        <div className="relative z-10" style={{ backgroundColor: homeTheme.bg }}>
          <section
            id="navigation-menu"
            className="mx-auto flex w-full max-w-[82rem] flex-col justify-center px-5 pb-[clamp(4rem,7vw,6rem)] pt-[clamp(8rem,12vw,11rem)] md:px-8"
          >
            <div className="mx-auto w-full max-w-[70rem] text-center">
              <h1
                className="mx-auto max-w-full text-[clamp(2rem,4.2vw,3.6rem)] font-semibold uppercase leading-[0.9] tracking-[0.01em]"
                style={{ color: homeTheme.ink }}
              >
                NAVIGATION
              </h1>
            </div>

            <div className="mx-auto mt-12 grid w-full max-w-[62rem] gap-5 md:grid-cols-2">
              {sectionCards.map((card) => (
                <NavigationCard key={card.label} card={card} />
              ))}
            </div>
          </section>

          <RecentScenicDesign projects={recentProjects} theme={homeTheme} />

          <NavigationAbout theme={homeTheme} />
        </div>

        <Footer
          tone="light"
          variant="immersive"
        />
      </main>
    </div>
  );
}
