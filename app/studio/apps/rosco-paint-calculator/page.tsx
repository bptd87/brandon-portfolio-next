import RoscoPaintCalculatorPage from "../../../../client/src/pages/RoscoPaintCalculator";
import { NextPathProvider } from "../../../../components/routing/NextPathProvider";

export const dynamic = "force-static";

export default function Page() {
  return (
    <NextPathProvider currentPath="/studio/apps/rosco-paint-calculator">
      <RoscoPaintCalculatorPage />
    </NextPathProvider>
  );
}
