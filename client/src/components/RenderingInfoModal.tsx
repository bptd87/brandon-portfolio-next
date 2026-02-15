import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ProjectImage {
    id: number;
    url: string;
    caption?: string | null;
    altText?: string | null;
}

interface RenderingProject {
    id: number;
    title: string;
    imageUrl: string | null;
    altText: string | null;
    slug: string;
    year: number | null;
    venue?: string | null;
    client?: string | null;
    designNotes?: string | null;
    excerpt?: string | null;
    description?: string | null;
    images?: ProjectImage[];
}

interface RenderingInfoModalProps {
    isOpen: boolean;
    project: RenderingProject | null;
    onClose: () => void;
    onNext: () => void; // Next Project
    onPrev: () => void; // Prev Project
    hasNext: boolean;
    hasPrev: boolean;
}

export function RenderingInfoModal({
    isOpen,
    project,
    onClose,
    onNext,
    onPrev,
    hasNext,
    hasPrev,
}: RenderingInfoModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Reset image index when project changes
    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project?.id]);

    // Combine main cover image with gallery images if valid
    const allImages = project ? [
        {
            id: -1, // cover
            url: project.imageUrl || '',
            altText: project.altText,
            caption: null
        },
        ...(project.images || [])
    ].filter(img => img.url) : [];

    // Use fallback if no images found
    const displayImages = allImages.length > 0 ? allImages : [{ id: 0, url: '', altText: 'No image', caption: null }];
    const currentImage = displayImages[currentImageIndex] || displayImages[0];
    const totalImages = displayImages.length;

    const handleNextImage = useCallback(() => {
        if (currentImageIndex < totalImages - 1) {
            setCurrentImageIndex(prev => prev + 1);
        } else if (hasNext) {
            onNext();
        }
    }, [currentImageIndex, totalImages, hasNext, onNext]);

    const handlePrevImage = useCallback(() => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
        } else if (hasPrev) {
            onPrev();
        }
    }, [currentImageIndex, hasPrev, onPrev]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') handlePrevImage();
            if (e.key === 'ArrowRight') handleNextImage();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleNextImage, handlePrevImage, onClose]);

    if (!project) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent showCloseButton={false} className="max-w-none w-screen h-screen sm:max-w-none md:max-w-none p-0 m-0 rounded-none bg-black/98 backdrop-blur-xl border-none overflow-hidden flex flex-col shadow-none outline-none">
                <DialogTitle className="sr-only">{project.title}</DialogTitle>

                {/* Top Controls (Close Only) */}
                <div className="absolute top-0 right-0 z-[60] p-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all h-12 w-12"
                        title="Close Gallery"
                    >
                        <X className="h-6 w-6" />
                    </Button>
                </div>

                {/* Main Content: Flex Column */}
                <div className="flex-1 w-full h-full flex flex-col relative">

                    {/* Stage: Image & Arrows (Flex-1 to take available space) */}
                    <div className="flex-1 relative flex items-center justify-center min-h-0 p-4 md:p-8 pb-32"> {/* pb-32 leaves room for thumbnails/metadata if needed */}

                        {/* Prev Arrow */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                            aria-label="Previous image"
                            className="absolute left-4 md:left-8 z-50 p-4 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 hover:scale-110 transition-all outline-none"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        {/* Main Image Container */}
                        <div className="relative w-full h-full flex flex-col items-center justify-center gap-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImage.url}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="relative max-w-full max-h-full flex flex-col items-center justify-center"
                                >
                                    {currentImage.url && (
                                        <img
                                            src={currentImage.url}
                                            alt={currentImage.altText || project.title}
                                            className="max-w-[80vw] max-h-[55vh] w-auto h-auto object-contain rounded-xl shadow-2xl ring-1 ring-white/10"
                                        />
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Prominent Image Description/Caption */}
                            <div className="max-w-3xl text-center space-y-2 z-50 px-4">
                                {currentImage.caption ? (
                                    <p className="text-white text-lg md:text-xl font-light leading-relaxed">
                                        "{currentImage.caption}"
                                    </p>
                                ) : (
                                    <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                                        {/* Fallback to project description or generic text if no specific image caption */}
                                        {project.description || project.designNotes || ""}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Next Arrow */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                            aria-label="Next image"
                            className="absolute right-4 md:right-8 z-50 p-4 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 hover:scale-110 transition-all outline-none"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Bottom Strip: Thumbnails & Metadata */}
                    <div className="h-auto bg-black/40 border-t border-white/5 backdrop-blur-md p-6 flex flex-col gap-4 z-40">

                        {/* Thumbnails (Only if > 1 image) */}
                        {totalImages > 1 && (
                            <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 no-scrollbar">
                                {displayImages.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={cn(
                                            "relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden transition-all border-2",
                                            currentImageIndex === idx
                                                ? "border-white scale-105 opacity-100"
                                                : "border-transparent opacity-50 hover:opacity-80"
                                        )}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Footer: Project Nav & Info (Simplified) */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full text-sm">

                            {/* Left: Project Nav */}
                            <div className="flex items-center gap-6">
                                <button
                                    onClick={onPrev}
                                    disabled={!hasPrev}
                                    className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-30 transition-colors uppercase tracking-wider font-medium"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev Project
                                </button>
                                <span className="text-white/20">|</span>
                                <h3 className="text-white font-bold text-lg">{project.title}</h3>
                                <span className="text-white/20">|</span>
                                <button
                                    onClick={onNext}
                                    disabled={!hasNext}
                                    className="flex items-center gap-2 text-white/50 hover:text-white disabled:opacity-30 transition-colors uppercase tracking-wider font-medium"
                                >
                                    Next Project <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Right: Caption/Counter */}
                            <div className="text-white/60 flex items-center gap-4 text-xs tracking-wider">
                                {currentImage.caption && <span className="italic">"{currentImage.caption}"</span>}
                                <span className="px-2 py-1 bg-white/10 rounded">{currentImageIndex + 1} / {totalImages}</span>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
