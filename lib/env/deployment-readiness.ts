import "server-only";

import { getConfiguredSiteUrl } from "./site";

export type DeploymentCheckStatus = "ready" | "attention" | "optional";

export type DeploymentCheck = {
  label: string;
  status: DeploymentCheckStatus;
  detail: string;
};

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export function getDeploymentReadinessChecks(): DeploymentCheck[] {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const resendApiKey = process.env.RESEND_API_KEY || "";
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL || "";
  const contactToEmail = process.env.CONTACT_TO_EMAIL || "";
  const analyticsDashboardUrl =
    process.env.NEXT_PUBLIC_ANALYTICS_DASHBOARD_URL ||
    process.env.NEXT_PUBLIC_POSTHOG_DASHBOARD_URL ||
    "";
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || "";
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "";

  return [
    {
      label: "Canonical Site URL",
      status: hasValue(siteUrl) ? "ready" : "attention",
      detail: hasValue(siteUrl)
        ? `Using ${getConfiguredSiteUrl()}`
        : "Set SITE_URL for stable canonicals, metadata, sitemap, and RSS behavior on Vercel.",
    },
    {
      label: "Admin Sign-In",
      status:
        hasValue(supabaseUrl) && hasValue(supabaseServiceKey) && hasValue(supabaseAnonKey)
          ? "ready"
          : "attention",
      detail:
        hasValue(supabaseUrl) && hasValue(supabaseServiceKey) && hasValue(supabaseAnonKey)
          ? "Supabase auth keys are present for protected admin routes and browser sign-in."
          : "Requires SUPABASE_URL, SUPABASE_SERVICE_KEY, and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    },
    {
      label: "Contact Delivery",
      status:
        hasValue(resendApiKey) && hasValue(contactFromEmail) && hasValue(contactToEmail)
          ? "ready"
          : "attention",
      detail:
        hasValue(resendApiKey) && hasValue(contactFromEmail) && hasValue(contactToEmail)
          ? "Contact submissions can send mail in production."
          : "Requires RESEND_API_KEY, CONTACT_FROM_EMAIL, and CONTACT_TO_EMAIL.",
    },
    {
      label: "Analytics Dashboard Link",
      status: hasValue(analyticsDashboardUrl) ? "ready" : "optional",
      detail: hasValue(analyticsDashboardUrl)
        ? "The workbench can open the external analytics workspace directly."
        : "Optional: set NEXT_PUBLIC_ANALYTICS_DASHBOARD_URL to link straight to the external dashboard.",
    },
    {
      label: "PostHog Browser Tracking",
      status: hasValue(posthogKey) ? "ready" : "optional",
      detail:
        hasValue(posthogKey)
          ? `Client-side PostHog tracking is configured${hasValue(posthogHost) ? " with a custom host" : ""}.`
          : "Optional but recommended if you want external city analytics and custom event tracking.",
    },
  ];
}
