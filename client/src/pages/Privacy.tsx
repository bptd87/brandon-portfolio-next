import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Introduction</h2>
              <p className="text-foreground/80 leading-relaxed">
                Brandon PT Davis ("we," "our," or "us") respects your privacy and is committed to protecting your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Information We Collect</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We may collect information about you in a variety of ways, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li><strong>Personal Data:</strong> Name, email address, and contact information you voluntarily provide when contacting us or subscribing to updates.</li>
                <li><strong>Usage Data:</strong> Information about how you access and use our website, including your IP address, browser type, pages visited, and time spent on pages.</li>
                <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity on our website and hold certain information.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                <li>Improve our website and user experience</li>
                <li>Analyze usage patterns and trends</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Disclosure of Your Information</h2>
              <p className="text-foreground/80 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers 
                who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Data Security</h2>
              <p className="text-foreground/80 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission 
                over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Your Rights</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li>The right to access and receive a copy of your personal data</li>
                <li>The right to rectify inaccurate personal data</li>
                <li>The right to request deletion of your personal data</li>
                <li>The right to restrict or object to processing of your personal data</li>
                <li>The right to data portability</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-foreground/80 leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us at:
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
