import React, { useState, useEffect, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, GripVertical, Plus, Trash2, Save, Image as ImageIcon, UploadCloud, Settings2, Layers, ChevronDown, ChevronRight } from "lucide-react";
import { AdminGalleryImageManager } from "@/components/admin/AdminGalleryImageManager";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";

type ProcessCategory = 
  | 'workflow-toolkit' 
  | 'workflow-drawing' 
  | 'workflow-modeling' 
  | 'workflow-buildability'
  | 'rendering' 
  | 'technical-drawing' 
  | 'live-events';

interface ProcessGalleryItem {
  id: number;
  category: ProcessCategory;
  projectId: number | null;
  imageUrl: string;
  imageKey: string | null;
  videoUrl: string | null;
  altText: string | null;
  displayTitle: string | null;
  description: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
  project?: {
    id: number;
    title: string;
    slug: string;
    coverImageUrl: string | null;
    year: number | null;
  };
}

interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
  logoKey: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: Date;
}

const WORKFLOW_CATEGORIES: Record<string, { label: string; description: string; color: string }> = {
  'workflow-toolkit': {
    label: 'Technical Toolkit',
    description: 'Software showcase image',
    color: 'bg-blue-500',
  },
  'workflow-drawing': {
    label: 'Technical Drawing',
    description: 'CAD workflow image',
    color: 'bg-green-500',
  },
  'workflow-modeling': {
    label: '3D Modeling',
    description: 'Rendering workflow image',
    color: 'bg-purple-500',
  },
  'workflow-buildability': {
    label: 'Buildability',
    description: 'Fabrication workflow image',
    color: 'bg-orange-500',
  },
};

const GALLERY_CATEGORIES: Record<string, { label: string; description: string; color: string }> = {
  'rendering': {
    label: 'Rendering Gallery',
    description: '3D renders and walkthrough videos',
    color: 'bg-purple-500',
  },
  'technical-drawing': {
    label: 'Technical Drawing Gallery',
    description: 'CAD drawings, plans, elevations',
    color: 'bg-green-500',
  },
  'live-events': {
    label: 'Live Events Gallery',
    description: 'Photos from built installations',
    color: 'bg-orange-500',
  },
};

// --- Sortable Item Component ---
function SortableGalleryItem({
  item,
  onRemove,
  onUpdate,
  onManageImages,
  onUpdateProject,
}: {
  item: ProcessGalleryItem;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: 'altText' | 'displayTitle' | 'description' | 'videoUrl' | 'year', value: string | number | null) => void;
  onManageImages?: (projectId: number, title: string) => void;
  onUpdateProject?: (projectId: number, field: 'title' | 'slug' | 'year', value: string | number | null) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const [isOpen, setIsOpen] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const displayImage = item.project?.coverImageUrl || item.imageUrl;
  const displayTitle = item.displayTitle || item.project?.title || (item.videoUrl ? 'Video' : 'Untitled');

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-3 mb-2 flex flex-col gap-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div {...attributes} {...listeners} className="mt-1 cursor-move text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="h-16 w-24 flex-shrink-0 bg-muted rounded overflow-hidden">
          {displayImage ? (
            <img src={displayImage} alt={item.altText || ''} className="w-full h-full object-cover" />
          ) : item.videoUrl ? (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-purple-500/10">
              <ImageIcon className="h-6 w-6 text-purple-500" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="font-semibold text-sm truncate">{displayTitle}</h4>
            {item.project && onManageImages && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => onManageImages(item.project!.id, item.project!.title)}
                title="Manage Gallery Images"
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              title={isOpen ? "Collapse Details" : "Edit Metadata"}
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={() => onRemove(item.id)}
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {item.videoUrl && <p className="text-xs text-muted-foreground truncate mt-1">📹 {item.videoUrl}</p>}
          {item.project && <p className="text-xs text-muted-foreground mt-1">{item.project.year}</p>}
        </div>
      </div>

      {isOpen && (
        <div className="grid gap-2 pl-8">
          {item.project && (
            <>
              <div className="grid gap-1 pb-2 border-b border-border">
                <label className="text-[10px] font-medium uppercase text-muted-foreground">Project Name</label>
                <Input
                  value={item.project.title || ''}
                  onChange={(e) => onUpdateProject?.(item.project!.id, 'title', e.target.value)}
                  placeholder="Project name..."
                  className="h-8 text-xs bg-background/50"
                />
              </div>
              <div className="grid gap-1 pb-2 border-b border-border">
                <label className="text-[10px] font-medium uppercase text-muted-foreground">URL Slug</label>
                <Input
                  value={item.project.slug || ''}
                  onChange={(e) => onUpdateProject?.(item.project!.id, 'slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  placeholder="url-slug..."
                  className="h-8 text-xs bg-background/50 font-mono"
                />
                <p className="text-[9px] text-muted-foreground/60 mt-1">
                  Preview: /projects/experiential/rendering/{item.project.slug || 'url-slug'}
                </p>
              </div>
            </>
          )}
          <div className="grid gap-1">
            <label className="text-[10px] font-medium uppercase text-muted-foreground">Display Title</label>
            <Input
              value={item.displayTitle || ''}
              onChange={(e) => onUpdate(item.id, 'displayTitle', e.target.value)}
              placeholder="Display title..."
              className="h-8 text-xs bg-background/50"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] font-medium uppercase text-muted-foreground">Year</label>
            <Input
              type="number"
              value={item.project?.year || ''}
              onChange={(e) => item.project && onUpdateProject?.(item.project.id, 'year', e.target.value ? parseInt(e.target.value) : null)}
              placeholder="YYYY"
              className="h-8 text-xs bg-background/50"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] font-medium uppercase text-muted-foreground">SEO Alt Text</label>
            <Input
              value={item.altText || ''}
              onChange={(e) => onUpdate(item.id, 'altText', e.target.value)}
              placeholder="Alt text for SEO..."
              className="h-8 text-xs bg-background/50"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] font-medium uppercase text-muted-foreground">Video URL (Optional)</label>
            <Input
              value={item.videoUrl || ''}
              onChange={(e) => onUpdate(item.id, 'videoUrl', e.target.value)}
              placeholder="Video URL (optional)..."
              className="h-8 text-xs bg-background/50"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-[10px] font-medium uppercase text-muted-foreground">Description</label>
            <Textarea
              value={item.description || ''}
              onChange={(e) => onUpdate(item.id, 'description', e.target.value)}
              placeholder="Description (optional)..."
              className="text-xs bg-background/50 min-h-[60px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// --- Category Gallery Section ---
function CategorySection({
  category,
  items,
  onReorder,
  onRemove,
  onUpdate,
  onAddImage,
  onAddVideoUrl,
  isUploading,
  onManageImages,
  onUpdateProject,
}: {
  category: ProcessCategory;
  items: ProcessGalleryItem[];
  onReorder: (items: ProcessGalleryItem[]) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: 'altText' | 'displayTitle' | 'description' | 'videoUrl' | 'year', value: string | number | null) => void;
  onAddImage: (category: ProcessCategory, file: File) => void;
  onAddVideoUrl: (category: ProcessCategory, videoUrl: string, title: string) => void;
  isUploading: boolean;
  onManageImages?: (projectId: number, title: string) => void;
  onUpdateProject?: (projectId: number, field: 'title' | 'slug' | 'year', value: string | number | null) => void;
}) {
  const config = WORKFLOW_CATEGORIES[category] || GALLERY_CATEGORIES[category];
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onAddImage(category, file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddImage(category, file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        <div>
          <h3 className="font-semibold">{config.label}</h3>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {items.length} image{items.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDraggingFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleFileDrop}
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop image here</p>
            <label className="cursor-pointer">
              <span className="text-sm text-primary hover:underline">or click to browse</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                aria-label={`Upload image for ${config.label}`}
              />
            </label>
          </>
        )}
      </div>

      {/* Add Video URL Option */}
      {!showVideoForm ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowVideoForm(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Or add video URL (Vimeo, YouTube, walkthrough)
        </Button>
      ) : (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Add Video</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowVideoForm(false);
                setVideoUrl('');
                setVideoTitle('');
              }}
            >
              Cancel
            </Button>
          </div>
          <Input
            placeholder="Video title..."
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="text-sm"
          />
          <Input
            placeholder="Paste video URL (Vimeo, YouTube, etc.)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={() => {
              if (videoUrl && videoTitle) {
                onAddVideoUrl(category, videoUrl, videoTitle);
                setShowVideoForm(false);
                setVideoUrl('');
                setVideoTitle('');
              } else {
                toast.error('Please provide both title and video URL');
              }
            }}
            disabled={!videoUrl || !videoTitle}
            className="w-full"
          >
            Add Video
          </Button>
        </div>
      )}

      {/* Gallery Items */}
      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item) => (
                <SortableGalleryItem
                  key={item.id}
                  item={item}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  onManageImages={onManageImages}
                  onUpdateProject={onUpdateProject}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No images in this category yet
        </div>
      )}
    </div>
  );
}

// --- Sortable Brand Item Component ---
function SortableBrandItem({
  brand,
  onRemove,
  onUpdate,
}: {
  brand: Brand;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: 'name' | 'websiteUrl', value: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: brand.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-3 mb-2 flex items-start gap-3 shadow-sm">
      <div {...attributes} {...listeners} className="mt-1 cursor-move text-muted-foreground hover:text-foreground">
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="h-20 w-32 flex-shrink-0 bg-muted rounded overflow-hidden">
        {brand.logoUrl ? (
          <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain p-2" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm truncate">{brand.name || 'Untitled Brand'}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={() => onRemove(brand.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-2">
          <Input
            value={brand.name || ''}
            onChange={(e) => onUpdate(brand.id, 'name', e.target.value)}
            placeholder="Brand name..."
            className="h-7 text-xs bg-background/50"
          />
          <Input
            value={brand.websiteUrl || ''}
            onChange={(e) => onUpdate(brand.id, 'websiteUrl', e.target.value)}
            placeholder="Website URL (optional)..."
            className="h-7 text-xs bg-background/50"
          />
        </div>
      </div>
    </div>
  );
}

// --- Brands Section Component ---
function BrandsSection({
  brands,
  onReorder,
  onRemove,
  onUpdate,
  onAddBrand,
  isUploading,
}: {
  brands: Brand[];
  onReorder: (brands: Brand[]) => void;
  onRemove: (id: number) => void;
  onUpdate: (id: number, field: 'name' | 'websiteUrl', value: string) => void;
  onAddBrand: (file: File) => void;
  isUploading: boolean;
}) {
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = brands.findIndex((b) => b.id === active.id);
      const newIndex = brands.findIndex((b) => b.id === over.id);
      onReorder(arrayMove(brands, oldIndex, newIndex));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onAddBrand(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAddBrand(file);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-blue-500" />
        <div>
          <h3 className="font-semibold">Brand Logos</h3>
          <p className="text-xs text-muted-foreground">Upload client and partner brand logos</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {brands.length} brand{brands.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDraggingFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingFile(true);
        }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleFileDrop}
      >
        {isUploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Uploading...</span>
          </div>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">Drag & drop brand logo here</p>
            <label className="cursor-pointer">
              <span className="text-sm text-primary hover:underline">or click to browse</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                aria-label="Upload brand logo"
              />
            </label>
          </>
        )}
      </div>

      {/* Brand Items */}
      {brands.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={brands.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {brands.map((brand) => (
                <SortableBrandItem key={brand.id} brand={brand} onRemove={onRemove} onUpdate={onUpdate} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">No brands added yet</div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function AdminProcessGallery() {
  const [localItems, setLocalItems] = useState<ProcessGalleryItem[]>([]);
  const [localBrands, setLocalBrands] = useState<Brand[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasBrandChanges, setHasBrandChanges] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState<ProcessCategory | null>(null);
  const [uploadingBrand, setUploadingBrand] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<ProcessCategory>('workflow-toolkit');
  const [activeGalleryTab, setActiveGalleryTab] = useState<ProcessCategory>('rendering');
  const [managingProject, setManagingProject] = useState<{ id: number; title: string } | null>(null);
  const updateTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});
  const brandTimersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  const utils = trpc.useUtils();
  const { data: galleryItems, isLoading } = trpc.processGallery.list.useQuery();
  const { data: brands, isLoading: brandsLoading } = trpc.processGallery.allBrands.useQuery();

  const addMutation = trpc.processGallery.add.useMutation({
    onSuccess: () => {
      utils.processGallery.list.invalidate();
      toast.success('Image added!');
    },
    onError: (e) => toast.error(`Failed to add: ${e.message}`),
  });

  const updateMutation = trpc.processGallery.update.useMutation({
    onSuccess: () => {
      console.log('[updateMutation] Update successful');
      // Silent success - no toast needed for auto-save
      // Don't invalidate query here to avoid overwriting local state
    },
    onError: (e) => {
      console.error('[updateMutation] Update failed:', e);
      toast.error(`Failed to update: ${e.message}`);
      // Refetch to restore correct state on error
      utils.processGallery.list.invalidate();
    },
  });

  const updateProjectMutation = trpc.projects.update.useMutation({
    onSuccess: () => {
      console.log('[updateProjectMutation] Project updated successfully');
      utils.processGallery.list.invalidate();
      toast.success('Project updated');
    },
    onError: (e) => {
      console.error('[updateProjectMutation] Update failed:', e);
      toast.error(`Failed to update project: ${e.message}`);
    },
  });

  const deleteMutation = trpc.processGallery.delete.useMutation({
    onSuccess: () => {
      utils.processGallery.list.invalidate();
      toast.success('Image removed');
    },
    onError: (e) => toast.error(`Failed to delete: ${e.message}`),
  });

  const orderMutation = trpc.processGallery.updateOrder.useMutation({
    onSuccess: () => {
      setHasChanges(false);
      toast.success('Order saved!');
    },
    onError: (e) => toast.error(`Failed to save order: ${e.message}`),
  });

  const addBrandMutation = trpc.processGallery.addBrand.useMutation({
    onSuccess: () => {
      utils.processGallery.allBrands.invalidate();
      toast.success('Brand added!');
    },
    onError: (e) => toast.error(`Failed to add brand: ${e.message}`),
  });

  const updateBrandMutation = trpc.processGallery.updateBrand.useMutation({
    onSuccess: () => {
      console.log('[updateBrandMutation] Update successful');
    },
    onError: (e) => {
      console.error('[updateBrandMutation] Update failed:', e);
      toast.error(`Failed to update brand: ${e.message}`);
      utils.processGallery.allBrands.invalidate();
    },
  });

  const deleteBrandMutation = trpc.processGallery.deleteBrand.useMutation({
    onSuccess: () => {
      utils.processGallery.allBrands.invalidate();
      toast.success('Brand removed');
    },
    onError: (e) => toast.error(`Failed to delete brand: ${e.message}`),
  });

  const brandOrderMutation = trpc.processGallery.updateBrandsOrder.useMutation({
    onSuccess: () => {
      setHasBrandChanges(false);
      toast.success('Brand order saved!');
    },
    onError: (e) => toast.error(`Failed to save brand order: ${e.message}`),
  });

  const createProjectMutation = trpc.processGallery.createGalleryProject.useMutation({
    onError: (e) => {
      console.error('[createProjectMutation] Failed:', e);
      toast.error(`Failed to create project: ${e.message}`);
    },
  });

  // Sync remote data to local state
  useEffect(() => {
    if (galleryItems) {
      console.log('[AdminProcessGallery] Loaded items:', galleryItems.length, galleryItems);
      setLocalItems(galleryItems as ProcessGalleryItem[]);
    }
  }, [galleryItems]);

  useEffect(() => {
    if (brands) {
      setLocalBrands(brands as Brand[]);
    }
  }, [brands]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      // Clear all pending update timers
      Object.values(updateTimersRef.current).forEach(timer => clearTimeout(timer));
      Object.values(brandTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Get items for a specific category
  const getItemsByCategory = (category: ProcessCategory) => {
    return localItems
      .filter((item) => item.category === category)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Handle image upload
  const handleAddImage = async (category: ProcessCategory, file: File) => {
    setUploadingCategory(category);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const path = `experiential-process/${category}/${timestamp}-${safeName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from('about-images').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage.from('about-images').getPublicUrl(path);
      const imageUrl = urlData.publicUrl;

      // Create a project for this gallery item
      const displayTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const { projectId } = await createProjectMutation.mutateAsync({
        title: displayTitle,
        coverImageUrl: imageUrl,
        category,
        year: new Date().getFullYear()
      });

      console.log('[handleAddImage] Created project:', projectId);

      // Add to database with project association
      await addMutation.mutateAsync({
        category,
        imageUrl,
        imageKey: path,
        displayTitle,
        projectId
      });
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingCategory(null);
    }
  };

  // Handle video URL addition
  const handleAddVideoUrl = async (category: ProcessCategory, videoUrl: string, title: string) => {
    setUploadingCategory(category);
    try {
      // Add to database with video URL only (no image)
      await addMutation.mutateAsync({
        category,
        videoUrl,
        displayTitle: title,
        imageUrl: '', // Empty string as placeholder
      });
      toast.success('Video added successfully!');
    } catch (err: any) {
      console.error('Add video error:', err);
      toast.error(`Failed to add video: ${err.message}`);
    } finally {
      setUploadingCategory(null);
    }
  };

  // Handle reorder within category
  const handleReorder = (category: ProcessCategory, reorderedItems: ProcessGalleryItem[]) => {
    setLocalItems((prev) => {
      const otherItems = prev.filter((i) => i.category !== category);
      const newItems = reorderedItems.map((item, idx) => ({ ...item, sortOrder: idx }));
      return [...otherItems, ...newItems];
    });
    setHasChanges(true);
  };

  // Handle remove
  const handleRemove = async (id: number) => {
    const item = localItems.find((i) => i.id === id);
    if (!item) return;

    // Delete from storage if we have the key
    if (item.imageKey) {
      try {
        await supabase.storage.from('about-images').remove([item.imageKey]);
      } catch (e) {
        console.warn('Could not delete from storage:', e);
      }
    }

    await deleteMutation.mutateAsync({ id });
    setLocalItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Handle metadata update (debounced via local state)
  const handleUpdate = useCallback(
    (id: number, field: 'altText' | 'displayTitle' | 'description' | 'videoUrl' | 'year', value: string | number | null) => {
      // Update local state immediately for responsive UI
      setLocalItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

      // Clear any existing timer for this field on this item
      const timerKey = `${id}-${field}`;
      if (updateTimersRef.current[timerKey]) {
        clearTimeout(updateTimersRef.current[timerKey]);
      }

      // Set new debounced timer
      updateTimersRef.current[timerKey] = setTimeout(() => {
        console.log(`[handleUpdate] Saving ${field} for item ${id}:`, value);
        updateMutation.mutate({ id, [field]: value });
        delete updateTimersRef.current[timerKey];
      }, 500);
    },
    [updateMutation]
  );

  const handleUpdateProject = useCallback(
    (projectId: number, field: 'title' | 'slug' | 'year', value: string | number | null) => {
      console.log(`[handleUpdateProject] Updating ${field} for project ${projectId}:`, value);
      
      // Update local state optimistically
      setLocalItems((prev) =>
        prev.map((item) =>
          item.project?.id === projectId && item.project
            ? {
                ...item,
                project: {
                  ...item.project,
                  [field]: value,
                },
              }
            : item
        )
      );
      
      // Persist to server
      updateProjectMutation.mutate({ id: projectId, [field]: value });
    },
    [updateProjectMutation]
  );

  // Save order changes
  const handleSaveOrder = async () => {
    const orderUpdates = localItems.map((item, idx) => ({
      id: item.id,
      sortOrder: item.sortOrder,
    }));
    await orderMutation.mutateAsync(orderUpdates);
  };

  // Handle brand image upload
  const handleAddBrand = async (file: File) => {
    setUploadingBrand(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
      const path = `brands/${timestamp}-${safeName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from('about-images').upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage.from('about-images').getPublicUrl(path);

      // Add to database
      await addBrandMutation.mutateAsync({
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        logoUrl: urlData.publicUrl,
        logoKey: path,
      });
    } catch (err: any) {
      console.error('Brand upload error:', err);
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploadingBrand(false);
    }
  };

  // Handle brand reorder
  const handleBrandReorder = (reorderedBrands: Brand[]) => {
    const updatedBrands = reorderedBrands.map((brand, idx) => ({ ...brand, sortOrder: idx }));
    setLocalBrands(updatedBrands);
    setHasBrandChanges(true);
  };

  // Handle brand remove
  const handleBrandRemove = async (id: number) => {
    const brand = localBrands.find((b) => b.id === id);
    if (!brand) return;

    // Delete from storage if we have the key
    if (brand.logoKey) {
      try {
        await supabase.storage.from('about-images').remove([brand.logoKey]);
      } catch (e) {
        console.warn('Could not delete brand logo from storage:', e);
      }
    }

    await deleteBrandMutation.mutateAsync({ id });
    setLocalBrands((prev) => prev.filter((b) => b.id !== id));
  };

  // Handle brand metadata update
  const handleBrandUpdate = useCallback(
    (id: number, field: 'name' | 'websiteUrl', value: string) => {
      // Update local state immediately for responsive UI
      setLocalBrands((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));

      // Clear any existing timer for this field on this brand
      const timerKey = `${id}-${field}`;
      if (brandTimersRef.current[timerKey]) {
        clearTimeout(brandTimersRef.current[timerKey]);
      }

      // Set new debounced timer
      brandTimersRef.current[timerKey] = setTimeout(() => {
        console.log(`[handleBrandUpdate] Saving ${field} for brand ${id}:`, value);
        updateBrandMutation.mutate({ id, [field]: value });
        delete brandTimersRef.current[timerKey];
      }, 500);
    },
    [updateBrandMutation]
  );

  // Save brand order changes
  const handleSaveBrandOrder = async () => {
    const orderUpdates = localBrands.map((brand) => ({
      id: brand.id,
      sortOrder: brand.sortOrder,
    }));
    await brandOrderMutation.mutateAsync(orderUpdates);
  };

  // Handle manage images
  const handleManageImages = (projectId: number, title: string) => {
    setManagingProject({ id: projectId, title });
  };

  if (isLoading || brandsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container max-w-4xl py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Experiential Portfolio</h1>
            <p className="text-muted-foreground">
              Manage workflow showcase images, portfolio galleries, and brands
            </p>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button onClick={handleSaveOrder} disabled={orderMutation.isPending}>
                {orderMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Gallery Order
              </Button>
            )}
            {hasBrandChanges && (
              <Button onClick={handleSaveBrandOrder} disabled={brandOrderMutation.isPending}>
                {brandOrderMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Brand Order
              </Button>
            )}
          </div>
        </div>

        {/* Workflow Showcase Section */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Showcase (4 Steps)</CardTitle>
            <CardDescription>Single image per workflow step - displayed as process overview</CardDescription>
          </CardHeader>
          <Tabs value={activeWorkflowTab} onValueChange={(v) => setActiveWorkflowTab(v as ProcessCategory)}>
            <CardHeader className="pb-0 pt-0">
              <TabsList className="grid grid-cols-4 w-full">
                {Object.keys(WORKFLOW_CATEGORIES).map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="text-xs">
                    {WORKFLOW_CATEGORIES[cat].label.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              {Object.keys(WORKFLOW_CATEGORIES).map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-0">
                  <CategorySection
                    category={cat as ProcessCategory}
                    items={getItemsByCategory(cat as ProcessCategory)}
                    onReorder={(items) => handleReorder(cat as ProcessCategory, items)}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                    onAddImage={handleAddImage}
                    onAddVideoUrl={handleAddVideoUrl}
                    isUploading={uploadingCategory === cat}
                    onManageImages={handleManageImages}
                    onUpdateProject={handleUpdateProject}
                  />
                </TabsContent>
              ))}
            </CardContent>
          </Tabs>
        </Card>

        {/* Portfolio Galleries Section */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Galleries</CardTitle>
            <CardDescription>Multiple images per gallery - displayed as card grids with modal viewing</CardDescription>
          </CardHeader>
          <Tabs value={activeGalleryTab} onValueChange={(v) => setActiveGalleryTab(v as ProcessCategory)}>
            <CardHeader className="pb-0 pt-0">
              <TabsList className="grid grid-cols-3 w-full">
                {Object.keys(GALLERY_CATEGORIES).map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="text-xs">
                    {GALLERY_CATEGORIES[cat].label.replace(' Gallery', '')}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            <CardContent className="pt-6">
              {Object.keys(GALLERY_CATEGORIES).map((cat) => (
                <TabsContent key={cat} value={cat} className="mt-0">
                  <CategorySection
                    category={cat as ProcessCategory}
                    items={getItemsByCategory(cat as ProcessCategory)}
                    onReorder={(items) => handleReorder(cat as ProcessCategory, items)}
                    onRemove={handleRemove}
                    onUpdate={handleUpdate}
                    onAddImage={handleAddImage}
                    onAddVideoUrl={handleAddVideoUrl}
                    isUploading={uploadingCategory === cat}
                    onManageImages={handleManageImages}
                    onUpdateProject={handleUpdateProject}
                  />
                </TabsContent>
              ))}
            </CardContent>
          </Tabs>
        </Card>

        {/* Brands Section */}
        <Card>
          <CardHeader>
            <CardTitle>Brands Banner</CardTitle>
            <CardDescription>Upload client and partner brand logos for the marquee banner</CardDescription>
          </CardHeader>
          <CardContent>
            <BrandsSection
              brands={localBrands}
              onReorder={handleBrandReorder}
              onRemove={handleBrandRemove}
              onUpdate={handleBrandUpdate}
              onAddBrand={handleAddBrand}
              isUploading={uploadingBrand}
            />
          </CardContent>
        </Card>
      </div>

      {/* Gallery Image Manager Modal */}
      {managingProject && (
        <AdminGalleryImageManager
          isOpen={true}
          projectId={managingProject.id}
          projectTitle={managingProject.title}
          onClose={() => setManagingProject(null)}
        />
      )}
    </AdminLayout>
  );
}
