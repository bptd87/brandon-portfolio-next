import React, { useState } from "react";
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
    Menu,
    X,
    GraduationCap,
    Users,
    Library,
    Image as ImageIcon,
    Box,
    Sparkles,
    Home,
    Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminMobileNavProps {
    user?: { name: string; role: string };
    onSignOut: () => void;
}

export function AdminMobileNav({ user, onSignOut }: AdminMobileNavProps) {
    const [location] = useLocation();
    const [open, setOpen] = useState(false);

    const navItems = [
        { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/projects", icon: FolderKanban, label: "Projects" },
        { href: "/admin/rendering-gallery", icon: ImageIcon, label: "Render Gallery" },
        { href: "/admin/model-gallery", icon: Box, label: "Model Gallery" },
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

    const handleNavClick = () => {
        setOpen(false);
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <div className="md:hidden flex items-center justify-between border-b bg-card p-4">
                <Link href="/admin">
                    <div className="flex items-center gap-2 font-serif text-lg font-bold cursor-pointer">
                        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                            B
                        </div>
                        <span className="tracking-tighter">ADMIN</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        asChild
                    >
                        <a href="/" target="_blank" rel="noreferrer" title="Go to home">
                            <Home className="h-4 w-4" />
                        </a>
                    </Button>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                </div>
            </div>

            <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b">
                        <Link href="/admin">
                            <div
                                className="flex items-center gap-2 font-serif text-xl font-bold cursor-pointer"
                                onClick={handleNavClick}
                            >
                                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
                                    B
                                </div>
                                <span className="tracking-tighter">ADMIN</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = item.href === "/admin"
                                ? location === "/admin"
                                : location.startsWith(item.href);
                            const Icon = item.icon;

                            return (
                                <Link key={item.href} href={item.href}>
                                    <div
                                        onClick={handleNavClick}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t space-y-3">
                        <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground bg-muted/20 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-xs font-bold">
                                {user?.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="flex flex-col truncate min-w-0">
                                <span className="text-foreground font-medium truncate text-xs">
                                    {user?.name || "Admin"}
                                </span>
                                <span className="text-xs truncate opacity-70">{user?.role}</span>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="justify-start gap-2 h-8 w-full text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                                handleNavClick();
                                onSignOut();
                            }}
                        >
                            <span>Sign Out</span>
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
