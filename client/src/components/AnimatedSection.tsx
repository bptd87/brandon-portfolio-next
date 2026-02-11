import { FadeIn } from "./animations/FadeIn";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps) {
  return (
    <FadeIn className={className} delay={delay / 1000}>
      {children}
    </FadeIn>
  );
}
