import { type CSSProperties, type MouseEvent } from "react";
import { useLocation } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { StickyShowcase } from "@/components/StickyShowcase";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";
import { getProjectPath } from "@/lib/projectRoutes";

const ACCENT_COLORS = ["#FF5722", "#00BCD4", "#E91E63", "#FFC107", "#9C27B0"] as const;

export default function Home() {
  const [, setLocation] = useLocation();
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://www.brandonptdavis.com";
  const { data: allProjects, isLoading: projectsLoading } = trpc.projects.list.useQuery({
    status: "published",
    discipline: "scenic_design",
  });

  const projects = allProjects || [];
  const [featuredProject, ...remainingProjects] = projects;
  const sideProjects = remainingProjects.slice(0, 3);
  const gridProjects = remainingProjects.slice(3);
  const scenicAlt = (title: string) => `${title} scenic design by Brandon PT Davis`;
  const homepageIntro =
    "Brandon PT Davis is a scenic designer creating story-driven environments for regional theatre, summer stock, and academic production.";

  const animateCardDeparture = async (target: HTMLElement) => {
    const card = target.querySelector(".transition-card") as HTMLElement | null;
    if (!card || typeof card.animate !== "function") return;
    const animation = card.animate(
      [
        { transform: "scale(1)", filter: "brightness(1)" },
        { transform: "scale(0.975)", filter: "brightness(1.08)" },
      ],
      { duration: 150, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    );
    try {
      await animation.finished;
    } catch {
      // Ignore interrupted animation.
    }
  };

  const navigateWithTransition = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    const anchor = event.currentTarget;
    const navigate = () => setLocation(href);
    const performNavigation = async () => {
      await animateCardDeparture(anchor);
      navigate();
    };
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => {
        void performNavigation();
      });
    } else {
      void performNavigation();
    }
  };

  return (
    <>
      <StructuredData
        type="Both"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic Designer",
          url: baseUrl,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description:
            "Union scenic designer based in Southern California with 130+ production credits across regional theatre, summer stock, and academic stages. Member of USA 829.",
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
            "Theatrical Design",
            "Regional Theatre",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Concept Rendering",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Drafting",
            "Production Collaboration",
          ],
        }}
        organization={{
          name: "Brandon PT Davis Design",
          url: baseUrl,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description:
            "Scenic design studio focused on story-driven environments for regional theatre, summer stock, and academic production.",
          founder: {
            name: "Brandon PT Davis",
            url: `${baseUrl}/about`,
          },
          foundingDate: "2015",
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
          ],
        }}
      />
      <StructuredData
        type="WebSite"
        webSite={{
          name: "Brandon PT Davis",
          url: baseUrl,
          description: "Professional scenic designer creating story-driven theatrical environments.",
          inLanguage: "en-US",
          publisher: {
            name: "Brandon PT Davis Design",
            logo: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          },
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[{ name: "Home", url: "https://www.brandonptdavis.com" }]}
      />
      <SEO
        title="Brandon PT Davis | Scenic Designer"
        description="Union scenic designer in Southern California creating story-driven environments for regional theatre, summer stock, and academic production."
        keywords="scenic designer, scenic design portfolio, USA 829 scenic designer, Southern California scenic designer, regional theatre design, stage design, Brandon PT Davis"
        url="https://www.brandonptdavis.com"
      />

      <Header />

      <main>
        {projectsLoading ? (
          <ProjectGridSkeleton />
        ) : featuredProject ? (
          <>
            <StickyShowcase
              accentColors={ACCENT_COLORS}
              featuredItem={featuredProject}
              intro={homepageIntro}
              itemAlt={scenicAlt}
              itemHref={getProjectPath}
              onNavigate={navigateWithTransition}
              railItems={sideProjects}
              title="Scenic Design by Brandon PT Davis"
            />

            <section className="pb-20 pt-16 md:pb-28 md:pt-20">
              <div className="container max-w-6xl">
                <div className="mt-16 border-t border-border/35 pt-8 md:mt-20 md:pt-10">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/45">
                    Selected Productions
                  </p>
                  <h2 className="max-w-[14ch] font-sans text-[clamp(1.65rem,2.8vw,2.35rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-foreground">
                    More scenic design work.
                  </h2>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:mt-10">
                  {gridProjects.map((project, index) => {
                    const href = getProjectPath(project);

                    return (
                      <a
                        key={project.id}
                        href={href}
                        onClick={(event) => navigateWithTransition(event, href)}
                      >
                        <div className="group">
                          <div
                            className="transition-card relative aspect-[1/1] overflow-hidden rounded-md bg-background/50"
                            style={
                              { viewTransitionName: `project-card-${project.slug}` } as CSSProperties
                            }
                          >
                            {project.coverImageUrl ? (
                              <ProgressiveImage
                                src={project.coverImageUrl}
                                alt={scenicAlt(project.title)}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                aspectRatio="1/1"
                                smartPosition={true}
                                loading={index < 8 ? "eager" : "lazy"}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 25vw, 20vw"
                              />
                            ) : (
                              <div className="h-full w-full bg-muted" />
                            )}
                          </div>
                          <div className="pt-4">
                            <p
                              className="text-[1.02rem] font-normal tracking-[-0.02em]"
                              style={{ color: ACCENT_COLORS[index % ACCENT_COLORS.length] }}
                            >
                              {project.title}
                            </p>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
