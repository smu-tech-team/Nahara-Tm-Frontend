import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash"; // Ensure lodash is installed
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState(""); // User input
  const [results, setResults] = useState([]); // API search results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Define the debounced fetchPosts function
  const fetchPosts = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setResults([]);
        setError(null); // Clear errors on empty query
        return;
      }

      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        const response = await axios.get(`http://localhost:8087/api/post/search?q=${query}`);
        setResults(response.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch results. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300), // Debounce delay of 300ms
    [] // Dependencies
  );

  // Call the debounced fetchPosts whenever the query changes
  useEffect(() => {
    fetchPosts(query);
    return () => fetchPosts.cancel(); // Cleanup debounce on unmount
  }, [query, fetchPosts]);

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 dark:bg-transparent dark:shadow-black text-white p-3 rounded-full shadow-md w-full max-w-lg">
        <SearchIcon size={22} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search for posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update query state
          className="bg-transparent outline-none dark:text-black shadow-white text-white w-full px-2"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-red-100 border border-red-400 rounded-lg shadow-lg z-50">
          <p className="p-4 text-red-500">{error}</p>
        </div>
      )}

      {/* Results Dropdown */}
      {!isLoading && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-white
         dark:bg-white dark:text-black border border-gray-300
          rounded-lg shadow-lg z-50 shadow-black">
          <ul>
            {results.slice(0, 4).map((post) => ( // Limit to the first 4 results
              <li key={post.id}>
                <Link
                  to={`/${post.slug}`}
                  className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
          {results.length > 4 && (
            <p className="text-sm text-gray-500 text-center mt-2">
              Showing 4 of {results.length} results. Refine your search to see more.
            </p>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-white border border-gray-300 rounded-lg shadow-lg z-50">
          <p className="p-4 text-gray-500">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
