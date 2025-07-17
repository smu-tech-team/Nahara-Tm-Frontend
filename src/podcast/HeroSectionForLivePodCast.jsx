import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PodcastImage from "/live-streaming.jpg";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const LivePodcastHero = () => {
  const [countdown, setCountdown] = useState("");
  const countdownDate = new Date().getTime() + 1000 * 60 * 30;

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        setCountdown("Live Now");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCountdown(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartLive = () => {
    const sessionId = uuidv4();
    navigate(`/creator/live/${sessionId}`);
  };

  const handleSchedule = () => {
    navigate("/creator/schedule");
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-indigo-900 opacity-80 z-0" />
      <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-16 text-white relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            🎙️ Go Live With Your <span className="text-indigo-400">Podcast</span>
          </h1>
          <p className="mb-4 text-lg">
            Engage your audience in real-time with our seamless live podcast experience.
          </p>
          <p className="mb-6 text-md font-medium">
            ⏳ <span className="text-yellow-300">Next Live Starts In: {countdown}</span>
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleStartLive}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
            >
              Start Live Podcast
            </button>
            <button
              onClick={handleSchedule}
              className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg border border-indigo-300 hover:bg-indigo-100 transition"
            >
              Schedule Live Podcast
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
        >
          <img
            src={PodcastImage}
            alt="Live Podcast"
            className="w-full max-w-md md:max-w-lg rounded-xl shadow-2xl border border-indigo-700 animate-pulse"
          />
        </motion.div>
      </div>
      <div className="absolute w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl top-10 right-20 animate-spin-slow" />
      <div className="absolute w-64 h-64 bg-pink-500 rounded-full opacity-20 blur-3xl bottom-10 left-20 animate-ping" />
    </section>
  );
};

export default LivePodcastHero;
