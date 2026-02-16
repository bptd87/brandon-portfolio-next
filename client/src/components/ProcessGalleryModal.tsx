import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getVideoEmbedUrl, getVideoThumbnail } from "@/lib/videoUtils";

interface ProjectImage {
  id: number;
  imageUrl: string;
  videoUrl?: string | null;
  altText: string | null;
  displayTitle: string | null;
  description: string | null;
}

interface ProcessGalleryModalProps {
  isOpen: boolean;
  currentImage: ProjectImage | undefined;
  currentProject?: any;
  images: ProjectImage[];
  imageIndex: number;
  projectIndex: number;
  totalProjects: number;
  onClose: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onNextProject: () => void;
  onPrevProject: () => void;
  canGoNextProject: boolean;
  canGoPrevProject: boolean;
  canGoNextImage: boolean;
  canGoPrevImage: boolean;
  isLoadingImages?: boolean;
  categoryLabel: string;
}

export function ProcessGalleryModal({
  isOpen,
  currentImage,
  currentProject,
  images,
  imageIndex,
  projectIndex,
  totalProjects,
  onClose,
  onNextImage,
  onPrevImage,
  onNextProject,
  onPrevProject,
  canGoNextProject,
  canGoPrevProject,
  canGoNextImage,
  canGoPrevImage,
  isLoadingImages = false,
  categoryLabel,
}: ProcessGalleryModalProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Get display image and embed URL
  const displayImage = currentImage?.imageUrl || (currentImage?.videoUrl ? getVideoThumbnail(currentImage.videoUrl) : null);
  const embedUrl = currentImage?.videoUrl ? getVideoEmbedUrl(currentImage.videoUrl) : null;

  // Reset video state when item changes
  useEffect(() => {
    setShowVideo(false);
  }, [currentImage?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && canGoPrevProject) onPrevProject();
      if (e.key === 'ArrowRight' && canGoNextProject) onNextProject();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canGoNextProject, canGoPrevProject, onNextProject, onPrevProject, onClose]);

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-none w-screen h-screen sm:max-w-none md:max-w-none p-0 m-0 rounded-none bg-black/98 backdrop-blur-xl border-none overflow-hidden flex flex-col shadow-none outline-none">
        <DialogTitle className="sr-only">{currentImage.displayTitle || currentProject?.displayTitle || categoryLabel}</DialogTitle>

        {/* Top Controls */}
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

        {/* Project Counter - Top Left */}
        {totalProjects > 1 && (
          <div className="absolute top-6 left-6 z-[60]">
            <p className="text-white/60 text-sm">
              Project {projectIndex + 1} / {totalProjects}
            </p>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 w-full h-full flex flex-col relative">
          {/* Media Display Area */}
          <div className="flex-1 relative flex items-center justify-center min-h-0 p-4 md:p-8 pb-40 px-20 md:px-28">
            
            {/* Prev Project Arrow - Side */}
            {canGoPrevProject && (
              <button
                onClick={(e) => { e.stopPropagation(); onPrevProject(); }}
                aria-label="Previous project"
                className="absolute left-2 md:left-6 z-50 p-3 md:p-4 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 hover:scale-110 transition-all outline-none"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}

            {/* Media Container */}
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-6 max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative w-full flex flex-col items-center justify-center"
                >
                  {showVideo && embedUrl ? (
                    <div className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                      <iframe
                        src={embedUrl}
                        title={currentImage.displayTitle || 'Video content'}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : displayImage ? (
                    <div className="relative w-full max-w-6xl">
                      <img
                        src={displayImage}
                        alt={currentImage.altText || currentImage.displayTitle || ''}
                        className="w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-2xl"
                      />
                      {embedUrl && !showVideo && (
                        <button
                          onClick={() => setShowVideo(true)}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all flex items-center justify-center group"
                          aria-label="Play video"
                          title="Play video"
                        >
                          <Play className="w-12 h-12 text-white ml-1" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-white/50 text-center">
                      <p>No media available</p>
                    </div>
                  )}

                  {/* Project Title and Description */}
                  <div className="text-center text-white mt-6 max-w-3xl px-4">
                    {currentProject?.displayTitle && (
                      <h2 className="text-3xl md:text-4xl font-black mb-2">{currentProject.displayTitle}</h2>
                    )}
                    {currentProject?.description && (
                      <p className="text-white/70 text-lg">{currentProject.description}</p>
                    )}
                  </div>

                  {/* Image Title and Description (if different from project) */}
                  {currentImage.displayTitle && currentImage.displayTitle !== currentProject?.displayTitle && (
                    <div className="text-center text-white/60 mt-4 max-w-3xl px-4">
                      <p className="text-lg font-semibold">{currentImage.displayTitle}</p>
                      {currentImage.description && (
                        <p className="text-white/50 text-sm mt-2">{currentImage.description}</p>
                      )}
                    </div>
                  )}

                  {embedUrl && displayImage && !showVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all text-sm text-white"
                    >
                      Play Video
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Project Arrow - Side */}
            {canGoNextProject && (
              <button
                onClick={(e) => { e.stopPropagation(); onNextProject(); }}
                aria-label="Next project"
                className="absolute right-2 md:right-6 z-50 p-3 md:p-4 rounded-full bg-black/50 text-white/70 hover:text-white hover:bg-black/70 hover:scale-110 transition-all outline-none"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Image Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
              {/* Image Counter */}
              <p className="text-white/60 text-sm text-center mb-4">
                Image {imageIndex + 1} / {images.length}
              </p>

              {/* Image Thumbnails */}
              <div className="flex gap-3 justify-center items-center px-4">
                {/* Prev Image Button */}
                {canGoPrevImage && (
                  <button
                    onClick={onPrevImage}
                    aria-label="Previous image"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all flex-shrink-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Thumbnails Scroll */}
                <div className="flex gap-2 overflow-x-auto pb-1 flex-1 justify-center">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        const diff = idx - imageIndex;
                        if (diff > 0) {
                          for (let i = 0; i < diff; i++) onNextImage();
                        } else if (diff < 0) {
                          for (let i = 0; i < Math.abs(diff); i++) onPrevImage();
                        }
                      }}
                      className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === imageIndex 
                          ? 'border-white scale-110' 
                          : 'border-white/30 hover:border-white/60 opacity-60'
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.altText || ''}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Next Image Button */}
                {canGoNextImage && (
                  <button
                    onClick={onNextImage}
                    aria-label="Next image"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
