import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SkeletonCard = () => (
  <div className="w-full md:w-64 h-48 bg-gray-200 animate-pulse rounded-xl" />
);

const RecommendedContent = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log("Fetching recommendations with:", {
        userId,
        category,
        tags: selectedTags,
      });

      const { data } = await axios.get("http://localhost:8087/api/recommendations/recommended_posts", {
        params: {
          userId,
          category: category || "",
          tags: selectedTags.join(","), // comma-separated
        },
      });

      setRecommendations(data);
    } catch (err) {
      console.error("Error fetching recommendations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId, category, selectedTags]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">Recommended for You</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-0 w-full sm:w-auto">
          {/* Category dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="sports">Sports</option>
            <option value="tech">Technology</option>
            <option value="faith">Faith</option>
            <option value="education">Education</option>
          </select>

          {/* Tag input */}
          <input
            type="text"
            placeholder="Add a tag and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
          />
        </div>
      </div>

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-red-500 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : recommendations.length > 0 ? recommendations.map((rec) => (
              <div
                key={rec.contentId}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-3 cursor-pointer"
                onClick={() => navigate(`/content/${rec.type}/${rec.contentId}`)}
              >
                <img
                  src={rec.imageUrl}
                  alt={rec.title}
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="mt-2">
                  <span className="text-xs text-gray-500 uppercase">{rec.type}</span>
                  <h2 className="text-lg font-medium">{rec.title}</h2>
                </div>
              </div>
            )) : (
              <div className="text-gray-500 text-center col-span-full mt-4">
                No recommendations available.
              </div>
            )}
      </div>
    </div>
  );
};

export default RecommendedContent;
