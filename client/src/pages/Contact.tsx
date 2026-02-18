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
    submitContact.mutate({
      ...formData,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f6f3ef_55%,_#efe9e2_100%)] text-slate-900">
      <SEO
        title="Contact Brandon PT Davis | Scenic Design Inquiries"
        description="Get in touch with Brandon PT Davis for scenic design, experiential projects, or educational collaborations."
      />
      <Header />
      <div className="container relative z-10 py-20">

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300/70 bg-white/70 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              Contact
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-normal mt-6 mb-4 leading-[1.02]">
              A calm, clear
              <span className="block text-slate-700">start to your next build.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-xl">
              Tell me what you are shaping and when you need it. I will respond quickly with next steps and a clear plan.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-3xl border border-black/5 p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-lg font-semibold">
                BP
              </div>
              <div>
                <p className="text-sm text-slate-500">Preferred contact</p>
                <p className="text-base font-medium text-slate-900">info@brandonptdavis.com</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
                <p className="text-slate-500">Response time</p>
                <p className="text-slate-900 font-semibold">24-48 hours</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 px-4 py-3">
                <p className="text-slate-500">Availability</p>
                <p className="text-slate-900 font-semibold">Limited openings</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              Share your scope, timeline, and budget range if you have it. It helps me respond faster.
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 max-w-6xl mx-auto mb-20">

          {/* LEFT: Contact Form */}
          <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur p-8 md:p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)]">
            {/* Status Messages - At Top for Visibility */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium">
                ✓ Message sent! Thanks for reaching out. I'll get back to you within 24-48 hours.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                ✗ Failed to send message. Please try again or email me directly at info@brandonptdavis.com
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Brandon Davis"
                    className="h-14 text-lg bg-white border border-slate-200 focus:border-slate-400 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hello@example.com"
                    className="h-14 text-lg bg-white border border-slate-200 focus:border-slate-400 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-slate-700 font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  className="h-14 text-lg bg-white border border-slate-200 focus:border-slate-400 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, budget, or just say hi..."
                  className="min-h-[200px] text-lg bg-white border border-slate-200 focus:border-slate-400 transition-colors resize-none"
                  required
                />
                <p className="text-xs text-slate-500">Sharing a timeline and budget range helps me reply faster.</p>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full md:w-auto px-12 h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* RIGHT: Project Fit + Details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Typical turnaround</p>
                  <p className="text-base font-semibold text-slate-900">Initial reply within 1-2 days</p>
                </div>
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Scenic & experiential design inquiries</li>
                <li>• Collaborative projects + installations</li>
                <li>• Guest teaching + workshops</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">How I work</p>
                  <p className="text-base font-semibold text-slate-900">Clear scope, clear timeline</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                After your message, I will confirm scope, share next steps, and outline milestones.
              </p>
            </div>
          </div>

        </div>

        {/* Contact Methods Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-['Playfair_Display'] italic font-normal mb-8 text-center text-slate-800">
            Other Ways to Reach Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Email */}
            <a
              href="mailto:info@brandonptdavis.com"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur hover:border-slate-300 hover:bg-white transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Email</div>
                <div className="font-medium text-slate-800 text-sm">info@brandonptdavis.com</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur hover:border-slate-300 hover:bg-white transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
                <Linkedin className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">LinkedIn</div>
                <div className="font-medium text-slate-800">@brandonptdavis</div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur hover:border-slate-300 hover:bg-white transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-slate-900/20">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 mb-1">Instagram</div>
                <div className="font-medium text-slate-800">@brandonptdavis</div>
              </div>
            </a>



          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
