import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Save, GripVertical, Image as ImageIcon, X, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { uploadImage as uploadToStorage } from "@/utils/storageUtils";

interface AdminGalleryImageManagerProps {
    projectId: number;
    projectTitle: string;
    isOpen: boolean;
    onClose: () => void;
}

interface ProjectImage {
    id: number;
    projectId: number;
    title: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    caption: string | null;
    altText: string | null;
    imageType: "production" | "rendering" | "technical_drawing" | "video";
    sortOrder: number;
}

// Removed duplicate imports


// --- Sortable Image Item ---
function SortableImageItem({
    image,
    onRemove,
    onUpdate
}: {
    image: ProjectImage;
    onRemove: (id: number) => void;
    onUpdate: (id: number, updates: Partial<ProjectImage>) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });
    const [isOpen, setIsOpen] = useState(false); // Collapsible state

    // Local state for debouncing
    const [title, setTitle] = useState(image.title || "");
    const [caption, setCaption] = useState(image.caption || "");
    const [altText, setAltText] = useState(image.altText || "");

    // Sync upstream changes to local state
    useEffect(() => { setTitle(image.title || ""); }, [image.title]);
    useEffect(() => { setCaption(image.caption || ""); }, [image.caption]);
    useEffect(() => { setAltText(image.altText || ""); }, [image.altText]);

    // Debounce updates
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title !== (image.title || "")) onUpdate(image.id, { title });
        }, 1000);
        return () => clearTimeout(timer);
    }, [title, image.id, image.title, onUpdate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (caption !== (image.caption || "")) onUpdate(image.id, { caption });
        }, 1000);
        return () => clearTimeout(timer);
    }, [caption, image.id, image.caption, onUpdate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (altText !== (image.altText || "")) onUpdate(image.id, { altText });
        }, 1000);
        return () => clearTimeout(timer);
    }, [altText, image.id, image.altText, onUpdate]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="border rounded-lg bg-card mb-2 shadow-sm overflow-hidden">
            {/* Header / Summary View */}
            <div className="flex items-center gap-3 p-3 bg-muted/20">
                <div {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="h-5 w-5" />
                </div>

                <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                    {image.imageUrl ? (
                        <img src={image.imageUrl} alt={image.altText || ""} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-[10px]">No Img</div>
                    )}
                </div>

                <div className="flex-1 min-w-0" onClick={() => setIsOpen(!isOpen)}>
                    <h4 className="font-medium text-sm truncate cursor-pointer select-none">
                        {title || <span className="text-muted-foreground italic">Untitled Image</span>}
                    </h4>
                    {!isOpen && (
                        <p className="text-xs text-muted-foreground truncate">
                            {caption ? caption.substring(0, 50) + (caption.length > 50 ? "..." : "") : "No description"}
                        </p>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                    className="h-8 w-8 p-0"
                >
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(image.id)}
                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
                    title="Remove image"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Expanded Content */}
            {isOpen && (
                <div className="p-4 border-t bg-muted/10 grid gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid gap-2">
                        <Label htmlFor={`title-${image.id}`}>Title</Label>
                        <Input
                            id={`title-${image.id}`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Image Title"
                            className="bg-background"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor={`caption-${image.id}`}>Description / Caption</Label>
                        <Textarea
                            id={`caption-${image.id}`}
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Detailed description or caption..."
                            className="h-24 text-sm bg-background"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor={`alt-${image.id}`}>Alt Text (for Accessibility)</Label>
                        <Input
                            id={`alt-${image.id}`}
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe image content..."
                            className="text-sm bg-background"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export function AdminGalleryImageManager({ projectId, projectTitle, isOpen, onClose }: AdminGalleryImageManagerProps) {
    const utils = trpc.useContext();
    const [images, setImages] = useState<ProjectImage[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDraggingFile, setIsDraggingFile] = useState(false);

    // Fetch Images
    const { data: fetchedImages, isLoading } = trpc.projects.getImages.useQuery(
        { projectId },
        { enabled: !!projectId && isOpen }
    );

    useEffect(() => {
        if (fetchedImages) {
            setImages(fetchedImages as ProjectImage[]);
        }
    }, [fetchedImages]);

    // Mutations
    const addImageMutation = trpc.projects.addImage.useMutation();
    const updateImageMutation = trpc.projects.updateImage.useMutation();
    const deleteImageMutation = trpc.projects.deleteImage.useMutation();
    const reorderImagesMutation = trpc.projects.reorderImages.useMutation();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // Handlers
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setImages((items) => {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);
            const newOrder = arrayMove(items, oldIndex, newIndex);

            // Optimistic Update
            const orderUpdates = newOrder.map((item, index) => ({
                id: item.id,
                sortOrder: index
            }));

            // Fire and forget (or handle error)
            reorderImagesMutation.mutate(orderUpdates);

            return newOrder;
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            // Upload to Supabase Storage
            for (const file of Array.from(files)) {
                const uploadRes = await uploadToStorage(file, 'portfolio');

                await addImageMutation.mutateAsync({
                    projectId,
                    imageUrl: uploadRes.url,
                    imageKey: uploadRes.key,
                    imageType: "rendering", // Default to rendering for this gallery
                    sortOrder: images.length, // Add to end
                });
            }
            toast.success("Images uploaded successfully");
            utils.projects.getImages.invalidate({ projectId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload images");
        } finally {
            setIsUploading(false);
            // Clear input
            e.target.value = "";
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(true);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Only set to false if leaving the drop zone itself
        if (e.currentTarget === e.target) {
            setIsDraggingFile(false);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingFile(false);

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length === 0) {
            toast.error("Please drop image files only");
            return;
        }

        setIsUploading(true);
        try {
            for (const file of files) {
                const uploadRes = await uploadToStorage(file, 'portfolio');

                await addImageMutation.mutateAsync({
                    projectId,
                    imageUrl: uploadRes.url,
                    imageKey: uploadRes.key,
                    imageType: "rendering",
                    sortOrder: images.length,
                });
            }
            toast.success("Images uploaded successfully");
            utils.projects.getImages.invalidate({ projectId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload images");
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateImage = async (id: number, updates: Partial<ProjectImage>) => {
        // Optimistic update local state
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...updates } : img));

        // Debounce actual API call? Or just blur?
        // For simplicity, calling update on every change might be too much for text inputs.
        // But for this "Manager" modal, maybe we only save on blur or valid change.
        // Let's implement individual update for now.
        try {
            const cleanUpdates = {
                ...updates,
                title: updates.title ?? undefined,
                caption: updates.caption ?? undefined,
                altText: updates.altText ?? undefined,
            };
            await updateImageMutation.mutateAsync({
                id,
                ...cleanUpdates
            });
        } catch (e) {
            toast.error("Failed to save changes");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this image?")) return;
        try {
            await deleteImageMutation.mutateAsync({ id });
            setImages(prev => prev.filter(img => img.id !== id));
            toast.success("Image deleted");
        } catch (e) {
            toast.error("Failed to delete image");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle>Manage Gallery Images: {projectTitle}</DialogTitle>
                    <DialogDescription>
                        Add, remove, reorder, and edit details for images in this project.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto py-4 px-1">
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <div className="space-y-4">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext items={images.map(i => i.id)} strategy={verticalListSortingStrategy}>
                                    {images.map((image) => (
                                        <SortableImageItem
                                            key={image.id}
                                            image={image}
                                            onRemove={handleDelete}
                                            onUpdate={handleUpdateImage}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>

                            {images.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                                    <ImageIcon className="mx-auto h-12 w-12 opacity-50 mb-2" />
                                    <p>No extra images in this gallery.</p>
                                    <p className="text-sm">Upload images to enable the "Gallery-in-Gallery"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t flex items-center justify-between bg-background">
                    <div 
                        className={`flex-1 flex items-center gap-2 mr-4 p-4 border-2 border-dashed rounded-lg transition-colors ${
                            isDraggingFile 
                                ? 'border-primary bg-primary/5' 
                                : 'border-muted-foreground/25 hover:border-primary/50'
                        }`}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            id="gallery-image-upload"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                        />
                        <Label
                            htmlFor="gallery-image-upload"
                            className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                            title="Upload images"
                        >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                            Upload Images
                        </Label>
                        <span className="text-xs text-muted-foreground">
                            {isDraggingFile ? 'Drop images here to upload' : 'Drag & drop images or click to browse'}
                        </span>
                    </div>

                    <Button variant="outline" onClick={onClose} title="Close">Done</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
