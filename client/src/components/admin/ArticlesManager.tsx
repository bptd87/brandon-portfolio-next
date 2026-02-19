import { useState } from "react";
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

export function ArticlesManager() {
  const [, navigate] = useLocation();
  const { data: articles, isLoading, refetch } = trpc.articles.list.useQuery();
  const deleteMutation = trpc.articles.delete.useMutation();
  const sortedArticles = [...(articles || [])].sort((a, b) => {
    const aPublished = a.publishedAt ? new Date(a.publishedAt).getTime() : Number.NEGATIVE_INFINITY;
    const bPublished = b.publishedAt ? new Date(b.publishedAt).getTime() : Number.NEGATIVE_INFINITY;

    if (bPublished !== aPublished) {
      return bPublished - aPublished;
    }

    const aCreated = new Date(a.createdAt).getTime();
    const bCreated = new Date(b.createdAt).getTime();
    return bCreated - aCreated;
  });

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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">Articles & Stories ({articles?.length || 0})</CardTitle>
              <CardDescription>Manage your blog posts, design stories, and long-form content</CardDescription>
            </div>
            <Button onClick={handleCreate} className="hidden md:inline-flex" size="default">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
            <Button onClick={handleCreate} className="md:hidden" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!articles || articles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No articles yet. Create your first one!</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
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
                    {sortedArticles.map((article) => (
                      <TableRow
                        key={article.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
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
                            <span className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-1">
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

              {/* Mobile Card View */}
              <div className="md:hidden">
                <MobileTableView
                  data={sortedArticles}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
