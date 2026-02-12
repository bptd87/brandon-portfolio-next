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
import { Loader2, Upload, X, Plus, Image, Video, List, Quote, HelpCircle, Images } from "lucide-react";
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
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const result = await uploadImage.mutateAsync({
        fileName: file.name,
        fileType: file.type,
        base64Data: btoa(String.fromCharCode(...Array.from(bytes))),
      });

      setCoverImage({
        file,
        url: result.url,
        key: result.key,
      });
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanData = { ...formData };

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

  // Block manipulation functions
  const addBlock = (type: string, defaults: any = {}) => {
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, { type, ...defaults }]
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
            {news ? "Update news item details" : "Add a new news item to your portfolio"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
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
              <div className="flex flex-wrap gap-2 mb-4">
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('text', { content: '' })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('header', { content: '', level: 2 })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Header
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('image', { url: '', caption: '', alt: '' })}>
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('video', { url: '', caption: '' })}>
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('gallery', { images: [] })}>
                  <Images className="h-4 w-4 mr-2" />
                  Gallery
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('list', { items: [''], ordered: false })}>
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('quote', { text: '', author: '', source: '' })}>
                  <Quote className="h-4 w-4 mr-2" />
                  Quote
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => addBlock('faq', { items: [{ question: '', answer: '' }] })}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
              </div>

              <div className="space-y-4">
                {formData.blocks.map((block, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {block.type === 'text' && 'Text Block'}
                        {block.type === 'header' && `Header (H${block.level || 2})`}
                        {block.type === 'image' && 'Image'}
                        {block.type === 'video' && 'Video'}
                        {block.type === 'gallery' && 'Image Gallery'}
                        {block.type === 'list' && (block.ordered ? 'Ordered List' : 'Unordered List')}
                        {block.type === 'quote' && 'Quote'}
                        {block.type === 'faq' && 'FAQ'}
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
                      {/* Text Block */}
                      {block.type === 'text' && (
                        <Textarea
                          value={block.content}
                          onChange={(e) => updateBlock(index, { content: e.target.value })}
                          rows={4}
                          placeholder="Enter text content..."
                        />
                      )}

                      {/* Header Block */}
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

                      {/* Image Block */}
                      {block.type === 'image' && (
                        <div className="space-y-2">
                          <Input
                            value={block.url}
                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                            placeholder="Image URL"
                          />
                          <Input
                            value={block.caption || ''}
                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                            placeholder="Caption (optional)"
                          />
                          <Input
                            value={block.alt || ''}
                            onChange={(e) => updateBlock(index, { alt: e.target.value })}
                            placeholder="Alt text (optional)"
                          />
                        </div>
                      )}

                      {/* Video Block */}
                      {block.type === 'video' && (
                        <div className="space-y-2">
                          <Input
                            value={block.url}
                            onChange={(e) => updateBlock(index, { url: e.target.value })}
                            placeholder="Video URL (YouTube, Vimeo, etc.)"
                          />
                          <Input
                            value={block.caption || ''}
                            onChange={(e) => updateBlock(index, { caption: e.target.value })}
                            placeholder="Caption (optional)"
                          />
                        </div>
                      )}

                      {/* Gallery Block */}
                      {block.type === 'gallery' && (
                        <div className="space-y-2">
                          {block.images?.map((img: any, imgIndex: number) => (
                            <div key={imgIndex} className="flex gap-2 items-start border-b pb-2">
                              <div className="flex-1 space-y-2">
                                <Input
                                  value={img.url}
                                  onChange={(e) => {
                                    const newImages = [...block.images];
                                    newImages[imgIndex] = { ...img, url: e.target.value };
                                    updateBlock(index, { images: newImages });
                                  }}
                                  placeholder="Image URL"
                                />
                                <Input
                                  value={img.caption || ''}
                                  onChange={(e) => {
                                    const newImages = [...block.images];
                                    newImages[imgIndex] = { ...img, caption: e.target.value };
                                    updateBlock(index, { images: newImages });
                                  }}
                                  placeholder="Caption (optional)"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newImages = block.images.filter((_: any, i: number) => i !== imgIndex);
                                  updateBlock(index, { images: newImages });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newImages = [...(block.images || []), { url: '', caption: '', alt: '' }];
                              updateBlock(index, { images: newImages });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Image
                          </Button>
                        </div>
                      )}

                      {/* List Block */}
                      {block.type === 'list' && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <Switch
                              checked={block.ordered || false}
                              onCheckedChange={(checked) => updateBlock(index, { ordered: checked })}
                            />
                            <Label>Ordered (numbered) list</Label>
                          </div>
                          {block.items?.map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex gap-2">
                              <Input
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...block.items];
                                  newItems[itemIndex] = e.target.value;
                                  updateBlock(index, { items: newItems });
                                }}
                                placeholder="List item"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newItems = block.items.filter((_: string, i: number) => i !== itemIndex);
                                  updateBlock(index, { items: newItems });
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = [...(block.items || []), ''];
                              updateBlock(index, { items: newItems });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      )}

                      {/* Quote Block */}
                      {block.type === 'quote' && (
                        <div className="space-y-2">
                          <Textarea
                            value={block.text}
                            onChange={(e) => updateBlock(index, { text: e.target.value })}
                            rows={3}
                            placeholder="Quote text"
                          />
                          <Input
                            value={block.author || ''}
                            onChange={(e) => updateBlock(index, { author: e.target.value })}
                            placeholder="Author (optional)"
                          />
                          <Input
                            value={block.source || ''}
                            onChange={(e) => updateBlock(index, { source: e.target.value })}
                            placeholder="Source (optional)"
                          />
                        </div>
                      )}

                      {/* FAQ Block */}
                      {block.type === 'faq' && (
                        <div className="space-y-2">
                          {block.items?.map((faqItem: any, faqIndex: number) => (
                            <div key={faqIndex} className="border-b pb-2 space-y-2">
                              <div className="flex gap-2 items-start">
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={faqItem.question}
                                    onChange={(e) => {
                                      const newItems = [...block.items];
                                      newItems[faqIndex] = { ...faqItem, question: e.target.value };
                                      updateBlock(index, { items: newItems });
                                    }}
                                    placeholder="Question"
                                  />
                                  <Textarea
                                    value={faqItem.answer}
                                    onChange={(e) => {
                                      const newItems = [...block.items];
                                      newItems[faqIndex] = { ...faqItem, answer: e.target.value };
                                      updateBlock(index, { items: newItems });
                                    }}
                                    rows={2}
                                    placeholder="Answer"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newItems = block.items.filter((_: any, i: number) => i !== faqIndex);
                                    updateBlock(index, { items: newItems });
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = [...(block.items || []), { question: '', answer: '' }];
                              updateBlock(index, { items: newItems });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add FAQ Item
                          </Button>
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
                  placeholder="comma, separated, keywords"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated keywords for search engines (e.g., "scenic design, theatre, portfolio")
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {news ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
