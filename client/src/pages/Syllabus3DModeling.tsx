"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SyllabusNav from "@/components/SyllabusNav";
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
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111] [--background:#f1f0ec] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
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
      <SyllabusNav />

      <section className="px-5 pb-16 pt-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:pb-20 md:pt-20">
        <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(22rem,0.34fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <p className="section-kicker text-black/42">Course Syllabus</p>
            <h1 className="mt-6 max-w-[10.5ch] font-sans text-[clamp(3.25rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[0] text-black">
              3D Modeling and Rendering
            </h1>
            <p className="mt-8 max-w-3xl text-[1.18rem] leading-8 tracking-[0] text-black/62 md:text-[1.32rem] md:leading-9">
              THA 211 teaches students how to model, render, and document with clarity, moving
              from software fluency into production-ready scenic design workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/studio/tutorials"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-[0.95rem] font-medium tracking-[0] text-white transition-colors hover:bg-[color-mix(in_oklch,var(--accent-articles)_58%,black)]"
              >
                <span>Vectorworks Tutorials</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/about/teaching"
                className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[0] text-black transition-colors hover:bg-white/80"
              >
                Teaching Context
              </Link>
            </div>
          </div>

          <aside className="rounded-lg bg-white/58 p-6 md:p-7 lg:mt-16">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em] text-black/40">
              Course frame
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/38">
                  Practice
                </dt>
                <dd className="mt-2 text-[1.06rem] leading-7 text-black/72">
                  Vectorworks modeling, rendering, drafting, and file organization.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/38">
                  Method
                </dt>
                <dd className="mt-2 text-[1.06rem] leading-7 text-black/72">
                  Build the model, visualize the design, generate the drawing package.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/38">
                  Semester
                </dt>
                <dd className="mt-2 text-[1.06rem] leading-7 text-black/72">
                  Six projects, ten skill quizzes, 1120 points.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="section-kicker text-foreground/40 md:sticky md:top-32">
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

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
        <div className="mx-auto grid max-w-[88rem] gap-4 lg:grid-cols-2">
          <div className="rounded-lg bg-white/58 p-6 md:p-8">
            <h2 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-black/40">
              Course Objectives
            </h2>
            <div className="mt-6 space-y-4">
              {objectives.map((item) => (
                <p key={item} className="text-[1rem] leading-7 text-black/68">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/58 p-6 md:p-8">
            <h2 className="font-sans text-[0.9rem] font-semibold uppercase tracking-[0.24em] text-black/40">
              Required Tools
            </h2>
            <div className="mt-6 space-y-4">
              {requirements.map((item) => (
                <p key={item} className="text-[1rem] leading-7 text-black/68">
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
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

          <div className="mt-10 space-y-2">
            {evaluation.map(([title, points, description]) => (
              <div
                key={title}
                className="grid gap-3 rounded-lg bg-white/50 px-4 py-5 md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8 md:px-6"
              >
                <p className="font-sans text-[1rem] font-medium tracking-[-0.03em] text-foreground">
                  {title}
                </p>
                <p className="text-[0.98rem] leading-7 text-foreground/54">{points}</p>
                <p className="text-[0.98rem] leading-7 text-foreground/60">{description}</p>
              </div>
            ))}
            <div className="grid gap-3 rounded-lg bg-black px-4 py-5 text-white md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8 md:px-6">
              <p className="font-sans text-[1rem] font-medium tracking-[-0.03em]">
                Total
              </p>
              <p className="text-[0.98rem] leading-7 text-white/68">1120</p>
              <p className="text-[0.98rem] leading-7 text-white/72">Semester total</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-3xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
              Weekly modules.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <div key={module.title} className="rounded-lg bg-white/50 p-5 md:p-6">
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

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-3xl">
            <p className="section-kicker text-foreground/45">
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
            <Link
              href="/studio/tutorials"
              className="group grid gap-6 rounded-lg bg-white/58 px-6 py-8 transition-colors hover:bg-white/78 md:grid-cols-[minmax(0,1fr)_2rem] md:px-10 md:py-10"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] tracking-[-0.01em] text-black/50">
                  <span>Studio Tutorials</span>
                  <span>3D Modeling</span>
                  <span>Rendering</span>
                </div>
                <h3 className="mt-3 font-sans text-[1.65rem] font-medium leading-[1.06] tracking-[-0.035em] text-black transition-colors group-hover:text-black/84">
                  Vectorworks tutorial library
                </h3>
                <p className="mt-3 text-[0.97rem] leading-7 text-black/60">
                  Video lessons covering drafting, hybrid objects, 3D modeling, rendering, and
                  workflow habits that reinforce the course structure.
                </p>
              </div>
              <ArrowRight className="hidden h-5 w-5 text-black/42 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-black md:block" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
        <div className="mx-auto max-w-[88rem]">
          <div className="rounded-lg bg-black px-6 py-16 text-center text-white md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.02] tracking-[-0.06em]">
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
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-white/14"
              >
                <span>See Experiential Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer tone="light" />
    </div>
  );
}
