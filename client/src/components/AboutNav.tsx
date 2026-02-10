import { Link, useLocation } from "wouter";

export default function AboutNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/about", label: "About" },
    { path: "/resume", label: "Resume/CV" },
    { path: "/creative-statement", label: "Creative Statement" },
    { path: "/about/philosophy", label: "Teaching Philosophy" },
    { path: "/about/collaborators", label: "Collaborators" },
  ];

  return (
    <nav className="border-b border-border mb-12">
      <div className="container">
        <div className="flex gap-8 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  py-4 px-2 border-b-2 transition-colors whitespace-nowrap font-pixel text-xs
                  ${
                    isActive
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
