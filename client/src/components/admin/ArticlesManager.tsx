import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";
import { lazy, Suspense } from "react";
import "react-quill/dist/quill.snow.css";

// Lazy load ReactQuill
const ReactQuill = lazy(() => import("react-quill"));

export function ArticlesManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    categoryId: undefined as number | undefined,
    coverImageUrl: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const utils = trpc.useUtils();
  const { data: articles, isLoading } = trpc.articles.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({ type: "article" });

  const createMutation = trpc.articles.create.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
      toast.success("Article created successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create article");
    },
  });

  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
      toast.success("Article updated successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update article");
    },
  });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      utils.articles.list.invalidate();
      toast.success("Article deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete article");
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: undefined,
      coverImageUrl: "",
      status: "draft",
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      categoryId: article.categoryId,
      coverImageUrl: article.coverImageUrl || "",
      status: article.status,
      featured: article.featured,
      seoTitle: article.seoTitle || "",
      seoDescription: article.seoDescription || "",
      seoKeywords: article.seoKeywords || "",
    });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate({ id });
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      seoTitle: title, // Auto-populate SEO title
    });
  };

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    }),
    []
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Articles</h2>
          <p className="text-muted-foreground">Manage blog posts and long-form content</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Article" : "Create Article"}</DialogTitle>
              <DialogDescription>
                Write and publish articles with rich content and SEO optimization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Article title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="article-slug"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId?.toString() || ""}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoryId: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief summary for article cards..."
                      rows={3}
                      required
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      value={formData.coverImageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, coverImageUrl: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Content</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Suspense fallback={<div className="p-4">Loading editor...</div>}>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content: string) => setFormData({ ...formData, content })}
                      modules={quillModules}
                      className="min-h-[300px]"
                    />
                  </Suspense>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use the editor above for rich text. For advanced features like accordions and
                  galleries, edit the HTML directly.
                </p>
              </div>

              {/* SEO Fields */}
              <div className="space-y-4">
                <h3 className="font-semibold">SEO Optimization</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seoTitle">SEO Title</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="Optimized title for search engines"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, seoDescription: e.target.value })
                      }
                      placeholder="Meta description for search results (150-160 characters)"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seoKeywords">Keywords</Label>
                    <Input
                      id="seoKeywords"
                      value={formData.seoKeywords}
                      onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="space-y-4">
                <h3 className="font-semibold">Publishing</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      Featured Article
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingId ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Articles List */}
      <div className="grid gap-4">
        {articles?.map((article) => {
          const category = categories?.find((c) => c.id === article.categoryId);
          return (
            <div
              key={article.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="flex gap-4 flex-1">
                {article.coverImageUrl && (
                  <img
                    src={article.coverImageUrl}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{article.title}</h3>
                    {category && (
                      <span
                        className="text-xs px-2 py-1 rounded-full text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.name}
                      </span>
                    )}
                    {article.featured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-500 text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Status: {article.status}</span>
                    <span>Slug: {article.slug}</span>
                    {article.publishedAt && (
                      <span>
                        Published: {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/articles/${article.slug}`} target="_blank">
                    <Eye className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleEdit(article)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
        {articles?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No articles yet. Create your first article to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
