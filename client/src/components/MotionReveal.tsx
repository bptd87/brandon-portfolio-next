"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function MotionReveal({
  children,
  className = "",
  delay = 0,
  eager = false,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.16,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  eager?: boolean;
  rootMargin?: string;
  threshold?: number;
}) {
  const revealRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (eager) {
      const reveal = window.setTimeout(() => setIsVisible(true), 80);
      return () => window.clearTimeout(reveal);
    }

    const node = revealRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, rootMargin, threshold]);

  return (
    <div
      ref={revealRef}
      className={`motion-reveal ${isVisible ? "motion-reveal--visible" : ""} ${className} transition-[opacity,transform,filter] duration-[760ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:blur-0`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(2rem)",
        filter: isVisible ? "blur(0)" : "blur(2px)",
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "760ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
