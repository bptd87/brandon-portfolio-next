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
  X,
  Maximize2,
  Minimize2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { BlockBuilder } from "./BlockBuilder";
import { processImageForUpload } from "@/utils/imageUtils";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";

// Block structure (matches BlockBuilder format)
interface Block {
  type: string;
  [key: string]: any;
}

interface BlockArticleEditorProps {
  articleId?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * Convert saved block format to BlockBuilder format for editing.
 * Handles both old (id-based) and new (index-based) formats.
 */
function parseBlocksFromContent(content: any): Block[] {
  if (!content) return [];
  
  try {
    const parsed = typeof content === 'string' ? JSON.parse(content) : content;
    if (!Array.isArray(parsed)) return [];
    
    // Remove IDs if they exist (BlockBuilder uses index-based)
    return parsed.map((block: any) => {
      const { id, ...rest } = block;
      return rest;
    });
  } catch (e) {
    // If content is plain text, wrap it in a paragraph block
    if (typeof content === 'string' && content.trim()) {
      return [{ type: 'paragraph', text: content }];
    }
    return [];
  }
}

export function BlockArticleEditor({ articleId, onSave, onCancel }: BlockArticleEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { type: "paragraph", text: "" },
  ]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    coverImageUrl: "",
    categoryId: undefined as number | undefined,
    tags: [] as string[],
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    publishedAt: "" as string,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const [newTag, setNewTag] = useState("");

  const { data: categories } = trpc.categories.list.useQuery({ type: "article" });
  const createMutation = trpc.articles.create.useMutation();
  const updateMutation = trpc.articles.update.useMutation();

  // Fetch existing article data when editing
  const { data: existingArticle, isLoading: isLoadingArticle } = trpc.articles.getById.useQuery(
    { id: articleId! },
    { enabled: !!articleId }
  );

  // Populate form with existing data
  useEffect(() => {
    if (existingArticle) {
      setFormData({
        title: existingArticle.title || "",
        slug: existingArticle.slug || "",
        excerpt: existingArticle.excerpt || "",
        coverImageUrl: existingArticle.coverImageUrl || "",
        categoryId: existingArticle.categoryId ?? undefined,
        tags: existingArticle.tags?.map((t: any) => typeof t === 'string' ? t : t.name) || [],
        status: existingArticle.status || "draft",
        featured: existingArticle.featured || false,
        publishedAt: existingArticle.publishedAt ? new Date(existingArticle.publishedAt).toISOString().split('T')[0] : "",
        seoTitle: existingArticle.seoTitle || "",
        seoDescription: existingArticle.seoDescription || "",
        seoKeywords: existingArticle.seoKeywords || "",
      });

      // Parse content blocks using BlockBuilder format
      const parsedBlocks = parseBlocksFromContent(existingArticle.content);
      if (parsedBlocks.length > 0) {
        setBlocks(parsedBlocks);
      }
    }
  }, [existingArticle]);

  const handleBlocksChange = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSave = async () => {
    // BlockBuilder blocks are flat format without nested content
    const content = JSON.stringify(blocks);
    try {
      const publishedAtDate = formData.publishedAt ? new Date(formData.publishedAt) : null;

      if (articleId) {
        await updateMutation.mutateAsync({ 
          id: articleId, 
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          coverImageUrl: formData.coverImageUrl,
          categoryId: formData.categoryId,
          status: formData.status,
          featured: formData.featured,
          publishedAt: publishedAtDate || undefined,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          content 
        });
        toast.success("Article updated");
      } else {
        await createMutation.mutateAsync({ 
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          coverImageUrl: formData.coverImageUrl,
          categoryId: formData.categoryId,
          status: formData.status,
          featured: formData.featured,
          publishedAt: publishedAtDate || undefined,
          seoTitle: formData.seoTitle,
          seoDescription: formData.seoDescription,
          seoKeywords: formData.seoKeywords,
          content 
        });
        toast.success("Article created");
      }
      onSave?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    }
  };

  if (articleId && isLoadingArticle) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading article...</span>
      </div>
    );
  }

  return (
    <div
      className={`${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
        } flex flex-col h-full`}
    >
      {/* Header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {articleId ? "Edit Article" : "New Article"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.title || !formData.slug}>
            Save
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-6xl mx-auto p-8 space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Cover Image *</Label>
            {formData.coverImageUrl ? (
              <div className="relative inline-block">
                <img
                  src={formData.coverImageUrl}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2"
                  onClick={() => setFormData({ ...formData, coverImageUrl: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setUploadingCover(true);
                    try {
                      const optimizedFile = await processImageForUpload(file);
                      const publicUrl = await uploadToStorage(optimizedFile, 'portfolio');
                      setFormData({ ...formData, coverImageUrl: publicUrl });
                      toast.success("Cover image optimized & uploaded!");
                    } catch (error: any) {
                      console.error(error);
                      toast.error(`Failed to upload image: ${error.message}`);
                    } finally {
                      setUploadingCover(false);
                    }
                  }}
                  disabled={uploadingCover}
                />
                {uploadingCover && <Loader2 className="h-4 w-4 animate-spin mt-2" />}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Input
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ ...formData, title, slug: generateSlug(title) });
              }}
              placeholder="Article Title"
              className="text-4xl font-bold border-none p-0 focus-visible:ring-0"
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Brief excerpt..."
              className="text-lg"
              rows={3}
            />
          </div>

          {/* Blocks */}
          <BlockBuilder 
            blocks={blocks} 
            onBlocksChange={handleBlocksChange} 
            type="articles" 
            uploadPath="articles_gallery"
          />

          {/* Metadata */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">Article Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, categoryId: parseInt(v) })
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
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="Add tag..."
                />
                <Button onClick={addTag}>Add</Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) => setFormData({ ...formData, status: v })}
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
                  onValueChange={(v) =>
                    setFormData({ ...formData, featured: v === "true" })
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

            <div className="space-y-2">
              <Label>Published Date (optional)</Label>
              <Input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                placeholder="Leave empty to use creation date"
              />
              <p className="text-xs text-muted-foreground">Set a custom publication date for migrated content. Leave empty to use the creation date.</p>
            </div>

            {/* SEO */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">SEO (Search Engines Only)</h4>
              <p className="text-xs text-muted-foreground">
                These fields control how this article appears in search results. They are not visible to visitors. Tags (above) are the visitor-facing labels.
              </p>
              <Input
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                placeholder="SEO Title"
              />
              <Textarea
                value={formData.seoDescription}
                onChange={(e) =>
                  setFormData({ ...formData, seoDescription: e.target.value })
                }
                placeholder="SEO Description"
                rows={2}
              />
              <Input
                value={formData.seoKeywords}
                onChange={(e) =>
                  setFormData({ ...formData, seoKeywords: e.target.value })
                }
                placeholder="SEO Keywords (comma separated)"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated keywords for &lt;meta name="keywords"&gt;. Different from Tags which are visible to visitors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
