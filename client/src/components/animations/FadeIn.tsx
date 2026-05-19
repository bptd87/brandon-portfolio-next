import { motion, useInView, useReducedMotion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    fullWidth?: boolean;
}

export function FadeIn({
    children,
    className = "",
    delay = 0,
    duration = 0.5,
    direction = "up",
    fullWidth = false,
}: FadeInProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const prefersReducedMotion = useReducedMotion();
    const [forceVisible, setForceVisible] = useState(false);

    const getInitial = () => {
        switch (direction) {
            case "up":
                return { opacity: 0, y: 40 };
            case "down":
                return { opacity: 0, y: -40 };
            case "left":
                return { opacity: 0, x: 40 };
            case "right":
                return { opacity: 0, x: -40 };
            case "none":
                return { opacity: 0 };
        }
    };

    useEffect(() => {
        const fallbackDelay = Math.max(900, (delay + duration) * 1000 + 250);
        const fallback = window.setTimeout(() => setForceVisible(true), fallbackDelay);

        return () => window.clearTimeout(fallback);
    }, [delay, duration]);

    const visible = prefersReducedMotion || isInView || forceVisible;
    const visibleState = { opacity: 1, x: 0, y: 0 };

    return (
        <motion.div
            ref={ref}
            initial={getInitial()}
            animate={visible ? visibleState : getInitial()}
            transition={{ duration, delay, ease: "easeOut" }}
            className={`${fullWidth ? "w-full" : ""} ${className}`}
        >
            {children}
        </motion.div>
    );
}
