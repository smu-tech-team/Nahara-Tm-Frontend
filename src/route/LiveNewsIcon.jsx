import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegBell } from 'react-icons/fa'; // Icon for notifications
import { motion } from 'framer-motion'; // Animation library

const LiveNewsIcon = ({ position = 'below' }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 py-4 flex flex-col items-end space-y-3">
      {/* Conditionally Render the Button Position */}
      {position === 'above' && (
        <motion.button
          onClick={() => navigate('/live-Streams-Trending-Updates')}
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 1.2, repeat: Infinity },
          }}
          className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-1 px-4 rounded-full shadow-lg hover:shadow-xl transition-all w-auto"
        >
          <FaRegBell className="mr-2 text-[16px] md:text-[20px] animate-ping" />
          <span className="font-medium text-xs md:text-sm">View Live News</span>
        </motion.button>
      )}

      {/* Animated Text Section */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-right w-full"
      >
        <h1 className="text-sm md:text-base font-bold text-gray-600">
          Explore Live News Updates
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Stay tuned for live streams from creators!
        </p>
      </motion.div>

      {position === 'below' && (
        <motion.button
          onClick={() => navigate('/live-Streams-Trending-Updates')}
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 1.2, repeat: Infinity },
          }}
          className="flex items-center bg-white dark:bg-black from-blue-500 text-white py-1 px-4 rounded-full shadow-lg hover:shadow-xl transition-all w-auto"
        >
          <FaRegBell className="mr-2 text-[16px] md:text-[20px] bg-red-600 border text-white dark:text-black  rounded-full animate-ping" />
          <span className="font-medium text-xs md:text-sm text-red-600">View Live News</span>
        </motion.button>
      )}
    </div>
  );
};

export default LiveNewsIcon;
