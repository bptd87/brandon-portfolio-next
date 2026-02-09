import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * Displays hierarchical navigation path with separators
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 text-sm ${className}`}>
      {/* Home link */}
      <Link href="/">
        <a className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
          <Home className="h-4 w-4" />
          <span className="sr-only">Home</span>
        </a>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            
            {isLast || !item.href ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href}>
                <a className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </a>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
