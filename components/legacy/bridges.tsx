"use client";

import dynamic from "next/dynamic";

export const AccessibilityPage = dynamic(() => import("../../client/src/pages/Accessibility"), {
  ssr: false,
});
export const AboutPage = dynamic(() => import("../../client/src/pages/About"), {
  ssr: false,
});
export const ArticleDetailPage = dynamic(() => import("../../client/src/pages/ArticleDetail"), {
  ssr: false,
});
export const ArticlesPage = dynamic(() => import("../../client/src/pages/Articles"), {
  ssr: false,
});
export const AssistantScenicDesignPage = dynamic(
  () => import("../../client/src/pages/AssistantScenicDesign"),
  { ssr: false }
);
export const CollaboratorsPage = dynamic(() => import("../../client/src/pages/Collaborators"), {
  ssr: false,
});
export const CreativeStatementPage = dynamic(
  () => import("../../client/src/pages/CreativeStatement"),
  { ssr: false }
);
export const DesignHistoryTimelinePage = dynamic(
  () => import("../../client/src/pages/DesignHistoryTimeline"),
  { ssr: false }
);
export const DimensionReferencePage = dynamic(
  () => import("../../client/src/pages/DimensionReference"),
  { ssr: false }
);
export const ExperientialPortfolioPage = dynamic(
  () => import("../../client/src/pages/ExperientialPortfolio"),
  { ssr: false }
);
export const ExperientialProjectDetailPage = dynamic(
  () => import("../../client/src/pages/ExperientialProjectDetail"),
  { ssr: false }
);
export const ExperientialSampleDetailPage = dynamic(
  () => import("../../client/src/pages/ExperientialSampleDetail"),
  { ssr: false }
);
export const FAQPage = dynamic(() => import("../../client/src/pages/FAQ"), {
  ssr: false,
});
export const HomePage = dynamic(() => import("../../client/src/pages/Home"), {
  ssr: false,
});
export const LinksPage = dynamic(() => import("../../client/src/pages/Links"), {
  ssr: false,
});
export const NotFoundPage = dynamic(() => import("../../client/src/pages/NotFound"), {
  ssr: false,
});
export const PrivacyPage = dynamic(() => import("../../client/src/pages/Privacy"), {
  ssr: false,
});
export const ProjectsPage = dynamic(() => import("../../client/src/pages/Projects"), {
  ssr: false,
});
export const RenderingPortfolioPage = dynamic(
  () => import("../../client/src/pages/RenderingPortfolio"),
  { ssr: false }
);
export const RenderingProjectDetailPage = dynamic(
  () => import("../../client/src/pages/RenderingProjectDetail"),
  { ssr: false }
);
export const ResumePage = dynamic(() => import("../../client/src/pages/Resume"), {
  ssr: false,
});
export const RoscoPaintCalculatorPage = dynamic(
  () => import("../../client/src/pages/RoscoPaintCalculator"),
  { ssr: false }
);
export const ScaleCalculatorPage = dynamic(
  () => import("../../client/src/pages/ScaleCalculator"),
  { ssr: false }
);
export const Scenic3DConverterPage = dynamic(
  () => import("../../client/src/pages/Scenic3DConverter"),
  { ssr: false }
);
export const ScenicProjectDetailPage = dynamic(
  () => import("../../client/src/pages/ScenicProjectDetail"),
  { ssr: false }
);
export const SitemapPage = dynamic(() => import("../../client/src/pages/Sitemap"), {
  ssr: false,
});
export const StudioAppsPage = dynamic(() => import("../../client/src/pages/StudioApps"), {
  ssr: false,
});
export const StudioDirectoryPage = dynamic(
  () => import("../../client/src/pages/StudioDirectory"),
  { ssr: false }
);
export const StudioPage = dynamic(() => import("../../client/src/pages/Studio"), {
  ssr: false,
});
export const StudioTutorialsPage = dynamic(
  () => import("../../client/src/pages/StudioTutorials"),
  { ssr: false }
);
export const TagDetailPage = dynamic(() => import("../../client/src/pages/TagDetail"), {
  ssr: false,
});
export const TeachingPhilosophyPage = dynamic(
  () => import("../../client/src/pages/TeachingPhilosophy"),
  { ssr: false }
);
export const TermsPage = dynamic(() => import("../../client/src/pages/Terms"), {
  ssr: false,
});
export const TutorialDetailPage = dynamic(() => import("../../client/src/pages/TutorialDetail"), {
  ssr: false,
});
