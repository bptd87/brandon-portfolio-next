"use client";

import { useRouter } from "next/navigation";

export function AdminSignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex h-10 items-center justify-center rounded-full border border-border/40 px-4 text-sm font-medium text-foreground/72 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
    >
      Sign Out
    </button>
  );
}
