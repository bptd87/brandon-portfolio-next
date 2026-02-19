import React, { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGalleryImageManager } from "@/components/admin/AdminGalleryImageManager";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
    onUpdateMetadata: (id: number, field: 'altText' | 'displayTitle' | 'description', value: string) => void;
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
                        <div className="flex items-center gap-2 min-w-0">
                            <h4 className="font-semibold text-sm truncate">{item.project?.title || "Unknown Project"}</h4>
                            {item.project?.galleryOnly ? (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-orange-500/10 text-orange-700 border-orange-300 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-700 whitespace-nowrap">🖼️ Gallery Only</Badge>
                            ) : (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 bg-blue-500/10 text-blue-700 border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-700 whitespace-nowrap">📄 Full Page</Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
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
                            title="Remove from Gallery"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
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
                                    Preview: /projects/rendering/{item.project.slug || 'url-slug'}
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
                    <div className="grid gap-1">
                        <label className="text-[10px] font-medium uppercase text-muted-foreground">Description (Optional)</label>
                        <Textarea
                            value={item.description || ''}
                            onChange={(e) => onUpdateMetadata(item.id, 'description', e.target.value)}
                            placeholder="Gallery item description..."
                            className="min-h-[60px] text-xs bg-background/50"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Main Page Component ---
export default function AdminRenderingGallery() {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [localGallery, setLocalGallery] = useState<any[]>([]);
    const [managingProject, setManagingProject] = useState<{ id: number, title: string } | null>(null);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [quickAddType, setQuickAddType] = useState<'gallery' | 'fullPage'>('gallery');

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
    const { data: projects, isLoading: projectsLoading, refetch: refetchProjects } = trpc.renderingProjects.list.useQuery();

    const { data: galleryItems, isLoading: galleryLoading, refetch: refetchGallery } = trpc.renderingGallery.list.useQuery();

    // Mutations
    const createProjectMutation = trpc.renderingProjects.create.useMutation();

    // Check if add mutation exists, if often used
    const addMutation = trpc.renderingGallery.add.useMutation({
        onSuccess: () => {
            toast.success("Project added to gallery");
            refetchGallery();
            refetchProjects();
        }
    });

    const removeMutation = trpc.renderingGallery.remove.useMutation({
        onSuccess: () => {
            toast.success("Project removed from gallery");
            refetchGallery();
            refetchProjects();
        }
    });

    const reorderMutation = trpc.renderingGallery.updateOrder.useMutation({
        onSuccess: () => {
            refetchGallery();
            toast.success("Order saved");
        }
    });

    const updateMetaMutation = trpc.renderingGallery.updateMetadata.useMutation();
    const signedUrlMutation = trpc.projects.createSignedUploadUrl.useMutation();
    const updateProjectMutation = trpc.renderingProjects.update.useMutation({
        onSuccess: () => {
            toast.success("Project updated");
            refetchGallery();
            refetchProjects();
        },
        onError: (e) => {
            console.error('Project update error:', e);
            toast.error(`Failed to update project: ${e.message}`);
        }
    });

    const deleteProjectMutation = trpc.renderingProjects.delete.useMutation({
        onSuccess: () => {
            toast.success("Project deleted");
            refetchGallery();
            refetchProjects();
        },
        onError: (e) => {
            console.error('Project delete error:', e);
            toast.error(`Failed to delete project: ${e.message}`);
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
        console.log('Updating project', { projectId, field, value });
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
            const filePath = `rendering-gallery/${fileName}`;

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

            // 2. Create Project
            const projectResult = await createProjectMutation.mutateAsync({
                title: quickTitle,
                slug: slugify(quickTitle) + '-' + Math.random().toString(36).substring(2, 7),
                year: parseInt(quickYear) || new Date().getFullYear(),
                status: 'draft',
                galleryOnly: false, // All projects can have detail pages for SEO
                coverImageUrl: publicUrl,
                designNotes: quickDesignNotes,
            });

            // 3. If adding to gallery, add to rendering_gallery table
            if (quickAddType === 'gallery') {
                await addMutation.mutateAsync({
                    projectId: projectResult.id,
                    altText: quickAltText || quickTitle,
                    displayTitle: quickTitle
                });
            }

            // Reset form
            setQuickFile(null);
            setQuickPreview(null);
            setQuickTitle("");
            setQuickAltText("");
            setQuickDesignNotes("");
            setShowQuickAdd(false);
            
            toast.success(quickAddType === 'gallery' ? "Added to gallery!" : "Added to Selected Works!");
            refetchProjects();
            refetchGallery();

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create project");
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
                    sortOrder: index + 1 // 1-based sort order
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

    const handleUpdateMetadata = (id: number, field: 'altText' | 'displayTitle' | 'description', value: string) => {
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
                if (original && (original.altText !== localItem.altText || original.displayTitle !== localItem.displayTitle || original.description !== localItem.description)) {
                    updateMetaMutation.mutate({
                        id: localItem.id,
                        active: true,
                        altText: localItem.altText,

                        displayTitle: localItem.displayTitle,
                        description: localItem.description
                    });
                }
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [localGallery, galleryItems]);


    if (projectsLoading || galleryLoading) {
        return (
            <AdminLayout title="Rendering Gallery" description="Loading...">
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AdminLayout>
        );
    }

    // Full Page Projects = projects NOT in the gallery (these appear in "Selected Works" section)
    // Gallery items = projects IN rendering_gallery table (appear in "Archive & Exploration" grid)
    const galleryProjectIds = new Set(localGallery.map(g => g.projectId));
    const fullPageProjects = (projects?.filter(p => !galleryProjectIds.has(p.id)) || []).sort((a, b) => {
        if (b.year !== a.year) return (b.year || 0) - (a.year || 0);
        return (a.title || '').localeCompare(b.title || '');
    });

    return (
        <AdminLayout
            title="Rendering Portfolio"
            description="Manage gallery items and full project pages"
        >
            <div className="space-y-8 pb-20">

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Column: Gallery (Drag to Reorder) */}
                    <Card className="flex flex-col border-orange-200 dark:border-orange-800 bg-orange-50/20 dark:bg-orange-950/20">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-orange-500/20 text-orange-700 border-orange-400 dark:text-orange-400">🖼️</Badge>
                                        Gallery
                                        <Badge variant="secondary" className="ml-2">{localGallery.length}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-1">Archive & Exploration grid section</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-orange-600 hover:bg-orange-700"
                                    onClick={() => {
                                        setQuickAddType('gallery');
                                        setShowQuickAdd(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[600px]">
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
                                        <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                            No gallery items yet.<br />
                                            Click + to create one.
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
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-16 bg-muted rounded"></div>
                                                <div className="font-semibold">Dragging...</div>
                                            </div>
                                        </div>
                                    ) : null}
                                </DragOverlay>
                            </DndContext>
                        </CardContent>
                    </Card>

                    {/* Right Column: Full Page Projects */}
                    <Card className="flex flex-col border-blue-200 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20">
                        <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-blue-500/20 text-blue-700 border-blue-400 dark:text-blue-400">📄</Badge>
                                        Selected Works
                                        <Badge variant="secondary" className="ml-2">{fullPageProjects.length}</Badge>
                                    </CardTitle>
                                    <CardDescription className="mt-1">Featured projects shown at top of page</CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => {
                                        setQuickAddType('fullPage');
                                        setShowQuickAdd(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[600px]">
                            <div className="grid grid-cols-2 gap-4">
                                {fullPageProjects.length === 0 ? (
                                    <div className="col-span-2 text-center py-12 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                                        All projects are in gallery.<br />
                                        Click + to create a new one.
                                    </div>
                                ) : (
                                    fullPageProjects.map(project => (
                                        <div key={project.id} className="bg-card border border-blue-200/50 dark:border-blue-800/50 rounded-lg overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                                            {/* Image */}
                                            <div className="h-40 bg-muted overflow-hidden relative">
                                                {project.coverImageUrl ? (
                                                    <img src={project.coverImageUrl} alt={project.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-muted-foreground/20">
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Content */}
                                            <div className="flex-1 p-3 flex flex-col">
                                                <h4 className="font-medium text-sm mb-1">{project.title}</h4>
                                                <p className="text-xs text-muted-foreground mb-3">{project.year}</p>
                                                
                                                {/* Buttons */}
                                                <div className="flex gap-2 mt-auto">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="flex-1"
                                                        onClick={() => setManagingProject({ id: project.id, title: project.title })}
                                                        title="Edit project"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        onClick={() => {
                                                            if (confirm(`Delete "${project.title}"?`)) {
                                                                deleteProjectMutation.mutate({ id: project.id });
                                                            }
                                                        }}
                                                        title="Delete project"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                                                        onClick={() => {
                                                            addMutation.mutate({
                                                                projectId: project.id,
                                                                displayTitle: project.title,
                                                                altText: project.title
                                                            });
                                                        }}
                                                        title="Add to Gallery"
                                                    >
                                                        →
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>

            {/* Create Project Dialog */}
            <Dialog open={showQuickAdd} onOpenChange={setShowQuickAdd}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {quickAddType === 'gallery' ? '🖼️ Create Gallery Item' : '📄 Create Full Page Project'}
                        </DialogTitle>
                        <DialogDescription>
                            {quickAddType === 'gallery' 
                                ? 'Add to gallery grid (Archive & Exploration section)'
                                : 'Create featured project for Selected Works section'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title *</label>
                                <Input
                                    placeholder="Project Title"
                                    value={quickTitle}
                                    onChange={(e) => setQuickTitle(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Year</label>
                                <Input
                                    type="number"
                                    placeholder="YYYY"
                                    value={quickYear}
                                    onChange={(e) => setQuickYear(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image *</label>
                            <div
                                className="w-full h-40 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden group"
                                onClick={() => document.getElementById('dialog-file')?.click()}
                            >
                                {quickPreview ? (
                                    <>
                                        <img src={quickPreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-xs font-medium">Change Image</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-xs text-muted-foreground font-medium">Click to upload image</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    id="dialog-file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">SEO Alt Text</label>
                            <Input
                                placeholder="Describe image for SEO..."
                                value={quickAltText}
                                onChange={(e) => setQuickAltText(e.target.value)}
                            />
                        </div>

                        {quickAddType === 'fullPage' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Design Notes</label>
                                <Textarea
                                    placeholder="Add details about the project, rendering technique, software used, etc..."
                                    value={quickDesignNotes}
                                    onChange={(e) => setQuickDesignNotes(e.target.value)}
                                    className="min-h-[120px]"
                                />
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowQuickAdd(false)} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleQuickAdd}
                            disabled={!quickFile || !quickTitle || isUploading}
                            className={quickAddType === 'gallery' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create {quickAddType === 'gallery' ? 'Gallery Item' : 'Full Page'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {
                managingProject && (
                    <AdminGalleryImageManager
                        projectId={managingProject.id}
                        projectTitle={managingProject.title}
                        isOpen={!!managingProject}
                        onClose={() => setManagingProject(null)}
                    />
                )
            }
        </AdminLayout >
    );
}
