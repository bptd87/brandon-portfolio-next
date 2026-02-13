import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ScenicDirectoryForm } from "@/components/admin/ScenicDirectoryForm";
import { useParams } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminScenicDirectoryEdit() {
    const { user, loading, isAuthenticated } = useAuth();
    const params = useParams<{ id: string }>();
    const entryId = params.id ? parseInt(params.id) : undefined;

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>{!isAuthenticated ? "Admin Access Required" : "Access Denied"}</CardTitle>
                        <CardDescription>{!isAuthenticated ? "Please sign in to access the admin panel." : "You do not have permission to access this page."}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isAuthenticated && <Button asChild className="w-full"><a href={getLoginUrl("/admin")}>Sign In</a></Button>}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <AdminLayout
            title={entryId ? "Edit Directory Entry" : "New Directory Entry"}
            description={entryId ? "Update organization or supplier details." : "Add a new entry to the scenic directory."}
        >
            <ScenicDirectoryForm entryId={entryId} />
        </AdminLayout>
    );
}
