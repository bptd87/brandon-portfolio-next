import { useState } from 'react';
import { Mail, Linkedin, Instagram, Send, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement form submission
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-20 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <div className="container relative z-10 py-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-['Playfair_Display'] italic font-normal mb-6 text-foreground">
            Let's Talk
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got a project in mind? <span className="text-foreground font-medium">I'm all ears.</span>
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 max-w-6xl mx-auto mb-20">
          
          {/* LEFT: Contact Form - THE HERO */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Brandon Davis"
                    className="h-14 text-lg bg-card/50 backdrop-blur border-2 border-primary/30 focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hello@example.com"
                    className="h-14 text-lg bg-card/50 backdrop-blur border-2 border-primary/30 focus:border-primary transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-foreground font-medium">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="What's this about?"
                  className="h-14 text-lg bg-card/50 backdrop-blur border-2 border-cyan-500/30 focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-medium">Your Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project, timeline, budget, or just say hi..."
                  className="min-h-[200px] text-lg bg-card/50 backdrop-blur border-2 border-purple-500/30 focus:border-purple-500 transition-colors resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                size="lg"
                className="w-full md:w-auto px-12 h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-105"
              >
                Send Message
                <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* RIGHT: Illustration */}
          <div className="flex items-start justify-center lg:justify-end">
            <div className="relative group w-full max-w-sm">
              <style>{`
                @keyframes rainbow-glow {
                  0%, 100% { 
                    filter: drop-shadow(0 0 40px rgba(255, 100, 50, 0.8)) 
                            drop-shadow(0 0 60px rgba(255, 100, 50, 0.4))
                            drop-shadow(0 10px 30px rgba(0,0,0,0.3)); 
                  }
                  25% { 
                    filter: drop-shadow(0 0 40px rgba(0, 255, 200, 0.8)) 
                            drop-shadow(0 0 60px rgba(0, 255, 200, 0.4))
                            drop-shadow(0 10px 30px rgba(0,0,0,0.3)); 
                  }
                  50% { 
                    filter: drop-shadow(0 0 40px rgba(150, 100, 255, 0.8)) 
                            drop-shadow(0 0 60px rgba(150, 100, 255, 0.4))
                            drop-shadow(0 10px 30px rgba(0,0,0,0.3)); 
                  }
                  75% { 
                    filter: drop-shadow(0 0 40px rgba(255, 200, 0, 0.8)) 
                            drop-shadow(0 0 60px rgba(255, 200, 0, 0.4))
                            drop-shadow(0 10px 30px rgba(0,0,0,0.3)); 
                  }
                }
                @keyframes float {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-12px); }
                }
                .brandon-illustration {
                  animation: float 3s ease-in-out infinite;
                  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.3));
                }
                .brandon-illustration:hover {
                  animation: float 3s ease-in-out infinite, rainbow-glow 1.5s ease-in-out infinite;
                }
              `}</style>
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/sTGFAGStMbEkLyGw.png"
                alt="Brandon at desk with cat"
                className="w-full rounded-2xl brandon-illustration cursor-pointer"
              />
            </div>
          </div>

        </div>

        {/* Bottom Section: Stats & Contact Methods */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-['Playfair_Display'] italic font-normal mb-8 text-center text-foreground">
            Other Ways to Reach Me
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Email */}
            <a 
              href="mailto:info@brandonptdavis.com"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/30 bg-card/50 backdrop-blur hover:border-primary hover:bg-card/80 transition-all group hover:scale-105"
            >
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <div className="font-medium text-foreground text-sm">info@brandonptdavis.com</div>
              </div>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://linkedin.com/in/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-cyan-500/30 bg-card/50 backdrop-blur hover:border-cyan-500 hover:bg-card/80 transition-all group hover:scale-105"
            >
              <div className="h-16 w-16 rounded-full bg-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
                <Linkedin className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">LinkedIn</div>
                <div className="font-medium text-foreground">@brandonptdavis</div>
              </div>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/brandonptdavis"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-purple-500/30 bg-card/50 backdrop-blur hover:border-purple-500 hover:bg-card/80 transition-all group hover:scale-105"
            >
              <div className="h-16 w-16 rounded-full bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                <Instagram className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Instagram</div>
                <div className="font-medium text-foreground">@brandonptdavis</div>
              </div>
            </a>

            {/* Response Time */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-primary/50 bg-card/50 backdrop-blur">
              <div className="h-16 w-16 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" style={{ animationDuration: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-5 bg-primary origin-bottom -translate-x-1/2 -translate-y-full rounded-full" 
                  style={{ animation: 'spin 60s linear infinite', transformOrigin: 'bottom center' }}></div>
                <div className="absolute top-1/2 left-1/2 w-1 h-6 bg-primary origin-bottom -translate-x-1/2 -translate-y-full rounded-full" 
                  style={{ animation: 'spin 5s linear infinite', transformOrigin: 'bottom center' }}></div>
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-['Playfair_Display'] italic text-primary mb-1">24-48h</div>
                <div className="text-sm text-muted-foreground">Response Time</div>
              </div>
            </div>

            {/* Reply Rate */}
            <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-transparent bg-card/50 backdrop-blur"
              style={{ borderImage: 'linear-gradient(135deg, rgb(6 182 212), rgb(168 85 247)) 1' }}>
              <div className="h-16 w-16 relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 opacity-20 animate-ping"></div>
                <CheckCircle2 className="h-12 w-12 relative z-10" 
                  style={{
                    stroke: 'url(#checkGradient)',
                    strokeWidth: 2
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
              <div className="text-center">
                <div className="text-2xl font-['Playfair_Display'] italic bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Reply Rate</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
