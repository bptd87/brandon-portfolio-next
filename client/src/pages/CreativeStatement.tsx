import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
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

export default function CreativeStatement() {
  const scenicDesignProjects = [...getLocalScenicProjects()].sort((a, b) => {
    const timeCompare = getProjectTimestamp(b) - getProjectTimestamp(a);
    if (timeCompare !== 0) return timeCompare;
    return a.title.localeCompare(b.title);
  });

  const statementGallery = scenicDesignProjects.length > 0
    ? scenicDesignProjects
        .filter((project) => !!project.coverImageUrl && !!project.slug)
        .sort(() => Math.random() - 0.5)
        .slice(0, 9)
    : [];

  // Scroll animation refs
  const galleryRailRef = useRef<HTMLDivElement | null>(null);
  const collaborationRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const pullQuote1Ref = useRef<HTMLDivElement>(null);
  const pullQuote2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const scrollGalleryBy = (direction: "prev" | "next") => {
    const rail = galleryRailRef.current;
    if (!rail) return;

    const firstCard = rail.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || window.getComputedStyle(rail).gap || "24");
    const amount = firstCard ? firstCard.offsetWidth + gap : Math.max(rail.clientWidth * 0.72, 320);
    rail.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const getProjectHref = (project: { discipline?: string | null; slug?: string | null }) => {
    if (!project.slug) return "/portfolio";
    return project.discipline === "rendering"
      ? `/projects/rendering/${project.slug}`
      : `/project/${project.slug}`;
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const animateOnScroll = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-8");
        }
      });
    };

    const refs = [collaborationRef, processRef, philosophyRef, pullQuote1Ref, pullQuote2Ref, ctaRef];
    
    refs.forEach(ref => {
      if (ref.current) {
        const observer = new IntersectionObserver(animateOnScroll, observerOptions);
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  // Get hero project for Open Graph image
  const heroProject = scenicDesignProjects.find(p => p.featured) || scenicDesignProjects[0];

  const coreIdeas = [
    "Scenic design should shape how a story is felt, not just where it appears to happen.",
    "Architecture, research, and dramaturgy help turn visual ideas into spaces with emotional logic.",
    "The best work emerges when collaboration stays active from concept through execution.",
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Creative Design Statement | Scenic Design Philosophy"
        description="Exploring architecture, history, and storytelling through scenic design. A creative statement centered on narrative space, dramaturgy, and production collaboration."
        keywords="scenic design philosophy, creative statement scenic designer, theatrical storytelling, architectural design for stage, spatial narrative, theatre design approach"
        image={heroProject?.coverImageUrl ?? undefined}
        url="https://www.brandonptdavis.com/creative-statement"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
          { name: "Creative Statement", url: "https://www.brandonptdavis.com/creative-statement" },
        ]}
      />
      <StructuredData
        type="Person"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: "https://www.brandonptdavis.com",
          description: "Scenic designer exploring architecture, history, and storytelling to create narrative stage environments for theatre production.",
          knowsAbout: [
            "Scenic Design",
            "Spatial Storytelling",
            "Architectural Design",
            "Immersive Environments",
            "Historical Research",
            "Theatrical Collaboration"
          ]
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Creative Statement: Architecture, History & Narrative Storytelling",
          description: "A scenic design creative statement by Brandon PT Davis, articulating process, collaboration, and story-led spatial design.",
          url: "https://www.brandonptdavis.com/creative-statement",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          datePublished: "2026-01-01",
          genre: "Scenic Design",
          keywords: [
            "creative statement",
            "scenic design philosophy",
            "theatre design process",
            "story-led design",
          ],
          image: heroProject?.coverImageUrl || undefined,
          about: "Scenic design philosophy and production collaboration",
        }}
      />
      <Header />
      <AboutNav />

      {/* Hero Section */}
      <section className="px-6 pb-12 pt-24 md:pb-16 md:pt-28">
        <div className="mx-auto max-w-5xl border-b border-border/25 pb-12">
          <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
            Creative Statement
          </p>
          <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
            Architecture, history, and narrative storytelling.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
            My scenic design practice sits at the intersection of architecture, historical
            thinking, and story-led space making. I&apos;m most interested in work where design
            becomes part of how a production resonates, not just how it looks.
          </p>
          <div className="mx-auto mt-10 max-w-4xl">
            <p className="text-[1.18rem] leading-9 text-foreground/76 md:text-[1.3rem]">
              My passion for scenic design falls somewhere between a love of architecture, history,
              and narrative storytelling. I&apos;m drawn to projects that have meaning and impact
              for the communities they serve. The productions I return to most are the ones where
              the design does more than illustrate a setting and instead participates in how the
              story is felt.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 xl:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.05fr)]">
            <div className="overflow-hidden rounded-[1.75rem] border border-border/30 bg-card/20">
              <div className="relative aspect-[4/5] w-full">
              <img
                src="/assets/about/about-process-art.png"
                alt="Abstract creative statement artwork"
                className="absolute left-1/2 top-1/2 h-full w-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[1.25] rotate-90 object-cover object-center"
                loading="lazy"
              />
              </div>
            </div>

            <div className="max-w-2xl">
              <h2 className="font-sans text-[clamp(2rem,4vw,3.35rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                A design practice built around story, structure, and collaboration.
              </h2>
              <div className="mt-8 space-y-5">
                {coreIdeas.map((idea) => (
                  <p key={idea} className="text-[1.02rem] leading-8 text-foreground/64 md:text-[1.08rem]">
                    {idea}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section 
        ref={collaborationRef}
        className="relative px-6 py-18 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-22"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Collaboration
            </div>
            <div>
              <div className="max-w-4xl space-y-8">
                <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                I value every collaborator involved in <span className="text-foreground/92">bringing a production to life</span>.
                That begins with the playwright and extends through the director, design team,
                technicians, managers, carpenters, and artisans. The work is strongest when the
                whole production can move toward a shared spatial idea together.
                </p>
                <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  I especially care about the conversations that happen between departments, where
                  scenic design has to remain flexible enough to support lighting, costumes,
                  projections, movement, and performance. Collaboration isn&apos;t a secondary value
                  in the work. It&apos;s part of the design itself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote 1 */}
      <div 
        ref={pullQuote1Ref}
        className="relative px-6 py-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-18"
      >
        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l border-border/35 pl-8 md:pl-10">
            <p className="font-sans text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.05em] text-foreground/90">
              "I'm never afraid to start over, no matter where we are in the process."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Process Section */}
      <section 
        ref={processRef}
        className="relative px-6 py-18 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-22"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Process
            </div>
            <div>
              <div className="max-w-4xl space-y-8">
                <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                  My process usually starts with too many possibilities at once. Early conversations
                  with a director are about the text first: what they see, what the play requires,
                  and how a shared visual logic can emerge.
                </p>
                <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  From there I build digital models to <span className="text-foreground/92">explore and sculpt the world</span>.
                  I&apos;m never afraid to start over. I care about the transition from rendering to
                  drafting, where an idea has to become clear enough to build, rehearse in, and
                  perform inside.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull Quote 2 */}
      <div 
        ref={pullQuote2Ref}
        className="relative px-6 py-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-18"
      >
        <div className="max-w-4xl mx-auto">
          <blockquote className="border-l border-border/35 pl-8 md:pl-10">
            <p className="font-sans text-[clamp(1.9rem,4vw,3.2rem)] font-medium leading-[1.08] tracking-[-0.05em] text-foreground/90">
              "Designs that feel inevitable once they're revealed."
            </p>
          </blockquote>
        </div>
      </div>

      {/* Philosophy Section */}
      <section 
        ref={philosophyRef}
        className="relative px-6 py-18 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-22"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid items-start gap-12 md:grid-cols-[180px_1fr]">
            <div className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40 md:sticky md:top-32">
              Philosophy
            </div>
            <div>
              <div className="max-w-4xl space-y-8">
                <p className="text-[1.14rem] leading-9 text-foreground/72 md:text-[1.22rem]">
                Whether I&apos;m working on a classic or a new play, I want the environment to
                <span className="text-foreground/92"> feel inevitable once it&apos;s revealed</span>.
                The best designs carry the weight of revision quietly. They feel resolved, even
                when they were hard-won through many iterations and collaborative breakthroughs.
                </p>
                <p className="text-[1.06rem] leading-8 text-foreground/60 md:text-[1.12rem]">
                  I&apos;m looking for clarity rather than spectacle for its own sake. The strongest
                  design choices are the ones that support performers, deepen the dramaturgy, and
                  make the audience feel that the world of the play could not have been built in
                  any other way.
                </p>
              </div>
              
              {/* Signature */}
              <div className="border-t border-border/25 pt-12">
                <div className="font-sans text-[1.45rem] font-medium tracking-[-0.03em] text-foreground">Brandon PT Davis</div>
                <div className="mt-2 text-[0.98rem] text-foreground/50">Scenic Designer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Full Portfolio CTA */}
      <section 
        className="border-t border-border/25 px-6 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-2">
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

          {statementGallery.length > 0 && (
            <div
              ref={galleryRailRef}
              className="mt-10 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {statementGallery.map((project) => (
                <Link
                  key={project.id}
                  href={getProjectHref(project)}
                  className="group block w-[min(74vw,28rem)] shrink-0 snap-start md:w-[calc((100%_-_3rem)_/_3)]"
                >
                  <img
                    src={project.coverImageUrl || ""}
                    alt={project.title}
                    className="block aspect-[16/9] w-full rounded-[1rem] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
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
          )}
        </div>
      </section>

      <section 
        ref={ctaRef}
        className="relative border-y border-border/25 px-6 py-20 opacity-0 translate-y-8 transition-all duration-1000 ease-out md:py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.06] px-6 py-16 text-center md:px-12 md:py-20">
            <h2 className="mx-auto max-w-4xl font-sans text-[clamp(2.4rem,4.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.06em] text-foreground">
              Start a project with a designer who can think concept through execution.
            </h2>
            <Link href="/contact" className="mt-10 inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-[0.95rem] font-medium tracking-[-0.02em] text-foreground transition-colors hover:bg-white/14">
              <span>Start a Project</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
