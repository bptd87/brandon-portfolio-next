import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Globe, Users, Laptop, Smartphone, Info, TrendingUp, Eye, Share2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { format } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function AdminAnalytics() {
    // Temporarily disabled - analytics tables not yet created in Supabase
    const { data: visits, isLoading } = trpc.analytics.getStats.useQuery(undefined, { enabled: false });
    const { data: projectViews } = trpc.analytics.getProjectViews.useQuery(undefined, { enabled: false });
    const { data: conversionFunnel } = trpc.analytics.getConversionFunnel.useQuery(undefined, { enabled: false });
    const { data: geoBreakdown } = trpc.analytics.getGeographicBreakdown.useQuery(undefined, { enabled: false });

    return (
        <AdminLayout
            title="Analytics & Tracking"
            description="Monitor site traffic and visitor engagement."
        >
            {/* Top KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{visits?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Recorded page views
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {geoBreakdown?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Unique cities reached
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Project</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate text-ellipsis">
                            {projectViews && projectViews.length > 0
                                ? projectViews[0].views
                                : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {projectViews && projectViews.length > 0
                                ? projectViews[0].title
                                : 'No project views'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {conversionFunnel && conversionFunnel.length > 0
                                ? conversionFunnel[2]?.percentage || 0
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Home to Contact
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Conversion Funnel & Project Views */}
            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Funnel</CardTitle>
                        <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {conversionFunnel && conversionFunnel.length > 0 ? conversionFunnel.map((step: any, i: number) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">{step.name}</span>
                                        <span className="text-sm text-muted-foreground">{step.count} ({step.percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all"
                                            style={{ width: `${step.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )) : (
                                <div className="text-muted-foreground text-sm">No funnel data yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Projects</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-3">
                            {projectViews && projectViews.length > 0 ? projectViews.slice(0, 6).map((project: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium truncate">{project.title}</div>
                                        <div className="text-xs text-muted-foreground">{project.slug}</div>
                                    </div>
                                    <div className="text-sm font-bold">{project.views}</div>
                                </div>
                            )) : (
                                <div className="text-muted-foreground text-sm">No project views yet</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Location & Device Breakdown */}
            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{visits?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Recorded page views
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Locations</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {visits ? new Set(visits.map((v: any) => v.city)).size : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Cities reached
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Page</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold truncate text-ellipsis">
                            {visits && visits.length > 0
                                ? (Object.entries(visits.reduce((acc: any, v: any) => ({ ...acc, [v.page_path]: (acc[v.page_path] || 0) + 1 }), {} as Record<string, number>)) as [string, number][])
                                    .sort((a, b) => b[1] - a[1])[0][0]
                                : '-'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Most visited path
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Locations</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full mt-4">
                            {geoBreakdown && geoBreakdown.length > 0 ? (
                                (() => {
                                    const data = geoBreakdown.slice(0, 8).map((loc: any) => ({
                                        name: loc.label,
                                        value: loc.count
                                    }));

                                    return (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                                                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                                                />
                                                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    );
                                })()
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No location data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Device Breakdown</CardTitle>
                        <div className="flex gap-1">
                            <Laptop className="h-4 w-4 text-muted-foreground" />
                            <Smartphone className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full mt-4">
                            {visits && visits.length > 0 ? (
                                (() => {
                                    const devices = visits.reduce((acc: any, v: any) => {
                                        const type = v.user_agent?.toLowerCase().includes('mobile') ? 'Mobile' : 'Desktop';
                                        acc[type] = (acc[type] || 0) + 1;
                                        return acc;
                                    }, { Desktop: 0, Mobile: 0 });

                                    const data = Object.entries(devices)
                                        .filter(([_, value]: any) => value > 0)
                                        .map(([name, value]) => ({ name, value }));

                                    const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted-foreground))'];

                                    return (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={data}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {data.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))' }}
                                                />
                                                <Legend verticalAlign="bottom" height={36} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    );
                                })()
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No device data</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card className="md:col-span-2 lg:col-span-4 mt-6">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                        Latest 100 page views recorded.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
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
                                {isLoading ? (
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
                                                {visit.created_at ? format(new Date(visit.created_at), 'MMM d, h:mm a') : '-'}
                                            </TableCell>
                                            <TableCell>{visit.page_path}</TableCell>
                                            <TableCell>
                                                {visit.city && visit.region
                                                    ? `${visit.city}, ${visit.region}`
                                                    : (visit.country || 'Unknown')}
                                            </TableCell>
                                            <TableCell className="max-w-[200px] truncate text-muted-foreground" title={visit.user_agent}>
                                                {visit.user_agent?.includes('Mobile') ? 'Mobile' : 'Desktop'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
