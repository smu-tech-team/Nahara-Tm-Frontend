import React, { useEffect } from "react";
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
import { UIProvider } from "../components/UIProvider "; // Import UIContext
import useReminderWebSocket from "../store/useReminderWebSocket.js";
import { useState } from "react";
import { toast } from "react-toastify";






const MainLayout = () => {
  const [reminders, setReminders] = useState([]);

  const videoUrl = "https://youtu.be/N3VdeCtd8oY?si=4HKjo7tvVYX5Gv51";

  useReminderWebSocket((newReminder) => {
    toast.info(`⏰ Reminder: ${newReminder.message}`);
    setReminders(prev => [...prev, newReminder]);
  });
   
  
  

  
  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <UIProvider>
       <Navbar />
      </UIProvider>
       
      
      <SecureBanner/>

      <Outlet />

      <CookieConsent />

      <FloatingVideo videoUrl={videoUrl} />

      <ThemeToggle />

      <Footer />

      <AppDownloadPopup />

      <NotificationSubscriptionPopup />

      <ToastContainer />
      <TopButton/>
    </div>
  );
};

export default MainLayout;
