import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function buildTeachingPhilosophyPdf() {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
  });

  const stream = new PassThrough();
  const chunks: Buffer[] = [];

  stream.on("data", (chunk) => chunks.push(chunk));

  const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });

  doc.pipe(stream);

  doc.fontSize(24).font("Helvetica-Bold").text("Teaching Philosophy", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(14).font("Helvetica").text("Brandon PT Davis", { align: "center" });
  doc.fontSize(12).text("Scenic Designer", { align: "center" });
  doc.moveDown(2);

  doc.fontSize(11).font("Helvetica");
  doc.text(
    "As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.",
    { align: "justify" }
  );
  doc.moveDown();

  doc.fontSize(14).font("Helvetica-Bold").text("Foundation");
  doc.moveDown(0.5);
  doc.fontSize(11).font("Helvetica");
  doc.text(
    "While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.",
    { align: "justify" }
  );
  doc.moveDown();
  doc.text(
    "I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods such as hand-drafting, perspective sketching, and tactile rendering with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools.",
    { align: "justify" }
  );
  doc.moveDown(1.5);

  doc.fontSize(14).font("Helvetica-Bold").text("Pedagogy");
  doc.moveDown(0.5);
  doc.fontSize(11).font("Helvetica");
  doc.text(
    "Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. I often begin with collaborative projects that build community and confidence before shifting to individually tailored assignments.",
    { align: "justify" }
  );
  doc.moveDown();
  doc.text(
    "Accessibility is a cornerstone of my pedagogy. I integrate digital platforms, supplemental videos, and hybrid tactile-digital assignments to meet students where they are while maintaining rigor.",
    { align: "justify" }
  );
  doc.moveDown(1.5);

  doc.fontSize(14).font("Helvetica-Bold").text("Mentorship");
  doc.moveDown(0.5);
  doc.fontSize(11).font("Helvetica");
  doc.text(
    "My own career trajectory informs my mentorship. I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas. Beyond the classroom, I aim to create a positive design culture where students can exchange ideas, collaborate across disciplines, and build belonging alongside craft.",
    { align: "justify" }
  );
  doc.moveDown(1.5);

  doc.fontSize(14).font("Helvetica-Bold").text("Research");
  doc.moveDown(0.5);
  doc.fontSize(11).font("Helvetica");
  doc.text(
    "I view teaching as a continuous act of research. I bring current industry practices into the classroom while exploring emerging technologies to expand students' toolkits. The classroom is a laboratory for experimentation, where design education stays responsive to shifting industry landscapes.",
    { align: "justify" }
  );
  doc.moveDown(2);

  doc.fontSize(12).font("Helvetica-Oblique").text("Brandon PT Davis", { align: "left" });
  doc.fontSize(10).font("Helvetica").text("Scenic Designer", { align: "left" });

  doc.end();

  return pdfBufferPromise;
}

export async function GET() {
  try {
    const pdfBuffer = await buildTeachingPhilosophyPdf();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="teaching-philosophy.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to generate teaching philosophy PDF.",
      },
      { status: 500 }
    );
  }
}
