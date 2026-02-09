import { Link } from 'wouter';
import { Home, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="404 - Page Not Found | Brandon PT Davis" 
        description="This page has left the building."
      />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-12"
          >
            {/* 404 Number */}
            <div className="space-y-6">
              <motion.h1 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-[12rem] md:text-[16rem] leading-none font-['Playfair_Display'] italic font-bold bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              >
                404
              </motion.h1>
              
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto" />
            </div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-display uppercase tracking-[0.2em] text-foreground">
                Off Script
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                This page has wandered off stage.<br />
                Let's get you back to the show.
              </p>
            </motion.div>

            {/* Navigation Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Home size={18} />
                  Back to Home
                </motion.button>
              </Link>

              <Link href="/projects">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-border hover:bg-muted font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  <Briefcase size={18} />
                  View Portfolio
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
