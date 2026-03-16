import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { getLoginUrl } from "./const";
import { initPostHog } from "./lib/posthog";
import { handleSessionToken, getStoredSessionToken } from "./lib/sessionHandler";
import "./index.css";

const LOCALHOST_HOSTNAMES = new Set(["localhost", "127.0.0.1"]);
const LOCALHOST_CACHE_RESET_KEY = "__localhost-cache-reset__";

const resetLocalhostServiceWorker = async () => {
  if (typeof window === "undefined") return;
  if (!LOCALHOST_HOSTNAMES.has(window.location.hostname)) return;

  const hadResetFlag = window.sessionStorage.getItem(LOCALHOST_CACHE_RESET_KEY) === "done";
  let shouldReload = false;

  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (registrations.length > 0) {
      shouldReload = true;
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  }

  if ("caches" in window) {
    const cacheKeys = await caches.keys();
    if (cacheKeys.length > 0) {
      shouldReload = true;
      await Promise.all(cacheKeys.map((cacheKey) => caches.delete(cacheKey)));
    }
  }

  if (shouldReload && !hadResetFlag) {
    window.sessionStorage.setItem(LOCALHOST_CACHE_RESET_KEY, "done");
    window.location.reload();
    return;
  }

  if (!shouldReload && hadResetFlag) {
    window.sessionStorage.removeItem(LOCALHOST_CACHE_RESET_KEY);
  }
};

// Handle session token from URL (for browsers that block third-party cookies)
handleSessionToken();
initPostHog();
void resetLocalhostServiceWorker();

// Suppress ResizeObserver loop errors (known Safari bug)
const resizeObserverErr = window.console.error;
window.console.error = (...args: any[]) => {
  if (args[0]?.toString().includes('ResizeObserver loop')) {
    return;
  }
  resizeObserverErr(...args);
};

// Safari can emit noisy unhandled AbortError rejections when in-flight requests are canceled on route changes.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason as any;
  const message = String(reason?.message || reason || '');
  if (reason?.name === 'AbortError' || message.includes('operation was aborted')) {
    event.preventDefault();
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
      gcTime: 1000 * 60 * 10, // 10 minutes - cache retention (formerly cacheTime)
      refetchOnWindowFocus: false, // Don't refetch on window focus
      retry: 1, // Retry failed queries once
    },
  },
});

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  window.location.href = getLoginUrl();
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      maxURLLength: 2083, // Standard max URL length
      async headers() {
        const headers: Record<string, string> = {};

        // Try getting Supabase session first
        const { data } = await supabase.auth.getSession();
        const token = data.session?.access_token;

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          // Fallback to stored token for legacy/dev-login
          const storedToken = getStoredSessionToken();
          if (storedToken) {
            headers['Authorization'] = `Bearer ${storedToken}`;
          }
        }
        return headers;
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </HelmetProvider>
);
