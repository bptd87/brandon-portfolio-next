"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const objectives = [
  "Build complex scenic environments through a 3D-first workflow in Vectorworks.",
  "Visualize design concepts with rendering and real-time presentation tools.",
  "Generate plans, sections, elevations, and documentation from modeled geometry.",
  "Organize files, layers, classes, and viewports for collaborative production use.",
];

const requirements = [
  "Vectorworks 2024 educational license",
  "Twinmotion for real-time rendering",
  "3-button mouse for efficient modeling workflow",
];

const evaluation = [
  ["Weekly Skill Quizzes", "120", "Ten technical quizzes covering tools, palettes, and standards."],
  ["Assignments 1-3", "150", "Initial setup, 3D primitives, and rendering basics."],
  ["Project 1: 3D Object", "100", "Prop and object modeling through solids workflow."],
  ["Project 2: Sitcom Set", "200", "Midterm interior set using architectural and hybrid objects."],
  ["Project 3: Conceptual Research", "100", "Research and concept development for Wait Until Dark."],
  ["Project 4: Scenic Model", "100", "Full digital model of the set."],
  ["Project 5: Visualization", "100", "Rendered images with lighting, texturing, and atmosphere."],
  ["Project 6: Drafting Package", "350", "Final ground plan, section, and elevations pulled from the 3D model."],
];

const modules = [
  {
    title: "The Vectorworks Environment",
    weeks: [
      "Week 1: Interface, workspaces, and drafting standards",
      "Week 2: 3D tools including extrude, sweep, and loft",
      "Week 3: Complex modeling and solids workflow",
    ],
  },
  {
    title: "Architectural Modeling",
    weeks: [
      "Week 4: Hybrid objects including walls, doors, and windows",
      "Week 5: Resource Manager and symbol creation",
      'Week 6: "My Life" sitcom set with emphasis on clean geometry and file organization',
    ],
  },
  {
    title: "Theatrical Application",
    weeks: [
      "Week 7: Script analysis and research for Wait Until Dark",
      "Week 8: Twinmotion integration and export workflow",
      "Week 9: Building the digital model with stairs, masking, and scenic elements",
    ],
  },
  {
    title: "Rendering and Documentation",
    weeks: [
      "Week 12: Advanced texturing and lighting in Renderworks",
      "Week 13: Generating viewports and cutting sections from the model",
      "Week 14: Dimensioning and annotation standards",
      "Week 15: Compiling the final drafting package for print and PDF delivery",
    ],
  },
];

export default function Syllabus3DModeling() {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="THA 211 | 3D Modeling and Rendering Syllabus"
        description="Course syllabus for THA 211: Vectorworks for theatrical design, covering 3D modeling, rendering, and drafting documentation."
        url="https://www.brandonptdavis.com/syllabus/3d-modeling"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Syllabus", url: "https://www.brandonptdavis.com/syllabus/3d-modeling" },
          { name: "3D Modeling and Rendering", url: "https://www.brandonptdavis.com/syllabus/3d-modeling" },
        ]}
      />
      <StructuredData
        type="Course"
        course={{
          name: "THA 211: 3D Modeling and Rendering",
          courseCode: "THA 211",
          description:
            "Advanced CAD and 3D visualization course using Vectorworks and Twinmotion for theatrical design workflows.",
          url: "https://www.brandonptdavis.com/syllabus/3d-modeling",
          provider: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
            type: "EducationalOrganization",
          },
          teaches: [
            "3D scenic modeling in Vectorworks",
            "Renderworks and Twinmotion visualization",
            "Construction drawing generation",
            "Layer and class management for collaboration",
          ],
          inLanguage: "en-US",
          keywords: [
            "Vectorworks course",
            "scenic design training",
            "theatrical drafting",
            "rendering workflow",
          ],
        }}
      />
      <Header />
      <AboutNav />

      <section className="px-6 pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Course Syllabus
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            3D Modeling and Rendering
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            THA 211: Vectorworks for theatrical design, centered on modeling, visualization, and
            production-ready drafting workflow.
          </p>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 xl:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.95fr)]">
          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
              Teaching students how to model, render, and document with clarity.
            </h2>
            <div className="mt-8 space-y-5">
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                This course moves beyond introductory drafting into a full 3D scenic design
                workflow. Students build digital environments, learn how to visualize them, and
                understand how those models become real production documents.
              </p>
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                The emphasis is not just software knowledge, but professional organization:
                geometry, layers, classes, rendering logic, and the transition from design model to
                clear drafting output.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/studio/tutorials"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
              >
                <span>View Vectorworks Tutorials</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden border border-border/30 bg-card/20">
            <div className="relative aspect-square w-full">
              <Image
                src="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/teaching/syllabus-3d-modeling-art.png"
                alt="3D modeling syllabus artwork"
                fill
                quality={82}
                sizes="(max-width: 1280px) 92vw, 34vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

      </section>

      <section className="px-6 py-18 md:py-22">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Overview
            </div>
            <div className="max-w-4xl space-y-8">
              <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                This course serves as an advanced introduction to CAD and 3D visualization for
                theatrical design. Students learn to work in Vectorworks through modeling,
                rendering, hybrid object construction, and drafting generated directly from 3D
                geometry.
              </p>
              <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                The course is organized around workflow rather than isolated software tricks.
                Students move from interface fluency to architectural tools, theatrical modeling,
                lighting and texturing, and finally into a clear set of professional drawing
                deliverables.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/25 px-6 py-18 md:py-22">
        <div className="mx-auto max-w-[88rem] grid gap-10 lg:grid-cols-2">
          <div className="rounded-[1.5rem] border border-border/25 bg-card/10 p-6 md:p-8">
            <h2 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-foreground/40">
              Course Objectives
            </h2>
            <div className="mt-6 space-y-4">
              {objectives.map((item) => (
                <p key={item} className="text-[1rem] leading-7 text-foreground/68">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-border/25 bg-card/10 p-6 md:p-8">
            <h2 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-foreground/40">
              Required Tools
            </h2>
            <div className="mt-6 space-y-4">
              {requirements.map((item) => (
                <p key={item} className="text-[1rem] leading-7 text-foreground/68">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-18 md:py-22">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-3xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
              Evaluation and project structure.
            </h2>
            <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
              Students move from skill drills and small assignments into a larger scenic design
              sequence that culminates in a modeled project, rendered imagery, and a drafting
              package derived from that work.
            </p>
          </div>

          <div className="mt-10 border-t border-border/25">
            {evaluation.map(([title, points, description]) => (
              <div
                key={title}
                className="grid gap-3 border-b border-border/20 py-5 md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8"
              >
                <p className="font-sans text-[1rem] font-medium tracking-[-0.03em] text-foreground">
                  {title}
                </p>
                <p className="text-[0.98rem] leading-7 text-foreground/54">{points}</p>
                <p className="text-[0.98rem] leading-7 text-foreground/60">{description}</p>
              </div>
            ))}
            <div className="grid gap-3 py-5 md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8">
              <p className="font-sans text-[1rem] font-medium tracking-[-0.03em] text-foreground">
                Total
              </p>
              <p className="text-[0.98rem] leading-7 text-foreground/54">1120</p>
              <p className="text-[0.98rem] leading-7 text-foreground/60">Semester total</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border/25 px-6 py-18 md:py-22">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-3xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
              Weekly modules.
            </h2>
          </div>

          <div className="mt-10 space-y-10">
            {modules.map((module) => (
              <div key={module.title} className="border-t border-border/20 pt-6">
                <h3 className="font-sans text-[1.35rem] font-medium leading-[1.1] tracking-[-0.04em] text-foreground">
                  {module.title}
                </h3>
                <div className="mt-5 space-y-3">
                  {module.weeks.map((week) => (
                    <p key={week} className="text-[1rem] leading-7 text-foreground/62">
                      {week}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-4 pt-2 md:pb-6 md:pt-4">
        <div className="mx-auto max-w-[88rem] border-t border-border/20 pt-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
              Related Tutorials
            </p>
            <h2 className="mt-4 font-sans text-[clamp(1.8rem,3.6vw,2.8rem)] font-medium leading-[1] tracking-[-0.045em] text-foreground">
              Tutorial videos used alongside this class.
            </h2>
            <p className="mt-5 text-[1rem] leading-7 text-foreground/60 md:text-[1.05rem]">
              These walkthroughs support the same modeling, rendering, and documentation habits students practice in THA 211, making it easier to review workflows outside class.
            </p>
          </div>

          <div className="mt-8 max-w-5xl">
            <Link href="/studio/tutorials" className="group block">
              <div className="grid gap-5 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:items-start">
                <div className="relative aspect-square overflow-hidden border border-border/35 bg-card/20">
                  <Image
                    src="https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/studio/studio-tutorials-cover.png"
                    alt="Vectorworks tutorials used in THA 211"
                    fill
                    quality={80}
                    sizes="(max-width: 640px) 42vw, 8.5rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-foreground/50">
                    <span>Studio Tutorials</span>
                    <span>3D Modeling</span>
                    <span>Rendering</span>
                  </div>
                  <h3 className="mt-3 font-sans text-[1.3rem] font-medium leading-[1.06] tracking-[-0.035em] text-foreground transition-colors group-hover:text-foreground/84">
                    Vectorworks tutorial library
                  </h3>
                  <p className="mt-3 text-[0.97rem] leading-7 text-foreground/60">
                    Video lessons covering drafting, hybrid objects, 3D modeling, rendering, and workflow habits that reinforce the course structure.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-border/25 px-6 py-20 md:py-24">
        <div className="mx-auto max-w-[88rem]">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
              Return to teaching philosophy and course context.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/about/teaching"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
              >
                <span>Back to Teaching Philosophy</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/syllabus/experiential-design"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14"
              >
                <span>See Experiential Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
