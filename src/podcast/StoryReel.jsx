import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaClock } from "react-icons/fa";

const stories = [
  {
    id: 1,
    title: "Tech Talk",
    subtitle: "AI & the Future",
    image: "/live-streaming.jpg",
    time: "Today · 6PM",
    live: true,
  },
  {
    id: 2,
    title: "News Update",
    subtitle: "Global Rundown",
    image: "/featured4.jpeg",
    time: "Today · 8PM",
  },
  {
    id: 3,
    title: "Health Talk",
    subtitle: "Mental Wellness",
    image: "/featured1.jpeg",
    time: "Fri · 10AM",
  },
  {
    id: 4,
    title: "Sports Show",
    subtitle: "Finals Recap",
    image: "/featured2.jpeg",
    time: "Sat · 4PM",
  },
  {
    id: 5,
    title: "Live Gospel",
    subtitle: "Spirit Hour",
    image: "/featured3.jpeg",
    time: "Sun · 9AM",
    live: true,
  },
];

const StoryReel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="overflow-x-auto scrollbar-thin scrollbar-thumb-indigo-500 p-6 rounded-xl bg-gradient-to-tr from-indigo-100 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-inner"
    >
      <div className="flex gap-6 min-w-max">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.08 }}
            className="w-52 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 shadow-md relative cursor-pointer hover:shadow-xl transition duration-300"
          >
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-32 object-cover rounded-t-xl"
            />

            {/* Live badge */}
            {story.live && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-md">
                LIVE
              </div>
            )}

            <div className="p-3 space-y-1">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                {story.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">{story.subtitle}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span className="flex items-center gap-1">
                  <FaClock />
                  {story.time}
                </span>
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full p-1 text-[10px]">
                  <FaPlay />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default StoryReel;
