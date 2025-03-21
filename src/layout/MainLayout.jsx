import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import CookieConsent from "../components/Cookies";
import FloatingVideo from "../components/FloatingVideo.jsx";
import { ToastContainer } from "react-toastify";
import AppDownloadPopup from "../components/AppDownloadPopup ";
import NotificationSubscriptionPopup from "../components/NotificationSubscriptionPopup ";
import { initializeOneSignal } from "../store/OneSignalSetup.js";

const MainLayout = () => {
  const videoUrl = "https://youtu.be/N3VdeCtd8oY?si=4HKjo7tvVYX5Gv51";

  // Use useEffect to initialize OneSignal at the top level
  useEffect(() => {
    initializeOneSignal(); // Initialize OneSignal on app load
  }, []); // Empty dependency array ensures it only runs once

  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <Outlet />

      {/* Cookie Consent Popup */}
      <CookieConsent />

      {/* Floating Video */}
      <FloatingVideo videoUrl={videoUrl} />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Footer */}
      <Footer />

      {/* App Download Popup */}
      <AppDownloadPopup />

      {/* Notification Subscription Popup */}
      <NotificationSubscriptionPopup />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
