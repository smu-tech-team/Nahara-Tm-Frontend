import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

const ReplyBox = ({ replyTo, onCancel }) => {
  if (!replyTo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="mt-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border-l-4 border-blue-500 flex items-center justify-between shadow-sm"
    >
      <div className="flex items-start gap-2 w-full overflow-hidden">
        {/* Avatar */}
        <img
          src={replyTo.user?.img || "/default-avatar.png"}
          alt={replyTo.userName || replyTo.user?.name || "Anonymous"}
          className="w-8 h-8 rounded-full object-cover"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-300 truncate">
            Replying to {replyTo.userName || replyTo.user?.name || "Anonymous"}
          </div>
          <div
            title={replyTo.content}
            className="text-xs text-gray-600 dark:text-gray-300 truncate"
          >
            {replyTo.content?.substring(0, 100) || "No content"}
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="ml-2 text-red-500 hover:text-red-700 p-1 rounded transition"
        title="Cancel reply"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default ReplyBox;
