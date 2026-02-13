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

export function ArticlesManager() {
  const [, navigate] = useLocation();
  const { data: articles, isLoading, refetch } = trpc.articles.list.useQuery();
  const deleteMutation = trpc.articles.delete.useMutation();

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Articles & Stories ({articles?.length || 0})</CardTitle>
              <CardDescription>Manage your blog posts, design stories, and long-form content</CardDescription>
            </div>
            <Button onClick={handleCreate}>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Cover</TableHead>
                  <TableHead>Title & Info</TableHead>
                  <TableHead>Meta</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
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
                      {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
