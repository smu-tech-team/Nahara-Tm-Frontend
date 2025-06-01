import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PostSkeleton from "../components/PostSkeleton"; // Import skeleton loader
import { FaTag, FaEye, FaUser } from "react-icons/fa"; // Import icons

const PostListItem = ({ post }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const placeholderLogo = "/Nahara_Red[1].png"; 
  const containerRef = useRef(null);

  const localTime = post.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "Unknown Date";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setLoadingDelay(false);
      }, 1500); 
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!isVisible || loadingDelay) {
    return (
      <div ref={containerRef}>
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
    >
      {/* Image Section */}
      <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
        {!imageLoaded && (
          <img
            src={placeholderLogo}
            alt="Loading..."
            className="absolute inset-0 w-full h-full object-contain animate-pulse opacity-30 blur-sm"
          />
        )}
        {post.img && (
          <img
            src={post.img}
            alt={post.title || "Post Image"}
            className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
      </div>

      {/* Title */}
      <Link
        to={`/${post.slug}`}
        className="text-lg font-semibold hover:text-blue-500 transition mt-3 block"
      >
        {post.title || "Untitled Post"}
      </Link>

      {/* Meta Info - Now with Icons! */}
      <div className="flex flex-wrap items-center gap-3 text-gray-500 text-sm mt-2">
        <FaUser className="text-blue-400" />
        <Link
          to={`/creator/${post?.creator?.id}`}
          className="hover:underline"
        >
          {post?.creator?.blogName || "Unknown Creator"}
        </Link>
        <span>•</span>
        <FaTag className="text-green-400" />
        <Link
          to={`/posts?category=${post.category || ""}`}
          className="hover:underline"
        >
          {post.category || "Uncategorized"}
        </Link>
        <span>•</span>

        <span>{localTime}</span>

        <span>•</span>

        <FaEye className="text-red-400" />
        <span className="font-semibold text-gray-700 dark:text-gray-300">{post.views} Views</span>
      </div>

      {/* Description */}
      {post.desc && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed line-clamp-3">
          {post.desc}
        </p>
      )}

      {/* Read More Button */}
      <Link
        to={`/${post.slug}`}
        className="text-blue-500 hover:text-blue-400 font-medium transition mt-3 block"
      >
        Read More →
      </Link>
    </div>
  );
};

export default PostListItem;
