import { useEffect, useState, useRef } from "react";
import axios from "axios";
import SessionCard from "./SessionCard"; // assuming you already have this

const SavedSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const waveformRefs = useRef({});

  const fetchSaved = async (pageNumber) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:8087/api/v1/podcast/saved?page=${pageNumber}&size=6`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed to fetch saved sessions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved(0);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">🔖 Your Saved Sessions</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : sessions.length === 0 ? (
        <p className="text-center text-gray-500">You haven't saved any sessions yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {sessions.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              waveformRefs={waveformRefs}
              playingId={null}
              setPlayingId={() => {}}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center items-center gap-3">
        <button
          onClick={() => fetchSaved(page - 1)}
          disabled={page === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm">Page {page + 1} of {totalPages}</span>
        <button
          onClick={() => fetchSaved(page + 1)}
          disabled={page + 1 >= totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SavedSessions;
