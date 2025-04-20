import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For animations
import GooglePlayLogo from "/new-get-it-on-google-play-png-logo-20.png"; // Replace with actual path
import AppStoreLogo from "/appleStore.png"; // Replace with actual path

const AppDownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      const popupShown = localStorage.getItem("popupShown"); // Check if popup was already shown
      if (!popupShown) {
        setIsVisible(true); // Show popup if not previously shown
        localStorage.setItem("popupShown", "true"); // Mark popup as shown
      }
    };

    showPopup(); // Initial check on component mount
  }, []);

  const handleDismiss = () => {
    setIsVisible(false); // Close the popup when dismissed
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-4 right-4 mx-auto bg-gray-500 shadow-lg rounded-lg p-4 z-50 w-11/12 sm:w-4/5 md:w-3/5 lg:w-2/5"
        >
          <div className="flex flex-col items-center text-center">
            {/* Heading */}
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-200">
              Download Our App
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 mt-2">
              For the best experience, download our app from Google Play or the App Store.
              <span className="font-bold text-red-700"> FREE..</span>
            </p>

            {/* Buttons with Logos */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-transparent hover:bg-gray-200 py-2 px-4 rounded-lg gap-2"
              >
                <img src={GooglePlayLogo} alt="Google Play" className="w-16 sm:w-20 md:w-24 h-auto" />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-transparent hover:bg-gray-200 py-2 px-4 rounded-lg gap-2"
              >
                <img src={AppStoreLogo} alt="App Store" className="w-16 sm:w-20 md:w-24 h-auto" />
              </a>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-2 right-2 text-gray-100 hover:text-gray-400 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default AppDownloadPopup;
