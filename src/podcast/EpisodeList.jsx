import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EpisodeList = ({ excludeId }) => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8087/api/episodes?page=0&size=10', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch episodes');
        const data = await response.json();

        const filtered = excludeId ? data.filter(ep => ep.episode_id !== excludeId) : data;
        setEpisodes(filtered);
      } catch (error) {
        console.error('Error loading episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [excludeId]);

  if (loading) {
    return <p className="text-center mt-4 text-gray-400">Loading episodes...</p>;
  }

  if (!episodes.length) {
    return <p className="text-center text-gray-500">No other episodes found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {episodes.map((episode) => (
        <div
          key={episode.episode_id}
          onClick={() => navigate(`/episode/${episode.episode_id}`)}
          className="bg-gray-800 dark:bg-gray-900 text-white dark:text-white rounded-lg shadow hover:shadow-lg transition duration-300 cursor-pointer overflow-hidden"
        >
          <img
            src={episode.coverImageUrl}
            alt={episode.title}
            className="h-48 w-full object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold truncate">{episode.title}</h3>
            <h3 className="text-xl font-bold truncate">{episode.creatorId}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{episode.description}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                {episode.category || 'General'}
              </span>
              <span className="text-xs text-gray-400">{episode.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
