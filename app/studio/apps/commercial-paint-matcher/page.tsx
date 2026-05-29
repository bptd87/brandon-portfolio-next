import CommercialPaintMatcherPage from "../../../../client/src/pages/CommercialPaintMatcher";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../../../lib/metadata";

export const dynamic = "force-static";

export const metadata = {
  ...buildPageMetadata({
    title: "Commercial Paint Matcher",
    description:
      "Match sampled colors against Sherwin-Williams, Benjamin Moore, and BEHR paint libraries with brand filters.",
    pathname: "/studio/apps/commercial-paint-matcher",
    image: "/assets/studio-apps/icons/commercial-paint-matcher.jpg",
  }),
  appleWebApp: {
    capable: true,
    title: "Paint Match",
    statusBarStyle: "default",
  },
  icons: {
    apple: [
      {
        url: "/assets/studio-apps/icons/commercial-paint-matcher-touch.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/commercial-paint-matcher">
      <CommercialPaintMatcherPage />
    </NextPathProvider>
  );
}
