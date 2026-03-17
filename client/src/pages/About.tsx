import { ArrowRight, ChevronLeft, ChevronRight, FileText, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";
import { useRef } from "react";

import AboutNav from "@/components/AboutNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

const galleryImages = [
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-uci.webp",
    alt: "UC Irvine graduate school days",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teaching.webp",
    alt: "Teaching scenic design to students",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teams.webp",
    alt: "Working with creative teams",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-mentors.webp",
    alt: "Collaborating with mentors",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-collaborations.webp",
    alt: "Creative collaborations",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-family.webp",
    alt: "Family and community",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-partnerships.webp",
    alt: "Design partnerships",
  },
  {
    url: "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-behind-scenes.webp",
    alt: "Behind the scenes",
  },
];

const navigationCards = [
  {
    title: "Creative Statement",
    description:
      "Process, design philosophy, and the principles that shape the work.",
    href: "/creative-statement",
    label: "Process",
    image:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-mentors.webp",
  },
  {
    title: "Resume & Credits",
    description: "Production history, union background, and the broader body of work.",
    href: "/resume",
    label: "Resume",
    image:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-uci.webp",
  },
  {
    title: "Teaching Philosophy",
    description: "Thoughts on scenic design education, mentorship, and professional growth.",
    href: "/about/teaching",
    label: "Teaching",
    image:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teaching.webp",
  },
  {
    title: "Collaborators & Directors",
    description:
      "Creative partners, theatre companies, and long-running director relationships.",
    href: "/about/collaborators",
    label: "Collaboration",
    image:
      "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/gallery-teams.webp",
  },
];

const recentMilestones = [
  "South Coast Repertory debut as co-scenic designer on Million Dollar Quartet.",
  "Designed Romero at the University of Missouri, shaping a spiritual and political memory play through scenography.",
  "Continued dual-track practice in regional theatre and experiential work while mentoring emerging designers in university classrooms.",
];

const workingPrinciples = [
  {
    title: "Story before image",
    description:
      "Every visual decision starts with the script, the director’s framework, and the emotional logic of the production.",
  },
  {
    title: "Space as collaboration",
    description:
      "The strongest scenic work comes from listening well and building environments that support performers, directors, and production teams together.",
  },
  {
    title: "Clarity in execution",
    description:
      "From research through drafting and fabrication conversations, the goal is always a design language that holds up in rehearsal and onstage.",
  },
];

export default function About() {
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://www.brandonptdavis.com";

  const scrollGalleryBy = (direction: "prev" | "next") => {
    const rail = galleryRailRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.72, 320);
    rail.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="About Brandon PT Davis | Scenic Designer & Educator"
        description="Southern California scenic designer with 130+ production credits across regional theatre, summer stock, and education. USA 829 member based in Orange County."
        url="https://www.brandonptdavis.com/about"
        keywords="Brandon PT Davis scenic designer, USA 829 scenic designer, scenic designer California, Orange County scenic designer, scenic design educator, UC Irvine, regional theatre scenic design"
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: `${baseUrl}/about`,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description:
            "Scenic designer and conceptual artist known for a dramaturgical approach to stage space, with work at South Coast Repertory and 130+ productions across regional theatre, contemporary drama, and classical repertoire. Member of USA 829.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US",
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavisdesign",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
            "https://www.pinterest.com/BrandonPTDavis/",
            "https://www.usa829.org/Member-Profile/MemberID/15357",
          ],
          alumniOf: [
            {
              name: "University of California, Irvine",
              url: "https://www.uci.edu",
            },
            {
              name: "Stephens College",
              url: "https://www.stephens.edu",
            },
          ],
          knowsAbout: [
            "Scenic Design",
            "Conceptual Design",
            "Regional Theatre",
            "Contemporary Drama",
            "Dramaturgical Design",
            "Design Mentorship",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Scenic Design Education",
          ],
        }}
      />
      <StructuredData
        type="ProfilePage"
        profilePage={{
          url: "https://www.brandonptdavis.com/about",
          name: "About Brandon PT Davis",
          description:
            "Profile of Brandon PT Davis, scenic designer and USA 829 member based in Southern California.",
          primaryImageOfPage:
            "https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/profile-headshot.webp",
          mainEntity: {
            name: "Brandon PT Davis",
            jobTitle: "Scenic Designer",
            url: "https://www.brandonptdavis.com/about",
            image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
            description:
              "Scenic designer and conceptual artist with 130+ production credits across regional theatre and academic stages.",
            sameAs: [
              "https://www.instagram.com/brandonptdavisdesign",
              "https://www.linkedin.com/in/brandonptdavis",
              "https://www.youtube.com/@BrandonPTDavisDesign",
              "https://www.facebook.com/BrandonPTDavisA",
              "https://www.pinterest.com/BrandonPTDavis/",
              "https://www.usa829.org/Member-Profile/MemberID/15357",
            ],
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
        ]}
      />

      <Header />
      <AboutNav />

      <main>
        <section className="pb-14 pt-24 md:pb-16 md:pt-28">
          <div className="container max-w-6xl">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mx-auto max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                  About
                </p>
                <h1 className="mt-5 font-sans text-[clamp(2.8rem,5.8vw,5.15rem)] font-medium leading-[0.95] tracking-[-0.06em] text-foreground">
                  Brandon PT Davis
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-[1.08rem] leading-8 text-foreground/72 md:text-[1.18rem]">
                  Brandon PT Davis is a scenic designer whose work centers on creating expressive
                  theatrical environments that support storytelling through space, composition, and
                  collaboration.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-foreground/58">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Southern California
                  </span>
                  <span>USA 829</span>
                  <span>MFA Scenic Design</span>
                  <span>130+ Productions</span>
                </div>

                <div className="mt-7 flex justify-center">
                  <a
                    href="/resume"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    <FileText className="h-4 w-4" />
                    View Resume
                  </a>
                </div>
              </div>

              <div className="mx-auto mt-10 max-w-[23rem] md:mt-12">
                <div className="overflow-hidden rounded-[1.75rem] border border-border/40 bg-card/20">
                  <img
                    src="https://xibkuwouvisabnfowthn.supabase.co/storage/v1/object/public/about-images/profile-headshot.webp"
                    alt="Brandon PT Davis - Scenic Designer"
                    className="aspect-[4/5] w-full object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 pt-8 md:pb-20 md:pt-10">
          <div className="container max-w-6xl">
            <div className="border-t border-border/20 pt-10">
              <div className="mx-auto max-w-3xl space-y-6">
                <p className="text-[1rem] leading-8 text-foreground/78 md:text-[1.08rem]">
                  Brandon&apos;s approach combines traditional scenic craft with contemporary digital
                  visualization methods, allowing him to develop designs that are both conceptually
                  clear and practically buildable. He is particularly interested in how scenic
                  design can shape rhythm, movement, and emotional tone within a production.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  Based in Southern California, Brandon designs for regional theatres and academic
                  institutions across the United States. Recent projects include <em>The Glass
                  Menagerie</em>, productions with the New Swan Shakespeare Festival, and work with
                  South Coast Repertory. He also completed his 40th scenic design at Okoboji Summer
                  Theatre, marking a significant milestone in a career that has developed steadily
                  through long-term collaborations and diverse repertory experiences.
                </p>

                <div className="py-10 text-center md:py-14">
                  <blockquote className="mx-auto max-w-4xl font-sans text-[clamp(1.9rem,4vw,3.5rem)] font-medium leading-[1.14] tracking-[-0.045em] text-foreground">
                    “Expressive theatrical environments that support storytelling through space,
                    composition, and collaboration.”
                  </blockquote>
                </div>

                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  His work spans musicals, classical plays, and new works, often incorporating
                  flexible staging, projection surfaces, and symbolic architectural forms.
                </p>
                <p className="text-[1rem] leading-8 text-foreground/72 md:text-[1.08rem]">
                  In addition to his professional design practice, Brandon has taught scenic design
                  and rendering at the university level. His teaching emphasizes process, visual
                  communication, and the importance of adaptability within the evolving landscape of
                  theatre production. He continues to explore new workflows that integrate digital
                  tools while maintaining a strong connection to the collaborative traditions of
                  live performance.
                </p>
              </div>

              <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/40 bg-card/20 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Education
                  </p>
                  <div className="mt-5 space-y-5 text-[0.98rem] leading-7 text-foreground/62">
                    <div>
                      <p className="text-foreground/82">Master of Fine Arts</p>
                      <p>Scenic Design, University of California, Irvine</p>
                    </div>
                    <div className="border-t border-border/30 pt-5">
                      <p className="text-foreground/82">Bachelor of Fine Arts</p>
                      <p>Theatre, Stephens College</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border/40 bg-card/20 p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Practice
                  </p>
                  <div className="mt-5 space-y-5 text-[0.98rem] leading-7 text-foreground/62">
                    <div>
                      <p className="text-foreground/82">Areas of Specialization</p>
                      <p>Scenic Design for Theatre</p>
                      <p>Digital Rendering and Visualization</p>
                      <p>Model Building and Drafting</p>
                    </div>
                    <div className="border-t border-border/30 pt-5">
                      <p className="text-foreground/82">Interests</p>
                      <p>
                        Theatre history, visual storytelling, rendering technologies,
                        architecture, travel, and collaborative creative practice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/35 py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Working Approach
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                A dramaturgical approach to scenic design.
              </h2>
              <p className="mt-5 text-[1rem] leading-7 text-foreground/60 md:text-[1.08rem]">
                The strongest scenic work doesn&apos;t call attention to itself first. It builds the
                conditions for story, movement, rhythm, and emotional focus.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-3">
              {workingPrinciples.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-[1.5rem] border border-border/40 bg-card/15 p-6 md:p-7"
                >
                  <h3 className="font-sans text-[1.35rem] font-medium tracking-[-0.03em] text-foreground">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-[0.98rem] leading-7 text-foreground/58">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                Learn More
              </p>
              <h2 className="mt-4 font-sans text-[clamp(2rem,4vw,3.3rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                Process, teaching, and long-form context.
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {navigationCards.map((card) => (
                <Link key={card.href} href={card.href}>
                  <a className="group block">
                    <div className="overflow-hidden rounded-[1.35rem] border border-border/40 bg-card/20">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="aspect-square w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-foreground/50">{card.label}</p>
                      <div className="mt-2 flex items-start justify-between gap-3">
                        <div className="space-y-2">
                          <h3 className="font-sans text-[1.25rem] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
                            {card.title}
                          </h3>
                          <p className="text-[0.96rem] leading-7 text-foreground/58">
                            {card.description}
                          </p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-foreground/45 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/35 py-16 md:py-20">
          <div className="container max-w-[92rem]">
            <div className="flex w-full items-center justify-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("prev")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                  aria-label="Scroll gallery left"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollGalleryBy("next")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/45 text-foreground/65 transition-colors hover:border-border hover:text-foreground"
                  aria-label="Scroll gallery right"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              ref={galleryRailRef}
              className="mt-10 flex snap-x snap-mandatory items-end gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {galleryImages.map((image) => (
                <div
                  key={image.url}
                  className="w-[min(78vw,40rem)] shrink-0 snap-start md:w-[calc((100%_-_3rem)_/_3)]"
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="block w-full rounded-[1.5rem]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
