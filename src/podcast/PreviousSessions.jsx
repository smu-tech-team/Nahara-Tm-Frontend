import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SkeletonCard from "../podcast/SkeletonCard2";
import SessionCard from "../podcast/SessionCard";
import Banner from "../podcast/Banner";
import Pagination from "../podcast/Pagination";
import Advertisement from "../podcast/Advertisement";
import { motion } from "framer-motion";

const PreviousSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const waveformRefs = useRef({});
  const size = 6;

  const fetchSessions = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8087/api/v1/podcast/previous?page=${pageNumber}&size=${size}`);
      setSessions(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(0);
  }, []);

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) fetchSessions(newPage);
  };

  return (
    <div className="bg-gradient-to-br from-[#1f1c2c] to-[#928dab] text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <Banner />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {Array.from({ length: size }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {sessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                waveformRefs={waveformRefs}
                playingId={playingId}
                setPlayingId={setPlayingId}
              />
            ))}
          </motion.div>
        )}

        <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />

        <Advertisement />
      </div>
    </div>
  );
};

export default PreviousSessions;
