import { motion } from 'framer-motion';
import Icon from "/premium_photo.avif";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background blur circle */}
      <div className="absolute -top-10 -left-10 w-[600px] h-[600px] bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-20 sm:py-24 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16 z-10">
        {/* Text content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight"
          >
            Become a Creator on{' '}
            <span className="text-blue-600">Nahara</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg"
          >
            Share your voice, grow your community, and earn from your passion. Join thousands of creators building the future of content.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a
              href="/register/creator"
              className="px-7 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300"
            >
              Register as a Creator
            </a>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex justify-center mt-10 md:mt-0"
        >
          <img
            src={Icon}
            alt="Creator at work"
            className="rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl object-cover"
            style={{ maxHeight: '400px', width: 'auto' }}
          />
        </motion.div>
      </div>
    </section>
  );
}
