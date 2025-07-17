import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  FaBroadcastTower, FaHeadphones, FaStop, FaPlay,
  FaClock, FaStar, FaMicrophoneAlt
} from "react-icons/fa";
import axios from "axios";

const LiveStreamer = ({creatorId}) => {
  const { sessionId } = useParams();
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [listenerCount, setListenerCount] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [audioUrl, setAudioUrl] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!isStreaming || !sessionId) return;

const socket = new WebSocket(`ws://localhost:8087/ws/audio?sessionId=${sessionId}&creatorId=${creatorId}&title=${encodeURIComponent(title)}`);

    wsRef.current = socket;

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(e.data);
        }
      };

      recorder.start(1000);
    });

    socket.onmessage = (e) => {
      try {
        const { type, count } = JSON.parse(e.data);
        if (type === "count") setListenerCount(count);
      } catch (err) {
        console.error("Failed to parse message:", err);
      }
    };

    socket.onclose = () => {
      mediaRecorderRef.current?.stop();
    };

    return () => socket.close();
  }, [isStreaming, sessionId]);

  useEffect(() => {
    if (!isStreaming) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsStreaming(false);
          uploadAndFinalize();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStreaming]);

  const uploadAndFinalize = async () => {
    try {
      const res = await axios.post(`http://localhost:8087/api/v1/podcast/upload/${sessionId}`);
      const uploadedUrl = res.data.audioUrl;
      setAudioUrl(uploadedUrl);

      if (title.trim()) {
        await axios.patch(`http://localhost:8087/api/v1/podcast/title/${sessionId}`, { title });
      }

      console.log("Stream finalized, uploaded, and titled.");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleStreamToggle = () => {
    if (isStreaming) {
      setShowConfirmModal(true);
    } else {
      if (!title.trim()) {
        alert("Please enter a podcast title before going live.");
        return;
      }
      setTimeLeft(1800);
      setIsStreaming(true);
    }
  };

  const confirmStopStream = () => {
    setIsStreaming(false);
    uploadAndFinalize();
    setShowConfirmModal(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-indigo-900 text-white p-6 font-sans relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-indigo-950 p-6 rounded-xl shadow-2xl border border-indigo-700">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FaBroadcastTower className="text-red-500 animate-pulse" />
            Live Podcast Session
          </h1>
          <p className="text-indigo-300 text-sm mt-1">Streaming powered by <strong>NaharaCast™</strong></p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow">
            Session ID: {sessionId || "N/A"}
          </div>
          {isStreaming && (
            <div className="flex items-center gap-2 text-yellow-300 text-sm">
              <FaClock /> Ends in: {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gray-950 p-6 rounded-xl shadow-lg border border-indigo-700">
          <label className="block mb-4">
            <span className="text-gray-300 font-semibold">🎙️ Podcast Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your podcast title"
              className="w-full mt-2 p-3 rounded-lg bg-black border border-gray-700 text-white"
            />
          </label>

          <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
            <FaHeadphones className="text-red-800" />
            Listeners: <span className="text-green-300">{listenerCount}</span>
          </h2>

          <div className="h-24 mb-6 bg-black rounded-lg overflow-hidden relative">
            <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 px-2 h-full animate-pulse">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-red-800 rounded"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `wave 1.2s infinite ease-in-out ${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleStreamToggle}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition duration-300 inline-flex items-center gap-2 ${
              isStreaming
                ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700"
                : "bg-gradient-to-br from-indigo-700 via-gray-800 to-indigo-950 hover:from-green-700"
            }`}
          >
            {isStreaming ? <FaStop /> : <FaPlay />}
            {isStreaming ? "End Live" : "Start Live"}
          </button>

          {audioUrl && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <FaMicrophoneAlt /> Preview Your Podcast
              </h3>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/webm" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        <div className=" text-white p-4 rounded-xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">🎁 Sponsored</h3>
            <p className="text-sm">Upgrade your podcast gear today. 20% off all mic stands at PodBay Nigeria!</p>
            
          </div>
          <a
            href="https://podbay.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 bg-black text-yellow-300 px-4 py-2 rounded-full text-sm text-center hover:opacity-90 transition"
          >
            Visit PodBay
          </a>
        </div>
      </div>

      
      {/* ➕ Additional Content Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h3 className="text-3xl font-bold text-white">Engage Your Audience</h3>
          <p className="text-indigo-200">Craft unforgettable live moments with storytelling, shoutouts, and community-driven topics. Your voice has the power to unite and inspire.</p>
          <ul className="list-disc pl-5 text-indigo-300">
            <li>Live audience shoutouts</li>
            <li>Real-time polls (coming soon!)</li>
            <li>Share to social media</li>
          </ul>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img src="/streams.jpg" alt="Stream in action" className="w-full h-auto" />
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl shadow-lg p-6 max-w-sm">
            <h2 className="text-lg font-bold mb-2">End Stream?</h2>
            <p className="text-sm mb-4">Are you sure you want to stop your podcast?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmStopStream}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                End Stream
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default LiveStreamer;
