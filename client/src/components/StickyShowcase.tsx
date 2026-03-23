import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

import { ProgressiveImage } from "@/components/ProgressiveImage";

export interface StickyShowcaseItem {
  id: number | string;
  slug: string;
  title: string;
  client?: string | null;
  year?: number | string | null;
  coverImageUrl?: string | null;
}

interface StickyShowcaseProps {
  continuationItems?: StickyShowcaseItem[];
  desktopColumns?: 3 | 4;
  featuredItem: StickyShowcaseItem;
  hideFeaturedCredit?: boolean;
  intro?: string;
  itemAlt: (title: string) => string;
  itemHref: (item: StickyShowcaseItem) => string;
  leadAspectClassName?: string;
  leadImageAspectRatio?: string;
  leadOverlayTitle?: boolean;
  naturalRailDesktop?: boolean;
  leadTitleClassName?: string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  railItems: StickyShowcaseItem[];
  title?: string;
}

function ShowcaseCard({
  copyClassName,
  item,
  itemAlt,
  itemHref,
  onNavigate,
  sizes,
}: {
  copyClassName?: string;
  item: StickyShowcaseItem;
  itemAlt: (title: string) => string;
  itemHref: (item: StickyShowcaseItem) => string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  sizes: string;
}) {
  const href = itemHref(item);

  return (
    <a href={href} onClick={(event) => onNavigate(event, href)} className="group block">
      <div
        data-showcase-card-media="true"
        className="transition-card relative aspect-square overflow-hidden rounded-xl bg-background/50"
        style={{ viewTransitionName: `project-card-${item.slug}` } as CSSProperties}
      >
        {item.coverImageUrl ? (
          <ProgressiveImage
            src={item.coverImageUrl}
            alt={itemAlt(item.title)}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
            aspectRatio="1/1"
            smartPosition={true}
            loading="eager"
            sizes={sizes}
          />
        ) : (
          <div className="h-full w-full bg-muted" />
        )}
      </div>

      <div data-showcase-card-copy="true" className={copyClassName || "pt-4"}>
        <p className="text-[1.06rem] font-medium tracking-[-0.024em] text-white/88">
          {item.title}
        </p>
        {(item.client || item.year) ? (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tracking-[-0.01em]">
            {item.client ? <span className="text-white/82">{item.client}</span> : null}
            {item.year ? <span className="text-white/42">{item.year}</span> : null}
          </div>
        ) : null}
      </div>
    </a>
  );
}

export function StickyShowcase({
  continuationItems,
  desktopColumns = 4,
  featuredItem,
  hideFeaturedCredit = false,
  intro,
  itemAlt,
  itemHref,
  leadAspectClassName,
  leadImageAspectRatio,
  leadOverlayTitle = false,
  naturalRailDesktop = false,
  leadTitleClassName,
  onNavigate,
  railItems,
  title,
}: StickyShowcaseProps) {
  const desktopItems = railItems.slice(0, 3);
  const mobileItems = [featuredItem, ...railItems, ...(continuationItems || [])];
  const stageRef = useRef<HTMLDivElement | null>(null);
  const leadSlotRef = useRef<HTMLDivElement | null>(null);
  const leadMediaRef = useRef<HTMLDivElement | null>(null);
  const leadStickyRef = useRef<HTMLDivElement | null>(null);
  const railSlotRef = useRef<HTMLDivElement | null>(null);
  const desktopRailRef = useRef<HTMLDivElement | null>(null);
  const [stageHeight, setStageHeight] = useState<number | null>(null);
  const [stickyHeight, setStickyHeight] = useState<number | null>(null);
  const [railShift, setRailShift] = useState(0);
  const [stageMode, setStageMode] = useState<"static" | "fixed" | "bottom">("static");
  const [desktopMetrics, setDesktopMetrics] = useState<{
    leadLeft: number;
    leadWidth: number;
    railLeft: number;
    railWidth: number;
  } | null>(null);
  const featuredCredit = [featuredItem.title, featuredItem.client, featuredItem.year]
    .filter(Boolean)
    .join(" · ");
  const visibleFeaturedCredit = hideFeaturedCredit ? "" : featuredCredit;
  const hasLeadCopy = Boolean(visibleFeaturedCredit || title || intro);
  const showBelowTitle = Boolean(title && !leadOverlayTitle);
  const desktopGridClassName = desktopColumns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  const desktopLeadColSpanClassName = desktopColumns === 3 ? "lg:col-span-2" : "lg:col-span-3";
  const desktopRailColSpanClassName = "lg:col-span-1";
  const desktopStickyClassName = "lg:sticky lg:top-[74px]";
  const showFeaturedMeta = Boolean(featuredItem.client || featuredItem.year);

  useLayoutEffect(() => {
    const measure = () => {
      if (typeof window === "undefined" || window.innerWidth < 1024) {
        setStageHeight(null);
        setStickyHeight(null);
        setRailShift(0);
        setStageMode("static");
        setDesktopMetrics(null);
        return;
      }

      const stage = stageRef.current;
      const leadSlot = leadSlotRef.current;
      const leadMedia = leadMediaRef.current;
      const leadSticky = leadStickyRef.current;
      const railSlot = railSlotRef.current;
      const rail = desktopRailRef.current;

      if (!stage || !leadSlot || !leadMedia || !leadSticky || !railSlot || !rail) {
        setStageHeight(null);
        setStickyHeight(null);
        setRailShift(0);
        setStageMode("static");
        setDesktopMetrics(null);
        return;
      }

      const mediaBlocks = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-showcase-card-media='true']")
      );
      const railCardShells = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-showcase-card-shell='true']")
      );
      const leadImageHeight = leadMedia.offsetHeight;
      const stickyBlockHeight = leadSticky.offsetHeight;
      const thirdImageBottom =
        mediaBlocks.length >= 3 && railCardShells.length >= 3
          ? railCardShells[2].offsetTop + mediaBlocks[2].offsetHeight
          : rail.scrollHeight;
      const releaseDistance = Math.max(0, thirdImageBottom - leadImageHeight);
      const sectionTop = stage.getBoundingClientRect().top + window.scrollY;
      const start = sectionTop - 74;
      const end = start + releaseDistance;
      const progress = Math.max(0, Math.min(window.scrollY - start, releaseDistance));
      const leadSlotRect = leadSlot.getBoundingClientRect();
      const railSlotRect = railSlot.getBoundingClientRect();

      setStickyHeight(Math.ceil(stickyBlockHeight));
      setStageHeight(Math.ceil(stickyBlockHeight + releaseDistance));
      setRailShift(progress);
      setDesktopMetrics({
        leadLeft: Math.round(leadSlotRect.left),
        leadWidth: Math.round(leadSlotRect.width),
        railLeft: Math.round(railSlotRect.left),
        railWidth: Math.round(railSlotRect.width),
      });

      if (window.scrollY < start) {
        setStageMode("static");
      } else if (window.scrollY >= end) {
        setStageMode("bottom");
      } else {
        setStageMode("fixed");
      }
    };

    measure();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;

      if (resizeObserver) {
        if (stageRef.current) resizeObserver.observe(stageRef.current);
        if (leadSlotRef.current) resizeObserver.observe(leadSlotRef.current);
        if (leadMediaRef.current) resizeObserver.observe(leadMediaRef.current);
        if (leadStickyRef.current) resizeObserver.observe(leadStickyRef.current);
        if (railSlotRef.current) resizeObserver.observe(railSlotRef.current);
        if (desktopRailRef.current) resizeObserver.observe(desktopRailRef.current);
      }

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [desktopColumns, desktopItems.length, railItems, title]);

  const leadPinnedStyle =
    desktopMetrics && stickyHeight
      ? stageMode === "fixed"
        ? ({
            position: "fixed",
            top: "74px",
            left: `${desktopMetrics.leadLeft}px`,
            width: `${desktopMetrics.leadWidth}px`,
            zIndex: 20,
          } as CSSProperties)
        : stageMode === "bottom"
          ? ({
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
            } as CSSProperties)
          : undefined
      : undefined;

  const railViewportStyle =
    desktopMetrics && stickyHeight
      ? stageMode === "fixed"
        ? ({
            position: "fixed",
            top: "74px",
            left: `${desktopMetrics.railLeft}px`,
            width: `${desktopMetrics.railWidth}px`,
            height: `${stickyHeight}px`,
            overflow: "hidden",
            zIndex: 20,
          } as CSSProperties)
        : stageMode === "bottom"
          ? ({
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: `${stickyHeight}px`,
              overflow: "hidden",
            } as CSSProperties)
          : ({
              height: `${stickyHeight}px`,
              overflow: "hidden",
            } as CSSProperties)
      : stickyHeight
        ? ({
            height: `${stickyHeight}px`,
            overflow: "hidden",
          } as CSSProperties)
        : undefined;

  return (
    <section className="pt-8 md:pt-10">
      <div className="container max-w-[88rem]">
        <div className="space-y-8 md:hidden">
          {mobileItems.map((item, index) => (
            <ShowcaseCard
              key={`mobile-${item.id}`}
              item={item}
              itemAlt={itemAlt}
              itemHref={itemHref}
              onNavigate={onNavigate}
              sizes="100vw"
            />
          ))}
        </div>

        <div
          ref={stageRef}
          className={`relative hidden md:grid grid-cols-1 gap-6 md:gap-8 ${desktopGridClassName} ${
            naturalRailDesktop ? "lg:gap-10" : "lg:gap-6 xl:gap-8"
          }`}
          style={stageHeight ? { height: `${stageHeight}px` } : undefined}
        >
          <div
            ref={leadSlotRef}
            className={`${desktopLeadColSpanClassName} relative`}
            style={stickyHeight ? { minHeight: `${stickyHeight}px` } : undefined}
          >
            <div ref={leadStickyRef} className="lg:self-start" style={leadPinnedStyle}>
              <a
                href={itemHref(featuredItem)}
                onClick={(event) => onNavigate(event, itemHref(featuredItem))}
                className="group block"
              >
                <div
                  ref={leadMediaRef}
                  className={`transition-card relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50 md:aspect-[4/3] ${
                    leadAspectClassName || "lg:aspect-[16/9]"
                  }`}
                  style={{ viewTransitionName: `project-card-${featuredItem.slug}` } as CSSProperties}
                >
                  {featuredItem.coverImageUrl ? (
                    <ProgressiveImage
                      src={featuredItem.coverImageUrl}
                      alt={itemAlt(featuredItem.title)}
                      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                      aspectRatio={leadImageAspectRatio || "16/9"}
                      smartPosition={true}
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                  {leadOverlayTitle && title ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/26 to-transparent px-6 pb-6 pt-16 md:px-8 md:pb-7">
                      <h1
                        className={`max-w-[16ch] font-sans text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white ${
                          leadTitleClassName || ""
                        }`}
                      >
                        {title}
                      </h1>
                    </div>
                  ) : null}
                </div>

                {hasLeadCopy ? (
                  <div className="max-w-2xl pt-5 md:pt-6">
                    {showBelowTitle ? (
                      <h1
                        className={`max-w-[12ch] font-sans text-[clamp(1.85rem,3.3vw,3.1rem)] font-medium leading-[0.94] tracking-[-0.06em] text-white ${
                          leadTitleClassName || ""
                        }`}
                      >
                        {title}
                      </h1>
                    ) : null}
                    {visibleFeaturedCredit ? (
                      <p className={showFeaturedMeta ? "mt-2 text-sm tracking-[-0.01em] text-white/52" : "mt-3 text-sm tracking-[-0.01em] text-white/52"}>
                        {visibleFeaturedCredit}
                      </p>
                    ) : null}
                    {showFeaturedMeta ? (
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm tracking-[-0.01em]">
                        {featuredItem.client ? (
                          <span className="text-white/82">{featuredItem.client}</span>
                        ) : null}
                        {featuredItem.year ? (
                          <span className="text-white/42">{featuredItem.year}</span>
                        ) : null}
                      </div>
                    ) : null}
                    {intro ? (
                      <p className="mt-3 max-w-xl text-[0.98rem] leading-7 text-white/62 md:text-[1.05rem]">
                        {intro}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </a>
            </div>
          </div>

          <div
            ref={railSlotRef}
            className={`hidden ${desktopRailColSpanClassName} relative lg:block`}
            style={stickyHeight ? { minHeight: `${stickyHeight}px` } : undefined}
          >
            <div style={railViewportStyle}>
              <div
                ref={desktopRailRef}
                className="relative space-y-10 will-change-transform"
                style={{ transform: `translateY(-${railShift}px)` }}
              >
                {desktopItems.map((item, index) => (
                  <div key={item.id} className="relative" data-showcase-card-shell="true">
                    <ShowcaseCard
                      copyClassName="pt-4"
                      item={item}
                      itemAlt={itemAlt}
                      itemHref={itemHref}
                      onNavigate={onNavigate}
                      sizes="24vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:hidden">
            {desktopItems.map((item, index) => (
              <div key={item.id} className="relative">
                <ShowcaseCard
                  copyClassName="pt-4"
                  item={item}
                  itemAlt={itemAlt}
                  itemHref={itemHref}
                  onNavigate={onNavigate}
                  sizes="(max-width: 1024px) 33vw, 24vw"
                />
              </div>
            ))}
          </div>
        </div>

        {continuationItems && continuationItems.length > 0 ? (
          <div className="pt-2 md:pt-3">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {continuationItems.map((item, index) => (
                <ShowcaseCard
                  key={item.id}
                  copyClassName="pt-4"
                  item={item}
                  itemAlt={itemAlt}
                  itemHref={itemHref}
                  onNavigate={onNavigate}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
