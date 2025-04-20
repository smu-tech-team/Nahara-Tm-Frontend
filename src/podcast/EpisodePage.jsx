import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MiniPlayer from './MiniPlayer';

const EpisodePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [otherEpisodes, setOtherEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playbackTime, setPlaybackTime] = useState(0);
  const audioRef = useRef(null);

  // Fetch Episode Data
  useEffect(() => {
    const fetchEpisodeData = async () => {
      try {
        const page = Math.floor(Math.random() * 100) + 1;
        const limit = Math.floor(Math.random() * 100) + 1;

        const episodeResponse = await fetch(`http://localhost:8087/api/${id}?page=${page}&limit=${limit}`);
        const episodeData = await episodeResponse.json();
        setEpisode(episodeData);

        const otherEpisodesResponse = await fetch(`http://localhost:8087/api/episodes?page=${page}&limit=${limit}`);
        const otherEpisodesData = await otherEpisodesResponse.json();
        setOtherEpisodes(otherEpisodesData.filter((ep) => ep.id !== parseInt(id)));

        const savedTime = localStorage.getItem(`playback-${id}`);
        if (savedTime) setPlaybackTime(parseFloat(savedTime));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodeData();
  }, [id]);

  // Persist playback time
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        localStorage.setItem(`playback-${id}`, audioRef.current.currentTime);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // Handle auto-play next episode
  const handleEpisodeEnd = () => {
    const next = otherEpisodes[0];
    if (next) navigate(`/episode/${next.id}`);
  };

  const skipTime = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const addToFavorites = (ep) => {
    console.log('Added to favorites:', ep);
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
      {/* Back */}
      <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline mb-6">&larr; Back</button>

      {/* Episode */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-20">
        <h1 className="text-4xl font-bold text-white">{episode.title}</h1>
        <p className="text-gray-400 mt-2">Host: {episode.creatorId}</p>
        <p className="text-gray-500">{episode.date} | Duration: {episode.duration}</p>
        <p className="mt-4 text-gray-300">{episode.description}</p>

        {/* Audio Controls */}
        <div className="mt-6">
          <audio
            ref={audioRef}
            controls
            autoPlay
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
              Playing: {Math.floor(playbackTime)}s / {episode.totalDuration || 'unknown'}s
            </p>
            <button
              onClick={() => skipTime(15)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full"
            >
              15s ⏩
            </button>
          </div>
        </div>

        {/* Favorites */}
        <button
          onClick={() => addToFavorites(episode)}
          className="bg-yellow-400 text-black px-6 py-3 rounded-full mt-6 hover:bg-yellow-500 transition duration-300"
        >
          Add to Favorites
        </button>
      </div>

      {/* Other Episodes */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-center">More Episodes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherEpisodes.map((ep) => (
            <div
              key={ep.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition duration-300"
              onClick={() => navigate(`/episode/${ep.id}`)}
            >
              <h3 className="text-xl font-semibold text-white">{ep.title}</h3>
              <p className="text-sm text-gray-400">{ep.date} | {ep.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mini Player (Docked) */}
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
