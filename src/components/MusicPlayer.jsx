import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaPlay, FaPause } from "react-icons/fa";
import Cover from "/SmartLogoMain.png"

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("trending");
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch songs dynamically
  const fetchSongs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8087/api/songs/get-songs?category=${selectedCategory}`
      );
      setSongs(response.data || []); // Use backend data directly
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Handle play/pause functionality
  const handlePlayPause = (song) => {
    if (!song.preview || !song.preview.includes(".mp3")) {
      alert("Audio preview is not available for this song.");
      return;
    }

    if (currentSong?.title === song.title && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (currentSong?.title !== song.title) {
        if (audio) audio.pause(); // Stop any existing audio
        const newAudio = new Audio(song.preview);
        setAudio(newAudio);
        setCurrentSong(song);
        newAudio.play();
        setShowPopup(true);
        setIsPlaying(true);
      }
    }
  };

  // Close popup
  const closePopup = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setShowPopup(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        SMUTV MUSIC SPOT
      </h1>

      {/* Category Selector */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          className={`text-blue-800 font-medium hover:underline ${
            selectedCategory === "trending" ? "underline" : ""
          }`}
          onClick={() => setSelectedCategory("trending")}
        >
          Trending
        </button>
        <button
          className={`text-blue-800 font-medium hover:underline ${
            selectedCategory === "recommendations" ? "underline" : ""
          }`}
          onClick={() => setSelectedCategory("recommendations")}
        >
          Recommendations
        </button>
        <button
          className={`text-blue-800 font-medium hover:underline ${
            selectedCategory === "new-releases" ? "underline" : ""
          }`}
          onClick={() => setSelectedCategory("new-releases")}
        >
          New Releases
        </button>
      </div>

      {/* Song Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))
          : songs.map((song, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={song.album.cover || Cover}
                    alt={song.title || "No Title Available"}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity">
                    {song.preview ? (
                      <button
                        className="bg-white text-blue-800 rounded-full p-2 shadow-md hover:bg-blue-800 hover:text-white"
                        onClick={() => handlePlayPause(song)}
                      >
                        {isPlaying && currentSong?.title === song.title ? <FaPause /> : <FaPlay />}
                      </button>
                    ) : (
                      <span className="text-white font-bold">No Preview</span>
                    )}
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">{song.title || "Unknown Title"}</h3>
                  <p className="text-sm text-gray-500">{song.artist || "Unknown Artist"}</p>
                </div>
              </div>
            ))}
      </div>

      {/* Popup for song details */}
      {showPopup && currentSong && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <button
              className="text-red-500 text-sm font-bold float-right"
              onClick={closePopup}
            >
              X
            </button>
            <div className="text-center">
              <img
                src={currentSong.album.cover || "https://via.placeholder.com/150"}
                alt={currentSong.title || "No Title Available"}
                className="w-48 h-48 mx-auto rounded-lg mb-4"
              />
              <h3 className="text-lg font-bold">{currentSong.title || "Unknown Title"}</h3>
              <p className="text-sm text-gray-500">{currentSong.artist || "Unknown Artist"}</p>
              <a
                href={currentSong.preview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 block"
              >
                View on Last.fm
              </a>
              <p className="text-sm text-gray-400">
                Duration: {audio?.duration ? `${Math.floor(audio.duration / 60)}:${Math.floor(audio.duration % 60)}` : "Unavailable"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
