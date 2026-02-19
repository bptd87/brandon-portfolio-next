import { useState, useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Instagram, Linkedin, Mail, FileText, Video, Github, Twitter, Facebook, Youtube, Newspaper, Image as ImageIcon, Link as LinkIcon, PenTool, Globe, Home } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import { getProjectPath } from '@/lib/projectRoutes';
import { SEO } from '@/components/SEO';

// --- Interfaces ---

interface DashboardItem {
  id: string;
  type: 'custom' | 'article' | 'project' | 'news' | 'tutorial';
  title: string;
  subtitle?: string;
  url: string;
  image?: string | null;
  date: string;
  icon: string;
  isPinned?: boolean;
}

interface BioData {
  name: string;
  tagline: string;
  profileImage: string;
}

export default function Links() {
  const [bioData] = useState<BioData>({
    name: 'BRANDON PT DAVIS',
    tagline: 'Scenic & Experiential Designer',
    profileImage: '/assets/studio/profile-image.jpeg',
  });

  // Pagination
  const [displayLimit, setDisplayLimit] = useState(6);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch data with tRPC
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({});
  const { data: articles, isLoading: articlesLoading } = trpc.articles.list.useQuery({});
  const { data: news, isLoading: newsLoading } = trpc.news.list.useQuery({});
  // TODO: Add tutorials router
  const tutorials: any[] = [];
  const tutorialsLoading = false;

  const loading = projectsLoading || articlesLoading || newsLoading;

  // --- Data Processing ---

  const items = useMemo(() => {
    if (loading) return [];

    const dashboardItems: DashboardItem[] = [];

    // Pinned Bio Links (Top Buttons)
    const pinnedLinks = [
      {
        id: 'bio-portfolio',
        type: 'custom' as const,
        title: 'Full Portfolio',
        subtitle: 'View all work',
        url: '/projects',
        date: new Date().toISOString(),
        icon: 'image',
        isPinned: true
      },
      {
        id: 'bio-resume',
        type: 'custom' as const,
        title: 'Resume',
        subtitle: 'Download CV',
        url: '/resume',
        date: new Date().toISOString(),
        icon: 'file-text',
        isPinned: true
      },
      {
        id: 'bio-contact',
        type: 'custom' as const,
        title: 'Get in Touch',
        subtitle: 'Start a project',
        url: '/contact',
        date: new Date().toISOString(),
        icon: 'mail',
        isPinned: true
      },
      {
        id: 'bio-studio',
        type: 'custom' as const,
        title: 'Studio',
        subtitle: 'Tutorials & Tools',
        url: '/studio',
        date: new Date().toISOString(),
        icon: 'video',
        isPinned: true
      }
    ];

    dashboardItems.push(...pinnedLinks);

    // Projects (only scenic_design and rendering)
    if (projects) {
      projects
        .filter((p: any) => p.discipline === 'scenic_design' || p.discipline === 'rendering')
        .forEach((p: any) => {
          // Use project year/month for accurate chronological sorting
          let dateStr: string;
          if (p.year && p.month) {
            dateStr = new Date(p.year, p.month - 1, 15).toISOString();
          } else if (p.year) {
            dateStr = new Date(p.year, 6, 1).toISOString();
          } else if (p.publishedAt) {
            dateStr = new Date(p.publishedAt).toISOString();
          } else {
            dateStr = new Date().toISOString();
          }

          dashboardItems.push({
            id: `proj-${p.id}`,
            type: 'project',
            title: p.title,
            subtitle: p.venue || 'Portfolio',
            url: getProjectPath(p),
            image: p.coverImageUrl,
            date: dateStr,
            icon: 'image',
            isPinned: false
          });
        });
    }

    // Articles
    if (articles) {
      articles.forEach((a: any) => {
        const d = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
        dashboardItems.push({
          id: `art-${a.id}`,
          type: 'article',
          title: a.title,
          subtitle: 'Article',
          url: `/articles/${a.slug}`,
          image: a.coverImageUrl,
          date: d.toISOString(),
          icon: 'pen-tool',
          isPinned: false
        });
      });
    }

    // News
    if (news) {
      news.forEach((n: any) => {
        const d = n.date ? new Date(n.date) : new Date(n.createdAt);
        dashboardItems.push({
          id: `news-${n.id}`,
          type: 'news',
          title: n.title,
          subtitle: 'News',
          url: `/news/${n.slug}`,
          image: n.coverImageUrl,
          date: d.toISOString(),
          icon: 'newspaper',
          isPinned: false
        });
      });
    }

    // Tutorials
    if (tutorials) {
      tutorials.forEach((t: any) => {
        const d = t.publishDate ? new Date(t.publishDate) : new Date(t.createdAt);
        dashboardItems.push({
          id: `tut-${t.id}`,
          type: 'tutorial',
          title: t.title,
          subtitle: 'Tutorial',
          url: `/studio/tutorials/${t.slug}`,
          image: t.thumbnailUrl,
          date: d.toISOString(),
          icon: 'video',
          isPinned: false
        });
      });
    }

    // Sort: Pinned first, then by date
    return dashboardItems.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [projects, articles, news, tutorials, loading]);

  // --- Infinite Scroll ---
  useEffect(() => {
    if (!hasMore) return;
    
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setDisplayLimit(prev => prev + 6);
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  useEffect(() => {
    setHasMore(displayLimit < items.length);
  }, [displayLimit, items]);

  // --- Render Helpers ---

  const getIcon = (name: string) => {
    const map: Record<string, any> = {
      instagram: Instagram, linkedin: Linkedin, twitter: Twitter,
      facebook: Facebook, youtube: Youtube, github: Github,
      mail: Mail, email: Mail, link: LinkIcon, website: Globe,
      article: FileText, 'pen-tool': PenTool, 'file-text': FileText,
      project: ImageIcon, image: ImageIcon, news: Newspaper, video: Video
    };
    return map[name.toLowerCase()] || ExternalLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Loading Feed</p>
        </div>
      </div>
    );
  }

  const pinnedItems = items.filter(i => i.isPinned);
  const feedItems = items.filter(i => !i.isPinned).slice(0, displayLimit);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <SEO
        title="Links | Brandon PT Davis"
        description={`Latest work and updates from ${bioData.name}`}
      />



      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-background" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 md:pt-24">

        {/* --- 1. Profile --- */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          {bioData.profileImage && (
            <div className="relative mb-6 group">
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-1 ring-border/60">
                <img
                  src={bioData.profileImage}
                  alt={bioData.name}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

          <h1 className="font-['Playfair_Display'] font-medium text-3xl md:text-4xl tracking-tight mb-2">
            {bioData.name}
          </h1>
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-6">
            {bioData.tagline}
          </p>

          {/* Socials - Clean Pills */}
          <div className="flex items-center gap-2">
            <a href="https://instagram.com/brandonptdavis" target="_blank" rel="noopener" aria-label="Instagram" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="https://linkedin.com/in/brandonptdavis" target="_blank" rel="noopener" aria-label="LinkedIn" className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
            <div className="w-px h-4 bg-border mx-1" />
            <a href="mailto:info@brandonptdavis.com" className="px-4 py-2 rounded-full bg-foreground text-background font-medium text-xs hover:bg-foreground/90 transition-colors flex items-center gap-2">
              <span>Contact</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* --- 2. Pinned Links (Grid) --- */}
        {pinnedItems.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
            {pinnedItems.map((item, index) => {
              const Icon = getIcon(item.icon);
              const isExternal = item.url.startsWith('http');
              
              const accentColors = [
                '#FF5722',
                '#00BCD4',
                '#E91E63',
                '#FFC107',
              ];
              const accentColor = accentColors[index % accentColors.length];

              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-lg border border-border/60 hover:border-opacity-0 transition-all duration-300"
                    style={{ 
                      borderColor: `${accentColor}40`,
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 100%)`
                      }}
                    />
                    <div className="relative p-6 flex flex-col items-center text-center gap-3">
                      <div 
                        className="p-3 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: `${accentColor}20`,
                        }}
                      >
                        <Icon 
                          className="w-5 h-5 transition-colors" 
                          style={{ color: accentColor }}
                        />
                      </div>
                      <span className="font-medium text-sm">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-xs text-muted-foreground">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="group relative overflow-hidden rounded-lg border border-border/60 hover:border-opacity-0 transition-all duration-300"
                  style={{ 
                    borderColor: `${accentColor}40`,
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: `linear-gradient(135deg, ${accentColor}15 0%, transparent 100%)`
                    }}
                  />
                  <div className="relative p-6 flex flex-col items-center text-center gap-3">
                    <div 
                      className="p-3 rounded-full transition-all duration-300"
                      style={{ 
                        backgroundColor: `${accentColor}20`,
                      }}
                    >
                      <Icon 
                        className="w-5 h-5 transition-colors" 
                        style={{ color: accentColor }}
                      />
                    </div>
                    <span className="font-medium text-sm">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* --- 3. Timeline Feed (3 Columns) --- */}
        <div className="border-t border-border/40 pt-12">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Timeline</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-border/60 to-transparent" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {feedItems.map((item, index) => {
              const ItemIcon = getIcon(item.icon);
              const isExternal = item.url.startsWith('http');
              
              const accentColors = [
                '#FF5722',
                '#00BCD4',
                '#E91E63',
                '#FFC107',
                '#9C27B0',
              ];
              const accentColor = accentColors[index % accentColors.length];

              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted border border-border/60">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <ItemIcon className="w-10 h-10 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="pt-3 text-center">
                      <h3
                        className="text-xs font-semibold tracking-[0.3em] uppercase mb-1 transition-opacity group-hover:opacity-70"
                        style={{ color: accentColor }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {item.type}
                      </p>
                    </div>
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted border border-border/60">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ItemIcon className="w-10 h-10 opacity-20" />
                      </div>
                    )}
                  </div>
                  <div className="pt-3 text-center">
                    <h3
                      className="text-xs font-semibold tracking-[0.3em] uppercase mb-1 transition-opacity group-hover:opacity-70"
                      style={{ color: accentColor }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {item.type}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <div ref={loaderRef} className="py-12 flex justify-center">
              <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="py-12 text-center border-t border-border/40 mt-20">
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Brandon PT Davis
          </p>
        </footer>
      </div>
    </div>
  );
}
