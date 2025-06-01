import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import Ads from "/SabiPredictLogo.png";
import Ads2 from "/smuads.jpg";

const RecentLiveNews = () => {
  const [liveNewsList, setLiveNewsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newsPerPage] = useState(10); 
  const [currentText, setCurrentText] = useState("Recent Live Updates");
  const [currentColor, setCurrentColor] = useState("#ff0000");
 const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const texts = [
    { text: "Recent Live Updates", color: "#ff0000" },
    { text: "Breaking News!", color: "#ff4500" },
    { text: "Live Football Update", color: "#0000ff" },
    { text: "Live Storytelling", color: "#808080" },
    { text: "Hot Gist on Live", color: "#ff0000" },
  ];
  useEffect(() => {
    const fetchLiveNews = async () => {
      try {
        const response = await fetch(
          "http://localhost:8087/api/live-news/get-live-news"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch live news");
        }
        const data = await response.json();
        setLiveNewsList(data);
      } catch (error) {
        console.error("Error fetching live news:", error.message);
        setLiveNewsList([]);
      }
    };
    fetchLiveNews();
    const interval = setInterval(fetchLiveNews, 60000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    let index = 0;

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length;
      setCurrentText(texts[index].text);
      setCurrentColor(texts[index].color);
    }, 3000);

    return () => clearInterval(textInterval);
  }, []);
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = liveNewsList.slice(indexOfFirstNews, indexOfLastNews);
  const nextPage = () => {
    if (indexOfLastNews < liveNewsList.length) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
   useEffect(() => {
      const updateStatus = () => setIsOnline(navigator.onLine);
      updateStatus(); 
      window.addEventListener("online", updateStatus);
      window.addEventListener("offline", updateStatus);
  
      return () => {
        window.removeEventListener("online", updateStatus);
        window.removeEventListener("offline", updateStatus);
      };
    }, []);
  const reloadPosts = async () => {
  setLoading(true);
  setError(null);
  try {
    setCurrentPage(1);
  } catch (err) {
    setError("Failed to reload posts. Please try again.");
    console.error("Reload error:", err);
  } finally {
    setLoading(false);
  }
};
  const shareToX = (link) => {
    window.open(
      `https://twitter.com/share?url=${encodeURIComponent(
        link
      )}&text=Check out this amazing content!`,
      "_blank"
    );
  };
  const shareToFacebook = (link) => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}&quote=Don't miss this exciting update!`,
      "_blank"
    );
  };
  const copyToClipboard = (link) => {
    const myWebsiteUrl = "https://www.yourwebsite.com"; 
    const redirectLink = `${myWebsiteUrl}/redirect?target=${encodeURIComponent(
      link
    )}`;
    navigator.clipboard
      .writeText(redirectLink)
      .then(() => {
        alert("Website redirect link copied to clipboard!");
      })
      .catch(() => {
        alert("Failed to copy to clipboard. Please try again!");
      });
  };
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1
        className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 py-3 px-6 rounded-lg shadow-md bg-gray-200 dark:bg-gray-800"
        style={{
          color: currentColor,
        }}
      >
        {currentText}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="lg:col-span-3">
          {currentNews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {currentNews.map((news, index) => (
                <div
                  key={index}
                  className="bg-gray-800 dark:bg-gray-100 rounded-lg shadow-md p-4"
                >
                  <ReactPlayer
                    url={news.link}
                    controls={true}
                    width="100%"
                    className="rounded-lg overflow-hidden"
                  />
                  <div className="flex items-center mt-4">
                    <img
                      src={
                        news.creatorImage || "https://via.placeholder.com/150"
                      }
                      alt={`${
                        news.creatorName || "Unknown Creator"
                      }'s avatar`}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-300"
                    />
                    <p className="ml-4 text-sm sm:text-base font-bold text-gray-300 dark:text-gray-700">
                      {news.creatorName || "Unknown Creator"}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-500 mt-2">
                    Added on {new Date(news.timestamp).toLocaleString()}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => shareToX(news.link)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs sm:text-sm"
                    >
                      Share to X
                    </button>
                    <button
                      onClick={() => shareToFacebook(news.link)}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded text-xs sm:text-sm"
                    >
                      Share to Facebook
                    </button>
                    <button
                      onClick={() => copyToClipboard(news.link)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs sm:text-sm"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
        <img
            src={isOnline ? "/notfound.webp" : "/offline.webp"}
            alt={isOnline ? "No posts(404)" : "No network"}
            className="w-64 h-64 object-contain mb-6"
        />
        {loading ? (
            <p className="text-center text-blue-500 font-semibold mb-4 animate-pulse">Loading posts...</p>
        ) : (
            <p className="text-center text-gray-500 text-lg mb-4">
            {error || (isOnline ? "No live news found. Check back later!" : "You're offline. Please check your internet connection.")}
            </p>
        )}
        <button
            onClick={reloadPosts}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition disabled:opacity-50"
        >
            {loading ? "Refreshing..." : "Refresh"}
        </button>
        </div>

         )}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={previousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-800 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>
            <span className="text-sm sm:text-base font-medium text-gray-500">
              Page {currentPage} of {Math.ceil(liveNewsList.length / newsPerPage)}
            </span>
            <button
              onClick={nextPage}
              disabled={indexOfLastNews >= liveNewsList.length}
              className={`px-4 py-2 rounded-md ${
                indexOfLastNews >= liveNewsList.length
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-800 text-white hover:bg-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      <div className="bg-gray-800 dark:bg-gray-200 rounded-lg shadow-md p-4 max-w-md mx-auto overflow-hidden">
  <h2 className="text-base sm:text-lg font-bold text-gray-200 dark:text-gray-700 mb-4 text-center">
    Sponsored Ads
  </h2>
  <div className="space-y-4 box-border p-2">
    {[Ads2, Ads, Ads2].map((ad, index) => (
      <div
        key={index}
        className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md p-3 flex items-center gap-3"
      >
        <img
          src={ad}
          alt={`Ad ${index + 1}`}
          className="w-14 h-14 rounded-lg object-cover"
        />
                <div className="flex-1">
          <p className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-200">
            Ad Title {index + 1}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Brief description of the ad.
          </p>
        </div>
      </div>
    ))}
    </div>
        </div>
      </div>
    </div>
  );
};

export default RecentLiveNews;
``