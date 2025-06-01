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
          className="fixed bottom-10  left-6 transform -translate-y-1/2 bg-red-500 text-white p-4
           rounded-full shadow-2xl transition-all duration-300 ease-in-out  hover:scale-110 z-50 sm:buttom-5"
        >
          <ArrowUpCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default TopButton;
