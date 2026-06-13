"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";
import { motion } from "framer-motion";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const TEACHING_HERO_IMAGE =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-teaching-art.png";
const TEACHING_PDF_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/pdf/downloads/site/brandon-pt-davis-teaching-philosophy-and-experience-6507bfe65e.pdf";
const CV_PDF_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/pdf/downloads/resume/msmkrdmbsoqtuyko-58989945e6-d6f5c926.pdf";

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

const teachingChapters = [
  {
    number: "01",
    label: "Mentorship + Adaptability",
    title: "Preparing students for the landscape they are actually entering.",
    body:
      "My role is less about delivering fixed answers and more about mentoring students toward skill, confidence, and adaptability from day one. Theatre remains the foundation, but the work also points toward film, television, events, themed entertainment, and the wider creative industries where design thinking can travel.",
    image: "/images/teaching-gallery/student-presentation-highres.jpeg",
    alt: "Students presenting scenic design work during a studio conversation",
  },
  {
    number: "02",
    label: "Tradition + Innovation",
    title: "Craft gives technology somewhere meaningful to go.",
    body:
      "I teach spatial awareness, material comprehension, hand process, and design aesthetics alongside Vectorworks, Twinmotion, and AI-driven tools. The goal is not novelty for its own sake. The goal is a toolkit that never becomes the limiting factor of a student's imagination.",
    image: "/images/teaching-gallery/student-work-wall-highres.jpeg",
    alt: "Student design work installed across a classroom wall",
  },
  {
    number: "03",
    label: "Access / Rigor",
    title: "Different paths into the work can still lead to exacting standards.",
    body:
      "Students learn differently, so the classroom has to offer more than one door into complex material. Supplemental videos, tactile-digital assignments, critique, and scaffolded checkpoints reduce friction without lowering expectations. Accessibility makes room for better design choices.",
    image: "/images/teaching-gallery/drawing-studio-highres.jpeg",
    alt: "Students drawing around a studio classroom table",
  },
  {
    number: "04",
    label: "Classroom → Laboratory",
    title: "A studio culture where experimentation has a safety net.",
    body:
      "I think of teaching as research in public. The classroom is where current industry practice, emerging tools, and student curiosity can be tested critically. A strong studio culture gives students space to collaborate, self-advocate, revise, and take creative risks with support around them.",
    image: "/images/teaching-gallery/class-critique-highres.jpeg",
    alt: "Students discussing design work during a studio critique",
  },
] as const;

const lectureResources = [
  {
    type: "Tutorial",
    focus: "Portal",
    title: "Vectorworks + Scenic Design Tutorials",
    description:
      "A public teaching archive for drafting, modeling, rendering, file setup, documentation, and scenic workflow lessons.",
    href: "/studio/tutorials",
  },
  {
    type: "Lecture",
    focus: "Visual communication",
    title: "Rendering as Visual Communication",
    description:
      "Rendering lectures and articles on atmosphere, scale, lighting, camera choices, focal points, and presentation workflow.",
    href: "/studio/tutorials",
  },
  {
    type: "Article",
    focus: "Case study",
    title: "Studio Ghibli-Inspired Immersive Dining Experience",
    description:
      "A student themed-entertainment project showing how theatre design methods can move into immersive commercial storytelling.",
    href: "/articles/studio-ghibli-inspired-immersive-dining-experience",
  },
  {
    type: "Article",
    focus: "History",
    title: "The Evolution of Themed Entertainment",
    description:
      "A historical lecture thread connecting gardens, fairs, pageantry, amusement parks, and immersive narrative environments.",
    href: "/articles/the-evolution-of-themed-entertainment-from-ancient-gardens-to-modern-immersive-experienceses-everything",
  },
] as const;

export default function TeachingPhilosophy() {
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

  return (
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Teaching Philosophy | Scenic Design Education"
        description="A teaching philosophy and CV record centered on scenic design process, professional practice, mentorship, and adaptable design pedagogy."
        keywords="teaching philosophy scenic design, scenic design education, theatre design pedagogy, vectorworks instruction, design mentorship, experiential design syllabus"
        image={TEACHING_HERO_IMAGE}
        url="https://www.brandonptdavis.com/about/teaching"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Profile", url: "https://www.brandonptdavis.com/about" },
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
        <ProfileSectionHero
          canonicalPath="/about/teaching"
          description="A teaching practice and CV record centered on process, rigor, visual communication, and the habits students need for professional collaboration."
          imageAlt="Graduation cap icon for teaching philosophy"
          imageSrc="/images/about/icons/teaching-icon.png"
          title="Teaching Philosophy"
          updatedAt="May 22, 2026"
        />

        <article className="overflow-hidden bg-[#f1f0ec]">
          <section className="px-5 py-5 sm:px-8 md:px-[clamp(3rem,7vw,7rem)]">
            <div className="mx-auto grid max-w-[88rem] gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <p className="max-w-[45rem] text-[1rem] leading-7 tracking-[0] text-black/58">
                Download the full teaching philosophy and course experience, then move through the
                page as the statement becomes studio practice, course structure, and student work.
              </p>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <a
                  href={TEACHING_PDF_URL}
                  download
                  className="inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black px-5 text-[0.92rem] font-medium tracking-[0] text-white transition-colors hover:bg-[color-mix(in_oklch,var(--accent-articles)_58%,black)]"
                >
                  <Download className="h-4 w-4" />
                  Teaching PDF
                </a>
                <a
                  href={CV_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-black/14 bg-white px-5 text-[0.92rem] font-medium tracking-[0] text-black transition-colors hover:bg-black/[0.04]"
                >
                  <Download className="h-4 w-4" />
                  CV
                </a>
              </div>
            </div>
          </section>

          <section className="px-5 py-12 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20">
            <AnimatedSection className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:items-end">
              <div className="min-w-0">
                <h2 className="max-w-[12ch] font-sans text-5xl font-semibold leading-[0.95] tracking-[0] text-black sm:text-7xl lg:text-[clamp(4.5rem,7vw,5.8rem)] 2xl:text-[6.5rem]">
                  Mentorship for an evolving landscape.
                </h2>
                <p className="mt-6 max-w-[34rem] text-[1.08rem] leading-8 tracking-[0] text-black/62">
                  Scenic design education has to prepare students for theatre and for the adjacent
                  creative worlds their skills can enter: film, television, events, themed
                  entertainment, and emerging visualization workflows.
                </p>
              </div>
              <motion.figure
                className="relative min-h-[32rem] min-w-0 overflow-hidden bg-black md:min-h-[42rem]"
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.32 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src="/images/teaching-gallery/presentation-critique-highres.jpeg"
                  alt="Student presenting a design diagram to a classroom group"
                  fill
                  priority
                  quality={86}
                  sizes="(min-width: 1024px) 52vw, 92vw"
                  className="object-cover object-[72%_50%]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_44%,rgba(0,0,0,0.7))]" />
                <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
                  <p className="font-mono text-[0.74rem] uppercase tracking-[0.24em] text-white/58">
                    Studio critique / presentation
                  </p>
                  <p className="mt-3 max-w-[30rem] text-[1.08rem] leading-7 tracking-[0] text-white/82">
                    A teaching practice built around visible process, clear communication, and the
                    confidence to revise in public.
                  </p>
                </figcaption>
              </motion.figure>
            </AnimatedSection>
          </section>

          <section>
            {teachingChapters.map((chapter, index) => (
              <section
                key={chapter.label}
                className="px-5 py-14 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-20"
              >
                <div
                  className={`mx-auto grid max-w-[88rem] gap-8 lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)] lg:items-center ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <motion.div
                    className="relative aspect-[4/3] overflow-hidden bg-black"
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      quality={86}
                      sizes="(min-width: 1024px) 44vw, 92vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <AnimatedSection delay={index * 80} className="max-w-[39rem] lg:mx-auto">
                    <p className="font-mono text-[0.78rem] uppercase tracking-[0.24em] text-black/40">
                      {chapter.number} · {chapter.label}
                    </p>
                    <h3 className="mt-5 font-sans text-4xl font-semibold leading-[1] tracking-[0] text-black sm:text-5xl lg:text-6xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-6 text-[1.05rem] leading-8 tracking-[0] text-black/62 sm:text-[1.16rem]">
                      {chapter.body}
                    </p>
                  </AnimatedSection>
                </div>
              </section>
            ))}
          </section>

          <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
            <div className="mx-auto max-w-[88rem]">
              <AnimatedSection className="grid gap-8 py-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
                <div className="lg:pt-5">
                  <p className="section-kicker text-black/42">Teaching Record</p>
                  <p className="mt-3 max-w-[18rem] text-[0.98rem] leading-7 tracking-[0] text-black/56">
                    The CV carries the fuller academic record, production history, and teaching
                    appointments behind this page.
                  </p>
                  <a
                    href={CV_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 whitespace-nowrap rounded-full border border-black/14 bg-white px-5 text-[0.92rem] font-medium tracking-[0] text-black transition-colors hover:bg-black/[0.04]"
                  >
                    <Download className="h-4 w-4" />
                    View CV
                  </a>
                </div>

                <div>
                  {teachingExperience.map((credit) => (
                    <div
                      key={`${credit.institution}-${credit.role}`}
                      className="grid gap-2 py-5 sm:grid-cols-[minmax(0,1fr)_8rem] sm:gap-8"
                    >
                      <div>
                        <p className="font-sans text-[1.18rem] font-medium leading-7 tracking-[0] text-black/86">
                          {credit.institution}
                        </p>
                        <p className="mt-1 text-[0.98rem] leading-7 tracking-[0] text-black/52">
                          {credit.role}
                        </p>
                      </div>
                      <p className="font-mono text-[0.84rem] leading-7 tracking-[0.12em] text-black/38 sm:text-right">
                        {credit.years}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection
                delay={120}
                className="grid gap-8 py-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14"
              >
                <div className="lg:pt-3">
                  <p className="section-kicker text-black/42">Courses Taught</p>
                </div>
                <div>
                  {coursesTaught.map((course) => (
                    <p
                      key={course}
                      className="py-2.5 text-[1rem] leading-6 tracking-[0] text-black/62"
                    >
                      {course}
                    </p>
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
            <div className="mx-auto max-w-[88rem]">
              <AnimatedSection className="max-w-4xl">
                <p className="section-kicker text-black/42">Course Structures</p>
                <h2 className="mt-4 font-sans text-4xl font-semibold leading-[1] tracking-[0] text-black sm:text-5xl lg:text-6xl">
                  Syllabi as working maps for creative practice.
                </h2>
              </AnimatedSection>

              <div className="mt-10">
                {syllabusCards.map((card, index) => (
                  <AnimatedSection key={card.href} delay={Math.min(index * 90, 220)}>
                    <Link
                      href={card.href}
                      className="group grid gap-6 py-7 md:grid-cols-[18rem_minmax(0,1fr)_2rem] md:items-center"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-black">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          quality={82}
                          sizes="(max-width: 768px) 92vw, 18rem"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div>
                        <p className="font-mono text-[0.74rem] uppercase tracking-[0.22em] text-black/38">
                          Syllabus → sequence
                        </p>
                        <h3 className="mt-3 font-sans text-3xl font-semibold leading-[1.05] tracking-[0] text-black sm:text-4xl">
                          {card.title}
                        </h3>
                        <p className="mt-4 max-w-[44rem] text-[1rem] leading-7 tracking-[0] text-black/58">
                          {card.description}
                        </p>
                      </div>
                      <ArrowRight className="hidden h-5 w-5 text-black/42 transition-transform group-hover:translate-x-1 group-hover:text-black md:block" />
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
            <div className="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start lg:gap-14">
              <AnimatedSection>
                <p className="section-kicker text-black/42">Lectures + Tutorials</p>
                <h2 className="mt-4 max-w-[11ch] font-sans text-4xl font-semibold leading-[1] tracking-[0] text-black sm:text-5xl">
                  Teaching as public practice.
                </h2>
                <p className="mt-5 max-w-[18rem] text-[0.98rem] leading-7 tracking-[0] text-black/58">
                  Some lectures become articles. Some demos become tutorials. Together, they extend
                  the classroom into a shared record of methods, references, and working habits.
                </p>
                <Link
                  href="/studio/tutorials"
                  className="mt-7 inline-flex items-center gap-2 text-[0.95rem] font-medium tracking-[0] text-black/62 transition-colors hover:text-black"
                >
                  Learning portal
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </AnimatedSection>

              <div>
                {lectureResources.map((resource) => (
                  <Link
                    key={`${resource.type}-${resource.focus}-${resource.title}`}
                    href={resource.href}
                    className="group grid gap-4 py-6 md:grid-cols-[12rem_minmax(0,1fr)_2rem] md:items-start"
                  >
                    <div className="pt-1">
                      <p className="font-mono text-[0.7rem] uppercase leading-5 tracking-[0.18em] text-black/44">
                        {resource.type}
                      </p>
                      <p className="mt-1 font-mono text-[0.68rem] uppercase leading-5 tracking-[0.16em] text-black/28">
                        {resource.focus}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-sans text-[1.32rem] font-semibold leading-[1.08] tracking-[0] text-black sm:text-[1.55rem]">
                        {resource.title}
                      </h3>
                      <p className="mt-2 max-w-[42rem] text-[0.96rem] leading-7 tracking-[0] text-black/56">
                        {resource.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 hidden h-5 w-5 text-black/34 transition-transform group-hover:translate-x-1 group-hover:text-black md:block" />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="px-5 py-16 sm:px-8 md:px-[clamp(3rem,7vw,7rem)] md:py-24">
            <div className="mx-auto max-w-[88rem]">
              <div className="grid gap-10 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-end">
                <AnimatedSection>
                  <p className="section-kicker text-black/42">Teaching Studio</p>
                  <h2 className="mt-4 font-sans text-4xl font-semibold leading-[1] tracking-[0] text-black sm:text-5xl">
                    Critique, presentation, and visible process.
                  </h2>
                  <p className="mt-5 text-[1rem] leading-7 tracking-[0] text-black/58">
                    The studio is both classroom and culture: a place for shared language,
                    feedback, confidence, and the habits that make professional collaboration
                    possible.
                  </p>
                </AnimatedSection>

                <figure>
                  <motion.div
                    className="relative aspect-[16/10] w-full overflow-hidden bg-black md:aspect-[16/9]"
                    key={activeGalleryImage.src}
                    initial={{ opacity: 0.76 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Image
                      src={activeGalleryImage.src}
                      alt={activeGalleryImage.alt}
                      fill
                      quality={86}
                      sizes="(min-width: 1280px) 58vw, 92vw"
                      className="object-cover"
                    />
                  </motion.div>

                  <figcaption className="mt-4 flex flex-col gap-4 pt-4 text-black/58 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-sans text-[1.04rem] font-medium leading-7 tracking-[0] text-black/80">
                        {activeGalleryImage.caption}
                      </p>
                      <p className="mt-1 font-mono text-[0.78rem] leading-6 tracking-[0.12em] text-black/38">
                        {String(activeGalleryIndex + 1).padStart(2, "0")} ·{" "}
                        {String(teachingGallery.length).padStart(2, "0")}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={showPreviousImage}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black/62 transition-colors hover:border-black/45 hover:text-black"
                        aria-label="Previous teaching image"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={showNextImage}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black/62 transition-colors hover:border-black/45 hover:text-black"
                        aria-label="Next teaching image"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </figcaption>
                </figure>
              </div>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {teachingGallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setActiveGalleryIndex(index)}
                    className={`group relative h-20 w-32 shrink-0 overflow-hidden border transition-colors sm:h-24 sm:w-40 ${
                      index === activeGalleryIndex
                        ? "border-black/70"
                        : "border-black/16 hover:border-black/42"
                    }`}
                    aria-label={`Show ${image.caption}`}
                    aria-current={index === activeGalleryIndex}
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      quality={75}
                      sizes="160px"
                      className={`object-cover transition-[filter] duration-300 ${
                        index === activeGalleryIndex
                          ? "brightness-100"
                          : "brightness-75 group-hover:brightness-95"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer tone="light" />
    </div>
  );
}
