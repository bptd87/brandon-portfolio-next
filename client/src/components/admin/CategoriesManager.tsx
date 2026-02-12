import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CategoriesManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    type: "article" as "project" | "news" | "article",
    color: "#FF5722",
    description: "",
  });

  const utils = trpc.useUtils();
  const { data: allCategories, isLoading } = trpc.categories.list.useQuery();

  const categories = allCategories?.filter(
    (c) => typeFilter === "all" || c.type === typeFilter
  );

  const createMutation = trpc.categories.create.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
      toast.success("Category created successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  const updateMutation = trpc.categories.update.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
      toast.success("Category updated successfully");
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const deleteMutation = trpc.categories.delete.useMutation({
    onSuccess: () => {
      utils.categories.list.invalidate();
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      slug: "",
      type: "article",
      color: "#FF5722",
      description: "",
    });
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      type: category.type,
      color: category.color || "#FF5722",
      description: category.description || "",
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
    if (confirm("Are you sure you want to delete this category?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    });
  };

  const typeCounts = {
    all: allCategories?.length || 0,
    article: allCategories?.filter((c) => c.type === "article").length || 0,
    news: allCategories?.filter((c) => c.type === "news").length || 0,
    project: allCategories?.filter((c) => c.type === "project").length || 0,
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Categories ({allCategories?.length || 0})</h2>
          <p className="text-muted-foreground">Manage categories for articles and news</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
                <DialogDescription>
                  Create a new category with a custom color for visual organization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., Scenic Design"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="scenic-design"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="news">News</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-20 h-10 cursor-pointer"
                    />
                    <Input
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#FF5722"
                      className="flex-1"
                    />
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-border"
                      style={{ backgroundColor: formData.color }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Optional description..."
                    rows={3}
                  />
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
      </div>

      {/* Type filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "all", label: "All" },
          { value: "article", label: "Article" },
          { value: "news", label: "News" },
        ].map((t) => (
          <Button
            key={t.value}
            variant={typeFilter === t.value ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter(t.value)}
          >
            {t.label}
            <span className="ml-1 text-xs opacity-70">
              ({typeCounts[t.value as keyof typeof typeCounts]})
            </span>
          </Button>
        ))}
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-white shrink-0"
                style={{ backgroundColor: category.color || undefined }}
              >
                {category.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {category.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  /{category.slug}
                </p>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(category)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(category.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {categories?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No categories found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
