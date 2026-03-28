import ScaleCalculatorPage from "../../../../client/src/pages/ScaleCalculator";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scale Calculator for Scenic Drafting and Model Scale",
  description:
    "Convert full-size measurements to model scale for scenic drafting, physical models, and 3D printing workflows.",
  pathname: "/studio/apps/scale-calculator",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/scale-calculator">
      <ScaleCalculatorPage />
    </NextPathProvider>
  );
}
