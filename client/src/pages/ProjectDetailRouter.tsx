import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import RenderingProjectDetail from "./RenderingProjectDetail";
import { getLocalRenderingProjectBySlug } from "@shared/localPortfolios";
import { getLocalScenicProjectBySlug } from "@shared/localScenicProjects";
import ScenicProjectDetail from "./ScenicProjectDetail";

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
  const localScenicProject = !isRenderingRoute ? getLocalScenicProjectBySlug(normalizedSlug) : null;

  useEffect(() => {
    if (!slug || !normalizedSlug || slug === normalizedSlug) return;

    const currentSuffix = `/${slug}`;
    const nextLocation = location.endsWith(currentSuffix)
      ? `${location.slice(0, -slug.length)}${normalizedSlug}`
      : location.replace(slug, normalizedSlug);

    setLocation(nextLocation, { replace: true });
  }, [location, normalizedSlug, setLocation, slug]);

  useEffect(() => {
    if (localRenderingProject || localScenicProject) return;
  }, [localRenderingProject, localScenicProject]);

  if (localRenderingProject && isRenderingRoute) {
    return <RenderingProjectDetail />;
  }

  if (localScenicProject && !isRenderingRoute) {
    return <ScenicProjectDetail />;
  }

  if (!localRenderingProject && !localScenicProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        </div>
      </div>
    );
  }

  return null;
}
