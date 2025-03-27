import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategpries";
import FeaturedPost from "../components/FeaturePost";
import PostList from "../components/PostList";
import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

const Homepage = () => {
  const [isCreator, setIsCreator] = useState(false);
  const [username, setUsername] = useState(""); // State to store the username
  const [localDateTime, setLocalDateTime] = useState("");


  const videoLink = "https://youtu.be/lTA9ChokOJI?si=3HspH9bVPaNGj1S-"; // Example link


  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
        setUsername(decodedToken.userName || "Guest"); // Use the correct field name from the token
  
        // Check if roles array contains 'CREATOR' (case-sensitive)
        setIsCreator(decodedToken.roles.includes("CREATOR"));
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



  // Function to determine the correct video embed type
  const renderVideoEmbed = () => {
    if (videoLink.includes("youtube.com") || videoLink.includes("youtu.be")) {
      const videoId = videoLink.split("v=")[1]?.split("&")[0] || videoLink.split("/").pop();
      return (
        <div className="w-72 aspect-video  rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
            title="YouTube Video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </div>
      );
    } else if (videoLink.match(/\.(mp4|webm|ogg)$/)) {
      return (
        <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
          <video className="w-full h-full" autoPlay muted loop playsInline>
            <source src={videoLink} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <div className="w-full aspect-video rounded-lg shadow-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={videoLink}
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Embedded Video"
          ></iframe>
        </div>
      );
    }
  };
    
  

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      <div className="flex gap-2">
        <Link to="/">Home</Link>
        <span className="font-bold">.</span>
        <span className="text-blue-700 dark:text-blue-500">News and Bets</span>
      </div>
      <div>
      <p className="mt-2 text-sm sm:text-base md:text-lg font-semibold text-gray-400  break-words">
  {localDateTime}
</p>

       {/* Welcome Message */}
       <h2 className="border rounded-lg">  
  <span className="text-gray-500">  Hey!👋 </span> {username}
</h2>
</div>

      {/* INTRODUCTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-2xl pb-3  md:text-5xl dark:text-black lg:text-6xl font-bold ">
            Your partner on legit news
          </h1>
          <p className="font-bold text-gray-300 dark:text-gray-700">
            Smart Media Update TV. <br />
            Is part of SMU Sport News<br />
            Your number one place for legit news.
          </p>
        </div>
        

{/* Conditional Rendering: Write Button for Creators, Ad Video for Others */}
{isCreator ? (
  <>
    {/* Desktop Version */}
    <Link to="write" className="hidden md:block relative">
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        className="text-lg tracking-widest animate-spin animatedButton"
      >
        <path
          id="circlePath"
          fill="none"
          d="M 100, 100 m-75 0 a 75, 75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
        />
        <text className="text-white dark:text-black">
          <textPath href="#circlePath" startOffset="0%" fill="currentColor">
            Start writing now.
          </textPath>
          <textPath href="#circlePath" startOffset="50%" fill="currentColor">
            Share your idea.
          </textPath>
        </text>
      </svg>
      <button className="absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="50"
          height="50"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <line x1="6" y1="18" x2="18" y2="6" />
          <polyline points="9 6 18 6 18 15" />
        </svg>
      </button>
    </Link>

    {/* Mobile Version */}
<div className="md:hidden fixed bottom-5 left-5 flex flex-col items-center">
  <p className="text-sm text-gray-400 mb-2 font-bold animate-bounce">Create a Post</p> {/* Informative Text */}
  <Link to="write">
    <button className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-md">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        fill="none"
        stroke="white"
        strokeWidth="2"
      >
        <line x1="6" y1="18" x2="18" y2="6" />
        <polyline points="9 6 18 6 18 15" />
      </svg>
    </button>
  </Link>
</div>

  </>
        ) : (
          renderVideoEmbed() // Calls function to display correct video

        )}
      </div>

      {/* Categories */}
      <MainCategories />

      {/* FEATURED POSTS */}
      <FeaturedPost />

      {/* POST LIST */}
      <div>
      <h3 className="flex flex-col items-center">Advertisement Space</h3>

<div className="mb-6 flex flex-col md:flex-row items-center gap-4 p-3 bg-gray-400 shadow-md rounded-md">
    {/* Banner Ad */}
    <div className="flex-1">
        <a href="https://your-ad-link.com" target="_blank" rel="noopener noreferrer">
            <img 
                src="https://via.placeholder.com/468x60.png?text=Your+Banner+Ad+Here" 
                alt="Banner Ad" 
                className="w-full h-auto rounded-md shadow-sm"
            />
        </a>
    </div>

    {/* Video Ad (Hidden on Mobile) */}
    <div className="hidden md:flex flex-1">
        <iframe
            className="w-full rounded-md shadow-sm"
            style={{ height: "150px", minHeight: "150px" }}
            src={`https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1`}
            title="Video Ad"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
        ></iframe>
    </div>
</div>


        <h1 className="my-8 text-2xl text-gray-600 dark:text-gray-700 font-bold">Recent Posts</h1>
        <PostList />
      </div>
    </div>
  );
};

export default Homepage;
