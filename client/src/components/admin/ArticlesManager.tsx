import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BlockArticleEditor } from "./BlockArticleEditor";

export function ArticlesManager() {
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: articles, refetch } = trpc.articles.list.useQuery();
  const deleteMutation = trpc.articles.delete.useMutation();

  const handleClose = () => {
    setEditingId(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Article deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete article");
    }
  };

  if (editingId !== null) {
    return (
      <BlockArticleEditor
        articleId={editingId === -1 ? undefined : editingId}
        onSave={() => {
          refetch();
          handleClose();
        }}
        onCancel={handleClose}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles</h2>
        <Button onClick={() => setEditingId(-1)}>
          <Plus className="w-4 h-4 mr-2" />
          New Article
        </Button>
      </div>

      <div className="grid gap-4">
        {articles?.map((article) => (
          <div
            key={article.id}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{article.title}</h3>
                {article.featured && (
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                    Featured
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    article.status === "published"
                      ? "bg-green-100 text-green-800"
                      : article.status === "draft"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {article.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{article.excerpt}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Slug: /{article.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingId(article.id)}>
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(article.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
