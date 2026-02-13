import { AdminLayout } from "@/components/admin/AdminLayout";
import { ArticlesManager } from "@/components/admin/ArticlesManager";

export default function AdminArticles() {
    return (
        <AdminLayout
            title="Articles & Writing"
            description="Manage blog posts, design articles, and long-form content."
        >
            <ArticlesManager />
        </AdminLayout>
    );
}
