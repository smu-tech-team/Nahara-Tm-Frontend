import { motion } from "framer-motion";

export const LiveSessionList = ({ sessions, selectedSession, onSelect }) => (
  <ul className="space-y-6">
    {sessions.map((session) => (
      <motion.li
        key={session.id}
        onClick={() => onSelect(session)}
        initial={{ opacity: 0.8, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className={`p-5 rounded-xl cursor-pointer shadow-lg bg-gradient-to-r from-[#2c3e50] to-[#4ca1af] hover:shadow-2xl ${
          selectedSession?.id === session.id ? "ring-2 ring-yellow-400" : ""
        }`}
      >
        {session.creatorImageUrl && (
          <img
            src={session.creatorImageUrl}
            alt={session.creatorName || "Creator"}
            className="rounded-full h-14 w-14 object-cover mb-3"
          />
        )}
        <h3 className="text-xl font-semibold">{session.title}</h3>
        <p className="text-sm text-gray-200">👤 Host: {session.creatorName || "Unknown"}</p>
        <p className="text-sm text-gray-300">
          ⏱️ Live for: {Math.floor((Date.now() - new Date(session.startedAt)) / 60000)} min
        </p>
      </motion.li>
    ))}
  </ul>
);