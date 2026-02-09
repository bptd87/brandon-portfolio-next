import { Link } from 'wouter';
import { Home, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { ProgressiveImage } from '@/components/ProgressiveImage';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="404 - Page Not Found | Brandon PT Davis" 
        description="This page has left the building."
      />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Ghost Image with animated transparency */}
            <div className="relative w-48 h-72 mx-auto mb-8">
              <motion.div
                animate={{ 
                  opacity: [0.7, 0.95, 0.7]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ProgressiveImage
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/XmkWKbpBTnVhFHuU.png"
                  alt="Brandon as a ghost - lost in the theatre"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
              </motion.div>
              {/* Bottom fade effect */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-7xl md:text-8xl font-['Playfair_Display'] italic font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                404
              </h1>
              
              <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider mb-6 text-foreground">
                Page Not Found
              </h2>

              <div className="max-w-xl mx-auto mb-8 space-y-3">
                <p className="text-base text-muted-foreground italic">
                  "Ladies and gentlemen, we are experiencing a brief technical difficulty.
                </p>
                <p className="text-base text-muted-foreground italic">
                  This page has temporarily left the building.
                </p>
                <p className="text-base text-muted-foreground italic">
                  Please remain calm and use the buttons below to return to safety.
                </p>
                <p className="text-base text-muted-foreground italic">
                  Thank you for your patience."
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Home size={18} />
                    Back to Home
                  </motion.button>
                </Link>

                <Link href="/work">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-border hover:bg-muted font-bold uppercase tracking-wider text-sm transition-colors"
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
