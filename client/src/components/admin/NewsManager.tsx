import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { MobileTableView } from "./MobileTableView";
import { ADMIN_PANEL_CLASS, getAdminAccentColor } from "./adminTheme";
import { AdminStatStrip } from "./AdminStatStrip";
import { AdminFilterBar } from "./AdminFilterBar";
import { AdminEmptyState } from "./AdminEmptyState";

export function NewsManager() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: news, isLoading, refetch } = trpc.news.list.useQuery({});
  const deleteNews = trpc.news.delete.useMutation({
    onSuccess: () => {
      toast.success("News item deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete news: ${error.message}`);
    },
  });

  const sortedNews = useMemo(
    () => [...(news || [])].sort((a, b) => new Date(b.date ?? new Date()).getTime() - new Date(a.date ?? new Date()).getTime()),
    [news]
  );

  const filteredNews = useMemo(() => {
    return sortedNews.filter((item) => {
      const searchMatch = !search || [item.title, item.slug, item.location, item.excerpt]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [search, sortedNews, statusFilter]);

  const stats = useMemo(() => {
    const published = sortedNews.filter((n) => n.status === "published").length;
    const drafts = sortedNews.filter((n) => n.status === "draft").length;
    const featured = sortedNews.filter((n) => n.featured).length;
    return { published, drafts, featured };
  }, [sortedNews]);

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteNews.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Card className={ADMIN_PANEL_CLASS}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl" style={{ color: getAdminAccentColor("news") }}>News & Updates</CardTitle>
              <CardDescription>Manage news items and career updates</CardDescription>
            </div>
            <Button onClick={() => navigate("/admin/news/new")} className="hidden md:inline-flex text-white" size="default" style={{ backgroundColor: getAdminAccentColor("news") }}>
              <Plus className="h-4 w-4 mr-2" />
              New News Item
            </Button>
            <Button onClick={() => navigate("/admin/news/new")} className="md:hidden text-white" size="sm" style={{ backgroundColor: getAdminAccentColor("news") }}>
              <Plus className="h-4 w-4 mr-2" />
              New News Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AdminStatStrip
              items={[
                { label: "Total", value: sortedNews.length, accent: "news" },
                { label: "Published", value: stats.published, accent: "news" },
                { label: "Drafts", value: stats.drafts, accent: "news" },
                { label: "Featured", value: stats.featured, accent: "news" }
              ]}
            />
            <AdminFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search headline, slug, location..."
              statusValue={statusFilter}
              onStatusChange={setStatusFilter}
              statusOptions={[
                { label: "All Statuses", value: "all" },
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" },
                { label: "Archived", value: "archived" }
              ]}
            />
          </div>
          {sortedNews.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Cover</TableHead>
                      <TableHead>Title & Info</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNews.map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors group"
                        onClick={() => navigate(`/admin/news/${item.id}/edit`)}
                      >
                        <TableCell className="py-2">
                          {item.coverImageUrl ? (
                            <img
                              src={item.coverImageUrl}
                              alt={item.title}
                              className="h-10 w-10 object-cover rounded border border-border"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground border border-dashed">
                              None
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm leading-tight transition-colors group-hover:opacity-90" style={{ color: getAdminAccentColor("news") }}>
                              {item.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">
                              /{item.slug}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={item.status === 'published' ? 'default' : 'secondary'}
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {item.status}
                            </Badge>
                            {item.featured && (
                              <div title="Featured News">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10">
                                  ★
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground">
                          {item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => navigate(`/admin/news/${item.id}/edit`)}
                              title="Edit News Item"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(item.id, item.title)}
                              title="Delete News Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden mt-4">
                <MobileTableView
                  data={filteredNews}
                  idKey="id"
                  columns={[
                    {
                      key: 'title',
                      label: 'News Item',
                      render: (_, item) => (
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">/{item.slug}</p>
                        </div>
                      )
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      badge: true,
                      render: (status, item) => (
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={status === 'published' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {status}
                          </Badge>
                          {item.featured && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10 text-xs">
                              ★ Featured
                            </Badge>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'date',
                      label: 'Date',
                      render: (_, item) => item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'
                    }
                  ]}
                  onEdit={(item) => navigate(`/admin/news/${item.id}/edit`)}
                  onDelete={(item) => handleDelete(item.id, item.title)}
                />
              </div>
            </>
          ) : null}

          {sortedNews.length === 0 ? (
            <AdminEmptyState
              title="No news items yet"
              description="Publish your first update to start building your timeline."
              actionLabel="Create News Item"
              onAction={() => navigate("/admin/news/new")}
              accent="news"
            />
          ) : filteredNews.length === 0 ? (
            <AdminEmptyState
              title="No matching news items"
              description="Try a different search query or status filter."
              accent="news"
            />
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
