export type ProjectLinkTarget = {
  slug: string;
  discipline?: string | null;
};

export const getProjectPath = (project: ProjectLinkTarget) => {
  if (project.discipline === "rendering") {
    return `/projects/rendering/${project.slug}`;
  }

  if (project.discipline === "experiential_design" || project.discipline === "experiential") {
    return `/projects/experiential`;
  }

  if (project.discipline === "scenic_design") {
    return `/project/${project.slug}`;
  }

  return "/projects";
};
