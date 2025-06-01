import React, { useEffect, useRef, useState } from "react";
import FullPlayerModal from "./FullPlayerModal";
import { Pause, Play, SkipBack, SkipForward, Heart } from "lucide-react";

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
      const savedTime = localStorage.getItem(`playback-${episode.episode_id}`);
      if (savedTime) {
        audioRef.current.currentTime = parseFloat(savedTime) || 0;
      }
      setLikes(episode.likes || 0);
    }
  }, [episode]);

  useEffect(() => {
    if (!audioRef.current || !episode) return;

    const interval = setInterval(() => {
      const currentTime = audioRef.current.currentTime || 0;
      localStorage.setItem(`playback-${episode.episode_id}`, currentTime);

      // 🔥 Removed backend POST request to save playback
    }, 5000);

    return () => clearInterval(interval);
  }, [episode]);

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  // ✅ Newly added
  const handlePlay = async () => {
    try {
      await audioRef.current?.play();
      setIsPlaying(true);

      // Optional: You can re-enable backend call if needed
      // await fetch(`http://localhost:8087/api/episodes/episode/${episode.episode_id}/play`, {
      //   method: "POST",
      // });
    } catch (err) {
      console.error("Playback failed:", err);
    }
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
    if (hasLiked || !episode) return;
    setHasLiked(true);
    setLikes((prev) => prev + 1);
    await fetch(`http://localhost:8087/api/episodes/${episode.episode_id}/like`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Episode Info */}
          <div
            onClick={() => setShowFullPlayer(true)}
            className="flex-1 cursor-pointer min-w-0"
          >
            <h4 className="text-white font-bold truncate text-sm md:text-lg">
              {episode?.title || "Unknown Episode"}
            </h4>
            <p className="text-gray-400 text-xs md:text-sm">Now Playing</p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-between md:justify-end w-full md:w-auto">
            {/* Skip Back */}
            <button onClick={() => skip(-15)} className="text-white hover:text-gray-300">
              <SkipBack size={20} />
            </button>

            {/* Play / Pause */}
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="bg-white text-black px-4 py-1 rounded-full font-semibold text-sm"
              >
                <Play size={18} className="inline-block mr-1" /> Play
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="bg-white text-black px-4 py-1 rounded-full font-semibold text-sm"
              >
                <Pause size={18} className="inline-block mr-1" /> Pause
              </button>
            )}

            {/* Skip Forward */}
            <button onClick={() => skip(15)} className="text-white hover:text-gray-300">
              <SkipForward size={20} />
            </button>

            {/* Volume */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-blue-500"
            />

            {/* Progress */}
            <input
              type="range"
              min={0}
              max={audioRef.current?.duration || 100}
              value={progress}
              onChange={handleProgressChange}
              onInput={(e) => setProgress(parseFloat(e.target.value))}
              className="w-32 md:w-40 accent-green-500"
            />

            {/* Time */}
            <div className="text-white text-xs min-w-[80px] text-right">
              {formatTime(progress)} / {formatTime(audioRef.current?.duration || 0)}
            </div>

            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center text-white text-sm px-2 py-1 rounded-full ${
                hasLiked ? "opacity-50 cursor-default" : "hover:bg-gray-800"
              }`}
            >
              <Heart size={16} className="mr-1" /> {likes}
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

      {/* Full Modal */}
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
