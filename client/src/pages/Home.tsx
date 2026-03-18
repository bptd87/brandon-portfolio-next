import { type MouseEvent } from "react";
import { useLocation } from "wouter";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SEO } from "@/components/SEO";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";
import { StickyShowcase } from "@/components/StickyShowcase";
import StructuredData from "@/components/StructuredData";
import { trpc } from "@/lib/trpc";
import { getProjectPath } from "@/lib/projectRoutes";

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
  const heroTitle = "Scenic Design by Brandon PT Davis";
  const heroIntro = "Selected scenic design work for stage.";

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
            <section className="relative overflow-hidden border-b border-border/40 pb-10 pt-24 md:pb-14 md:pt-32">
              <div className="pointer-events-none absolute inset-0">
                <div className="hero-stage-panel absolute inset-x-0 inset-y-0" />
                <div className="hero-stage-sweep absolute left-[8%] top-[14%] h-48 w-[72%] rounded-full blur-3xl md:left-[14%] md:top-[18%] md:h-56 md:w-[58%]" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-background" />
              </div>
              <div className="container max-w-6xl">
                <div className="relative max-w-4xl py-2">
                  <h1 className="max-w-[13ch] font-sans text-[clamp(2.7rem,6vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.065em] text-foreground">
                    {heroTitle}
                  </h1>
                  <p className="mt-6 max-w-2xl text-[1rem] leading-7 text-foreground/62 md:text-[1.08rem] md:leading-8">
                    {heroIntro}
                  </p>
                </div>
              </div>
            </section>

            <StickyShowcase
              continuationItems={gridProjects}
              desktopColumns={4}
              featuredItem={featuredProject}
              hideFeaturedCredit={true}
              itemAlt={scenicAlt}
              itemHref={getProjectPath}
              leadAspectClassName="lg:aspect-[3/2]"
              leadImageAspectRatio="3/2"
              leadTitleClassName="max-w-[14ch] text-[clamp(2rem,3.8vw,3.45rem)] font-medium leading-[0.94] tracking-[-0.06em]"
              onNavigate={navigateWithTransition}
              railItems={sideProjects}
              title={featuredProject.title}
            />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
