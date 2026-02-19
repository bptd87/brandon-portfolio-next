import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProgressiveImage } from "@/components/ProgressiveImage";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ExperientialFAQ } from "@/components/ExperientialFAQ";
import { Layers, Ruler, Video, Sparkles, Cloud, Box, Hammer, Zap, Search, Play, ArrowDown, Image as ImageIcon } from "lucide-react";
import { useState, useMemo } from "react";
import { ProcessGalleryModal } from "@/components/ProcessGalleryModal";
import { cn } from "@/lib/utils";
import { getVideoThumbnail } from "@/lib/videoUtils";

// Scrolling brand banner component with images from database
function BrandsBanner() {
  const { data: brands } = trpc.processGallery.brands.useQuery();

  if (!brands || brands.length === 0) {
    return null;
  }

  // Duplicate brands array for seamless infinite scroll
  const allBrands = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden py-12 border-y border-border/30 bg-muted/10">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
      
      <div className="flex animate-marquee items-center">
        {allBrands.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            className="mx-8 flex-shrink-0 flex items-center justify-center"
          >
            {brand.websiteUrl ? (
              <a
                href={brand.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    {brand.name}
                  </span>
                )}
              </a>
            ) : (
              <div className="grayscale opacity-60">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    {brand.name}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Card Grid Gallery Component
function GalleryCardGrid({ 
  items,
  onItemClick,
  categoryLabel 
}: { 
  items: Array<{ 
    id: number; 
    imageUrl: string; 
    videoUrl?: string | null;
    altText: string | null; 
    displayTitle: string | null; 
  }>;
  onItemClick: (index: number) => void;
  categoryLabel: string;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-muted/10">
        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-muted-foreground">No items in {categoryLabel} gallery yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, index) => {
        const accentColors = ['#FF5722', '#00BCD4', '#E91E63', '#FFC107', '#9C27B0'];
        const accentColor = accentColors[index % accentColors.length];
        // Get display image - use imageUrl or YouTube thumbnail for videos
        const displayImage = item.imageUrl || (item.videoUrl ? getVideoThumbnail(item.videoUrl) : null);
        
        return (
          <AnimatedSection key={item.id} delay={index * 0.08}>
            <div
              className="group cursor-pointer"
              onClick={() => onItemClick(index)}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border/50 shadow-lg shadow-black/5">
                {displayImage ? (
                  <ProgressiveImage
                    src={displayImage}
                    alt={item.altText || item.displayTitle || categoryLabel}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-blue-500/10">
                    <Video className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}

              {/* Video indicator */}
              {item.videoUrl && (
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center">
                  <Play className="w-5 h-5 text-white ml-0.5" />
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {item.displayTitle && (
                    <h3 className="text-white font-bold text-sm mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ color: accentColor }}>
                      {item.displayTitle}
                    </h3>
                  )}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Title below for mobile */}
            {item.displayTitle && (
              <div className="mt-3 lg:hidden">
                <h3 className="font-medium text-sm truncate" style={{ color: accentColor }}>{item.displayTitle}</h3>
              </div>
            )}
          </div>
        </AnimatedSection>
        );
      })}
    </div>
  );
}

// Workflow Tab Component
function WorkflowTabs() {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      stepNumber: "01",
      title: "Technical Toolkit",
      description: "Industry-standard software for integrated design workflows. Vectorworks for technical CAD, Twinmotion for real-time visualization, and Photoshop for layered compositing.",
      icon: Layers
    },
    {
      stepNumber: "02",
      title: "Technical Drawing",
      description: "Scaled plans, elevations, and sections establish buildable geometry and spatial relationships. Every line serves construction—no decorative drafting.",
      icon: Ruler
    },
    {
      stepNumber: "03",
      title: "3D Modeling & Rendering",
      description: "Twinmotion and Cinema 4D transform technical drawings into immersive environments with real-time lighting, materials, and atmospheric effects.",
      icon: Box
    },
    {
      stepNumber: "04",
      title: "Buildability & Fabrication",
      description: "Technical documentation supports production teams from concept through construction with scaled drawings, material specifications, and assembly details.",
      icon: Hammer
    }
  ];

  return (
    <AnimatedSection>
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <WorkflowTabItem
              key={index}
              title={step.title}
              description={step.description}
              stepNumber={step.stepNumber}
              icon={step.icon}
              isActive={activeStep === index}
              onClick={() => setActiveStep(index)}
            />
          ))}
        </div>
        
        {/* Expanded Description for Active Step */}
        <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 via-transparent to-transparent border border-pink-500/20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              {steps[activeStep].icon === Layers && <Layers className="w-10 h-10 text-pink-500" />}
              {steps[activeStep].icon === Ruler && <Ruler className="w-10 h-10 text-pink-500" />}
              {steps[activeStep].icon === Box && <Box className="w-10 h-10 text-pink-500" />}
              {steps[activeStep].icon === Hammer && <Hammer className="w-10 h-10 text-pink-500" />}
              <h3 className="text-3xl md:text-4xl font-black">{steps[activeStep].title}</h3>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {steps[activeStep].description}
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function WorkflowTabItem({
  title,
  description,
  stepNumber,
  icon: Icon,
  isActive,
  onClick
}: {
  title: string;
  description: string;
  stepNumber: string;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative group text-left p-6 rounded-xl transition-all duration-300 border-2",
        isActive
          ? "bg-pink-500/10 border-pink-500 shadow-lg"
          : "bg-transparent border-border hover:border-pink-500/50 hover:bg-muted/30"
      )}
    >
      <div className="flex items-start gap-4">
        <Icon className={cn(
          "w-8 h-8 flex-shrink-0 transition-colors duration-300",
          isActive ? "text-pink-500" : "text-muted-foreground"
        )} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "text-4xl font-black transition-colors duration-300 flex-shrink-0",
              isActive ? "text-pink-500" : "text-muted-foreground/30"
            )}>{stepNumber}</span>
          </div>
          <h4 className={cn(
            "text-xl font-bold transition-colors duration-300",
            isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}>{title}</h4>
        </div>
      </div>
    </button>
  );
}

export default function ExperientialPortfolio() {
  // Fetch process gallery images
  const { data: processGalleryItems } = trpc.processGallery.list.useQuery();

  // Organize process gallery by category
  const processImagesByCategory = useMemo(() => {
    if (!processGalleryItems) return {
      'workflow-toolkit': [],
      'workflow-drawing': [],
      'workflow-modeling': [],
      'workflow-buildability': [],
      rendering: [],
      'technical-drawing': [],
      'live-events': []
    };
    return processGalleryItems.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, typeof processGalleryItems>);
  }, [processGalleryItems]);

  // Process gallery modal state
  const [processModalOpen, setProcessModalOpen] = useState(false);
  const [processModalCategory, setProcessModalCategory] = useState<'rendering' | 'technical-drawing' | 'live-events'>('rendering');
  const [projectIndex, setProjectIndex] = useState(0); // Index of current project in category
  const [imageIndex, setImageIndex] = useState(0); // Index of current image within project

  // Get all items in current category
  const categoryItems = processImagesByCategory[processModalCategory] || [];

  // Group items by project, keeping single-image items as "projects" too
  const groupedProjects = useMemo(() => {
    const groups: Array<{
      id: string; // unique identifier (projectId or `single-${id}`)
      projectId: number | null;
      mainItem?: typeof categoryItems[0];
      images: typeof categoryItems;
    }> = [];

    const seenProjects = new Set<number>();

    categoryItems.forEach((item) => {
      if (item.projectId) {
        if (!seenProjects.has(item.projectId)) {
          seenProjects.add(item.projectId);
          groups.push({
            id: `project-${item.projectId}`,
            projectId: item.projectId,
            mainItem: item,
            images: [] // Will be populated from project_images
          });
        }
      } else {
        // Single item without project
        groups.push({
          id: `single-${item.id}`,
          projectId: null,
          mainItem: item,
          images: [item]
        });
      }
    });

    return groups;
  }, [categoryItems, processModalCategory]);

  // Fetch images for the current project
  const currentProject = groupedProjects[projectIndex];
  const { data: projectImages, isLoading: isLoadingProjectImages } = trpc.processGallery.projectImages.useQuery(
    { projectId: currentProject?.projectId! },
    { enabled: currentProject?.projectId !== null && currentProject?.projectId !== undefined }
  );

  // Get the images to display - use projectImages if available, otherwise fall back to mainItem or images array
  const currentImages = projectImages && projectImages.length > 0 
    ? projectImages 
    : currentProject?.mainItem 
      ? [currentProject.mainItem]
      : currentProject?.images || [];
  const currentImage = currentImages[imageIndex];

  const canGoNextProject = projectIndex < groupedProjects.length - 1;
  const canGoPrevProject = projectIndex > 0;
  const canGoNextImage = imageIndex < currentImages.length - 1;
  const canGoPrevImage = imageIndex > 0;

  const handleGalleryItemClick = (index: number) => {
    const item = categoryItems[index];
    
    // Find which project group this item belongs to
    const projIndex = groupedProjects.findIndex((g) => {
      if (g.projectId && item.projectId && g.projectId === item.projectId) {
        return true;
      }
      if (g.projectId === null && g.mainItem?.id === item.id) {
        return true;
      }
      return false;
    });
    
    if (projIndex >= 0) {
      setProjectIndex(projIndex);
      setImageIndex(0);
      setProcessModalOpen(true);
    }
  };

  const capabilities = [
    {
      icon: Box,
      title: "Experiential Environment Design",
      description: "Concept-driven spatial design for installations, activations, and performance-based environments."
    },
    {
      icon: Ruler,
      title: "Technical Drawing & Spatial Systems",
      description: "Scaled plans and layouts that inform both visualization and production."
    },
    {
      icon: Sparkles,
      title: "Rendering & Visualization",
      description: "Atmospheric stills grounded in authored geometry and real-world proportion."
    },
    {
      icon: Video,
      title: "Video Walkthroughs",
      description: "Camera-driven sequences that communicate movement, scale, and narrative flow."
    },
    {
      icon: Layers,
      title: "Authored Composite Visualization",
      description: "Hybrid visualization combining authored spatial design, real-time rendering, and selective AI-assisted post-production."
    },
    {
      icon: Cloud,
      title: "Point-Cloud Spatial Studies",
      description: "Density- and perception-driven visualization emphasizing human presence and scale."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Custom marquee animation styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center border-b border-border overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-pink-500/5" />
        <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        
        <div className="container max-w-6xl relative z-10 py-20">
          <AnimatedSection>
            <div className="space-y-8 max-w-4xl">
              <div>
                <p className="text-xs tracking-[0.3em] text-pink-500 mb-6 font-bold uppercase">
                  Experiential Design
                </p>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9]">
                  Immersive<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">
                    Environments
                  </span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl leading-relaxed font-light text-muted-foreground max-w-2xl">
                Artist-led spatial design grounded in real scale, buildable geometry, and authored visualization.
              </p>

              <div className="flex flex-wrap gap-3 pt-4">
                {[
                  { icon: Zap, label: "Fast Turnaround", color: "text-yellow-400" },
                  { icon: Hammer, label: "Buildable Designs", color: "text-blue-400" },
                  { icon: Layers, label: "Integrated Workflow", color: "text-green-400" },
                ].map((badge, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 border border-border/50 rounded-full bg-background/50 backdrop-blur-sm hover:border-border transition-colors"
                  >
                    <badge.icon className={cn("w-4 h-4", badge.color)} />
                    <span className="text-sm font-medium">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ArrowDown className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Rendering Gallery Section */}
      <section className="py-24 md:py-32">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="max-w-3xl mb-16">
              <p className="text-xs tracking-[0.3em] text-pink-500 mb-4 font-bold uppercase">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6">Rendering & Visualization</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Atmospheric stills and walkthrough videos grounded in authored geometry and real-world proportion. 
                Created in Twinmotion and Cinema 4D with real-time rendering.
              </p>
            </div>
          </AnimatedSection>
          <GalleryCardGrid
            items={processImagesByCategory.rendering || []}
            onItemClick={(index) => {
              setProcessModalCategory('rendering');
              handleGalleryItemClick(index);
            }}
            categoryLabel="Rendering"
          />
        </div>
      </section>

      {/* Integrated Workflow Section - Interactive Tabs */}
      <section className="py-24 md:py-32 border-t border-border bg-muted/10">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs tracking-[0.3em] text-pink-500 mb-4 font-bold uppercase">The Process</p>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Integrated Workflow
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From concept to completion—one unified design process.
              </p>
            </div>
          </AnimatedSection>

          <WorkflowTabs />

          <AnimatedSection>
            <div className="text-center max-w-3xl mx-auto mt-20 pt-16 border-t border-border">
              <p className="text-2xl font-light italic text-muted-foreground">
                "The design and the visualization describe the same space—
                authored geometry ensures buildability from concept to completion."
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Technical Drawing Gallery Section */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Technical Drawing</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Scaled plans, elevations, and sections establish buildable geometry and spatial relationships. 
                Every line serves construction—no decorative drafting.
              </p>
            </div>
          </AnimatedSection>
          <GalleryCardGrid
            items={processImagesByCategory['technical-drawing'] || []}
            onItemClick={(index) => {
              setProcessModalCategory('technical-drawing');
              handleGalleryItemClick(index);
            }}
            categoryLabel="Technical Drawing"
          />
        </div>
      </section>

      {/* Process Gallery Modal */}
      <ProcessGalleryModal
        isOpen={processModalOpen}
        currentImage={currentImage}
        currentProject={currentProject?.mainItem}
        images={currentImages}
        imageIndex={imageIndex}
        projectIndex={projectIndex}
        totalProjects={groupedProjects.length}
        onClose={() => {
          setProcessModalOpen(false);
          setProjectIndex(0);
          setImageIndex(0);
        }}
        onNextImage={() => {
          if (canGoNextImage) setImageIndex((prev) => prev + 1);
        }}
        onPrevImage={() => {
          if (canGoPrevImage) setImageIndex((prev) => prev - 1);
        }}
        onNextProject={() => {
          if (canGoNextProject) {
            setProjectIndex((prev) => prev + 1);
            setImageIndex(0);
          }
        }}
        onPrevProject={() => {
          if (canGoPrevProject) {
            setProjectIndex((prev) => prev - 1);
            setImageIndex(0);
          }
        }}
        canGoNextProject={canGoNextProject}
        canGoPrevProject={canGoPrevProject}
        canGoNextImage={canGoNextImage}
        canGoPrevImage={canGoPrevImage}
        isLoadingImages={isLoadingProjectImages}
        categoryLabel={
          processModalCategory === 'rendering' ? 'Rendering' :
          processModalCategory === 'technical-drawing' ? 'Technical Drawing' :
          'Live Events'
        }
      />

      {/* Capabilities Grid */}
      <section className="py-24 md:py-32 border-t border-border bg-muted/5">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Full-Service Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From concept sketches to final installation—integrated design and visualization services.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="group h-full border border-border rounded-xl p-8 bg-background hover:border-pink-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/5">
                  <capability.icon className="w-8 h-8 mb-4 text-pink-500 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Live Events Gallery Section */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-6xl">
          <AnimatedSection>
            <div className="max-w-3xl mb-16">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Live Events & Installations</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Documentation of completed installations and activations. These projects represent the transition 
                from design to real-world execution—demonstrating scope delivered and environments experienced.
              </p>
            </div>
          </AnimatedSection>
          <GalleryCardGrid
            items={processImagesByCategory['live-events'] || []}
            onItemClick={(index) => {
              setProcessModalCategory('live-events');
              handleGalleryItemClick(index);
            }}
            categoryLabel="Live Events"
          />
        </div>
      </section>

      {/* Brands Banner */}
      <BrandsBanner />

      {/* FAQ Section */}
      <section className="py-24 md:py-32 border-t border-border bg-muted/10">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <ExperientialFAQ />
          </AnimatedSection>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container max-w-3xl">
          <AnimatedSection>
            <div className="text-center space-y-8">
              <p className="text-3xl md:text-4xl font-light leading-relaxed">
                Experiential design sits at the intersection of<br />
                <span className="font-bold">art, technology, and real environments.</span>
              </p>
              <p className="text-xl text-muted-foreground">
                This work is developed to be seen, shared, and built.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
