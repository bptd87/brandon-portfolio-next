"use client";

import Image from "next/image";
import {
  Drama,
  Music,
  Sparkles,
  Theater,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

import Header from "@/components/Header";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { formatUtcDate } from "@/lib/date-format";
import { getProjectPath } from "@/lib/projectRoutes";
import { sortScenicProjectsChronologically } from "@/lib/scenicShowcase";
import type { ScenicProjectSummary } from "@shared/scenicProjectSummaries";
import { upcomingProductions } from "@shared/upcomingProductions";

const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";
const HOME_CTA_IMAGE_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/migrated/supabase/scenic-projects/project-90053-gallery-150197-48389e80.webp";

const portfolioCategoryRows: Array<{
  title: string;
  match: string[];
  href: string;
  Icon: LucideIcon;
}> = [
  {
    title: "Drama",
    match: ["Drama"],
    href: "/tags/drama",
    Icon: Drama,
  },
  {
    title: "Comedy",
    match: ["Comedy"],
    href: "/tags/comedy",
    Icon: Theater,
  },
  {
    title: "Shakespeare",
    match: ["Shakespeare"],
    href: "/tags/shakespeare",
    Icon: Sparkles,
  },
  {
    title: "Musical",
    match: ["Musical Theatre"],
    href: "/tags/musical-theatre",
    Icon: Music,
  },
  {
    title: "TYA",
    match: ["Theatre for Young Audiences"],
    href: "/tags/theatre-for-young-audiences",
    Icon: UsersRound,
  },
];

function RecentProductionHero({
  projects,
}: {
  projects: ScenicProjectSummary[];
}) {
  const heroProjects = projects
    .filter(project => project.coverImageUrl)
    .slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = heroProjects[activeIndex] || heroProjects[0];

  if (!activeProject) return null;

  return (
    <section className="relative min-h-[calc(100svh-74px)] overflow-hidden border-b border-white/10 bg-background">
      <div className="absolute inset-0">
        {heroProjects.map((project, index) => (
          <Image
            key={project.slug}
            src={project.coverImageUrl || ""}
            alt={`${project.title} scenic design by Brandon PT Davis`}
            fill
            quality={86}
            priority={index === 0}
            sizes="100vw"
            className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[1200ms] ease-out motion-reduce:transition-none ${
              index === activeIndex
                ? "scale-100 opacity-100 brightness-105"
                : "scale-[1.045] opacity-0 brightness-75"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.32)_34%,rgba(0,0,0,0.02)_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/46 to-transparent" />
      </div>

      <div className="relative flex min-h-[calc(100svh-74px)] items-end px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-14 md:pb-14">
        <div className="w-full motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/58">
            Recent Scenic Design
          </p>

          <div className="max-w-[49rem] space-y-1">
            {heroProjects.map((project, index) => {
              const active = index === activeIndex;
              return (
                <a
                  key={project.slug}
                  href={getProjectPath(project)}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className={`group relative block w-fit overflow-hidden pb-1 transition-colors duration-300 ${
                    active ? "text-white" : "text-white/58 hover:text-white"
                  }`}
                >
                  <span className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-sans text-[clamp(1.8rem,4vw,4.15rem)] font-medium leading-[0.94] tracking-[-0.064em] transition-transform duration-500 group-hover:translate-x-1 motion-reduce:transition-none">
                      {project.title}
                    </span>
                    {project.year ? (
                      <span className="font-sans text-[clamp(0.8rem,1.4vw,1.05rem)] font-semibold leading-none tracking-[0.04em] text-white/70">
                        {project.year}
                      </span>
                    ) : null}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-px bg-white transition-transform duration-500 ease-out motion-reduce:transition-none ${
                      active
                        ? "w-full scale-x-100"
                        : "w-full origin-left scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 text-white/64 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="font-sans text-[0.95rem] leading-7 tracking-[-0.01em]">
                {activeProject.client ? `${activeProject.client}. ` : ""}
                Selected work from the current scenic design archive.
              </p>
            </div>
            <a
              href="#portfolio-categories"
              className="group inline-flex w-fit items-center gap-3 font-sans text-sm font-medium uppercase tracking-[0.12em] text-white/72 transition-colors hover:text-white"
            >
              Scroll
              <span
                aria-hidden="true"
                className="text-2xl leading-none transition-transform duration-500 group-hover:translate-y-1"
              >
                ↓
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function PortfolioCategoryRows({
  projects,
}: {
  projects: ScenicProjectSummary[];
}) {
  const rows = portfolioCategoryRows
    .map(row => ({
      ...row,
      projects: projects
        .filter(
          project =>
            project.coverImageUrl &&
            row.match.includes(project.subcategory || "")
        )
        .slice(0, 8),
    }))
    .filter(row => row.projects.length);

  if (!rows.length) return null;

  return (
    <section
      id="portfolio-categories"
      className="border-t border-white/10 py-12 md:py-16"
    >
      <div className="mb-8 px-[clamp(1.5rem,5vw,6rem)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700">
        <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-white/36">
          Brandon PT Davis
        </p>
        <h2 className="max-w-3xl font-sans text-[clamp(1.35rem,2.2vw,2.05rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
          Scenic Design
        </h2>
        <p className="mt-4 max-w-2xl text-[0.95rem] leading-7 tracking-[-0.01em] text-white/52">
          Production environments by Brandon PT Davis, organized across drama,
          comedy, Shakespeare, musicals, and theatre for young audiences.
        </p>
      </div>

      <div className="space-y-12 md:space-y-16">
        {rows.map(row => {
          const Icon = row.Icon;

          return (
            <div key={row.title}>
              <div className="mb-5 flex items-end justify-between gap-5 border-t border-white/10 px-[clamp(1.5rem,5vw,6rem)] pt-5">
                <div>
                  <div className="mb-2 flex items-center gap-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/38">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Scenic Design</span>
                    <span className="text-white/20">|</span>
                    <span>Collection</span>
                  </div>
                  <h3 className="font-sans text-[clamp(1.35rem,2.3vw,2rem)] font-medium leading-[1.02] tracking-[-0.045em] text-white">
                    {row.title}
                  </h3>
                </div>
                <a
                  href={row.href}
                  aria-label={`View ${row.title}`}
                  className="group inline-flex h-10 w-10 shrink-0 items-center justify-center text-2xl leading-none text-white/62 transition-colors hover:text-white"
                >
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </div>

              <div className="overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-5 px-[clamp(1.5rem,5vw,6rem)]">
                  {row.projects.map(project => (
                    <a
                      key={project.slug}
                      href={getProjectPath(project)}
                      className="group relative block w-[82vw] shrink-0 overflow-hidden bg-white/[0.035] md:w-[34rem] xl:w-[40rem]"
                    >
                      <ProgressiveImage
                        src={project.coverImageUrl || ""}
                        alt={`${project.title} scenic design by Brandon PT Davis`}
                        aspectRatio="16 / 9"
                        containerClassName="bg-white/[0.035]"
                        className="h-full w-full object-cover transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.04] group-hover:brightness-110 motion-reduce:transition-none"
                        sizes="(min-width: 1280px) 40rem, (min-width: 768px) 34rem, 82vw"
                        width={980}
                        enableScrollAnimation={false}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
                      <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-700 ease-out group-hover:-translate-y-1 md:p-5 motion-reduce:transition-none">
                        <h4 className="font-sans text-[1.02rem] font-medium leading-[1.04] tracking-[-0.035em] text-white md:text-[1.18rem]">
                          {project.title}
                        </h4>
                        <p className="mt-1 text-[0.82rem] leading-5 text-white/62 transition-opacity duration-500 group-hover:text-white/76">
                          {[project.client, project.year]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-5 bottom-4 h-px origin-left scale-x-0 bg-white/70 transition-transform duration-700 group-hover:scale-x-100"
                      />
                    </a>
                  ))}
                  <a
                    href={row.href}
                    className="flex w-[13rem] shrink-0 items-center justify-center border border-white/12 px-5 text-center font-sans text-sm font-medium text-white/62 transition-colors hover:border-white/28 hover:text-white"
                  >
                    View {row.title}
                    <span aria-hidden="true" className="ml-2">
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        <div className="px-[clamp(1.5rem,5vw,6rem)]">
          <a
            href="/projects"
            className="group inline-flex items-center gap-2 border-t border-white/12 pt-5 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            View full scenic design portfolio
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function BrandonSection() {
  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="grid gap-10 px-[clamp(1.5rem,5vw,6rem)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
            Brandon PT Davis
          </p>
          <h2 className="font-sans text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[0.94] tracking-[-0.065em] text-white">
            Scenic design as atmosphere, architecture, and human behavior.
          </h2>
          <p className="mt-7 max-w-2xl text-[1rem] leading-8 tracking-[-0.01em] text-white/58 md:text-[1.06rem]">
            Brandon's work starts with how people move through a room: what a
            space remembers, what it hides, and how it shapes the rhythm of a
            performance. The portfolio collects production environments,
            renderings, and process images from regional theatre, summer stock,
            and academic stages.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="/about"
              className="group inline-flex items-center gap-2 border-t border-white/18 pt-4 text-sm font-medium text-white/78 transition-colors hover:text-white"
            >
              About Brandon
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="/resume"
              className="group inline-flex items-center gap-2 border-t border-white/10 pt-4 text-sm font-medium text-white/58 transition-colors hover:text-white"
            >
              Resume / CV
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-white/[0.035] lg:justify-self-end">
          <div className="relative aspect-[4/3] w-full lg:w-[min(42vw,44rem)]">
            <img
              src={ABOUT_HEADSHOT_URL}
              alt="Brandon PT Davis - scenic designer"
              className="h-full w-full object-cover object-[50%_16%] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.025] group-hover:brightness-110"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function UpcomingSection() {
  const nextProductions = upcomingProductions.slice(0, 4);

  return (
    <section className="border-t border-white/10 py-16 md:py-24">
      <div className="px-[clamp(1.5rem,5vw,6rem)]">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-white/38">
              Upcoming Productions
            </p>
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[0.96] tracking-[-0.055em] text-white">
              Current scenic design calendar.
            </h2>
          </div>
          <a
            href="/upcoming-productions"
            className="group inline-flex w-fit items-center gap-2 font-sans text-sm font-medium tracking-[-0.01em] text-white/76 transition-colors hover:text-white"
          >
            View calendar
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              -&gt;
            </span>
          </a>
        </div>

        <div className="divide-y divide-white/12 border-y border-white/12">
          {nextProductions.map(production => (
            <a
              key={production.id}
              href={`/upcoming-productions/${production.id}`}
              className="group grid gap-5 py-5 transition-colors hover:bg-white/[0.025] md:grid-cols-[minmax(0,1fr)_auto] md:items-center"
            >
              <div>
                <p className="font-sans text-[1.45rem] font-medium leading-[1.02] tracking-[-0.05em] text-white transition-transform duration-500 group-hover:translate-x-1 md:text-[1.9rem]">
                  {production.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-white/48">
                  {production.company} · Directed by {production.director}
                </p>
              </div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white/46">
                {formatUtcDate(production.startDate, "short")} -{" "}
                {formatUtcDate(production.endDate, "short")}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCta() {
  return (
    <section className="group relative min-h-[72svh] overflow-hidden border-t border-white/10 bg-black">
      <img
        src={HOME_CTA_IMAGE_URL}
        alt="The Merry Wives of Windsor scenic design detail by Brandon PT Davis"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/28" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.42)_36%,rgba(0,0,0,0.08)_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/42 to-transparent" />

      <div className="relative flex min-h-[72svh] items-end px-[clamp(1.5rem,5vw,6rem)] pb-12 pt-24 md:pb-16">
        <div className="max-w-3xl">
          <p className="mb-4 font-sans text-[10px] font-semibold uppercase tracking-[0.26em] text-white/46">
            Portfolio / Contact
          </p>
          <h2 className="font-sans text-[clamp(2.6rem,5.8vw,6.2rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">
            Start with the space.
          </h2>
          <p className="mt-5 max-w-xl text-[0.98rem] leading-7 tracking-[-0.01em] text-white/64 md:text-[1.05rem]">
            Explore the scenic design archive or start a conversation about a
            production, collaboration, or upcoming design process.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            <a
              href="/contact"
              className="group inline-flex items-center gap-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-white/72 transition-colors hover:text-white"
            >
              Contact
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
            <a
              href="/projects"
              className="group inline-flex items-center gap-2 font-sans text-[1rem] font-medium tracking-[-0.02em] text-white/52 transition-colors hover:text-white"
            >
              View Portfolio
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home({
  initialProjects,
}: {
  initialProjects: ScenicProjectSummary[];
}) {
  const projects = sortScenicProjectsChronologically(initialProjects);
  const projectsLoading = false;
  const featuredProject =
    projects.find(project => project.coverImageUrl) || projects[0];
  return (
    <>
      <SEO
        title="Brandon PT Davis | Scenic Designer"
        description="San Diego-based union scenic designer creating story-driven environments for regional theatre, summer stock, and academic production."
        keywords="scenic designer, scenic design portfolio, USA 829 scenic designer, San Diego scenic designer, Southern California scenic designer, regional theatre design, stage design, Brandon PT Davis"
        image={featuredProject?.coverImageUrl || undefined}
        imageAlt={
          featuredProject
            ? `${featuredProject.title} scenic design cover image`
            : "Brandon PT Davis scenic design portfolio"
        }
        url="https://www.brandonptdavis.com"
      />

      <Header />

      <main>
        {projectsLoading ? (
          <ProjectGridSkeleton />
        ) : featuredProject ? (
          <>
            <RecentProductionHero projects={projects} />
            <PortfolioCategoryRows projects={projects} />
            <BrandonSection />
            <UpcomingSection />
            <HomeCta />
          </>
        ) : null}
      </main>
    </>
  );
}
