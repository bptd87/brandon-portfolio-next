// Skeleton loading components for homepage sections

export function CarouselSkeleton() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Shimmer overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="relative z-10 container h-full flex flex-col items-center justify-center text-center px-4">
        {/* Title skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-20 w-96 max-w-full bg-white/10 rounded-lg mx-auto" />
          <div className="h-16 w-80 max-w-full bg-white/10 rounded-lg mx-auto" />
        </div>

        {/* Subtitle skeleton */}
        <div className="h-6 w-[600px] max-w-full bg-white/10 rounded mx-auto mb-8" />

        {/* Button skeletons */}
        <div className="flex gap-4 justify-center">
          <div className="h-12 w-32 bg-orange-500/30 rounded-full" />
          <div className="h-12 w-32 bg-white/10 rounded-full" />
        </div>

        {/* Carousel dots skeleton */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`h-2 rounded-full bg-white/30 ${i === 0 ? 'w-8' : 'w-2'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectGridSkeleton() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        {/* Section header skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-10 w-64 bg-muted/30 rounded mx-auto" />
          <div className="h-6 w-96 max-w-full bg-muted/20 rounded mx-auto" />
        </div>

        {/* Project grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image skeleton */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted/20 mb-4">
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              
              {/* Title skeleton */}
              <div className="h-6 w-3/4 bg-muted/30 rounded mb-2" />
              
              {/* Subtitle skeleton */}
              <div className="h-4 w-1/2 bg-muted/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsSectionSkeleton() {
  return (
    <section className="py-20 bg-muted/5">
      <div className="container">
        {/* Section header skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-10 w-48 bg-muted/30 rounded mx-auto" />
          <div className="h-6 w-80 max-w-full bg-muted/20 rounded mx-auto" />
        </div>

        {/* News grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
              {/* Image skeleton */}
              <div className="relative aspect-video bg-muted/20">
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
              
              {/* Content skeleton */}
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-6 w-full bg-muted/30 rounded" />
                <div className="h-4 w-5/6 bg-muted/20 rounded" />
                <div className="h-4 w-4/6 bg-muted/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero section skeleton */}
      <div className="relative h-[60vh] bg-muted/20">
        <div 
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title skeleton */}
          <div className="space-y-4">
            <div className="h-12 w-3/4 bg-muted/30 rounded" />
            <div className="h-6 w-1/2 bg-muted/20 rounded" />
          </div>

          {/* Metadata skeleton */}
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-muted/20 rounded-full" />
            ))}
          </div>

          {/* Content blocks skeleton */}
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-3/4 bg-muted/20 rounded" />
              </div>
            ))}
          </div>

          {/* Image gallery skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative aspect-video bg-muted/20 rounded-lg overflow-hidden">
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero image skeleton */}
      <div className="relative h-[50vh] bg-muted/20">
        <div 
          className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Article content skeleton */}
      <article className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Title and meta skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-32 bg-muted/20 rounded" />
            <div className="h-10 w-full bg-muted/30 rounded" />
            <div className="h-10 w-4/5 bg-muted/30 rounded" />
            <div className="flex gap-4 items-center mt-6">
              <div className="h-10 w-10 bg-muted/20 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-muted/20 rounded" />
                <div className="h-3 w-24 bg-muted/15 rounded" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-full bg-muted/20 rounded" />
                <div className="h-4 w-5/6 bg-muted/20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}

export function NewsListSkeleton() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        {/* Header skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-12 w-64 bg-muted/30 rounded mx-auto" />
          <div className="h-6 w-96 max-w-full bg-muted/20 rounded mx-auto" />
        </div>

        {/* News grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
              {/* Image skeleton */}
              <div className="relative aspect-video bg-muted/20">
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              
              {/* Content skeleton */}
              <div className="p-6 space-y-3">
                <div className="h-4 w-24 bg-muted/20 rounded" />
                <div className="h-6 w-full bg-muted/30 rounded" />
                <div className="h-4 w-5/6 bg-muted/20 rounded" />
                <div className="h-4 w-4/6 bg-muted/20 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioGridSkeleton() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        {/* Header skeleton */}
        <div className="mb-12 space-y-4">
          <div className="h-4 w-32 bg-muted/20 rounded mx-auto" />
          <div className="h-12 w-96 max-w-full bg-muted/30 rounded mx-auto" />
          <div className="h-6 w-[600px] max-w-full bg-muted/20 rounded mx-auto" />
        </div>

        {/* Filter tabs skeleton */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 w-32 bg-muted/20 rounded-full" />
          ))}
        </div>

        {/* Portfolio grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="group cursor-pointer">
              {/* Image skeleton */}
              <div className="relative aspect-[4/3] bg-muted/20 rounded-lg overflow-hidden mb-4">
                <div 
                  className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-3">
                <div className="h-6 w-full bg-muted/30 rounded" />
                <div className="h-4 w-3/4 bg-muted/20 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-muted/20 rounded-full" />
                  <div className="h-6 w-24 bg-muted/20 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
