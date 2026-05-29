"use client";

import { useEffect } from "react";

export function StudioFrameMode() {
  useEffect(() => {
    const isStudioFrame =
      new URLSearchParams(window.location.search).get("studioFrame") === "1";

    if (isStudioFrame) {
      document.documentElement.dataset.studioFrame = "true";
      return () => {
        delete document.documentElement.dataset.studioFrame;
      };
    }

    delete document.documentElement.dataset.studioFrame;
    return undefined;
  }, []);

  return null;
}
