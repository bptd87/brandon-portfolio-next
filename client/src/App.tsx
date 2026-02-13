
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PageLoadingIndicator } from "./components/PageLoadingIndicator";
import { useState, useEffect } from "react";
import { TodoDialog } from "@/components/TodoDialog";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

// Only Home page loads immediately - everything else is lazy loaded
import Home from "./pages/Home";

// All other routes lazy load on demand for better initial performance
const News = lazy(() => import("./pages/News"));
const Articles = lazy(() => import("./pages/Articles"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Studio = lazy(() => import("./pages/Studio"));
const Collaborators = lazy(() => import("./pages/Collaborators"));
const ProjectDetailRouter = lazy(() => import("./pages/ProjectDetailRouter"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const ArticleDetail = lazy(() => import("./pages/ArticleDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const AdminProjectEdit = lazy(() => import("./pages/AdminProjectEdit"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminNews = lazy(() => import("./pages/admin/AdminNews"));
const AdminArticles = lazy(() => import("./pages/admin/AdminArticles"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminTags = lazy(() => import("./pages/admin/AdminTags"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminNewsEdit = lazy(() => import("./pages/admin/AdminNewsEdit"));
const AdminArticleEdit = lazy(() => import("./pages/admin/AdminArticleEdit"));
const AdminTutorials = lazy(() => import("./pages/admin/AdminTutorials"));
const AdminTutorialEdit = lazy(() => import("./pages/admin/AdminTutorialEdit"));
const AdminScenicDirectory = lazy(() => import("./pages/admin/AdminScenicDirectory"));
const AdminScenicDirectoryEdit = lazy(() => import("./pages/admin/AdminScenicDirectoryEdit"));
const AdminCollaborators = lazy(() => import("./pages/admin/AdminCollaborators"));
const AdminCollaboratorEdit = lazy(() => import("./pages/admin/AdminCollaboratorEdit"));
const AuthDebug = lazy(() => import("./pages/AuthDebug"));

// Non-critical routes - lazy load for better initial performance

const TeachingPhilosophy = lazy(() => import("./pages/TeachingPhilosophy"));
const SyllabusExperiential = lazy(() => import("./pages/SyllabusExperiential"));
const Syllabus3DModeling = lazy(() => import("./pages/Syllabus3DModeling"));
const Resume = lazy(() => import("./pages/Resume"));
const CreativeStatement = lazy(() => import("./pages/CreativeStatement"));
const StudioTutorials = lazy(() => import("./pages/StudioTutorials"));
const StudioApps = lazy(() => import("./pages/StudioApps"));
const StudioDirectory = lazy(() => import("./pages/StudioDirectory"));
const Vault = lazy(() => import("./pages/Vault"));
const ScaleCalculator = lazy(() => import("./pages/ScaleCalculator"));
const DimensionReference = lazy(() => import("./pages/DimensionReference"));
const DesignHistoryTimeline = lazy(() => import("./pages/DesignHistoryTimeline"));
const RoscoPaintCalculator = lazy(() => import("./pages/RoscoPaintCalculator"));
const ExperientialPortfolio = lazy(() => import("./pages/ExperientialPortfolio"));
const RenderingPortfolio = lazy(() => import("./pages/RenderingPortfolio"));
const ScenicModelsPortfolio = lazy(() => import("./pages/ScenicModelsPortfolio"));
const TutorialDetail = lazy(() => import("./pages/TutorialDetail"));
const TagDetail = lazy(() => import('@/pages/TagDetail'));
const Links = lazy(() => import('@/pages/Links'));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

function Router() {
  const [location] = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // make sure to consider if you need authentication for certain routes
  return (
    <PageTransition>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }>
        <Switch>
          <Route path={"/login"} component={Login} />
          <Route path={"/auth-debug"} component={AuthDebug} />
          <Route path={"/"} component={Home} />
          <Route path={"/projects"} component={Projects} />
          <Route path={"/projects/scenic-design"} component={Projects} />
          <Route path={"/projects/experiential"} component={ExperientialPortfolio} />
          <Route path={"/projects/rendering"} component={RenderingPortfolio} />
          <Route path={"/projects/scenic-models"} component={ScenicModelsPortfolio} />
          <Route path={"/projects/:slug"} component={ProjectDetailRouter} />
          <Route path={"/news"} component={News} />
          <Route path={"/news/:slug"} component={NewsDetail} />
          <Route path={"/articles"} component={Articles} />
          <Route path={"/articles/:slug"} component={ArticleDetail} />
          <Route path={"/tags/:slug"} component={TagDetail} />
          <Route path={"/about"} component={About} />
          <Route path={"/about/collaborators"} component={Collaborators} />

          <Route path={"/about/teaching"} component={TeachingPhilosophy} />
          <Route path={"/about/philosophy"} component={TeachingPhilosophy} />
          <Route path={"/teaching-philosophy"} component={TeachingPhilosophy} />
          <Route path={"/syllabus/experiential-design"} component={SyllabusExperiential} />
          <Route path={"/syllabus/3d-modeling"} component={Syllabus3DModeling} />
          <Route path={"/resume"} component={Resume} />
          <Route path={"/creative-statement"} component={CreativeStatement} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/studio/tutorials/:slug"} component={TutorialDetail} />
          <Route path={"/studio/tutorials"} component={StudioTutorials} />
          <Route path={"/studio/apps/scale-calculator"} component={ScaleCalculator} />
          <Route path={"/studio/apps/dimension-reference"} component={DimensionReference} />
          <Route path={"/studio/apps/design-history-timeline"} component={DesignHistoryTimeline} />
          <Route path={"/studio/apps/rosco-paint-calculator"} component={RoscoPaintCalculator} />
          <Route path={"/studio/apps"} component={StudioApps} />
          <Route path={"/studio/directory"} component={StudioDirectory} />
          <Route path={"/studio"} component={Studio} />
          <Route path={"/vault"} component={Vault} />
          <Route path="/admin/projects/new" component={AdminProjectEdit} />
          <Route path="/admin/projects/:id/edit" component={AdminProjectEdit} />
          <Route path="/admin/news/new" component={AdminNewsEdit} />
          <Route path="/admin/news/:id/edit" component={AdminNewsEdit} />
          <Route path="/admin/articles/new" component={AdminArticleEdit} />
          <Route path="/admin/articles/:id/edit" component={AdminArticleEdit} />
          <Route path="/admin/projects" component={AdminProjects} />
          <Route path="/admin/news" component={AdminNews} />
          <Route path="/admin/analytics" component={AdminAnalytics} />
          <Route path="/admin/articles" component={AdminArticles} />
          <Route path="/admin/categories" component={AdminCategories} />
          <Route path="/admin/tags" component={AdminTags} />
          <Route path="/admin/tutorials/new" component={AdminTutorialEdit} />
          <Route path="/admin/tutorials/:id/edit" component={AdminTutorialEdit} />
          <Route path="/admin/tutorials" component={AdminTutorials} />

          <Route path="/admin/scenic-directory/new" component={AdminScenicDirectoryEdit} />
          <Route path="/admin/scenic-directory/:id/edit" component={AdminScenicDirectoryEdit} />
          <Route path="/admin/scenic-directory" component={AdminScenicDirectory} />

          <Route path="/admin/collaborators/new" component={AdminCollaboratorEdit} />
          <Route path="/admin/collaborators/:id/edit" component={AdminCollaboratorEdit} />
          <Route path="/admin/collaborators" component={AdminCollaborators} />
          <Route path={"/admin"} component={Admin} />
          <Route path={"/privacy"} component={Privacy} />
          <Route path={"/terms"} component={Terms} />
          <Route path={"/faq"} component={FAQ} />
          <Route path={"/accessibility"} component={Accessibility} />
          <Route path={"/sitemap"} component={Sitemap} />
          <Route path={"/links"} component={Links} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </PageTransition>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const [isTodoOpen, setIsTodoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command + Shift + C
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === 'KeyC') {
        e.preventDefault();
        setIsTodoOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable={false}
      >
        <div className="min-h-screen bg-gradient-premium">
          <PageLoadingIndicator />
          <TooltipProvider>
            <Toaster />
            <TodoDialog open={isTodoOpen} onOpenChange={setIsTodoOpen} />
            <AnalyticsTracker />
            <Router />
          </TooltipProvider>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
