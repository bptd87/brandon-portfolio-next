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

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (resendApiKey && contactFromEmail && contactToEmail) {
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: parsed.data.email,
      subject: `New Contact Form Submission: ${parsed.data.subject}`,
      text: `From: ${parsed.data.name} (${parsed.data.email})\nSubject: ${parsed.data.subject}\n\nMessage:\n${parsed.data.message}`,
    });
  }

  return NextResponse.json({ success: true });
}
