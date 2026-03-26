import ScaleCalculatorPage from "../../../../client/src/pages/ScaleCalculator";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";

export const dynamic = "force-static";

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/scale-calculator">
      <ScaleCalculatorPage />
    </NextPathProvider>
  );
}
