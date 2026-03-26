"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import { ArrowRight, Download } from "lucide-react";
import { Link } from "wouter";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

const getProjectTimestamp = (project: any) => {
  if (project.year) {
    const monthIndex = project.month ? Math.max(project.month - 1, 0) : 6;
    return new Date(project.year, monthIndex, 1).getTime();
  }

  const fallback = project.updatedAt || project.publishedAt || project.createdAt;
  return fallback ? new Date(fallback).getTime() : 0;
};

export default function TeachingPhilosophy() {
  const scenicDesignProjects = [...getLocalScenicProjects()]
    .filter((project) => !!project.coverImageUrl)
    .sort((a, b) => {
      const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
      if (timeCompare !== 0) return timeCompare;
      return a.title.localeCompare(b.title);
    });

  const heroProject =
    scenicDesignProjects.find((project) => project.featured) || scenicDesignProjects[0];

  const featuredWork =
    scenicDesignProjects.length > 0
      ? [
          scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.14)] || scenicDesignProjects[0],
          scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.48)] || scenicDesignProjects[1],
          scenicDesignProjects[Math.floor(scenicDesignProjects.length * 0.82)] || scenicDesignProjects[2],
        ].filter(
          (project, index, array) =>
            project &&
            !!project.slug &&
            array.findIndex((item) => item?.id === project?.id) === index
        )
      : [];

  const getProjectHref = (project: { discipline?: string | null; slug?: string | null }) => {
    if (!project.slug) return "/projects";
    return project.discipline === "rendering"
      ? `/projects/rendering/${project.slug}`
      : `/project/${project.slug}`;
  };

  const teachingValues = [
    "Build visual rigor alongside professional fluency.",
    "Teach process in a way that still leaves room for discovery.",
    "Prepare students for theatre, entertainment, and adjacent industries.",
  ];

  const teachingExperience = [
    "Stephens College, Lecturer (Remote), 2024 - 2025",
    "Stephens College, Assistant Professor of Scenic Design, 2021 - 2024",
    "University of Texas at El Paso, Visiting Assistant Professor, 2021",
    "University of California, Irvine, Adjunct Lecturer and TA, 2017 - 2020",
  ];

  const coursesTaught = [
    "Scenic Design",
    "Introduction to Scenic Design",
    "Digital Rendering",
    "Entertainment Design and Collaboration",
    "Vectorworks: Drafting and 3D Modeling",
    "Technical Theatre",
    "Properties Supervisor",
  ];

  const syllabusCards = [
    {
      title: "Experiential Design",
      description:
        "Themed entertainment, immersive environments, and commercial storytelling workflows for designers working beyond the stage.",
      href: "/syllabus/experiential-design",
      image: "/assets/teaching/syllabus-experiential-art.png",
    },
    {
      title: "3D Modeling and Rendering",
      description:
        "Vectorworks-based drafting, modeling, rendering, and documentation with an emphasis on professional scenic design workflow.",
      href: "/syllabus/3d-modeling",
      image: "/assets/teaching/syllabus-3d-modeling-art.png",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Teaching Philosophy | Scenic Design Education"
        description="A teaching philosophy centered on scenic design process, professional practice, mentorship, and adaptable design pedagogy."
        keywords="teaching philosophy scenic design, scenic design education, theatre design pedagogy, vectorworks instruction, design mentorship, experiential design syllabus"
        image={heroProject?.coverImageUrl ?? undefined}
        url="https://www.brandonptdavis.com/teaching-philosophy"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
          { name: "Teaching Philosophy", url: "https://www.brandonptdavis.com/teaching-philosophy" },
        ]}
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer and Educator",
          url: "https://www.brandonptdavis.com",
          description:
            "Scenic designer and educator teaching visual storytelling, collaboration, digital workflow, and professional practice for emerging designers.",
          knowsAbout: [
            "Scenic Design Education",
            "Theatre Design Pedagogy",
            "Vectorworks Training",
            "Design Visualization",
            "Professional Development",
            "Mentorship",
          ],
        }}
      />
      <StructuredData
        type="Course"
        course={{
          name: "Scenic Design Pedagogy and Professional Practice",
          description:
            "A teaching framework for scenic design students combining storytelling, drafting, visualization, research, and professional collaboration.",
          url: "https://www.brandonptdavis.com/teaching-philosophy",
          provider: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
            type: "EducationalOrganization",
          },
          teaches: [
            "Scenic design process",
            "Professional collaboration",
            "Vectorworks workflow",
            "Rendering and visualization",
          ],
          inLanguage: "en-US",
          keywords: [
            "scenic design education",
            "teaching philosophy",
            "vectorworks instruction",
          ],
        }}
      />
      <Header />
      <AboutNav />

      <section className="px-6 pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Teaching Philosophy
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            Teaching scenic design through process, rigor, and practice.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            My classroom is built around visual storytelling, technical fluency, and the kind of
            collaborative thinking students need in order to build sustainable creative lives.
          </p>
          <div className="mx-auto mt-10 max-w-4xl">
            <p className="text-[1.18rem] leading-9 text-foreground/76 md:text-[1.3rem]">
              I want students to leave with more than a polished project. They should understand
              how to research, communicate, revise, draft, present, and collaborate with clarity.
              Scenic design education works best when it prepares students for both artistic growth
              and the realities of professional practice.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
              A classroom shaped by structure, adaptability, and real-world design practice.
            </h2>
            <div className="mt-8 space-y-5">
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                My teaching is rooted in theatre, but it speaks to a much wider creative landscape:
                live performance, digital visualization, themed entertainment, and collaborative
                design work that moves fluidly between concept and execution.
              </p>
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                I care about helping students become articulate designers who can generate ideas,
                develop them rigorously, and adapt their process to the demands of different
                collaborators, technologies, and production contexts.
              </p>
            </div>
            <div className="mt-10 space-y-3 border-t border-border/25 pt-8">
              {teachingValues.map((value) => (
                <p
                  key={value}
                  className="font-sans text-[1rem] leading-7 tracking-[-0.02em] text-foreground/78"
                >
                  {value}
                </p>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/20">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={
                  resolveBlobMediaUrl("/assets/about/about-teaching-art.png") ||
                  "/assets/about/about-teaching-art.png"
                }
                alt="Abstract teaching philosophy artwork"
                fill
                unoptimized
                quality={82}
                sizes="(max-width: 1280px) 92vw, 34vw"
                className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.25] rotate-90 object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-18 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Foundation
            </div>
            <div className="max-w-4xl space-y-8">
              <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                I teach scenic design as both an artistic discipline and a professional framework.
                Students need visual literacy, yes, but they also need to understand drafting,
                communication, materials, and how design choices function inside an actual process.
              </p>
              <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                That foundation includes hand sketching, spatial thinking, historical and
                dramaturgical research, and digital workflow. I want students to understand why a
                method exists before they decide how to use it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 py-16 md:py-18">
        <div className="mx-auto max-w-4xl">
          <blockquote className="border-l border-border/35 pl-8 md:pl-10">
            <p className="font-sans text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.05em] text-foreground/90">
              "Students learn best when process becomes visible, repeatable, and flexible."
            </p>
          </blockquote>
        </div>
      </div>

      <section className="px-6 py-18 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Pedagogy
            </div>
            <div className="max-w-4xl space-y-8">
              <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                Different students arrive with different strengths, anxieties, and ways of
                learning. My pedagogy has to meet that reality. I use collaborative projects,
                scaffolded assignments, visual examples, and direct feedback to help students build
                confidence without lowering the level of rigor.
              </p>
              <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                Accessibility matters here too. I try to build courses that give students multiple
                ways into the work, whether that means tactile making, digital tools, iterative
                checkpoints, or supplemental material that helps them stay connected to the
                process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/25 px-6 py-18 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Mentorship
            </div>
            <div className="max-w-5xl">
              <div className="space-y-8">
                <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                  Mentorship is where teaching becomes long-term. I want students to leave with a
                  stronger sense of their own voice, but also with practical habits around
                  communication, resilience, and self-advocacy.
                </p>
                <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  I care about studio culture as much as curriculum. The most meaningful learning
                  often happens in the environments we create around the work, where students feel
                  supported enough to take risks, revise honestly, and learn from each other.
                </p>
              </div>

              <div className="mt-12 grid gap-6 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/25 bg-card/10 p-6">
                  <h3 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                    Teaching Experience
                  </h3>
                  <div className="mt-6 space-y-4">
                    {teachingExperience.map((credit) => (
                      <p key={credit} className="text-[1rem] leading-7 text-foreground/68">
                        {credit}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/25 bg-card/10 p-6">
                  <h3 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-foreground/40">
                    Courses Taught
                  </h3>
                  <div className="mt-6 space-y-4">
                    {coursesTaught.map((course) => (
                      <p key={course} className="text-[1rem] leading-7 text-foreground/68">
                        {course}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-18 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Research
            </div>
            <div className="max-w-4xl space-y-8">
              <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                I think of teaching as research in public. The classroom is where I test new tools,
                update workflows, and ask how emerging technologies actually change what students
                need to know.
              </p>
              <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                That includes AI, rendering platforms, and visualization tools, but always with a
                critical lens. I want students to understand not just what a tool can produce, but
                how it affects authorship, taste, collaboration, and the larger design process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/25 px-6 py-18 md:py-22">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Syllabi
            </div>
            <div>
              <div className="max-w-3xl">
                <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                  Two course structures that show how I organize teaching in practice.
                </h2>
                <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
                  These syllabi translate the philosophy above into actual assignments, software
                  workflows, and project pacing. They show how I balance conceptual thinking with
                  technical fluency and professional expectations.
                </p>
              </div>

              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {syllabusCards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="group block"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-[1rem]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        quality={82}
                        sizes="(max-width: 768px) 92vw, 46vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                          Syllabus
                        </p>
                        <h3 className="mt-2 font-sans text-[1.4rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                          {card.title}
                        </h3>
                        <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-7 text-foreground/60">
                          {card.description}
                        </p>
                      </div>
                      <div className="mt-1 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/35 text-foreground/56 transition-colors group-hover:border-border/55 group-hover:text-foreground md:inline-flex">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredWork.length > 0 && (
        <section className="border-t border-border/25 px-6 py-18 md:py-22">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                Scenic design work that enters the classroom.
              </h2>
              <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
                Production work keeps the teaching current. These projects help shape conversations
                around process, storytelling, drafting, collaboration, and presentation.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredWork.map((project) => (
                <Link key={project.id} href={getProjectHref(project)} className="group block">
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded-[1rem]">
                    <Image
                      src={project.coverImageUrl || ""}
                      alt={project.title}
                      fill
                      quality={82}
                      sizes="(max-width: 768px) 92vw, 31vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="mt-3 font-sans text-[1rem] leading-7 text-foreground/74 transition-colors group-hover:text-foreground">
                    {project.title}
                  </p>
                  {project.client && (
                    <p className="text-[0.95rem] leading-6 text-foreground/48 transition-colors group-hover:text-foreground/62">
                      {project.client}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-y border-border/25 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
              See the scenic design work that informs the classroom.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
              >
                <span>View Portfolio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="/api/teaching-philosophy-pdf"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>Download Teaching Philosophy</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
