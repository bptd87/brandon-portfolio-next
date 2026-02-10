import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';
import { storagePut } from './storage';

export async function generateTeachingPhilosophyPDF(): Promise<{ success: boolean; url?: string }> {
  try {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 72, bottom: 72, left: 72, right: 72 }
    });

    const stream = new PassThrough();
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(chunk));

    const pdfPromise = new Promise<Buffer>((resolve, reject) => {
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });

    doc.pipe(stream);

    // Title
    doc.fontSize(24).font('Helvetica-Bold').text('Teaching Philosophy', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(14).font('Helvetica').text('Brandon PT Davis', { align: 'center' });
    doc.fontSize(12).text('Scenic Designer', { align: 'center' });
    doc.moveDown(2);

    // Introduction
    doc.fontSize(11).font('Helvetica');
    doc.text(
       'As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today\'s rapidly evolving entertainment industry.',
      { align: 'justify' }
    );
    doc.moveDown();

    // Foundation Section
    doc.fontSize(14).font('Helvetica-Bold').text('Foundation');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(
      'While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.',
      { align: 'justify' }
    );
    doc.moveDown();
    doc.text(
      'I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.',
      { align: 'justify' }
    );
    doc.moveDown(1.5);

    // Pedagogy Section
    doc.fontSize(14).font('Helvetica-Bold').text('Pedagogy');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(
      'Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.',
      { align: 'justify' }
    );
    doc.moveDown();
    doc.text(
       'Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas\'s immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.',
      { align: 'justify' }
    );
    doc.moveDown(1.5);

    // Mentorship Section
    doc.fontSize(14).font('Helvetica-Bold').text('Mentorship');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(
      'My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.',
      { align: 'justify' }
    );
    doc.moveDown();
    doc.text(
      'Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.',
      { align: 'justify' }
    );
    doc.moveDown(1.5);

    // Research Section
    doc.fontSize(14).font('Helvetica-Bold').text('Research');
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(
      'I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students\' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.',
      { align: 'justify' }
    );
    doc.moveDown();
    doc.text(
      'For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.',
      { align: 'justify' }
    );
    doc.moveDown(2);

    // Signature
    doc.fontSize(12).font('Helvetica-Oblique').text('Brandon PT Davis', { align: 'left' });
    doc.fontSize(10).font('Helvetica').text('Scenic Designer', { align: 'left' });

    doc.end();

    const pdfBuffer = await pdfPromise;

    // Upload to S3
    const timestamp = Date.now();
    const fileName = `teaching-philosophy-${timestamp}.pdf`;
    const { url } = await storagePut(fileName, pdfBuffer, 'application/pdf');

    return { success: true, url };
  } catch (error) {
    console.error('PDF generation error:', error);
    return { success: false };
  }
}
