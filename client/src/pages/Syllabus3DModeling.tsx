"use client";

import { type CSSProperties } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SyllabusNav from "@/components/SyllabusNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeDocumentTheme, useHomeTheme } from "@/lib/homeTheme";
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
  const { homeTheme } = useHomeTheme();
  useHomeDocumentTheme(homeTheme);
  const displayStyle = {
    color: homeTheme.ink,
    fontFamily: HOME_DISPLAY_FONT,
    fontStretch: "condensed",
  } as CSSProperties;
  const mutedStyle = { color: homeTheme.muted } as CSSProperties;
  const panelStyle = {
    backgroundColor: homeTheme.accentSoft,
    color: homeTheme.ink,
  } as CSSProperties;

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={
        {
          backgroundColor: homeTheme.bg,
          color: homeTheme.ink,
          fontFamily: HOME_BODY_FONT,
          "--background": homeTheme.bg,
          "--foreground": homeTheme.ink,
          "--border": homeTheme.ghost,
        } as CSSProperties
      }
    >
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
            <p className="section-kicker" style={mutedStyle}>Course Syllabus</p>
            <h1
              className="mt-6 max-w-[10.5ch] text-[clamp(3.25rem,6.6vw,6.4rem)] font-black uppercase leading-[0.9] tracking-[0]"
              style={displayStyle}
            >
              3D Modeling and Rendering
            </h1>
            <p className="mt-8 max-w-3xl text-[1.08rem] leading-8 tracking-[0] md:text-[1.18rem] md:leading-9" style={mutedStyle}>
              THA 211 teaches students how to model, render, and document with clarity, moving
              from software fluency into production-ready scenic design workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/articles"
                className="inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
              >
                <span>Articles</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <Link
                href="/about/teaching"
                className="inline-flex min-h-11 items-center rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                style={panelStyle}
              >
                Teaching Context
              </Link>
            </div>
          </div>

          <aside className="rounded-[1.65rem] p-6 md:p-7 lg:mt-16" style={panelStyle}>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.22em]" style={mutedStyle}>
              Course frame
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-[0.82rem] font-black uppercase tracking-[0.12em]" style={displayStyle}>
                  Practice
                </dt>
                <dd className="mt-2 text-[1rem] leading-7" style={mutedStyle}>
                  Vectorworks modeling, rendering, drafting, and file organization.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-black uppercase tracking-[0.12em]" style={displayStyle}>
                  Method
                </dt>
                <dd className="mt-2 text-[1rem] leading-7" style={mutedStyle}>
                  Build the model, visualize the design, generate the drawing package.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-black uppercase tracking-[0.12em]" style={displayStyle}>
                  Semester
                </dt>
                <dd className="mt-2 text-[1rem] leading-7" style={mutedStyle}>
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
            <div className="section-kicker md:sticky md:top-32" style={mutedStyle}>
              Overview
            </div>
            <div className="max-w-4xl space-y-8">
              <p className="text-[1.08rem] leading-9 md:text-[1.16rem]" style={mutedStyle}>
                This course serves as an advanced introduction to CAD and 3D visualization for
                theatrical design. Students learn to work in Vectorworks through modeling,
                rendering, hybrid object construction, and drafting generated directly from 3D
                geometry.
              </p>
              <p className="text-[1.02rem] leading-8 md:text-[1.08rem]" style={mutedStyle}>
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
          <div className="rounded-[1.65rem] p-6 md:p-8" style={panelStyle}>
            <h2 className="text-[0.9rem] font-black uppercase tracking-[0.12em]" style={displayStyle}>
              Course Objectives
            </h2>
            <div className="mt-6 space-y-4">
              {objectives.map((item) => (
                <p key={item} className="text-[1rem] leading-7" style={mutedStyle}>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.65rem] p-6 md:p-8" style={panelStyle}>
            <h2 className="text-[0.9rem] font-black uppercase tracking-[0.12em]" style={displayStyle}>
              Required Tools
            </h2>
            <div className="mt-6 space-y-4">
              {requirements.map((item) => (
                <p key={item} className="text-[1rem] leading-7" style={mutedStyle}>
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
            <h2
              className="text-[clamp(1.9rem,3.4vw,2.85rem)] font-black uppercase leading-[0.94] tracking-[0]"
              style={displayStyle}
            >
              Evaluation and project structure.
            </h2>
            <p className="mt-6 text-[1.02rem] leading-8 md:text-[1.08rem]" style={mutedStyle}>
              Students move from skill drills and small assignments into a larger scenic design
              sequence that culminates in a modeled project, rendered imagery, and a drafting
              package derived from that work.
            </p>
          </div>

          <div className="mt-10 space-y-2">
            {evaluation.map(([title, points, description]) => (
              <div
                key={title}
                className="grid gap-3 rounded-[1.25rem] px-4 py-5 md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8 md:px-6"
                style={panelStyle}
              >
                <p className="text-[1rem] font-black uppercase tracking-[0]" style={displayStyle}>
                  {title}
                </p>
                <p className="text-[0.98rem] leading-7" style={mutedStyle}>{points}</p>
                <p className="text-[0.98rem] leading-7" style={mutedStyle}>{description}</p>
              </div>
            ))}
            <div
              className="grid gap-3 rounded-[1.25rem] px-4 py-5 md:grid-cols-[minmax(0,1.25fr)_90px_minmax(0,1.45fr)] md:gap-8 md:px-6"
              style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
            >
              <p className="text-[1rem] font-black uppercase tracking-[0]" style={{ fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }}>
                Total
              </p>
              <p className="text-[0.98rem] leading-7 opacity-80">1120</p>
              <p className="text-[0.98rem] leading-7 opacity-80">Semester total</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
        <div className="mx-auto max-w-[88rem]">
          <div className="max-w-3xl">
            <h2
              className="text-[clamp(1.9rem,3.4vw,2.85rem)] font-black uppercase leading-[0.94] tracking-[0]"
              style={displayStyle}
            >
              Weekly modules.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <div key={module.title} className="rounded-[1.65rem] p-5 md:p-6" style={panelStyle}>
                <h3
                  className="text-[1.28rem] font-black uppercase leading-[0.98] tracking-[0]"
                  style={displayStyle}
                >
                  {module.title}
                </h3>
                <div className="mt-5 space-y-3">
                  {module.weeks.map((week) => (
                    <p key={week} className="text-[1rem] leading-7" style={mutedStyle}>
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
            <p className="section-kicker" style={mutedStyle}>
              Related Articles
            </p>
            <h2
              className="mt-5 text-[clamp(1.9rem,3.4vw,2.85rem)] font-black uppercase leading-[0.94] tracking-[0]"
              style={displayStyle}
            >
              Tutorial videos used alongside this class.
            </h2>
            <p className="mt-6 text-[1.02rem] leading-8 md:text-[1.08rem]" style={mutedStyle}>
              These walkthroughs support the same modeling, rendering, and documentation habits students practice in THA 211, making it easier to review workflows outside class.
            </p>
          </div>

          <div className="mt-8 max-w-5xl">
            <Link
              href="/articles"
              className="group grid gap-6 rounded-[1.65rem] px-6 py-8 transition-transform hover:-translate-y-1 md:grid-cols-[minmax(0,1fr)_2rem] md:px-10 md:py-10"
              style={panelStyle}
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.78rem] uppercase tracking-[0.18em]" style={mutedStyle}>
                  <span>Articles</span>
                  <span>3D Modeling</span>
                  <span>Rendering</span>
                </div>
                <h3
                  className="mt-4 text-[clamp(1.65rem,2.8vw,2.25rem)] font-black uppercase leading-[0.96] tracking-[0]"
                  style={displayStyle}
                >
                  Vectorworks tutorial library
                </h3>
                <p className="mt-4 text-[1rem] leading-7 md:text-[1.05rem]" style={mutedStyle}>
                  Video lessons covering drafting, hybrid objects, 3D modeling, rendering, and
                  workflow habits that reinforce the course structure.
                </p>
              </div>
              <ArrowRight className="hidden h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 md:block" style={{ color: homeTheme.muted }} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
        <div className="mx-auto max-w-[88rem]">
          <div className="rounded-[1.65rem] px-6 py-16 text-center md:px-12 md:py-20" style={panelStyle}>
            <h2
              className="mx-auto max-w-4xl text-[clamp(2rem,3.8vw,3.6rem)] font-black uppercase leading-[0.94] tracking-[0]"
              style={displayStyle}
            >
              Return to teaching philosophy and course context.
            </h2>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/about/teaching"
                className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: homeTheme.controlBg, color: homeTheme.controlInk }}
              >
                <span>Back to Teaching Philosophy</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/syllabus/experiential-design"
                className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[0.9rem] font-black uppercase tracking-[0.02em] transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: homeTheme.bg,
                  color: homeTheme.ink,
                }}
              >
                <span>See Experiential Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer tone="light" backgroundColor={homeTheme.bg} />
    </div>
  );
}
