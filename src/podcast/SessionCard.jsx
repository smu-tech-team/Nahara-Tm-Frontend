import { useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  FaPlay,
  FaDownload,
  FaRegBookmark,
  FaBookmark,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";
import dayjs from "dayjs";
import confetti from "canvas-confetti";

const SessionCard = ({ session, waveformRefs, playingId, setPlayingId }) => {
  const [liked, setLiked] = useState(session.likedByUser === true);
  const [bookmarked, setBookmarked] = useState(session.bookmarkedByUser || false);
  const [likeCount, setLikeCount] = useState(session.likeCount || 0);
  const [bookmarkCount, setBookmarkCount] = useState(session.bookmarkCount || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const getUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded?.userId || null;
    } catch {
      return null;
    }
  };
  const userId = getUserIdFromToken(token);

  const initWaveform = () => {
    if (!waveformRefs.current[session.id]) {
      const wf = WaveSurfer.create({
        container: `#waveform-${session.id}`,
        waveColor: "#ccc",
        progressColor: "#4ade80",
        height: 50,
        barWidth: 2,
        responsive: true,
      });
      wf.load(session.audioUrl);
      waveformRefs.current[session.id] = wf;
    }
  };

  const handlePlay = () => {
    initWaveform();
    const wf = waveformRefs.current[session.id];
    if (wf.isPlaying()) {
      wf.pause();
      setPlayingId(null);
    } else {
      Object.entries(waveformRefs.current).forEach(([id, ref]) => {
        if (id !== session.id && ref?.isPlaying()) ref.pause();
      });
      wf.play();
      setPlayingId(session.id);
    }
  };

  const handleLike = async () => {
    if (!userId) return alert("⚠️ Please log in to like.");
    try {
      setLikeLoading(true);
      const newLike = !liked;
      setLiked(newLike);
      setLikeCount((prev) => prev + (newLike ? 1 : -1));

      await axios.post(
        `http://localhost:8087/api/v1/podcast/streams/${session.id}/like`,
        { like: newLike, userId }
      );

      if (newLike) confetti();
    } catch (e) {
      console.error("❌ Like error:", e);
      alert("❌ Couldn't update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!userId) return alert("⚠️ Please log in to bookmark.");
    try {
      setBookmarkLoading(true);
      const newBookmark = !bookmarked;
      setBookmarked(newBookmark);
      setBookmarkCount((prev) => prev + (newBookmark ? 1 : -1));

      await axios.post(
        `http://localhost:8087/api/v1/podcast/${session.id}/bookmark`,
        { bookmark: newBookmark, userId }
      );
    } catch (e) {
      console.error("❌ Bookmark error:", e);
      alert("❌ Couldn't update bookmark.");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch(session.audioUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${session.title}.mp3`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("❌ Download failed.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 flex gap-4">
      <img
        src={session.creatorImageUrl || "/default-avatar.png"}
        alt={session.creatorName}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              by{" "}
              <a
                href={`/creator/${session.creatorName}`}
                className="underline hover:text-blue-500"
              >
                {session.creatorName}
              </a>
            </p>
            <p className="text-xs text-gray-500">
              {dayjs(session.startedAt).format("MMM D, YYYY h:mm A")} –{" "}
              {dayjs(session.endedAt).format("h:mm A")}
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 ${
                likeLoading
                  ? "opacity-50 cursor-not-allowed"
                  : liked
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              <span className="text-sm">{likeCount}</span>
            </button>
            <button
              onClick={handleBookmark}
              disabled={bookmarkLoading}
              className={`flex items-center gap-1 ${
                bookmarkLoading
                  ? "opacity-50 cursor-not-allowed"
                  : bookmarked
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
              <span className="text-sm">{bookmarkCount}</span>
            </button>
          </div>
        </div>

        {session.audioUrl && (
          <div className="mt-3">
            <div id={`waveform-${session.id}`} className="rounded overflow-hidden" />
            <div className="flex justify-between items-center mt-2">
              <button
                className="p-2 bg-green-500 hover:bg-green-600 rounded-full text-white"
                onClick={handlePlay}
              >
                {playingId === session.id ? (
                  <span className="font-bold text-lg">||</span>
                ) : (
                  <FaPlay className="text-sm" />
                )}
              </button>
              <button
                onClick={handleDownload}
                className="text-blue-500 hover:underline text-xs flex items-center gap-1"
              >
                <FaDownload />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
