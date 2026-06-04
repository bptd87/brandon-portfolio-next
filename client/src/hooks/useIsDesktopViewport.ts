"use client";

import { useEffect, useState } from "react";

export function useIsDesktopViewport(query = "(min-width: 768px)") {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, [query]);

  return isDesktopViewport;
}
