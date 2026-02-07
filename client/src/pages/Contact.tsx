import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail, Linkedin, Instagram, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const notifyOwner = trpc.system.notifyOwner.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! I'll get back to you soon.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (error) => {
      toast.error("Failed to send message. Please try again or email directly.");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    notifyOwner.mutate({
      title: `New Contact Form Submission: ${subject || "No Subject"}`,
      content: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-12 md:py-20">
        {/* Hero Section with Illustration */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-['Playfair_Display'] italic font-normal mb-6 leading-[1.1]">
                Let's Create Something
                <span className="block text-primary">Together</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Whether you're planning a new production, exploring design collaboration, or have questions about my work, 
                I'd love to hear from you.
              </p>

              {/* Quick Contact Methods */}
              <div className="space-y-4">
                <a 
                  href="mailto:info@brandonptdavis.com"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-lg">info@brandonptdavis.com</span>
                </a>

                <a 
                  href="https://linkedin.com/in/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </div>
                  <span className="text-lg">LinkedIn</span>
                </a>

                <a 
                  href="https://instagram.com/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <span className="text-lg">Instagram</span>
                </a>
              </div>
            </div>

            {/* Right: Illustration with Glow Effect */}
            <div className="relative flex justify-center">
              <div className="relative group">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110"></div>
                
                {/* Image */}
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sTGFAGStMbEkLyGw.png"
                  alt="Brandon at desk with cat"
                  className="relative rounded-3xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] italic font-normal mb-4">
              Send a Message
            </h2>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and I'll respond within 24-48 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base">Name *</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base">Subject</Label>
              <Input
                id="subject"
                placeholder="What's this about?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-base">Message *</Label>
              <Textarea
                id="message"
                placeholder="Tell me about your project or inquiry..."
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="resize-none"
              />
            </div>

            <Button 
              type="submit" 
              size="lg"
              className="w-full md:w-auto md:px-12 h-12 text-base gap-2" 
              disabled={notifyOwner.isPending}
            >
              {notifyOwner.isPending ? (
                "Sending..."
              ) : (
                <>
                  Send Message
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-3">
                Currently Accepting
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Theatrical Productions</li>
                <li>• Opera & Musical Theatre</li>
                <li>• Immersive Experiences</li>
                <li>• Educational Workshops</li>
                <li>• Design Consultations</li>
              </ul>
            </div>

            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6">
              <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-3">
                Response Time
              </h3>
              <p className="text-muted-foreground">
                I typically respond to inquiries within 24-48 hours during business days. 
                For urgent matters, please indicate so in your message subject line.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
