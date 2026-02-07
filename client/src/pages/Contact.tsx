import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail, Linkedin, Instagram, Send, ArrowRight } from "lucide-react";
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
        {/* Hero Title */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] italic font-normal mb-6 leading-[1.05]">
            Let's Talk
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Got a project in mind? I'm all ears.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
            
            {/* LEFT: Contact Form (Hero) */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-medium">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Brandon Davis"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-14 text-lg border-2 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 text-lg border-2 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-lg font-medium">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-14 text-lg border-2 focus:border-primary"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-lg font-medium">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, budget, or just say hi..."
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="resize-none text-lg border-2 focus:border-primary leading-relaxed"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full md:w-auto px-12 h-16 text-lg gap-3 font-semibold" 
                  disabled={notifyOwner.isPending}
                >
                  {notifyOwner.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Quick Stats */}
              <div className="mt-16 grid grid-cols-2 gap-8">
                <div className="border-l-4 border-primary pl-6">
                  <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2">24-48h</div>
                  <div className="text-muted-foreground">Response Time</div>
                </div>
                <div className="border-l-4 border-accent pl-6">
                  <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2">100%</div>
                  <div className="text-muted-foreground">Reply Rate</div>
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar with Illustration & Contact Info */}
            <div className="space-y-8 lg:sticky lg:top-28">
              
              {/* Illustration with Pixel-Perfect Glow */}
              <div className="relative">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sTGFAGStMbEkLyGw.png"
                  alt="Brandon at desk with cat"
                  className="w-full rounded-2xl transition-all duration-500 hover:drop-shadow-[0_0_30px_rgba(255,100,50,0.6)]"
                  style={{
                    filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.3))'
                  }}
                />
              </div>

              {/* Contact Methods */}
              <div className="space-y-4">
                <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-6">
                  Other Ways to Reach Me
                </h3>

                <a 
                  href="mailto:info@brandonptdavis.com"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium truncate">info@brandonptdavis.com</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>

                <a 
                  href="https://linkedin.com/in/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Linkedin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">LinkedIn</div>
                    <div className="font-medium">@brandonptdavis</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>

                <a 
                  href="https://instagram.com/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Instagram className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Instagram</div>
                    <div className="font-medium">@brandonptdavis</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </a>
              </div>

              {/* Currently Accepting */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-4">
                  Currently Accepting
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Theatrical Productions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Opera & Musical Theatre</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Immersive Experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Educational Workshops</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">●</span>
                    <span>Design Consultations</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
