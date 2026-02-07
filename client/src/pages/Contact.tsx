import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail, Linkedin, Instagram, Send, ArrowRight, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/20 via-accent/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-cyan-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-pink-500/10 via-yellow-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Header />

      <div className="container py-12 md:py-20 relative z-10">
        {/* Hero Title with Gradient */}
        <div className="max-w-5xl mx-auto mb-16 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] italic font-normal mb-6 leading-[1.05] bg-gradient-to-r from-primary via-accent to-cyan-500 bg-clip-text text-transparent">
            Let's Talk
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Got a project in mind? <span className="text-primary font-medium">I'm all ears.</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
            
            {/* LEFT: Contact Form (Hero) */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-medium text-primary">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Brandon Davis"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-14 text-lg border-2 border-primary/30 focus:border-primary bg-background/50 backdrop-blur"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-medium text-accent">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 text-lg border-2 border-accent/30 focus:border-accent bg-background/50 backdrop-blur"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-lg font-medium text-cyan-500">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-14 text-lg border-2 border-cyan-500/30 focus:border-cyan-500 bg-background/50 backdrop-blur"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-lg font-medium text-purple-500">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, budget, or just say hi..."
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="resize-none text-lg border-2 border-purple-500/30 focus:border-purple-500 leading-relaxed bg-background/50 backdrop-blur"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full md:w-auto px-12 h-16 text-lg gap-3 font-semibold bg-gradient-to-r from-primary via-accent to-cyan-500 hover:opacity-90 transition-opacity" 
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

              {/* Animated Quick Stats */}
              <div className="mt-16 grid grid-cols-2 gap-8">
                {/* Animated Clock */}
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border-2 border-primary/30 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    {/* Animated Clock */}
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: '3s' }}></div>
                      {/* Clock hands */}
                      <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-primary origin-bottom -translate-x-1/2 -translate-y-full rounded-full animate-spin" style={{ animationDuration: '60s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-1 h-4 bg-accent origin-bottom -translate-x-1/2 -translate-y-full rounded-full animate-spin" style={{ animationDuration: '5s' }}></div>
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">24-48h</div>
                    <div className="text-muted-foreground text-center">Response Time</div>
                  </div>
                </div>

                {/* Animated Hourglass */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-transform">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    {/* Animated Hourglass */}
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        {/* Hourglass outline */}
                        <path d="M20 8 L44 8 L44 12 L36 28 L36 36 L44 52 L44 56 L20 56 L20 52 L28 36 L28 28 L20 12 Z" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          className="text-cyan-500"
                        />
                        {/* Top sand */}
                        <path d="M22 10 L42 10 L42 12 L34 24 L30 24 L22 12 Z" 
                          fill="currentColor" 
                          className="text-purple-500 animate-pulse"
                        />
                        {/* Bottom sand */}
                        <path d="M22 54 L42 54 L42 52 L34 40 L30 40 L22 52 Z" 
                          fill="currentColor" 
                          className="text-purple-500"
                          style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                        />
                        {/* Falling sand */}
                        <circle cx="32" cy="30" r="1" fill="currentColor" className="text-purple-400 animate-bounce" />
                      </svg>
                    </div>
                    <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2 text-center bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">100%</div>
                    <div className="text-muted-foreground text-center">Reply Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar with Illustration & Contact Info */}
            <div className="space-y-8 lg:sticky lg:top-28">
              
              {/* Illustration with Multi-Color Pulsing Glow */}
              <div className="relative group">
                <style>{`
                  @keyframes rainbow-glow {
                    0%, 100% { filter: drop-shadow(0 0 40px rgba(255, 100, 50, 0.8)) drop-shadow(0 10px 40px rgba(0,0,0,0.3)); }
                    25% { filter: drop-shadow(0 0 40px rgba(0, 255, 200, 0.8)) drop-shadow(0 10px 40px rgba(0,0,0,0.3)); }
                    50% { filter: drop-shadow(0 0 40px rgba(150, 100, 255, 0.8)) drop-shadow(0 10px 40px rgba(0,0,0,0.3)); }
                    75% { filter: drop-shadow(0 0 40px rgba(255, 200, 0, 0.8)) drop-shadow(0 10px 40px rgba(0,0,0,0.3)); }
                  }
                  .rainbow-glow-hover:hover {
                    animation: rainbow-glow 2s ease-in-out infinite;
                  }
                `}</style>
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sTGFAGStMbEkLyGw.png"
                  alt="Brandon at desk with cat"
                  className="w-full rounded-2xl transition-all duration-500 rainbow-glow-hover transform group-hover:scale-105"
                  style={{
                    filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.3))'
                  }}
                />
              </div>

              {/* Contact Methods with Colorful Gradients */}
              <div className="space-y-4">
                <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Other Ways to Reach Me
                </h3>

                <a 
                  href="mailto:info@brandonptdavis.com"
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-transparent hover:border-primary hover:from-primary/20 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="font-medium truncate">info@brandonptdavis.com</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-primary" />
                </a>

                <a 
                  href="https://linkedin.com/in/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent hover:border-cyan-500 hover:from-cyan-500/20 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Linkedin className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">LinkedIn</div>
                    <div className="font-medium">@brandonptdavis</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-cyan-500" />
                </a>

                <a 
                  href="https://instagram.com/brandonptdavis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-transparent hover:border-purple-500 hover:from-purple-500/20 transition-all group"
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">Instagram</div>
                    <div className="font-medium">@brandonptdavis</div>
                  </div>
                  <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-purple-500" />
                </a>
              </div>

              {/* Currently Accepting with Gradient */}
              <div className="bg-gradient-to-br from-primary/20 via-accent/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl p-6 border-2 border-primary/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-['Playfair_Display'] italic font-normal mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Currently Accepting
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1 text-lg">●</span>
                      <span>Theatrical Productions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-1 text-lg">●</span>
                      <span>Opera & Musical Theatre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-500 mt-1 text-lg">●</span>
                      <span>Immersive Experiences</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500 mt-1 text-lg">●</span>
                      <span>Educational Workshops</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500 mt-1 text-lg">●</span>
                      <span>Design Consultations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
