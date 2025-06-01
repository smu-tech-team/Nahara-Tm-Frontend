import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AdsFloating = ({ leftBannerUrl, rightBannerUrl, leftLink, rightLink }) => {
  const { ref: leftRef, inView: leftInView } = useInView({ triggerOnce: false, threshold: 0 });
  const { ref: rightRef, inView: rightInView } = useInView({ triggerOnce: false, threshold: 0 });

  const [showAds, setShowAds] = useState(true);

  if (!showAds) return null;

  return (
    <>
      {/* Left Floating Ad */}
      <motion.div
        ref={leftRef}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: leftInView ? 1 : 0, y: leftInView ? [0, -10, 0] : 0 }}
        transition={{ duration: 1.5, repeat: leftInView ? Infinity : 0, ease: 'easeInOut' }}
        className="fixed left-4 bottom-4 sm:top-1/2 sm:left-6 transform -translate-y-1/2 z-40"
      >
        <a href={leftLink} target="_blank" rel="noopener noreferrer">
          <h1 className="flex justify-center font-bold text-sm sm:text-lg">Ads</h1>
          <img
            src={leftBannerUrl}
            alt="Left Banner Ad"
            className="w-32 sm:w-48 h-auto rounded-2xl shadow-lg sm:shadow-2xl hover:scale-105 transition-transform duration-300"
          />
        </a>
      </motion.div>

      

      {/* Bottom Floating Ads for Mobile */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center z-40 sm:hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-2 flex items-center justify-between"
        >
          <a href={leftLink} target="_blank" rel="noopener noreferrer">
            <img src={leftBannerUrl} alt="Ad" className="w-24 sm:w-32 h-auto rounded-lg" />
          </a>
          <button 
            onClick={() => setShowAds(false)} 
            className="text-sm font-bold text-gray-600 hover:text-gray-800 transition"
          >
            ✖ Close
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default AdsFloating;
