import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export async function generateCreativeStatementPDF(): Promise<Buffer> {
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
       .text('Creative Statement', { align: 'center' });
    
    doc.moveDown(0.5);
    
    doc.fontSize(14)
       .font('Helvetica')
       .text('Brandon PT Davis', { align: 'center' });
    
    doc.fontSize(12)
       .text('Scenic Designer', { align: 'center' });
    
    doc.moveDown(2);

    // Statement content
    const paragraph1 = "My passion for scenic design falls somewhere between a love of architecture, history, and narrative storytelling. I'm drawn to projects that have meaning and impact for the communities they serve. I'm especially interested in productions where the design does more than illustrate a setting and becomes part of how the story resonates.";
    
    const paragraph2 = "I value every collaborator involved in bringing a production to life. That starts with the hidden collaborator, the playwright, and extends to the director, the creative team, and the production teams. I also enjoy working closely with company managers, carpenters, and artisans to realize the best version of the creative team's vision within each unique venue.";
    
    const paragraph3 = "My process often begins with a lot of ideas that pull in different directions. Early conversations with the director focus on the text: What do they see, and how can we shape a shared vision? From that point forward, I build digital models to explore and sculpt the world. I'm never afraid to start over, no matter where we are in the process.";
    
    const paragraph4 = "I love the energy of collaborative design conversations, when ideas start bouncing between departments and the production finds its rhythm. Technically, I thrive in the transition from rendering to drafting, translating concepts into fully buildable spaces. I'm drawn to designs where structure and detail work together, and where every choice supports both the narrative and the performers onstage.";
    
    const paragraph5 = "Whether I'm working on a classic or a new play, my goal is to create environments that feel inevitable once they're revealed. Ideally, the design feels like it couldn't have been any other way, even if it took many revisions and collaborative breakthroughs to get there.";

    doc.fontSize(11)
       .font('Helvetica')
       .text(paragraph1, { align: 'justify', lineGap: 4 });

    doc.moveDown(1);
    doc.text(paragraph2, { align: 'justify', lineGap: 4 });

    doc.moveDown(1);
    doc.text(paragraph3, { align: 'justify', lineGap: 4 });

    doc.moveDown(1);
    doc.text(paragraph4, { align: 'justify', lineGap: 4 });

    doc.moveDown(1);
    doc.text(paragraph5, { align: 'justify', lineGap: 4 });

    doc.moveDown(3);

    // Signature
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .text('Brandon PT Davis', { align: 'left' });
    
    doc.fontSize(11)
       .font('Helvetica')
       .text('Scenic Designer', { align: 'left' });

    doc.end();
  });
}
