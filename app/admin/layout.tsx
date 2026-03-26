import { redirect } from "next/navigation";

import { getCurrentAdminUser } from "../../lib/auth/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/login?returnPath=/admin");
  }

  return children;
}
