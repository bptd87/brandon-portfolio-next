import { AnalyticsOverview } from "../../../components/admin/AnalyticsOverview";
import { AdminShell } from "../../../components/admin/AdminShell";
import { buildPageMetadata } from "../../../lib/metadata";

export const metadata = buildPageMetadata({
  title: "Admin Analytics",
  description: "Traffic, page demand, project interest, and conversion signals for the Next.js site.",
  pathname: "/admin/analytics",
  noindex: true,
});

export default function AdminAnalyticsPage() {
  return (
    <AdminShell
      currentPath="/admin/analytics"
      eyebrow="Analytics"
      title="See demand and location signals before you build."
      description="Use the traffic view to decide what to make next, and keep country and city context visible as the site shifts toward Vercel-native analytics."
    >
      <AnalyticsOverview />
    </AdminShell>
  );
}
