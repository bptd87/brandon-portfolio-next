import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const contactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  subject: z.string().min(1).max(255),
  message: z.string().min(1).max(5000),
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;
const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
const contactToEmail = process.env.CONTACT_TO_EMAIL;

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const userAgent = request.headers.get("user-agent") || "";

  if (supabaseUrl && supabaseServiceKey) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      ip_address: ip.split(",")[0]?.trim() || ip,
      user_agent: userAgent,
      source: "next-contact-form",
      status: "new",
    });

    if (error) {
      return NextResponse.json({ error: "Failed to store contact submission." }, { status: 500 });
    }
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
