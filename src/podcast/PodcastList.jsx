import React, { useState, useEffect } from 'react';
import PodcastCard from './PodcastCard';
import PodcastPopup from './PodcastPopup';

const PodcastList = ({
  searchTerm,
  category,
  onFavorite,
  favorites,
  sortBy,
  popularity,
  duration,
}) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [filtered, setFiltered] = useState([]);

  const fetchDuration = async (audioUrl) => {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        const duration = Math.floor(audio.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      });
      audio.addEventListener('error', () => resolve('Unknown'));
    });
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      setLoading(true);
      try {
        const url =
          category === 'All' || !category
            ? 'http://localhost:8087/api/podcast/podcasts'
            : `http://localhost:8087/api/podcast/podcasts?category=${category}`;
        const response = await fetch(url);
        const data = await response.json();

        const podcastsFromBackend = Array.isArray(data.content)
          ? await Promise.all(
              data.content.map(async (podcast) => {
                const rawDuration = await fetchDuration(podcast.audioUrl || '');
                const numericDuration = parseInt(rawDuration.split(':')[0]) * 60 + parseInt(rawDuration.split(':')[1]);
                return {
                  ...podcast,
                  title: podcast.title || 'Untitled Podcast',
                  cover: podcast.coverImageUrl || '/default-placeholder.png',
                  host: podcast.blogName || 'Unknown Host',
                  date: podcast.uploadedAt
                    ? new Date(podcast.uploadedAt).toLocaleDateString()
                    : 'Unknown Date',
                  rawDate: podcast.uploadedAt || null,
                  duration: rawDuration,
                  numericDuration,
                };
              })
            )
          : [];

        setPodcasts(podcastsFromBackend);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [category]);

  useEffect(() => {
    let filteredList = [...podcasts];
    if (category !== 'All') {
      filteredList = filteredList.filter((p) => p.category === category);
    }
    if (searchTerm) {
      filteredList = filteredList.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortBy === 'date-desc') {
      filteredList.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
    } else if (sortBy === 'date-asc') {
      filteredList.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
    }
    if (popularity === 'most') {
      filteredList.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (popularity === 'least') {
      filteredList.sort((a, b) => (a.views || 0) - (b.views || 0));
    }
    if (duration === 'short') {
      filteredList.sort((a, b) => a.numericDuration - b.numericDuration);
    } else if (duration === 'long') {
      filteredList.sort((a, b) => b.numericDuration - a.numericDuration);
    }

    setFiltered(filteredList);
  }, [podcasts, searchTerm, category, sortBy, popularity, duration]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
    {loading ? (
      <div className="col-span-3 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div
            key={index}
            className="animate-pulse flex items-center gap-4 bg-gray-800 rounded-lg p-5 shadow"
          >
            <div className="w-20 h-20 bg-gray-700 rounded-md"></div>
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      filtered.map((podcast) => (
        <div
          key={podcast.id}
          className="relative bg-gray-800 text-white rounded-lg p-5 shadow-md hover:shadow-white transition-shadow duration-300"
        >
          <PodcastCard
            podcast={podcast} 
            onPlay={() => setSelectedPodcast(podcast)}
            isFavorite={favorites.some((fav) => fav.id === podcast.id)}
            onToggleFavorite={() => onFavorite(podcast)}
          />
        </div>
      ))
    )}
      {selectedPodcast && (
        <PodcastPopup
          podcast={selectedPodcast}
          onClose={() => setSelectedPodcast(null)}
        />
      )}
    </div>
  );
};

export default PodcastList;
