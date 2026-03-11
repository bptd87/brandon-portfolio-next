import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import ProjectDetail from "./ProjectDetail";
import RenderingProjectDetail from "./RenderingProjectDetail";
import ExperientialProjectDetail from "./ExperientialProjectDetail";

/**
 * Router component that determines which project detail page to render
 * based on the project's discipline
 */
export default function ProjectDetailRouter() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const normalizedSlug = (slug || "").trim().toLowerCase();

  useEffect(() => {
    if (!slug || !normalizedSlug || slug === normalizedSlug) return;

    const currentSuffix = `/${slug}`;
    const nextLocation = location.endsWith(currentSuffix)
      ? `${location.slice(0, -slug.length)}${normalizedSlug}`
      : location.replace(slug, normalizedSlug);

    setLocation(nextLocation, { replace: true });
  }, [location, normalizedSlug, setLocation, slug]);

  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery(
    { slug: normalizedSlug },
    { enabled: !!normalizedSlug }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        </div>
      </div>
    );
  }

  // Route to discipline-specific detail page
  switch (project.discipline) {
    case 'rendering':
      return <RenderingProjectDetail />;
    case 'experiential_design':
      return <ExperientialProjectDetail />;
    case 'scenic_design':
    default:
      return <ProjectDetail />;
  }
}
