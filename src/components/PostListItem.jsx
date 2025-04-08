import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PostSkeleton from "../components/PostSkeleton"; // Import skeleton loader

const PostListItem = ({ post }) => {
  const [isVisible, setIsVisible] = useState(false); // Tracks visibility in viewport
  const [imageLoaded, setImageLoaded] = useState(false); // Tracks image load state
  const [loadingDelay, setLoadingDelay] = useState(true); // Tracks simulated delay
  const placeholderLogo = "/SmartLogoMain.png"; // Replace with website logo
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
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Simulated delay before content shows
      const timeout = setTimeout(() => {
        setLoadingDelay(false);
      }, 1500); // Adjust delay time (e.g., 1500ms for 1.5s)
      return () => clearTimeout(timeout); // Cleanup timeout
    }
  }, [isVisible]);

  // ✨ Render skeleton during delay
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
      className="flex flex-col gap-4 bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
    >
      {/* Image Section */}
      <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-700 flex items-center justify-center">
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
        className="text-xl font-bold hover:text-blue-400 transition"
      >
        {post.title || "Untitled Post"}
      </Link>

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-2 text-gray-400 text-sm">
        <span>Written by</span>
        <Link
          to={`/creator/${post?.creator?.id}`}
          className="text-blue-400 hover:underline"
        >
          {post?.creator?.blogName || "Unknown Creator"}
        </Link>
        <span>on</span>
        <Link
          to={`/posts?category=${post.category || ""}`}
          className="text-blue-400 hover:underline"
        >
          {post.category || "Uncategorized"}
        </Link>
        <span>•</span>
        <span>{localTime}</span>
        <span className="font-bold">
          views <span className="text-green-400">{post.views}</span>
        </span>
      </div>

      {/* Description */}
      {post.desc && (
        <p className="text-gray-300 dark:text-gray-400 leading-relaxed line-clamp-2">
          {post.desc}
        </p>
      )}

      {/* Read More */}
      <Link
        to={`/${post.slug}`}
        className="text-blue-400 hover:text-blue-300 font-medium transition"
      >
        Read More →
      </Link>
    </div>
  );
};

export default PostListItem;
