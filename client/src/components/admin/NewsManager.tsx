import { useState } from "react";
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
import { NewsForm } from "./NewsForm";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { MobileTableView } from "./MobileTableView";

export function NewsManager() {
  const [, navigate] = useLocation();
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

  const handleEdit = (newsItem: any) => {
    navigate(`/admin/news/${newsItem.id}/edit`);
  };

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteNews.mutate({ id });
    }
  };

  const handleFormClose = () => {
    refetch();
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
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">News & Updates</CardTitle>
              <CardDescription>Manage news items and career updates</CardDescription>
            </div>
            <Button onClick={() => navigate("/admin/news/new")} className="hidden md:inline-flex" size="default">
              <Plus className="h-4 w-4 mr-2" />
              New News Item
            </Button>
            <Button onClick={() => navigate("/admin/news/new")} className="md:hidden" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New News Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!news || news.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No news items yet. Create your first one!</p>
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
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {news
                      .sort((a, b) => new Date(b.date ?? new Date()).getTime() - new Date(a.date ?? new Date()).getTime())
                      .map((item) => (
                      <TableRow
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
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
                            <span className="font-medium text-sm leading-tight group-hover:text-primary transition-colors">
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

              {/* Mobile Card View */}
              <div className="md:hidden">
                <MobileTableView
                  data={news.sort((a, b) => new Date(b.date ?? new Date()).getTime() - new Date(a.date ?? new Date()).getTime())}
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
          )}
        </CardContent>
      </Card>

    </>
  );
}
