import React from 'react';
import { motion } from 'framer-motion';
const LoadingSpinner = () => {
  console.log("Rendering Loading Spinner...");

  return (
    
    <motion.div
      className="flex justify-center items-center min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }} 
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 1.5, 
          ease: "easeInOut",
        }}
      >
        <motion.img
          src="/Nahara_Logo[1].png"
          alt="Logo"
          className="w-32 mb-4 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 2, 
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="border-t-4 border-red-800 border-solid w-16 h-16 rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default LoadingSpinner;
