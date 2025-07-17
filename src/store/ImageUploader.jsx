// ImageUploader.js
import React, { useRef } from "react";

const ImageUploader = ({ onImageSelect }) => {
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white px-3 py-2 rounded-lg text-sm"
      >
        📎 Upload Image
      </button>
    </div>
  );
};

export default ImageUploader;
