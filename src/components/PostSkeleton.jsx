import React from "react";

const PostSkeleton = () => {
  const placeholderLogo = "/Nahara_Red[1].png"; // Replace with your logo path

  return (
    <div className="flex flex-col gap-4 bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-lg shadow-md animate-pulse">
      {/* Image Skeleton with Logo */}
      <div className="relative w-full h-40 bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
        <img
          src={placeholderLogo}
          alt="Loading"
          className="w-16 h-16 object-contain opacity-70" // Adjust size and style as needed
        />
      </div>

      {/* Title Skeleton */}
      <div className="relative w-3/4 h-5 bg-gray-700 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
      </div>

      {/* Meta Info Skeleton */}
      <div className="flex flex-wrap gap-2">
        <div className="relative w-20 h-4 bg-gray-700 rounded overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
        </div>
        <div className="relative w-24 h-4 bg-gray-700 rounded overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
        </div>
        <div className="relative w-16 h-4 bg-gray-700 rounded overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
        </div>
      </div>

      {/* Description Skeleton */}
      <div className="relative w-full h-4 bg-gray-700 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
      </div>
      <div className="relative w-5/6 h-4 bg-gray-700 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
      </div>

      {/* Read More Button Skeleton */}
      <div className="relative w-24 h-4 bg-gray-700 rounded overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer"></div>
      </div>
    </div>
  );
};

export default PostSkeleton;
