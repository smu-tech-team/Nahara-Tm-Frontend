import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const CategoryBanner = ({ selectedCategory = "default" }) => {
  const [bannerData, setBannerData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const intervalRef = useRef(null);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((prev) => (prev + 1) % bannerData.length),
    onSwipedRight: () => setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`https://nahara-production.up.railway.app/api/banners/${selectedCategory}`);
        const banners = response.data;

        if (!banners.length) {
          const fallback = await axios.get(`https://nahara-production.up.railway.app/api/banners/default`);
          setBannerData(fallback.data);
        } else {
          setBannerData(banners);
        }
      } catch (error) {
        console.error("Error fetching banners:", error.response?.data || error.message);
      }
    };

    fetchBanners();
  }, [selectedCategory]);

  useEffect(() => {
    if (bannerData.length === 0) return;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        setCurrentSlide((prev) => (prev + 1) % bannerData.length);
      }
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [bannerData, isPaused]);

  if (!bannerData.length) return <p className="text-center text-gray-500">Loading banners...</p>;

  const current = bannerData[currentSlide];

  return (
    <motion.div
      {...swipeHandlers}
      className="relative w-full h-52 md:h-72 overflow-hidden rounded-xl shadow-lg pt-6 mb-6 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-label="Category Banner Carousel"
    >
      <AnimatePresence mode="wait">
        <motion.a
          key={currentSlide}
          href={current.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center flex items-center"
          style={{ backgroundImage: imageLoaded ? `url(${current.imageUrl})` : "none" }}
          onLoad={() => setImageLoaded(true)}
          aria-label={`Banner ${current.title}`}
        >
          {/* Invisible preloader image to allow lazy load */}
          <img
            src={current.imageUrl}
            alt={current.title}
            className="hidden"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
            loading="lazy"
          />

          <motion.div
            className="bg-gradient-to-r from-black/70 to-transparent p-4 md:p-8 rounded-r-xl max-w-md text-white ml-6 md:ml-12 shadow-md backdrop-blur-sm"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg md:text-2xl font-bold line-clamp-2">{current.title}</h2>
            <p className="text-xs md:text-base mt-2 text-white/90 line-clamp-3">{current.description}</p>
          </motion.div>
        </motion.a>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length)}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 z-20 focus:outline-none focus:ring focus:ring-white"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerData.length)}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/70 z-20 focus:outline-none focus:ring focus:ring-white"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Bullet Dots */}
      <div className="absolute bottom-2 w-full flex justify-center gap-1 z-20">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white scale-110" : "bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CategoryBanner;
