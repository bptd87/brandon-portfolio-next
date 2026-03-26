"use client";

import { useMemo } from "react";
import {
  BarChart3,
  ExternalLink,
  Globe2,
  MapPin,
  MousePointerClick,
  Radar,
  TrendingUp,
  Users,
} from "lucide-react";

import { Button } from "../../client/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../client/src/components/ui/card";
import { readPublicEnv } from "../../client/src/lib/readPublicEnv";
import { trpc } from "../../client/src/lib/trpc";

const DASHBOARD_URL = readPublicEnv(
  "NEXT_PUBLIC_ANALYTICS_DASHBOARD_URL",
  "NEXT_PUBLIC_POSTHOG_DASHBOARD_URL",
  "VITE_PUBLIC_POSTHOG_DASHBOARD_URL"
);

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof TrendingUp;
}) {
  return (
    <Card className="border-border/70 bg-muted/25 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-foreground/50" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-semibold">{value}</div>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsOverview() {
  const { data, isLoading, error, refetch, isFetching } = trpc.analytics.getOverview.useQuery();

  const topPages = useMemo(() => data?.topPages?.slice(0, 8) ?? [], [data?.topPages]);
  const topProjects = useMemo(() => data?.topProjects?.slice(0, 8) ?? [], [data?.topProjects]);
  const topCountries = useMemo(() => data?.countryBreakdown?.slice(0, 6) ?? [], [data?.countryBreakdown]);
  const recentCities = useMemo(() => data?.recentCities?.slice(0, 8) ?? [], [data?.recentCities]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Page Views (30d)"
          value={String(data?.pageViews30d ?? 0)}
          detail={`${data?.pageViewsDeltaPct ?? 0}% vs previous 30 days`}
          icon={TrendingUp}
        />
        <MetricCard
          title="Visitors (30d)"
          value={String(data?.visitors30d ?? 0)}
          detail="Distinct visitors from PostHog."
          icon={Users}
        />
        <MetricCard
          title="Project Views (30d)"
          value={String(data?.projectViews30d ?? 0)}
          detail="Interest in portfolio detail pages."
          icon={Radar}
        />
        <MetricCard
          title="Contact Success (30d)"
          value={String(data?.contactSubmits30d ?? 0)}
          detail={`${data?.contactConversionPct ?? 0}% visitor-to-contact conversion`}
          icon={MousePointerClick}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Top Pages</CardTitle>
                <CardDescription>Most-viewed pages over the last 30 days.</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading analytics…</div>
            ) : topPages.length > 0 ? (
              topPages.map((item) => (
                <div key={item.path} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium" title={item.path}>
                        {item.path}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.visitors} visitors</div>
                    </div>
                    <div className="text-sm font-semibold">{item.views}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No pageview data yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Projects</CardTitle>
            <CardDescription>Most-viewed portfolio projects over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading project interest…</div>
            ) : topProjects.length > 0 ? (
              topProjects.map((item) => (
                <div key={item.slug} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium" title={item.title}>
                        {item.title}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.slug}</div>
                    </div>
                    <div className="text-sm font-semibold">{item.views}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No project view data yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Top Countries</CardTitle>
            <CardDescription>Keep the high-level geographic picture as traffic moves to Vercel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading location data…</div>
            ) : topCountries.length > 0 ? (
              topCountries.map((item) => (
                <div key={item.country} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-2 text-sm font-medium">
                      <Globe2 className="h-4 w-4 text-foreground/50" />
                      <span>{item.country}</span>
                    </div>
                    <div className="text-sm font-semibold">{item.views}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No country data yet.</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/25 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Recent Cities</CardTitle>
            <CardDescription>City-level context stays visible even if traffic reporting moves providers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Loading city activity…</div>
            ) : recentCities.length > 0 ? (
              recentCities.map((item) => (
                <div key={`${item.timestamp}-${item.city}-${item.path}`} className="rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="inline-flex items-center gap-2 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-foreground/50" />
                        <span className="truncate">{item.city}, {item.region}</span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {item.country} · {item.path}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No city-level activity yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70 bg-muted/25 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">Full Dashboard</CardTitle>
              <CardDescription>Open the full analytics workspace when you need deeper drilling.</CardDescription>
            </div>
            {DASHBOARD_URL ? (
              <Button variant="outline" asChild>
                <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Open Dashboard
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              {error.message}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              This page is Next-native and keeps traffic and location signals available in one place while the
              site transitions toward Vercel-native analytics.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
