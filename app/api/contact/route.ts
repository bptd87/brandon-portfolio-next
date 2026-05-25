import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

const resendApiKey = process.env.RESEND_API_KEY;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const resendFallbackFromEmail = "Brandon PT Davis <onboarding@resend.dev>";
const resendFallbackToEmail = "brandon@brandonptdavis.com";

function isUnverifiedDomainError(error: unknown) {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as { message?: unknown; statusCode?: unknown };
  return (
    maybeError.statusCode === 403 &&
    typeof maybeError.message === "string" &&
    maybeError.message.toLowerCase().includes("domain is not verified")
  );
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!resendApiKey || !contactFromEmail || !contactToEmail) {
    return NextResponse.json(
      { error: "Contact delivery is not configured yet." },
      { status: 503 }
    );
  }

  try {
    const resend = new Resend(resendApiKey);
    const message = {
      replyTo: parsed.data.email,
      subject: `New Contact Form Submission: ${parsed.data.subject}`,
      text: `From: ${parsed.data.name} (${parsed.data.email})\nSubject: ${parsed.data.subject}\n\nMessage:\n${parsed.data.message}`,
    };

    const result = await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      ...message,
    });

    if (result.error) {
      console.error("Contact form delivery failed", result.error);

      if (isUnverifiedDomainError(result.error)) {
        const fallbackResult = await resend.emails.send({
          from: resendFallbackFromEmail,
          to: resendFallbackToEmail,
          ...message,
        });

        if (!fallbackResult.error) {
          console.warn("Contact form used temporary Resend fallback sender");
          return NextResponse.json({ success: true });
        }

        console.error("Contact form fallback delivery failed", fallbackResult.error);
      }

      return NextResponse.json(
        { error: "Message delivery failed. Please try email instead." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Contact form delivery threw", error);
    return NextResponse.json(
      { error: "Message delivery failed. Please try email instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
