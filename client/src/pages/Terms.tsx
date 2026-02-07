import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
              <p className="text-foreground/80 leading-relaxed">
                By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to these Terms of Service, please do not use this website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Intellectual Property Rights</h2>
              <p className="text-foreground/80 leading-relaxed">
                Unless otherwise indicated, all content on this website, including but not limited to text, graphics, logos, images, videos, 
                and software, is the property of Brandon PT Davis and is protected by copyright, trademark, and other intellectual property laws. 
                You may not reproduce, distribute, modify, or create derivative works from any content without express written permission.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Use License</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Permission is granted to temporarily view the materials on this website for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Disclaimer</h2>
              <p className="text-foreground/80 leading-relaxed">
                The materials on this website are provided on an 'as is' basis. Brandon PT Davis makes no warranties, expressed or implied, 
                and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, 
                fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Limitations</h2>
              <p className="text-foreground/80 leading-relaxed">
                In no event shall Brandon PT Davis or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, 
                or due to business interruption) arising out of the use or inability to use the materials on this website, even if Brandon PT Davis or an authorized 
                representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Links to Third-Party Websites</h2>
              <p className="text-foreground/80 leading-relaxed">
                This website may contain links to third-party websites that are not owned or controlled by Brandon PT Davis. We have no control over, 
                and assume no responsibility for, the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that 
                Brandon PT Davis shall not be responsible or liable for any damage or loss caused by your use of any third-party website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Modifications</h2>
              <p className="text-foreground/80 leading-relaxed">
                Brandon PT Davis may revise these Terms of Service at any time without notice. By using this website, you agree to be bound by the current version of these terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-foreground/80 mt-4">
                <strong>Email:</strong> <a href="mailto:info@brandonptdavis.com" className="text-[#FF5722] hover:underline">info@brandonptdavis.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
