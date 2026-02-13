import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default function AdminProjects() {
    return (
        <AdminLayout
            title="Portfolio Projects"
            description="Manage your projects, case studies, and gallery images."
        >
            <ProjectsManager />
        </AdminLayout>
    );
}
