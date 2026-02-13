import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { NewsForm } from "@/components/admin/NewsForm";
import { useParams, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { trpc } from "@/lib/trpc";

export default function AdminNewsEdit() {
    const { user, loading, isAuthenticated } = useAuth();
    const params = useParams<{ id: string }>();
    const [, navigate] = useLocation();
    const newsId = params.id ? parseInt(params.id) : undefined;

    const { data: newsItem, isLoading: isNewsLoading } = trpc.news.getById.useQuery(
        { id: newsId! },
        { enabled: !!newsId }
    );

    if (loading || (newsId && isNewsLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader>
                        <CardTitle>Admin Access Required</CardTitle>
                        <CardDescription>Please sign in to access the admin panel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <a href={getLoginUrl("/admin")}>Sign In</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md mx-4">
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You do not have permission to access this page</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <AdminLayout
            title={newsId ? "Edit News Item" : "New News Item"}
            description={newsId ? "Update your news announcement." : "Share a new update with your audience."}
        >
            <NewsForm
                news={newsItem}
                onClose={() => navigate("/admin/news")}
                onSuccess={() => navigate("/admin/news")}
            />
        </AdminLayout>
    );
}
