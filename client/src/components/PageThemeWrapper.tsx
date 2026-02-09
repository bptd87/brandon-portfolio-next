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
    
    // Cleanup: remove force theme when component unmounts
    return () => {
      setForceTheme(null);
    };
  }, [forceTheme, setForceTheme]);

  return <>{children}</>;
}
