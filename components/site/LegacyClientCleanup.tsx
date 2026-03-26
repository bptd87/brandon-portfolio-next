"use client";

import { useEffect } from "react";

const CLEANUP_FLAG = "__legacy-spa-cleanup-v1__";

export function LegacyClientCleanup() {
  useEffect(() => {
    let cancelled = false;

    async function cleanupLegacyClientArtifacts() {
      if (typeof window === "undefined") return;
      if (window.sessionStorage.getItem(CLEANUP_FLAG) === "done") return;

      let shouldReload = false;

      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (cancelled) return;

        if (registrations.length > 0) {
          shouldReload = true;
          await Promise.all(registrations.map((registration) => registration.unregister()));
        }
      }

      if ("caches" in window) {
        const cacheKeys = await caches.keys();

        if (cancelled) return;

        if (cacheKeys.length > 0) {
          shouldReload = true;
          await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
        }
      }

      window.sessionStorage.setItem(CLEANUP_FLAG, "done");

      if (shouldReload && !cancelled) {
        window.location.reload();
      }
    }

    void cleanupLegacyClientArtifacts();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
