import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export async function generateTeachingPhilosophyPDF(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 72, bottom: 72, left: 72, right: 72 }
    });

    const buffers: Buffer[] = [];
    const stream = new PassThrough();

    stream.on('data', (chunk) => buffers.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(buffers)));
    stream.on('error', reject);

    doc.pipe(stream);

    // Title
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('Teaching Philosophy', { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(14)
       .font('Helvetica')
       .text('Brandon PT Davis', { align: 'center' });
    
    doc.fontSize(12)
       .text('Scenic Designer & Educator', { align: 'center' });
    
    doc.moveDown(2);

    // Content paragraphs
    const paragraph1 = "As an educator in Scenic Design, my foremost goal is to equip students with the skills, confidence, and adaptability needed to thrive in today's rapidly evolving entertainment industry.";
    
    const paragraph2 = "While rooted in the traditions of theatre, my teaching extends across Film, Television, Events, and Themed Entertainment, encouraging students to envision careers that match the breadth of opportunities available to creative designers today.";
    
    const paragraph3 = "I emphasize a comprehensive foundation in scenic design, beginning with spatial awareness, material comprehension, and design aesthetics, and extending into collaboration, an indispensable skill in this field. My courses balance traditional methods — such as hand-drafting, perspective sketching, and tactile rendering in gouache and watercolor — with advanced technologies including Vectorworks, Twinmotion, Adobe Creative Cloud, and AI-driven design tools. By layering old and new methods, I encourage students to respect process while embracing innovation.";
    
    const paragraph4 = "Recognizing that each student learns differently, I employ versatile teaching strategies. Some thrive in communal settings, while others find strength in individual exploration. To support this, I often begin with collaborative projects that build community and confidence, before shifting to individually tailored assignments.";
    
    const paragraph5 = "Accessibility is a cornerstone of my pedagogy: I integrate digital platforms like Canvas's immersive reader, supplemental videos, and hybrid tactile-digital assignments to meet students where they are.";
    
    const paragraph6 = "My own career trajectory informs my mentorship. Early on, I struggled to find my voice and learn the art of self-promotion. Today, I guide students not just toward strong portfolios, but toward resilience, self-advocacy, and confidence in their ideas.";
    
    const paragraph7 = "Beyond the classroom, I strive to create a positive design culture. At Stephens, I was adamant about developing a shared studio space where students could work beyond their dorm rooms, exchange supplies, and collaborate across disciplines — a communal environment that fostered both creativity and belonging.";
    
    const paragraph8 = "I view teaching as a continuous act of research. Just as I bring current industry practices into my classroom, I also explore emerging technologies to expand students' toolkits. Recently, I incorporated AI tools like MidJourney and Adobe Firefly into my Digital Rendering course, inviting students to critically explore both the opportunities and limitations of these new mediums.";
    
    const paragraph9 = "For me, the classroom is a laboratory for experimentation — a space where design education remains responsive to shifting industry landscapes.";

    doc.fontSize(11)
       .font('Helvetica');

    doc.text(paragraph1, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph2, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph3, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph4, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph5, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph6, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph7, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph8, { align: 'justify', lineGap: 4 });
    doc.moveDown(1);
    
    doc.text(paragraph9, { align: 'justify', lineGap: 4 });
    doc.moveDown(2);

    // Signature
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Brandon PT Davis', { align: 'left' });
    
    doc.fontSize(11)
       .font('Helvetica')
       .text('Scenic Designer & Educator', { align: 'left' });

    doc.end();
  });
}
