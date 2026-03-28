import { ContactPage } from "../../components/site/ContactPage";
import { buildPageMetadata } from "../../lib/metadata";

export const dynamic = "force-static";

export const metadata = buildPageMetadata({
  title: "Scenic Design Contact | Brandon PT Davis",
  description:
    "Contact Brandon PT Davis for scenic design, rendering, teaching, and production collaboration inquiries.",
  pathname: "/contact",
});

export default function Contact() {
  return <ContactPage />;
}
