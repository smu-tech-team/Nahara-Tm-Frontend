import React, { useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const EmojiPicker = ({ visible, onSelect, onClose }) => {
  const pickerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-20 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md"
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji) => onSelect(emoji.native)}
        theme="light"
      />
    </div>
  );
};

export default EmojiPicker;