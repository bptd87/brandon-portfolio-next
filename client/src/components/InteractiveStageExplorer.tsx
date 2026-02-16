import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection } from "./AnimatedSection";

const stageElements = [
  {
    id: "light",
    label: "Light",
    color: "#FFF9C4",
    description: "Direction, quality, color temperature—light defines mood and time."
  },
  {
    id: "scale",
    label: "Scale",
    color: "#E1BEE7",
    description: "Proportion reveals intimacy or grandeur. Scale is emotional."
  },
  {
    id: "texture",
    label: "Texture",
    color: "#BCAAA4",
    description: "Surface tells history. Worn, polished, raw—each carries memory."
  },
  {
    id: "color",
    label: "Color",
    color: "#EF5350",
    description: "Palette drives emotion. Warm, cool, saturated, muted—color is language."
  },
  {
    id: "depth",
    label: "Depth",
    color: "#64B5F6",
    description: "Layering space creates mystery. Foreground, middle, vanishing point."
  },
  {
    id: "line",
    label: "Line",
    color: "#81C784",
    description: "Vertical, horizontal, diagonal—lines guide the eye and frame action."
  },
  {
    id: "material",
    label: "Material",
    color: "#FFB74D",
    description: "Wood, metal, fabric, stone. Each material speaks its own truth."
  },
  {
    id: "negative",
    label: "Negative Space",
    color: "#90A4AE",
    description: "What you don't build matters as much as what you do. Emptiness has weight."
  }
];

export function InteractiveStageExplorer() {
  const [activeElement, setActiveElement] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const active = activeElement 
    ? stageElements.find(el => el.id === activeElement)
    : hoveredElement
    ? stageElements.find(el => el.id === hoveredElement)
    : null;

  return (
    <section className="py-32 border-t border-border overflow-hidden">
      <div className="container max-w-6xl">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Design Elements
            </h2>
            <p className="text-lg text-muted-foreground">
              Click to explore the building blocks of spatial storytelling
            </p>
          </div>
        </AnimatedSection>

        {/* Interactive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stageElements.map((element, index) => (
            <motion.button
              key={element.id}
              onClick={() => setActiveElement(activeElement === element.id ? null : element.id)}
              onHoverStart={() => setHoveredElement(element.id)}
              onHoverEnd={() => setHoveredElement(null)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: active?.id === element.id ? element.color : '#1a1a1a'
              }}
            >
              {/* Gradient overlay */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${element.color}40, transparent)`
                }}
              />

              {/* Label */}
              <div className="relative z-10 h-full flex items-center justify-center p-4">
                <motion.span
                  className="text-lg md:text-xl font-bold text-center"
                  animate={{
                    color: active?.id === element.id ? '#000000' : '#ffffff'
                  }}
                >
                  {element.label}
                </motion.span>
              </div>

              {/* Active indicator */}
              <AnimatePresence>
                {activeElement === element.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full"
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Description Panel */}
        <div className="relative h-32 md:h-24">
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center max-w-2xl">
                  <motion.div
                    className="inline-block w-16 h-1 mb-6 rounded-full"
                    style={{ backgroundColor: active.color }}
                    layoutId="activeBar"
                  />
                  <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light">
                    {active.description}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <p className="text-lg text-muted-foreground/50 italic">
                Hover or tap an element to learn more
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
