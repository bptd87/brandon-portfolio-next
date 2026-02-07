import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-black tracking-tighter mb-4">Accessibility Statement</h1>
          <p className="text-muted-foreground mb-12">Our commitment to making this website accessible to everyone</p>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Commitment</h2>
              <p className="text-foreground/80 leading-relaxed">
                Brandon PT Davis is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience 
                for everyone and applying the relevant accessibility standards to ensure we provide equal access to all users.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Conformance Status</h2>
              <p className="text-foreground/80 leading-relaxed">
                We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content 
                more accessible for people with disabilities and user-friendly for everyone.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Accessibility Features</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                This website includes the following accessibility features:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                <li><strong>Keyboard Navigation:</strong> All interactive elements can be accessed using keyboard controls</li>
                <li><strong>Screen Reader Compatibility:</strong> Content is structured to work with screen readers and assistive technologies</li>
                <li><strong>Alt Text:</strong> Images include descriptive alternative text</li>
                <li><strong>Color Contrast:</strong> Text and interactive elements meet WCAG AA contrast requirements</li>
                <li><strong>Responsive Design:</strong> Content adapts to different screen sizes and zoom levels</li>
                <li><strong>Clear Navigation:</strong> Consistent navigation structure throughout the site</li>
                <li><strong>Focus Indicators:</strong> Visible focus states for keyboard navigation</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Known Limitations</h2>
              <p className="text-foreground/80 leading-relaxed">
                Despite our best efforts, some content on this website may not yet be fully accessible. We are actively working to address these limitations 
                and welcome feedback on how we can improve accessibility.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Third-Party Content</h2>
              <p className="text-foreground/80 leading-relaxed">
                Some content on this website may be provided by third parties (such as embedded videos or social media feeds). While we strive to ensure 
                all content is accessible, we may have limited control over the accessibility of third-party content.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Feedback and Assistance</h2>
              <p className="text-foreground/80 leading-relaxed mb-4">
                We welcome your feedback on the accessibility of this website. If you encounter any accessibility barriers or have suggestions for improvement, 
                please contact us:
              </p>
              <p className="text-foreground/80">
                <strong>Email:</strong> <a href="mailto:info@brandonptdavis.com" className="text-[#FF5722] hover:underline">info@brandonptdavis.com</a>
              </p>
              <p className="text-foreground/80 mt-4">
                We will make every effort to respond to accessibility feedback within 5 business days and to provide the requested information or assistance.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-4">Ongoing Improvements</h2>
              <p className="text-foreground/80 leading-relaxed">
                Accessibility is an ongoing effort. We regularly review our website and make updates to improve accessibility. This statement was last reviewed 
                on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
