import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import News from "./pages/News";
import Articles from "./pages/Articles";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import About from "./pages/About";
import AboutResume from "./pages/AboutResume";
import TeachingPhilosophy from "./pages/TeachingPhilosophy";
import Resume from "./pages/Resume";
import CreativeStatement from "./pages/CreativeStatement";
import { Contact } from "./pages/Contact";
import Studio from "./pages/Studio";
import StudioTutorials from "./pages/StudioTutorials";
import StudioApps from "./pages/StudioApps";
import StudioDirectory from "./pages/StudioDirectory";
import ScaleCalculator from "./pages/ScaleCalculator";
import DimensionReference from "./pages/DimensionReference";
import DesignHistoryTimeline from "./pages/DesignHistoryTimeline";
import RoscoPaintCalculator from "./pages/RoscoPaintCalculator";
import TutorialDetail from "./pages/TutorialDetail";
import NewsDetail from "./pages/NewsDetail";
import ArticleDetail from "./pages/ArticleDetail";
import AdminFaqConvert from "./pages/AdminFaqConvert";
import AdminImportNews from "./pages/AdminImportNews";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Accessibility from "./pages/Accessibility";
import Sitemap from "./pages/Sitemap";

function Router() {
  const [location] = useLocation();
  
  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  // make sure to consider if you need authentication for certain routes
  return (
    <PageTransition>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/projects"} component={Projects} />
      <Route path={"/projects/:slug"} component={ProjectDetail} />
      <Route path={"/news"} component={News} />
      <Route path={"/news/:slug"} component={NewsDetail} />
      <Route path={"/articles"} component={Articles} />
      <Route path={"/articles/:slug"} component={ArticleDetail} />
      <Route path={"/admin/faq-convert"} component={AdminFaqConvert} />
      <Route path={"/admin/import-news"} component={AdminImportNews} />
      <Route path={"/about"} component={About} />
      <Route path={"/about/resume"} component={AboutResume} />
      <Route path={"/about/teaching"} component={TeachingPhilosophy} />
      <Route path={"/about/philosophy"} component={CreativeStatement} />
      <Route path={"/teaching-philosophy"} component={TeachingPhilosophy} />
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
      <Route path={"/admin"} component={Admin} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/accessibility"} component={Accessibility} />
      <Route path={"/sitemap"} component={Sitemap} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      </Switch>
    </PageTransition>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        switchable
      >
        <div className="min-h-screen bg-gradient-premium">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
