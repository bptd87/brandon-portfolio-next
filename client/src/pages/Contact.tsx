import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail, Linkedin, Instagram, Send, ArrowRight, CheckCircle2 } from "lucide-react";
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
      {/* Subtle Background Gradients - Lower Opacity */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-to-tl from-accent/30 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Header />

      <div className="container py-8 md:py-12 relative z-10">
        {/* Hero Title - Solid Color, No Gradient */}
        <div className="max-w-5xl mx-auto mb-12 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-['Playfair_Display'] italic font-normal mb-6 leading-[1.05] text-foreground">
            Let's Talk
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground font-light">
            Got a project in mind? <span className="text-primary font-medium">I'm all ears.</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-start">
            
            {/* LEFT: Contact Form (Hero) */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-8 bg-card/90 backdrop-blur-xl border-2 border-border rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-lg font-medium text-foreground">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Brandon Davis"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-14 text-lg border-2 border-border focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-lg font-medium text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="hello@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-14 text-lg border-2 border-border focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-lg font-medium text-foreground">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="h-14 text-lg border-2 border-border focus:border-primary bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-lg font-medium text-foreground">Your Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project, timeline, budget, or just say hi..."
                    rows={10}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    className="resize-none text-lg border-2 border-border focus:border-primary leading-relaxed bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Solid Primary Button */}
                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full md:w-auto px-12 h-16 text-lg gap-3 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground" 
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
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Animated Clock - Stronger Animation */}
                <div className="bg-card/90 backdrop-blur-xl border-2 border-primary/50 rounded-2xl p-6 relative overflow-hidden group hover:scale-105 hover:border-primary transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {/* Animated Clock with Unified Colors */}
                    <div className="w-20 h-20 mx-auto mb-4 relative">
                      {/* Outer ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      {/* Spinning ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: '2s' }}></div>
                      {/* Hour hand */}
                      <div className="absolute top-1/2 left-1/2 w-1.5 h-7 bg-primary origin-bottom -translate-x-1/2 -translate-y-full rounded-full" 
                        style={{ 
                          animation: 'spin 60s linear infinite',
                          transformOrigin: 'bottom center'
                        }}></div>
                      {/* Minute hand */}
                      <div className="absolute top-1/2 left-1/2 w-1.5 h-9 bg-primary origin-bottom -translate-x-1/2 -translate-y-full rounded-full" 
                        style={{ 
                          animation: 'spin 5s linear infinite',
                          transformOrigin: 'bottom center'
                        }}></div>
                      {/* Center dot */}
                      <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-primary/50"></div>
                    </div>
                    <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2 text-center text-primary">24-48h</div>
                    <div className="text-muted-foreground text-center font-medium">Response Time</div>
                  </div>
                </div>

                {/* Animated Reply Rate with Checkmark - Cyan to Purple Gradient */}
                <div className="bg-card/90 backdrop-blur-xl border-2 border-transparent rounded-2xl p-6 relative overflow-hidden group hover:scale-105 transition-all duration-300"
                  style={{
                    borderImage: 'linear-gradient(135deg, rgb(6 182 212), rgb(168 85 247)) 1'
                  }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {/* Animated Checkmark with Pulse */}
                    <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center">
                      {/* Pulsing rings */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 opacity-40 animate-pulse"></div>
                      {/* Checkmark */}
                      <CheckCircle2 className="h-16 w-16 relative z-10" 
                        style={{
                          stroke: 'url(#checkGradient)',
                          strokeWidth: 2,
                          animation: 'bounce 2s ease-in-out infinite'
                        }}
                      />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(6 182 212)" />
                            <stop offset="100%" stopColor="rgb(168 85 247)" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="text-4xl font-['Playfair_Display'] italic font-normal mb-2 text-center bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">100%</div>
                    <div className="text-muted-foreground text-center font-medium">Reply Rate</div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT: Sidebar with Illustration & Contact Info */}
            <div className="space-y-6 lg:sticky lg:top-28">
              
              {/* Illustration with Rainbow Pulsing Glow - Stronger Effect */}
              <div className="relative group">
                <style>{`
                  @keyframes rainbow-glow-strong {
                    0%, 100% { 
                      filter: drop-shadow(0 0 50px rgba(255, 100, 50, 1)) 
                              drop-shadow(0 0 80px rgba(255, 100, 50, 0.6))
                              drop-shadow(0 10px 40px rgba(0,0,0,0.3)); 
                    }
                    25% { 
                      filter: drop-shadow(0 0 50px rgba(0, 255, 200, 1)) 
                              drop-shadow(0 0 80px rgba(0, 255, 200, 0.6))
                              drop-shadow(0 10px 40px rgba(0,0,0,0.3)); 
                    }
                    50% { 
                      filter: drop-shadow(0 0 50px rgba(150, 100, 255, 1)) 
                              drop-shadow(0 0 80px rgba(150, 100, 255, 0.6))
                              drop-shadow(0 10px 40px rgba(0,0,0,0.3)); 
                    }
                    75% { 
                      filter: drop-shadow(0 0 50px rgba(255, 200, 0, 1)) 
                              drop-shadow(0 0 80px rgba(255, 200, 0, 0.6))
                              drop-shadow(0 10px 40px rgba(0,0,0,0.3)); 
                    }
                  }
                  .rainbow-glow-hover-strong:hover {
                    animation: rainbow-glow-strong 1.5s ease-in-out infinite, bounce-strong 0.6s ease-in-out infinite;
                  }
                  @keyframes bounce-strong {
                    0%, 100% { transform: translateY(0) scale(1.05); }
                    50% { transform: translateY(-20px) scale(1.08); }
                  }
                `}</style>
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sTGFAGStMbEkLyGw.png"
                  alt="Brandon at desk with cat"
                  className="w-full rounded-2xl transition-all duration-500 rainbow-glow-hover-strong"
                  style={{
                    filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.3))'
                  }}
                />
              </div>

              {/* Contact Methods - High Contrast */}
              <div>
                <h3 className="text-2xl font-['Playfair_Display'] italic font-normal mb-6 text-foreground">
                  Other Ways to Reach Me
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <a 
                    href="mailto:info@brandonptdavis.com"
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary/30 bg-card/80 hover:border-primary hover:bg-card transition-all group"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                      <Mail className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium text-foreground truncate">info@brandonptdavis.com</div>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-primary" />
                  </a>

                  <a 
                    href="https://linkedin.com/in/brandonptdavis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-cyan-500/30 bg-card/80 hover:border-cyan-500 hover:bg-card transition-all group"
                  >
                    <div className="h-12 w-12 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                      <Linkedin className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">LinkedIn</div>
                      <div className="font-medium text-foreground">@brandonptdavis</div>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-cyan-500" />
                  </a>

                  <a 
                    href="https://instagram.com/brandonptdavis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-purple-500/30 bg-card/80 hover:border-purple-500 hover:bg-card transition-all group"
                  >
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground">Instagram</div>
                      <div className="font-medium text-foreground">@brandonptdavis</div>
                    </div>
                    <ArrowRight className="h-5 w-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-purple-500" />
                  </a>
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
