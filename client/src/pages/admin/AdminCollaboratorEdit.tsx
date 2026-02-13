import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CollaboratorForm } from "@/components/admin/CollaboratorForm";
import { useParams } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminCollaboratorEdit() {
    const { user, loading, isAuthenticated } = useAuth();
    const params = useParams<{ id: string }>();
    const collaboratorId = params.id ? parseInt(params.id) : undefined;

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
            title={collaboratorId ? "Edit Collaborator" : "New Collaborator"}
            description={collaboratorId ? "Update partner info and social links." : "Add a new creative collaborator."}
        >
            <CollaboratorForm collaboratorId={collaboratorId} />
        </AdminLayout>
    );
}
