import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from './SearchBar';
import PodcastList from './PodcastList';
import PodcastCard from './PodcastCard';
import PodcastPopup from './PodcastPopup';
import { Link } from 'react-router-dom';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [sortBy, setSortBy] = useState('date-desc');
  const [popularity, setPopularity] = useState('');
  const [duration, setDuration] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Invalid favorites in localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleAddToFavorites = (podcast) => {
    setFavorites((prev) => {
      const alreadyFav = prev.some((f) => f.id === podcast.id);
      const updated = alreadyFav
        ? prev.filter((f) => f.id !== podcast.id)
        : [...prev, podcast];
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white font-sans">
      {/* Header Section */}
      <Header />

      {/* Hero Section */}
      <section className="px-4 sm:px-8 py-6 sm:py-10 animate-fade-in">
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-10 space-y-6 sm:space-y-0">
            <div>
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Welcome to Nahara Pod</h2>
              <p className="mt-4 text-lg sm:text-xl text-gray-200">
                Discover, explore, and enjoy the best podcasts curated just for you. Dive into your favorite topics today!
              </p>
            </div>
            <Link to="/ads">
              <button className="bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition hover:bg-blue-600">
                Contact Us for ADS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Banner Section */}
      <section className="px-4 sm:px-8 py-6 sm:py-10 animate-fade-in">
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105">
          <a href="#" target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-10 sm:py-16">
              <div className="text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide">Advertise With Us</h2>
                <p className="mt-4 text-gray-300 text-lg sm:text-xl">
                  Reach your ideal audience with tailored promotions. Make your mark today!
                </p>
                <button className="mt-6 bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-md transition">
                  Learn More
                </button>
              </div>
              <div className="mt-8 sm:mt-0">
                <img
                  src="https://via.placeholder.com/350x200"
                  alt="Advertisement"
                  className="w-64 sm:w-80 rounded-md shadow-lg"
                />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="px-4 sm:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <SearchBar onSearch={handleSearch} />
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="All">All</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Sports">Sports</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Business">Business</option>
            </select>

            <select
              onChange={(e) => setSortBy(e.target.value)}
              className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>

            <select
              onChange={(e) => setPopularity(e.target.value)}
              className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            >
              <option value="">Popularity</option>
              <option value="most">Most Popular</option>
              <option value="least">Least Popular</option>
            </select>

            <select
              onChange={(e) => setDuration(e.target.value)}
              className="p-3 bg-gray-800 text-white border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            >
              <option value="">Duration</option>
              <option value="short">Shortest First</option>
              <option value="long">Longest First</option>
            </select>
          </div>
        </div>
      </section>

      {/* Podcast List Section */}
      <section className="px-4 sm:px-8 py-6 sm:py-10 animate-fade-in">
        <PodcastList
          searchTerm={searchTerm}
          category={category}
          onFavorite={handleAddToFavorites}
          favorites={favorites}
          sortBy={sortBy}
          popularity={popularity}
          duration={duration}
        />
      </section>

      {/* Favorites Section */}
      <section className="px-4 sm:px-8 py-6 sm:py-10 bg-black rounded-2xl shadow-xl animate-fade-in">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Your Favorites
        </h2>

        {favorites.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onPlay={() => setSelectedPodcast(podcast)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No favorites added yet.</p>
        )}

        {selectedPodcast && (
          <PodcastPopup
            podcast={selectedPodcast}
            onClose={() => setSelectedPodcast(null)}
          />
        )}
      </section>
    </div>
  );
}

export default App;
