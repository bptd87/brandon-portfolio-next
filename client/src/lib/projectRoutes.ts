export type ProjectLinkTarget = {
  slug: string;
  discipline?: string | null;
};

export const getProjectPath = (project: ProjectLinkTarget) => {
  if (project.discipline === 'rendering') {
    return `/projects/rendering/${project.slug}`;
  }

  // Handle both experiential_design and legacy "experiential" value
  if (project.discipline === 'experiential_design' || project.discipline === 'experiential') {
    return `/projects/experiential`;
  }

  if (project.discipline === 'scenic_design') {
    return `/project/${project.slug}`;
  }

  // Fallback for unknown disciplines - link to main projects page
  if (project.discipline && project.discipline !== 'scenic_design') {
    console.warn('[getProjectPath] Unknown discipline:', project.discipline, 'for project:', project.slug);
  }
  
  return `/projects`;
};
