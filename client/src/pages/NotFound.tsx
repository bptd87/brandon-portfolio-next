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
              className="relative w-48 h-72 mx-auto mb-8"
              animate={{ 
                y: [0, -12, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ProgressiveImage
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663337866878/TGWPVtCzkqgWUcQx.jpeg"
                alt="Brandon as a ghost - lost in the theatre"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </motion.div>

            {/* 404 Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-7xl md:text-8xl font-['Playfair_Display'] italic font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                404
              </h1>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <Ghost className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl md:text-2xl font-display uppercase tracking-wider">
                  This Page Has Left the Building
                </h2>
                <Ghost className="h-5 w-5 text-cyan-400" />
              </div>

              <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Looks like this page missed its cue and wandered off into the wings. Even the ghost light couldn't find it.
              </p>

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

      <Footer />
    </div>
  );
}
