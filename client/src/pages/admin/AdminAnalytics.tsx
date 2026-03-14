import { useMemo } from "react";
import { format } from "date-fns";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Film,
  Funnel,
  Globe,
  KeyRound,
  MapPin,
  MousePointerClick,
  Radar,
  RefreshCw,
  Settings2,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostHogDebugInfo } from "@/lib/posthog";
import { trpc } from "@/lib/trpc";

const DASHBOARD_URL = import.meta.env.VITE_PUBLIC_POSTHOG_DASHBOARD_URL?.trim() || "";
const PROJECT_URL = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_URL?.trim() || "";
const RECORDINGS_URL = import.meta.env.VITE_PUBLIC_POSTHOG_RECORDINGS_URL?.trim() || "";
const FUNNELS_URL = import.meta.env.VITE_PUBLIC_POSTHOG_FUNNELS_URL?.trim() || "";

const TRACKED_EVENTS = [
  {
    name: "$pageview",
    detail: "SPA page views captured on route change.",
  },
  {
    name: "project_viewed",
    detail: "Project detail views with discipline, slug, and title.",
  },
  {
    name: "contact_form_submitted",
    detail: "Contact form submit attempts.",
  },
  {
    name: "contact_form_submit_succeeded",
    detail: "Successful contact submissions.",
  },
  {
    name: "contact_form_submit_failed",
    detail: "Failed contact submissions for troubleshooting.",
  },
] as const;

function shareOfTotal(value: number, items: Array<{ views: number }>) {
  const total = items.reduce((sum, item) => sum + item.views, 0);
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function AnalyticsStatusCard({
  title,
  value,
  note,
  icon: Icon,
  tone = "brand",
}: {
  title: string;
  value: string;
  note: string;
  icon: typeof Activity;
  tone?: "brand" | "success" | "warn";
}) {
  const toneStyles =
    tone === "success"
      ? { color: "#22c55e", borderColor: "rgba(34,197,94,0.22)" }
      : tone === "warn"
        ? { color: "#f59e0b", borderColor: "rgba(245,158,11,0.22)" }
        : { color: "var(--accent-brand)", borderColor: "color-mix(in srgb, var(--accent-brand) 22%, transparent)" };

  return (
    <Card className="border-border/70 bg-muted/25 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full border bg-background/80"
          style={toneStyles}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  );
}

function EmbeddedPanel({
  title,
  description,
  url,
  icon: Icon,
}: {
  title: string;
  description: string;
  url?: string;
  icon: typeof Activity;
}) {
  const hasUrl = Boolean(url);

  return (
    <Card className="border-border/70 bg-muted/25 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80">
            <Icon className="h-4 w-4 text-[var(--accent-brand)]" />
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasUrl ? (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
            <iframe
              title={title}
              src={url}
              className="h-[720px] w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-6">
            <p className="text-sm font-medium">Embed not configured</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add a shared PostHog URL in the matching Vite env var to display this panel here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BreakdownList({
  title,
  description,
  items,
  emptyLabel,
}: {
  title: string;
  description: string;
  items: Array<{ label: string; views: number; detail?: string }>;
  emptyLabel: string;
}) {
  return (
    <Card className="border-border/70 bg-muted/25 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.label} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium" title={item.label}>
                    {item.label}
                  </div>
                  {item.detail ? <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div> : null}
                </div>
                <div className="text-sm font-semibold">{item.views}</div>
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-[var(--accent-brand)]"
                  style={{ width: `${Math.max(8, shareOfTotal(item.views, items))}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">{emptyLabel}</div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminAnalytics() {
  const debug = getPostHogDebugInfo();
  const { data: overview, isLoading, error, refetch, isFetching } = trpc.analytics.getOverview.useQuery();

  const quickLinks = useMemo(
    () =>
      [
        { label: "Open Project", href: PROJECT_URL || (overview?.projectId ? `https://us.posthog.com/project/${overview.projectId}/web` : ""), icon: ExternalLink },
        { label: "Dashboard", href: DASHBOARD_URL, icon: BarChart3 },
        { label: "Recordings", href: RECORDINGS_URL, icon: Film },
        { label: "Funnels", href: FUNNELS_URL, icon: Funnel },
      ].filter((item) => item.href),
    [overview?.projectId]
  );

  const contactChart = useMemo(
    () =>
      (overview?.contactEvents || []).map((item, index) => ({
        ...item,
        fill: ["#00BCD4", "#4CAF50", "#FF5722"][index % 3],
      })),
    [overview?.contactEvents]
  );

  const recentEvents = overview?.recentEvents || [];
  const topPages = overview?.topPages || [];
  const topProjects = overview?.topProjects || [];
  const dailyViews = overview?.dailyViews14d || [];
  const topReferrers = overview?.topReferrers || [];
  const deviceBreakdown = overview?.deviceBreakdown || [];
  const browserBreakdown = overview?.browserBreakdown || [];
  const countryBreakdown = overview?.countryBreakdown || [];
  const recentCities = overview?.recentCities || [];

  const deviceItems = useMemo(
    () =>
      deviceBreakdown.map((item) => ({
        label: item.device,
        views: item.views,
        detail: `${shareOfTotal(item.views, deviceBreakdown)}% of pageviews`,
      })),
    [deviceBreakdown]
  );

  const browserItems = useMemo(
    () =>
      browserBreakdown.map((item) => ({
        label: item.browser,
        views: item.views,
        detail: `${shareOfTotal(item.views, browserBreakdown)}% of pageviews`,
      })),
    [browserBreakdown]
  );

  const countryItems = useMemo(
    () =>
      countryBreakdown.map((item) => ({
        label: item.country,
        views: item.views,
        detail: `${shareOfTotal(item.views, countryBreakdown)}% of pageviews`,
      })),
    [countryBreakdown]
  );

  return (
    <AdminLayout
      title="PostHog Analytics"
      description="PostHog is now the primary analytics system for site traffic, project interest, and contact conversion signals."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatusCard
          title="Tracking Status"
          value={debug.enabled && overview?.configured ? "Connected" : "Missing Config"}
          note={
            debug.enabled && overview?.configured
              ? "Client tracking and server-side analytics queries are both available."
              : "Set VITE_PUBLIC_POSTHOG_KEY and VITE_PUBLIC_POSTHOG_HOST."
          }
          icon={debug.enabled && overview?.configured ? CheckCircle2 : ShieldAlert}
          tone={debug.enabled && overview?.configured ? "success" : "warn"}
        />
        <AnalyticsStatusCard
          title="Page Views (30d)"
          value={String(overview?.pageViews30d ?? 0)}
          note={`${overview?.pageViewsDeltaPct ?? 0}% vs previous 30 days`}
          icon={TrendingUp}
        />
        <AnalyticsStatusCard
          title="Visitors (30d)"
          value={String(overview?.visitors30d ?? 0)}
          note="Distinct visitors based on PostHog identities."
          icon={Users}
        />
        <AnalyticsStatusCard
          title="Project Views (30d)"
          value={String(overview?.projectViews30d ?? 0)}
          note="All project detail interest events in the last 30 days."
          icon={Radar}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatusCard
          title="Contact Success (30d)"
          value={String(overview?.contactSubmits30d ?? 0)}
          note={`${overview?.contactConversionPct ?? 0}% visitor-to-contact conversion`}
          icon={MousePointerClick}
          tone="success"
        />
        <AnalyticsStatusCard
          title="Project ID"
          value={overview?.projectId || "Not set"}
          note="PostHog project queried by the server."
          icon={KeyRound}
        />
        <AnalyticsStatusCard
          title="PostHog Host"
          value={debug.host || "Not set"}
          note="US cloud endpoint in current configuration."
          icon={Globe}
        />
        <AnalyticsStatusCard
          title="Current Distinct ID"
          value={debug.distinctId || "Unavailable"}
          note="Useful for validating local tracking and recordings."
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Tracked Event Coverage</CardTitle>
            <CardDescription>
              The current PostHog integration focuses on pageviews, portfolio engagement, and contact conversion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {TRACKED_EVENTS.map((event) => (
              <div
                key={event.name}
                className="flex items-start justify-between gap-4 rounded-xl border border-border/70 bg-background/70 px-4 py-3"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-[var(--accent-brand)]">{event.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
                </div>
                <MousePointerClick className="mt-0.5 h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">PostHog Control Center</CardTitle>
                <CardDescription>
                  Launch the full analytics workspace from here or embed shared dashboards below.
                </CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {quickLinks.length > 0 ? (
                quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button key={item.href} variant="outline" className="justify-between" asChild>
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        <span className="inline-flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                  Add one or more of these env vars to make this panel more useful:
                  <div className="mt-3 space-y-1 font-mono text-xs">
                    <div>VITE_PUBLIC_POSTHOG_PROJECT_URL</div>
                    <div>VITE_PUBLIC_POSTHOG_DASHBOARD_URL</div>
                    <div>VITE_PUBLIC_POSTHOG_RECORDINGS_URL</div>
                    <div>VITE_PUBLIC_POSTHOG_FUNNELS_URL</div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/70 bg-background/60 p-4">
              <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold">
                <Settings2 className="h-4 w-4 text-[var(--accent-brand)]" />
                Query Layer
              </div>
              <p className="text-sm text-muted-foreground">
                {overview?.configured
                  ? "Server-side PostHog queries are active. This page is now reading live analytics data from your PostHog project."
                  : "Add POSTHOG_PERSONAL_API_KEY, POSTHOG_PROJECT_ID, and POSTHOG_API_HOST on the server to enable custom analytics queries here."}
              </p>
            </div>
            {error ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                {error.message}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Traffic Trend (14d)</CardTitle>
            <CardDescription>Daily PostHog pageviews across the last two weeks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading trend data...</div>
              ) : dailyViews.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyViews}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(value) => format(new Date(value), "MMM d")} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RechartsTooltip
                      labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--popover-foreground))",
                      }}
                    />
                    <Line type="monotone" dataKey="views" stroke="var(--accent-brand)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No pageview data yet.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Contact Funnel Events (30d)</CardTitle>
            <CardDescription>Submit attempts, successes, and failures.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Loading contact events...</div>
              ) : contactChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contactChart}>
                    <XAxis dataKey="event" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        borderColor: "hsl(var(--border))",
                        color: "hsl(var(--popover-foreground))",
                      }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {contactChart.map((item) => (
                        <Cell key={item.event} fill={item.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No contact events yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownList
          title="Traffic Sources (30d)"
          description="Referring domains and direct traffic based on PostHog pageview events."
          items={topReferrers.map((item) => ({
            label: item.source,
            views: item.views,
            detail: `${item.visitors} visitors`,
          }))}
          emptyLabel="No referrer data yet."
        />
        <BreakdownList
          title="Device Mix (30d)"
          description="Which device types are driving portfolio traffic right now."
          items={deviceItems}
          emptyLabel="No device data yet."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Pages (30d)</CardTitle>
            <CardDescription>Best-performing pages based on pageviews and unique visitors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPages.length > 0 ? (
              topPages.map((page) => (
                <div key={page.path} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="truncate text-sm font-medium" title={page.path}>{page.path}</div>
                    <div className="text-sm font-semibold">{page.views} views</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{page.visitors} visitors</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No top-page data yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Projects (30d)</CardTitle>
            <CardDescription>Which portfolio pieces are attracting the most interest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProjects.length > 0 ? (
              topProjects.map((project) => (
                <div key={`${project.slug}-${project.title}`} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">{project.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{project.slug}</div>
                    </div>
                    <div className="text-sm font-semibold">{project.views} views</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No project-view data yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <BreakdownList
          title="Browser Mix (30d)"
          description="A quick view of browser coverage across current visitors."
          items={browserItems}
          emptyLabel="No browser data yet."
        />
        <BreakdownList
          title="Geographic Reach (30d)"
          description="Top countries derived from PostHog geo-enriched pageviews."
          items={countryItems}
          emptyLabel="No geographic data yet."
        />
      </div>

      <Card className="border-border/70 bg-muted/25 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/80">
              <MapPin className="h-4 w-4 text-[var(--accent-brand)]" />
            </div>
            <div>
              <CardTitle className="text-base">Recent Cities</CardTitle>
              <CardDescription>Recent geo-enriched pageviews with location and page context.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCities.length > 0 ? (
              recentCities.map((item, index) => (
                <div
                  key={`${item.timestamp}-${item.city}-${item.path}-${index}`}
                  className="rounded-xl border border-border/70 bg-background/70 px-4 py-3"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {item.city}, {item.region}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.country}</div>
                      <div className="mt-2 truncate text-sm text-muted-foreground" title={item.path}>
                        {item.path}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.timestamp ? format(new Date(item.timestamp), "MMM d, yyyy h:mm a") : "Unknown time"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No recent city data yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-muted/25 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Recent Tracked Events</CardTitle>
          <CardDescription>The latest pageviews, project views, and contact events from PostHog.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEvents.length > 0 ? (
              recentEvents.map((item, index) => (
                <div key={`${item.timestamp}-${item.event}-${index}`} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-mono text-sm font-semibold text-[var(--accent-brand)]">{item.event}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {item.projectTitle || item.path || "No path or project context"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.timestamp ? format(new Date(item.timestamp), "MMM d, yyyy h:mm a") : "Unknown time"}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No recent tracked events yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <EmbeddedPanel
        title="Overview Dashboard"
        description="Best connected to a shared PostHog dashboard URL."
        url={DASHBOARD_URL}
        icon={BarChart3}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <EmbeddedPanel
          title="Session Recordings"
          description="Useful for understanding navigation friction and drop-off."
          url={RECORDINGS_URL}
          icon={Film}
        />
        <EmbeddedPanel
          title="Funnels and Conversions"
          description="Track contact form completion and other key journeys."
          url={FUNNELS_URL}
          icon={Funnel}
        />
      </div>
    </AdminLayout>
  );
}
