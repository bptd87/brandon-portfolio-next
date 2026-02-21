import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FolderKanban, Newspaper, FileText, ArrowUpRight, TrendingUp, Layout } from "lucide-react";
import { Link } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { trpc } from "@/lib/trpc";
import { ADMIN_PANEL_CLASS, getAdminAccentColor, type AdminAccentKey } from "@/components/admin/adminTheme";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();

  const { data: projects } = trpc.projects.list.useQuery({});
  const { data: news } = trpc.news.list.useQuery({});
  const { data: articles } = trpc.articles.list.useQuery({});

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Admin Access Required</CardTitle>
            <CardDescription>Please sign in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl("/admin")}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have permission to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: "Projects",
      value: projects?.length || 0,
      icon: FolderKanban,
      href: "/admin/projects",
      accent: "projects" as AdminAccentKey
    },
    {
      label: "News Posts",
      value: news?.length || 0,
      icon: Newspaper,
      href: "/admin/news",
      accent: "news" as AdminAccentKey
    },
    {
      label: "Articles",
      value: articles?.length || 0,
      icon: FileText,
      href: "/admin/articles",
      accent: "articles" as AdminAccentKey
    },
  ];

  return (
    <AdminLayout
      title={`Welcome back, ${user.name || 'Admin'}`}
      description="Here's what's happening with your portfolio today."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className={`${ADMIN_PANEL_CLASS} hover:border-border transition-all duration-300 cursor-pointer group`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className="p-3 rounded-xl border"
                    style={{
                      backgroundColor: `hsl(var(--background) / 0.45)`,
                      borderColor: getAdminAccentColor(stat.accent),
                      color: getAdminAccentColor(stat.accent)
                    }}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" style={{ color: getAdminAccentColor(stat.accent) }} />
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-bold mt-1" style={{ color: getAdminAccentColor(stat.accent) }}>{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={ADMIN_PANEL_CLASS}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: getAdminAccentColor("dashboard") }} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
              <Link href="/admin/projects/new">
                <FolderKanban className="h-5 w-5" />
                Create New Project
              </Link>
            </Button>
            <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
              <Link href="/admin/news/new">
                <Newspaper className="h-5 w-5" />
                Post News Update
              </Link>
            </Button>
            <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
              <Link href="/admin/articles/new">
                <FileText className="h-5 w-5" />
                Write New Article
              </Link>
            </Button>
            <Button className="w-full justify-start gap-3 h-12 text-base" variant="outline" asChild>
              <Link href="/admin/rendering-gallery">
                <Layout className="h-5 w-5" />
                Manage Rendering Gallery
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className={ADMIN_PANEL_CLASS}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.slice(0, 3).map((p) => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-muted flex-shrink-0">
                    {p.coverImageUrl ? (
                      <img src={p.coverImageUrl} className="w-full h-full object-cover rounded" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-tight">{p.discipline?.replace('_', ' ')}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Updated</span>
                </div>
              ))}
              {!projects?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
