"use client";

import { TooltipProvider } from "../../client/src/components/ui/tooltip";
import { Toaster } from "../../client/src/components/ui/sonner";

export function LegacyProviders({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      {children}
      <Toaster />
    </TooltipProvider>
  );
}
