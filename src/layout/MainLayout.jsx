import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import CookieConsent from "../components/Cookies";
import FloatingVideo from "../components/FloatingVideo.jsx";
import { ToastContainer } from "react-toastify";
import AppDownloadPopup from "../components/AppDownloadPopup ";
import NotificationSubscriptionPopup from "../components/NotificationSubscriptionPopup ";
import SecureBanner from "../components/SecureBanner";
import TopButton from "../components/TopButton";
import Navbar from "../components/Navbar";
import { UIProvider } from "../components/UIProvider "; 
import useReminderWebSocket from "../store/useReminderWebSocket.js";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner"; 
import Recommendations from "../components/Recommendations";
import FeedbackComponent from "../components/FeedbackComponent";
import SidebarContent from "../components/SidebarContent";


const MainLayout = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoUrl = "https://youtu.be/N3VdeCtd8oY?si=4HKjo7tvVYX5Gv51";
  useReminderWebSocket((newReminder) => {
    toast.info(`⏰ Reminder: ${newReminder.message}`);
    setReminders((prev) => [...prev, newReminder]);
  });
useEffect(() => {
  console.log("Loading started...");
  const loadApp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000)); 
    setLoading(false); 
  };
  loadApp();
}, []);
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <UIProvider>
        <Navbar />
      </UIProvider>
      <SecureBanner />
      {loading ? (
        <LoadingSpinner /> 
      ) : (
        <Outlet /> 
      )}
      <CookieConsent />
      <FloatingVideo videoUrl={videoUrl} />
      <ThemeToggle />
      <Footer className="w-full" />
      <AppDownloadPopup />
      <NotificationSubscriptionPopup />
      <ToastContainer />
      <TopButton />
      <SidebarContent/>
      <FeedbackComponent/>
      <Recommendations/>
    </div>
  );
};

export default MainLayout;
