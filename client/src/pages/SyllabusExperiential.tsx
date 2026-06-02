"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SyllabusNav from "@/components/SyllabusNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { getLocalArticles } from "@shared/localArticles";

const objectives = [
  "Develop design concepts for themed and non-traditional environments.",
  "Translate client goals into spatial storytelling decisions.",
  "Visualize experiential ideas through digital modeling and rendering.",
  "Understand commercial design workflow, presentation, and collaboration.",
];

const software = [
  "Vectorworks and SketchUp for 3D modeling",
  "Twinmotion for real-time visualization",
  "Adobe Creative Cloud for presentation and image work",
];

const evaluation = [
  ["Guest Presenter Evaluations", "200", "Written responses to four industry guest lectures."],
  ["Project 1: Theme Park R&D", "50", "Initial research and concept development for a park zone."],
  ["Project 2: Themed Maze", "300", "Midterm attraction design focused on layout, flow, and experience."],
  ["Project 3: Mascot Design", "100", "Character design with branding integration."],
  ["Project 4: Arena Remodel", "100", "Renovation concept for a sports and entertainment venue."],
  ["Project 5: Restaurant", "550", "Semester-long final project with treatment, updates, and final pitch."],
];

const modules = [
  {
    title: "Foundations of Immersive Design",
    weeks: [
      "Week 1: Introduction to themed entertainment and industry history",
      'Week 2: Concept development and "blue sky" ideation',
      "Week 3: Presentation techniques for commercial clients",
    ],
  },
  {
    title: "Spatial Design and Visualization",
    weeks: [
      "Week 4: SketchUp and 3D modeling review, plus themed maze launch",
      "Week 5: Twinmotion workshop and rendering workflows",
      "Week 6: Lighting and sound integration for immersive environments",
    ],
  },
  {
    title: "Character and Brand Integration",
    weeks: [
      "Week 7: Character and costume design in commercial spaces",
      "Week 8: Midterm critiques for mascot design and branding",
    ],
  },
  {
    title: "Large-Scale Environments",
    weeks: [
      "Week 9: Arena remodel and crowd-flow analysis",
      "Week 10: Feedback and critique on arena concepts",
    ],
  },
  {
    title: "Capstone Collaboration",
    weeks: [
      "Week 12: Restaurant project launch with concept and menu narrative",
      "Week 13: Initial design pitch and simulated client meeting",
      "Week 14: Drafting and 3D development",
      "Week 15: Preliminary review",
      "Week 16: Final design deck, renders, and walkthroughs",
    ],
  },
];

export default function SyllabusExperiential() {
  const featuredCourseArticle = getLocalArticles().find(
    (article) => article.slug === "studio-ghibli-inspired-immersive-dining-experience"
  );

  return (
    <div className="min-h-screen bg-[#f1f0ec] text-[#111111] [--background:#f1f0ec] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title="Experiential Design Syllabus"
        description="Course syllabus for experiential design: themed entertainment, immersive environments, and commercial storytelling workflows."
        url="https://www.brandonptdavis.com/syllabus/experiential-design"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Syllabus", url: "https://www.brandonptdavis.com/syllabus/experiential-design" },
          { name: "Experiential Design", url: "https://www.brandonptdavis.com/syllabus/experiential-design" },
        ]}
      />
      <StructuredData
        type="Course"
        course={{
          name: "Experiential Design",
          description:
            "Course connecting theatrical design methods to themed entertainment, immersive environments, and commercial storytelling spaces.",
          url: "https://www.brandonptdavis.com/syllabus/experiential-design",
          provider: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
            type: "EducationalOrganization",
          },
          teaches: [
            "Themed entertainment concept development",
            "Guest flow and spatial storytelling",
            "Client presentation workflow",
            "Commercial design collaboration",
          ],
          inLanguage: "en-US",
          keywords: [
            "experiential design course",
            "themed entertainment education",
            "immersive design syllabus",
          ],
        }}
      />
      <Header />
      <SyllabusNav />

      <section className="px-5 pb-16 pt-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:pb-20 md:pt-20">
        <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,0.6fr)_minmax(22rem,0.34fr)] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <p className="section-kicker text-black/42">Course Syllabus</p>
            <h1 className="mt-6 max-w-[9.5ch] font-sans text-[clamp(3.7rem,8vw,7.8rem)] font-semibold leading-[0.9] tracking-[0] text-black">
              Experiential Design
            </h1>
            <p className="mt-8 max-w-3xl text-[1.18rem] leading-8 tracking-[0] text-black/62 md:text-[1.32rem] md:leading-9">
              Commercial storytelling through space, audience, and experience. The course asks
              scenic designers to apply theatrical methods to themed entertainment, museums,
              restaurants, and brand-centered environments.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/articles?category=Themed%20Entertainment"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-black px-5 text-[0.95rem] font-medium tracking-[0] text-white transition-colors hover:bg-[color-mix(in_oklch,var(--accent-articles)_58%,black)]"
              >
                <span>Course Materials</span>
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
                  Themed entertainment, immersive environments, commercial storytelling.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/38">
                  Method
                </dt>
                <dd className="mt-2 text-[1.06rem] leading-7 text-black/72">
                  Concept research, guest flow, client presentation, and visual pitch work.
                </dd>
              </div>
              <div>
                <dt className="text-[0.82rem] font-medium uppercase tracking-[0.14em] text-black/38">
                  Semester
                </dt>
                <dd className="mt-2 text-[1.06rem] leading-7 text-black/72">
                  Five projects, four guest responses, 1300 points.
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
                Using theatre design skills, this course bridges the world of commercial design:
                theme parks, restaurants, museums, interactive installations, and other
                environments centered on storytelling or concept-based communication.
              </p>
              <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                Students are asked to embrace the specific constraints of commercial work,
                including integration, longevity, audience engagement, and the translation of ideas
                into a pitchable, client-ready format.
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
              Software and Materials
            </h2>
            <div className="mt-6 space-y-4">
              {software.map((item) => (
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
              The semester builds through increasingly complex projects, ending in a final
              collaboration that asks students to synthesize concept, branding, visualization, and
              presentation.
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
              <p className="text-[0.98rem] leading-7 text-white/68">1300</p>
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

      {featuredCourseArticle ? (
        <section className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
          <div className="mx-auto max-w-[88rem]">
            <div className="max-w-3xl">
              <p className="section-kicker text-foreground/40">
                Featured Course Article
              </p>
              <h2 className="mt-5 font-sans text-[clamp(2rem,4vw,3.1rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                Student work from this class, documented as a full themed entertainment studio project.
              </h2>
              <p className="mt-6 text-[1.04rem] leading-8 text-foreground/60 md:text-[1.1rem]">
                This article follows the Studio Ghibli-inspired immersive dining project developed by
                Stephens students in the experiential design course, showing how the class moves from
                concept development into collaborative world-building, visualization, and pitch-ready
                presentation.
              </p>
            </div>

            <div className="mt-10">
              <Link
                href={`/articles/${featuredCourseArticle.slug}`}
                className="group grid gap-6 rounded-lg bg-white/58 px-6 py-8 transition-colors hover:bg-white/78 md:grid-cols-[minmax(0,1fr)_2rem] md:px-10 md:py-10"
              >
                <div className="max-w-4xl">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.78rem] uppercase tracking-[0.18em] text-black/42">
                    <span>{featuredCourseArticle.categoryName}</span>
                    <span>{formatUtcDate(featuredCourseArticle.publishedAt, "short")}</span>
                  </div>
                  <h3 className="mt-4 font-sans text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.02] tracking-[-0.05em] text-black">
                    {featuredCourseArticle.title}
                  </h3>
                  <p className="mt-4 text-[1rem] leading-7 text-black/62 md:text-[1.05rem]">
                    {featuredCourseArticle.excerpt}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[0.98rem] font-medium tracking-[-0.02em] text-black">
                    <span>Read the full project article</span>
                  </div>
                </div>
                <ArrowRight className="hidden h-5 w-5 text-black/42 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-black md:block" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

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
                href="/syllabus/3d-modeling"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-white transition-colors hover:bg-white/14"
              >
                <span>See 3D Modeling Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer tone="light" />
    </div>
  );
}
