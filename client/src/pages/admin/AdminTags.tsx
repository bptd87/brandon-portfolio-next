import { AdminLayout } from "@/components/admin/AdminLayout";
import { TagsManager } from "@/components/admin/TagsManager";

export default function AdminTags() {
    return (
        <AdminLayout
            title="Article & News Tags"
            description="Manage tags used for article and news filtering/cross-linking."
        >
            <TagsManager />
        </AdminLayout>
    );
}
