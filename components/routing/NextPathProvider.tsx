"use client";

import type { ReactNode } from "react";
import { Router } from "wouter";
import { usePathname, useRouter as useNextRouter } from "next/navigation";

function useNextAppLocation({
  ssrPath,
}: { ssrPath?: string } = {}): [string, (path: string, options?: { replace?: boolean }) => void] {
  const nextRouter = useNextRouter();
  const pathname = usePathname() || ssrPath || "/";

  const navigate = (to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      nextRouter.replace(to);
      return;
    }

    nextRouter.push(to);
  };

  return [pathname, navigate];
}

type NextPathProviderProps = {
  children: ReactNode;
  currentPath: string;
};

export function NextPathProvider({ children, currentPath }: NextPathProviderProps) {
  return (
    <Router hook={useNextAppLocation} ssrPath={currentPath}>
      {children}
    </Router>
  );
}
