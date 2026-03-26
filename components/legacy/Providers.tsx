"use client";

import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "../../client/src/components/ui/tooltip";
import { Toaster } from "../../client/src/components/ui/sonner";

export function LegacyProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
