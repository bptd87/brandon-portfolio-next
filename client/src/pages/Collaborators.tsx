import { SEO } from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Instagram, Users, Building2, Briefcase } from "lucide-react";
import { useMemo, useState } from "react";

type RoleFilter = "all" | "director" | "scenic_designer" | "costume_designer" | "lighting_designer" | "sound_designer" | "projection_designer" | "partner_company" | "theatre_company";

// Define the display order for roles
const roleOrder: RoleFilter[] = [
  "director",
  "scenic_designer",
  "costume_designer",
  "lighting_designer",
  "sound_designer",
  "projection_designer",
  "partner_company",
  "theatre_company",
];

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

const roleIcons: Record<RoleFilter, any> = {
  all: Users,
  director: Users,
  scenic_designer: Users,
  costume_designer: Users,
  lighting_designer: Users,
  sound_designer: Users,
  projection_designer: Users,
  theatre_company: Building2,
  partner_company: Briefcase,
};

export default function Collaborators() {
  const [activeFilter, setActiveFilter] = useState<RoleFilter>("all");
  const accentPalette = ["#FF5722", "#00BCD4", "#E91E63", "#FFC107", "#7CFF6B"];

  const { data: allCollaborators, isLoading } = trpc.collaborators.list.useQuery();

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

  const visibleRoles = activeFilter === "all" ? roleOrder : [activeFilter];
  const peopleCollaborators = useMemo(
    () => (allCollaborators || []).filter((c) =>
      c.role !== "theatre_company" && c.role !== "partner_company"
    ),
    [allCollaborators]
  );

  const collaboratorStats = useMemo(() => {
    const list = allCollaborators || [];
    const companies = list.filter((c) => c.role === "theatre_company" || c.role === "partner_company").length;
    const designers = list.filter((c) => c.role && c.role.includes("designer")).length;
    const directors = list.filter((c) => c.role === "director").length;
    return { total: list.length, companies, designers, directors };
  }, [allCollaborators]);

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
              url: collab.website || collab.portfolioUrl || collab.instagramUrl || "https://www.brandonptdavis.com/about/collaborators",
            })),
          },
        }}
      />
      <StructuredData
        type="CreativeWork"
        creativeWork={{
          name: "Scenic Design Collaborations",
          description: "Ongoing creative collaborations with directors, designers, and production partners across scenic design productions.",
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
      <div className="min-h-screen flex flex-col bg-background [background-image:radial-gradient(circle_at_14%_10%,rgba(255,87,34,0.08),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(0,188,212,0.08),transparent_30%)]">
        <Header />
        <AboutNav />

        <main className="flex-1 pt-24 pb-20">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center mb-14">
              <p className="text-xs uppercase tracking-[0.24em] font-semibold text-foreground/60 mb-4">
                About
              </p>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-5 leading-[0.9]">
                Collaborators
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Directors, designers, theatres, and creative teams behind the work.
              </p>
            </div>

            {!isLoading && (
              <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Total</p>
                  <p className="text-xl font-bold">{collaboratorStats.total}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Designers</p>
                  <p className="text-xl font-bold">{collaboratorStats.designers}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Directors</p>
                  <p className="text-xl font-bold">{collaboratorStats.directors}</p>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 backdrop-blur-sm p-4 text-center shadow-[0_10px_28px_rgba(0,0,0,0.14)]">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">Companies</p>
                  <p className="text-xl font-bold">{collaboratorStats.companies}</p>
                </div>
              </div>
            )}

            <div className="max-w-6xl mx-auto mb-14">
              <div className="flex justify-center">
                <div className="flex max-w-5xl flex-wrap justify-center gap-2 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-2">
                  <button
                    type="button"
                    onClick={() => setActiveFilter("all")}
                    className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200"
                    style={
                      activeFilter === "all"
                        ? {
                            color: accentPalette[0],
                            backgroundColor: `${accentPalette[0]}22`,
                            boxShadow: `inset 0 0 0 1px ${accentPalette[0]}66`,
                          }
                        : undefined
                    }
                  >
                    All ({allCollaborators?.length || 0})
                  </button>
                  {roleOrder.map((role, idx) => {
                    const count = groupedCollaborators?.[role]?.length || 0;
                    if (!count) return null;

                    const accent = accentPalette[(idx + 1) % accentPalette.length];
                    const isActive = activeFilter === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setActiveFilter(role)}
                        className="whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-white/5"
                        style={
                          isActive
                            ? {
                                color: accent,
                                backgroundColor: `${accent}22`,
                                boxShadow: `inset 0 0 0 1px ${accent}66`,
                              }
                            : undefined
                        }
                      >
                        {roleLabels[role]} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                    <div className="h-6 bg-muted rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && (
              <div className="space-y-16 max-w-6xl mx-auto">
                {visibleRoles.map((role, sectionIndex) => {
                  const collaborators = groupedCollaborators?.[role];
                  if (!collaborators || collaborators.length === 0) return null;

                  const Icon = roleIcons[role as RoleFilter];
                  const accent = accentPalette[sectionIndex % accentPalette.length];

                  return (
                    <div key={role}>
                      <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
                        <Icon className="w-7 h-7" style={{ color: accent }} />
                        {roleLabels[role as RoleFilter]}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collaborators.map((collaborator, index) => {
                          const cardAccent = accentPalette[(index + sectionIndex) % accentPalette.length];
                          const website = collaborator.website || collaborator.portfolioUrl;
                          const instagramLabel = (collaborator.instagramHandle || "Instagram").replace(/^@+/, "");

                          return (
                            <div
                              key={collaborator.id}
                              className="rounded-2xl border border-border/60 bg-card/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-card/60 hover:border-border hover:shadow-[0_22px_55px_rgba(0,0,0,0.24)] scroll-mt-32"
                              style={{ boxShadow: `inset 0 1px 0 ${cardAccent}26` }}
                            >
                              <p
                                className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3"
                                style={{ color: cardAccent }}
                              >
                                {roleLabels[role as RoleFilter].replace(/s$/, "")}
                              </p>

                              <h3 className="text-xl font-bold mb-2">
                                {collaborator.name}
                              </h3>

                              {collaborator.bio && (
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-4">
                                  {collaborator.bio}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border/40">
                                {website && (
                                  <a
                                    href={website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    {collaborator.role === "theatre_company" || collaborator.role === "partner_company" ? "Website" : "Portfolio"}
                                  </a>
                                )}

                                {collaborator.instagramUrl && (
                                  <a
                                    href={collaborator.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Instagram className="w-3.5 h-3.5" />
                                    @{instagramLabel}
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoading && (!allCollaborators || allCollaborators.length === 0) && (
              <div className="text-center py-20">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">No collaborators found.</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
