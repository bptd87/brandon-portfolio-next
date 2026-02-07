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
  'Design Philosophy': {
    badge: 'bg-purple-500/90 backdrop-blur-sm',
    text: 'text-purple-500',
    hover: 'hover:bg-purple-500/20 hover:border-purple-500',
    rgb: '168, 85, 247', // Purple
    hex: '#A855F7',
  },
  'Musical Theatre & Cinema': {
    badge: 'bg-rose-500/90 backdrop-blur-sm',
    text: 'text-rose-500',
    hover: 'hover:bg-rose-500/20 hover:border-rose-500',
    rgb: '244, 63, 94', // Rose
    hex: '#F43F5E',
  },
  'Scenic Design Process': {
    badge: 'bg-coral-500/90 backdrop-blur-sm',
    text: 'text-coral-500',
    hover: 'hover:bg-coral-500/20 hover:border-coral-500',
    rgb: '255, 107, 107', // Coral
    hex: '#FF6B6B',
  },
  'Technology & Tutorials': {
    badge: 'bg-cyan-500/90 backdrop-blur-sm',
    text: 'text-cyan-500',
    hover: 'hover:bg-cyan-500/20 hover:border-cyan-500',
    rgb: '6, 182, 212', // Cyan
    hex: '#06B6D4',
  },
  'Themed Entertainment': {
    badge: 'bg-emerald-500/90 backdrop-blur-sm',
    text: 'text-emerald-500',
    hover: 'hover:bg-emerald-500/20 hover:border-emerald-500',
    rgb: '16, 185, 129', // Emerald
    hex: '#10B981',
  },
};

// Default color for uncategorized articles
export const defaultCategoryColor: CategoryColor = {
  badge: 'bg-slate-500/90 backdrop-blur-sm',
  text: 'text-slate-400',
  hover: 'hover:bg-slate-500/20 hover:border-slate-500',
  rgb: '100, 116, 139', // Slate
  hex: '#64748B',
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
  return `${color.badge} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider`;
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
