import { ContactPage } from "../../components/site/ContactPage";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Contact Brandon PT Davis",
  description:
    "Contact Brandon PT Davis for scenic design inquiries, production details, schedules, and collaboration.",
  pathname: "/contact",
});

export default function Contact() {
  return <ContactPage />;
}
