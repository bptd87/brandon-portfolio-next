import Scenic3DConverterPage from "../../../../client/src/pages/Scenic3DConverter";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "Scenic 3D Converter for Vectorworks",
    description:
      "Download a Mac or Windows utility that keeps Vectorworks files lighter by converting 3D handoffs locally into USD, USDZ, and 3DM formats.",
    pathname: "/studio/apps/scenic-3d-converter",
    image: "/assets/studio-apps/icons/scenic-3d-converter.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "3D Convert",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/assets/studio-apps/icons/scenic-3d-converter-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/scenic-3d-converter">
      <Scenic3DConverterPage />
    </NextPathProvider>
  );
}
