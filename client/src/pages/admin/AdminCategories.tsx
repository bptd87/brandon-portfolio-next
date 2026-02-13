import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export default function AdminCategories() {
    return (
        <AdminLayout
            title="Content Categories"
            description="Organize your projects, news, and articles into structural categories."
        >
            <CategoriesManager />
        </AdminLayout>
    );
}
