import { Link } from 'wouter';
import { Home, Briefcase, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ProgressiveImage } from '@/components/ProgressiveImage';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="404 - Page Not Found | Brandon PT Davis" 
        description="Looks like this page has gone off-script. Find your way back to the main stage."
      />
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Ghost Image */}
            <motion.div 
              className="relative w-64 h-96 mx-auto mb-12"
              animate={{ 
                y: [0, -15, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative w-full h-full">
                <ProgressiveImage
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TGWPVtCzkqgWUcQx.jpeg"
                  alt="Brandon as a ghost - lost in the theatre"
                  className="w-full h-full object-contain"
                  loading="eager"
                />
                {/* Bottom fade effect */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-8xl md:text-9xl font-['Playfair_Display'] italic font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                404
              </h1>
              
              <div className="flex items-center justify-center gap-3 mb-6">
                <Ghost className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wider">
                  Off Script
                </h2>
                <Ghost className="h-6 w-6 text-cyan-400" />
              </div>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
                Looks like this page has wandered backstage and can't find its mark. 
                Even the ghost light couldn't guide you here.
              </p>
              
              <p className="text-base text-muted-foreground/80 max-w-xl mx-auto mb-12">
                Don't worry—every great production has its improvised moments. 
                Let's get you back to center stage.
              </p>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Home size={20} />
                    Back to Home
                  </motion.button>
                </Link>

                <Link href="/work">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl border-2 border-border hover:bg-muted font-bold uppercase tracking-wider text-sm transition-colors"
                  >
                    <Briefcase size={20} />
                    View Portfolio
                  </motion.button>
                </Link>
              </div>

              {/* Fun Easter Egg Text */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-12 text-xs text-muted-foreground/60 italic"
              >
                "The show must go on... just not on this page."
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
