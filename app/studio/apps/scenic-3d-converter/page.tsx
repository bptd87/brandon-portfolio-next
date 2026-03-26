import Scenic3DConverterPage from "../../../../client/src/pages/Scenic3DConverter";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";

export const dynamic = "force-static";

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/scenic-3d-converter">
      <Scenic3DConverterPage />
    </NextPathProvider>
  );
}
