import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash"; 
import { Search as SearchIcon, XCircle as CloseIcon } from "lucide-react";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState(""); 
  const [results, setResults] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://nahara-production.up.railway.app/api/post/search?q=${query}`);
        setResults(response.data);
      } catch {
        setError("Failed to fetch results. Try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchPosts(query);
    return () => fetchPosts.cancel();
  }, [query, fetchPosts]);

  return (
    <div className="relative flex flex-col items-center w-full px-4">
      <div className="flex items-center bg-gray-900 text-white p-3 rounded-full shadow-md w-full max-w-lg">
        <SearchIcon size={22} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none text-white w-full px-2"
        />
        {query && (
          <button onClick={() => setQuery("")} className="text-gray-400">
            <CloseIcon size={18} />
          </button>
        )}
      </div>

      {error && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-red-600 text-white rounded-lg shadow-lg p-3">
          {error}
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg">
          <ul>
            {results.slice(0, 5).map((post) => (
              <li key={post.id}>
                <Link to={`/posts?search=${post.slug}`} className="block px-4 py-2 hover:bg-gray-700">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full mt-2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-3 text-center text-gray-400">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchBar;
