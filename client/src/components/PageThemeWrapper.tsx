import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface PageThemeWrapperProps {
  children: React.ReactNode;
  forceTheme?: "dark" | "light" | null;
}

export default function PageThemeWrapper({ children, forceTheme = "dark" }: PageThemeWrapperProps) {
  const { setForceTheme } = useTheme();

  useEffect(() => {
    setForceTheme(forceTheme);
    
    // Cleanup: reset to dark theme when component unmounts (leaving articles/news)
    return () => {
      setForceTheme("dark");
    };
  }, [forceTheme, setForceTheme]);

  return <>{children}</>;
}
