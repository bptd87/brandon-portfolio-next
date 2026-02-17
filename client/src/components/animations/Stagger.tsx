import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface StaggerListProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    delay?: number; // Initial delay before staggering starts
}

export function StaggerList({
    children,
    className = "",
    staggerDelay = 0.1,
    delay = 0,
}: StaggerListProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: ReactNode;
    className?: string;
    dramatic?: boolean; // More intense entrance animation
}

export function StaggerItem({ children, className = "", dramatic = false }: StaggerItemProps) {
    const variants: Variants = dramatic
        ? {
            hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: 8 },
            show: { 
                opacity: 1, 
                y: 0, 
                scale: 1, 
                rotateX: 0,
                transition: { 
                    duration: 0.8, 
                    ease: [0.25, 0.46, 0.45, 0.94] // Custom easing curve
                } 
            },
        }
        : {
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
        };

    return (
        <motion.div
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
