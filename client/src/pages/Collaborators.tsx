import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { ExternalLink, Instagram, Users } from "lucide-react";
import { useMemo } from "react";
import { getLocalCollaborators } from "@shared/localStudio";

type RoleFilter =
  | "all"
  | "director"
  | "scenic_designer"
  | "costume_designer"
  | "lighting_designer"
  | "sound_designer"
  | "projection_designer"
  | "partner_company"
  | "theatre_company";

const roleLabels: Record<RoleFilter, string> = {
  all: "All Collaborators",
  director: "Directors",
  scenic_designer: "Scenic Designers",
  costume_designer: "Costume Designers",
  lighting_designer: "Lighting Designers",
  sound_designer: "Sound Designers",
  projection_designer: "Projection Designers",
  theatre_company: "Theatre Companies",
  partner_company: "Partner Companies",
};

const slugifyName = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function Collaborators() {
  const allCollaborators = getLocalCollaborators();
  const isLoading = false;

  const groupedCollaborators = useMemo(
    () =>
      allCollaborators?.reduce((acc, collab) => {
        const role = collab.role || "other";
        if (!acc[role]) acc[role] = [];
        acc[role].push(collab);
        return acc;
      }, {} as Record<string, typeof allCollaborators>) || {},
    [allCollaborators]
  );

  const peopleCollaborators = useMemo(
    () =>
      (allCollaborators || []).filter(
        (collaborator) =>
          collaborator.role !== "theatre_company" && collaborator.role !== "partner_company"
      ),
    [allCollaborators]
  );

  const collaboratorStats = useMemo(() => {
    const list = allCollaborators || [];
    const companies = list.filter(
      (collaborator) =>
        collaborator.role === "theatre_company" || collaborator.role === "partner_company"
    ).length;
    const designers = list.filter((collaborator) => collaborator.role?.includes("designer")).length;
    const directors = list.filter((collaborator) => collaborator.role === "director").length;
    return { total: list.length, companies, designers, directors };
  }, [allCollaborators]);

  const editorialSections = useMemo(
    () => [
      {
        id: "directors",
        title: "Directors",
        items: groupedCollaborators?.director || [],
      },
      {
        id: "designers",
        title: "Designers",
        items: [
          ...(groupedCollaborators?.scenic_designer || []),
          ...(groupedCollaborators?.costume_designer || []),
          ...(groupedCollaborators?.lighting_designer || []),
          ...(groupedCollaborators?.sound_designer || []),
          ...(groupedCollaborators?.projection_designer || []),
        ],
      },
      {
        id: "companies",
        title: "Companies",
        items: [
          ...(groupedCollaborators?.partner_company || []),
          ...(groupedCollaborators?.theatre_company || []),
        ],
      },
    ],
    [groupedCollaborators]
  );

  return (
    <>
      <SEO
        title="Collaborators"
        description="Directors, designers, theatre companies, and creative partners who have collaborated with Brandon PT Davis on scenic design productions."
        url="https://www.brandonptdavis.com/about/collaborators"
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "About", url: "https://www.brandonptdavis.com/about" },
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
            itemListElement: (allCollaborators || []).slice(0, 100).map((collab, index) => ({
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
            roleName: collab.role ? roleLabels[collab.role as RoleFilter] || collab.role : undefined,
          })),
        }}
      />

      <div className="min-h-screen bg-background">
        <Header />
        <AboutNav />

        <main className="px-6 pb-20 pt-24 md:pt-28">
          <section className="mx-auto max-w-5xl border-b border-border/25 pb-12">
            <p className="text-center font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
              Collaborators
            </p>
            <h1 className="mx-auto mt-6 max-w-5xl text-center font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em] text-foreground">
              Directors, designers, companies, and long-running creative partners.
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-center text-[1.08rem] leading-8 text-foreground/60 md:text-[1.16rem]">
              Scenic design is built through relationships. This page gathers the people and
              organizations whose work has shaped productions through conversation, trust, and
              repeat collaboration over time.
            </p>

          </section>

          <section className="mx-auto mt-10 max-w-6xl">
            <div className="flex justify-center">
              <div className="flex max-w-5xl flex-wrap justify-center gap-x-8 gap-y-3">
                {editorialSections.map((section) => {
                  if (!section.items.length) return null;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="border-b border-transparent pb-1 text-[0.9rem] font-medium tracking-[-0.02em] text-foreground/48 transition-colors hover:border-foreground/35 hover:text-foreground"
                    >
                      {section.title} ({section.items.length})
                    </a>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="mx-auto mt-14 max-w-6xl border-t border-border/25 pt-14">
            <div className="grid items-center gap-10 xl:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.05fr)]">
              <div className="overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/20">
                <img
                  src="/assets/about/about-collaborators-art.png"
                  alt="Abstract collaboration artwork"
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="max-w-2xl">
                <h2 className="font-sans text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em] text-foreground">
                  Collaboration is built through repeat trust, shared language, and process.
                </h2>
                <div className="mt-8 space-y-5">
                  <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                    These relationships span directors, designers, partner organizations, and
                    theatre companies. Some are long-running creative partnerships. Others mark
                    important moments of exchange across individual productions.
                  </p>
                  <p className="text-[1.04rem] leading-8 text-foreground/64 md:text-[1.1rem]">
                    The page is meant to function as a clean index rather than a profile archive,
                    making it easier to scan the broader network behind the work.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {isLoading && (
            <section className="mx-auto mt-14 max-w-6xl">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[1.1rem] border border-border/20 bg-card/10 p-5"
                  >
                    <div className="h-4 w-24 rounded bg-muted" />
                    <div className="mt-4 h-7 w-44 rounded bg-muted" />
                    <div className="mt-8 h-4 w-20 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {!isLoading && (
            <section className="mx-auto mt-14 max-w-6xl space-y-16">
              {editorialSections.map((section, index) => {
                const collaborators = section.items;
                if (!collaborators || collaborators.length === 0) return null;

                return (
                  <div key={section.id} id={section.id} className="scroll-mt-32">
                    <div className="border-b border-border/20 pb-4">
                      <h2 className="font-sans text-[clamp(1.7rem,3vw,2.5rem)] font-medium leading-[1.02] tracking-[-0.045em] text-foreground">
                        {section.title}
                      </h2>
                    </div>

                    {section.id === "companies" && (
                      <div className="my-10 overflow-hidden rounded-[1.5rem] border border-border/30 bg-card/20">
                        <img
                          src="/assets/about/about-collaborators-art.png"
                          alt="Abstract collaboration artwork"
                          className="aspect-[16/6] w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
                      {collaborators.map((collaborator) => {
                        const website = collaborator.website || collaborator.portfolioUrl;
                        const instagramLabel = (collaborator.instagramHandle || "Instagram").replace(
                          /^@+/,
                          ""
                        );
                        const collaboratorId = slugifyName(collaborator.name);
                        const itemRole =
                          collaborator.role && roleLabels[collaborator.role as RoleFilter]
                            ? roleLabels[collaborator.role as RoleFilter].replace(/s$/, "")
                            : null;

                        return (
                          <article
                            key={collaborator.id}
                            id={collaboratorId}
                            className="scroll-mt-32 border-t border-border/20 pt-3"
                          >
                            <h3 className="font-sans text-[1.08rem] font-medium leading-[1.15] tracking-[-0.035em] text-foreground">
                              {collaborator.name}
                            </h3>
                            {section.id === "designers" && itemRole && (
                              <p className="mt-1 text-[0.82rem] leading-5 text-foreground/38">
                                {itemRole}
                              </p>
                            )}

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                              {collaborator.instagramUrl && (
                                <a
                                  href={collaborator.instagramUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-foreground/46 transition-colors hover:text-foreground"
                                >
                                  <Instagram className="h-3.5 w-3.5" />
                                  @{instagramLabel}
                                </a>
                              )}

                              {website && (
                                <a
                                  href={website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-foreground/46 transition-colors hover:text-foreground"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  {collaborator.role === "theatre_company" ||
                                  collaborator.role === "partner_company"
                                    ? "Website"
                                    : "Portfolio"}
                                </a>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {!isLoading && (!allCollaborators || allCollaborators.length === 0) && (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">No collaborators found.</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
