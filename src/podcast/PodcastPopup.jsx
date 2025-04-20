import React from "react";
import { X } from "lucide-react";

const PodcastPopup = ({ podcast, onClose, setViews }) => {
  const handlePlayCount = async () => {
    try {
      const res = await fetch(`http://localhost:8087/api/podcast/${podcast.id}/play`, {
        method: "POST",
      });
      const data = await res.json();
      setViews(data.views); // Update the views state
    } catch (error) {
      console.error("Failed to update play count:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full sm:max-w-3xl bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-fade-in-up transition-all">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition duration-200"
        >
          <X size={24} />
        </button>

        {/* Podcast Details */}
        <div className="flex flex-col sm:flex-row p-6 gap-6">
          <img
            src={podcast.cover}
            alt={podcast.title}
            className="w-full sm:w-48 h-48 object-cover rounded-xl shadow-md"
          />
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{podcast.title}</h2>
            <p className="text-gray-400 mb-1">🎙 Host: {podcast.host}</p>
            <p className="text-gray-400 mb-1">📁 Category: {podcast.category}</p>
            <p className="text-gray-400 mb-1">⏱ Duration: {podcast.duration}</p>
            <p className="text-gray-400">📅 Date: {podcast.date}</p>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">🎧 Listen Now</h3>
              <audio
                controls
                className="w-full rounded-md overflow-hidden bg-gray-700"
                onPlay={handlePlayCount} // Trigger play count update on playback
              >
                <source src={podcast.audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPopup;
