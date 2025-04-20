import React, { useEffect, useRef, useState } from "react";
import FullPlayerModal from "./FullPlayerModal";
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaHeart, FaVolumeUp } from "react-icons/fa";

const MiniPlayer = ({ episode, onSkip }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showFullPlayer, setShowFullPlayer] = useState(false);

  useEffect(() => {
    if (audioRef.current && episode) {
      audioRef.current.src = episode.audioUrl || "";
      const savedTime = localStorage.getItem(`playback-${episode.id}`);
      if (savedTime) {
        audioRef.current.currentTime = parseFloat(savedTime) || 0;
      }
      setLikes(episode.likes || 0);
    }
  }, [episode]);

  useEffect(() => {
    if (!audioRef.current || !episode) return;
    const interval = setInterval(() => {
      localStorage.setItem(`playback-${episode.id}`, audioRef.current.currentTime || 0);
    }, 2000);
    return () => clearInterval(interval);
  }, [episode]);

  const handlePlay = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);

      await fetch(`http://localhost:8087/api/episode/${episode.id}/play`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Playback failed:", err);
    }
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const skip = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleProgressChange = (e) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
  };

  const handleLike = async () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    await fetch(`http://localhost:8087/api/episode/${episode.id}/like`, { method: "POST" });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* Sticky Mini Player */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="group relative transition-all duration-300 bg-gray-900 hover:h-32 h-20 border-t border-gray-700 px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Info Section */}
          <div
            onClick={() => setShowFullPlayer(true)}
            className="cursor-pointer flex items-center space-x-4 w-full sm:w-auto"
          >
            <img
              src={episode?.cover || "/default-cover.jpg"}
              alt="Episode Cover"
              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
            />
            <div>
              <h4 className="text-white font-bold text-sm sm:text-lg truncate max-w-xs">
                {episode?.title || "Unknown Episode"}
              </h4>
              <p className="text-gray-400 text-xs sm:text-sm">Now Playing</p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => skip(-15)}
              className="text-white text-lg sm:text-xl hover:scale-110 transition"
              aria-label="Rewind"
            >
              <FaStepBackward />
            </button>

            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full hover:bg-blue-500 transition"
                aria-label="Play"
              >
                <FaPlay />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-full hover:bg-blue-500 transition"
                aria-label="Pause"
              >
                <FaPause />
              </button>
            )}

            <button
              onClick={() => skip(15)}
              className="text-white text-lg sm:text-xl hover:scale-110 transition"
              aria-label="Fast Forward"
            >
              <FaStepForward />
            </button>

            {/* Volume Control */}
            <div className="hidden sm:flex items-center space-x-2">
              <FaVolumeUp className="text-white" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-24"
              />
            </div>

            {/* Progress */}
            <input
              type="range"
              min={0}
              max={audioRef.current?.duration || 100}
              value={progress}
              onChange={handleProgressChange}
              onInput={(e) => setProgress(parseFloat(e.target.value))}
              className="w-28 sm:w-36"
            />

            {/* Time Display */}
            <p className="text-white text-xs sm:text-sm min-w-[80px]">
              {formatTime(progress)} / {formatTime(audioRef.current?.duration || 0)}
            </p>

            {/* Likes */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 text-white px-3 py-1 rounded-full text-sm font-semibold hover:bg-gray-800 transition ${
                hasLiked ? "opacity-50" : ""
              }`}
            >
              <FaHeart /> <span>{likes}</span>
            </button>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          onEnded={onSkip}
          onTimeUpdate={() => setProgress(audioRef.current?.currentTime || 0)}
        />
      </div>

      {/* Full Player Modal */}
      {showFullPlayer && (
        <FullPlayerModal
          episode={episode}
          onClose={() => setShowFullPlayer(false)}
        />
      )}
    </>
  );
};

export default MiniPlayer;
