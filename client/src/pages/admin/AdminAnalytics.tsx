import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Eye, Globe, Laptop, MousePointerClick, Smartphone, TrendingUp, Users } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { Bar, BarChart, Cell, Line, LineChart, ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis } from "recharts";

const ACCENT = {
  scenic: "var(--accent-scenic)",
  news: "var(--accent-news)",
  articles: "var(--accent-articles)",
  brand: "var(--accent-brand)"
} as const;

function formatDelta(value: number) {
  if (value > 0) return `+${value}% vs previous 30 days`;
  if (value < 0) return `${value}% vs previous 30 days`;
  return "No change vs previous 30 days";
}

export default function AdminAnalytics() {
  const { data: overview, isLoading: isOverviewLoading } = trpc.analytics.getOverview.useQuery();
  const { data: projectViews } = trpc.analytics.getProjectViews.useQuery();
  const { data: visits, isLoading: isVisitsLoading } = trpc.analytics.getStats.useQuery();
  const [locationLevel, setLocationLevel] = useState<"city" | "region" | "country">("city");

  const topProject = projectViews && projectViews.length > 0 ? projectViews[0] : null;
  const locationDenominator = overview?.sessions30d && overview.sessions30d > 0 ? overview.sessions30d : 1;
  const panelClass = "bg-muted/25 border-border/70 shadow-sm";
  const selectedLocations = useMemo(() => {
    if (!overview) return [];
    if (locationLevel === "city") return overview.topCities || [];
    if (locationLevel === "region") return overview.topRegions || [];
    return overview.topCountries || [];
  }, [locationLevel, overview]);

  return (
    <AdminLayout
      title="Analytics & Tracking"
      description="Actionable performance view for the last 30 days."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className={panelClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views (30d)</CardTitle>
            <BarChart3 className="h-4 w-4" style={{ color: ACCENT.articles }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: ACCENT.articles }}>{overview?.pageViews30d ?? 0}</div>
            <p className="text-xs text-muted-foreground">{formatDelta(overview?.pageViewsDeltaPct ?? 0)}</p>
          </CardContent>
        </Card>

        <Card className={panelClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions (30d)</CardTitle>
            <Users className="h-4 w-4" style={{ color: ACCENT.scenic }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: ACCENT.scenic }}>{overview?.sessions30d ?? 0}</div>
            <p className="text-xs text-muted-foreground">Unique tracked sessions</p>
          </CardContent>
        </Card>

        <Card className={panelClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Intent</CardTitle>
            <MousePointerClick className="h-4 w-4" style={{ color: ACCENT.news }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: ACCENT.news }}>{overview?.contactRatePct ?? 0}%</div>
            <p className="text-xs text-muted-foreground">{overview?.contactIntent30d ?? 0} contact signals in 30d</p>
          </CardContent>
        </Card>

        <Card className={panelClass}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Project</CardTitle>
            <Eye className="h-4 w-4" style={{ color: ACCENT.brand }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: ACCENT.brand }}>{topProject?.views ?? 0}</div>
            <p className="text-xs text-muted-foreground truncate">{topProject?.title ?? "No project views yet"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-3 mt-6">
        <Card className={`${panelClass} lg:col-span-2`}>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium">Location Breakdown (30d)</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant={locationLevel === "country" ? "default" : "outline"}
                  className="h-7 px-2 text-[11px]"
                  style={locationLevel === "country" ? { backgroundColor: ACCENT.brand, color: "white", borderColor: ACCENT.brand } : { borderColor: ACCENT.brand, color: ACCENT.brand }}
                  onClick={() => setLocationLevel("country")}
                >
                  Country
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={locationLevel === "region" ? "default" : "outline"}
                  className="h-7 px-2 text-[11px]"
                  style={locationLevel === "region" ? { backgroundColor: ACCENT.news, color: "black", borderColor: ACCENT.news } : { borderColor: ACCENT.news, color: ACCENT.news }}
                  onClick={() => setLocationLevel("region")}
                >
                  Region
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={locationLevel === "city" ? "default" : "outline"}
                  className="h-7 px-2 text-[11px]"
                  style={locationLevel === "city" ? { backgroundColor: ACCENT.scenic, color: "white", borderColor: ACCENT.scenic } : { borderColor: ACCENT.scenic, color: ACCENT.scenic }}
                  onClick={() => setLocationLevel("city")}
                >
                  City
                </Button>
              </div>
            </div>
            <CardDescription>Geo reach by tracked sessions. This is your primary audience signal.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[460px] space-y-3 overflow-y-auto pr-2">
              {selectedLocations.length > 0 ? (
                selectedLocations.map((location) => {
                  const pct = Math.round((location.value / locationDenominator) * 100);
                  return (
                    <div key={location.name} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="truncate text-sm font-medium" title={location.name}>{location.name}</div>
                        <div className="text-xs text-muted-foreground">{location.value} sessions ({pct}%)</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(pct, 4)}%`,
                            backgroundColor: locationLevel === "country"
                              ? ACCENT.brand
                              : locationLevel === "region"
                                ? ACCENT.news
                                : ACCENT.scenic
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">No location data yet</div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3.5 w-3.5" /> Based on {overview?.sessions30d ?? 0} tracked sessions in the current window
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 lg:col-span-1">
          <Card className={panelClass}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Traffic Trend (14d)</CardTitle>
              <CardDescription>Daily page views to catch momentum changes quickly.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                {overview?.dailyViews14d && overview.dailyViews14d.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={overview.dailyViews14d}>
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => format(new Date(value), "MMM d")}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <RechartsTooltip
                        labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--popover-foreground))"
                        }}
                      />
                      <Line type="monotone" dataKey="views" stroke={ACCENT.articles} strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No trend data yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className={panelClass}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Device Breakdown (30d)</CardTitle>
              <CardDescription>Where to focus testing and layout optimization.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[260px] w-full">
                {overview?.deviceBreakdown && overview.deviceBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={overview.deviceBreakdown}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--popover))",
                          borderColor: "hsl(var(--border))",
                          color: "hsl(var(--popover-foreground))"
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {overview.deviceBreakdown.map((item, index) => (
                          <Cell
                            key={`device-${index}`}
                            fill={item.name === "Mobile" ? ACCENT.scenic : ACCENT.brand}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No device data yet</div>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><Laptop className="h-3.5 w-3.5" /> Desktop</div>
                <div className="flex items-center gap-1"><Smartphone className="h-3.5 w-3.5" /> Mobile</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Pages (30d)</CardTitle>
            <CardDescription>Most visited URLs for content prioritization.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview?.topPages && overview.topPages.length > 0 ? (
                overview.topPages.map((page) => (
                  <div key={page.path} className="flex items-center justify-between gap-3">
                    <div className="truncate text-sm" title={page.path}>{page.path}</div>
                    <div className="text-sm font-semibold">{page.views}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No page view data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={panelClass}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Location Summary</CardTitle>
            <CardDescription>Quick totals for geo spread.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">Tracked Sessions</div>
                <div className="text-lg font-semibold">{overview?.sessions30d ?? 0}</div>
              </div>
              <div className="rounded-md border border-border/70 bg-background/60 px-3 py-2">
                <div className="text-xs text-muted-foreground">Known Locations</div>
                <div className="text-lg font-semibold">{selectedLocations.length}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Unknown locations generally indicate bot traffic, local dev, or missing geodata headers.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`mt-6 ${panelClass}`}>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest 100 page views recorded (scroll to inspect full IP/location activity).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-[420px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isVisitsLoading || isOverviewLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">Loading data...</TableCell>
                  </TableRow>
                ) : visits?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">No visits recorded yet.</TableCell>
                  </TableRow>
                ) : (
                  visits?.map((visit: any) => (
                    <TableRow key={visit.id}>
                      <TableCell className="whitespace-nowrap">
                        {visit.created_at ? format(new Date(visit.created_at), "MMM d, h:mm a") : "-"}
                      </TableCell>
                      <TableCell>{visit.page_path}</TableCell>
                      <TableCell>
                        {visit.city && visit.region
                          ? `${visit.city}, ${visit.region}`
                          : (visit.country || "Unknown")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {String(visit.user_agent || "").toLowerCase().includes("mobile") ? "Mobile" : "Desktop"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isOverviewLoading ? (
        <div className="mt-4 text-xs text-muted-foreground">Refreshing analytics metrics...</div>
      ) : (
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" />
          Analytics summary window: last {overview?.periodDays ?? 30} days.
        </div>
      )}
    </AdminLayout>
  );
}
