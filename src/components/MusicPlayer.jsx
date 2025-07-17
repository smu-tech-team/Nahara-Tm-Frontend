import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FaHeart, FaPlay, FaSearch, FaHome, FaMusic, FaFire,
  FaChevronDown, FaChevronUp, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Draggable from 'react-draggable';
import { ClipLoader } from 'react-spinners';
import { motion, AnimatePresence } from 'framer-motion';
import CategoryBanner from './CatBanner';

// Sidebar component
const Sidebar = ({ setCategory }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
<aside className="bg-transparent text-black dark:text-white w-64 p-6 fixed h-screen z-30 overflow-auto">
      <h2 className=" animate-gradient-flow-x nahara font-bold flex  flex-center">Ex-Plore</h2>
      {[
        { name: 'Home', icon: <FaHome /> },
        { name: 'Trending', icon: <FaFire /> },
      ].map((item) => (
        <button
          key={item.name}
          onClick={() => setCategory(item.name.toLowerCase())}
          className="flex items-center gap-3 py-3 px-4 hover:bg-gray-700 rounded-md w-full"
        >
          {item.icon} {item.name}
        </button>
      ))}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-3 py-3 px-4 hover:bg-gray-700 rounded-md w-full"
        >
          <FaMusic /> Genres
          <span className="ml-auto">{showDropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="pl-8 mt-2 space-y-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {['Hip-Hop', 'Afrobeat', 'Gospel'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setCategory(genre.toLowerCase())}
                  className="flex items-center gap-2 py-2 px-2 hover:bg-gray-700 rounded-md w-full"
                >
                  <FaMusic /> {genre}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
    
  );
};
const FloatingMenu = ({ autoplay, toggleAutoplay }) => (
  <div className="fixed bottom-8 left-8 bg-black p-4 rounded-lg shadow-lg flex items-center gap-4 border border-gray-600 z-50">
    <button
      onClick={toggleAutoplay}
      className={`px-4 py-2 rounded text-white ${autoplay ? 'bg-green-600' : 'bg-gray-700'} transition`}
    >
      Autoplay: {autoplay ? 'On' : 'Off'}
    </button>
    <FaSearch className="text-gray-300 hover:text-white cursor-pointer" />
  </div>
);
const TrendingSongs = ({ premium }) => {
  const [category, setCategory] = useState('trending');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [autoplay, setAutoplay] = useState(() => localStorage.getItem('autoplay') === 'true');
  const [page, setPage] = useState(1);

  const limit = useMemo(() => (premium ? 10 : 6), [premium]);

  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8087/api/songs/get-song', {
        params: { query: category, limit, page },
      });
      setSongs(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Failed to fetch songs.');
    } finally {
      setLoading(false);
    }
  }, [category, limit, page]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  useEffect(() => {
    localStorage.setItem('autoplay', autoplay);
  }, [autoplay]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (autoplay && playingVideo !== null && playingVideo < songs.length - 1) {
      const timer = setTimeout(() => setPlayingVideo((prev) => prev + 1), 5000);
      return () => clearTimeout(timer);
    }
  }, [playingVideo, autoplay, songs.length]);

  const convertToEmbedUrl = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=${autoplay ? 1 : 0}` : url;
  };

  const toggleFavorite = (song) => {
    const exists = favorites.find((f) => f.streamUrl === song.streamUrl);
    if (!exists) {
      const updated = [...favorites, song];
      setFavorites(updated);
      toast.success('Added to favorites!');
    }
  };

  return (
    <div className="flex  text-black dark:text-white min-h-screen mt-5 rounded-lg mb-5">
      <Sidebar setCategory={setCategory} />

      <main className="flex-grow p-4 sm:ml-64">
        <motion.div
          className="bg-gradient-to-r from-black via-gray-900 to-red-800 p-6 rounded-lg shadow-xl text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-white">Nahara Music</h1>
          <p className="text-lg mt-2 text-gray-200">Discover trending vibes.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center flex-col">
              <ClipLoader color="#00FF99" />
              <p className="mt-4">Loading songs...</p>
            </div>
            
          ) : songs.length === 0 ? (
            <div className="col-span-full text-center text-red-400">No songs found.</div>
          ) : (
            songs.map((song, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <img
                  src={song.thumbnail}
                  alt={song.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                  {song.duration}
                </span>
                {playingVideo === index ? (
                  <iframe
                    width="100%"
                    height="200px"
                    src={convertToEmbedUrl(song.streamUrl)}
                    title="Now Playing"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <button
                    onClick={() => setPlayingVideo(index)}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 rounded"
                  >
                    <FaPlay className="text-white text-2xl" />
                  </button>
                )}
                <h3 className="mt-2 text-lg font-semibold text-blue-400">{song.title}</h3>
                <button
                  onClick={() => toggleFavorite(song)}
                  className="mt-2 flex items-center gap-2 text-pink-400 hover:text-pink-300 transition"
                >
                  <FaHeart /> Add to Favorites
                </button>
              </motion.div>
            ))
          )}
        </div>
        <CategoryBanner/>
        <div className="flex justify-center items-center gap-6 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded flex items-center gap-2"
          >
            <FaChevronLeft /> Prev
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded flex items-center gap-2"
          >
            Next <FaChevronRight />
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-400">🎶 Powered by YouTube</p>
      </main>
      {autoplay && playingVideo !== null && songs[playingVideo] && (
        <Draggable>
  <div className="fixed bottom-24 right-8 bg-black/80 p-4 rounded-lg text-white shadow-lg z-40 flex items-center gap-3 cursor-move">
    <FaMusic className="text-green-400" />
    <span>Now Playing: {songs[playingVideo].title}</span>
    <img
      src={songs[playingVideo].thumbnail}
      alt={songs[playingVideo].title}
      className="w-16 h-16 object-cover rounded"
    />
    <div>
      <p className="text-sm text-gray-300">{songs[playingVideo].duration}</p>
    </div>
  </div>
</Draggable>

      )}
       

      <FloatingMenu autoplay={autoplay} toggleAutoplay={() => setAutoplay((a) => !a)} />
    </div>
  );
};

export default TrendingSongs;
