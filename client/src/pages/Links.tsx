"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CalendarDays,
  ExternalLink,
  Image as ImageIcon,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  Newspaper,
  Palette,
  PenTool,
  Video,
} from "lucide-react";
import { Link } from "wouter";

import { SEO } from "@/components/SEO";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalExperientialProjectHref, getLocalExperientialProjects } from "@shared/localPortfolios";
import { getLocalScenicProjects } from "@shared/localScenicProjects";
import { getLocalTutorials } from "@shared/localStudio";

const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const TUTORIAL_COVER_VARIANTS = {
  "getting-started": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/getting-started-3.png",
  ],
  "2d-drafting": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/2d-drafting-3.png",
  ],
  "3d-modeling": [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/3d-modeling-3.png",
  ],
  rendering: [
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-1.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-2.png",
    "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/studio/tutorials/wide/rendering-3.png",
  ],
} as const;

type IconComponent = typeof Briefcase;

type LinkItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: IconComponent;
  external?: boolean;
};

type PreviewItem = {
  id: string;
  title: string;
  eyebrow: string;
  subtitle?: string;
  href: string;
  image?: string | null;
  external?: boolean;
};

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

const normalizeToken = (value: string | null | undefined) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getStableVariantIndex = (value: string, total: number) => {
  const hash = value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return hash % total;
};

const getTutorialCoverImage = (tutorial: { id: number | string; slug?: string | null; category?: string | null }) => {
  const category = normalizeToken(tutorial.category);
  const variants =
    TUTORIAL_COVER_VARIANTS[category as keyof typeof TUTORIAL_COVER_VARIANTS] ||
    TUTORIAL_COVER_VARIANTS["getting-started"];
  const variantIndex = getStableVariantIndex(String(tutorial.slug || tutorial.id), variants.length);

  return variants[variantIndex];
};

const timestampForPortfolioItem = (input: {
  updatedAt?: string | null;
  publishedAt?: string | null;
  createdAt?: string | null;
  year?: number | null;
  month?: number | null;
}) => {
  if (input.year && input.month) return new Date(input.year, input.month - 1, 1).getTime();
  if (input.year) return new Date(input.year, 6, 1).getTime();

  const explicitDate = input.publishedAt || input.createdAt || input.updatedAt;
  const time = new Date(explicitDate || 0).getTime();
  return Number.isFinite(time) ? time : 0;
};

function SmartLink({
  children,
  className,
  external,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  href: string;
}) {
  if (external || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a className={className} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

function PrimaryLinkRow({ item }: { item: LinkItem }) {
  const Icon = item.icon;

  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className="group flex items-center justify-between gap-5 border-t border-border/24 py-4 transition-colors last:border-b hover:border-foreground/36"
    >
      <span className="flex min-w-0 items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/28 text-foreground/58 transition-colors group-hover:border-foreground/40 group-hover:text-foreground">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[1.08rem] font-medium leading-tight tracking-[-0.025em] text-foreground">
            {item.title}
          </span>
          <span className="mt-1 block truncate text-[0.76rem] uppercase tracking-[0.16em] text-foreground/42">
            {item.subtitle}
          </span>
        </span>
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-foreground/35 transition-colors group-hover:text-foreground/72" />
    </SmartLink>
  );
}

function PreviewRow({ item, priority }: { item: PreviewItem; priority?: boolean }) {
  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className="group grid gap-4 border-t border-border/20 py-4 transition-colors last:border-b hover:border-foreground/34 sm:grid-cols-[7rem_1fr_auto] sm:items-center"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-card/20 sm:w-28">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 7rem"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-foreground/28">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-foreground/38">
          {item.eyebrow}
        </p>
        <div
          role="heading"
          aria-level={3}
          className="mt-2 text-[1.05rem] font-medium leading-[1.08] tracking-[-0.03em] text-foreground sm:text-[1.18rem]"
        >
          {item.title}
        </div>
        {item.subtitle ? (
          <p className="mt-2 max-w-xl text-[0.88rem] leading-6 text-foreground/54">{item.subtitle}</p>
        ) : null}
      </div>
      <ArrowUpRight className="hidden h-4 w-4 text-foreground/34 transition-colors group-hover:text-foreground/72 sm:block" />
    </SmartLink>
  );
}

function SectionHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-foreground/36">{kicker}</p>
      <div
        role="heading"
        aria-level={2}
        className="mt-2 text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-[1.6rem]"
      >
        {title}
      </div>
    </div>
  );
}

export default function Links() {
  const { primaryLinks, recentProjects, studioLinks } = useMemo(() => {
    const primaryLinks: LinkItem[] = [
      {
        id: "scenic-design",
        title: "Scenic Design Portfolio",
        subtitle: "Production work",
        href: "/projects",
        icon: Briefcase,
      },
      {
        id: "rendering",
        title: "Rendering",
        subtitle: "Concept and visualization",
        href: "/projects/rendering",
        icon: Palette,
      },
      {
        id: "experiential",
        title: "Experiential Design",
        subtitle: "Events, exhibits, environments",
        href: "/projects/experiential",
        icon: Layers,
      },
      {
        id: "upcoming",
        title: "Upcoming Productions",
        subtitle: "Current calendar",
        href: "/upcoming-productions",
        icon: CalendarDays,
      },
      {
        id: "studio",
        title: "Studio",
        subtitle: "Articles and tutorials",
        href: "/studio",
        icon: BookOpen,
      },
      {
        id: "contact",
        title: "Contact",
        subtitle: "Start a conversation",
        href: "/contact",
        icon: Mail,
      },
    ];

    const recentProjects = getLocalScenicProjects()
      .filter((project) => project.coverImageUrl)
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .slice(0, 4)
      .map<PreviewItem>((project) => ({
        id: `scenic-${project.slug}`,
        title: project.title,
        eyebrow: project.client || "Scenic Design",
        subtitle: project.year ? String(project.year) : "Selected production",
        href: `/project/${project.slug}`,
        image: project.coverImageUrl,
      }));

    const experientialLinks = getLocalExperientialProjects()
      .filter((project) => project.coverImageUrl)
      .sort((a, b) =>
        timestampForPortfolioItem({ updatedAt: b.updatedAt, year: b.year, month: b.month }) -
        timestampForPortfolioItem({ updatedAt: a.updatedAt, year: a.year, month: a.month })
      )
      .slice(0, 1)
      .map<PreviewItem>((project) => ({
        id: `experience-${project.slug}`,
        title: project.title,
        eyebrow: "Experiential",
        subtitle: project.year ? String(project.year) : "Selected work",
        href: getLocalExperientialProjectHref(project),
        image: project.coverImageUrl,
      }));

    const articles = getLocalArticles();
    const articleLinks = articles
      .filter(
        (article) =>
          !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug) &&
          !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug)
      )
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .slice(0, 2)
      .map<PreviewItem>((article) => ({
        id: `article-${article.slug}`,
        title: article.title,
        eyebrow: article.categoryName || "Article",
        subtitle: article.excerpt,
        href: `/articles/${article.slug}`,
        image: article.coverImageUrl,
      }));

    const learningArticleLinks = articles
      .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .slice(0, 2)
      .map<PreviewItem>((article) => ({
        id: `learning-${article.slug}`,
        title: article.title,
        eyebrow: LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG[article.slug] || article.categoryName || "Tutorial",
        subtitle: article.excerpt,
        href: `/studio/tutorials/${article.slug}`,
        image: article.coverImageUrl,
      }));

    const tutorialLinks = getLocalTutorials()
      .slice(0, 1)
      .map<PreviewItem>((tutorial) => ({
        id: `tutorial-${tutorial.slug}`,
        title: tutorial.title,
        eyebrow: tutorial.category || "Tutorial",
        subtitle: tutorial.description || tutorial.overview || "A practical scenic design learning resource.",
        href: `/studio/tutorials/${tutorial.slug}`,
        image: getTutorialCoverImage(tutorial),
      }));

    return {
      primaryLinks,
      recentProjects: [...recentProjects, ...experientialLinks].slice(0, 5),
      studioLinks: [...articleLinks, ...learningArticleLinks, ...tutorialLinks].slice(0, 5),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Links | Brandon PT Davis"
        description="Social links, portfolio, articles, tutorials, and current work from scenic designer Brandon PT Davis."
      />

      <main className="mx-auto w-full max-w-3xl px-5 pb-18 pt-10 sm:px-7 sm:pt-14">
        <section className="pb-8 text-center">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-border/30 bg-card/20 sm:h-28 sm:w-28">
            <div className="relative h-full w-full">
              <Image
                src={ABOUT_HEADSHOT_URL}
                alt="Brandon PT Davis"
                fill
                priority
                quality={82}
                sizes="7rem"
                className="translate-y-[16%] scale-[1.34] object-cover object-center"
              />
            </div>
          </div>
          <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-foreground/40">
            Scenic Design
          </p>
          <div
            role="heading"
            aria-level={1}
            className="mt-3 text-[clamp(2.6rem,12vw,5.6rem)] font-medium leading-[0.9] tracking-[-0.07em] text-foreground"
          >
            Brandon PT Davis
          </div>
          <p className="mx-auto mt-5 max-w-[25rem] text-[1rem] leading-7 text-foreground/58">
            Portfolio, current productions, studio writing, and contact links collected for social profiles.
          </p>

          <div className="mt-7 flex items-center justify-center gap-2.5">
            <a
              href="https://instagram.com/brandonptdavisdesign"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/44 hover:text-foreground"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/44 hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://www.pinterest.com/BrandonPTDavis/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pinterest"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/24 text-foreground/62 transition-colors hover:border-border/44 hover:text-foreground"
            >
              <PinterestIcon className="h-4 w-4" />
            </a>
            <a
              href="mailto:info@brandonptdavis.com"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/88"
            >
              Contact
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </section>

        <section className="py-6">
          <SectionHeader kicker="Start Here" title="Primary links" />
          <div>
            {primaryLinks.map((item) => (
              <PrimaryLinkRow key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="py-8">
          <SectionHeader kicker="Recent Work" title="Selected portfolio entries" />
          <div>
            {recentProjects.map((item, index) => (
              <PreviewRow key={item.id} item={item} priority={index < 2} />
            ))}
          </div>
          <div className="pt-5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/58 transition-colors hover:text-foreground"
            >
              View full portfolio
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>

        <section className="py-8">
          <SectionHeader kicker="Studio" title="Articles and tutorials" />
          <div>
            {studioLinks.map((item) => (
              <PreviewRow key={item.id} item={item} />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 pt-5">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/58 transition-colors hover:text-foreground"
            >
              <Newspaper className="h-3.5 w-3.5" />
              Articles
            </Link>
            <Link
              href="/studio/tutorials"
              className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/58 transition-colors hover:text-foreground"
            >
              <Video className="h-3.5 w-3.5" />
              Tutorials
            </Link>
            <Link
              href="/assistant-scenic-design"
              className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/58 transition-colors hover:text-foreground"
            >
              <PenTool className="h-3.5 w-3.5" />
              Assistant scenic design
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
