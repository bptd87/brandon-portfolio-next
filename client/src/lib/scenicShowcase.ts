export const getScenicProjectTimestamp = (project: any) => {
  if (project.year) {
    const monthIndex = project.month ? Math.max(project.month - 1, 0) : 6;
    return new Date(project.year, monthIndex, 1).getTime();
  }

  const fallback = project.updatedAt || project.publishedAt || project.createdAt;
  return fallback ? new Date(fallback).getTime() : 0;
};

export const sortScenicProjectsChronologically = <T extends Record<string, any>>(projects: T[]) => {
  return [...projects].sort((a, b) => {
    const timeCompare = getScenicProjectTimestamp(b) - getScenicProjectTimestamp(a);
    if (timeCompare !== 0) return timeCompare;
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
};

export const splitScenicShowcaseProjects = <T>(projects: T[]) => {
  const [featuredProject, ...remainingProjects] = projects;
  return {
    featuredProject,
    showcaseRailProjects: remainingProjects.slice(0, 3),
    showcaseGridProjects: remainingProjects.slice(3),
  };
};

export const scenicShowcaseProps = {
  desktopColumns: 4 as const,
  hideFeaturedCredit: true,
  leadAspectClassName: "lg:aspect-[3/2]",
  leadImageAspectRatio: "3/2",
  leadTitleClassName:
    "max-w-none whitespace-nowrap text-[clamp(2rem,3.8vw,3.45rem)] font-medium leading-[0.94] tracking-[-0.06em]",
};

export const scenicPortfolioLandingCopy = {
  title: "Scenic Design",
  subtitle: "Production environments built for story, rhythm, and performance.",
  intro:
    "A selected body of scenic design work across musicals, plays, Shakespeare, and new work. These productions are organized as portfolio case studies with images, credits, and the spatial thinking behind the design.",
} as const;
