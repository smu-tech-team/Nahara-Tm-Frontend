import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For animations
import GooglePlayLogo from "../assert/new-get-it-on-google-play-png-logo-20.png"; // Replace with actual path
import AppStoreLogo from "../assert/appleStore.png"; // Replace with actual path

const AppDownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      const lastSeen = localStorage.getItem("lastPopupSeen");
      const now = Date.now();

      // Show popup if not dismissed within the last 50 seconds
      if (!lastSeen || now - parseInt(lastSeen, 10) > 50000) {
        setIsVisible(true);
      }
    };

    showPopup(); // Initial check
    const interval = setInterval(showPopup, 50000); // Check every 50 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("lastPopupSeen", Date.now()); // Save the dismissal time
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-2 right-2 mx-auto bg-gray-500 shadow-lg rounded-lg p-6 z-50 max-w-sm sm:max-w-md"
        >
          <div className="flex flex-col items-center text-center">
            {/* Heading */}
            <h3 className="text-lg sm:text-xl font-bold text-gray-200">
              Download Our App
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              For the best experience, download our app from Google Play or the App Store.
               <span className=" font-bold text-red-700">  FREE..</span>
            </p>

            {/* Buttons with Logos */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-transparent hover:bg-gray-200 py-2 px-4 rounded-lg gap-2 "
              >
                <img src={GooglePlayLogo} alt="Google Play" className="w-20 sm:w-24 h-auto" />
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center bg-transparent hover:bg-gray-200 py-2 px-4 rounded-lg gap-2 "
              >
                <img src={AppStoreLogo} alt="App Store" className="w-20 sm:w-24 h-auto" />
              </a>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-100 hover:text-gray-400 text-lg font-bold"
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
