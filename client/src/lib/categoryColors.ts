/**
 * Category color mapping utility
 * Provides consistent accent colors for each article category across the site
 */

export interface CategoryColor {
  badge: string; // Tailwind classes for badge background
  text: string; // Tailwind classes for text color
  hover: string; // Tailwind classes for hover effects
  rgb: string; // RGB values for gradients
  hex: string; // Hex color value for inline styles
}

export const categoryColors: Record<string, CategoryColor> = {
  'Profiles & Interviews': {
    badge: 'bg-[#e9e1cf]/90 backdrop-blur-sm',
    text: 'text-[#ff6f00]',
    hover: 'hover:bg-[#ff6f00]/20 hover:border-[#ff6f00]',
    rgb: '255, 111, 0',
    hex: '#FF6F00',
  },
  'Scenic Design': {
    badge: 'bg-[#1385f6]/90 backdrop-blur-sm',
    text: 'text-[#1385f6]',
    hover: 'hover:bg-[#1385f6]/20 hover:border-[#1385f6]',
    rgb: '19, 133, 246',
    hex: '#1385F6',
  },
  'Performance History & Culture': {
    badge: 'bg-[#ff6f00]/90 backdrop-blur-sm',
    text: 'text-[#ff6f00]',
    hover: 'hover:bg-[#ff6f00]/20 hover:border-[#ff6f00]',
    rgb: '255, 111, 0',
    hex: '#FF6F00',
  },
  'Design Process': {
    badge: 'bg-[#3f0050]/90 backdrop-blur-sm',
    text: 'text-[#dc30ff]',
    hover: 'hover:bg-[#dc30ff]/20 hover:border-[#dc30ff]',
    rgb: '220, 48, 255',
    hex: '#DC30FF',
  },
  'Tools & Technology': {
    badge: 'bg-[#35ad62]/90 backdrop-blur-sm',
    text: 'text-[#35ad62]',
    hover: 'hover:bg-[#35ad62]/20 hover:border-[#35ad62]',
    rgb: '53, 173, 98',
    hex: '#35AD62',
  },
  'Themed Entertainment': {
    badge: 'bg-[#ff6f00]/90 backdrop-blur-sm',
    text: 'text-[#ff6f00]',
    hover: 'hover:bg-[#ff6f00]/20 hover:border-[#ff6f00]',
    rgb: '255, 111, 0',
    hex: '#FF6F00',
  },
};

// Default color for uncategorized articles
export const defaultCategoryColor: CategoryColor = {
  badge: 'bg-[#ff6f00]/90 backdrop-blur-sm',
  text: 'text-[#ff6f00]',
  hover: 'hover:bg-[#ff6f00]/20 hover:border-[#ff6f00]',
  rgb: '255, 111, 0',
  hex: '#FF6F00',
};

/**
 * Get category color by category name
 */
export function getCategoryColor(categoryName: string | null | undefined): CategoryColor {
  if (!categoryName) return defaultCategoryColor;
  return categoryColors[categoryName] || defaultCategoryColor;
}

/**
 * Get category badge classes
 */
export function getCategoryBadgeClasses(categoryName: string | null | undefined): string {
  const color = getCategoryColor(categoryName);
  return `${color.badge} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider border border-white/20`;
}

/**
 * Get category text color classes
 */
export function getCategoryTextClasses(categoryName: string | null | undefined): string {
  const color = getCategoryColor(categoryName);
  return color.text;
}

/**
 * Get category hover classes
 */
export function getCategoryHoverClasses(categoryName: string | null | undefined): string {
  const color = getCategoryColor(categoryName);
  return color.hover;
}
