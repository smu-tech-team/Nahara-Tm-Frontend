import React, { useState } from "react";
import { FaHeart, FaPlay, FaShareAlt } from "react-icons/fa";
import ShareEmbed from "./ShareEmbed";

const PodcastActions = ({
  podcastId,
  initialLikes = 0,
  initialViews = 0,
  initiallyLiked = false,
  setSelectedPodcast,
  podcast,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [views, setViews] = useState(initialViews);
  const [liked, setLiked] = useState(initiallyLiked);
  const [showShare, setShowShare] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:8087/api/podcast/${podcastId}/like`, {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch (err) {
      console.error("Failed to like podcast:", err);
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    setViews((prevViews) => prevViews + 1);
    setSelectedPodcast(podcast);
  };

  return (
    <>
      <div className="flex items-center gap-4 text-gray-700 dark:text-white">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <FaHeart className={liked ? "text-red-600" : ""} />
          <span>{likes}</span>
        </button>

        {/* Play Button */}
        <button
          onClick={handlePlay}
          className="flex items-center gap-1 hover:text-green-500 transition"
        >
          <FaPlay />
          <span>{views}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShare(true);
          }}
          className="flex items-center gap-1 hover:text-blue-400 transition"
        >
          <FaShareAlt />
          <span>Share</span>
        </button>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setShowShare(false)}
        >
          <div
            className="bg-gray-900 text-white border border-gray-700 rounded-lg p-6 w-[90%] max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowShare(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            <ShareEmbed podcastId={podcastId} />
          </div>
        </div>
      )}
    </>
  );
};

export default PodcastActions;
