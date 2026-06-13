"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

type PublishingCardProps = {
  href: string;
  title: string;
  imageUrl?: string | null;
  imageAlt: string;
  metaLabel: string;
  description?: string | null;
  actionLabel?: string;
  eager?: boolean;
};

export default function PublishingCard({
  href,
  title,
  imageUrl,
  imageAlt,
  metaLabel,
  description,
  actionLabel,
  eager = false,
}: PublishingCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_14px_34px_rgba(17,17,17,0.07)] ring-1 ring-black/[0.04] transition-transform duration-500 hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(17,17,17,0.11)]"
    >
      <div className="flex h-full flex-col">
        <div className="publish-card-media transition-card relative aspect-[16/9] overflow-hidden bg-black/[0.04]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              quality={82}
              loading={eager ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 29vw, (min-width: 768px) 30vw, 94vw"
              className="publish-card-image object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="h-full w-full bg-black/[0.04]" />
          )}
        </div>

        <div className="flex min-h-[13.75rem] flex-1 flex-col px-8 pb-8 pt-7">
          <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f6b64]">
            {metaLabel}
          </p>
          <p className="max-w-[27rem] text-[1.55rem] font-semibold leading-[1.02] tracking-[-0.058em] text-[#111111] transition-colors duration-500 group-hover:text-[#6f2dff]">
            {title}
          </p>
          {description ? (
            <p className="mt-4 max-w-[28rem] text-[0.95rem] leading-6 tracking-[-0.01em] text-[#6f6b64]">
              {description}
            </p>
          ) : null}
          {actionLabel ? (
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-[1rem] font-semibold tracking-[-0.025em] text-[#6f6b64] transition-colors group-hover:text-[#111111]">
              {actionLabel}
              <ArrowRight className="h-4 w-4" />
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
