import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { getProjectPath } from "@/lib/projectRoutes";
import { FadeIn } from "@/components/animations/FadeIn";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ProjectGridSkeleton } from "@/components/SkeletonLoaders";

export default function Home() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.brandonptdavis.com';
  const { data: allProjects, isLoading: projectsLoading } = trpc.projects.list.useQuery({
    status: 'published',
    discipline: 'scenic_design'
  });

  const projects = allProjects;

  return (
    <>
      <StructuredData
        type="Both"
        person={{
          name: "Brandon PT Davis",
          jobTitle: "Scenic and Experiential Designer",
          url: baseUrl,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description: "Scenic and experiential designer based in Southern California with over 120 design credits across regional theatre, summer stock, academic theatre, immersive experiences, and live entertainment. Member of USA 829.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US",
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavis",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
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
            "Experiential Design",
            "Theatrical Design",
            "Regional Theatre",
            "Summer Stock Theatre",
            "Academic Theatre",
            "Event Design",
            "Concept Rendering",
            "Vectorworks",
            "Twinmotion",
            "3D Modeling",
            "Digital Fabrication",
            "Immersive Design",
            "Themed Entertainment",
          ],
        }}
        organization={{
          name: "Brandon PT Davis Design",
          url: baseUrl,
          image: "https://www.brandonptdavis.com/android-chrome-512x512.png",
          description: "Professional scenic and experiential design studio specializing in regional theatre, summer stock, academic theatre, immersive experiences, event design, and themed entertainment.",
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
            "https://www.instagram.com/brandonptdavis",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
          ],
        }}
      />
      <SEO
        title="Brandon PT Davis | Scenic & Experiential Designer"
        description="Award-winning Southern California scenic and experiential designer transforming theatrical spaces into immersive visual landscapes. Based in Orange County."
        keywords="scenic design, experiential design, California scenic designer, Orange County, theatre design, immersive experiences, Brandon Davis, USA 829, regional theatre"
        url="https://www.brandonptdavis.com"
      />
      <Header />

      <section className="pt-14 md:pt-20 pb-8 md:pb-10">
        <div className="container text-center">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-4">Portfolio</p>
          <h1 className="text-5xl md:text-7xl font-serif tracking-tight leading-[0.92] mb-4">
            Scenic Design by Brandon PT Davis
          </h1>
          <p className="mx-auto max-w-3xl text-lg md:text-xl text-foreground/75 leading-relaxed">
            Union scenic designer crafting narrative environments for regional theatre, classical work, and new productions.
          </p>
        </div>
      </section>

      {projectsLoading ? (
        <ProjectGridSkeleton />
      ) : projects && projects.length > 0 ? (
        <FadeIn>
          <section className="pt-8 md:pt-10 pb-20 md:pb-28">
            <div className="container">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.map((project, index) => {
                  const accentColors = [
                    '#FF5722',
                    '#00BCD4',
                    '#E91E63',
                    '#FFC107',
                    '#9C27B0',
                  ];
                  const accentColor = accentColors[index % accentColors.length];

                  return (
                    <Link key={project.id} href={getProjectPath(project)}>
                      <Card className="group border-0 bg-transparent shadow-none">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-md">
                          {project.coverImageUrl ? (
                            <ProgressiveImage
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              aspectRatio="16/9"
                              smartPosition={true}
                              loading={index < 4 ? "eager" : "lazy"}
                              fetchPriority={index === 0 ? "high" : undefined}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="pt-2 text-center">
                          <h3
                            className="text-xs font-semibold tracking-[0.3em] uppercase"
                            style={{ color: accentColor }}
                          >
                            {project.title}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>


            </div>
          </section>
        </FadeIn>
      ) : null}

      <Footer />
    </>
  );
}
