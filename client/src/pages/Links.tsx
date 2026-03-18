import { useEffect, useMemo, useRef, useState } from "react";
import {
  ExternalLink,
  Instagram,
  Linkedin,
  Mail,
  FileText,
  Video,
  Github,
  Twitter,
  Facebook,
  Youtube,
  Newspaper,
  Image as ImageIcon,
  Link as LinkIcon,
  PenTool,
  Globe,
} from "lucide-react";
import { Link } from "wouter";

import { SEO } from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { getProjectPath } from "@/lib/projectRoutes";
import { getLocalArticles } from "@shared/localArticles";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

interface DashboardItem {
  id: string;
  type: "custom" | "article" | "project" | "news" | "tutorial";
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

function FeedCard({
  href,
  image,
  isExternal,
  label,
  title,
}: {
  href: string;
  image?: string | null;
  isExternal: boolean;
  label: string;
  title: string;
}) {
  const content = (
    <article className="group block">
      <div className="relative overflow-hidden rounded-[0.72rem] border border-border/18 bg-card/10">
        {image ? (
          <img
            src={image}
            alt={title}
            className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="aspect-[4/5] w-full bg-card/10" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/52 via-black/10 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-white/62">
            {label}
          </p>
          <h3
            className="mt-2 text-[0.9rem] font-medium leading-[1.02] tracking-[-0.035em] text-white sm:text-[1rem]"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.35)" }}
          >
            {title}
          </h3>
        </div>
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <Link href={href}>{content}</Link>;
}

export default function Links() {
  const [bioData] = useState<BioData>({
    name: "BRANDON PT DAVIS",
    tagline: "Scenic Designer",
    profileImage: "/assets/studio/profile-image.jpeg",
  });
  const [displayLimit, setDisplayLimit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery({});
  const articles = getLocalArticles();
  const articlesLoading = false;
  const tutorials: any[] = [];
  const tutorialsLoading = false;

  const loading = projectsLoading || articlesLoading || tutorialsLoading;

  const items = useMemo(() => {
    if (loading) return [];

    const dashboardItems: DashboardItem[] = [];

    const pinnedLinks = [
      {
        id: "bio-portfolio",
        type: "custom" as const,
        title: "Portfolio",
        subtitle: "Selected work",
        url: "/projects",
        date: new Date().toISOString(),
        icon: "image",
        isPinned: true,
      },
      {
        id: "bio-resume",
        type: "custom" as const,
        title: "Resume",
        subtitle: "CV and credits",
        url: "/resume",
        date: new Date().toISOString(),
        icon: "file-text",
        isPinned: true,
      },
      {
        id: "bio-studio",
        type: "custom" as const,
        title: "Studio",
        subtitle: "Tools and tutorials",
        url: "/studio",
        date: new Date().toISOString(),
        icon: "video",
        isPinned: true,
      },
    ];

    dashboardItems.push(...pinnedLinks);

    if (projects) {
      projects
        .filter((p: any) => p.discipline === "scenic_design" || p.discipline === "rendering")
        .forEach((p: any) => {
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
            type: "project",
            title: p.title,
            subtitle: p.venue || "Portfolio",
            url: getProjectPath(p),
            image: p.coverImageUrl,
            date: dateStr,
            icon: "image",
            isPinned: false,
          });
        });
    }

    articles.forEach((a: any) => {
      const d = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
      dashboardItems.push({
        id: `art-${a.id}`,
        type: "article",
        title: a.title,
        subtitle: a.categoryName || "Article",
        url: `/articles/${a.slug}`,
        image: a.coverImageUrl,
        date: d.toISOString(),
        icon: "pen-tool",
        isPinned: false,
      });
    });

    if (tutorials) {
      tutorials.forEach((t: any) => {
        const d = t.publishDate ? new Date(t.publishDate) : new Date(t.createdAt);
        dashboardItems.push({
          id: `tut-${t.id}`,
          type: "tutorial",
          title: t.title,
          subtitle: "Tutorial",
          url: `/studio/tutorials/${t.slug}`,
          image: t.thumbnailUrl,
          date: d.toISOString(),
          icon: "video",
          isPinned: false,
        });
      });
    }

    return dashboardItems.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [projects, articles, tutorials, loading]);

  useEffect(() => {
    if (!hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayLimit((prev) => prev + 9);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  useEffect(() => {
    setHasMore(displayLimit < items.filter((i) => !i.isPinned).length);
  }, [displayLimit, items]);

  const getIcon = (name: string) => {
    const map: Record<string, any> = {
      instagram: Instagram,
      linkedin: Linkedin,
      twitter: Twitter,
      facebook: Facebook,
      youtube: Youtube,
      github: Github,
      mail: Mail,
      email: Mail,
      link: LinkIcon,
      website: Globe,
      article: FileText,
      "pen-tool": PenTool,
      "file-text": FileText,
      project: ImageIcon,
      image: ImageIcon,
      news: Newspaper,
      video: Video,
    };
    return map[name.toLowerCase()] || ExternalLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/28 border-t-transparent" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-foreground/45">Loading links</p>
          </div>
        </div>
      </div>
    );
  }

  const pinnedItems = items.filter((i) => i.isPinned);
  const feedItems = items.filter((i) => !i.isPinned).slice(0, displayLimit);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Links | Brandon PT Davis"
        description={`Latest work and updates from ${bioData.name}`}
      />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 sm:pt-16 md:pt-20">
        <section className="border-b border-border/18 pb-10 md:pb-14">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-5 h-20 w-20 overflow-hidden rounded-full border border-border/30 bg-card/20 md:h-24 md:w-24">
              <img
                src={bioData.profileImage}
                alt={bioData.name}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-foreground/42">
              Scenic Design
            </p>
            <h1 className="mt-4 font-sans text-[clamp(2.3rem,6vw,4.7rem)] font-medium leading-[0.95] tracking-[-0.06em] text-foreground">
              {bioData.name}
            </h1>
            <p className="mx-auto mt-5 max-w-[22ch] text-[0.98rem] leading-7 text-foreground/62 md:max-w-[22ch] md:text-[1.06rem] md:leading-8">
              Portfolio, studio resources, articles, and current work collected in one place.
            </p>

            <div className="mt-7 flex items-center justify-center gap-2">
              <a
                href="https://instagram.com/brandonptdavisdesign"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/40 hover:text-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com/in/brandonptdavis"
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/40 hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.pinterest.com/BrandonPTDavis/"
                target="_blank"
                rel="noopener"
                aria-label="Pinterest"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/40 hover:text-foreground"
              >
                <PinterestIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@brandonptdavis.com"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Contact
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {pinnedItems.length > 0 ? (
          <section className="border-b border-border/18 py-8 md:py-10">
            <div className="mx-auto grid max-w-3xl gap-3">
              {pinnedItems.map((item) => {
                const Icon = getIcon(item.icon);
                const isExternal = item.url.startsWith("http");
                const content = (
                  <div className="group rounded-full border border-border/24 bg-transparent px-5 py-4 transition-colors hover:border-border/42 hover:bg-card/[0.03]">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/24 bg-transparent text-foreground/62">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="truncate text-[1rem] font-medium tracking-[-0.02em] text-foreground">
                            {item.title}
                          </p>
                          {item.subtitle ? (
                            <p className="truncate text-[0.72rem] uppercase tracking-[0.16em] text-foreground/42">
                              {item.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/24 text-foreground/34 transition-colors group-hover:text-foreground/68"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                );

                return isExternal ? (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                ) : (
                  <Link key={item.id} href={item.url}>
                    {content}
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="pt-8 md:pt-10">
          <div className="mb-6 flex items-center gap-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-foreground/40">
              Selected Links
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-border/35 to-transparent" />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {feedItems.map((item, index) => (
              <FeedCard
                key={item.id}
                href={item.url}
                image={item.image}
                isExternal={item.url.startsWith("http")}
                label={item.type === "project" ? "Project" : item.type === "article" ? "Article" : item.type}
                title={item.title}
              />
            ))}
          </div>

          {hasMore ? (
            <div ref={loaderRef} className="flex justify-center py-10">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-foreground/24 border-t-transparent" />
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}
