import { Link } from 'wouter';
import { Home, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { ProgressiveImage } from '@/components/ProgressiveImage';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <SEO 
        title="404 - Page Not Found | Brandon PT Davis" 
        description="This page has left the building."
      />
      
      {/* Spotlight effect - top center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background pointer-events-none" />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="container max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left side - Ghost Image */}
            <div className="flex justify-center md:justify-end order-2 md:order-1">
              <motion.div 
                className="relative w-64 h-96"
                animate={{ 
                  opacity: [0.75, 1, 0.75]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div 
                  className="relative w-full h-full"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(34, 211, 238, 0.5)) drop-shadow(0 0 80px rgba(34, 211, 238, 0.3))',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
                    maskImage: 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)'
                  }}
                >
                  <ProgressiveImage
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/XmkWKbpBTnVhFHuU.png"
                    alt="Brandon as a ghost - lost in the theatre"
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center md:text-left order-1 md:order-2"
            >
              {/* 404 Number */}
              <motion.h1 
                className="text-8xl md:text-9xl font-['Playfair_Display'] italic font-bold mb-4 leading-none"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(34, 211, 238, 0.3)'
                }}
              >
                404
              </motion.h1>
              
              {/* Divider line */}
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mb-6 mx-auto md:mx-0" />
              
              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-display uppercase tracking-[0.3em] mb-8 text-foreground">
                Page Not Found
              </h2>

              {/* Emergency announcement */}
              <div className="max-w-md mx-auto md:mx-0 mb-10 space-y-4">
                <p className="text-sm md:text-base text-muted-foreground/90 italic leading-relaxed">
                  "Ladies and gentlemen, we are experiencing a brief technical difficulty.
                </p>
                <p className="text-sm md:text-base text-muted-foreground/90 italic leading-relaxed">
                  This page has temporarily left the building.
                </p>
                <p className="text-sm md:text-base text-muted-foreground/90 italic leading-relaxed">
                  Please remain calm and use the buttons below to return to safety.
                </p>
                <p className="text-sm md:text-base text-muted-foreground/90 italic leading-relaxed">
                  Thank you for your patience."
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-pink-500/20 hover:shadow-xl hover:shadow-pink-500/30 transition-all"
                  >
                    <Home size={18} />
                    Back to Home
                  </motion.button>
                </Link>

                <Link href="/work">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border hover:bg-muted/50 font-bold uppercase tracking-wider text-sm transition-all backdrop-blur-sm"
                  >
                    <Briefcase size={18} />
                    View Portfolio
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
