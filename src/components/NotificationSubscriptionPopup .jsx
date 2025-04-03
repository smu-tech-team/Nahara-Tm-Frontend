import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NotificationImage from "/SmartLogoMain.png"; // Replace with your notification icon

const NotificationSubscriptionPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showPopup = () => {
      const hasResponded = localStorage.getItem("hasRespondedToNotification");
      if (!hasResponded) {
        setIsVisible(true); // Show popup if the user hasn't already responded
      }
    };

    const timeout = setTimeout(showPopup, 30000); // Delay popup appearance
    return () => clearTimeout(timeout); // Cleanup timeout on component unmount
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    localStorage.setItem("hasRespondedToNotification", "accepted");

    // Subscribe to OneSignal
    if (window.OneSignal) {
      window.OneSignal.push(() => {
        window.OneSignal.isPushNotificationsEnabled((isEnabled) => {
          if (isEnabled) {
            alert("You are already subscribed to notifications!");
          } else {
            window.OneSignal.push(() => {
              window.OneSignal.registerForPushNotifications();
              alert("Thank you for subscribing!");
            });
          }
        });
      });
    } else {
      alert("Notification service is unavailable. Please try again later.");
    }
  };

  const handleDecline = () => {
    setIsVisible(false);
    localStorage.setItem("hasRespondedToNotification", "declined");
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-0 right-0 mx-auto bg-white shadow-lg rounded-lg p-6 z-50 max-w-md"
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={NotificationImage}
              alt="Notifications"
              className="w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">
              Stay Updated!
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Allow notifications to stay up-to-date with the latest news and updates.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handleAccept}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                No, Thanks
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default NotificationSubscriptionPopup;
