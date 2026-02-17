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
  Plus,
  X,
  GripVertical,
  Type,
  Image as ImageIcon,
  Video,
  List,
  ChevronDown,
  Maximize2,
  Minimize2,
  Loader2,
  Code,
  MessageSquareQuote,
  HelpCircle,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

// All block types the editor supports (including DB-stored types)
type BlockType = "text" | "paragraph" | "heading" | "image" | "gallery" | "video" | "accordion" | "quote" | "list" | "faq" | "html" | "update_note" | "ai_prompt" | "creative_team";

interface Block {
  id: string;
  type: BlockType;
  content: any;
}

interface BlockArticleEditorProps {
  articleId?: number;
  onSave?: () => void;
  onCancel?: () => void;
}

/**
 * Normalize a block from DB format to editor format.
 * DB blocks store data at top level (e.g., { type: "paragraph", text: "..." })
 * Editor blocks store data nested in content (e.g., { type: "text", content: { text: "..." } })
 */
function normalizeDbBlock(dbBlock: any, index: number): Block {
  const id = dbBlock.id || String(index + 1);
  const type = dbBlock.type || "text";

  switch (type) {
    case "paragraph":
      return {
        id,
        type: "paragraph",
        content: { text: dbBlock.text || dbBlock.content || "" },
      };
    case "text":
      return {
        id,
        type: "text",
        content: { text: dbBlock.content || dbBlock.text || "" },
      };
    case "heading":
      return {
        id,
        type: "heading",
        content: { level: dbBlock.level || 2, text: dbBlock.text || "" },
      };
    case "image":
      return {
        id,
        type: "image",
        content: { url: dbBlock.url || "", caption: dbBlock.caption || "", alt: dbBlock.alt || "" },
      };
    case "video":
      return {
        id,
        type: "video",
        content: { url: dbBlock.url || "", caption: dbBlock.caption || "" },
      };
    case "quote":
      return {
        id,
        type: "quote",
        content: { text: dbBlock.text || "", author: dbBlock.author || "" },
      };
    case "list":
      return {
        id,
        type: "list",
        content: { type: dbBlock.listType || "bullet", items: dbBlock.items || [""] },
      };
    case "faq":
      return {
        id,
        type: "faq",
        content: {
          items: (dbBlock.items || []).map((item: any) => ({
            question: item.question || "",
            answer: item.answer || "",
          }))
        },
      };
    case "gallery":
      return {
        id,
        type: "gallery",
        content: { images: dbBlock.images || dbBlock.content?.images || [] },
      };
    case "accordion":
      return {
        id,
        type: "accordion",
        content: { items: dbBlock.items || dbBlock.content?.items || [{ title: "", content: "" }] },
      };
    case "html":
      return {
        id,
        type: "html",
        content: { code: dbBlock.content || "" },
      };
    case "update_note":
      return {
        id,
        type: "update_note",
        content: { text: dbBlock.text || "" },
      };
    case "ai_prompt":
      return {
        id,
        type: "ai_prompt",
        content: { prompt: dbBlock.prompt || dbBlock.content || "" },
      };
    case "creative_team":
      return {
        id,
        type: "creative_team",
        content: { members: Array.isArray(dbBlock.members) ? dbBlock.members : (dbBlock.content?.members || []) },
      };
    default:
      // Fallback: treat as text
      return {
        id,
        type: "text",
        content: { text: dbBlock.text || dbBlock.content || JSON.stringify(dbBlock) },
      };
  }
}

/**
 * Convert editor block back to DB format for saving.
 */
function blockToDbFormat(block: Block): any {
  switch (block.type) {
    case "paragraph":
    case "text":
      return { type: "paragraph", text: block.content.text || "" };
    case "heading":
      return { type: "heading", level: block.content.level || 2, text: block.content.text || "" };
    case "image":
      return { type: "image", url: block.content.url || "", caption: block.content.caption || "", alt: block.content.alt || "" };
    case "video":
      return { type: "video", url: block.content.url || "", caption: block.content.caption || "" };
    case "quote":
      return { type: "quote", text: block.content.text || "", author: block.content.author || "" };
    case "list":
      return { type: "list", listType: block.content.type || "bullet", items: block.content.items || [] };
    case "faq":
      return { type: "faq", items: block.content.items || [] };
    case "gallery":
      return { type: "gallery", images: block.content.images || [] };
    case "accordion":
      return { type: "accordion", items: block.content.items || [] };
    case "html":
      return { type: "html", content: block.content.code || "" };
    case "update_note":
      return { type: "update_note", text: block.content.text || "" };
    case "ai_prompt":
      return { type: "ai_prompt", prompt: block.content.prompt || "" };
    case "creative_team":
      return { type: "creative_team", members: block.content.members || [] };
    default:
      return { type: block.type, text: block.content.text || "" };
  }
}

import { processImageForUpload } from "@/utils/imageUtils";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";

// ... existing imports

export function BlockArticleEditor({ articleId, onSave, onCancel }: BlockArticleEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "paragraph", content: { text: "" } },
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
  const [uploadingBlockId, setUploadingBlockId] = useState<string | null>(null);
  // const uploadImage = trpc.articles.uploadImage.useMutation(); // No longer using TRPC for uploads
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

      // Parse content blocks
      if (existingArticle.content) {
        try {
          const parsed = typeof existingArticle.content === 'string'
            ? JSON.parse(existingArticle.content)
            : existingArticle.content;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBlocks(parsed.map((block: any, i: number) => normalizeDbBlock(block, i)));
          }
        } catch (e) {
          // If content is plain text, wrap it in a paragraph block
          if (typeof existingArticle.content === 'string' && existingArticle.content.trim()) {
            setBlocks([{ id: '1', type: 'paragraph', content: { text: existingArticle.content } }]);
          }
        }
      }
    }
  }, [existingArticle]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: getDefaultContent(type),
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultContent = (type: BlockType) => {
    switch (type) {
      case "text":
      case "paragraph":
        return { text: "" };
      case "heading":
        return { level: 2, text: "" };
      case "image":
        return { url: "", caption: "", alt: "" };
      case "gallery":
        return { images: [] };
      case "video":
        return { url: "", caption: "" };
      case "accordion":
        return { items: [{ title: "", content: "" }] };
      case "faq":
        return { items: [{ question: "", answer: "" }] };
      case "quote":
        return { text: "", author: "" };
      case "list":
        return { type: "bullet", items: [""] };
      case "html":
        return { code: "" };
      case "update_note":
        return { text: "" };
      case "ai_prompt":
        return { prompt: "" };
      case "creative_team":
        return { members: [{ name: "", role: "" }] };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, content } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
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
    // Convert blocks to DB format for saving
    const dbBlocks = blocks.map(blockToDbFormat);
    const content = JSON.stringify(dbBlocks);
    try {
      // Extract tags (string[]) from formData - these are not sent to the API
      const { tags: _tags, publishedAt, ...saveData } = formData;

      // Convert publishedAt string to Date if provided
      const publishedAtDate = publishedAt ? new Date(publishedAt) : null;

      if (articleId) {
        await updateMutation.mutateAsync({ id: articleId, ...saveData, publishedAt: publishedAtDate || undefined, content });
        toast.success("Article updated");
      } else {
        await createMutation.mutateAsync({ ...saveData, publishedAt: publishedAtDate || undefined, content });
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
        <div className="max-w-4xl mx-auto p-8 space-y-6">
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
                      // 1. Optimize
                      const optimizedFile = await processImageForUpload(file);

                      // 2. Upload to Supabase Storage
                      const publicUrl = await uploadToStorage(optimizedFile, 'portfolio'); // Assuming 'portfolio' bucket exists

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
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id} className="group relative border rounded-lg p-4">
                <div className="absolute -left-3 top-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveBlock(block.id, "down")}
                    disabled={index === blocks.length - 1}
                  >
                    ↓
                  </Button>
                </div>
                <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100">
                  <span className="text-xs bg-muted px-2 py-1 rounded">{block.type}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Text / Paragraph block */}
                {(block.type === "text" || block.type === "paragraph") && (
                  <Textarea
                    value={block.content.text || ""}
                    onChange={(e) =>
                      updateBlock(block.id, { text: e.target.value })
                    }
                    placeholder="Write your content..."
                    rows={4}
                    className="border-none p-0 focus-visible:ring-0"
                  />
                )}

                {/* Heading block */}
                {block.type === "heading" && (
                  <div className="space-y-2">
                    <Select
                      value={String(block.content.level || 2)}
                      onValueChange={(v) =>
                        updateBlock(block.id, { ...block.content, level: parseInt(v) })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">H2</SelectItem>
                        <SelectItem value="3">H3</SelectItem>
                        <SelectItem value="4">H4</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={block.content.text || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, text: e.target.value })
                      }
                      placeholder="Heading text..."
                      className={`font-bold ${block.content.level === 2
                        ? "text-3xl"
                        : block.content.level === 3
                          ? "text-2xl"
                          : "text-xl"
                        }`}
                    />
                  </div>
                )}

                {/* Image block */}
                {block.type === "image" && (
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <Input
                        value={block.content.url || ""}
                        onChange={(e) =>
                          updateBlock(block.id, { ...block.content, url: e.target.value })
                        }
                        placeholder="Image URL"
                      />
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploadingBlockId(block.id);
                            try {
                              // 1. Optimize
                              const optimizedFile = await processImageForUpload(file);

                              // 2. Upload
                              const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', 'articles');

                              updateBlock(block.id, { ...block.content, url: publicUrl });
                              toast.success("Image uploaded!");
                            } catch (error: any) {
                              console.error(error);
                              toast.error(`Upload failed: ${error.message}`);
                            } finally {
                              setUploadingBlockId(null);
                            }
                          }}
                          disabled={uploadingBlockId === block.id}
                        />
                        <Button variant="outline" size="icon" disabled={uploadingBlockId === block.id}>
                          {uploadingBlockId === block.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {block.content.url && (
                      <img
                        src={block.content.url}
                        alt={block.content.alt || ""}
                        className="w-full rounded"
                      />
                    )}
                    <Input
                      value={block.content.caption || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, caption: e.target.value })
                      }
                      placeholder="Caption"
                    />
                    <Input
                      value={block.content.alt || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, alt: e.target.value })
                      }
                      placeholder="Alt text (for accessibility)"
                    />
                  </div>
                )}

                {/* Video block */}
                {block.type === "video" && (
                  <div className="space-y-2">
                    <Input
                      value={block.content.url || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, url: e.target.value })
                      }
                      placeholder="Video URL (YouTube, Vimeo, or direct link)"
                    />
                    <Input
                      value={block.content.caption || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, caption: e.target.value })
                      }
                      placeholder="Caption"
                    />
                  </div>
                )}

                {/* Gallery block */}
                {block.type === "gallery" && (
                  <div className="space-y-2">
                    {(block.content.images || []).map((img: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded space-y-2">
                        <div className="flex gap-2 items-center">
                          <Input
                            value={img.url || ""}
                            onChange={(e) => {
                              const newImages = [...(block.content.images || [])];
                              newImages[idx] = { ...newImages[idx], url: e.target.value };
                              updateBlock(block.id, { images: newImages });
                            }}
                            placeholder="Image URL"
                          />
                          <div className="relative">
                            <Input
                              type="file"
                              accept="image/*"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const uploadId = `${block.id}-gallery-${idx}`;
                                setUploadingBlockId(uploadId);
                                try {
                                  const optimizedFile = await processImageForUpload(file);
                                  const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', 'gallery');

                                  const newImages = [...(block.content.images || [])];
                                  newImages[idx] = { ...newImages[idx], url: publicUrl };
                                  updateBlock(block.id, { images: newImages });

                                  toast.success("Image uploaded!");
                                } catch (error: any) {
                                  console.error(error);
                                  toast.error(`Upload failed: ${error.message}`);
                                } finally {
                                  setUploadingBlockId(null);
                                }
                              }}
                              disabled={uploadingBlockId === `${block.id}-gallery-${idx}`}
                            />
                            <Button variant="outline" size="icon" disabled={uploadingBlockId === `${block.id}-gallery-${idx}`}>
                              {uploadingBlockId === `${block.id}-gallery-${idx}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <Input
                          value={img.caption || ""}
                          onChange={(e) => {
                            const newImages = [...(block.content.images || [])];
                            newImages[idx] = { ...newImages[idx], caption: e.target.value };
                            updateBlock(block.id, { images: newImages });
                          }}
                          placeholder="Caption"
                        />
                        <Input
                          value={img.alt || ""}
                          onChange={(e) => {
                            const newImages = [...(block.content.images || [])];
                            newImages[idx] = { ...newImages[idx], alt: e.target.value };
                            updateBlock(block.id, { images: newImages });
                          }}
                          placeholder="Alt text"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newImages = (block.content.images || []).filter((_: any, i: number) => i !== idx);
                            updateBlock(block.id, { images: newImages });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBlock(block.id, {
                          images: [...(block.content.images || []), { url: "", caption: "", alt: "" }],
                        })
                      }
                    >
                      Add Image
                    </Button>
                  </div>
                )}

                {/* Quote block */}
                {block.type === "quote" && (
                  <div className="space-y-2">
                    <Textarea
                      value={block.content.text || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, text: e.target.value })
                      }
                      placeholder="Quote text..."
                      rows={3}
                      className="text-xl italic"
                    />
                    <Input
                      value={block.content.author || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, author: e.target.value })
                      }
                      placeholder="Author (optional)"
                    />
                  </div>
                )}

                {/* List block */}
                {block.type === "list" && (
                  <div className="space-y-2">
                    <Select
                      value={block.content.type || "bullet"}
                      onValueChange={(v) =>
                        updateBlock(block.id, { ...block.content, type: v })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bullet">Bullet List</SelectItem>
                        <SelectItem value="numbered">Numbered List</SelectItem>
                      </SelectContent>
                    </Select>
                    {(block.content.items || []).map((item: string, idx: number) => (
                      <div key={idx} className="flex gap-2">
                        <Input
                          value={item}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[idx] = e.target.value;
                            updateBlock(block.id, { ...block.content, items: newItems });
                          }}
                          placeholder="List item..."
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = (block.content.items || []).filter((_: string, i: number) => i !== idx);
                            updateBlock(block.id, { ...block.content, items: newItems });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBlock(block.id, {
                          ...block.content,
                          items: [...(block.content.items || []), ""],
                        })
                      }
                    >
                      Add Item
                    </Button>
                  </div>
                )}

                {/* FAQ block */}
                {block.type === "faq" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">FAQ Items</p>
                    {(block.content.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded space-y-2">
                        <Input
                          value={item.question || ""}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[idx] = { ...newItems[idx], question: e.target.value };
                            updateBlock(block.id, { items: newItems });
                          }}
                          placeholder="Question"
                        />
                        <Textarea
                          value={item.answer || ""}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[idx] = { ...newItems[idx], answer: e.target.value };
                            updateBlock(block.id, { items: newItems });
                          }}
                          placeholder="Answer"
                          rows={3}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newItems = (block.content.items || []).filter((_: any, i: number) => i !== idx);
                            updateBlock(block.id, { items: newItems });
                          }}
                        >
                          <X className="w-3 h-3 mr-1" /> Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBlock(block.id, {
                          items: [...(block.content.items || []), { question: "", answer: "" }],
                        })
                      }
                    >
                      Add FAQ Item
                    </Button>
                  </div>
                )}

                {/* Accordion block */}
                {block.type === "accordion" && (
                  <div className="space-y-2">
                    {(block.content.items || []).map((item: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded space-y-2">
                        <Input
                          value={item.title || ""}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                            updateBlock(block.id, { items: newItems });
                          }}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={item.content || ""}
                          onChange={(e) => {
                            const newItems = [...(block.content.items || [])];
                            newItems[idx] = { ...newItems[idx], content: e.target.value };
                            updateBlock(block.id, { items: newItems });
                          }}
                          placeholder="Section content"
                          rows={3}
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateBlock(block.id, {
                          items: [...(block.content.items || []), { title: "", content: "" }],
                        })
                      }
                    >
                      Add Section
                    </Button>
                  </div>
                )}

                {/* HTML block */}
                {block.type === "html" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">Custom HTML</p>
                    <Textarea
                      value={block.content.code || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { code: e.target.value })
                      }
                      placeholder="<div>Custom HTML content...</div>"
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {/* Update Note block */}
                {block.type === "update_note" && (
                  <div className="space-y-2 bg-muted/50 p-3 rounded">
                    <p className="text-sm text-muted-foreground font-medium">Update Note</p>
                    <Textarea
                      value={block.content.text || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { text: e.target.value })
                      }
                      placeholder="Update note text..."
                      rows={2}
                    />
                  </div>
                )}

                {/* AI Prompt block */}
                {block.type === "ai_prompt" && (
                  <div className="space-y-2 bg-purple-500/10 p-3 rounded border border-purple-500/30">
                    <p className="text-sm font-medium text-purple-400 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> AI Prompt
                    </p>
                    <Textarea
                      value={block.content.prompt || ""}
                      onChange={(e) =>
                        updateBlock(block.id, { prompt: e.target.value })
                      }
                      placeholder="Enter the prompt text..."
                      rows={3}
                      className="font-mono text-sm"
                    />
                  </div>
                )}

                {/* Creative Team block */}
                {block.type === "creative_team" && (
                  <div className="space-y-2 bg-blue-500/10 p-3 rounded border border-blue-500/30">
                    <p className="text-sm font-medium text-blue-400 flex items-center gap-2">
                      👥 Creative Team
                    </p>
                    <div className="space-y-2">
                      {(block.content.members || []).map((member: any, idx: number) => (
                        <div key={idx} className="flex gap-2 bg-background p-2 rounded">
                          <Input
                            placeholder="Name"
                            value={member.name || ""}
                            onChange={(e) => {
                              const updated = [...(block.content.members || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              updateBlock(block.id, { members: updated });
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <Input
                            placeholder="Role"
                            value={member.role || ""}
                            onChange={(e) => {
                              const updated = [...(block.content.members || [])];
                              updated[idx] = { ...updated[idx], role: e.target.value };
                              updateBlock(block.id, { members: updated });
                            }}
                            className="flex-1 h-8 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              const updated = block.content.members.filter((_: any, i: number) => i !== idx);
                              updateBlock(block.id, { members: updated });
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = [...(block.content.members || []), { name: "", role: "" }];
                          updateBlock(block.id, { members: updated });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" /> Add Team Member
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Block Menu */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => addBlock("paragraph")}>
              <Type className="w-4 h-4 mr-2" />
              Text
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("heading")}>
              <Type className="w-4 h-4 mr-2" />
              Heading
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("image")}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("video")}>
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("quote")}>
              <MessageSquareQuote className="w-4 h-4 mr-2" />
              Quote
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("list")}>
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("faq")}>
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("accordion")}>
              <ChevronDown className="w-4 h-4 mr-2" />
              Accordion
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("gallery")}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Gallery
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("html")}>
              <Code className="w-4 h-4 mr-2" />
              HTML
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("update_note")}>
              <FileText className="w-4 h-4 mr-2" />
              Update Note
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("ai_prompt")}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Prompt
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock("creative_team")}>
              👥 Creative Team
            </Button>
          </div>

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
