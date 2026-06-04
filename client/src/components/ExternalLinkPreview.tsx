"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ExternalLinkPreviewProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  children: ReactNode;
  href: string;
  imageSrc?: string;
  preview?: boolean;
  previewLabel?: string;
};

const PREVIEW_WIDTH = 260;
const PREVIEW_HEIGHT = 162;
const PREVIEW_MARGIN = 16;

function canPreviewUrl(href: string) {
  return /^https?:\/\//i.test(href) && !/\.(pdf|zip|docx?|xlsx?)(\?|#|$)/i.test(href);
}

function getPreviewMeta(href: string, previewLabel?: string) {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");

    return {
      host,
      label: previewLabel || host,
      path: url.pathname && url.pathname !== "/" ? url.pathname.replace(/\/$/, "") : "External site",
    };
  } catch {
    return {
      host: "External link",
      label: previewLabel || "External link",
      path: "External site",
    };
  }
}

function getPreviewPosition(anchor: HTMLAnchorElement) {
  const rect = anchor.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const centeredLeft = rect.left + rect.width / 2 - PREVIEW_WIDTH / 2;
  const left = Math.min(
    Math.max(centeredLeft, PREVIEW_MARGIN),
    viewportWidth - PREVIEW_WIDTH - PREVIEW_MARGIN
  );
  const topAbove = rect.top - PREVIEW_HEIGHT - 18;
  const topBelow = rect.bottom + 18;
  const top =
    topAbove >= PREVIEW_MARGIN
      ? topAbove
      : Math.min(topBelow, viewportHeight - PREVIEW_HEIGHT - PREVIEW_MARGIN);

  return { left, top };
}

export function ExternalLinkPreview({
  children,
  className,
  href,
  imageSrc,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  preview = true,
  previewLabel,
  rel,
  target,
  ...props
}: ExternalLinkPreviewProps) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const previewIntentRef = useRef(false);
  const retryTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [fetchedImageSrc, setFetchedImageSrc] = useState("");
  const [hasFetchedPreview, setHasFetchedPreview] = useState(false);
  const [hasLoadedPreview, setHasLoadedPreview] = useState(false);
  const [previewImageFailed, setPreviewImageFailed] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const previewImageSrc = imageSrc || fetchedImageSrc;
  const isPreviewable = preview && canPreviewUrl(href) && !previewImageFailed;
  const previewMeta = useMemo(() => getPreviewMeta(href, previewLabel), [href, previewLabel]);

  const loadPreview = useCallback(
    (attempt = 0) => {
      setHasFetchedPreview(true);

      fetch(`/api/link-preview?url=${encodeURIComponent(href)}&strategy=screenshot-first`)
        .then((response) => (response.ok ? response.json() : { imageSrc: "" }))
        .then((data: { imageSrc?: string; pending?: boolean; retryAfterMs?: number }) => {
          if (!data.imageSrc) {
            if (data.pending && attempt < 4) {
              retryTimerRef.current = window.setTimeout(() => {
                retryTimerRef.current = null;

                if (previewIntentRef.current) {
                  loadPreview(attempt + 1);
                } else {
                  setHasFetchedPreview(false);
                }
              }, data.retryAfterMs ?? 900);
              return;
            }

            setPreviewImageFailed(true);
            return;
          }

          setFetchedImageSrc(data.imageSrc);

          if (previewIntentRef.current && anchorRef.current) {
            setPosition(getPreviewPosition(anchorRef.current));
            setIsOpen(true);
          }
        })
        .catch(() => {
          setPreviewImageFailed(true);
        });
    },
    [href]
  );

  const openPreview = useCallback(() => {
    if (!isPreviewable || typeof window === "undefined" || !anchorRef.current) return;
    if (!window.matchMedia("(min-width: 768px) and (hover: hover)").matches) return;

    previewIntentRef.current = true;
    setPosition(getPreviewPosition(anchorRef.current));
    setHasLoadedPreview(true);

    if (previewImageSrc) {
      setIsOpen(true);
      return;
    }

    if (hasFetchedPreview) return;

    loadPreview();
  }, [hasFetchedPreview, isPreviewable, loadPreview, previewImageSrc]);

  const closePreview = useCallback(() => {
    previewIntentRef.current = false;
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (!fetchedImageSrc) setHasFetchedPreview(false);
    setIsOpen(false);
  }, [fetchedImageSrc]);

  return (
    <>
      <a
        ref={anchorRef}
        className={className}
        href={href}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        onBlur={(event) => {
          closePreview();
          onBlur?.(event);
        }}
        onFocus={(event) => {
          openPreview();
          onFocus?.(event);
        }}
        onMouseEnter={(event) => {
          openPreview();
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          closePreview();
          onMouseLeave?.(event);
        }}
        {...props}
      >
        {children}
      </a>
      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {isOpen && isPreviewable && previewImageSrc ? (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none fixed z-[120] overflow-hidden rounded-[0.9rem] border border-white/16 bg-[#101010] shadow-[0_26px_70px_rgba(0,0,0,0.32)] ring-1 ring-black/12"
                  style={{
                    left: position.left,
                    top: position.top,
                    width: PREVIEW_WIDTH,
                    height: PREVIEW_HEIGHT,
                  }}
                  initial={reduceMotion ? false : { opacity: 0, y: 8, scale: 0.975 }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.975 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  {hasLoadedPreview && previewImageSrc ? (
                    <img
                      src={previewImageSrc}
                      alt=""
                      className="h-full w-full bg-[#161616] object-cover"
                      loading="eager"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setPreviewImageFailed(true);
                        setIsOpen(false);
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/82 via-black/44 to-transparent px-3 pb-2.5 pt-10">
                    <p className="truncate text-[0.68rem] font-medium uppercase tracking-[0.14em] text-white/76">
                      {previewMeta.host}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body
          )
        : null}
    </>
  );
}
