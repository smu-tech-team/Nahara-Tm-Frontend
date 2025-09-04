import React, { useEffect, useState } from "react";
import axios from "axios";

const PodcastList = () => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    axios.get("/api/v1/podcast/all").then((res) => {
      setPodcasts(res.data);
    });
  }, []);

  const like = async (id) => {
    await axios.post(`https://nahara-production.up.railway.app/api/v1/podcast/${id}/like`);
    setPodcasts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📻 Past Podcasts</h2>
      {podcasts.map((pod) => (
        <div key={pod.id} className="p-3 border rounded mb-2">
          <h3 className="font-bold">{pod.title}</h3>
          <audio controls src={pod.audioUrl} className="my-2" />
          <p>👍 {pod.likes}</p>
          <button onClick={() => like(pod.id)} className="btn btn-sm btn-primary">
            Like
          </button>
        </div>
      ))}
    </div>
  );
};

export default PodcastList;
