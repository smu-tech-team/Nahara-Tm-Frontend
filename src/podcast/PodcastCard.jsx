import React, { useState } from "react";
import { Heart, HeartOff } from "lucide-react";
import PodcastActions from "./PodcastActions";
import PodcastPopup from "./PodcastPopup";

const PodcastCard = ({ podcast,  isFavorite, onToggleFavorite }) => {
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [views, setViews] = useState(podcast?.views || 0);

  if (!podcast) {
    console.warn("PodcastCard missing 'podcast' prop");
    return null;
  }

  const { title, cover, host, date, duration, category, description } = podcast;

  return (
    <div className="relative bg-gray-900 rounded-3xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="relative w-full h-48 sm:h-56 lg:h-64">
        <img
          src={cover}
          alt={`${title} cover`}
          className="w-full h-full object-cover rounded-t-3xl"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3 text-white">
        {/* Title */}
        <h3 className="text-xl font-bold text-center truncate">{title}</h3>

        {/* Host and Category */}
        <div className="flex justify-center gap-4 flex-wrap text-sm text-gray-400">
          <div className="flex items-center gap-1">
            🎙 <span className="text-white font-medium">{host || "Unknown Host"}</span>
          </div>
          <div className="flex items-center gap-1">
            📁 <span className="text-white font-medium">{category || "Uncategorized"}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-400 text-center line-clamp-2">{description || "No description available"}</p>

        {/* Footer Info */}
        <div className="flex justify-center gap-4 text-xs text-gray-400">
          <span>{date || "Unknown Date"}</span>
          <span>{duration || "Unknown Duration"}</span>
        </div>

        {/* Actions */}
        <PodcastActions
          podcastId={podcast.id}
          initialLikes={podcast.likes?.length || 0}
          initialViews={views}
          initiallyLiked={podcast.likedByCurrentUser || false}
          setSelectedPodcast={setSelectedPodcast}
          podcast={podcast}
        />
      </div>

      {/* Favorite Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        className="absolute top-3 right-3 bg-gray-800 bg-opacity-80 p-2 rounded-full hover:bg-red-600 transition"
      >
        {isFavorite ? <Heart className="text-red-500" /> : <HeartOff className="text-white" />}
      </button>

      {/* Podcast Popup */}
      {selectedPodcast && (
        <PodcastPopup
          podcast={selectedPodcast}
          onClose={() => setSelectedPodcast(null)}
          setViews={setViews}
        />
      )}
    </div>
  );
};

export default PodcastCard;
