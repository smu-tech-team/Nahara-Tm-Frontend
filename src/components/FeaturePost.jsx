import axios from "axios";
import Image from "./Image";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PostSkeleton from "../components/PostSkeleton";
import NewsletterSubscription from "../components/NewsletterSubscription";
import React, { useState, useEffect, useRef } from "react";

const FeaturedPost = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loadingDelay, setLoadingDelay] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);
  const placeholderLogo = "/Nahara_Red[1].png";

  const limit = 4;

  const fetchPost = async () => {
    const res = await axios.get(`https://nahara-production.up.railway.app/api/post/featured?limit=${limit}`);
    return res.data;
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["featuredPosts", limit],
    queryFn: fetchPost,
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

  if (isLoading || error) {
    return (
      <div ref={containerRef} className="flex flex-col items-center justify-center py-12">
        <img
          src={error ? "/error.webp" : ""} 
          alt={error ? "Network Error" : "loading"}
          className="w-64 h-64 object-contain mb-6"
        />
        <p className={`text-center text-lg mb-4 ${error ? "text-red-500" : "text-gray-500"}`}>
          {error ? `Error: ${error.message}` : "Loading... Please wait"}
        </p>
        {error && (
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const posts = data || [];

  const localTime = posts[0]?.createdAt
    ? new Date(posts[0].createdAt).toLocaleString()
    : "Unknown Date";

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div
        ref={containerRef}
        className="lg:col-span-2 flex flex-col bg-white dark:bg-black dark:shadow-white shadow-sm rounded-lg overflow-hidden max-h-[600px]"
      >
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
        <div className="flex flex-col flex-grow p-6">
          <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-500">#01</span>
              <Link to="/sports-news" className="text-blue-500 hover:underline">
                {posts[0]?.category}
              </Link>
            </div>
            <span className="text-black dark:text-white">{localTime}</span>
            <span className="text-black dark:text-white font-bold">{posts[0]?.views} views</span>
          </div>
          <Link
            to={posts[0]?.slug}
            className="block text-2xl font-semibold text-black dark:text-white hover:text-blue-500 transition"
          >
            {posts[0]?.title || "Untitled Post"}
          </Link>
          <p className="text-gray-500 dark:text-white mt-3 line-clamp-3">
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

      <div className="flex flex-col rounded-lg p-6">
        <NewsletterSubscription />
      </div>

      <div className="lg:col-span-1 flex flex-col gap-8">
        <h2 className="text-lg font-bold dark:text-white text-black">Sponsored Ads</h2>
        {[
          {
            img: "SMUADS2.PNG.jpg",
            text: "Sabipredict is your number one prediction and free prediction site.",
          },
          {
            img: "SMUADS.PNG.jpg",
            text: "Exclusive deals for sports fans!",
          },
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

      <div className="lg:col-span-1 flex flex-col gap-8"></div>
    </div>
  );
};

export default FeaturedPost;
