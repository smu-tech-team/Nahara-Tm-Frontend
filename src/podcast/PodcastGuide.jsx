import React from "react";
import { FaMicrophoneAlt, FaClock, FaBroadcastTower } from "react-icons/fa";

const PodcastGuide = () => {
  return (
    <div className="mt-12 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600 dark:text-white mb-4">
        🎧 How Live Podcast Works
      </h2>
      <ul className="space-y-4 text-gray-800 dark:text-gray-100">
        <li className="flex items-start gap-3">
          <FaMicrophoneAlt className="mt-1 text-indigo-500" />
          <span><strong>Create a Session:</strong> Start by scheduling or launching a podcast session as a creator.</span>
        </li>
        <li className="flex items-start gap-3">
          <FaBroadcastTower className="mt-1 text-indigo-500" />
          <span><strong>Go Live:</strong> Once you&#39;re live, followers can listen in real time via a shared link.</span>
        </li>
        <li className="flex items-start gap-3">
          <FaClock className="mt-1 text-indigo-500" />
          <span><strong>Duration:</strong> Each live podcast lasts for <span className="text-red-500 font-semibold">30 minutes</span> max to keep things exciting and focused.</span>
        </li>
      </ul>
    </div>
  );
};

export default PodcastGuide;