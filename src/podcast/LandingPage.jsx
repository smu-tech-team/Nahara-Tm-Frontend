import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPlayCircle } from 'react-icons/fa';
import AdSpace from '../components/AdSpace';


const ITEMS_PER_PAGE = 4;
const LandingPage = () => {
  const navigate = useNavigate();
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [episodePage, setEpisodePage] = useState(1);
  const [creatorPage, setCreatorPage] = useState(1);
  const [hasMoreEpisodes, setHasMoreEpisodes] = useState(true);
  const [hasMoreCreators, setHasMoreCreators] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    loadEpisodes(episodePage);
    loadCreators(creatorPage);
  }, []);

  const handleScroll = useCallback((event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    
    if (bottom) {
      if (hasMoreEpisodes && !loading) {
        const nextEpisodePage = episodePage + 1;
        setEpisodePage(nextEpisodePage);
        loadEpisodes(nextEpisodePage);
      }

      if (hasMoreCreators && !loading) {
        const nextCreatorPage = creatorPage + 1;
        setCreatorPage(nextCreatorPage);
        loadCreators(nextCreatorPage);
      }
    }
  }, [episodePage, creatorPage, hasMoreEpisodes, hasMoreCreators, loading]);

  useEffect(() => {
    const scrollContainer = document.getElementById('content-container');
    scrollContainer.addEventListener('scroll', handleScroll);
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const loadEpisodes = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8087/api/episodes/latest?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const episodes = res.data || [];
  
      const episodesWithDuration = await Promise.all(
        episodes.map(
          (ep) =>
            new Promise((resolve) => {
              const audio = new Audio(ep.audioUrl);
              audio.addEventListener('loadedmetadata', () => {
                const durationInSeconds = Math.floor(audio.duration);
                const minutes = Math.floor(durationInSeconds / 60);
                const seconds = durationInSeconds % 60;
                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                resolve({ ...ep, duration: formattedDuration });
              });
  
              audio.addEventListener('error', () => {
                // fallback duration if audio fails to load
                resolve({ ...ep, duration: 'Unknown' });
              });
            })
        )
      );
  
      if (episodesWithDuration.length === 0 && page === 1) {
        setError('No episodes available at the moment.');
      } else {
        if (episodesWithDuration.length < ITEMS_PER_PAGE) setHasMoreEpisodes(false);
        setLatestEpisodes((prev) => [...prev, ...episodesWithDuration]);
      }
    } catch (err) {
      setError('Failed to load episodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const loadCreators = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8087/api/creator/top?page=${page}&size=${ITEMS_PER_PAGE}`
      );
      const newCreators = res.data || [];
      setTopCreators((prev) => {
        const uniqueMap = new Map();
        [...prev, ...newCreators].forEach((creator) => {
          if (creator?.id) uniqueMap.set(creator.id, creator);
        });
        return Array.from(uniqueMap.values());
      });
      if (newCreators.length < ITEMS_PER_PAGE) setHasMoreCreators(false);
    } catch (error) {
      setError('Failed to load creators');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

  const filteredEpisodes = latestEpisodes.filter(
    (ep) =>
      ep?.title?.toLowerCase().includes(searchQuery) ||
      ep?.host?.toLowerCase().includes(searchQuery)
  );

  const filteredCreators = topCreators.filter((creator) =>
    creator?.name?.toLowerCase().includes(searchQuery)
  );

  const renderSkeletonLoader = (count) => {
    return Array(count).fill(0).map((_, idx) => (
      <div key={idx} className="bg-gray-700 p-6 rounded-lg shadow-lg animate-pulse">
        <div className="h-6 bg-gray-600 rounded-full mb-4"></div>
        <div className="h-4 bg-gray-600 rounded-full mb-2"></div>
        <div className="h-4 bg-gray-600 rounded-full"></div>
      </div>
    ));
  };

  return (
    <div className=" text-black  dark:text-white min-h-screen" id="content-container">
      {/* Header */}
      <header className="py-16 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl sm:text-6xl font-bold"
        >
          Stay Informed, On the Go
        </motion.h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
          Listen to breaking news, interviews, and deep dives curated by top creators.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/explore')}
            className="bg-white text-blue-700 px-6 py-3 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300"
          >
            Explore Podcasts
          </button>
          <button
            onClick={() => navigate(`/live`)}
            className="bg-blue-800 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Listen to Live Podcasts
          </button>
        </div>
        <div className="mt-10">
          <input
            type="text"
            placeholder="Search episodes or creators..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full sm:w-2/3 md:w-1/2 px-4 py-2 rounded-full bg-transparent shadow-black text-black dark:text-white
             border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </header>

      {/* Latest Episodes */}
      <section className="py-12 px-4 sm:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center">Latest Episodes</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? renderSkeletonLoader(ITEMS_PER_PAGE)
            : filteredEpisodes.map((ep) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  key={ep.episodeId}
                  onClick={() => navigate(`/episode/${ep.episode_id}`)}
                  className="relative cursor-pointer bg-gray-500 p-6 rounded-lg shadow-lg group transition-all duration-300"
                >
                  {ep.coverImageUrl && (
                    <div className="relative">
                      <img
                        src={ep.coverImageUrl}
                        alt={ep.title}
                        className="w-full h-48 object-cover mb-4 rounded"
                      />
                      <FaPlayCircle className="absolute bottom-3 right-3 text-white text-3xl opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{ep.title}</h3>
                  <p className="text-sm text-gray-400">Host: {ep.creatorId}</p>
                  <p className="text-sm text-gray-500">
                    Episode: {ep.episode} | Duration: {ep.duration}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(ep.uploadedAt).toDateString()}</p>
                </motion.div>
              ))}
        </div>
      </section>
      <section className="py-12 px-4 sm:px-8  ">
        <h2 className="text-4xl font-bold mb-8 text-center">Top Creators</h2>
        {loading ? (
          <p className="text-center text-gray-400">Loading creators...</p>
        ) : filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCreators.map((creator) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                key={creator.id}
                onClick={() => navigate(`/creator/${creator.id}`)}
                className="cursor-pointer bg-gray-800 p-4 rounded-lg flex items-center space-x-4 shadow-md transition-all"
              >
                <img
                  src={creator.blogProfile || '/default-avatar.png'}
                  alt={creator.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">{creator.name}</h3>
                  <p className="text-sm text-gray-400">
                    {creator.podcastCount || 0} podcasts | {creator.followerCount || 0} followers
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No creators found.</p>
        )}
      </section>
      <AdSpace/>
    </div>
  );
};

export default LandingPage;
