// src/components/ChatAdCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ChatAdCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="my-6 p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-300 dark:to-yellow-100 shadow-md border border-yellow-300"
      role="region"
      aria-label="Sponsored ad"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-yellow-600 w-6 h-6 animate-pulse" />
          <div className="text-left">
            <p className="text-md font-semibold text-gray-800 dark:text-gray-900">
              Sponsored Tip
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-800">
              🎯 Get <span className="font-bold">50% off</span> your next sports prediction!
            </p>
          </div>
        </div>
        <a
          href="#"
          className="px-4 py-1.5 text-sm rounded-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition"
        >
          Claim Now
        </a>
      </div>
    </motion.div>
  );
};

export default ChatAdCard;
