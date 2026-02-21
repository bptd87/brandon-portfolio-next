import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlockBuilder } from "./BlockBuilder";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowDown, ArrowUp, Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface NewsFormProps {
  news?: any;
  onClose: () => void;
  onSuccess: () => void;
}

import { processImageForUpload } from "@/utils/imageUtils";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";

// ... existing imports

export function NewsForm({ news, onClose, onSuccess }: NewsFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const defaultRelatedLinks: Array<{
    label: string;
    url: string;
    linkType: "source" | "review" | "tickets" | "press" | "related";
  }> = [];

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    subtitle: "",
    excerpt: "",
    location: "",
    externalLink: "",
    layoutVariant: "feature" as "feature" | "journal" | "bulletin",
    relatedLinks: defaultRelatedLinks,
    date: new Date().toISOString().split('T')[0],
    categoryId: undefined as number | undefined,
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    blocks: [] as any[],
    // SEO
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [coverImage, setCoverImage] = useState<{ file?: File; url?: string; key?: string }>();
  const [uploadingImage, setUploadingImage] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery({ type: "news" });
  // const uploadImage = trpc.news.uploadImage.useMutation(); // Replaced by client-side upload

  // Fetch full news data by ID when editing (ensures all fields are loaded)
  const { data: fullNews, isLoading: isLoadingNews } = trpc.news.getById.useQuery(
    { id: news?.id },
    { enabled: !!news?.id }
  );

  // Use full data when available, fall back to prop
  const newsData = fullNews || news;

  const createNews = trpc.news.create.useMutation({
    onSuccess: () => {
      toast.success("News item created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create news: ${error.message}`);
    },
  });

  const updateNews = trpc.news.update.useMutation({
    onSuccess: () => {
      toast.success("News item updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to update news: ${error.message}`);
    },
  });

  // Load existing news data
  useEffect(() => {
    if (newsData) {
      setFormData({
        title: newsData.title || "",
        slug: newsData.slug || "",
        subtitle: newsData.subtitle || "",
        excerpt: newsData.excerpt || "",
        location: newsData.location || "",
        externalLink: newsData.externalLink || "",
        layoutVariant: newsData.layoutVariant || "feature",
        relatedLinks: Array.isArray(newsData.relatedLinks)
          ? newsData.relatedLinks.map((link: any) => ({
              label: link.label || "",
              url: link.url || "",
              linkType: link.linkType || "related",
            }))
          : defaultRelatedLinks,
        date: newsData.date ? new Date(newsData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        categoryId: newsData.categoryId ?? undefined,
        status: newsData.status || "draft",
        featured: newsData.featured || false,
        blocks: newsData.blocks || [],
        seoTitle: newsData.seoTitle || "",
        seoDescription: newsData.seoDescription || "",
        seoKeywords: newsData.seoKeywords || "",
      });

      if (newsData.coverImageUrl) {
        setCoverImage({
          url: newsData.coverImageUrl,
          key: newsData.coverImageKey,
        });
      }
    }
  }, [newsData]);

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const optimizedFile = await processImageForUpload(file);
      const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', 'news');

      setCoverImage({
        file, // Keep original file ref if needed, but url is what matters for DB
        url: publicUrl,
        key: undefined, // Key is no longer needed/returned by storageUtils in this simplified flow, publicUrl is stored
      });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedRelatedLinks = formData.relatedLinks
      .map((link) => ({
        label: link.label.trim(),
        url: link.url.trim(),
        linkType: link.linkType,
      }))
      .filter((link) => link.label || link.url);

    const hasInvalidRelatedLink = normalizedRelatedLinks.some((link) => !link.label || !link.url);
    if (hasInvalidRelatedLink) {
      toast.error("Each related link needs both a label and a URL.");
      return;
    }

    const newsData = {
      ...formData,
      date: new Date(formData.date),
      externalLink: formData.externalLink || undefined,
      relatedLinks: normalizedRelatedLinks.map((link, index) => ({ ...link, sortOrder: index })),
      coverImageUrl: coverImage?.url,
      coverImageKey: coverImage?.key,
    };

    if (news?.id) {
      updateNews.mutate({ id: news.id, ...newsData });
    } else {
      createNews.mutate(newsData);
    }
  };

  // Block manipulation functions
  const handleBlocksChange = (blocks: any[]) => {
    setFormData(prev => ({ ...prev, blocks }));
  };

  const addRelatedLink = () => {
    setFormData((prev) => ({
      ...prev,
      relatedLinks: [...prev.relatedLinks, { label: "", url: "", linkType: "related" }],
    }));
  };

  const updateRelatedLink = (
    index: number,
    field: "label" | "url" | "linkType",
    value: string
  ) => {
    setFormData((prev) => {
      const next = [...prev.relatedLinks];
      const item = next[index];
      if (!item) return prev;
      next[index] = { ...item, [field]: value };
      return { ...prev, relatedLinks: next };
    });
  };

  const removeRelatedLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      relatedLinks: prev.relatedLinks.filter((_, idx) => idx !== index),
    }));
  };

  const moveRelatedLink = (index: number, direction: "up" | "down") => {
    setFormData((prev) => {
      const next = [...prev.relatedLinks];
      const swapWith = direction === "up" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return { ...prev, relatedLinks: next };
    });
  };

  const isSubmitting = createNews.isPending || updateNews.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>{news ? "Edit News Item" : "Create News Item"}</DialogTitle>
          <DialogDescription>
            {news ? "Update news item details" : "Add a new news item to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <div className="border-b bg-muted/30">
          <div className="flex px-6 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "basic"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "content"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Content Blocks
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "seo"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              SEO
            </button>
          </div>
        </div>

        <form id="newsForm" onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {activeTab === "basic" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      required
                    />
                    <Button type="button" variant="outline" onClick={generateSlug}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Optional subheading shown on detail page"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div>
                  <Label htmlFor="date">Published Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId?.toString() || ""}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value ? parseInt(value) : undefined }))}
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

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
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

                <div className="col-span-2">
                  <Label htmlFor="externalLink">Primary External Link</Label>
                  <Input
                    id="externalLink"
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="layoutVariant">Layout Variant</Label>
                  <Select
                    value={formData.layoutVariant}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, layoutVariant: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="bulletin">Bulletin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Related Links</Label>
                      <p className="text-xs text-muted-foreground">
                        Add source or press links shown on the news detail page.
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addRelatedLink}>
                      <Plus className="mr-1 h-4 w-4" />
                      Add Link
                    </Button>
                  </div>

                  {formData.relatedLinks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No related links added.</p>
                  ) : (
                    <div className="space-y-2">
                      {formData.relatedLinks.map((link, index) => (
                        <div
                          key={`related-link-${index}`}
                          className="grid grid-cols-12 gap-2 rounded-md border p-2"
                        >
                          <div className="col-span-3">
                            <Input
                              value={link.label}
                              onChange={(e) => updateRelatedLink(index, "label", e.target.value)}
                              placeholder="Label"
                            />
                          </div>
                          <div className="col-span-5">
                            <Input
                              value={link.url}
                              onChange={(e) => updateRelatedLink(index, "url", e.target.value)}
                              placeholder="https://example.com"
                              type="url"
                            />
                          </div>
                          <div className="col-span-2">
                            <Select
                              value={link.linkType}
                              onValueChange={(value: "source" | "review" | "tickets" | "press" | "related") =>
                                updateRelatedLink(index, "linkType", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="source">Source</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="tickets">Tickets</SelectItem>
                                <SelectItem value="press">Press</SelectItem>
                                <SelectItem value="related">Related</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2 flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveRelatedLink(index, "up")}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => moveRelatedLink(index, "down")}
                              disabled={index === formData.relatedLinks.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeRelatedLink(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="col-span-2 flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>

                <div className="col-span-2">
                  <Label>Cover Image</Label>
                  <div className="mt-2">
                    {coverImage?.url ? (
                      <div className="relative inline-block">
                        <img
                          src={coverImage.url}
                          alt="Cover"
                          className="max-w-xs rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2"
                          onClick={() => setCoverImage(undefined)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          disabled={uploadingImage}
                        />
                        {uploadingImage && <Loader2 className="h-4 w-4 animate-spin mt-2" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "content" && (
              <BlockBuilder 
                blocks={formData.blocks} 
                onBlocksChange={handleBlocksChange}
                type="news"
                uploadPath="news"
              />
            )}

            {activeTab === "seo" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  <strong>SEO fields</strong> control how this news item appears in search engine results (Google, Bing). They are <em>not visible</em> to visitors on the site. For visitor-facing labels, use Tags in the main admin panel.
                </div>
                <div>
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Leave empty to use title"
                  />
                </div>

                <div>
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Textarea
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                    rows={3}
                    placeholder="Leave empty to use excerpt"
                  />
                </div>

                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="comma, separated, keywords"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated keywords for search engines (e.g., "scenic design, theatre, portfolio")
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter className="p-6 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="newsForm" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {news ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
