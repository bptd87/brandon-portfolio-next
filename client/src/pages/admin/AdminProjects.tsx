import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default function AdminProjects() {
    return (
        <AdminLayout
            title="Scenic Design Projects"
            description="Manage your scenic design portfolio projects and case studies."
        >
            <ProjectsManager />
        </AdminLayout>
    );
}
