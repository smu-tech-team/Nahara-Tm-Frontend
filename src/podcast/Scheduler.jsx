import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import podcastImg from "/live-streaming.jpg"; // Replace with your image

const Scheduler = () => {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const schedulePodcast = async () => {
    const creatorId = localStorage.getItem("userId");
    try {
      await axios.post("https://nahara-production.up.railway.app/api/v1/podcast/api/podcast/schedule", {
        title,
        time,
        creatorId,
      });
      alert("Podcast Scheduled");
      setTitle("");
      setTime("");
    } catch (err) {
      alert("Error scheduling podcast");
    }
  };

  return (
    <div className="min-h-screen  py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-400 leading-snug">
            Plan & Publish Your <span className="text-blue-600">Podcast</span> Seamlessly
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Take control of your podcasting schedule. Stay ahead with consistent content and keep your audience engaged.
          </p>
          <div className="space-y-3 text-gray-700 dark:text-gray-400">
            <div className="flex items-start gap-3">
              <span className="text-blue-500 text-xl">🎙️</span>
              <p>Automated publishing at your selected time</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">📈</span>
              <p>Grow audience through consistent delivery</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-purple-500 text-xl">⏰</span>
              <p>Free up your time with scheduled releases</p>
            </div>
          </div>
        </motion.div>

        {/* Right Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white shadow-xl rounded-2xl p-6 md:p-8 space-y-4"
        >
          <img
            src={podcastImg}
            alt="Podcast Visual"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-400">Schedule New Podcast</h2>
          <input
            type="text"
            placeholder="Enter Podcast Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-400"
          />
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:text-gray-400"
          />
          <button
            onClick={schedulePodcast}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition duration-300 "
          >
            Schedule Podcast
          </button>
        </motion.div>
      </div>

      {/* Ads Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 p-6 md:p-10 rounded-xl shadow text-center"
      >
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          🚀 Promote Your Podcast with Us!
        </h3>
        <p className="text-gray-700 text-md md:text-lg">
          Reach thousands of listeners by showcasing your podcast on our featured section.
          <br className="hidden md:block" />
          Boost your visibility and grow your audience today!
        </p>
      </motion.div>
    </div>
  );
};

export default Scheduler;
