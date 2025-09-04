import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MiniPlayer from './MiniPlayer';
import { jwtDecode } from "jwt-decode";
import EpisodeList from './EpisodeList'; // ✅ Import EpisodeList

const EpisodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const response = await fetch(`https://nahara-production.up.railway.app/api/episodes/episode/${id}`); 
        if (!response.ok) throw new Error('Failed to fetch episode');

        const data = await response.json();
        setEpisode(data);

        const savedTime = localStorage.getItem(`playback-${id}`);
        if (savedTime) setPlaybackTime(parseFloat(savedTime));
      } catch (error) {
        console.error('Error fetching episode:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        localStorage.setItem(`playback-${id}`, audioRef.current.currentTime);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  const handleEpisodeEnd = () => {
    // Leave this logic to EpisodeList if needed.
    console.log("Episode ended");
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const addToFavorites = async (ep) => {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      alert("Please log in to add to favorites.");
      return;
    }

    try {
      const decodedToken = jwtDecode(jwtToken);
      if (decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem("jwtToken");
        alert("Session expired. Please log in again.");
        return;
      }
    } catch (e) {
      alert("Invalid token. Please log in again.");
      return;
    }

    if (!ep?.episode_id) return alert("Missing episode ID.");

    try {
      const response = await fetch(`https://nahara-production.up.railway.app/api/episodes/episode/${ep.episode_id}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwtToken}`,
        },
      });

      if (!response.ok) throw new Error(await response.text());

      alert("Episode added to favorites!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add to favorites.");
    }
  };

  if (loading) return <p className="text-center mt-12 text-gray-300">Loading episode...</p>;
  if (!episode) return <p className="text-center mt-12 text-gray-300">Episode not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-black text-white min-h-screen container mx-auto relative"
    >
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-6">&larr; Back</button>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {episode.coverImageUrl && (
            <img
              src={episode.coverImageUrl}
              alt="Episode Cover"
              className="w-full lg:w-64 h-64 object-cover rounded-lg"
            />
          )}

          <div className="flex-1">
            <h1 className="text-4xl font-bold">{episode.title}</h1>
            <p className="text-gray-400 mt-2">Host: {episode.creatorId}</p>
            <p className="text-gray-500">
              {episode.date} | Duration: {audioDuration ? `${Math.floor(audioDuration)}s` : 'Loading...'}
            </p>
            <p className="mt-4 text-gray-300">{episode.description}</p>

            <div className="mt-6">
              <audio
                ref={audioRef}
                controls
                autoPlay
                onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration)}
                onEnded={handleEpisodeEnd}
                onTimeUpdate={() => setPlaybackTime(audioRef.current?.currentTime || 0)}
                className="w-full mt-4"
              >
                <source src={episode.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => skipTime(-15)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
                >
                  ⏪ 15s
                </button>
                <p className="text-sm text-gray-400">
                  Playing: {Math.floor(playbackTime)}s / {Math.floor(audioDuration || 0)}s
                </p>
                <button
                  onClick={() => skipTime(15)}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
                >
                  15s ⏩
                </button>
              </div>
            </div>

            <button
              onClick={() => addToFavorites(episode)}
              className="bg-blue-800 text-white px-6 py-3 rounded-full mt-6 hover:bg-blue-600 transition duration-300"
            >
              Add to Favorites
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Updated to render EpisodeList instead of local state */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">More Episodes</h2>
        <EpisodeList excludeId={episode.episode_id} />
      </div>

      <div className="fixed top-20 right-4 md:top-10 md:right-8 z-40">
        <button
          onClick={() => navigate('/favorites')}
          className="bg-blue-800 text-white px-5 py-2.5 text-sm md:text-base rounded-full hover:bg-blue-600 transition duration-300 shadow-lg"
        >
          View Favorites
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-4 flex items-center justify-between z-50">
        <div>
          <h4 className="text-white font-bold text-lg truncate max-w-xs">{episode.title}</h4>
          <p className="text-gray-400 text-sm">Now Playing</p>
        </div>
        <div className="flex items-center gap-3">
          <MiniPlayer episode={episode} onSkip={handleEpisodeEnd} />
        </div>
      </div>
    </motion.div>
  );
};

export default EpisodePage;
