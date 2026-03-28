import Scenic3DConverterPage from "../../../../client/src/pages/Scenic3DConverter";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic 3D Converter for Vectorworks on Mac",
  description:
    "Download a Mac utility that converts 3D files locally into Vectorworks-friendly USD, USDZ, and 3DM formats for scenic design workflow.",
  pathname: "/studio/apps/scenic-3d-converter",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/scenic-3d-converter">
      <Scenic3DConverterPage />
    </NextPathProvider>
  );
}
