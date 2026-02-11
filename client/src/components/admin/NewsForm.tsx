import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface NewsFormProps {
  news?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewsForm({ news, onClose, onSuccess }: NewsFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    location: "",
    date: new Date().toISOString().split('T')[0],
    externalLink: "",
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
  const uploadImage = trpc.news.uploadImage.useMutation();

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
        externalLink: newsData.externalLink || "",
        categoryId: newsData.categoryId ?? undefined,
        status: newsData.status || "draft",
        featured: newsData.featured || false,
        blocks: newsData.blocks || [],
        seoTitle: newsData.seoTitle || "",
        seoDescription: newsData.seoDescription || "",
        seoKeywords: newsData.seoKeywords || "",
      });
      if (newsData.coverImageUrl) {
        setCoverImage({ url: newsData.coverImageUrl, key: newsData.coverImageKey });
      }
    }
  }, [newsData]);

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }));
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await uploadImage.mutateAsync({
          fileName: file.name,
          fileType: file.type,
          base64Data: base64.split(',')[1],
        });
        setCoverImage({ url: result.url, key: result.key });
        toast.success("Image uploaded successfully");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strip fields not in the router schema
    const { externalLink: _ext, ...cleanData } = formData;
    const newsData = {
      ...cleanData,
      date: new Date(cleanData.date),
      coverImageUrl: coverImage?.url,
      coverImageKey: coverImage?.key,
    };

    if (news?.id) {
      updateNews.mutate({ id: news.id, ...newsData });
    } else {
      createNews.mutate(newsData);
    }
  };

  const addTextBlock = () => {
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, { type: 'text', content: '' }]
    }));
  };

  const addHeaderBlock = () => {
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, { type: 'header', content: '', level: 2 }]
    }));
  };

  const updateBlock = (index: number, updates: any) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map((block, i) => i === index ? { ...block, ...updates } : block)
    }));
  };

  const removeBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index)
    }));
  };

  const isSubmitting = createNews.isPending || updateNews.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{news ? "Edit News Item" : "Create News Item"}</DialogTitle>
          <DialogDescription>
            {news ? "Update the news item details" : "Add a new news item to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="content">Content Blocks</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="externalLink">External Link</Label>
                  <Input
                    id="externalLink"
                    type="url"
                    value={formData.externalLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, externalLink: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: parseInt(value) }))}
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>

                <div>
                  <Label>Cover Image</Label>
                  <div className="mt-2">
                    {coverImage?.url ? (
                      <div className="relative inline-block">
                        <img src={coverImage.url} alt="Cover" className="h-32 w-auto rounded" />
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
              <div className="flex gap-2 mb-4">
                <Button type="button" variant="outline" size="sm" onClick={addTextBlock}>
                  <Plus className="h-4 w-4 mr-2" />
                  Text Block
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={addHeaderBlock}>
                  <Plus className="h-4 w-4 mr-2" />
                  Header
                </Button>
              </div>

              <div className="space-y-4">
                {formData.blocks.map((block, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {block.type === 'text' && 'Text Block'}
                        {block.type === 'header' && `Header (H${block.level || 2})`}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeBlock(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {block.type === 'text' && (
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          rows={4}
                          placeholder="Enter text content..."
                        />
                      )}
                      {block.type === 'header' && (
                        <div className="space-y-2">
                          <Input
                            value={block.content}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Header text..."
                          />
                          <Select
                            value={block.level?.toString() || "2"}
                            onValueChange={(value) => updateBlock(index, { level: parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">H2</SelectItem>
                              <SelectItem value="3">H3</SelectItem>
                              <SelectItem value="4">H4</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {formData.blocks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No content blocks yet. Add some blocks to build your news content.
                  </div>
                )}
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
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated keywords for the &lt;meta name="keywords"&gt; tag. Different from Tags which are visible to visitors.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {news ? "Update" : "Create"} News Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
