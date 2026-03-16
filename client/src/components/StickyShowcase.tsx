import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";

const STICKY_TOP = 96;
const DESKTOP_BREAKPOINT = 1024;

export interface StickyShowcaseItem {
  id: number | string;
  slug: string;
  title: string;
  client?: string | null;
  year?: number | string | null;
  coverImageUrl?: string | null;
}

interface StickyShowcaseProps {
  accentColors: readonly string[];
  featuredItem: StickyShowcaseItem;
  intro?: string;
  itemAlt: (title: string) => string;
  itemHref: (item: StickyShowcaseItem) => string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
  railItems: StickyShowcaseItem[];
  title?: string;
}

import { ProgressiveImage } from "@/components/ProgressiveImage";

export function StickyShowcase({
  accentColors,
  featuredItem,
  intro,
  itemAlt,
  itemHref,
  onNavigate,
  railItems,
  title,
}: StickyShowcaseProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const leadSlotRef = useRef<HTMLDivElement | null>(null);
  const leadContentRef = useRef<HTMLDivElement | null>(null);
  const railTrackRef = useRef<HTMLDivElement | null>(null);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [railViewportHeight, setRailViewportHeight] = useState<number | null>(null);
  const [leadHeight, setLeadHeight] = useState<number | null>(null);
  const [leadFixedMetrics, setLeadFixedMetrics] = useState<{ left: number; width: number } | null>(
    null
  );
  const [leadMode, setLeadMode] = useState<"static" | "fixed" | "bottom">("static");
  const [railOffset, setRailOffset] = useState(0);
  const desktopItems = railItems.slice(0, 3);
  const featuredCredit = [featuredItem.title, featuredItem.client, featuredItem.year]
    .filter(Boolean)
    .join(" · ");
  const hasLeadCopy = Boolean(featuredCredit || title || intro);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const measure = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT || desktopItems.length < 3) {
        setSectionHeight(null);
        setRailViewportHeight(null);
        setLeadHeight(null);
        setLeadFixedMetrics(null);
        setLeadMode("static");
        setRailOffset(0);
        return;
      }

      const leadSlot = leadSlotRef.current;
      const sticky = leadContentRef.current;
      const railTrack = railTrackRef.current;
      const firstCard = railTrack?.querySelector("[data-showcase-card]") as HTMLElement | null;

      if (!leadSlot || !sticky || !railTrack || !firstCard) return;

      const stickyHeight = sticky.getBoundingClientRect().height;
      const leadSlotRect = leadSlot.getBoundingClientRect();
      const trackStyles = window.getComputedStyle(railTrack);
      const gap = Number.parseFloat(trackStyles.rowGap || trackStyles.gap || "24");
      const cardHeight = firstCard.getBoundingClientRect().height;
      const revealDistance = cardHeight + gap;

      setLeadHeight(Math.ceil(stickyHeight));
      setLeadFixedMetrics({
        left: Math.round(leadSlotRect.left),
        width: Math.round(leadSlotRect.width),
      });
      setRailViewportHeight(Math.ceil(cardHeight * 2 + gap));
      setSectionHeight(Math.ceil(stickyHeight + revealDistance));
    };

    measure();

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measure()) : null;

    if (resizeObserver) {
      if (leadSlotRef.current) resizeObserver.observe(leadSlotRef.current);
      if (leadContentRef.current) resizeObserver.observe(leadContentRef.current);
      if (railTrackRef.current) resizeObserver.observe(railTrackRef.current);
    }

    window.addEventListener("resize", measure);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktopItems.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateRail = () => {
      if (
        window.innerWidth < DESKTOP_BREAKPOINT ||
        !sectionHeight ||
        !railViewportHeight ||
        !leadHeight
      ) {
        setLeadMode("static");
        setRailOffset(0);
        return;
      }

      const section = sectionRef.current;
      const railTrack = railTrackRef.current;
      const firstCard = railTrack?.querySelector("[data-showcase-card]") as HTMLElement | null;

      if (!section || !railTrack || !firstCard) return;

      const gap = Number.parseFloat(
        window.getComputedStyle(railTrack).rowGap || window.getComputedStyle(railTrack).gap || "24"
      );
      const maxOffset = firstCard.getBoundingClientRect().height + gap;
      const sectionRect = section.getBoundingClientRect();
      const chapterStart = sectionRect.top - STICKY_TOP;
      const rawProgress = -chapterStart;
      const nextOffset = Math.max(0, Math.min(maxOffset, rawProgress));

      setRailOffset(nextOffset);

      const releasePoint = STICKY_TOP + leadHeight;

      if (sectionRect.top > STICKY_TOP) {
        setLeadMode("static");
      } else if (sectionRect.bottom <= releasePoint) {
        setLeadMode("bottom");
      } else {
        setLeadMode("fixed");
      }
    };

    updateRail();
    window.addEventListener("scroll", updateRail, { passive: true });
    window.addEventListener("resize", updateRail);

    return () => {
      window.removeEventListener("scroll", updateRail);
      window.removeEventListener("resize", updateRail);
    };
  }, [railViewportHeight, sectionHeight]);

  const desktopLeadStyle =
    leadFixedMetrics && leadHeight
      ? ((): CSSProperties | undefined => {
          if (leadMode === "fixed") {
            return {
              position: "fixed",
              top: `${STICKY_TOP}px`,
              left: `${leadFixedMetrics.left}px`,
              width: `${leadFixedMetrics.width}px`,
            };
          }

          if (leadMode === "bottom") {
            return {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
            };
          }

          return undefined;
        })()
      : undefined;

  return (
    <section
      ref={sectionRef}
      className="pt-8 md:pt-10"
    >
      <div
        className="container max-w-6xl"
        style={sectionHeight ? ({ height: `${sectionHeight}px` } as CSSProperties) : undefined}
      >
        <div className="grid gap-8 lg:h-full lg:grid-cols-4 lg:gap-6">
          <div
            ref={leadSlotRef}
            className="relative lg:col-span-3 lg:h-full"
            style={
              leadHeight
                ? ({
                    minHeight: `${leadHeight}px`,
                    ...(sectionHeight ? { height: `${sectionHeight}px` } : {}),
                  } as CSSProperties)
                : undefined
            }
          >
            <div ref={leadContentRef} style={desktopLeadStyle}>
              <a
                href={itemHref(featuredItem)}
                onClick={(event) => onNavigate(event, itemHref(featuredItem))}
                className="group block"
              >
                <div
                  className="transition-card relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50 md:aspect-[4/3] lg:aspect-[16/7.8]"
                  style={
                    {
                      viewTransitionName: `project-card-${featuredItem.slug}`,
                    } as CSSProperties
                  }
                >
                  {featuredItem.coverImageUrl ? (
                    <ProgressiveImage
                      src={featuredItem.coverImageUrl}
                      alt={itemAlt(featuredItem.title)}
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                      aspectRatio="16/7.8"
                      smartPosition={true}
                      loading="eager"
                      fetchPriority="high"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
              </a>

              {hasLeadCopy ? (
                <div className="max-w-3xl pt-4 md:pt-5">
                  {featuredCredit ? (
                    <p className="text-sm tracking-[-0.01em] text-foreground/52">{featuredCredit}</p>
                  ) : null}
                  {title ? (
                    <h1 className="mt-3 font-sans text-[clamp(1.45rem,2vw,2rem)] font-semibold leading-[1] tracking-[-0.045em] text-foreground lg:whitespace-nowrap">
                      {title}
                    </h1>
                  ) : null}
                  {intro ? (
                    <p className="mt-3 max-w-2xl text-[0.98rem] leading-7 text-foreground/62 md:text-[1.05rem]">
                      {intro}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6 lg:hidden">
            {railItems.map((item, index) => {
              const href = itemHref(item);
              const accentColor = accentColors[(index + 1) % accentColors.length];

              return (
                <a
                  key={item.id}
                  href={href}
                  onClick={(event) => onNavigate(event, href)}
                  className="group block"
                >
                  <div
                    className="transition-card relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50"
                    style={{ viewTransitionName: `project-card-${item.slug}` } as CSSProperties}
                  >
                    {item.coverImageUrl ? (
                      <ProgressiveImage
                        src={item.coverImageUrl}
                        alt={itemAlt(item.title)}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        aspectRatio="1/1"
                        smartPosition={true}
                        loading="eager"
                        sizes="(max-width: 1024px) 65vw, 24vw"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted" />
                    )}
                  </div>
                  <div className="pt-3">
                    <p
                      className="text-[1.02rem] font-normal tracking-[-0.02em]"
                      style={{ color: accentColor }}
                    >
                      {item.title}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="hidden lg:col-span-1 lg:block">
              <div
                className="overflow-hidden"
                style={
                  railViewportHeight
                    ? ({ height: `${railViewportHeight}px` } as CSSProperties)
                    : undefined
                }
              >
                <div
                  ref={railTrackRef}
                  className="grid gap-6 will-change-transform"
                  style={{ transform: `translateY(-${railOffset}px)` }}
                >
                  {desktopItems.map((item, index) => {
                    const href = itemHref(item);
                    const accentColor = accentColors[(index + 1) % accentColors.length];

                    return (
                      <a
                        key={item.id}
                        href={href}
                        onClick={(event) => onNavigate(event, href)}
                        className="group block"
                        data-showcase-card
                      >
                        <div
                          className="transition-card relative aspect-[1/1] overflow-hidden rounded-xl bg-background/50"
                          style={{ viewTransitionName: `project-card-${item.slug}` } as CSSProperties}
                        >
                          {item.coverImageUrl ? (
                            <ProgressiveImage
                              src={item.coverImageUrl}
                              alt={itemAlt(item.title)}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                              aspectRatio="1/1"
                              smartPosition={true}
                              loading="eager"
                              sizes="24vw"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted" />
                          )}
                        </div>
                        <div className="pt-3">
                          <p
                            className="text-[1.02rem] font-normal tracking-[-0.02em]"
                            style={{ color: accentColor }}
                          >
                            {item.title}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
