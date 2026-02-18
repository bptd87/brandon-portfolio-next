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
    <div className="min-h-screen bg-[#0b0b0d] text-white">
      <SEO
        title="Contact Brandon PT Davis | Scenic Design Inquiries"
        description="Get in touch with Brandon PT Davis for scenic design, experiential projects, or educational collaborations."
      />
      <Header />
      <div className="container relative z-10 py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/3 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,_rgba(255,153,102,0.24)_0%,_rgba(15,15,20,0)_60%)] blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,_rgba(80,140,255,0.18)_0%,_rgba(15,15,20,0)_65%)] blur-3xl" />
          <div className="absolute top-1/2 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(236,186,117,0.2)_0%,_rgba(12,12,16,0)_70%)] blur-3xl" />
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-end mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Contact
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-normal mt-6 mb-4 leading-[1.02]">
              Scenic worlds
              <span className="block text-white/80">start with a conversation.</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-xl">
              Share your project, timeline, and the feeling you want on stage. I design environments that tell the story.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-white/10 text-white flex items-center justify-center text-lg font-semibold">
                BP
              </div>
              <div>
                <p className="text-sm text-white/50">Preferred contact</p>
                <p className="text-base font-medium text-white">info@brandonptdavis.com</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white/50">Response time</p>
                <p className="text-white font-semibold">24-48 hours</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-white/50">Availability</p>
                <p className="text-white font-semibold">Limited openings</p>
              </div>
            </div>
            <div className="mt-6 text-sm text-white/60">
              Helpful details: venue, dates, budget range, and creative team.
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 max-w-6xl mx-auto mb-20">

          {/* LEFT: Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-8 md:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
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
                  placeholder="Tell me about the production, venue, timeline, and any references..."
                  className="min-h-[200px] text-lg bg-white/5 text-white border border-white/10 focus:border-white/30 transition-colors resize-none"
                  required
                />
                <p className="text-xs text-white/50">If you have a budget range or schedule, include it for faster response.</p>
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

          {/* RIGHT: Project Fit + Details */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">Typical turnaround</p>
                  <p className="text-base font-semibold text-white">Initial reply within 1-2 days</p>
                </div>
              </div>
              <ul className="text-sm text-white/70 space-y-2">
                <li>• Scenic design for theatre + live events</li>
                <li>• Experiential environments + installations</li>
                <li>• Educational collaborations + workshops</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-white/10 text-white flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-white/50">How I work</p>
                  <p className="text-base font-semibold text-white">Story-led, practical, on schedule</p>
                </div>
              </div>
              <p className="text-sm text-white/70">
                I translate narrative into space, then align with build realities. You will get clear next steps and milestones.
              </p>
            </div>
          </div>

        </div>

        {/* Contact Methods Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-['Playfair_Display'] italic font-normal mb-8 text-center text-white">
            Other Ways to Reach Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Email */}
            <a
              href="mailto:info@brandonptdavis.com"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/30 hover:bg-white/10 transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/30">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/60 mb-1">Email</div>
                <div className="font-medium text-white text-sm">info@brandonptdavis.com</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/30 hover:bg-white/10 transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/30">
                <Linkedin className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/60 mb-1">LinkedIn</div>
                <div className="font-medium text-white">@brandonptdavis</div>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur hover:border-white/30 hover:bg-white/10 transition-all group"
            >
              <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/30">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/60 mb-1">Instagram</div>
                <div className="font-medium text-white">@brandonptdavis</div>
              </div>
            </a>



          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
