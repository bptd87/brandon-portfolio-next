import React from "react";
import { Link, useLocation } from "wouter";
import {
    FolderKanban,
    Newspaper,
    FileText,
    FolderTree,
    Tag as TagIcon,
    LayoutDashboard,
    BarChart3,
    ExternalLink,
    Settings,
    LogOut,
    User,
    GraduationCap,
    Users,
    Library,
    Image as ImageIcon,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { AdminMobileNav } from "./AdminMobileNav";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
    const [location] = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
        { href: "/admin/rendering-gallery", icon: ImageIcon, label: "Render Gallery" },
        { href: "/admin/experiential-gallery", icon: Sparkles, label: "Exp. Gallery" },
        { href: "/admin/news", icon: Newspaper, label: "News" },
        { href: "/admin/articles", icon: FileText, label: "Articles" },
        { href: "/admin/categories", icon: FolderTree, label: "Categories" },
        { href: "/admin/tags", icon: TagIcon, label: "Tags" },
        { href: "/admin/tutorials", icon: GraduationCap, label: "Tutorials" },
        { href: "/admin/scenic-directory", icon: Library, label: "Scenic Directory" },
        { href: "/admin/collaborators", icon: Users, label: "Collaborators" },
        { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    ];

    const currentItem = navItems.find(n => {
        if (n.href === "/admin") return location === "/admin";
        return location.startsWith(n.href);
    });

    const handleSignOut = async () => {
        await logout();
    };

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background text-foreground">
            {/* Mobile Navigation */}
            <AdminMobileNav user={user as { name: string; role: string } | undefined} onSignOut={handleSignOut} />

            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex w-64 border-r bg-card/30 backdrop-blur-sm flex-col flex-shrink-0">
                <div className="p-6 border-b">
                    <Link href="/admin">
                        <div className="flex items-center gap-2 font-serif text-xl font-bold cursor-pointer group">
                            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                                B
                            </div>
                            <span className="tracking-tighter">ADMIN</span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = item.href === "/admin"
                            ? location === "/admin"
                            : location.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}>
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t space-y-4">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground bg-muted/20 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden">
                            {user?.name ? user.name[0].toUpperCase() : <User className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="flex flex-col truncate">
                            <span className="text-foreground font-medium truncate">{user?.name || "Admin"}</span>
                            <span className="text-xs truncate opacity-70">{user?.role}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="sm" className="justify-start gap-2 h-8 text-xs" asChild>
                            <a href="/" target="_blank">
                                <ExternalLink className="h-3 w-3" />
                                View Site
                            </a>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="justify-start gap-2 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-3 w-3" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
                {/* Desktop Header */}
                <header className="hidden md:flex border-b bg-background/50 backdrop-blur-sm h-14 items-center px-8 border-l border-l-border/10">
                    <div className="flex-1 flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        <Link href="/admin">
                            <span className="hover:text-primary cursor-pointer transition-colors">Admin</span>
                        </Link>
                        {location !== "/admin" && (
                            <>
                                <span className="mx-2 opacity-30">/</span>
                                <span className="text-foreground">{currentItem?.label || "Page"}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 group">
                            <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
                    <div className="p-4 md:p-8 lg:p-12">
                        <div className="w-full md:max-w-6xl md:mx-auto space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {(title || description) && (
                                <div className="space-y-1">
                                    {title && <h2 className="text-2xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">{title}</h2>}
                                    {description && <p className="text-base md:text-lg text-muted-foreground">{description}</p>}
                                </div>
                            )}
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
