import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";
import { getProjectPath } from "@/lib/projectRoutes";

interface GalleryProject {
    id: number;
    title: string;
    imageUrl: string | null;
    altText: string | null;
    slug: string;
    year: number | null;
    discipline?: string | null;
    venue?: string | null;
    client?: string | null;
    designNotes?: string | null;
    excerpt?: string | null;
}

interface GalleryInfoModalProps {
    isOpen: boolean;
    project: GalleryProject | null;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
    hasNext: boolean;
    hasPrev: boolean;
}

export function GalleryInfoModal({
    isOpen,
    project,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}: GalleryInfoModalProps) {
    if (!project) return null;

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') onPrev();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onNext, onPrev, onClose]);

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 bg-background/95 backdrop-blur-xl border-none overflow-hidden flex flex-col md:flex-row shadow-2xl">

                {/* Close Button - Absolute to be accessible */}
                <button
                    onClick={onClose}
                    aria-label="Close gallery modal"
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* IMAGE SECTION (Main Focus) */}
                <div className="flex-1 relative bg-black flex items-center justify-center h-[50vh] md:h-full select-none">
                    {project.imageUrl ? (
                        <div className="relative w-full h-full p-4 md:p-8">
                            <img
                                src={project.imageUrl}
                                alt={project.altText || project.title}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </div>
                    ) : (
                        <div className="text-muted-foreground">No Image Available</div>
                    )}

                    {/* Navigation Overlay (Desktop) */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md h-12 w-12 pointer-events-auto transition-opacity ${!hasPrev ? 'opacity-0 pointer-events-none' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onPrev();
                            }}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md h-12 w-12 pointer-events-auto transition-opacity ${!hasNext ? 'opacity-0 pointer-events-none' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onNext();
                            }}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </div>
                </div>

                {/* INFO PANEL (Sidebar) */}
                <div className="w-full md:w-[400px] lg:w-[450px] flex flex-col h-[50vh] md:h-full bg-background border-l border-border/50">
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">

                        {/* Header Info */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Link href={getProjectPath(project)} className="block group">
                                    <h2 className="text-3xl font-bold tracking-tight group-hover:underline decoration-primary decoration-2 underline-offset-4 cursor-pointer">{project.title}</h2>
                                </Link>
                                {project.year && (
                                    <p className="text-muted-foreground font-mono text-sm">{project.year}</p>
                                )}
                            </div>

                            {/* Metadata Grid */}
                            {(project.venue || project.client) && (
                                <div className="grid grid-cols-1 gap-2 text-sm text-foreground/80 py-4 border-y border-border/40">
                                    {project.venue && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            <span>{project.venue}</span>
                                        </div>
                                    )}
                                    {project.client && (
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-primary" />
                                            <span>{project.client}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Description / Story */}
                        <div className="prose prose-stone dark:prose-invert prose-sm leading-relaxed">
                            {project.designNotes ? (
                                <p className="whitespace-pre-line">{project.designNotes}</p>
                            ) : project.excerpt ? (
                                <p>{project.excerpt}</p>
                            ) : (
                                <p className="italic text-muted-foreground">No documentation available for this project.</p>
                            )}
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border bg-muted/20">
                        <Link href={getProjectPath(project)}>
                            <Button className="w-full gap-2" size="lg">
                                View Full Project Details
                            </Button>
                        </Link>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
}
