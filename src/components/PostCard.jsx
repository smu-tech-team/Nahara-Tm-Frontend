import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const PostCard = ({ post, isLoading }) => {
  const [isFlashing, setIsFlashing] = useState(isLoading);

  // Stop the red flashing once the loading state is complete
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => setIsFlashing(false), 500); // Slight delay for transition
    }
  }, [isLoading]);

  return (
    <div
      className={`border rounded-lg shadow-sm p-4 pt-3 transition transform hover:scale-105 hover:shadow-xl text-black 
        ${isFlashing ? "bg-red-500 text-white animate-pulse" : "bg-gray-300"} dark:bg-gray-300`}
    >
      <h3 className="text-lg font-semibold">
        <Link
          to={`/${post.slug}`}
          className="hover:underline hover:text-blue-500 dark:hover:text-blue-400"
        >
          {post.title}
          {post.isFeatured && (
            <span className="text-xs text-white bg-blue-500 rounded-full px-2 py-1 ml-2">
              Featured
            </span>
          )}
        </Link>
      </h3>
      <p className="text-gray-600 mt-2 line-clamp-3 dark:text-gray-400">
        {post.excerpt}
      </p>
    </div>
  );
};

export default PostCard;
