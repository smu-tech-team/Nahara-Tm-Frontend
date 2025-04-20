import { useNavigate } from "react-router-dom";
import { Headphones } from "lucide-react";

const PodcastButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/podcasts")}
      className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <Headphones className="w-4 h-4" />
      <span className="text-sm">Podcasts</span>
    </button>
  );
};

export default PodcastButton;
