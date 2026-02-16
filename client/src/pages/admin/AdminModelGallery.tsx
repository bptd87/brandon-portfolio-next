import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGalleryImageManager } from "@/components/admin/AdminGalleryImageManager";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, GripVertical, Plus, Trash2, Save, Image as ImageIcon, UploadCloud, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent,
    DragStartEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

// Simple slugify helper
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-');  // Replace multiple - with single -
};

// --- Sortable Item Component ---
interface SortableItemProps {
    id: number;
    item: any;
    onRemove: (id: number) => void;
    onManageImages: (id: number, title: string) => void;
    onUpdateMetadata: (id: number, field: 'altText' | 'displayTitle', value: string) => void;
    onUpdateProject?: (projectId: number, field: 'title' | 'slug' | 'year', value: string | number | null) => void;
}

function SortableGalleryItem({ id, item, onRemove, onManageImages, onUpdateMetadata, onUpdateProject }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const [isOpen, setIsOpen] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-card border rounded-lg p-3 mb-2 flex flex-col gap-3 shadow-sm"
        >
            <div className="flex items-start gap-3">
                <div {...attributes} {...listeners} className="mt-1 cursor-move text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="h-16 w-24 flex-shrink-0 bg-muted rounded overflow-hidden">
                    {item.project?.coverImageUrl ? (
                        <img
                            src={item.project.coverImageUrl}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">{item.project?.title || "Unknown Project"}</h4>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => onManageImages(item.project.id, item.project.title)}
                            title="Manage Gallery Images"
                        >
                            <ImageIcon className="h-4 w-4" />
                        </Button>
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
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{item.project?.client || item.project?.location}</p>
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
                                    onChange={(e) => onUpdateProject?.(item.project.id, 'title', e.target.value)}
                                    placeholder="Project name..."
                                    className="h-8 text-xs bg-background/50"
                                />
                            </div>
                            <div className="grid gap-1 pb-2 border-b border-border">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">URL Slug</label>
                                <Input
                                    value={item.project.slug || ''}
                                    onChange={(e) => onUpdateProject?.(
                                        item.project.id,
                                        'slug',
                                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                                    )}
                                    placeholder="url-slug..."
                                    className="h-8 text-xs bg-background/50 font-mono"
                                />
                                <p className="text-[9px] text-muted-foreground/60 mt-1">
                                    Preview: /projects/{item.project.slug || 'url-slug'}
                                </p>
                            </div>
                            <div className="grid gap-1">
                                <label className="text-[10px] font-medium uppercase text-muted-foreground">Year</label>
                                <Input
                                    type="number"
                                    value={item.project.year ?? ''}
                                    onChange={(e) => onUpdateProject?.(
                                        item.project.id,
                                        'year',
                                        e.target.value ? parseInt(e.target.value, 10) : null
                                    )}
                                    placeholder="YYYY"
                                    className="h-8 text-xs bg-background/50"
                                />
                            </div>
                        </>
                    )}
                    <div className="grid gap-1">
                        <label className="text-[10px] font-medium uppercase text-muted-foreground">Display Title (Optional)</label>
                        <Input
                            value={item.displayTitle || ''}
                            onChange={(e) => onUpdateMetadata(item.id, 'displayTitle', e.target.value)}
                            placeholder="Title shown on gallery item"
                            className="h-8 text-xs bg-background/50"
                        />
                    </div>
                    <div className="grid gap-1">
                        <label className="text-[10px] font-medium uppercase text-muted-foreground">SEO Alt Text (Critical)</label>
                        <Input
                            value={item.altText || ''}
                            onChange={(e) => onUpdateMetadata(item.id, 'altText', e.target.value)}
                            placeholder="Describe image for SEO..."
                            className="h-8 text-xs bg-background/50"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Page Component ---
export default function AdminModelGallery() {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [localGallery, setLocalGallery] = useState<any[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [managingProject, setManagingProject] = useState<{ id: number, title: string } | null>(null);

    // Quick Add State
    const [quickFile, setQuickFile] = useState<File | null>(null);
    const [quickPreview, setQuickPreview] = useState<string | null>(null);
    const [quickTitle, setQuickTitle] = useState("");
    const [quickYear, setQuickYear] = useState(new Date().getFullYear().toString());
    const [quickAltText, setQuickAltText] = useState("");
    const [quickDesignNotes, setQuickDesignNotes] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    // Queries
    const { data: projects, isLoading: projectsLoading, refetch: refetchProjects } = trpc.projects.list.useQuery({
        discipline: 'scenic_models',
    });

    const { data: galleryItems, isLoading: galleryLoading, refetch: refetchGallery } = trpc.modelGallery.list.useQuery();

    // Mutations
    const createProjectMutation = trpc.projects.create.useMutation();

    // Check if add mutation exists, if often used
    const addMutation = trpc.modelGallery.add.useMutation({
        onSuccess: () => {
            toast.success("Project added to gallery");
            refetchGallery();
            refetchProjects();
        }
    });

    const removeMutation = trpc.modelGallery.remove.useMutation({
        onSuccess: () => {
            toast.success("Project removed from gallery");
            refetchGallery();
            refetchProjects();
        }
    });

    const reorderMutation = trpc.modelGallery.updateOrder.useMutation({
        onSuccess: () => {
            setHasChanges(false);
            toast.success("Order saved");
        }
    });

    const updateMetaMutation = trpc.modelGallery.updateMetadata.useMutation();
    const signedUrlMutation = trpc.projects.createSignedUploadUrl.useMutation();
    const updateProjectMutation = trpc.projects.update.useMutation({
        onSuccess: () => {
            toast.success("Project updated");
            refetchGallery();
            refetchProjects();
        },
        onError: (e) => {
            toast.error(`Failed to update project: ${e.message}`);
        }
    });

    // Sync local state when remote data loads
    useEffect(() => {
        if (galleryItems) {
            setLocalGallery(galleryItems);
        }
    }, [galleryItems]);

    // Sensors for DnD (List)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // --- Handlers ---

    // File Drag & Drop Handlers
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingFile(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingFile(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingFile(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        setQuickFile(file);
        setQuickPreview(URL.createObjectURL(file));

        // Auto-fill title from filename if empty
        if (!quickTitle) {
            const name = file.name.replace(/\.[^/.]+$/, "").replace(/-/g, " ");
            const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
            setQuickTitle(formattedName);
        }
    };

    const handleUpdateProject = useCallback((projectId: number, field: 'title' | 'slug' | 'year', value: string | number | null) => {
        setLocalGallery((prev) =>
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

        updateProjectMutation.mutate({ id: projectId, [field]: value });
    }, [updateProjectMutation]);

    const handleQuickAdd = async () => {
        if (!quickFile || !quickTitle) return;

        setIsUploading(true);
        try {
            // 1. Upload Image via Signed URL
            const fileExt = quickFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `model-gallery/${fileName}`;

            // Get signed URL
            const { signedUrl, token, path } = await signedUrlMutation.mutateAsync({
                bucket: 'portfolio',
                path: filePath
            });

            // Upload via signed URL
            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .uploadToSignedUrl(path, token, quickFile);

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('portfolio')
                .getPublicUrl(filePath);

            // 2. Create Hidden Project
            const projectResult = await createProjectMutation.mutateAsync({
                title: quickTitle,
                slug: slugify(quickTitle) + '-' + Math.random().toString(36).substring(2, 7),
                year: parseInt(quickYear) || new Date().getFullYear(),
                status: 'gallery_only',
                discipline: 'scenic_models',
                coverImageUrl: publicUrl,
                designNotes: quickDesignNotes, // Now saving project details
            });

            // 3. Add to Gallery with Alt Text
            await addMutation.mutateAsync({
                projectId: projectResult.id,
                altText: quickAltText,
                displayTitle: quickTitle // Default display title to project title
            });

            // Reset
            setQuickFile(null);
            setQuickPreview(null);
            setQuickTitle("");
            setQuickAltText("");
            setQuickDesignNotes("");
            toast.success("Image uploaded & added to gallery!");

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to add image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setLocalGallery((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Trigger save immediately for order
                const orderUpdates = newItems.map((item, index) => ({
                    id: item.id,
                    sortOrder: index
                }));
                reorderMutation.mutate(orderUpdates);

                return newItems;
            });
        }
        setActiveId(null);
    };

    const handleAdd = (projectId: number) => {
        if (localGallery.some(item => item.projectId === projectId)) {
            toast.error("Already in gallery");
            return;
        }
        addMutation.mutate({ projectId });
    };

    const handleRemove = (id: number) => {
        removeMutation.mutate({ id });
    };

    const handleUpdateMetadata = (id: number, field: 'altText' | 'displayTitle', value: string) => {
        setLocalGallery(prev => prev.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    // Custom Debounce for metadata updates
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!galleryItems) return;
            localGallery.forEach(localItem => {
                const original = galleryItems.find(g => g.id === localItem.id);
                if (original && (original.altText !== localItem.altText || original.displayTitle !== localItem.displayTitle)) {
                    updateMetaMutation.mutate({
                        id: localItem.id,
                        active: true,
                        altText: localItem.altText,
                        displayTitle: localItem.displayTitle
                    });
                }
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [localGallery, galleryItems]);


    if (projectsLoading || galleryLoading) {
        return (
            <AdminLayout title="Model Gallery" description="Loading...">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    // Filter available projects (not in gallery)
    const availableProjects = projects?.filter(p => !localGallery.some(g => g.projectId === p.id)) || [];

    return (
        <AdminLayout
            title="Model Portfolio Gallery"
            description="Curate the SEO landing page gallery for Scenic Models. Add new images directly or select existing projects."
        >
            <div className="space-y-8 pb-20">

                {/* 1. Quick Add Section */}
                <Card className={`border-2 transition-colors ${isDraggingFile ? 'border-primary bg-primary/10 border-dashed' : 'border-dashed bg-muted/20'}`}>
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" /> Quick Add Image
                        </CardTitle>
                        <CardDescription>
                            Drag & drop an image here to start. We'll handle the project creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent
                        className="p-6"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            {/* Image Preview / Upload */}
                            <div
                                className={`w-40 h-40 flex-shrink-0 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group ${isDraggingFile ? 'scale-105 border-primary' : ''}`}
                                onClick={() => document.getElementById('quick-file')?.click()}
                            >
                                {quickPreview ? (
                                    <>
                                        <img src={quickPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium">Change</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-2">
                                        {isDraggingFile ? (
                                            <UploadCloud className="h-8 w-8 mx-auto text-primary mb-2 animate-bounce" />
                                        ) : (
                                            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        )}
                                        <p className="text-xs text-muted-foreground font-medium">
                                            {isDraggingFile ? "Drop it!" : "Upload / Drop Image"}
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="quick-file"
                                    className="hidden"
                                    accept="image/*"
                                    aria-label="Upload image file"
                                    onChange={handleFileSelect}
                                />
                            </div>

                            {/* Info Inputs */}
                            <div className="flex-1 grid gap-4 w-full max-w-xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            placeholder="Project Title"
                                            value={quickTitle}
                                            onChange={(e) => setQuickTitle(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium">Year</label>
                                        <Input
                                            placeholder="YYYY"
                                            value={quickYear}
                                            onChange={(e) => setQuickYear(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">SEO Alt Text</label>
                                    <Input
                                        placeholder="Describe image for SEO..."
                                        value={quickAltText}
                                        onChange={(e) => setQuickAltText(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Project Details (Design Notes)</label>
                                    <Textarea
                                        placeholder="Add details about the scale model, materials used, etc..."
                                        value={quickDesignNotes}
                                        onChange={(e) => setQuickDesignNotes(e.target.value)}
                                        className="bg-background min-h-[80px]"
                                    />
                                </div>

                                <Button
                                    onClick={handleQuickAdd}
                                    disabled={!quickFile || !quickTitle || isUploading}
                                    className="w-full md:w-auto mt-2"
                                >
                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Add to Gallery
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[calc(100vh-400px)]">

                    {/* Left Column: Active Gallery */}
                    <Card className="flex flex-col h-full overflow-hidden border-primary/20 bg-primary/5">
                        <CardHeader className="pb-3 border-b bg-card">
                            <CardTitle className="flex items-center justify-between">
                                <span>Active Gallery</span>
                                <Badge variant="secondary">{localGallery.length} Items</Badge>
                            </CardTitle>
                            <CardDescription>
                                Drag to reorder.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 bg-muted/20">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={localGallery.map(item => item.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {localGallery.length === 0 ? (
                                        <div className="text-center py-12 text-muted-foreground bg-card border border-dashed rounded-lg">
                                            Your gallery is empty.<br />Add projects from the right.
                                        </div>
                                    ) : (
                                        localGallery.map(item => (
                                            <SortableGalleryItem
                                                key={item.id}
                                                id={item.id}
                                                item={item}
                                                onRemove={handleRemove}
                                                onManageImages={(pid, title) => setManagingProject({ id: pid, title })}
                                                onUpdateMetadata={handleUpdateMetadata}
                                                onUpdateProject={handleUpdateProject}
                                            />
                                        ))
                                    )}
                                </SortableContext>

                                <DragOverlay>
                                    {activeId ? (
                                        <div className="bg-card border rounded-lg p-3 shadow-xl opacity-90 rotate-2">
                                            {/* Simplified representation while dragging */}
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-16 bg-muted rounded"></div>
                                                <div className="font-semibold">Dragging Item...</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </CardContent>
                    </Card>

                    {/* Right Column: Available Projects */}
                    <Card className="flex flex-col h-full overflow-hidden">
                        <CardHeader className="pb-3 border-b">
                            <CardTitle className="flex items-center justify-between">
                                <span>Existing Projects</span>
                                <Badge variant="outline">{availableProjects.length}</Badge>
                            </CardTitle>
                            <CardDescription>
                                Add existing projects that aren't in the gallery.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4">
                            <div className="grid gap-2">
                                {availableProjects.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground">
                                        All available projects are in the gallery.
                                    </div>
                                ) : (
                                    availableProjects.map(project => (
                                        <div key={project.id} className="bg-card border rounded-lg p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors">
                                            <div className="h-12 w-16 flex-shrink-0 bg-muted rounded overflow-hidden">
                                                {project.coverImageUrl ? (
                                                    <img src={project.coverImageUrl} alt="" className="w-full h-full object-cover" />
                                                ) : null}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{project.title}</h4>
                                                <p className="text-xs text-muted-foreground truncate">{project.year} • {project.status}</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => handleAdd(project.id)}
                                            >
                                                <Plus className="h-4 w-4 mr-1" /> Add
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>

            {managingProject && (
                <AdminGalleryImageManager
                    projectId={managingProject.id}
                    projectTitle={managingProject.title}
                    isOpen={!!managingProject}
                    onClose={() => setManagingProject(null)}
                />
            )}
        </AdminLayout>
    );
}
