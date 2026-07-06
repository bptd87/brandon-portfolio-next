"use client";

import Image from "next/image";
import { useState } from "react";
import type { ReactNode } from "react";
import { Check, Facebook, Link2, Linkedin, Mail } from "lucide-react";

import { copyTextToClipboard } from "@/lib/clipboard";
import { HOME_BODY_FONT, HOME_DISPLAY_FONT, useHomeTheme } from "@/lib/homeTheme";

type ProfileSectionHeroProps = {
  canonicalPath: string;
  description: string;
  descriptionClassName?: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
  titleContent?: ReactNode;
  titleClassName?: string;
  updatedAt: string;
  label?: string;
  showImage?: boolean;
  tone?: "light" | "dark";
  lightBackgroundClassName?: string;
  lightBackgroundColor?: string;
  lightInkColor?: string;
  lightMutedColor?: string;
};

const SITE_URL = "https://www.brandonptdavis.com";

export default function ProfileSectionHero({
  canonicalPath,
  description,
  descriptionClassName = "",
  imageAlt,
  imageSrc,
  title,
  titleContent,
  titleClassName = "",
  updatedAt,
  label = "Update",
  showImage = true,
  tone = "light",
  lightBackgroundClassName = "bg-background",
  lightBackgroundColor,
  lightInkColor,
  lightMutedColor,
}: ProfileSectionHeroProps) {
  const { homeTheme } = useHomeTheme();
  const [linkCopied, setLinkCopied] = useState(false);
  const isDark = tone === "dark";
  const resolvedBackgroundColor = lightBackgroundColor || homeTheme.bg;
  const resolvedInkColor = lightInkColor || homeTheme.ink;
  const resolvedMutedColor = lightMutedColor || homeTheme.muted;

  const safeCanonicalPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
  const pageUrl = `${SITE_URL}${safeCanonicalPath}`;

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(pageUrl);
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(pageUrl);
    setLinkCopied(copied);

    if (copied) {
      window.setTimeout(() => setLinkCopied(false), 1800);
    }
  };

  return (
    <section
      className={`relative overflow-visible px-[clamp(1.5rem,5vw,6rem)] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(6.75rem,11vw,9rem)] ${
        isDark ? "bg-black text-white" : `${lightBackgroundClassName} text-foreground`
      }`}
      style={
        !isDark
          ? {
              backgroundColor: resolvedBackgroundColor,
              color: resolvedInkColor,
              fontFamily: HOME_BODY_FONT,
            }
          : { fontFamily: HOME_BODY_FONT }
      }
    >
      <div className="mx-auto flex w-full max-w-[74rem] flex-col items-center text-center">
        <p
          className={`text-[0.72rem] font-black uppercase leading-none tracking-[0.09em] ${isDark ? "text-white/46" : ""}`}
          style={
            !isDark
              ? { color: resolvedMutedColor, fontFamily: HOME_DISPLAY_FONT }
              : { fontFamily: HOME_DISPLAY_FONT }
          }
        >
          {label}
          <span className={`px-2 ${isDark ? "text-white/28" : ""}`}>•</span>
          <time>{updatedAt}</time>
        </p>

        <h1
          className={`mt-5 max-w-[12em] text-balance text-[clamp(3.2rem,5.7vw,6.85rem)] font-black uppercase leading-[0.82] tracking-[0] ${isDark ? "text-white" : ""} ${titleClassName}`}
          style={
            !isDark
              ? { color: resolvedInkColor, fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }
              : { fontFamily: HOME_DISPLAY_FONT, fontStretch: "condensed" }
          }
        >
          {titleContent || title}
        </h1>

        <p
          className={`mt-4 max-w-[39rem] text-balance text-[clamp(0.98rem,1.18vw,1.1rem)] font-semibold leading-[1.35] tracking-[-0.01em] ${
            isDark ? "text-white/72" : ""
          } ${descriptionClassName}`}
          style={!isDark ? { color: resolvedMutedColor } : undefined}
        >
          {description}
        </p>

        <div
          className={`mt-6 flex w-full max-w-[44rem] items-center justify-center gap-2.5 ${isDark ? "text-white/48" : ""}`}
          style={!isDark ? { color: resolvedMutedColor } : undefined}
        >
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/5 hover:text-black"
            }`}
            aria-label={linkCopied ? "Link copied" : "Copy page link"}
          >
            {linkCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
          </button>
          <a
            href={emailShareUrl}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/5 hover:text-black"
            }`}
            aria-label="Share by email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/5 hover:text-black"
            }`}
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
              isDark ? "hover:bg-white/10 hover:text-white" : "hover:bg-black/5 hover:text-black"
            }`}
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>

        {showImage ? (
          <div className="site-media-square relative isolate mt-8 h-[min(45vw,27rem)] min-h-[14rem] w-[min(76vw,40rem)] overflow-hidden rounded-[1.65rem]">
            <div
              className={`pointer-events-none absolute inset-[18%] -z-10 rounded-full blur-3xl ${
                isDark
                  ? "bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent-articles)_42%,transparent)_0%,color-mix(in_oklch,var(--accent-articles)_16%,transparent)_36%,rgba(255,255,255,0)_72%)]"
                  : "bg-[radial-gradient(circle,rgba(17,17,17,0.12)_0%,rgba(17,17,17,0.06)_34%,rgba(17,17,17,0)_70%)]"
              }`}
              aria-hidden="true"
            />
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 40rem, 76vw"
              className={`site-media-square rounded-[1.65rem] object-contain ${
                isDark
                  ? "drop-shadow-[0_28px_80px_color-mix(in_oklch,var(--accent-articles)_34%,transparent)]"
                  : "mix-blend-multiply"
              }`}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
