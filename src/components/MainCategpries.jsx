import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaFootballBall,  FaBookOpen, FaMusic, FaStar, FaLandmark } from "react-icons/fa";
import SearchBar from "../components/Search";
const PopupModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-80 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-black dark:text-white text-xl hover:text-red-500"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold text-black dark:text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};
const MainCategories = () => {
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [isEbooksOpen, setIsEbooksOpen] = useState(false);
  const [isSongsOpen, setIsSongsOpen] = useState(false);
  const sportsDropdownRef = useRef(null);
  const ebooksDropdownRef = useRef(null);
  const songsDropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sportsDropdownRef.current && !sportsDropdownRef.current.contains(event.target)) {
        setIsSportsOpen(false);
      }
      if (ebooksDropdownRef.current && !ebooksDropdownRef.current.contains(event.target)) {
        setIsEbooksOpen(false);
      }
      if (songsDropdownRef.current && !songsDropdownRef.current.contains(event.target)) {
        setIsSongsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);
  return (
    <div className="hidden md:flex bg-white dark:bg-gray-800 rounded-3xl xl:rounded-full p-4 dark:shadow-black shadow-lg items-center justify-center gap-8">
      <div className="text-black dark:text-white flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/posts"
          className="bg-blue-800 hover:bg-blue-900 text-white rounded-full px-4 py-2 transition-transform transform hover:scale-105 flex items-center gap-2"
        >
          <FaStar /> All Posts
        </Link>
        <div className="relative" ref={sportsDropdownRef}>
          <button
            onClick={() => setIsSportsOpen(true)}
            className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2 focus:outline-none transition flex items-center gap-2"
          >
            <FaFootballBall /> Sports News
          </button>
          <PopupModal isOpen={isSportsOpen} onClose={() => setIsSportsOpen(false)} title="Sports News">
            <Link to="/posts?cat=football" className="block px-4 py-2 hover:underline">Football News</Link>
            <Link to="/posts?cat=basketball" className="block px-4 py-2 hover:underline">Basketball News</Link>
            <Link to="/posts?cat=tennis" className="block px-4 py-2 hover:underline">Tennis News</Link>
          </PopupModal>
        </div>
        <div className="relative" ref={ebooksDropdownRef}>
          <button
            onClick={() => setIsEbooksOpen(true)}
            className="hover:bg-green-800 hover:text-white rounded-full px-4 py-2 focus:outline-none transition flex items-center gap-2"
          >
            <FaBookOpen /> Ebooks
          </button>
          <PopupModal isOpen={isEbooksOpen} onClose={() => setIsEbooksOpen(false)} title="Ebooks">
            <Link to="/ebooks" className="block px-4 py-2 hover:underline">Latest Ebooks</Link>
            <Link to="/ebooks?sort=popular" className="block px-4 py-2 hover:underline">Popular Reads</Link>
            <Link to="/ebooks/categories" className="block px-4 py-2 hover:underline">Categories</Link>
          </PopupModal>
        </div>
        <div className="relative" ref={songsDropdownRef}>
          <button
            onClick={() => setIsSongsOpen(true)}
            className="hover:bg-red-800 hover:text-white rounded-full px-4 py-2 focus:outline-none transition flex items-center gap-2"
          >
            <FaMusic /> Songs
          </button>
          <PopupModal isOpen={isSongsOpen} onClose={() => setIsSongsOpen(false)} title="Songs">
            <Link to="/stream-songs" className="block px-4 py-2 hover:underline">Latest Songs</Link>
            <Link to="/stream-songs?filter=trending" className="block px-4 py-2 hover:underline">Trending Tracks</Link>
            <Link to="/stream-songs/genres" className="block px-4 py-2 hover:underline">Genres</Link>
          </PopupModal>
        </div>
        <Link to="/posts?cat=celebrity-news" className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2 flex items-center gap-2">
          <FaStar /> Celebrity News
        </Link>
        <Link to="/posts?cat=politics" className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2 flex items-center gap-2">
          <FaLandmark /> Politics
        </Link>
       
      </div>
      <span className="text-xl font-medium text-black dark:text-white">|</span>
      <div>
        <SearchBar />
      </div>
    </div>
  );
};

export default MainCategories;
