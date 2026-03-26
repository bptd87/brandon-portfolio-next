import AssistantScenicDesignPage from "../../client/src/pages/AssistantScenicDesign";
import { NextPathProvider } from "../../components/routing/NextPathProvider";
import { buildPageMetadata } from "../../lib/metadata";
import {
  ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
} from "../../shared/localAssistantScenic";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: ASSISTANT_SCENIC_DESIGN_SEO_TITLE,
  description: ASSISTANT_SCENIC_DESIGN_SEO_DESCRIPTION,
  pathname: "/assistant-scenic-design",
  type: "article",
});

export default function Page() {
  return (
    <NextPathProvider currentPath="/assistant-scenic-design">
      <AssistantScenicDesignPage />
    </NextPathProvider>
  );
}
