"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Facebook, Link2, Linkedin, Mail } from "lucide-react";

import { copyTextToClipboard } from "@/lib/clipboard";

type ProfileSectionHeroProps = {
  canonicalPath: string;
  description: string;
  descriptionClassName?: string;
  imageAlt: string;
  imageSrc: string;
  title: string;
  updatedAt: string;
  label?: string;
  tone?: "light" | "dark";
};

const SITE_URL = "https://www.brandonptdavis.com";

export default function ProfileSectionHero({
  canonicalPath,
  description,
  descriptionClassName = "",
  imageAlt,
  imageSrc,
  title,
  updatedAt,
  label = "Update",
  tone = "light",
}: ProfileSectionHeroProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const isDark = tone === "dark";

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
      className={`relative overflow-hidden px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-10 md:pb-14 md:pt-14 ${
        isDark ? "bg-black text-white" : "bg-[#f1f0ec] text-[#111111]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[74rem] flex-col items-center text-center">
        <p className={`text-[0.82rem] font-semibold uppercase tracking-[0.08em] ${isDark ? "text-white/46" : "text-black/46"}`}>
          {label}
          <span className={`px-2 ${isDark ? "text-white/28" : "text-black/28"}`}>•</span>
          <time>{updatedAt}</time>
        </p>

        <h1 className={`mt-5 max-w-[10.5ch] text-balance font-sans text-[clamp(2.75rem,6.4vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.078em] ${isDark ? "text-white" : "text-[#111111]"}`}>
          {title}
        </h1>

        <p
          className={`mt-4 max-w-[42rem] text-balance text-[clamp(1.02rem,1.45vw,1.34rem)] font-medium leading-[1.12] tracking-[-0.04em] ${
            isDark ? "text-white/72" : "text-black/72"
          } ${descriptionClassName}`}
        >
          {description}
        </p>

        <div className={`mt-6 flex w-full max-w-[44rem] items-center justify-center gap-2.5 ${isDark ? "text-white/48" : "text-black/48"}`}>
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

        <div className="site-media-square relative isolate mt-8 h-[min(45vw,27rem)] min-h-[14rem] w-[min(76vw,40rem)]">
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
            className={`site-media-square object-contain ${
              isDark
                ? "drop-shadow-[0_28px_80px_color-mix(in_oklch,var(--accent-articles)_34%,transparent)]"
                : "mix-blend-multiply"
            }`}
          />
        </div>
      </div>
    </section>
  );
}
