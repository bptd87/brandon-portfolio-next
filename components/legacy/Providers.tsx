"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";

import { TooltipProvider } from "../../client/src/components/ui/tooltip";
import { Toaster } from "../../client/src/components/ui/sonner";

export function LegacyProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} forcedTheme="dark">
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}
