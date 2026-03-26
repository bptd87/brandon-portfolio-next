import { AdminShell } from "../../../components/admin/AdminShell";
import { buildPageMetadata } from "../../../lib/metadata";
import { AssetManager } from "../../../components/admin/AssetManager";

export const metadata = buildPageMetadata({
  title: "Admin Snippets",
  description: "Generate copy-ready YAML and MDX snippets from uploaded assets.",
  pathname: "/admin/snippets",
  noindex: true,
});

export default function AdminSnippetsPage() {
  return (
    <AdminShell
      currentPath="/admin/snippets"
      eyebrow="Snippets"
      title="Generate copy-ready blocks for page building."
      description="Pick an asset, preview it, and copy the snippet you want to drop into a static page workflow."
    >
      <AssetManager
        title="Snippets"
        description="Pick an asset and copy the YAML or MDX block you want to hand to Codex for page creation."
        standalone={false}
        mode="snippets"
        initialPrefix="portfolio/shared/"
        initialUploadPath="portfolio/shared/"
      />
    </AdminShell>
  );
}
