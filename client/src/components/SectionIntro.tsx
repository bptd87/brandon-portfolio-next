import type { ElementType, ReactNode } from "react";

type SectionIntroTone = "dark" | "light" | "publishing" | "profile" | "hybrid";
type SectionIntroAlign = "left" | "center";
type SectionIntroSize = "compact" | "default" | "hero";

type SectionIntroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  tone?: SectionIntroTone;
  align?: SectionIntroAlign;
  size?: SectionIntroSize;
  titleAs?: ElementType;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
};

const toneClasses: Record<
  SectionIntroTone,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  dark: {
    eyebrow: "section-kicker text-white/42",
    title: "text-white",
    description: "text-white/62",
  },
  light: {
    eyebrow: "section-kicker text-foreground/42",
    title: "text-foreground",
    description: "text-foreground/62",
  },
  publishing: {
    eyebrow: "section-kicker text-[#111111]/42",
    title: "text-[#111111]",
    description: "text-[#111111]/62",
  },
  profile: {
    eyebrow: "section-kicker text-foreground/42",
    title: "text-foreground/58",
    description: "text-foreground/58",
  },
  hybrid: {
    eyebrow: "section-kicker text-black/48",
    title: "text-black",
    description: "text-black/62",
  },
};

const sizeClasses: Record<
  SectionIntroSize,
  {
    title: string;
    description: string;
  }
> = {
  compact: {
    title: "font-sans text-[1.2rem] font-medium tracking-[-0.04em]",
    description: "mt-4 max-w-2xl text-[0.98rem] leading-7",
  },
  default: {
    title:
      "font-sans text-[clamp(2.1rem,4vw,3.2rem)] font-medium leading-[1] tracking-[-0.05em]",
    description: "mt-5 max-w-3xl text-[1rem] leading-7 md:text-[1.08rem]",
  },
  hero: {
    title:
      "font-sans text-[clamp(3rem,6vw,5.4rem)] font-medium leading-[0.94] tracking-[-0.065em]",
    description: "mt-7 max-w-3xl text-[1.06rem] leading-8 md:text-[1.14rem]",
  },
};

export default function SectionIntro({
  eyebrow,
  title,
  description,
  actions,
  tone = "dark",
  align = "left",
  size = "default",
  titleAs: TitleTag = "h2",
  className = "",
  eyebrowClassName = "",
  titleClassName = "",
  descriptionClassName = "",
  actionsClassName = "",
}: SectionIntroProps) {
  const toneClass = toneClasses[tone];
  const sizeClass = sizeClasses[size];
  const alignClass = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`${alignClass} ${className}`.trim()}>
      {eyebrow ? (
        <p className={`${toneClass.eyebrow} ${eyebrowClassName}`.trim()}>
          {eyebrow}
        </p>
      ) : null}
      <TitleTag
        className={`${sizeClass.title} ${toneClass.title} ${titleClassName}`.trim()}
      >
        {title}
      </TitleTag>
      {description ? (
        <p
          className={`${sizeClass.description} ${toneClass.description} ${descriptionClassName}`.trim()}
        >
          {description}
        </p>
      ) : null}
      {actions ? (
        <div className={`${actionsClassName}`.trim()}>{actions}</div>
      ) : null}
    </div>
  );
}
