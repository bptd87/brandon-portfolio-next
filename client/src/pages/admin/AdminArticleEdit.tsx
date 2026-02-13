import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BlockArticleEditor } from "@/components/admin/BlockArticleEditor";
import { useParams, useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminArticleEdit() {
    const { user, loading, isAuthenticated } = useAuth();
    const params = useParams<{ id: string }>();
    const [, navigate] = useLocation();
    const articleId = params.id ? parseInt(params.id) : undefined;

    if (loading) {
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
            title={articleId ? "Edit Article" : "New Article"}
            description={articleId ? "Refine your article content and metadata." : "Compose a new article or design story."}
        >
            <BlockArticleEditor
                articleId={articleId}
                onSave={() => navigate("/admin/articles")}
                onCancel={() => navigate("/admin/articles")}
            />
        </AdminLayout>
    );
}
