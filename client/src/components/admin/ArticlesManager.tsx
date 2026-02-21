import { useMemo, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Eye, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileTableView } from "./MobileTableView";
import { ADMIN_PANEL_CLASS, getAdminAccentColor } from "./adminTheme";
import { AdminStatStrip } from "./AdminStatStrip";
import { AdminFilterBar } from "./AdminFilterBar";
import { AdminEmptyState } from "./AdminEmptyState";

export function ArticlesManager() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: articles, isLoading, refetch } = trpc.articles.list.useQuery();
  const deleteMutation = trpc.articles.delete.useMutation();

  const sortedArticles = useMemo(() => [...(articles || [])].sort((a, b) => {
    const aPublished = a.publishedAt ? new Date(a.publishedAt).getTime() : Number.NEGATIVE_INFINITY;
    const bPublished = b.publishedAt ? new Date(b.publishedAt).getTime() : Number.NEGATIVE_INFINITY;

    if (bPublished !== aPublished) {
      return bPublished - aPublished;
    }

    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  }), [articles]);

  const filteredArticles = useMemo(() => {
    return sortedArticles.filter((article) => {
      const searchMatch = !search || [article.title, article.slug, article.excerpt, article.category?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusMatch = statusFilter === "all" || article.status === statusFilter;
      return searchMatch && statusMatch;
    });
  }, [search, sortedArticles, statusFilter]);

  const stats = useMemo(() => {
    const published = sortedArticles.filter((a) => a.status === "published").length;
    const drafts = sortedArticles.filter((a) => a.status === "draft").length;
    const featured = sortedArticles.filter((a) => a.featured).length;
    return { published, drafts, featured };
  }, [sortedArticles]);

  const handleEdit = (id: number) => {
    navigate(`/admin/articles/${id}/edit`);
  };

  const handleCreate = () => {
    navigate("/admin/articles/new");
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Article deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article");
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
    <div className="space-y-6">
      <Card className={ADMIN_PANEL_CLASS}>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl" style={{ color: getAdminAccentColor("articles") }}>Articles & Stories ({articles?.length || 0})</CardTitle>
              <CardDescription>Manage your blog posts, design stories, and long-form content</CardDescription>
            </div>
            <Button onClick={handleCreate} className="hidden md:inline-flex text-white" size="default" style={{ backgroundColor: getAdminAccentColor("articles") }}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
            <Button onClick={handleCreate} className="md:hidden text-white" size="sm" style={{ backgroundColor: getAdminAccentColor("articles") }}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AdminStatStrip
              items={[
                { label: "Total", value: sortedArticles.length, accent: "articles" },
                { label: "Published", value: stats.published, accent: "articles" },
                { label: "Drafts", value: stats.drafts, accent: "articles" },
                { label: "Featured", value: stats.featured, accent: "articles" }
              ]}
            />
            <AdminFilterBar
              searchValue={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search title, slug, excerpt, category..."
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

          {sortedArticles.length > 0 ? (
            <>
              <div className="hidden md:block overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Cover</TableHead>
                      <TableHead>Title & Info</TableHead>
                      <TableHead>Meta</TableHead>
                      <TableHead>Published</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredArticles.map((article) => (
                      <TableRow
                        key={article.id}
                        className="cursor-pointer hover:bg-muted/40 transition-colors group"
                        onClick={() => handleEdit(article.id)}
                      >
                        <TableCell className="py-2">
                          {article.coverImageUrl ? (
                            <img
                              src={article.coverImageUrl}
                              alt={article.title}
                              className="h-10 w-10 object-cover rounded border border-border"
                            />
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground border border-dashed">
                              <FileText className="h-3.5 w-3.5 opacity-50" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm leading-tight transition-colors group-hover:opacity-90 line-clamp-1" style={{ color: getAdminAccentColor("articles") }}>
                              {article.title}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                {article.category?.name || "No Category"}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60">•</span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                /{article.slug}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <Badge
                              variant={
                                article.status === "published"
                                  ? "default"
                                  : article.status === "draft"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-[10px] px-1.5 py-0 h-4"
                            >
                              {article.status}
                            </Badge>
                            {article.featured && (
                              <div title="Featured Article">
                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10">
                                  ★
                                </Badge>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-2 text-[11px] text-muted-foreground">
                          {article.publishedAt
                            ? new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                            : "Not published"}
                        </TableCell>
                        <TableCell className="py-2 text-right">
                          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                            {article.status === "published" && (
                              <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <a href={`/articles/${article.slug}`} target="_blank" title="View Article">
                                  <Eye className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleEdit(article.id)}
                              title="Edit Article"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(article.id, article.title)}
                              title="Delete Article"
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
                  data={filteredArticles}
                  idKey="id"
                  columns={[
                    {
                      key: 'title',
                      label: 'Article',
                      render: (_, article) => (
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {article.category?.name || "No Category"} • /{article.slug}
                          </p>
                        </div>
                      )
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      badge: true,
                      render: (_, article) => (
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={
                              article.status === "published"
                                ? "default"
                                : article.status === "draft"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {article.status}
                          </Badge>
                          {article.featured && (
                            <Badge variant="outline" className="border-amber-500/50 text-amber-500 dark:text-amber-400 bg-amber-500/10 text-xs">
                              ★
                            </Badge>
                          )}
                        </div>
                      )
                    },
                    {
                      key: 'publishedAt',
                      label: 'Published',
                      render: (_, article) =>
                        article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                          : "Not published"
                    }
                  ]}
                  onEdit={(article) => handleEdit(article.id)}
                  onDelete={(article) => handleDelete(article.id, article.title)}
                  onView={(article) => article.status === 'published' ? window.open(`/articles/${article.slug}`) : null}
                />
              </div>
            </>
          ) : null}

          {sortedArticles.length === 0 ? (
            <AdminEmptyState
              title="No articles yet"
              description="Write your first long-form article to expand search visibility."
              actionLabel="Create Article"
              onAction={handleCreate}
              accent="articles"
            />
          ) : filteredArticles.length === 0 ? (
            <AdminEmptyState
              title="No matching articles"
              description="Try another search phrase or status filter."
              accent="articles"
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
