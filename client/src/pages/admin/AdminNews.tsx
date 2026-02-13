import { AdminLayout } from "@/components/admin/AdminLayout";
import { NewsManager } from "@/components/admin/NewsManager";

export default function AdminNews() {
    return (
        <AdminLayout
            title="News & Updates"
            description="Manage news announcements and industry updates."
        >
            <NewsManager />
        </AdminLayout>
    );
}
