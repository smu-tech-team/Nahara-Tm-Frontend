import React, { useEffect, useState } from "react";
import fetchLiveScoresForAllSports from "../store/LiveScores.js";
import AddFavoriteTeam from "../components/AddFavoriteTeam.jsx";

const sportColors = {
  football: "bg-blue-500",
  basketball: "bg-orange-500",
  tennis: "bg-yellow-400",
  cricket: "bg-green-600",
  default: "bg-gray-600",
  afl: "bg-red-500",
  baseball: "bg-purple-500",
  formula1: "bg-teal-600",
  handball: "bg-pink-400",
  hockey: "bg-indigo-500",
  mma: "bg-cyan-500",
  nba: "bg-orange-400",
  nfl: "bg-red-600",
  rugby: "bg-lime-600",
  volleyball: "bg-amber-400",
};

const LiveScores = () => {
  const [liveScores, setLiveScores] = useState({});
  const [selectedSport, setSelectedSport] = useState("football");
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const getLiveScores = async () => {
      try {
        const scores = await fetchLiveScoresForAllSports();
        console.log("Fetched live scores:", scores);
        setLiveScores(scores);
      } catch (error) {
        console.error("Error fetching live scores:", error);
      }
    };

    getLiveScores();
  }, []);

  const addFavoriteTeam = (team) => {
    if (!favoriteTeams.some((t) => t.id === team.id)) {
      setFavoriteTeams((prev) => [...prev, team]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row bg-gray-900 text-white min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-4">
        <h2 className="text-2xl font-bold text-center mb-6">🔴 Live Scores</h2>

        {/* Sports Tabs */}
        <div className="flex justify-start lg:justify-center space-x-4 mb-6 overflow-x-auto scrollbar-hide">
          {Object.keys(liveScores).map((sport) => (
            <button
              key={sport}
              className={`px-3 py-1 text-sm font-semibold capitalize transition-all ${
                selectedSport === sport
                  ? "border-b-2 border-white text-white"
                  : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setSelectedSport(sport)}
            >
              {sport.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Matches */}
        <div>
          {liveScores[selectedSport]?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveScores[selectedSport].map((match, idx) => {
                const colorClass = sportColors[selectedSport] || sportColors.default;

                return (
                  <div
                    key={`${selectedSport}-${idx}`}
                    className={`rounded-lg shadow-lg p-3 ${colorClass} bg-opacity-80`}
                  >
                    {/* League and Time */}
                    <div className="flex justify-between text-xs font-medium text-gray-200 mb-2">
                      <span>{match.league?.name || "Unknown League"}</span>
                      <span>
                        {new Date(match.fixture?.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Teams and Score */}
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <img
                          src={match.teams?.home?.logo || "https://via.placeholder.com/50"}
                          alt="Home Team"
                          className="w-10 h-10 mx-auto rounded-md"
                        />
                        <p className="mt-1 text-xs truncate">{match.teams?.home?.name || "Home Team"}</p>
                      </div>
                      <div className="text-lg font-bold text-center">
                        {match.goals?.home ?? "-"} : {match.goals?.away ?? "-"}
                      </div>
                      <div className="text-center">
                        <img
                          src={match.teams?.away?.logo || "https://via.placeholder.com/50"}
                          alt="Away Team"
                          className="w-10 h-10 mx-auto rounded-md"
                        />
                        <p className="mt-1 text-xs truncate">{match.teams?.away?.name || "Away Team"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              {liveScores[selectedSport] === undefined
                ? `Loading ${selectedSport} matches...`
                : `No live ${selectedSport} matches available`}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar for Favorite Teams */}
      <div
        className={`transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        } fixed right-0 top-0 w-full sm:w-80 bg-gray-800 h-full lg:static lg:translate-x-0 lg:w-1/4 shadow-lg`}
      >
        <div className="p-4 flex flex-col gap-6">
          {/* Add Favorite Team Section */}
          <AddFavoriteTeam onAddFavorite={addFavoriteTeam} />

          {/* Display Favorite Teams */}
        
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="fixed mb-5 right-4 bg-gray-600 p-2 rounded-full lg:hidden z-10"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? "Close" : "Favorites"}
      </button>
    </div>
  );
};

export default LiveScores;
