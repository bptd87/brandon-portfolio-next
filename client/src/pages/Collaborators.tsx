"use client";

import { useMemo } from "react";
import { Instagram, Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import {
  getLocalCollaboratorPortfolioUrlByName,
  getLocalCollaborators,
  type LocalCollaborator,
} from "@shared/localStudio";

type RoleFilter =
  | "director"
  | "scenic_designer"
  | "costume_designer"
  | "lighting_designer"
  | "sound_designer"
  | "projection_designer"
  | "partner_company"
  | "theatre_company";

const roleLabels: Record<RoleFilter, string> = {
  director: "Director",
  scenic_designer: "Scenic Designer",
  costume_designer: "Costume Designer",
  lighting_designer: "Lighting Designer",
  sound_designer: "Sound Designer",
  projection_designer: "Projection Designer",
  theatre_company: "Theatre Company",
  partner_company: "Partner Company",
};

const COLLABORATORS_IMAGE =
  resolveBlobMediaUrl(
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png"
  ) ||
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/site-assets/assets/about/about-collaborators-art.png";

const getCollaboratorRole = (role?: string | null) =>
  role && role in roleLabels ? roleLabels[role as RoleFilter] : null;

const getCollaboratorUrl = (collaborator: LocalCollaborator) =>
  getLocalCollaboratorPortfolioUrlByName(collaborator.name) ||
  collaborator.website ||
  collaborator.portfolioUrl ||
  null;

export default function Collaborators() {
  const allCollaborators = getLocalCollaborators();

  const groupedCollaborators = useMemo(() => {
    const groups = {
      directors: [] as LocalCollaborator[],
      designers: [] as LocalCollaborator[],
      companies: [] as LocalCollaborator[],
    };

    for (const collaborator of allCollaborators) {
      if (collaborator.role === "director") {
        groups.directors.push(collaborator);
      } else if (
        collaborator.role === "partner_company" ||
        collaborator.role === "theatre_company"
      ) {
        groups.companies.push(collaborator);
      } else if (collaborator.role?.includes("designer")) {
        groups.designers.push(collaborator);
      }
    }

    return [
      {
        id: "directors",
        title: "Directors",
        description: "Production conversations, dramaturgical instincts, and recurring trust.",
        items: groups.directors,
      },
      {
        id: "designers",
        title: "Designers",
        description: "Design teams, visual collaborators, and production partners across disciplines.",
        items: groups.designers,
      },
      {
        id: "companies",
        title: "Companies",
        description: "Theatres, festivals, and organizations where the work has taken shape.",
        items: groups.companies,
      },
    ];
  }, [allCollaborators]);

  const peopleCollaborators = useMemo(
    () =>
      allCollaborators.filter(
        (collaborator) =>
          collaborator.role !== "theatre_company" && collaborator.role !== "partner_company"
      ),
    [allCollaborators]
  );

  return (
    <div className="about-profile-light min-h-screen bg-[#f1f0ec] text-[#111111]">
      <SEO
        title="Collaborators and Creative Partners"
        description="Directors, designers, theatre companies, and recurring creative partners who have collaborated with Brandon PT Davis on scenic design productions."
        image={COLLABORATORS_IMAGE}
        url="https://www.brandonptdavis.com/about/collaborators"
        type="article"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Profile", url: "https://www.brandonptdavis.com/about" },
          { name: "Collaborators", url: "https://www.brandonptdavis.com/about/collaborators" },
        ]}
      />
      <StructuredData
        type="CollectionPage"
        collectionPage={{
          name: "Collaborators",
          url: "https://www.brandonptdavis.com/about/collaborators",
          description: "Creative collaborators across scenic design productions.",
          about: "Directors, designers, and theatre companies collaborating with Brandon PT Davis.",
          mainEntity: {
            name: "Collaborator Directory",
            itemListElement: allCollaborators.slice(0, 100).map((collab, index) => ({
              position: index + 1,
              name: collab.name,
              url:
                collab.website ||
                collab.portfolioUrl ||
                collab.instagramUrl ||
                "https://www.brandonptdavis.com/about/collaborators",
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Scenic Design Collaborations",
          description:
            "Ongoing creative collaborations with directors, designers, and production partners across scenic design productions.",
          url: "https://www.brandonptdavis.com/about/collaborators",
          creator: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about",
          },
          genre: "Scenic Design Collaboration",
          about: "Collaborative theatre production network",
          keywords: [
            "scenic design collaborators",
            "theatre directors",
            "design team partnerships",
          ],
          contributor: peopleCollaborators.slice(0, 75).map((collab) => ({
            type: "Person" as const,
            name: collab.name,
            roleName: getCollaboratorRole(collab.role) || undefined,
          })),
        }}
      />

      <Header />
      <AboutNav />

      <main>
        <ProfileSectionHero
          canonicalPath="/about/collaborators"
          description="A directory of creative partners, directors, designers, companies, and recurring production relationships."
          imageAlt="Collaboration icon for creative partners"
          imageSrc="/images/about/icons/collaboration-icon.png"
          title="Collaborators"
          updatedAt="May 22, 2026"
        />

        <article className="overflow-hidden px-4 py-12 sm:px-6 md:py-16 lg:px-8">
          <div className="mx-auto max-w-[1120px]">
            <header className="mx-auto max-w-[62rem] text-center">
              <AnimatedSection>
                <p className="mx-auto mt-6 max-w-[42rem] text-[clamp(1rem,1.45vw,1.32rem)] leading-[1.62] tracking-[-0.018em] text-foreground/66">
                  Scenic design is never solitary. These are directors, designers, companies, and
                  recurring creative partners connected to the productions and process.
                </p>
              </AnimatedSection>
            </header>

            <AnimatedSection delay={360} className="mx-auto mt-14 max-w-[54rem]">
              <div className="space-y-8 text-[1.04rem] leading-[1.9] tracking-[-0.01em] text-foreground/76 md:text-[1.08rem]">
                <p>
                  Collaboration gives scenic design its shape. A production becomes specific through
                  conversations with directors, the pressure and generosity of a design team, and
                  the production cultures of the theatres and organizations making the work.
                </p>
                <p>
                  I think of this page as a map of those relationships. Some are long-running
                  creative partnerships, some are production teams gathered for a single project,
                  and some are theatres whose rooms have shaped how I think about process, trust,
                  and shared visual language.
                </p>
                <blockquote className="my-12 border-y border-border/35 py-8 font-sans text-[clamp(1.9rem,4vw,3.35rem)] font-medium leading-[1.06] tracking-[-0.055em] text-foreground md:my-14 md:py-10">
                  The best rooms build a shared language before they build the world.
                </blockquote>
              </div>
            </AnimatedSection>
          </div>
        </article>

        <section className="border-t border-border/35 px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="mx-auto max-w-[1120px] space-y-18 md:space-y-24">
            {groupedCollaborators.map((section, index) =>
              section.items.length ? (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <AnimatedSection delay={Math.min(index * 80, 220)}>
                    <div className="grid gap-8 border-b border-border/25 pb-8 md:grid-cols-[15rem_minmax(0,1fr)] md:gap-12">
                      <div>
                        <p className="section-kicker text-foreground/42">
                          {String(section.items.length).padStart(2, "0")}
                        </p>
                        <h2 className="mt-3 font-sans text-[clamp(2.2rem,4.5vw,4.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
                          {section.title}
                        </h2>
                      </div>
                      <p className="max-w-[42rem] text-[1.02rem] leading-8 tracking-[-0.015em] text-foreground/58">
                        {section.description}
                      </p>
                    </div>
                  </AnimatedSection>

                  <div className="mt-8 grid gap-x-10 gap-y-0 md:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((collaborator) => {
                      const website = getCollaboratorUrl(collaborator);
                      const instagramLabel = (
                        collaborator.instagramHandle || "Instagram"
                      ).replace(/^@+/, "");
                      const role = getCollaboratorRole(collaborator.role);

                      return (
                        <article
                          key={collaborator.id}
                          className="border-t border-border/20 py-5"
                        >
                          <h3 className="font-sans text-[1.08rem] font-medium leading-[1.2] tracking-[-0.035em] text-foreground">
                            {website ? (
                              <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors hover:text-foreground/72"
                              >
                                {collaborator.name}
                              </a>
                            ) : (
                              collaborator.name
                            )}
                          </h3>

                          {section.id === "designers" && role ? (
                            <p className="mt-1 text-[0.88rem] leading-6 text-foreground/42">
                              {role}
                            </p>
                          ) : null}

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                            {website ? (
                              <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-foreground/46 transition-colors hover:text-foreground"
                              >
                                <Link2 className="h-3.5 w-3.5" />
                                <span>Website</span>
                              </a>
                            ) : null}
                            {collaborator.instagramUrl ? (
                              <a
                                href={collaborator.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-foreground/46 transition-colors hover:text-foreground"
                              >
                                <Instagram className="h-3.5 w-3.5" />
                                <span>@{instagramLabel}</span>
                              </a>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ) : null
            )}
          </div>
        </section>
      </main>

      <Footer tone="light" />
    </div>
  );
}
