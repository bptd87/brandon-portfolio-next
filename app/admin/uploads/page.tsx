import { AdminShell } from "../../../components/admin/AdminShell";
import { buildPageMetadata } from "../../../lib/metadata";
import { AssetManager } from "../../../components/admin/AssetManager";

export const metadata = buildPageMetadata({
  title: "Admin Uploads",
  description: "Upload new assets and copy stable references.",
  pathname: "/admin/uploads",
  noindex: true,
});

export default function AdminUploadsPage() {
  return (
    <AdminShell
      currentPath="/admin/uploads"
      eyebrow="Uploads"
      title="Upload media and use it immediately."
      description="Drop in new files, then preview them and copy the public URLs or asset refs you need for the next static page."
    >
      <AssetManager
        title="Uploads"
        description="Upload files into the media library, then immediately browse and copy stable asset references."
        standalone={false}
        mode="uploads"
        initialPrefix="portfolio/shared/"
        initialUploadPath="portfolio/shared/"
      />
    </AdminShell>
  );
}
