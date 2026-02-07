import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

type BlockType = "text" | "heading" | "image" | "gallery" | "video" | "accordion";

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

export function BlockArticleEditor({ articleId, onSave, onCancel }: BlockArticleEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: { text: "" } },
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
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });
  const [newTag, setNewTag] = useState("");

  const { data: categories } = trpc.categories.list.useQuery({ type: "article" });
  const createMutation = trpc.articles.create.useMutation();
  const updateMutation = trpc.articles.update.useMutation();

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
    const content = JSON.stringify(blocks);
    try {
      if (articleId) {
        await updateMutation.mutateAsync({ id: articleId, ...formData, content });
        toast.success("Article updated");
      } else {
        await createMutation.mutateAsync({ ...formData, content });
        toast.success("Article created");
      }
      onSave?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    }
  };

  return (
    <div
      className={`${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
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
            <Input
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
              placeholder="https://..."
              className="text-lg"
            />
            {formData.coverImageUrl && (
              <img
                src={formData.coverImageUrl}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg"
              />
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100"
                  onClick={() => removeBlock(block.id)}
                >
                  <X className="w-4 h-4" />
                </Button>

                {block.type === "text" && (
                  <Textarea
                    value={block.content.text}
                    onChange={(e) =>
                      updateBlock(block.id, { text: e.target.value })
                    }
                    placeholder="Write your content..."
                    rows={4}
                    className="border-none p-0 focus-visible:ring-0"
                  />
                )}

                {block.type === "heading" && (
                  <div className="space-y-2">
                    <Select
                      value={block.content.level.toString()}
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
                      value={block.content.text}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, text: e.target.value })
                      }
                      placeholder="Heading text..."
                      className={`font-bold ${
                        block.content.level === 2
                          ? "text-3xl"
                          : block.content.level === 3
                          ? "text-2xl"
                          : "text-xl"
                      }`}
                    />
                  </div>
                )}

                {block.type === "image" && (
                  <div className="space-y-2">
                    <Input
                      value={block.content.url}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, url: e.target.value })
                      }
                      placeholder="Image URL"
                    />
                    {block.content.url && (
                      <img
                        src={block.content.url}
                        alt={block.content.alt}
                        className="w-full rounded"
                      />
                    )}
                    <Input
                      value={block.content.caption}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, caption: e.target.value })
                      }
                      placeholder="Caption"
                    />
                    <Input
                      value={block.content.alt}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, alt: e.target.value })
                      }
                      placeholder="Alt text (for accessibility)"
                    />
                  </div>
                )}

                {block.type === "video" && (
                  <div className="space-y-2">
                    <Input
                      value={block.content.url}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, url: e.target.value })
                      }
                      placeholder="Video URL (YouTube, Vimeo, or direct link)"
                    />
                    <Input
                      value={block.content.caption}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, caption: e.target.value })
                      }
                      placeholder="Caption"
                    />
                  </div>
                )}

                {block.type === "accordion" && (
                  <div className="space-y-2">
                    {block.content.items.map((item: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded space-y-2">
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...block.content.items];
                            newItems[idx].title = e.target.value;
                            updateBlock(block.id, { items: newItems });
                          }}
                          placeholder="Section title"
                        />
                        <Textarea
                          value={item.content}
                          onChange={(e) => {
                            const newItems = [...block.content.items];
                            newItems[idx].content = e.target.value;
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
                          items: [...block.content.items, { title: "", content: "" }],
                        })
                      }
                    >
                      Add Section
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Block Menu */}
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => addBlock("text")}>
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
            <Button variant="outline" size="sm" onClick={() => addBlock("accordion")}>
              <ChevronDown className="w-4 h-4 mr-2" />
              Accordion
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
                  value={formData.categoryId?.toString()}
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

            {/* SEO */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-semibold">SEO</h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
