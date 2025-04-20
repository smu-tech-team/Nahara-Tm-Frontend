import axios from "axios";
import Image from "./image";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../components/PostSkeleton";
import WeatherComponent from "../components/WeatherComponent";
import NewsletterSubscription from "../components/NewsletterSubscription";
import React, { useState, useEffect, useRef } from "react";


const FeaturedPost = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);
  const placeholderLogo = "/SmartLogoMain.png";

  const fetchPost = async (limit = 4) => {
    const res = await axios.get(`http://localhost:8087/api/post/featured?limit=${limit}`);
    return res.data;
  };

  const limit = 4; // Dynamically set this value if required
  const { isLoading, error, data } = useQuery({
    queryKey: ["featuredPosts", limit],
    queryFn: () => fetchPost(limit),
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        setLoadingDelay(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!isVisible || loadingDelay) {
    return (
      <div ref={containerRef}>
        <PostSkeleton />
      </div>
    );
  }

  if (isLoading) return <div className="text-center text-lg text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error.message}</div>;

  const posts = data || [];
  const localTime = posts[0]?.createdAt
    ? new Date(posts[0].createdAt).toLocaleString()
    : "Unknown Date";

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Featured Post */}
      <div
        ref={containerRef}
        className="lg:col-span-2 flex flex-col bg-gray-800 dark:bg-white shadow-sm rounded-lg overflow-hidden max-h-[600px]"
      >
        {/* Image Section */}
        <div className="relative w-full h-64 bg-gray-700 flex items-center justify-center">
          {!imageLoaded && (
            <img
              src={placeholderLogo}
              alt="Loading..."
              className="absolute inset-0 w-full h-full object-contain animate-pulse opacity-30 blur-sm"
            />
          )}
          {posts[0]?.img && (
            <img
              src={posts[0].img}
              alt={posts[0].title}
              className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>

        {/* Post Content */}
        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-500">#01</span>
              <Link to="/sports-news" className="text-blue-500 hover:underline">
                {posts[0]?.category}
              </Link>
            </div>
            <span className="text-gray-400">{localTime}</span>
            <span className="text-green-400 font-bold">{posts[0]?.views} views</span>
          </div>
          <Link
            to={posts[0]?.slug}
            className="block text-2xl font-semibold text-gray-300 dark:text-gray-700 hover:text-blue-500 transition"
          >
            {posts[0]?.title || "Untitled Post"}
          </Link>
          <p className="text-white dark:text-gray-500 mt-3 line-clamp-3">
            {posts[0]?.desc || "Discover more insights in this article."}
          </p>
          <Link
            to={posts[0]?.slug}
            className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-medium"
          >
            Read More →
          </Link>
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex flex-col bg-gray-800 dark:bg-gray-900 shadow-lg rounded-lg p-6 text-white">
        <NewsletterSubscription />
        <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-md">
          <div className="p-4">
            <WeatherComponent />
          </div>
        </div>
      </div>

      {/* Sponsored Ads */}
      <div className="lg:col-span-1 flex flex-col gap-8">
        <h2 className="text-lg font-bold dark:text-gray-600 text-gray-300">Sponsored Ads</h2>

        {[
          { img: "SMUADS2.PNG.jpg", text: "Sabipredict is your number one prediction and free prediction site." },
          { img: "SMUADS.PNG.jpg", text: "Exclusive deals for sports fans!" },
        ].map((ad, idx) => (
          <div key={idx} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <Image src={ad.img} className="w-full h-[180px] rounded-lg object-cover" />
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">{ad.text}</p>
            <Link to="/promo" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
              {idx === 0 ? "Learn More →" : "Shop Now →"}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPost;
