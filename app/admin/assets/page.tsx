import { AdminShell } from "../../../components/admin/AdminShell";
import { buildPageMetadata } from "../../../lib/metadata";
import { AssetManager } from "../../../components/admin/AssetManager";

export const metadata = buildPageMetadata({
  title: "Admin Assets",
  description: "Browse and manage asset URLs and storage paths.",
  pathname: "/admin/assets",
  noindex: true,
});

export default function AdminAssetsPage() {
  return (
    <AdminShell
      currentPath="/admin/assets"
      eyebrow="Assets"
      title="Browse media and copy public URLs."
      description="Use this focused media browser when you want to inspect a library, preview files, and copy the exact URL or asset reference for a static page."
    >
      <AssetManager
        title="Assets"
        description="Search, inspect, copy, and delete assets by bucket and prefix."
        standalone={false}
        mode="assets"
        initialPrefix="portfolio/shared/"
        initialUploadPath="portfolio/shared/"
      />
    </AdminShell>
  );
}
