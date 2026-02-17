import { useState, useEffect, useMemo, useId } from "react";
import { trpc } from "@/lib/trpc";
import { processImageForUpload } from "@/utils/imageUtils";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Plus, GripVertical, ArrowLeft, Save, Info, Search, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProjectFormProps {
  projectId?: number;
}

interface TeamMember {
  name: string;
  role: string;
}

interface ImageUpload {
  id?: number;
  file?: File;
  url?: string;
  key?: string;
  videoUrl?: string;
  imageType: "production" | "rendering" | "technical_drawing" | "scenic_models" | "video";
  caption?: string;
  altText?: string;
  sortOrder: number;
}

const COMMON_ROLES = [
  "Director",
  "Playwright",
  "Scenic Design",
  "Co-Scenic Designer",
  "Associate Scenic Designer",
  "Costume Design",
  "Lighting Design",
  "Sound Design",
  "Projection Design",
  "Music Director",
  "Choreographer",
  "Stage Manager",
  "Technical Director",
  "Properties Design",
  "Scenic Charge",
  "Head of Fabrication",
  "Technical Designer / CNC Documentation",
  "Account Manager",
  "Producer",
  "Associate Director",
];

/* ===== Sortable Team Member Item ===== */
function SortableTeamMember({
  id,
  member,
  index,
  onUpdate,
  onRemove,
}: {
  id: string;
  member: TeamMember;
  index: number;
  onUpdate: (index: number, field: 'name' | 'role', value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''
        }`}
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-accent"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      <div className="flex-1 grid grid-cols-2 gap-3">
        <Input
          value={member.role}
          onChange={(e) => onUpdate(index, 'role', e.target.value)}
          placeholder="Role"
          className="font-medium"
        />
        <Input
          value={member.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          placeholder="Name"
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onRemove(index)}
        className="flex-shrink-0 text-destructive hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ===== Sortable Gallery Image Item ===== */
function SortableGalleryImage({
  id,
  img,
  index,
  onUpdateField,
  onRemove,
}: {
  id: string;
  img: ImageUpload;
  index: number;
  onUpdateField: (index: number, field: string, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-lg border overflow-hidden ${isDragging ? 'shadow-lg ring-2 ring-primary' : ''
        }`}
    >
      {/* Drag handle overlay */}
      <button
        type="button"
        className="absolute top-2 left-2 z-10 cursor-grab active:cursor-grabbing touch-none p-1.5 rounded bg-black/60 hover:bg-black/80 text-white"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {img.videoUrl ? (
        <div className="aspect-video bg-muted flex items-center justify-center p-4">
          <span className="text-xs text-center break-all text-muted-foreground">
            Video: {img.videoUrl}
          </span>
        </div>
      ) : (
        <img
          src={img.url}
          alt={img.caption || "Gallery image"}
          className="w-full aspect-video object-cover"
        />
      )}
      <div className="p-3 space-y-2">
        <Input
          placeholder="Caption"
          value={img.caption || ""}
          onChange={(e) => onUpdateField(index, 'caption', e.target.value)}
          className="text-sm"
        />
        <Input
          placeholder="Alt text"
          value={img.altText || ""}
          onChange={(e) => onUpdateField(index, 'altText', e.target.value)}
          className="text-sm"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive h-7"
        >
          <X className="h-3 w-3 mr-1" />
          Remove
        </Button>
      </div>
      <Select
        value={img.imageType}
        onValueChange={(val) => onUpdateField(index, 'imageType', val)}
      >
        <SelectTrigger className="h-7 text-xs w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="production">Production</SelectItem>
          <SelectItem value="rendering">Rendering</SelectItem>
          <SelectItem value="scenic_models">Scenic Model</SelectItem>
          <SelectItem value="technical_drawing">Technical Drawing</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    designNotes: "",
    discipline: "scenic_design" as "scenic_design" | "experiential_design" | "rendering" | "scenic_models",
    subcategory: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    year: new Date().getFullYear(),
    month: undefined as number | undefined, // 1-12 for chronological sorting
    location: "",
    client: "",
    // SEO - for search engines only
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
  });

  // Dynamic creative team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false);

  // Tags (user-facing content labels)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [newTagInput, setNewTagInput] = useState("");
  const [isCreatingTag, setIsCreatingTag] = useState(false);

  const [coverImage, setCoverImage] = useState<{ file?: File; url?: string; key?: string }>();
  const [galleryImages, setGalleryImages] = useState<ImageUpload[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Categories removed - projects use disciplines, not categories
  const { data: allTags, refetch: refetchTags } = trpc.tags.list.useQuery();
  
  const createTag = trpc.tags.create.useMutation({
    onSuccess: (newTag) => {
      toast.success(`Tag "${newTag.name}" created`);
      setNewTagInput("");
      setIsCreatingTag(false);
      refetchTags();
      // Auto-select the newly created tag
      setSelectedTagIds([...selectedTagIds, newTag.id]);
    },
    onError: (error) => {
      toast.error(`Failed to create tag: ${error.message}`);
    },
  });
  // const uploadImage = trpc.projects.uploadImage.useMutation(); // Replaced by client-side upload

  const createProject = trpc.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Project created successfully");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to create project: ${error.message}`);
    },
  });

  const updateProject = trpc.projects.update.useMutation({
    onSuccess: () => {
      toast.success("Project updated successfully");
      navigate("/admin");
    },
    onError: (error) => {
      toast.error(`Failed to update project: ${error.message}`);
    },
  });

  // Fetch full project data by ID when editing
  const { data: fullProject, isLoading: isLoadingProject } = trpc.projects.getById.useQuery(
    { id: projectId! },
    { enabled: !!projectId }
  );

  useEffect(() => {
    if (fullProject) {
      setFormData({
        title: fullProject.title || "",
        slug: fullProject.slug || "",
        excerpt: fullProject.excerpt || "",
        designNotes: fullProject.designNotes || "",
        discipline: fullProject.discipline || "scenic_design",
        subcategory: fullProject.subcategory || "",
        status: (fullProject.status && (fullProject.status.toLowerCase() === 'draft' || fullProject.status.toLowerCase() === 'published' || fullProject.status.toLowerCase() === 'archived'))
          ? fullProject.status.toLowerCase() as "draft" | "published" | "archived"
          : "draft",
        featured: fullProject.featured || false,
        year: fullProject.year || new Date().getFullYear(),
        location: fullProject.location || "",
        client: fullProject.client || "",
        month: fullProject.month ?? undefined,
        seoTitle: fullProject.seoTitle || "",
        seoDescription: fullProject.seoDescription || "",
        seoKeywords: fullProject.seoKeywords || "",
      });

      // Load creative team as dynamic array
      if (fullProject.creativeTeam) {
        let team: any = fullProject.creativeTeam;
        // Handle double-encoded JSON string from DB
        if (typeof team === 'string') {
          try { team = JSON.parse(team); } catch { team = undefined; }
        }
        if (Array.isArray(team)) {
          // Already in [{name, role}] format
          setTeamMembers(team.filter((m: any) => m.name && m.role));
        } else if (team && typeof team === 'object') {
          // Legacy {director: "name"} format - convert
          const members: TeamMember[] = [];
          const roleMap: Record<string, string> = {
            director: "Director",
            associateDirector: "Associate Director",
            musicDirector: "Music Director",
            coScenicDesigner: "Co-Scenic Designer",
            costumeDesigner: "Costume Design",
            lightingDesigner: "Lighting Design",
            soundDesigner: "Sound Design",
          };
          for (const [key, value] of Object.entries(team)) {
            if (value && typeof value === 'string' && roleMap[key]) {
              members.push({ name: value, role: roleMap[key] });
            }
          }
          setTeamMembers(members);
        }
      }

      // Load tags
      if (fullProject.tags && Array.isArray(fullProject.tags)) {
        setSelectedTagIds(fullProject.tags.map((t: any) => t.id));
      }

      if (fullProject.coverImageUrl) {
        setCoverImage({ url: fullProject.coverImageUrl, key: fullProject.coverImageKey ?? undefined });
      }

      // Load existing gallery images
      if (fullProject.images && Array.isArray(fullProject.images)) {
        const existingImages: ImageUpload[] = fullProject.images.map((img: any, index: number) => ({
          id: img.id,
          url: img.imageUrl,
          key: img.imageKey,
          videoUrl: img.videoUrl,
          imageType: (img.imageType?.toLowerCase() === 'production' || img.imageType?.toLowerCase() === 'rendering' || img.imageType?.toLowerCase() === 'technical_drawing' || img.imageType?.toLowerCase() === 'video')
            ? img.imageType.toLowerCase() as any
            : 'production',
          caption: img.caption,
          altText: img.altText,
          sortOrder: img.sortOrder !== undefined ? img.sortOrder : index,
        }));
        setGalleryImages(existingImages);
      }
    }
  }, [fullProject]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Stable IDs for sortable items
  const teamMemberIds = useMemo(
    () => teamMembers.map((_, i) => `team-${i}`),
    [teamMembers.length]
  );

  const galleryImageIds = useMemo(
    () => galleryImages.map((_, i) => `gallery-${i}`),
    [galleryImages.length]
  );

  const handleTeamDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = teamMemberIds.indexOf(active.id as string);
    const newIndex = teamMemberIds.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      setTeamMembers((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  const handleGalleryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = galleryImageIds.indexOf(active.id as string);
    const newIndex = galleryImageIds.indexOf(over.id as string);
    if (oldIndex !== -1 && newIndex !== -1) {
      setGalleryImages((prev) => {
        const reordered = arrayMove(prev, oldIndex, newIndex);
        // Update sortOrder to match new positions
        return reordered.map((img, i) => ({ ...img, sortOrder: i }));
      });
    }
  };

  // Filtered tags for search
  const filteredTags = useMemo(() => {
    if (!allTags) return [];
    if (!tagSearch.trim()) return allTags.slice(0, 50);
    const q = tagSearch.toLowerCase();
    return allTags.filter(t => t.name.toLowerCase().includes(q)).slice(0, 50);
  }, [allTags, tagSearch]);

  // Role suggestions filtered by input
  const filteredRoles = useMemo(() => {
    if (!newMemberRole.trim()) return COMMON_ROLES;
    const q = newMemberRole.toLowerCase();
    return COMMON_ROLES.filter(r => r.toLowerCase().includes(q));
  }, [newMemberRole]);

  const handleAddTeamMember = () => {
    if (!newMemberName.trim() || !newMemberRole.trim()) {
      toast.error("Both role and name are required");
      return;
    }
    setTeamMembers([...teamMembers, { name: newMemberName.trim(), role: newMemberRole.trim() }]);
    setNewMemberName("");
    setNewMemberRole("");
    setShowRoleSuggestions(false);
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleUpdateTeamMember = (index: number, field: 'name' | 'role', value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleAddGalleryImage = (type: "production" | "rendering" | "technical_drawing" | "video") => {
    if (type === "video") {
      const url = prompt("Enter video URL (YouTube/Vimeo):");
      if (url) {
        setGalleryImages([
          ...galleryImages,
          {
            videoUrl: url,
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
        handleFiles(Array.from((e.target as HTMLInputElement).files || []), type);
      };
      input.click();
    }
  };

  const handleFiles = (files: File[], defaultType: "production" | "rendering" | "technical_drawing" | "scenic_models" = "production") => {
    const newImages: ImageUpload[] = files.map((file, index) => ({
      file,
      url: URL.createObjectURL(file), // Create extensive preview
      imageType: defaultType,
      sortOrder: galleryImages.length + index,
    }));
    setGalleryImages([...galleryImages, ...newImages]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      handleFiles(files);
      toast.success(`Added ${files.length} images`);
    }
  };


  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handleUpdateImageField = (index: number, field: string, value: string) => {
    const updated = [...galleryImages];
    updated[index] = { ...updated[index], [field]: value };
    setGalleryImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImages(true);

    try {
      // Upload cover image if provided
      let coverImageUrl = fullProject?.coverImageUrl;
      let coverImageKey = fullProject?.coverImageKey;

      if (coverImage?.file) {
        try {
          const optimizedFile = await processImageForUpload(coverImage.file);
          const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', 'projects');
          coverImageUrl = publicUrl;
          coverImageKey = undefined; // We don't need to manage keys manually with the new system
        } catch (error) {
          console.error("Cover image upload failed:", error);
          toast.error("Failed to upload cover image");
          setUploadingImages(false);
          return;
        }
      }

      // Upload gallery images
      const uploadedGalleryImages = await Promise.all(
        galleryImages.map(async (img) => {
          if (img.file) {
            try {
              const optimizedFile = await processImageForUpload(img.file);
              const publicUrl = await uploadToStorage(optimizedFile, 'portfolio', 'projects');
              return {
                imageUrl: publicUrl,
                imageKey: undefined,
                videoUrl: undefined,
                imageType: img.imageType,
                caption: img.caption || undefined,
                altText: img.altText || undefined,
                sortOrder: img.sortOrder,
              };
            } catch (error) {
              console.error(`Gallery image upload failed for ${img.file.name}:`, error);
              return null; // Handle failure gracefully or throw
            }
          } else if (img.videoUrl) {
            return {
              imageUrl: undefined,
              imageKey: undefined,
              videoUrl: img.videoUrl,
              imageType: "video" as const,
              caption: img.caption || undefined,
              altText: img.altText || undefined,
              sortOrder: img.sortOrder,
            };
          }
          return {
            imageUrl: img.url,
            imageKey: img.key,
            videoUrl: img.videoUrl || undefined,
            imageType: img.imageType,
            caption: img.caption || undefined,
            altText: img.altText || undefined,
            sortOrder: img.sortOrder,
          };
        })
      );

      // Filter out any failed uploads (nulls)
      const validGalleryImages = uploadedGalleryImages.filter(img => img !== null) as any[];

      const safeStatus = formData.status && ['draft', 'published', 'archived'].includes(formData.status.toLowerCase())
        ? formData.status.toLowerCase()
        : 'draft';

      const projectPayload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt || undefined,
        designNotes: formData.designNotes || undefined,
        discipline: formData.discipline.toLowerCase() as any,
        subcategory: formData.subcategory || undefined,
        month: formData.month || undefined,
        coverImageUrl: coverImageUrl || undefined,
        coverImageKey: coverImageKey || undefined,
        location: formData.location || undefined,
        client: formData.client || undefined,
        year: formData.year || undefined,
        status: safeStatus as any,
        featured: formData.featured,
        creativeTeam: teamMembers.length > 0 ? teamMembers : undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        images: validGalleryImages.map(img => ({
          ...img,
          imageType: img.imageType.toLowerCase() as any
        })),
      };

      if (projectId) {
        await updateProject.mutateAsync({ id: projectId, ...projectPayload });
      } else {
        await createProject.mutateAsync(projectPayload);
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

  if (projectId && isLoadingProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin
              </Button>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-xl font-bold">
                {projectId ? "Edit Project" : "New Project"}
              </h1>
              {formData.title && (
                <span className="text-muted-foreground text-sm">— {formData.title}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
              <Button type="submit" form="project-form" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <Save className="h-4 w-4 mr-2" />
                {projectId ? "Update" : "Create"} Project
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto py-8">
        <form id="project-form" onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className={`grid w-full ${formData.discipline === 'rendering' || formData.discipline === 'scenic_models' ? 'grid-cols-5' : 'grid-cols-6'} mb-8`}>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              {formData.discipline !== 'rendering' && formData.discipline !== 'scenic_models' && (
                <TabsTrigger value="content">Content</TabsTrigger>
              )}
              <TabsTrigger value="team">
                Creative Team
                {teamMembers.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">{teamMembers.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="gallery">
                Gallery
                {galleryImages.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">{galleryImages.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="tags">
                Tags
                {selectedTagIds.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">{selectedTagIds.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            {/* ===== BASIC INFO TAB ===== */}
            <TabsContent value="basic">
              <div className="grid grid-cols-3 gap-8">
                {/* Left column - main fields */}
                <div className="col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                          placeholder="Million Dollar Quartet"
                          className="text-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug *</Label>
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
                        <p className="text-xs text-muted-foreground">/projects/{formData.slug || "..."}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                          id="excerpt"
                          value={formData.excerpt}
                          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                          rows={3}
                          placeholder="Brief summary shown in project listings..."
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
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="New York, NY"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="client">Client / Theatre</Label>
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
                          <Label htmlFor="year">Year</Label>
                          <Input
                            id="year"
                            type="number"
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="month">Month</Label>
                          <Select
                            value={formData.month?.toString() || "none"}
                            onValueChange={(value) => setFormData({ ...formData, month: value === "none" ? undefined : parseInt(value) })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">No Month</SelectItem>
                              <SelectItem value="1">January</SelectItem>
                              <SelectItem value="2">February</SelectItem>
                              <SelectItem value="3">March</SelectItem>
                              <SelectItem value="4">April</SelectItem>
                              <SelectItem value="5">May</SelectItem>
                              <SelectItem value="6">June</SelectItem>
                              <SelectItem value="7">July</SelectItem>
                              <SelectItem value="8">August</SelectItem>
                              <SelectItem value="9">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right column - cover image & status */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cover Image</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {coverImage?.url ? (
                        <div className="relative">
                          <img
                            src={coverImage.url}
                            alt="Cover"
                            className="w-full rounded border aspect-[16/10] object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setCoverImage(undefined)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                            className="cursor-pointer"
                          />
                          <p className="text-sm text-muted-foreground mt-2">
                            Recommended: 1600x1000px
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Publishing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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

                      <div className="flex items-center justify-between">
                        <Label htmlFor="featured">Featured Project</Label>
                        <Switch
                          id="featured"
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ===== CONTENT TAB ===== */}
            <TabsContent value="content">
              <div className="max-w-4xl space-y-6">


                <Card>
                  <CardHeader>
                    <CardTitle>Design Notes</CardTitle>
                    <CardDescription>Design philosophy, concept development, technical notes (supports Markdown)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={formData.designNotes}
                      onChange={(e) => setFormData({ ...formData, designNotes: e.target.value })}
                      rows={14}
                      placeholder="Design philosophy, concept development, technical notes..."
                      className="font-mono text-sm"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ===== CREATIVE TEAM TAB ===== */}
            <TabsContent value="team">
              <div className="max-w-4xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Creative Team</CardTitle>
                    <CardDescription>
                      Add team members with custom roles. Each project can have different roles —
                      type a role name or select from common suggestions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing team members - drag to reorder */}
                    {teamMembers.length > 0 && (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleTeamDragEnd}
                      >
                        <SortableContext items={teamMemberIds} strategy={verticalListSortingStrategy}>
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <GripVertical className="h-3 w-3" /> Drag to reorder team members
                            </p>
                            {teamMembers.map((member, index) => (
                              <SortableTeamMember
                                key={teamMemberIds[index]}
                                id={teamMemberIds[index]}
                                member={member}
                                index={index}
                                onUpdate={handleUpdateTeamMember}
                                onRemove={handleRemoveTeamMember}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}

                    {/* Add new member */}
                    <div className="border-2 border-dashed rounded-lg p-4">
                      <p className="text-sm font-medium mb-3">Add Team Member</p>
                      <div className="flex items-end gap-3">
                        <div className="flex-1 space-y-2 relative">
                          <Label className="text-xs text-muted-foreground">Role</Label>
                          <Input
                            value={newMemberRole}
                            onChange={(e) => {
                              setNewMemberRole(e.target.value);
                              setShowRoleSuggestions(true);
                            }}
                            onFocus={() => setShowRoleSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 200)}
                            placeholder="e.g., Director, Scenic Design..."
                          />
                          {showRoleSuggestions && filteredRoles.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                              {filteredRoles.map((role) => (
                                <button
                                  key={role}
                                  type="button"
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setNewMemberRole(role);
                                    setShowRoleSuggestions(false);
                                  }}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <Input
                            value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            placeholder="Full name"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTeamMember();
                              }
                            }}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddTeamMember}
                          className="flex-shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {teamMembers.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No team members added yet. Use the form above to add creative team members with custom roles.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ===== GALLERY TAB ===== */}
            <TabsContent value="gallery">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Gallery Images</CardTitle>
                      <CardDescription>Production photos, renderings, and videos</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 mb-6 transition-colors ${isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        }`}
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <div className="flex flex-col items-center justify-center text-center gap-2">
                        <div className="p-3 bg-muted rounded-full">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg">Drag & Drop Images Here</h3>
                        <p className="text-sm text-muted-foreground max-w-sm">
                          Upload production photos, renderings, or drawings. You can categorize them after uploading.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddGalleryImage("production")}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Production Photos
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddGalleryImage("rendering")}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Renderings
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddGalleryImage("scenic_models" as any)} // Cast since original param was stricter
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Scenic Models
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddGalleryImage("technical_drawing")}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Technical Drawings
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddGalleryImage("video")}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Video URL
                          </Button>
                        </div>
                      </div>
                    </div>
                    {galleryImages.length > 0 ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleGalleryDragEnd}
                      >
                        <SortableContext items={galleryImageIds} strategy={rectSortingStrategy}>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                            <GripVertical className="h-3 w-3" /> Drag images to reorder them in the gallery
                          </p>
                          <div className="grid grid-cols-3 gap-4">
                            {galleryImages.map((img, index) => (
                              <SortableGalleryImage
                                key={galleryImageIds[index]}
                                id={galleryImageIds[index]}
                                img={img}
                                index={index}
                                onUpdateField={handleUpdateImageField}
                                onRemove={handleRemoveGalleryImage}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No images added yet. Click the buttons above to add production photos, renderings, or videos.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ===== TAGS TAB ===== */}
            <TabsContent value="tags">
              <div className="max-w-4xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Tags
                      <Badge variant="outline" className="font-normal">User-Facing</Badge>
                    </CardTitle>
                    <CardDescription>
                      Tags are visible to visitors and used for browsing/filtering content on the site.
                      They appear as clickable badges on the project page and link to tag pages.
                      <br />
                      <span className="text-xs italic mt-1 inline-block">
                        Different from SEO Keywords, which are hidden meta tags only for search engines.
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Selected tags */}
                    {selectedTagIds.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm">Selected Tags ({selectedTagIds.length})</Label>
                        <div className="flex flex-wrap gap-2">
                          {selectedTagIds.map((tagId) => {
                            const tag = allTags?.find(t => t.id === tagId);
                            return tag ? (
                              <Badge
                                key={tagId}
                                variant="default"
                                className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                onClick={() => handleToggleTag(tagId)}
                              >
                                {tag.name}
                                <X className="h-3 w-3 ml-1" />
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {/* Tag search and create */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            value={tagSearch}
                            onChange={(e) => setTagSearch(e.target.value)}
                            placeholder="Search existing tags..."
                            className="pl-9"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCreatingTag(!isCreatingTag)}
                          className={isCreatingTag ? "bg-primary text-primary-foreground" : ""}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          New Tag
                        </Button>
                      </div>

                      {/* Inline tag creation */}
                      {isCreatingTag && (
                        <div className="flex gap-2 p-3 bg-muted rounded-lg">
                          <Input
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            placeholder="e.g., 'Lighting Design', 'Digital Design'"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newTagInput.trim()) {
                                  const slug = newTagInput
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/(^-|-$)/g, "");
                                  createTag.mutate({ name: newTagInput.trim(), slug });
                                }
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              if (newTagInput.trim()) {
                                const slug = newTagInput
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, "");
                                createTag.mutate({ name: newTagInput.trim(), slug });
                              }
                            }}
                            disabled={createTag.isPending || !newTagInput.trim()}
                          >
                            {createTag.isPending ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-1" />
                                Create
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Available tags */}
                    <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
                      <div className="flex flex-wrap gap-2">
                        {filteredTags.map((tag) => {
                          const isSelected = selectedTagIds.includes(tag.id);
                          return (
                            <Badge
                              key={tag.id}
                              variant={isSelected ? "default" : "outline"}
                              className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => handleToggleTag(tag.id)}
                            >
                              {tag.name}
                              {isSelected && <X className="h-3 w-3 ml-1" />}
                            </Badge>
                          );
                        })}
                        {filteredTags.length === 0 && (
                          <p className="text-sm text-muted-foreground">No tags found matching "{tagSearch}"</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ===== SEO TAB ===== */}
            <TabsContent value="seo">
              <div className="max-w-4xl space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      SEO Settings
                      <Badge variant="outline" className="font-normal">Search Engines Only</Badge>
                    </CardTitle>
                    <CardDescription>
                      These fields control how the project appears in search engine results (Google, Bing, etc.).
                      They are <strong>not visible</strong> to visitors on the site itself.
                      <br />
                      <span className="text-xs italic mt-1 inline-block">
                        For visitor-facing labels, use the Tags tab instead.
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        value={formData.seoTitle}
                        onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                        placeholder={formData.title || "Project title for search engines"}
                      />
                      <p className="text-xs text-muted-foreground">
                        Appears as the page title in search results. Leave blank to use the project title.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoDescription">SEO Description</Label>
                      <Textarea
                        id="seoDescription"
                        value={formData.seoDescription}
                        onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                        rows={3}
                        placeholder="Meta description for search engines (150-160 characters ideal)..."
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.seoDescription.length}/160 characters — shown as the snippet below the title in search results.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">SEO Keywords</Label>
                      <Input
                        id="seoKeywords"
                        value={formData.seoKeywords}
                        onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                        placeholder="scenic design, theatre, broadway, set design"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated keywords for the &lt;meta name="keywords"&gt; tag.
                        Most search engines no longer use this, but it doesn't hurt to include them.
                      </p>
                    </div>

                    {/* Preview */}
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">Search Result Preview</p>
                      <div className="space-y-1">
                        <p className="text-blue-600 text-lg font-medium truncate">
                          {formData.seoTitle || formData.title || "Project Title"}
                        </p>
                        <p className="text-green-700 text-sm">
                          brandonptdavis.com/projects/{formData.slug || "..."}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {formData.seoDescription || formData.excerpt || "Project description will appear here..."}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div >
  );
}
