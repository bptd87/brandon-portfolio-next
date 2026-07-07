import DimensionReferencePage from "../../../../client/src/pages/DimensionReference";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "Dimension Reference for Scenic, Event, and Exhibit Design",
    description:
      "Reference dimensions for furniture, theatre, events, exhibits, and architecture in a fast mobile-friendly lookup tool.",
    pathname: "/studio/apps/dimension-reference",
    image: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/dimension-reference.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "Dimensions",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "https://geybz3ysejafe4kj.public.blob.vercel-storage.com/images/site-assets/assets/studio-apps/icons/dimension-reference-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/dimension-reference">
      <DimensionReferencePage />
    </NextPathProvider>
  );
}
