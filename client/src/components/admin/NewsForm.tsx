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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, X, Image } from "lucide-react";
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
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    publishedAt: "" as string,
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
        excerpt: newsData.excerpt || "",
        location: newsData.location || "",
        date: newsData.date ? new Date(newsData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        publishedAt: newsData.publishedAt ? new Date(newsData.publishedAt).toISOString().split('T')[0] : "",
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

    const { publishedAt, ...cleanData } = formData;

    const newsData = {
      ...cleanData,
      date: new Date(cleanData.date),
      publishedAt: publishedAt ? new Date(publishedAt) : null,
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

  const isSubmitting = createNews.isPending || updateNews.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="!w-[98vw] !h-[98vh] !max-w-none !fixed !left-[1vw] !top-[1vh] !p-0 border-none rounded-lg flex flex-col">
        <div className="p-6 border-b">
          <DialogHeader>
            <DialogTitle>{news ? "Edit News Item" : "Create News Item"}</DialogTitle>
            <DialogDescription>
              {news ? "Update news item details" : "Add a new news item to your portfolio"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <form id="newsForm" onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto px-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content Blocks</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
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
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="publishedAt">Published Date (optional)</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                    placeholder="Leave empty to use creation date"
                  />
                  <p className="text-xs text-muted-foreground mt-1">For migrated content</p>
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
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-4">
                <BlockBuilder 
                  blocks={formData.blocks} 
                  onBlocksChange={handleBlocksChange}
                  type="news"
                  uploadPath="news"
                />
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="rounded-lg border border-dashed p-3 mb-2 text-sm text-muted-foreground">
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
            </TabsContent>
          </Tabs>
        </form>

        <div className="p-6 border-t mt-auto">
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" form="newsForm" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {news ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
