import React, { useEffect, useState } from "react";
import { X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Recommendations = () => {
  const [creators, setCreators] = useState([]);
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(false); 
  const [offline, setOffline] = useState(!navigator.onLine); 
  useEffect(() => {
    fetchData();
        window.addEventListener("offline", () => setOffline(true));
    window.addEventListener("online", () => {
      setOffline(false);
      fetchData(); 
    });
    return () => {
      window.removeEventListener("offline", () => setOffline(true));
      window.removeEventListener("online", () => setOffline(false));
    };
  }, []);
  const fetchData = () => {
    fetch("https://nahara-production.up.railway.app/api/creator/popular")
      .then((res) => res.json())
      .then((data) => {
        console.log("Creators API Response:", data);
        setCreators(Array.isArray(data) ? data : []);
        setError(false);
      })
      .catch((err) => {
        console.error("Error fetching creators:", err);
        setCreators([]);
        setError(true);
      });
  };
  useEffect(() => {
    const savedState = localStorage.getItem("recommendationsVisible");
    if (savedState === "false") {
      setVisible(false);
    }
  }, []);
  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        setVisible(true);
        localStorage.setItem("recommendationsVisible", "true");
      }, 50000);
      return () => clearTimeout(timer);
    }
  }, [visible]);
  const handleClose = () => {
    setVisible(false);
    localStorage.setItem("recommendationsVisible", "false");
  };
  return (
    <div className="fixed right-2 sm:right-4 top-1/2 transform -translate-y-1/2 w-60 sm:w-72 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="recommendations"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-white shadow-lg p-3 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2 relative">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 text-center w-full">
                🔥 Recommended 
              </h3>
              <button
                onClick={handleClose}
                className="absolute top-0 right-0 text-gray-800 hover:text-gray-700"
                title="Close"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="space-y-2">
              {Array.isArray(creators) && creators.length > 0 ? (
                creators.map((creator) => (
                  <div key={creator.id || creator._id} className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <img src={creator.blogProfile} alt={creator.blogName} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-300 mr-2" />
                    <div>
                      <a href={`/creator/${creator.id || creator._id}`} className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline">
                        {creator.blogName}
                      </a>
                      <p className="text-[10px] sm:text-xs text-gray-800">
                        {creator.followerCount >= 1000 ? `${(creator.followerCount / 1000).toFixed(1)}k+` : creator.followerCount || "0"} followers
                      </p>
                    </div>
                  </div>
                ))
              ) : error || offline ? (
                <div className="flex flex-col items-center justify-center w-full text-center mt-6">
                  <img src={offline ? "/offline.webp" : "/no-network.png"} alt="Network issue" className="w-48 h-48 object-cover opacity-80" />
                  <p className="text-gray-500 mt-3">
                    {offline ? "You're offline! Check your network." : "Couldn't load recommendations. Try again later."}
                  </p>
                  <button onClick={fetchData} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" /> Retry
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full text-center mt-6">
                  <img src="/no-data.png" alt="No creators found" className="w-48 h-48 object-cover opacity-80" />
                  <p className="text-gray-500 mt-3">No popular creators found. Try again later!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
        {visible && (
          <motion.button
            layout
            onClick={() => (window.location.href = "/recommendations")}
            className="mt-3 bg-red-500 text-white w-full py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
          >
            View More →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recommendations;
