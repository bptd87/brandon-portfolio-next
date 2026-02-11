import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import ProjectDetail from "./ProjectDetail";

/**
 * Router component that determines which project detail page to render
 * based on the project's discipline
 */
export default function ProjectDetailRouter() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading } = trpc.projects.getBySlug.useQuery({ slug: slug! });

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

  // All projects now use the unified ProjectDetail component
  return <ProjectDetail />;
}
