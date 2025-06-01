import React, { useState, useEffect } from "react";
import { FaPodcast } from "react-icons/fa";

const PodcastList = ({ creatorId }) => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPodcasts = async () => {
    if (!creatorId) {
      console.error("Creator ID is undefined, cannot fetch podcasts.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8087/api/creator/creator/${creatorId}/podcasts`);
      const data = await response.json();

      console.log("API Response:", data);

      if (!Array.isArray(data)) {
        console.error("Unexpected response format:", data);
        setPodcasts([]);
        return;
      }

      const sortedPodcasts = data.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setPodcasts(sortedPodcasts);
    } catch (error) {
      console.error("Error fetching podcasts:", error);
      setPodcasts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPodcasts();
  }, [creatorId]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white flex items-center gap-3">
        <FaPodcast className="text-red-500 text-3xl" /> Latest Podcasts
      </h2>

      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300 animate-pulse text-lg">
          Loading podcasts...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300 text-center w-full text-lg">
              ❌ No podcasts found for this creator.
            </p>
          ) : (
            podcasts.map((podcast) => (
              <div
                key={podcast._id || podcast.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                  <a href={podcast.audioUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={podcast.coverImageUrl || "https://via.placeholder.com/300x200"}
                      alt={podcast.title}
                      className="w-full h-64 object-cover rounded-t-lg transition-opacity hover:opacity-90"
                    />
                  </a>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-blue-600 text-center hover:underline">
                    <a href={`/listen-podcast/${podcast._id || podcast.id}`}>{podcast.title}</a>
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-center mt-3 text-sm leading-relaxed">
                    {podcast.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PodcastList;
