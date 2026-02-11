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
import { Loader2, Upload, X, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface ProjectFormProps {
  project?: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface ImageUpload {
  id?: number;
  file?: File;
  url?: string;
  key?: string;
  videoUrl?: string;
  imageType: "production" | "rendering" | "video";
  caption?: string;
  altText?: string;
  sortOrder: number;
}

export function ProjectForm({ project, onClose, onSuccess }: ProjectFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    designNotes: "",
    discipline: "scenic_design" as "scenic_design" | "experiential_design" | "rendering" | "scenic_models",
    subcategory: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    year: new Date().getFullYear(),
    location: "",
    client: "",
    categoryId: undefined as number | undefined,
    // Creative team
    director: "",
    associateDirector: "",
    musicDirector: "",
    coScenicDesigner: "",
    costumeDesigner: "",
    lightingDesigner: "",
    soundDesigner: "",
    // SEO
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  const [coverImage, setCoverImage] = useState<{ file?: File; url?: string; key?: string }>();
  const [galleryImages, setGalleryImages] = useState<ImageUpload[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { data: categories } = trpc.categories.list.useQuery({ type: "project" });
  const uploadImage = trpc.projects.uploadImage.useMutation();

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Project created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("Project updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        excerpt: project.excerpt || "",
        description: project.description || "",
        designNotes: project.designNotes || "",
        discipline: project.discipline || "scenic_design",
        subcategory: project.subcategory || "",
        status: project.status || "draft",
        featured: project.featured || false,
        year: project.year || new Date().getFullYear(),
        location: project.location || "",
        client: project.client || "",
        categoryId: project.categoryId,
        director: project.creativeTeam?.director || "",
        associateDirector: project.creativeTeam?.associateDirector || "",
        musicDirector: project.creativeTeam?.musicDirector || "",
        coScenicDesigner: project.creativeTeam?.coScenicDesigner || "",
        costumeDesigner: project.creativeTeam?.costumeDesigner || "",
        lightingDesigner: project.creativeTeam?.lightingDesigner || "",
        soundDesigner: project.creativeTeam?.soundDesigner || "",
        seoTitle: project.seoTitle || "",
        seoDescription: project.seoDescription || "",
        seoKeywords: project.seoKeywords || "",
      });
      
      if (project.coverImageUrl) {
        setCoverImage({ url: project.coverImageUrl, key: project.coverImageKey });
      }
      
      // Load existing gallery images
      if (project.images && Array.isArray(project.images)) {
        const existingImages: ImageUpload[] = project.images.map((img: any, index: number) => ({
          id: img.id,
          url: img.imageUrl,
          key: img.imageKey,
          videoUrl: img.videoUrl,
          imageType: img.imageType || 'production',
          caption: img.caption,
          altText: img.altText,
          sortOrder: img.sortOrder !== undefined ? img.sortOrder : index,
        }));
        setGalleryImages(existingImages);
      }
    }
  }, [project]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleAddGalleryImage = (type: "production" | "rendering" | "video") => {
    if (type === "video") {
      const videoUrl = prompt("Enter YouTube video URL:");
      if (videoUrl) {
        setGalleryImages([
          ...galleryImages,
          {
            videoUrl,
            imageType: "video",
            sortOrder: galleryImages.length,
          },
        ]);
      }
    } else {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;
      input.onchange = (e) => {
        const files = Array.from((e.target as HTMLInputElement).files || []);
        const newImages: ImageUpload[] = files.map((file, index) => ({
          file,
          url: URL.createObjectURL(file),
          imageType: type,
          sortOrder: galleryImages.length + index,
        }));
        setGalleryImages([...galleryImages, ...newImages]);
      };
      input.click();
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleUpdateImageCaption = (index: number, caption: string) => {
    const updated = [...galleryImages];
    updated[index] = { ...updated[index], caption };
    setGalleryImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImages(true);

    try {
      // Upload cover image if provided
      let coverImageUrl = project?.coverImageUrl;
      let coverImageKey = project?.coverImageKey;
      
      if (coverImage?.file) {
        const buffer = await coverImage.file.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(buffer))));
        const result = await uploadImage.mutateAsync({
          filename: coverImage.file.name,
          contentType: coverImage.file.type,
          data: base64,
        });
        coverImageUrl = result.url;
        coverImageKey = result.key;
      }

      // Upload gallery images
      const uploadedGalleryImages = await Promise.all(
        galleryImages.map(async (img) => {
          if (img.file) {
            const buffer = await img.file.arrayBuffer();
            const base64 = btoa(String.fromCharCode(...Array.from(new Uint8Array(buffer))));
            const result = await uploadImage.mutateAsync({
              filename: img.file.name,
              contentType: img.file.type,
              data: base64,
            });
            return {
              imageUrl: result.url,
              imageKey: result.key,
              videoUrl: undefined,
              imageType: img.imageType,
              caption: img.caption,
              altText: img.altText,
              sortOrder: img.sortOrder,
            };
          } else if (img.videoUrl) {
            return {
              imageUrl: undefined,
              imageKey: undefined,
              videoUrl: img.videoUrl,
              imageType: "video" as const,
              caption: img.caption,
              altText: img.altText,
              sortOrder: img.sortOrder,
            };
          }
          return {
            imageUrl: img.url,
            imageKey: img.key,
            videoUrl: img.videoUrl,
            imageType: img.imageType,
            caption: img.caption,
            altText: img.altText,
            sortOrder: img.sortOrder,
          };
        })
      );

      const projectData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        description: formData.description || undefined,
        designNotes: formData.designNotes || undefined,
        discipline: formData.discipline,
        subcategory: formData.subcategory || undefined,
        categoryId: formData.categoryId || undefined,
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        location: formData.location || undefined,
        client: formData.client || undefined,
        year: formData.year || undefined,
        status: formData.status,
        featured: formData.featured,
        creativeTeam: {
          director: formData.director || undefined,
          associateDirector: formData.associateDirector || undefined,
          musicDirector: formData.musicDirector || undefined,
          coScenicDesigner: formData.coScenicDesigner || undefined,
          costumeDesigner: formData.costumeDesigner || undefined,
          lightingDesigner: formData.lightingDesigner || undefined,
          soundDesigner: formData.soundDesigner || undefined,
        },
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        images: uploadedGalleryImages,
      };

      if (project) {
        await updateProject.mutateAsync({ id: project.id, ...projectData });
      } else {
        await createProject.mutateAsync(projectData);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      toast.error("Failed to save project");
    } finally {
      setUploadingImages(false);
    }
  };

  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  const isLoading = createProject.isPending || updateProject.isPending || uploadingImages;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            {project ? "Update project details" : "Add a new project with gallery and design notes"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Million Dollar Quartet"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    placeholder="million-dollar-quartet"
                  />
                  <Button type="button" variant="outline" onClick={generateSlug}>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  placeholder="Brief summary..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discipline">Discipline *</Label>
                  <Select
                    value={formData.discipline}
                    onValueChange={(value: any) => setFormData({ ...formData, discipline: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discipline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scenic_design">Scenic Design</SelectItem>
                      <SelectItem value="experiential_design">Experiential Design</SelectItem>
                      <SelectItem value="rendering">Rendering</SelectItem>
                      <SelectItem value="scenic_models">Scenic Models</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g., Musical Theatre, Comedy, Drama"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.categoryId?.toString() || ""}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value ? parseInt(value) : undefined })}
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
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="New York, NY"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client">Client/Theatre</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="Broadway Theatre"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
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
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image</Label>
                {coverImage?.url ? (
                  <div className="relative inline-block">
                    <img
                      src={coverImage.url}
                      alt="Cover"
                      className="h-32 w-auto rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -right-2 -top-2"
                      onClick={() => setCoverImage(undefined)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  placeholder="Detailed project description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designNotes">Design Notes</Label>
                <Textarea
                  id="designNotes"
                  value={formData.designNotes}
                  onChange={(e) => setFormData({ ...formData, designNotes: e.target.value })}
                  rows={10}
                  placeholder="Design philosophy, concept development, technical notes..."
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Supports Markdown formatting
                </p>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="director">Director</Label>
                  <Input
                    id="director"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="associateDirector">Associate Director</Label>
                  <Input
                    id="associateDirector"
                    value={formData.associateDirector}
                    onChange={(e) => setFormData({ ...formData, associateDirector: e.target.value })}
                    placeholder="Jane Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="musicDirector">Music Director</Label>
                  <Input
                    id="musicDirector"
                    value={formData.musicDirector}
                    onChange={(e) => setFormData({ ...formData, musicDirector: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coScenicDesigner">Co-Scenic Designer</Label>
                  <Input
                    id="coScenicDesigner"
                    value={formData.coScenicDesigner}
                    onChange={(e) => setFormData({ ...formData, coScenicDesigner: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costumeDesigner">Costume Designer</Label>
                  <Input
                    id="costumeDesigner"
                    value={formData.costumeDesigner}
                    onChange={(e) => setFormData({ ...formData, costumeDesigner: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lightingDesigner">Lighting Designer</Label>
                  <Input
                    id="lightingDesigner"
                    value={formData.lightingDesigner}
                    onChange={(e) => setFormData({ ...formData, lightingDesigner: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soundDesigner">Sound Designer</Label>
                  <Input
                    id="soundDesigner"
                    value={formData.soundDesigner}
                    onChange={(e) => setFormData({ ...formData, soundDesigner: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddGalleryImage("production")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Production Photos
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddGalleryImage("rendering")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Renderings
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddGalleryImage("video")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Video
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {galleryImages.map((img, index) => (
                  <div key={index} className="relative rounded border p-2">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        {img.videoUrl ? (
                          <div className="aspect-video rounded bg-muted flex items-center justify-center p-2">
                            <span className="text-xs text-center break-all">Video: {img.videoUrl}</span>
                          </div>
                        ) : (
                          <img
                            src={img.url}
                            alt={img.caption || "Gallery image"}
                            className="w-full rounded"
                          />
                        )}
                        <div className="mt-2 space-y-2">
                          <Input
                            placeholder="Caption"
                            value={img.caption || ""}
                            onChange={(e) => handleUpdateImageCaption(index, e.target.value)}
                            className="text-sm"
                          />
                          <div className="text-xs text-muted-foreground">
                            Type: {img.imageType}
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {galleryImages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No images added yet. Click the buttons above to add production photos, renderings, or videos.
                </p>
              )}
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  placeholder={formData.title || "Project title for search engines"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                  placeholder="Meta description for search engines..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoKeywords">SEO Keywords</Label>
                <Input
                  id="seoKeywords"
                  value={formData.seoKeywords}
                  onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                  placeholder="scenic design, theatre, broadway"
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {project ? "Update" : "Create"} Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
