"use client";

import { useMemo } from "react";
import { ArrowRight, ExternalLink, Instagram, Link2 } from "lucide-react";

import AboutNav from "@/components/AboutNav";
import { AnimatedSection } from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileSectionHero from "@/components/ProfileSectionHero";
import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { resolveBlobMediaUrl } from "@shared/mediaBlob";
import { VOYAGELA_EXTERNAL_URL } from "@shared/publicContent";
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

const groupStyles: Record<
  "directors" | "designers" | "companies",
  {
    eyebrow: string;
    body: string;
    cardClassName: string;
  }
> = {
  directors: {
    eyebrow: "Production rooms",
    body: "Directors shape the first conversation around rhythm, story, and audience. These collaborations hold the dramaturgical frame that scenic design responds to.",
    cardClassName: "bg-[#111111] text-white shadow-[0_28px_80px_rgba(17,17,17,0.16)]",
  },
  designers: {
    eyebrow: "Design language",
    body: "Design collaborators give the room its shared vocabulary. Costume, light, sound, projection, and scenic ideas become stronger when they are tuned together.",
    cardClassName: "bg-white text-[#111111] shadow-[0_22px_70px_rgba(17,17,17,0.08)] ring-1 ring-black/[0.035]",
  },
  companies: {
    eyebrow: "Producing homes",
    body: "Theatres and institutions shape the tempo of the work: the shops, schedules, audiences, and production cultures where ideas become physical.",
    cardClassName: "bg-[#f7f6f2] text-[#111111] shadow-[0_20px_62px_rgba(17,17,17,0.07)] ring-1 ring-black/[0.035]",
  },
};

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

        <article className="overflow-hidden bg-[#f1f0ec] px-[clamp(1.5rem,5vw,6rem)] py-12 md:py-18">
          <div className="mx-auto max-w-[74rem]">
            <AnimatedSection className="mx-auto max-w-[58rem]">
              <div className="space-y-7 text-[clamp(1.18rem,1.65vw,1.55rem)] leading-[1.48] tracking-[-0.045em] text-[#111111]/78">
                <p>
                  Scenic design becomes legible through collaboration. The strongest rooms begin
                  with trust: directors naming the emotional architecture of a production,
                  designers building a shared visual language, and theatres making enough space for
                  practical decisions to become expressive ones.
                </p>
                <p>
                  This page collects the people, design teams, and producing homes that recur
                  around the work. It is part directory, part relationship map, and part record of
                  the rooms that have shaped how I think about space, process, and theatrical
                  memory.
                </p>
                <blockquote className="py-8 font-sans text-[clamp(2.45rem,5.4vw,6.25rem)] font-medium leading-[0.92] tracking-[-0.082em] text-transparent bg-[linear-gradient(105deg,#2458ff_0%,#8d42df_48%,#c477ff_100%)] bg-clip-text md:py-10">
                  The best rooms build a shared language before they build the world.
                </blockquote>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={120}>
              <a
                href={VOYAGELA_EXTERNAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mx-auto mt-6 grid max-w-[58rem] gap-6 rounded-[1.65rem] bg-white/82 p-6 shadow-[0_18px_54px_rgba(17,17,17,0.055)] transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_68px_rgba(17,17,17,0.085)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-7"
              >
                <div>
                  <p className="text-[0.98rem] font-medium tracking-[-0.025em] text-[#111111]/46">
                    Profile context
                  </p>
                  <h2 className="mt-2 font-sans text-[clamp(1.85rem,3vw,2.8rem)] font-medium leading-[0.98] tracking-[-0.065em] text-[#111111]">
                    VoyageLA: Rising Stars Interview
                  </h2>
                  <p className="mt-3 max-w-2xl text-[1rem] leading-6 tracking-[-0.025em] text-[#111111]/58">
                    A press profile connected to the creative practice, with more interviews and
                    academic profiles to collect here as they publish.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#111111]/18 px-5 py-3 text-[0.95rem] font-medium tracking-[-0.02em] text-[#111111]/70 transition-colors group-hover:border-[#111111]/42 group-hover:text-[#111111]">
                  Read profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            </AnimatedSection>
          </div>
        </article>

        <section className="overflow-hidden bg-[#e9e8e3] py-16 md:py-24">
          <div className="px-[clamp(1.5rem,5vw,6rem)]">
            <AnimatedSection>
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div className="max-w-4xl">
                  <p className="mb-4 text-[1.15rem] font-medium tracking-[-0.035em] text-[#111111]/54">
                    Collaboration index
                  </p>
                  <h2 className="font-sans text-[clamp(2.45rem,5vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.082em] text-[#111111]">
                    Creative partners, design rooms, and producing homes.
                  </h2>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <div className="mt-10 overflow-x-auto px-[clamp(1.5rem,5vw,6rem)] pb-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-5 pr-[clamp(1.5rem,5vw,6rem)]">
              {groupedCollaborators.map((section, index) => {
                const style = groupStyles[section.id as "directors" | "designers" | "companies"];

                return (
                  <AnimatedSection
                    key={section.id}
                    delay={Math.min(index * 90, 220)}
                    className="w-[min(25rem,82vw)] shrink-0 md:w-[27rem]"
                  >
                    <a
                      href={`#${section.id}`}
                      className={`group flex h-[25rem] flex-col rounded-[2rem] p-7 transition duration-500 hover:-translate-y-1 ${style.cardClassName}`}
                    >
                      <div>
                        <p className="text-[0.98rem] font-medium tracking-[-0.025em] opacity-55">
                          {style.eyebrow}
                        </p>
                        <h3 className="mt-4 max-w-[16rem] font-sans text-[clamp(2.3rem,3.2vw,3.25rem)] font-medium leading-[0.9] tracking-[-0.075em]">
                          {section.title}
                        </h3>
                        <p className="mt-5 max-w-[19rem] text-[1rem] leading-6 tracking-[-0.025em] opacity-62">
                          {style.body}
                        </p>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-[0.98rem] font-medium tracking-[-0.02em] opacity-58">
                          {section.items.length} entries
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-current/10 transition-transform group-hover:scale-105">
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                    </a>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f1f0ec] px-[clamp(1.5rem,5vw,6rem)] py-16 md:py-24">
          <div className="mx-auto max-w-[74rem] space-y-16 md:space-y-20">
            {groupedCollaborators.map((section, index) =>
              section.items.length ? (
                <section key={section.id} id={section.id} className="scroll-mt-36">
                  <AnimatedSection delay={Math.min(index * 80, 220)}>
                    <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:items-end">
                      <div>
                        <p className="text-[1.08rem] font-medium tracking-[-0.035em] text-[#111111]/48">
                          {groupStyles[section.id as "directors" | "designers" | "companies"].eyebrow}
                        </p>
                        <h2 className="mt-3 font-sans text-[clamp(2.55rem,5.2vw,5.9rem)] font-medium leading-[0.88] tracking-[-0.082em] text-[#111111]">
                          {section.title}
                        </h2>
                      </div>
                      <p className="max-w-[39rem] text-[1.08rem] leading-7 tracking-[-0.025em] text-[#111111]/58 md:justify-self-end">
                        {section.description}
                      </p>
                    </div>
                  </AnimatedSection>

                  <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((collaborator) => {
                      const website = getCollaboratorUrl(collaborator);
                      const instagramLabel = (
                        collaborator.instagramHandle || "Instagram"
                      ).replace(/^@+/, "");
                      const role = getCollaboratorRole(collaborator.role);

                      return (
                        <article
                          key={collaborator.id}
                          className="group rounded-[1.25rem] bg-white/76 p-5 shadow-[0_12px_38px_rgba(17,17,17,0.045)] ring-1 ring-black/[0.025] transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_54px_rgba(17,17,17,0.075)]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-sans text-[1.2rem] font-medium leading-[1.05] tracking-[-0.045em] text-[#111111]">
                                {collaborator.name}
                              </h3>

                              {role ? (
                                <p className="mt-2 text-[0.92rem] leading-5 tracking-[-0.02em] text-[#111111]/46">
                                  {role}
                                </p>
                              ) : null}
                            </div>

                            <div className="flex shrink-0 items-center gap-1.5 text-[#111111]/42">
                              {website ? (
                                <a
                                  href={website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-[#111111]"
                                  aria-label={`${collaborator.name} website`}
                                >
                                  <Link2 className="h-4 w-4" />
                                </a>
                              ) : null}
                              {collaborator.instagramUrl ? (
                                <a
                                  href={collaborator.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-[#111111]"
                                  aria-label={`${collaborator.name} Instagram`}
                                  title={`@${instagramLabel}`}
                                >
                                  <Instagram className="h-4 w-4" />
                                </a>
                              ) : null}
                              {website ? (
                                <ExternalLink className="hidden h-4 w-4 opacity-0 transition-opacity group-hover:opacity-45 md:block" />
                              ) : null}
                            </div>
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
