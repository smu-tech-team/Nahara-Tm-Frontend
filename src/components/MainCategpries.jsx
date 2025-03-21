import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/Search";

const MainCategories = () => {
    const [showSportsSubcategories, setShowSportsSubcategories] = useState(false);
    const dropdownRef = useRef(null); // Reference for dropdown container

    // Handle clicking on "Sports News"
    const handleSportsClick = (e) => {
        e.preventDefault(); // Prevent direct navigation
        setShowSportsSubcategories(!showSportsSubcategories); // Toggle dropdown visibility
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowSportsSubcategories(false); // Close dropdown
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    return (
        <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 dark:shadow-black shadow-lg items-center justify-center gap-8">
            {/* Main Links */}
            <div className="text-black flex-1 flex items-center justify-between flex-wrap">
                <Link
                    to="/posts"
                    className="bg-blue-800 hover:bg-blue-900 text-white rounded-full px-4 py-2"
                >
                    All Posts
                </Link>

                {/* Sports News with Subcategories */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={handleSportsClick}
                        className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2 focus:outline-none"
                    >
                        Sports News
                    </button>
                    {showSportsSubcategories && (
                        <div className="absolute bg-white shadow-lg mt-2 rounded-lg p-4">
                            {/* Subcategory Links with Underline on Hover */}
                            <Link
                                to="/posts?cat=football"
                                className="block px-4 py-2 hover:underline"
                            >
                                Football News
                            </Link>
                            <Link
                                to="/posts?cat=basketball"
                                className="block px-4 py-2 hover:underline"
                            >
                                Basketball News
                            </Link>
                            <Link
                                to="/posts?cat=tennis"
                                className="block px-4 py-2 hover:underline"
                            >
                                Tennis News
                            </Link>
                        </div>
                    )}
                </div>

                <Link
                    to="/posts?cat=celebrity-news"
                    className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                >
                    Celebrity News
                </Link>
                <Link
                    to="/posts?cat=politice"
                    className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                >
                    Politice
                </Link>
                <Link
                    to="/posts?cat=betting-tips"
                    className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                >
                    Betting Tips
                </Link>
                <Link
                    to="/posts?cat=hot-gist"
                    className="hover:bg-blue-800 hover:text-white rounded-full px-4 py-2"
                >
                    Hot Gist
                </Link>
            </div>

            <span className="text-xl font-medium text-black">|</span>

            {/* Search */}
            <div>
                <SearchBar />
            </div>
        </div>
    );
};

export default MainCategories;
