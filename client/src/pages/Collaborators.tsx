import { SEO } from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutNav from "@/components/AboutNav";
import { trpc } from "@/lib/trpc";
import { ExternalLink, Instagram, Users, Building2, Briefcase } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

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

  const { data: allCollaborators, isLoading } = trpc.collaborators.list.useQuery();

  // Group collaborators by role
  const groupedCollaborators = allCollaborators?.reduce((acc, collab) => {
    const role = collab.role || 'other';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(collab);
    return acc;
  }, {} as Record<string, typeof allCollaborators>);

  const filteredGroups = activeFilter === "all"
    ? groupedCollaborators
    : { [activeFilter]: groupedCollaborators?.[activeFilter] || [] };

  return (
    <>
      <SEO
        title="Collaborators"
        description="Directors, designers, theatre companies, and creative partners who have collaborated with Brandon PT Davis on scenic and experiential design projects."
        url="https://www.brandonptdavis.com/about/collaborators"
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <AboutNav />

        <main className="flex-1 pt-24 pb-20">
          <div className="container">
            {/* Header */}
            <div className="max-w-3xl mb-16">
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
                Collaborators
              </h1>
              <p className="text-xl text-muted-foreground">
                Directors, designers, theatre companies, and creative partners who bring theatrical visions to life through collaboration and shared artistic excellence.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-3 mb-12 border-b border-border pb-6">
              {/* All filter first */}
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === "all"
                    ? "bg-foreground text-background"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
              >
                <Users className="w-4 h-4" />
                {roleLabels.all}
                <span className={`text-xs ${activeFilter === "all" ? "opacity-70" : "opacity-50"}`}>
                  ({allCollaborators?.length || 0})
                </span>
              </button>

              {/* Then each role in order */}
              {roleOrder.map((role) => {
                const Icon = roleIcons[role];
                const count = groupedCollaborators?.[role]?.length || 0;

                if (count === 0) return null;

                return (
                  <button
                    key={role}
                    onClick={() => setActiveFilter(role)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === role
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:text-foreground hover:bg-card/80"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {roleLabels[role]}
                    <span className={`text-xs ${activeFilter === role ? "opacity-70" : "opacity-50"}`}>
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Loading State */}
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

            {/* Collaborators Grid */}
            {!isLoading && filteredGroups && (
              <div className="space-y-16">
                {(activeFilter === "all" ? roleOrder : [activeFilter]).map((role) => {
                  const collaborators = filteredGroups[role];
                  if (!collaborators || collaborators.length === 0) return null;

                  const Icon = roleIcons[role as RoleFilter];

                  return (
                    <div key={role}>
                      <h2 className="text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
                        <Icon className="w-8 h-8 text-[#FF5722]" />
                        {roleLabels[role as RoleFilter]}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collaborators.map((collaborator) => {
                          // Create slug from name for anchor link
                          const slug = collaborator.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                          return (
                            <div
                              key={collaborator.id}
                              id={slug}
                              className="bg-card border border-border rounded-lg p-6 hover:border-foreground/20 transition-all group scroll-mt-32"
                            >
                              {/* Name */}
                              <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF5722] transition-colors">
                                {collaborator.name}
                              </h3>

                              {/* Bio */}
                              {collaborator.bio && (
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                                  {collaborator.bio}
                                </p>
                              )}

                              {/* Links */}
                              <div className="flex flex-wrap gap-3 mt-4">
                                {collaborator.portfolioUrl && (
                                  <a
                                    href={collaborator.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    {collaborator.role === 'theatre_company' || collaborator.role === 'partner_company' ? 'Website' : 'Portfolio'}
                                  </a>
                                )}
                                {collaborator.website && collaborator.website !== collaborator.portfolioUrl && (
                                  <a
                                    href={collaborator.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Website
                                  </a>
                                )}
                                {collaborator.instagramUrl && (
                                  <a
                                    href={collaborator.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Instagram className="w-3.5 h-3.5" />
                                    @{collaborator.instagramHandle || "Instagram"}
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

            {/* Empty State */}
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
