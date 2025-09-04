import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Advanced icons

const RecommendationsPage = () => {
  const [creators, setCreators] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const size = 12;
        const page = 0;

        const res = await fetch(`https://nahara-production.up.railway.app/api/creator/get-recommendation?page=${page}&size=${size}`);
        const data = await res.json();

        console.log("API Response:", data); // Debugging log

        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", data);
          setCreators([]); // Prevents crashing
          return;
        }

        // Ensure valid creators by filtering those with a blogName
        const validCreators = data.filter((c) => c.blogName);
        setCreators(validCreators);
      } catch (error) {
        console.error("Error fetching creators:", error);
        setCreators([]); // Avoid crashing
      }
    };

    fetchCreators();
  }, []);

  useEffect(() => {
    console.log("Creators state updated:", creators); // Debugging log
  }, [creators]);

  const filteredCreators = creators.filter(
    (c, index) =>
      (categoryFilter === "all" || c.category === categoryFilter) &&
      c.blogName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">🌟 Discover More Creators 🚀</h2>

      {/* Filter Section */}
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search creators..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg shadow-md focus:border-blue-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white shadow-md"
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="gaming">Gaming</option>
          <option value="art">Art</option>
        </select>
      </div>

      {/* Creators Grid or Fallback */}
      <div className="flex flex-wrap gap-6 justify-between">
        {filteredCreators.length === 0 ? (
          <p className="text-center text-gray-500 w-full">
            ❌ No creators found.Check your internet connection or Try a different search!
            <img src="/offline.webp"  alt="Network issue" className="w-96 h-96 object-cover opacity-80 flex justify-center" />

          </p>
        ) : (
          filteredCreators.map((creator, index) => (
            <div
              key={creator.id || creator._id}
              className={`bg-white p-3 rounded-lg shadow-md w-[47%] transition transform hover:scale-105 
              ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`} // Alternating left & right
            >
              <div className="relative flex items-center gap-3">
                <img
                  src={creator.blogProfile}
                  alt={creator.blogName}
                  className="w-16 h-16 rounded-full border border-gray-300 shadow-md"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">{creator.blogName}</h3>
                  <p className="text-gray-500 text-sm">
                    {creator.followerCount >= 1000
                      ? `${(creator.followerCount / 1000).toFixed(1)}k`
                      : creator.followerCount} followers
                  </p>
                  {/* Verification Badge */}
                  <span className="text-xs flex items-center gap-1 text-gray-500">
                    {creator.verified ? (
                      <>
                        <FaCheckCircle className="text-green-500" /> Verified
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-red-500" /> Not Verified
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Follow Button */}
              <button
                onClick={() => window.location.href = `/creator/${creator.id || creator._id}`}
                className="mt-3 bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Follow Creator ✨
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;
