"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
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
};

export default function ProfileSectionHero({
  canonicalPath,
  description,
  descriptionClassName = "",
  imageAlt,
  imageSrc,
  title,
  updatedAt,
  label = "Update",
}: ProfileSectionHeroProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `https://www.brandonptdavis.com${canonicalPath}`;
    }

    return `${window.location.origin}${canonicalPath}`;
  }, [canonicalPath]);

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
    <section className="relative overflow-hidden bg-[#f1f0ec] px-[clamp(1.5rem,5vw,6rem)] pb-10 pt-10 text-[#111111] md:pb-14 md:pt-14">
      <div className="mx-auto flex w-full max-w-[74rem] flex-col items-center text-center">
        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-black/46">
          {label}
          <span className="px-2 text-black/28">•</span>
          <time>{updatedAt}</time>
        </p>

        <h1 className="mt-5 max-w-[10.5ch] text-balance font-sans text-[clamp(2.75rem,6.4vw,6.25rem)] font-medium leading-[0.9] tracking-[-0.078em] text-[#111111]">
          {title}
        </h1>

        <p className={`mt-4 max-w-[42rem] text-balance text-[clamp(1.02rem,1.45vw,1.34rem)] font-medium leading-[1.12] tracking-[-0.04em] text-black/72 ${descriptionClassName}`}>
          {description}
        </p>

        <div className="mt-6 flex w-full max-w-[44rem] items-center justify-center gap-2.5 text-black/48">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black"
            aria-label={linkCopied ? "Link copied" : "Copy page link"}
          >
            {linkCopied ? <Check className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
          </button>
          <a
            href={emailShareUrl}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Share by email"
          >
            <Mail className="h-5 w-5" />
          </a>
          <a
            href={linkedInShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
        </div>

        <div className="relative mt-8 h-[min(45vw,27rem)] min-h-[14rem] w-[min(76vw,40rem)]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 40rem, 76vw"
            className="object-contain drop-shadow-[0_32px_70px_rgba(17,17,17,0.2)]"
          />
        </div>
      </div>
    </section>
  );
}
