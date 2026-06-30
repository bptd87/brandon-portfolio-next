"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { Link } from "wouter";

import { ExternalLinkPreview } from "@/components/ExternalLinkPreview";
import { SEO } from "@/components/SEO";
import {
  LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG,
  LEARNING_PORTAL_ARTICLE_SLUG_SET,
  RETIRED_LEARNING_ARTICLE_SLUG_SET,
} from "@shared/learningPortal";
import { getLocalArticles } from "@shared/localArticles";
import { getLocalScenicProjects } from "@shared/localScenicProjects";

const ABOUT_HEADSHOT_URL =
  "https://mpdddsg3xfx9bmy7.public.blob.vercel-storage.com/images/about/page/Brandon%20PT%20Davis%20headshot%202026.webp";

const STUDIO_APP_TILES: FeedTile[] = [
  {
    id: "app-scale-calculator",
    title: "Scale Calculator",
    label: "Scenic Tool",
    href: "/studio/apps/scale-calculator",
    image: "/assets/studio-apps/icons/scale-calculator.jpg",
  },
  {
    id: "app-dimension-reference",
    title: "Dimension Reference",
    label: "Scenic Tool",
    href: "/studio/apps/dimension-reference",
    image: "/assets/studio-apps/icons/dimension-reference.jpg",
  },
  {
    id: "app-rosco-paint-calculator",
    title: "Rosco Paint Calculator",
    label: "Paint Shop",
    href: "/studio/apps/rosco-paint-calculator",
    image: "/assets/studio-apps/icons/rosco-paint-calculator.jpg",
  },
];

type FeedTile = {
  id: string;
  title: string;
  label: string;
  href: string;
  image?: string | null;
  external?: boolean;
  timestamp?: number;
};

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

const isRenderingContent = (value: { title?: string | null; slug?: string | null; category?: string | null; categoryName?: string | null }) => {
  const text = `${value.title || ""} ${value.slug || ""} ${value.category || ""} ${value.categoryName || ""}`;
  return /\brender(ing|ings)?\b/i.test(text);
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
    if (href.startsWith("http")) {
      return (
        <ExternalLinkPreview className={className} href={href}>
          {children}
        </ExternalLinkPreview>
      );
    }

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

function FeedCard({ item, priority }: { item: FeedTile; priority?: boolean }) {
  return (
    <SmartLink
      href={item.href}
      external={item.external}
      className="group flex h-full min-w-0 flex-col border-b border-r border-black/8 bg-[#f4f5f7] outline-none ring-0 transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-black/70"
    >
      <div className="site-media-square relative aspect-[4/5] w-full overflow-hidden border-b border-black/8 bg-black/[0.035] [border-radius:0]">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="site-media-square object-cover [border-radius:0]"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(17,17,17,0.08),rgba(17,17,17,0.025))]" />
        )}
      </div>
      <div className="flex min-h-[4.85rem] flex-1 flex-col px-2 py-2.5 sm:min-h-[6.4rem] sm:px-3 sm:py-3.5 md:min-h-[7.25rem] md:px-4 md:py-4">
        <p className="truncate text-[0.46rem] font-semibold uppercase tracking-[0.12em] text-black/42 sm:text-[0.58rem]">
          {item.label}
        </p>
        <div className="mt-1.5 line-clamp-2 text-[0.72rem] font-medium leading-[0.92] tracking-[-0.05em] text-black transition-colors group-hover:text-black/62 sm:text-[1rem] md:text-[1.22rem]">
          {item.title}
        </div>
      </div>
    </SmartLink>
  );
}

export default function Links() {
  const feedTiles = useMemo(() => {
    const scenicProjects = getLocalScenicProjects()
      .filter((project) => project.coverImageUrl)
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .slice(0, 12)
      .map<FeedTile>((project) => ({
        id: `scenic-${project.slug}`,
        title: project.title,
        label: project.client || "Scenic Design",
        href: `/project/${project.slug}`,
        image: project.coverImageUrl,
        timestamp: timestampForPortfolioItem(project),
      }));

    const articles = getLocalArticles();
    const articleTiles = articles
      .filter(
        (article) =>
          !LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug) &&
          !RETIRED_LEARNING_ARTICLE_SLUG_SET.has(article.slug) &&
          !isRenderingContent(article)
      )
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .filter((article) => article.coverImageUrl)
      .slice(0, 4)
      .map<FeedTile>((article) => ({
        id: `article-${article.slug}`,
        title: article.title,
        label: "Scenic Design Article",
        href: `/articles/${article.slug}`,
        image: article.coverImageUrl,
        timestamp: timestampForPortfolioItem(article),
      }));

    const learningArticleTiles = articles
      .filter((article) => LEARNING_PORTAL_ARTICLE_SLUG_SET.has(article.slug))
      .filter((article) => !isRenderingContent(article))
      .sort((a, b) => timestampForPortfolioItem(b) - timestampForPortfolioItem(a))
      .filter((article) => article.coverImageUrl)
      .slice(0, 2)
      .map<FeedTile>((article) => ({
        id: `learning-${article.slug}`,
        title: article.title,
        label: LEARNING_PORTAL_ARTICLE_CATEGORY_BY_SLUG[article.slug] || "Article",
        href: `/articles/${article.slug}`,
        image: article.coverImageUrl,
        timestamp: timestampForPortfolioItem(article),
      }));

    const datedTiles = [
      ...scenicProjects,
      ...articleTiles,
      ...learningArticleTiles,
    ].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return [...datedTiles, ...STUDIO_APP_TILES];
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] [--background:#ffffff] [--border:rgba(17,17,17,0.14)] [--foreground:#111111]">
      <SEO
        title="Links | Brandon PT Davis"
        description="Social links, portfolio, articles, and current work from scenic designer Brandon PT Davis."
      />

      <main className="w-full pb-16 pt-5 sm:pt-8">
        <section className="mx-auto flex max-w-xl flex-col items-center px-5 pb-5 text-center sm:pb-7">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.26em] text-black/42">
            Scenic Design
          </p>
          <div
            role="heading"
            aria-level={1}
            className="mt-2 text-[clamp(2rem,9vw,4rem)] font-medium leading-[0.92] tracking-[-0.065em] text-black"
          >
            Brandon PT Davis
          </div>
          <p className="mt-3 max-w-[21rem] text-[0.88rem] leading-6 text-black/58">
            Recent scenic design work, production photos, process notes, and studio updates.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2">
            <ExternalLinkPreview
              href="https://instagram.com/brandonptdavisdesign"
              aria-label="Instagram"
              previewLabel="Instagram"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-black/58 transition-colors hover:border-black/24 hover:text-black"
            >
              <Instagram className="h-4 w-4" />
            </ExternalLinkPreview>
            <ExternalLinkPreview
              href="https://linkedin.com/in/brandonptdavis"
              aria-label="LinkedIn"
              previewLabel="LinkedIn"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-black/58 transition-colors hover:border-black/24 hover:text-black"
            >
              <Linkedin className="h-4 w-4" />
            </ExternalLinkPreview>
            <ExternalLinkPreview
              href="https://www.pinterest.com/BrandonPTDavis/"
              aria-label="Pinterest"
              previewLabel="Pinterest"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-black/58 transition-colors hover:border-black/24 hover:text-black"
            >
              <PinterestIcon className="h-4 w-4" />
            </ExternalLinkPreview>
            <a
              href="mailto:info@brandonptdavis.com"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-black px-3.5 text-[0.82rem] font-medium text-white transition-colors hover:bg-black/80"
            >
              Contact
              <Mail className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <section
          aria-label="Latest scenic design updates"
          className="grid grid-cols-3 border-l border-t border-black/8 bg-[#f4f5f7] [grid-auto-rows:1fr] md:grid-cols-4"
        >
          {feedTiles.map((item, index) => (
            <FeedCard key={item.id} item={item} priority={index < 6} />
          ))}
        </section>
      </main>
    </div>
  );
}
