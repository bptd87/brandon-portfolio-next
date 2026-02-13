import { AdminLayout } from "@/components/admin/AdminLayout";
import { TagsManager } from "@/components/admin/TagsManager";

export default function AdminTags() {
    return (
        <AdminLayout
            title="Content Tags"
            description="Manage granular tags used for filtering and cross-linking content."
        >
            <TagsManager />
        </AdminLayout>
    );
}
