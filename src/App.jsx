import FeaturedPost from "../components/FeaturePost";
import { UIProvider } from "../components/UIProvider";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import "./i18n";
import MiniPlayer from "../podcast/MiniPlayer";
import FullPlayerModal from "../podcast/FullPlayerModal";
import { Toaster } from 'react-hot-toast';
import useAuth from "./store/useAuth";
import { Navigate } from "react-router-dom";



const App = () => {
    const { token } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

       useEffect(() => {
    const token = localStorage.getItem("jwtToken"); 
    setIsLoggedIn(!!token); 
  }, []);

        if (!token) {
      return <Navigate to="/login" replace />;
    }

  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <UIProvider>
        <MiniPlayer />
        <FullPlayerModal />
        <FeaturedPost />
      </UIProvider>
      <Toaster position="top-center" reverseOrder={false} />

    </div>
  );
};

export default App;
