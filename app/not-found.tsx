import NotFoundPage from "../client/src/pages/NotFound";
import { NextPathProvider } from "../components/routing/NextPathProvider";

export default function NotFound() {
  return (
    <NextPathProvider currentPath="/404">
      <NotFoundPage />
    </NextPathProvider>
  );
}
