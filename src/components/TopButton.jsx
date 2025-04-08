import React, { useEffect, useState } from "react";
import { ArrowUpCircle } from "lucide-react"; // For a sleek modern arrow icon

const TopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed top-1/2 left-6 transform -translate-y-1/2 bg-red-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 ease-in-out  hover:scale-110 z-50"
        >
          <ArrowUpCircle className="w-8 h-8" />
        </button>
      )}
    </div>
  );
};

export default TopButton;
