import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchBar from './SearchBar';
import PodcastList from './PodcastList';
import PodcastCard from './PodcastCard';
import PodcastPopup from './PodcastPopup';
import CatBannar from '../components/CatBanner';
import { Link } from 'react-router-dom';
import AdSpace from '../components/AdSpace';

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
    <div className="min-h-screen  text-white font-sans ">
      <Header />
      <section className="px-4 sm:px-8 py-6 sm:py-10 animate-fade-in">
           <CatBannar/>
      </section>
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
      <section className="px-4 sm:px-8 py-6 sm:py-10  rounded-2xl shadow-xl animate-fade-in ">
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
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
      <AdSpace/>
    </div>
  );
}

export default App;
