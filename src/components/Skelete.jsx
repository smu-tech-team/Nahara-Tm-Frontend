import React from "react";
import logo from "/Nahara_Red[1].png";

const Skeleton = ({ className }) => {
  return (
    <div
      className={`relative bg-gray-300 rounded flex items-center justify-center overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 animate-shimmer" />
      {logo && (
        <img
          src={logo}
          alt="Website Logo"
          className="relative z-10 h-12 w-12 object-contain scale-110 animate-pulse"
        />
      )}
    </div>
  );
};

export default Skeleton;
