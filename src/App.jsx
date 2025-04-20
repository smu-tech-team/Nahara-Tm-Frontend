import FeaturedPost from "../components/FeaturePost";
import { UIProvider } from "../components/UIProvider";
import Navbar from "../components/Navbar";
import { useState } from "react";
import "./i18n";
import MiniPlayer from "../podcast/MiniPlayer";
import FullPlayerModal from "../podcast/FullPlayerModal";

const App = () => {
  const [refreshNavbar, setRefreshNavbar] = useState(false);

  const handleNavbarRefresh = () => {
    setRefreshNavbar((prev) => !prev);
  };

  return (
    <div className="px-4 md:px-8 lg:px-16 lx:px-32 2xl:px-64">
      <UIProvider>
                
        {/* Navbar */}
        <Navbar refreshTrigger={refreshNavbar} />
        <button
          onClick={handleNavbarRefresh}
          className="mt-4 btn btn-primary"
        >
          Refresh Navbar
        </button>

        <MiniPlayer />
        <FullPlayerModal />
        
        {/* Featured Post */}
        <FeaturedPost />
      </UIProvider>
    </div>
  );
};

export default App;
