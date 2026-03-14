import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Mail, Linkedin, Instagram, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SEO } from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { captureAnalyticsEvent } from '@/lib/posthog';

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.01 2C6.49 2 2 6.49 2 12.01c0 4.24 2.64 7.86 6.36 9.32-.09-.79-.16-2.01.03-2.88l1.17-4.96s-.3-.61-.3-1.52c0-1.43.83-2.49 1.87-2.49.88 0 1.3.66 1.3 1.45 0 .88-.56 2.2-.85 3.42-.24 1.03.52 1.87 1.53 1.87 1.83 0 3.24-1.93 3.24-4.72 0-2.47-1.78-4.2-4.31-4.2-2.94 0-4.67 2.2-4.67 4.48 0 .89.34 1.84.77 2.36.08.1.09.19.06.29l-.29 1.2c-.05.19-.16.23-.36.14-1.35-.63-2.2-2.62-2.2-4.22 0-3.43 2.49-6.58 7.19-6.58 3.77 0 6.7 2.69 6.7 6.29 0 3.75-2.36 6.77-5.64 6.77-1.1 0-2.13-.57-2.48-1.26l-.68 2.57c-.24.88-.91 1.98-1.35 2.65 1.02.31 2.11.48 3.23.48 5.52 0 10.01-4.49 10.01-10.01S17.53 2 12.01 2z" />
    </svg>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const submitContact = trpc.contact.submit.useMutation({
    onSuccess: () => {
      captureAnalyticsEvent('contact_form_submit_succeeded', {
        subject: formData.subject,
      });
      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      // Scroll to top of form to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Clear success message after 8 seconds
      setTimeout(() => setSubmitStatus('idle'), 8000);
    },
    onError: (error) => {
      captureAnalyticsEvent('contact_form_submit_failed', {
        subject: formData.subject,
        message: error.message,
      });
      setSubmitStatus('error');
      setIsSubmitting(false);
      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    captureAnalyticsEvent('contact_form_submitted', {
      subject: formData.subject,
    });
    submitContact.mutate({
      ...formData,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <SEO
        title="Contact Brandon PT Davis | Scenic Design Inquiries"
        description="Contact Brandon PT Davis for professional scenic design inquiries. USA 829 scenic designer based in Southern California."
        keywords="contact union scenic designer, USA 829 scenic designer, hire scenic designer, professional theatre scenic design inquiries, scenic designer california, Orange County scenic designer"
        url="https://www.brandonptdavis.com/contact"
      />
      <StructuredData
        type="Organization"
        organization={{
          name: "Brandon PT Davis Design",
          url: "https://www.brandonptdavis.com",
          description: "Professional scenic design studio led by USA 829 scenic designer Brandon PT Davis, specializing in regional theatre, summer stock, and academic theatre.",
          email: "info@brandonptdavis.com",
          address: {
            addressLocality: "Irvine",
            addressRegion: "CA",
            addressCountry: "US"
          },
          founder: {
            name: "Brandon PT Davis",
            url: "https://www.brandonptdavis.com/about"
          },
          sameAs: [
            "https://www.instagram.com/brandonptdavisdesign",
            "https://www.linkedin.com/in/brandonptdavis",
            "https://www.youtube.com/@BrandonPTDavisDesign",
            "https://www.facebook.com/BrandonPTDavisA",
            "https://www.pinterest.com/BrandonPTDavis/",
          ]
        }}
      />
      <StructuredData
        type="BreadcrumbList"
        breadcrumbs={[
          { name: "Home", url: "https://www.brandonptdavis.com" },
          { name: "Contact", url: "https://www.brandonptdavis.com/contact" },
        ]}
      />
      <Header />
      <div className="container relative z-10 pt-28 pb-24">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(255,153,102,0.24)_0%,_rgba(15,15,20,0)_60%)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(80,140,255,0.18)_0%,_rgba(15,15,20,0)_65%)] blur-3xl" />
          <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(236,186,117,0.2)_0%,_rgba(12,12,16,0)_70%)] blur-3xl" />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            Contact
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-normal mt-6 mb-4 leading-[1.02]">
            Scenic worlds
            <span className="block text-white/80">start with a conversation.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Professional scenic design inquiries are welcome. Share your production, venue, timeline, and design goals.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="flex justify-center mb-14">
          <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
            {/* Status Messages - At Top for Visibility */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 font-medium">
                ✓ Message sent! Thanks for reaching out. I'll get back to you within 24-48 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 text-rose-200 font-medium">
                ✗ Failed to send message. Please try again or email me directly at info@brandonptdavis.com
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80 font-medium">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Brandon Davis"
                    className="h-14 text-lg bg-white/5 text-white border border-white/10 focus:border-white/30 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hello@example.com"
                    className="h-14 text-lg bg-white/5 text-white border border-white/10 focus:border-white/30 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white/80 font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  className="h-14 text-lg bg-white/5 text-white border border-white/10 focus:border-white/30 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80 font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about the production, venue, timeline, and design goals..."
                  className="min-h-[200px] text-lg bg-white/5 text-white border border-white/10 focus:border-white/30 transition-colors resize-none"
                  required
                />
                <p className="text-xs text-white/50">Include production schedule and budget parameters to help scope the work.</p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 h-14 text-lg bg-white text-black hover:bg-white/90 font-medium shadow-lg shadow-black/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-6">Social</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a
              href="mailto:info@brandonptdavis.com"
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Email</div>
                <div className="font-medium text-white">info@brandonptdavis.com</div>
              </div>
            </a>
            <a
              href="https://linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Linkedin className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">LinkedIn</div>
                <div className="font-medium text-white">@brandonptdavis</div>
              </div>
            </a>
            <a
              href="https://instagram.com/brandonptdavisdesign"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <Instagram className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Instagram</div>
                <div className="font-medium text-white">@brandonptdavisdesign</div>
              </div>
            </a>
            <a
              href="https://www.pinterest.com/BrandonPTDavis/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <PinterestIcon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/50 mb-1">Pinterest</div>
                <div className="font-medium text-white">@BrandonPTDavis</div>
              </div>
            </a>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
