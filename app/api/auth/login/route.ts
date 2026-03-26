import { NextResponse } from "next/server";
import { z } from "zod";

import {
  applySessionCookie,
  getSafeReturnPath,
  signInAdminUser,
} from "../../../../lib/auth/admin-session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  returnPath: z.string().optional(),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  try {
    const { accessToken, expiresIn } = await signInAdminUser(
      parsed.data.email,
      parsed.data.password
    );
    const response = NextResponse.json({
      success: true,
      redirectTo: getSafeReturnPath(parsed.data.returnPath),
    });

    applySessionCookie(response, accessToken, expiresIn);

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    const status = message === "Admin access required." ? 403 : 401;

    return NextResponse.json({ error: message }, { status });
  }
}
