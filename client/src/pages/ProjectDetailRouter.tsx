import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import ProjectDetail from "./ProjectDetail";
import RenderingProjectDetail from "./RenderingProjectDetail";
import { getLocalRenderingProjectBySlug } from "@shared/localPortfolios";

/**
 * Router component that determines which project detail page to render
 * based on the project's discipline
 */
export default function ProjectDetailRouter() {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useLocation();
  const normalizedSlug = (slug || "").trim().toLowerCase();
  const isRenderingRoute =
    location.startsWith("/projects/rendering/") ||
    location.startsWith("/projects/experiential/rendering/");
  const localRenderingProject = isRenderingRoute
    ? getLocalRenderingProjectBySlug(normalizedSlug)
    : null;

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
    { enabled: !!normalizedSlug && !localRenderingProject }
  );

  useEffect(() => {
    if (localRenderingProject && isRenderingRoute) return;
    if (!project?.slug || project.slug === normalizedSlug) return;

    const canonicalPath = location.startsWith("/projects/experiential/rendering/")
      ? `/projects/experiential/rendering/${project.slug}`
      : location.startsWith("/projects/rendering/")
        ? `/projects/rendering/${project.slug}`
        : `/project/${project.slug}`;

    if (location !== canonicalPath) {
      setLocation(canonicalPath, { replace: true });
    }
  }, [isRenderingRoute, localRenderingProject, location, normalizedSlug, project?.slug, setLocation]);

  if (localRenderingProject && isRenderingRoute) {
    return <RenderingProjectDetail />;
  }

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
    case 'scenic_design':
    default:
      return <ProjectDetail />;
  }
}
