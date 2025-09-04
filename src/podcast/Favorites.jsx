import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMicrophone, FaFolderOpen, FaClock, FaAlignLeft } from 'react-icons/fa';
import axios from 'axios';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  useEffect(() => {
    const fetchFavorites = async () => {
        try {
          const jwtToken = localStorage.getItem("jwtToken");
          const response = await fetch(`https://nahara-production.up.railway.app/api/episodes/favorites`, {
            headers: {
              "Authorization": `Bearer ${jwtToken}`,
            },
          });
      
          if (!response.ok) throw new Error("Failed to fetch favorites");
          const data = await response.json();
      
          const updatedFavorites = await Promise.all(
            data.map(async (ep) => {
              const duration = await getAudioDuration(ep.audioUrl);
              return { ...ep, duration };
            })
          );
      
          setFavorites(updatedFavorites);
        } catch (error) {
          console.error("Error fetching favorites:", error);
        }
      };
      
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const getAudioDuration = (audioUrl) => {
    return new Promise((resolve) => {
      if (!audioUrl) {
        resolve("N/A");
        return;
      }

      const audio = new Audio(audioUrl);
      audio.addEventListener("loadedmetadata", () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        resolve(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
      });

      audio.addEventListener("error", () => {
        console.error("Error loading audio metadata for:", audioUrl);
        resolve("N/A");
      });
    });
  };

  const confirmDelete = (episodeId) => {
    setSelectedEpisodeId(episodeId);
    setShowModal(true);
  };

  const handleDeleteFavorite = async () => {
    try {
      const response = await fetch(
        `https://nahara-production.up.railway.app/api/episodes/favorites/${selectedEpisodeId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
  
      if (!response.ok) throw new Error("Failed to delete favorite");
  
      setFavorites((prev) =>
        prev.filter((ep) => ep.episode_id !== selectedEpisodeId)
      );
      setShowModal(false);
      setSelectedEpisodeId(null);
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };
  
  

  return (
    <div className="p-8 bg-transparent dark:bg-black text-black dark:text-white min-h-screen container mx-auto">
      <h2 className="text-4xl font-bold mb-8 text-white text-center">Your Favorites</h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No favorite episodes found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((ep) => (
            <div
              key={ep.episode_id}
              className="relative bg-gray-700 dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            >
              <img
                src={ep.coverImageUrl || "https://via.placeholder.com/300"}
                alt={ep.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-gray-200 dark:text-white mb-2">
               <span className='text-gray-500 font-thin'>Title</span> : {ep.title}
              </h3>
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <FaMicrophone className="text-blue-400" /> Host: {ep.creatorId || "Unknown"}
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <FaFolderOpen className="text-green-400" /> Category: {ep.category || "Uncategorized"}
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <FaClock className="text-yellow-400" /> Duration: {ep.duration || "N/A"}
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-2 mb-1">
                <FaAlignLeft className="text-purple-400" /> Uploaded: {formatDateTime(ep.uploadedAt)}
              </p>

              <div className="absolute top-4 right-4">
                <button
                  onClick={() => confirmDelete(ep.episode_id)}
                  className="bg-red-600 text-white text-sm px-3 py-1 rounded-full hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
              <button
                onClick={() => navigate(`/episode/${ep.episode_id}`)}
                className="mt-4 w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                View Episode
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to remove this episode from your favorites?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-black dark:text-white rounded hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteFavorite}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
