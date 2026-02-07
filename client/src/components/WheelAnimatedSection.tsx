import { useWheelScrollAnimation } from "@/hooks/useWheelScrollAnimation";

interface WheelAnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function WheelAnimatedSection({ children, className = "" }: WheelAnimatedSectionProps) {
  const { ref, style } = useWheelScrollAnimation();

  return (
    <div
      ref={ref}
      style={style}
      className={className}
    >
      {children}
    </div>
  );
}
