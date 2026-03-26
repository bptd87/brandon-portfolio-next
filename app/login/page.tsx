import { buildPageMetadata } from "../../lib/metadata";
import { AdminLoginForm } from "../../components/admin/AdminLoginForm";
import { getSafeReturnPath } from "../../lib/auth/admin-session";

type LoginPageProps = {
  searchParams: Promise<{ returnPath?: string }>;
};

export const metadata = buildPageMetadata({
  title: "Admin Login",
  description: "Secure sign-in for the admin workspace.",
  pathname: "/login",
  noindex: true,
});

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const returnPath = getSafeReturnPath(params.returnPath);

  return <AdminLoginForm returnPath={returnPath} />;
}
