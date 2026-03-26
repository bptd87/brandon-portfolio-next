import Link from "next/link";

type StudioPreviewCardProps = {
  href: string;
  title: string;
  description: string;
  eyebrow?: string;
  meta?: string;
  imageUrl?: string | null;
  imageAlt?: string;
  external?: boolean;
  compact?: boolean;
};

export function StudioPreviewCard({
  href,
  title,
  description,
  eyebrow,
  meta,
  imageUrl,
  imageAlt,
  external,
  compact,
}: StudioPreviewCardProps) {
  const className = `group block ${compact ? "h-full" : ""}`;

  const content = (
      <article className="h-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-white/[0.03] transition-colors hover:border-white/18">
        <div className={`relative overflow-hidden ${compact ? "aspect-[5/4]" : "aspect-[4/3]"}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02]" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        </div>

        <div className="space-y-3 p-5">
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/42">
              {eyebrow}
            </p>
          ) : null}
          <div className="space-y-2">
            <h3 className="text-[1.06rem] font-medium leading-[1.1] tracking-[-0.03em] text-white">
              {title}
            </h3>
            <p className="text-sm leading-7 text-white/56">{description}</p>
          </div>
          {meta ? <p className="text-[0.85rem] text-white/42">{meta}</p> : null}
        </div>
      </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
