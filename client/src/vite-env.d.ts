/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_POSTHOG_KEY?: string;
  readonly VITE_PUBLIC_POSTHOG_HOST?: string;
  readonly VITE_PUBLIC_POSTHOG_PROJECT_URL?: string;
  readonly VITE_PUBLIC_POSTHOG_DASHBOARD_URL?: string;
  readonly VITE_PUBLIC_POSTHOG_RECORDINGS_URL?: string;
  readonly VITE_PUBLIC_POSTHOG_FUNNELS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
