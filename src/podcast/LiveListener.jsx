
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useNavigate } from "react-router-dom"; // 👈 Import navigate hook


import { getUserIdFromJWT } from "../store/getUserIdFromJWT";
import { SkeletonCard } from "../podcast/SkeletonCard";
import { LiveSessionList } from "../podcast/LiveSessionList";
import { PlayerPanel } from "../podcast/PlayerPanel";

const LiveHub = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [status, setStatus] = useState("idle");
  const [listenerCount, setListenerCount] = useState(0);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [volume, setVolume] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
    const navigate = useNavigate();

  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const waveformHistory = useRef([]);
  const animationRef = useRef(null);

  const userId = getUserIdFromJWT();
  const maxHistoryLength = 300;

  const convertPCMToFloat32 = (buffer) => {
    const int16 = new Int16Array(buffer);
    return Float32Array.from(int16, (v) => v / 32768);
  };

  const getVolume = (chunk) => {
    const sumSquares = chunk.reduce((acc, sample) => acc + sample * sample, 0);
    return Math.sqrt(sumSquares / chunk.length);
  };

  const drawScrollingWaveform = (pcmChunk) => {
    waveformHistory.current.push(pcmChunk);
    if (waveformHistory.current.length > maxHistoryLength) waveformHistory.current.shift();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#00FFAA";
    ctx.lineWidth = 1;

    waveformHistory.current.forEach((chunk, i) => {
      const avg = chunk.reduce((a, b) => a + Math.abs(b), 0) / chunk.length;
      const y = canvas.height / 2 - avg * canvas.height / 2;
      const x = (i * canvas.width) / maxHistoryLength;
      ctx.moveTo(x, canvas.height / 2);
      ctx.lineTo(x, y);
    });

    ctx.stroke();
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(function animate() {
      drawScrollingWaveform(new Float32Array(128).fill(0));
      animationRef.current = requestAnimationFrame(animate);
    });
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8087/live")
      .then((res) => res.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8087/ws-sessions"),
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe("/topic/sessions", (message) => {
        try {
          const body = JSON.parse(message.body);
          const live = (body.sessions || []).filter((s) => s.isLive !== false);
          setSessions(live);
        } catch (err) {
          console.error("WebSocket parse error", err);
        }
      });
    };

    client.onStompError = (frame) => console.error("❌ STOMP error:", frame.headers["message"]);

    client.activate();
    return () => client.deactivate();
  }, []);

  useEffect(() => {
    if (!selectedSession) return;
    const context = new AudioContext({ sampleRate: 48000 });
    audioRef.current = context;
    let socket, workletNode;

    const loadAudio = async () => {
      try {
        await context.audioWorklet.addModule("/audio-worklets/pcm-processor.js");
        workletNode = new AudioWorkletNode(context, "pcm-processor");
        workletNode.connect(context.destination);

        socket = new WebSocket(
          `ws://localhost:8087/ws/audio?sessionId=${selectedSession.id}&creatorId=${userId}&title=${encodeURIComponent(selectedSession.title)}`
        );
        socket.binaryType = "arraybuffer";
        setStatus("connecting");

        socket.onopen = () => setStatus("connected");
        socket.onerror = () => setStatus("error");
        socket.onclose = () => {
          setStatus("disconnected");
          workletNode?.disconnect();
          context?.close().catch(() => {});
        };

        socket.onmessage = (e) => {
          if (typeof e.data === "string") {
            const msg = JSON.parse(e.data);
            if (msg.type === "count") setListenerCount(msg.count);
          } else if (isPlaying) {
            const pcmFloat = convertPCMToFloat32(e.data);
            setVolume(getVolume(pcmFloat));
            drawScrollingWaveform(pcmFloat);
            workletNode.port.postMessage({ type: "pcm", chunk: pcmFloat });
          }
        };
      } catch (err) {
        console.error("Failed to load AudioWorklet", err);
      }
    };

    loadAudio();

    return () => {
      if (socket?.readyState === WebSocket.OPEN) socket.close();
      workletNode?.disconnect();
      context?.close().catch(() => {});
    };
  }, [selectedSession, isPlaying]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 font-sans text-white bg-gradient-to-br from-[#1f1c2c] to-[#928dab] min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/previous-sessions")}
          className="bg-white text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
        >
          🎞️ Listen to Previous Live-Podcast
        </button>
      </div>
      <h1 className="text-4xl font-bold mb-10">🎧 Live Sessions Hub</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">🟢 Live Now</h2>
          {loadingSessions ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-gray-300">No live sessions available right now.</p>
          ) : (
            <LiveSessionList
              sessions={sessions}
              selectedSession={selectedSession}
              onSelect={setSelectedSession}
            />
          )}
        </div>
        

        <motion.div
          key={selectedSession?.id || "empty"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#2c2c54] p-6 rounded-xl shadow-md relative"
        >
          <h3 className="text-xl font-bold mb-6">🎵 Live Audio Player</h3>

          {selectedSession && (
            <button
              onClick={() => {
                audioRef.current?.close();
                setSelectedSession(null);
                setStatus("idle");
              }}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ❌ Stop Listening
            </button>
          )}

          <AnimatePresence mode="wait">
            <PlayerPanel
              canvasRef={canvasRef}
              volume={volume}
              status={status}
              isPlaying={isPlaying}
              onTogglePlaying={() => setIsPlaying((prev) => !prev)}
            />
          </AnimatePresence>

          {status === "connected" && (
            <button
              onClick={async () => {
                if (!selectedSession) return;
                try {
                  await fetch(`http://localhost:8087/api/v1/podcast/speaker-request/${selectedSession.id}`, {
                    method: "POST",
                  });
                  alert("🎙️ Speaker request sent!");
                } catch (err) {
                  alert("❌ Failed to request");
                }
              }}
              className="mt-6 px-6 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            >
              🎙️ Request to Speak
            </button>
          )}
        </motion.div>
      </div>
      
    </div>
  );
};

export default LiveHub;