import RoscoPaintCalculatorPage from "../../../../client/src/pages/RoscoPaintCalculator";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "Rosco Paint Calculator for Scenic Color Mixing",
    description:
      "Generate Rosco Off-Broadway paint recipes and scenic color mixes for samples, elevations, and production paint workflow.",
    pathname: "/studio/apps/rosco-paint-calculator",
    image: "/assets/studio-apps/icons/rosco-paint-calculator.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "Rosco",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/assets/studio-apps/icons/rosco-paint-calculator-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/rosco-paint-calculator">
      <RoscoPaintCalculatorPage />
    </NextPathProvider>
  );
}
