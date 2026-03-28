import { permanentRedirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{ filter?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const { filter } = await searchParams;
  const normalized = String(filter || "").trim().toLowerCase();

  switch (normalized) {
    case "rendering":
      permanentRedirect("/projects/rendering");
    case "experiential":
    case "documentation":
      permanentRedirect("/projects/experiential");
    case "scenic":
    default:
      permanentRedirect("/projects");
  }
}
