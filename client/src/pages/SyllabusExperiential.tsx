"use client";

import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { formatUtcDate } from "@/lib/date-format";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
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
    <div className="min-h-screen bg-background">
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
      <AboutNav />

      <section className="px-6 pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Course Syllabus
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            Experiential Design
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            Bridging theatrical design methods with themed entertainment, immersive environments,
            museums, restaurants, and brand storytelling spaces.
          </p>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 xl:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.05fr)]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/20">
            <div className="relative aspect-square w-full">
              <Image
                src="/assets/teaching/syllabus-experiential-art.png"
                alt="Experiential design syllabus artwork"
                fill
                quality={82}
                sizes="(max-width: 1280px) 92vw, 34vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="max-w-2xl">
            <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
              Commercial storytelling through space, audience, and experience.
            </h2>
            <div className="mt-8 space-y-5">
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                This course asks scenic designers to apply their skills beyond the stage. Students
                think through story, circulation, branding, environment, and client-facing
                presentation as part of a more expansive design practice.
              </p>
              <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                The work moves between concept development and professional pitching, with projects
                that reflect the layered constraints of long-term public spaces and experience-based
                design.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="/articles?category=Themed%20Entertainment"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-black transition-colors hover:bg-white/92"
              >
                <span>View Course Materials</span>
                <ArrowRight className="h-4 w-4" />
              </a>
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
              Software and Materials
            </h2>
            <div className="mt-6 space-y-4">
              {software.map((item) => (
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
              The semester builds through increasingly complex projects, ending in a final
              collaboration that asks students to synthesize concept, branding, visualization, and
              presentation.
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
              <p className="text-[0.98rem] leading-7 text-foreground/54">1300</p>
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

      {featuredCourseArticle ? (
        <section className="border-t border-border/25 px-6 py-18 md:py-22">
          <div className="mx-auto max-w-[88rem]">
            <div className="max-w-3xl">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
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
                className="group block overflow-hidden rounded-[1.75rem] border border-border/25 bg-card/10 transition-colors hover:border-border/40 hover:bg-card/14"
              >
                <div className="overflow-hidden rounded-t-[1.75rem] border-b border-border/20 bg-card/20">
                  <div className="mx-auto max-w-6xl">
                    <div className="relative aspect-[16/8] w-full">
                      <Image
                        src={
                          resolveBlobMediaUrl("https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/ghibli/9e1774_178b77734f664399ad1781073a591459.jpg") ||
                          "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/article-images/ghibli/9e1774_178b77734f664399ad1781073a591459.jpg"
                        }
                        alt="Theatre design students behind the Studio Ghibli-inspired immersive dining project."
                        fill
                        quality={82}
                        sizes="100vw"
                        className="rounded-t-[1.75rem] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>

                <div className="px-6 py-8 md:px-10 md:py-10">
                  <div className="mx-auto max-w-3xl text-center">
                    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[0.78rem] uppercase tracking-[0.18em] text-foreground/42">
                      <span>{featuredCourseArticle.categoryName}</span>
                      <span>{formatUtcDate(featuredCourseArticle.publishedAt, "short")}</span>
                    </div>
                    <h3 className="mt-4 font-sans text-[clamp(1.7rem,3vw,2.45rem)] font-medium leading-[1.02] tracking-[-0.05em] text-foreground">
                      {featuredCourseArticle.title}
                    </h3>
                    <p className="mt-4 text-[1rem] leading-7 text-foreground/62 md:text-[1.05rem]">
                      {featuredCourseArticle.excerpt}
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 text-[0.98rem] font-medium tracking-[-0.02em] text-foreground">
                      <span>Read the full project article</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      ) : null}

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
                href="/syllabus/3d-modeling"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14"
              >
                <span>See 3D Modeling Syllabus</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
