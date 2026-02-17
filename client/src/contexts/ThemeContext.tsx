import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  setForceTheme: (theme: Theme | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  // Default to light theme unless a page explicitly forces otherwise
  const [forceTheme, setForceTheme] = useState<Theme | null>(null);
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  // When forceTheme is set, it overrides everything (including localStorage)
  // When forceTheme is null, user can switch themes (only on Articles/News)
  const effectiveTheme = forceTheme !== null ? forceTheme : theme;

  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable && !forceTheme) {
      localStorage.setItem("theme", theme);
    }
  }, [effectiveTheme, theme, switchable, forceTheme]);

  const toggleTheme = (switchable || forceTheme === null)
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, toggleTheme, switchable, setForceTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
