"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Check, Download, Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { copyTextToClipboard } from "@/lib/clipboard";

const TEACHING_HERO_IMAGE =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png";

const teachingGallery = [
  {
    src: "/images/teaching-gallery/student-presentation-highres.jpeg",
    alt: "Students standing beside a scenic design presentation monitor",
    caption: "Student presentation and design conversation",
  },
  {
    src: "/images/teaching-gallery/class-critique-highres.jpeg",
    alt: "Students discussing design work during a studio critique",
    caption: "Studio critique and peer response",
  },
  {
    src: "/images/teaching-gallery/student-work-wall-highres.jpeg",
    alt: "Student costume and scenic design artwork installed on a classroom wall",
    caption: "Design process work across disciplines",
  },
  {
    src: "/images/teaching-gallery/presentation-critique-highres.jpeg",
    alt: "Student presenting a design diagram to a classroom group",
    caption: "Presentation critique and design discussion",
  },
  {
    src: "/images/teaching-gallery/drawing-studio-highres.jpeg",
    alt: "Students drawing around a studio classroom table",
    caption: "Drawing and observation in the studio",
  },
];

export default function TeachingPhilosophy() {
  const [linkCopied, setLinkCopied] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const activeGalleryImage = teachingGallery[activeGalleryIndex] || teachingGallery[0];

  const showPreviousImage = () => {
    setActiveGalleryIndex((current) =>
      current === 0 ? teachingGallery.length - 1 : current - 1
    );
  };

  const showNextImage = () => {
    setActiveGalleryIndex((current) =>
      current === teachingGallery.length - 1 ? 0 : current + 1
    );
  };

  const teachingExperience = [
    {
      institution: "Stephens College",
      role: "Lecturer (Remote)",
      years: "2024 - 2025",
    },
    {
      institution: "Stephens College",
      role: "Assistant Professor of Scenic Design",
      years: "2021 - 2024",
    },
    {
      institution: "University of Texas at El Paso",
      role: "Visiting Assistant Professor",
      years: "2021",
    },
    {
      institution: "University of California, Irvine",
      role: "Adjunct Lecturer and Teaching Assistant",
      years: "2017 - 2020",
    },
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
      image:
        "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/teaching/syllabus-experiential-art.png",
    },
    {
      title: "3D Modeling and Rendering",
      description:
        "Vectorworks-based drafting, modeling, rendering, and documentation with an emphasis on professional scenic design workflow.",
      href: "/syllabus/3d-modeling",
      image:
        "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/teaching/syllabus-3d-modeling-art.png",
    },
  ];

  const handleShare = async () => {
    const path = "/about/teaching";
    const url =
      typeof window === "undefined" ? `https://www.brandonptdavis.com${path}` : `${window.location.origin}${path}`;

    const copied = await copyTextToClipboard(url);
    if (copied) {
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Teaching Philosophy | Scenic Design Education"
        description="A teaching philosophy centered on scenic design process, professional practice, mentorship, and adaptable design pedagogy."
        keywords="teaching philosophy scenic design, scenic design education, theatre design pedagogy, vectorworks instruction, design mentorship, experiential design syllabus"
        image={TEACHING_HERO_IMAGE}
        url="https://www.brandonptdavis.com/about/teaching"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
          { name: "Teaching Philosophy", url: "https://www.brandonptdavis.com/about/teaching" },
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
          url: "https://www.brandonptdavis.com/about/teaching",
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

      <main>
        <article className="overflow-hidden py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1120px] px-4 sm:px-6 lg:px-8">
            <header className="mx-auto max-w-[62rem] text-center">
              <AnimatedSection>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[0.92rem] tracking-[-0.015em] text-foreground/54">
                  <span>Teaching Philosophy</span>
                  <span>Scenic Design Education</span>
                  <span>Brandon PT Davis</span>
                </div>

                <h1 className="mx-auto mt-5 max-w-[15ch] font-sans text-[clamp(2.7rem,5.8vw,5.9rem)] font-medium leading-[0.92] tracking-[-0.072em] text-foreground">
                  Teaching scenic design through process, rigor, and practice.
                </h1>

                <p className="mx-auto mt-5 max-w-[42rem] text-[clamp(1rem,1.45vw,1.34rem)] leading-[1.62] tracking-[-0.018em] text-foreground/68">
                  My classroom is built around visual storytelling, technical fluency, and the kind
                  of collaborative thinking students need in order to build sustainable creative
                  lives.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={140}>
                <div className="group relative mx-auto mt-10 aspect-video max-w-[88rem] overflow-hidden bg-white/[0.02]">
                  <Image
                    src={TEACHING_HERO_IMAGE}
                    alt="Abstract teaching philosophy artwork"
                    fill
                    priority
                    quality={88}
                    sizes="(min-width: 1280px) 1120px, 100vw"
                    className="object-cover transition-[filter,transform] duration-[1200ms] ease-out group-hover:scale-[1.018] group-hover:brightness-110"
                  />
                </div>
              </AnimatedSection>

              <AnimatedSection delay={260}>
                <div className="mx-auto mt-8 flex w-full max-w-[62rem] items-center justify-between gap-6 border-t border-white/14 pt-4 text-foreground/72">
                  <div className="flex flex-wrap items-center gap-4 text-[0.96rem] tracking-[-0.018em] sm:gap-5">
                    <a
                      href="/api/teaching-philosophy-pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-2 text-[0.96rem] tracking-[-0.018em] transition-colors hover:text-foreground"
                  >
                    {linkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    <span>{linkCopied ? "Link copied" : "Share"}</span>
                  </button>
                </div>
              </AnimatedSection>
            </header>

            <AnimatedSection delay={360} className="mx-auto mt-14 max-w-[54rem]">
              <div className="space-y-8 text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-foreground/76 md:text-[1.08rem]">
                <p>
                  I want students to leave with more than a polished project. They should
                  understand how to research, communicate, revise, draft, present, and collaborate
                  with clarity. Scenic design education works best when it prepares students for
                  both artistic growth and the realities of professional practice.
                </p>

                <p>
                  My teaching is rooted in theatre, but it speaks to a much wider creative
                  landscape: live performance, digital visualization, themed entertainment, and
                  collaborative design work that moves fluidly between concept and execution. I care
                  about helping students become articulate designers who can generate ideas, develop
                  them rigorously, and adapt their process to different collaborators, technologies,
                  and production contexts.
                </p>

                <blockquote className="my-12 border-y border-border/35 py-8 font-sans text-[clamp(1.9rem,4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.055em] text-foreground md:my-14 md:py-10">
                  Students learn best when process becomes visible, repeatable, and flexible.
                </blockquote>

                <p>
                  I teach scenic design as both an artistic discipline and a professional framework.
                  Students need visual literacy, but they also need to understand drafting,
                  communication, materials, and how design choices function inside an actual
                  process. That foundation includes hand sketching, spatial thinking, historical and
                  dramaturgical research, and digital workflow.
                </p>

                <p>
                  I want students to understand why a method exists before they decide how to use
                  it. A model, a rendering, a ground plan, and a research board are not isolated
                  deliverables. They are different forms of communication inside the same design
                  argument.
                </p>

                <p>
                  Different students arrive with different strengths, anxieties, and ways of
                  learning. My pedagogy has to meet that reality. I use collaborative projects,
                  scaffolded assignments, visual examples, and direct feedback to help students
                  build confidence without lowering the level of rigor.
                </p>

                <p>
                  Accessibility matters here too. I try to build courses that give students
                  multiple ways into the work, whether that means tactile making, digital tools,
                  iterative checkpoints, or supplemental material that helps them stay connected to
                  the process.
                </p>

                <blockquote className="my-12 border-l border-border/35 pl-7 font-sans text-[clamp(1.75rem,3vw,2.65rem)] font-medium leading-[1.12] tracking-[-0.05em] text-foreground/92 md:my-14 md:pl-9">
                  A classroom should make room for discovery while still teaching students how to
                  meet the demands of production.
                </blockquote>

                <p>
                  Mentorship is where teaching becomes long-term. I want students to leave with a
                  stronger sense of their own voice, but also with practical habits around
                  communication, resilience, and self-advocacy. I care about studio culture as much
                  as curriculum. The most meaningful learning often happens in the environment we
                  create around the work.
                </p>

                <p>
                  I think of teaching as research in public. The classroom is where I test new
                  tools, update workflows, and ask how emerging technologies actually change what
                  students need to know. That includes AI, rendering platforms, and visualization
                  tools, but always with a critical lens.
                </p>

                <p>
                  I want students to understand not just what a tool can produce, but how it affects
                  authorship, taste, collaboration, and the larger design process. The goal is not
                  to make students dependent on a specific workflow. The goal is to help them become
                  designers who can think clearly through whatever workflow the room requires.
                </p>
              </div>
            </AnimatedSection>

            <section className="mx-auto mt-16 max-w-[54rem] border-t border-border/30 pt-10 md:mt-20 md:pt-12">
              <div className="grid gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Teaching Record
                  </p>
                  <div className="mt-7 space-y-6">
                    {teachingExperience.map((credit) => (
                      <div key={`${credit.institution}-${credit.role}`} className="border-t border-border/20 pt-5 first:border-t-0 first:pt-0">
                        <p className="font-sans text-[1.08rem] font-medium leading-7 tracking-[-0.025em] text-foreground/84">
                          {credit.institution}
                        </p>
                        <p className="mt-1 text-[0.98rem] leading-7 text-foreground/54">
                          {credit.role}, {credit.years}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Courses Taught
                  </p>
                  <div className="mt-7 space-y-3 text-[1rem] leading-7 text-foreground/64">
                    {coursesTaught.map((course) => (
                      <p key={course}>{course}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>

        <section className="border-t border-border/35 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <AnimatedSection className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Course Structures
              </p>
              <h2 className="mt-4 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Syllabi that translate the teaching philosophy into assignments and pacing.
              </h2>
            </AnimatedSection>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {syllabusCards.map((card, index) => (
                <AnimatedSection key={card.href} delay={Math.min(index * 90, 220)}>
                  <Link href={card.href} className="group block">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-card/20">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        quality={82}
                        sizes="(max-width: 768px) 92vw, 46vw"
                        className="object-cover transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:brightness-110"
                      />
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-4 border-t border-border/25 pt-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/38">
                          Syllabus
                        </p>
                        <h3 className="mt-2 font-sans text-[1.4rem] font-medium leading-[1.08] tracking-[-0.04em] text-foreground">
                          {card.title}
                        </h3>
                        <p className="mt-3 max-w-[34rem] text-[0.98rem] leading-7 text-foreground/60">
                          {card.description}
                        </p>
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/45 transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/35 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Teaching Studio
              </p>
              <h2 className="mt-4 font-sans text-[clamp(1.8rem,3.5vw,3rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                Classroom work, critiques, and student presentations.
              </h2>
            </div>

            <div className="mt-10">
              <figure>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-card/20 md:aspect-[16/8.6]">
                  <Image
                    key={activeGalleryImage.src}
                    src={activeGalleryImage.src}
                    alt={activeGalleryImage.alt}
                    fill
                    quality={92}
                    sizes="(min-width: 1280px) 1120px, 100vw"
                    className="object-cover"
                  />
                </div>

                <figcaption className="mt-4 flex flex-col gap-4 border-t border-border/25 pt-4 text-foreground/58 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-sans text-[1.04rem] font-medium leading-7 tracking-[-0.025em] text-foreground/80">
                      {activeGalleryImage.caption}
                    </p>
                    <p className="mt-1 text-[0.88rem] leading-6 text-foreground/42">
                      {String(activeGalleryIndex + 1).padStart(2, "0")} /{" "}
                      {String(teachingGallery.length).padStart(2, "0")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={showPreviousImage}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/35 text-foreground/62 transition-colors hover:border-foreground/45 hover:text-foreground"
                      aria-label="Previous teaching image"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/35 text-foreground/62 transition-colors hover:border-foreground/45 hover:text-foreground"
                      aria-label="Next teaching image"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </figcaption>
              </figure>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {teachingGallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`group relative h-20 w-32 shrink-0 overflow-hidden border transition-colors sm:h-24 sm:w-40 ${
                      index === activeGalleryIndex
                        ? "border-foreground/70"
                        : "border-border/25 hover:border-foreground/42"
                    }`}
                    aria-label={`Show ${image.caption}`}
                    aria-current={index === activeGalleryIndex}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      quality={70}
                      sizes="160px"
                      className={`object-cover transition-[filter] duration-300 ${
                        index === activeGalleryIndex
                          ? "brightness-100"
                          : "brightness-60 group-hover:brightness-90"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
