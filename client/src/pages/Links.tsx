import { useState, useEffect, useRef, useMemo } from 'react';
import { ExternalLink, Instagram, Linkedin, Mail, FileText, Video, Github, Twitter, Facebook, Youtube, Newspaper, Image as ImageIcon, Link as LinkIcon, PenTool, Globe, Home } from 'lucide-react';
import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
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
  const [displayLimit, setDisplayLimit] = useState(12);
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

    // Projects
    if (projects) {
      projects.forEach((p: any) => {
        const d = p.publishedAt ? new Date(p.publishedAt) : new Date();

        dashboardItems.push({
          id: `proj-${p.id}`,
          type: 'project',
          title: p.title,
          subtitle: p.venue || 'Portfolio',
          url: `/projects/${p.slug}`,
          image: p.coverImageUrl,
          date: d.toISOString(),
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
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setDisplayLimit(prev => prev + 12);
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
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-background to-transparent opacity-80" />
        <div className="absolute -top-[20%] left-[20%] w-[60vw] h-[60vw] bg-accent/10 rounded-full blur-[128px]" />
        <div className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[128px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-16 md:pt-24">

        {/* --- 1. Profile --- */}
        <div className="flex flex-col items-center text-center mb-16">
          {bioData.profileImage && (
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent to-primary rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-1 border border-border bg-background/50 backdrop-blur-sm">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={bioData.profileImage}
                    alt={bioData.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}

          <h1 className="font-['Playfair_Display'] font-medium text-4xl md:text-5xl tracking-tight mb-3">
            {bioData.name}
          </h1>
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-border" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
              {bioData.tagline}
            </p>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* Socials - Floating Pill */}
          <div className="mt-8 flex items-center gap-1 p-1.5 rounded-full bg-muted/50 border border-border backdrop-blur-md shadow-lg">
            <a href="https://instagram.com/brandonptdavis" target="_blank" rel="noopener" aria-label="Visit Instagram Profile" className="p-2.5 rounded-full hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-all"><Instagram className="w-5 h-5" /></a>
            <a href="https://linkedin.com/in/brandonptdavis" target="_blank" rel="noopener" aria-label="Visit LinkedIn Profile" className="p-2.5 rounded-full hover:bg-accent/20 text-muted-foreground hover:text-foreground transition-all"><Linkedin className="w-5 h-5" /></a>
            <div className="w-px h-4 bg-border mx-1" />
            <a href="mailto:info@brandonptdavis.com" className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground font-medium text-xs hover:bg-accent/80 transition-colors flex items-center gap-2">
              <span>Contact</span>
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* --- 2. Pinned Links (Grid) --- */}
        {pinnedItems.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-16">
            {pinnedItems.map(item => {
              const Icon = getIcon(item.icon);
              const isExternal = item.url.startsWith('http');

              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative p-4 flex flex-col items-center text-center gap-3">
                      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                      <span className="font-medium text-sm group-hover:text-foreground">
                        {item.title}
                      </span>
                    </div>
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="group relative overflow-hidden rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative p-4 flex flex-col items-center text-center gap-3">
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                    <span className="font-medium text-sm group-hover:text-foreground">
                      {item.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* --- 3. Latest Feed (3 Columns) --- */}
        <div className="border-t border-border pt-10">
          <div className="flex items-center justify-between mb-8 opacity-60">
            <h2 className="font-mono text-[10px] uppercase tracking-widest">Latest Activity</h2>
            <div className="h-px flex-1 bg-border ml-4" />
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {feedItems.map((item) => {
              const ItemIcon = getIcon(item.icon);
              const isExternal = item.url.startsWith('http');

              if (isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group overflow-hidden rounded-lg bg-muted border border-border aspect-[4/5] hover:border-accent transition-colors"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ItemIcon className="w-8 h-8 opacity-20" />
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 pb-5 text-center">
                      <div>
                        <p className="font-['Playfair_Display'] italic text-sm leading-tight mb-1 drop-shadow-md">
                          {item.title}
                        </p>
                        <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                          {item.type}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 p-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-border z-10 pointer-events-none">
                      <ItemIcon className="w-3 h-3" />
                    </div>
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className="relative group overflow-hidden rounded-lg bg-muted border border-border aspect-[4/5] hover:border-accent transition-colors"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <ItemIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 pb-5 text-center">
                    <div>
                      <p className="font-['Playfair_Display'] italic text-sm leading-tight mb-1 drop-shadow-md">
                        {item.title}
                      </p>
                      <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
                        {item.type}
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-background/40 backdrop-blur-sm border border-border z-10 pointer-events-none">
                    <ItemIcon className="w-3 h-3" />
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

        <div className="h-20" /> {/* Bottom spacer */}

        {/* Footer */}
        <footer className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Brandon PT Davis
          </p>
        </footer>
      </div>
    </div>
  );
}
