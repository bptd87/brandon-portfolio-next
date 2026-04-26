import type { LocalScenicProject } from "./localScenicProjects";

export type ScenicProjectSummary = Pick<
  LocalScenicProject,
  | "id"
  | "title"
  | "slug"
  | "discipline"
  | "subcategory"
  | "client"
  | "year"
  | "month"
  | "coverImageUrl"
  | "createdAt"
  | "updatedAt"
  | "publishedAt"
> & {
  directorName?: string | null;
};

const getDirectorName = (project: LocalScenicProject) => {
  const director = project.creativeTeam.find((member) => {
    const role = member.role.toLowerCase();
    return role === "director" || role.includes("director");
  });

  return director?.name || null;
};

export const toScenicProjectSummary = (
  project: LocalScenicProject
): ScenicProjectSummary => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  discipline: project.discipline,
  subcategory: project.subcategory,
  client: project.client,
  year: project.year,
  month: project.month,
  coverImageUrl: project.coverImageUrl,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  publishedAt: project.publishedAt,
  directorName: getDirectorName(project),
});
