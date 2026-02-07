import { useState, useEffect } from "react";
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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import "./tiptap.css";

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

  const { data: articles, refetch } = trpc.articles.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({ type: "article" });
  const createMutation = trpc.articles.create.useMutation();
  const updateMutation = trpc.articles.update.useMutation();
  const deleteMutation = trpc.articles.delete.useMutation();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, content: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (editor && formData.content !== editor.getHTML()) {
      editor.commands.setContent(formData.content);
    }
  }, [formData.content, editor]);

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
    editor?.commands.clearContent();
  };

  const handleEdit = (article: any) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || "",
      content: article.content || "",
      categoryId: article.categoryId || undefined,
      coverImageUrl: article.coverImageUrl || "",
      status: article.status,
      featured: article.featured,
      seoTitle: article.seoTitle || "",
      seoDescription: article.seoDescription || "",
      seoKeywords: article.seoKeywords || "",
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...formData });
        toast.success("Article updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Article created successfully");
      }
      refetch();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save article");
    }
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles</h2>
        <Button onClick={() => setOpen(true)}>
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
              <Button variant="outline" size="sm" onClick={() => handleEdit(article)}>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Article" : "New Article"}</DialogTitle>
            <DialogDescription>
              Create or edit an article with rich content and SEO metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Title & Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title),
                    });
                  }}
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="article-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label>Excerpt *</Label>
              <Textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the article"
                rows={3}
              />
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <Label>Content *</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="border-b bg-muted p-2 flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? "bg-accent" : ""}
                  >
                    Bold
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? "bg-accent" : ""}
                  >
                    Italic
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor?.isActive("heading", { level: 3 }) ? "bg-accent" : ""}
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? "bg-accent" : ""}
                  >
                    List
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const url = window.prompt("Enter URL");
                      if (url) {
                        editor?.chain().focus().setLink({ href: url }).run();
                      }
                    }}
                    className={editor?.isActive("link") ? "bg-accent" : ""}
                  >
                    Link
                  </Button>
                </div>
                <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
              </div>
            </div>

            {/* Category & Cover Image */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId?.toString()}
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
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={formData.coverImageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImageUrl: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Status & Featured */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
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
              <div className="space-y-2">
                <Label>Featured</Label>
                <Select
                  value={formData.featured ? "true" : "false"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, featured: value === "true" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* SEO Fields */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">SEO Metadata</h3>
              <div className="space-y-2">
                <Label>SEO Title</Label>
                <Input
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder="Custom title for search engines"
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Description</Label>
                <Textarea
                  value={formData.seoDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, seoDescription: e.target.value })
                  }
                  placeholder="Meta description for search engines"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>SEO Keywords</Label>
                <Input
                  value={formData.seoKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, seoKeywords: e.target.value })
                  }
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !formData.title ||
                !formData.slug ||
                !formData.excerpt ||
                !formData.content ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
