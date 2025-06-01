import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategpries";
import FeaturedPost from "../components/FeaturePost";
import PostList from "../components/PostList";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; 
import LiveNewsIcon from "../route/LiveNewsIcon";
import PodcastButton from '../route/PodcastButton';
import WeatherComponent from "../components/WeatherComponent";
import AdsFloating from "../components/AdsFloating";
import AdSpace from "../components/AdSpace";
import CategoryBanner from "../components/CatBanner";
const Homepage = () => {
  const [username, setUsername] = useState(""); 
  const [localDateTime, setLocalDateTime] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUsername(decodedToken.userName || "Guest"); 
        } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }, []);
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = new Intl.DateTimeFormat("en-US", {
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }).format(now);
      setLocalDateTime(formattedDate);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="mt-4 flex flex-col gap-4">
      <CategoryBanner/>
      <div>
       <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-6 sm:py-10 space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-800 text-white rounded-md">
      <PodcastButton />
      <WeatherComponent />
      <LiveNewsIcon />
    </div>

      <p className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-gray-400  break-words">
  {localDateTime}
</p>
       <h2 className="border rounded-lg">  
  <span className="text-gray-500">  Hey!👋 </span> {username}
</h2>
</div>
      <div className="flex items-center justify-between">
       
   <AdsFloating leftBannerUrl="/smuads.jpg" leftLink="https://example.com/left" />


      </div>
      <MainCategories />
      <FeaturedPost />
      <div>
   
    
        <h1 className="my-8 text-2xl text-gray-600 dark:text-gray-700 font-bold">Recent Posts</h1>
        <PostList />
      </div>
        <AdSpace />
      
    </div>
  );
};
export default Homepage;
