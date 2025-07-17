import React, { useEffect, useState } from "react";
import fetchTeams from "../store/fetchTeams.js";
import fetchTeamStatistics from "../store/fetchTeamStatistics.js"; // Hypothetical function to fetch team statistics

const ITEMS_PER_PAGE = 10;

const AddFavoriteTeam = () => {
  const [allTeams, setAllTeams] = useState([]);
  const [displayedTeams, setDisplayedTeams] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [showOverviewPopup, setShowOverviewPopup] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null); // Track the team for popup
  const [teamStatistics, setTeamStatistics] = useState(null); // Last match stats

  // Load teams and favorite teams from localStorage on mount
  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      try {
        const teams = await fetchTeams(39, 2023); // Fetching teams for the 2024 season
        if (Array.isArray(teams) && teams.length > 0) {
          setAllTeams(teams);
        } else {
          setError("No teams available.");
        }
      } catch (err) {
        setError("Failed to fetch teams. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadTeams();
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteTeams")) || [];
    setFavoriteTeams(storedFavorites); 
  }, []);
  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setDisplayedTeams(allTeams.slice(start, end));
  }, [currentPage, allTeams]);
  const onAddFavorite = (team) => {
    if (!favoriteTeams.some((favorite) => favorite.name === team.name)) {
      const updatedFavorites = [...favoriteTeams, team];
      setFavoriteTeams(updatedFavorites);
      localStorage.setItem("favoriteTeams", JSON.stringify(updatedFavorites)); 
    }
  };
  const onRemoveFavorite = (team) => {
    const updatedFavorites = favoriteTeams.filter((favorite) => favorite.name !== team.name);
    setFavoriteTeams(updatedFavorites);
    localStorage.setItem("favoriteTeams", JSON.stringify(updatedFavorites)); 
  };
  const handleShowOverview = async (team) => {
    setSelectedTeam(team);
    setShowOverviewPopup(true);
    try {
      const stats = await fetchTeamStatistics(team.name); 
      setTeamStatistics(stats);
    } catch (err) {
      console.error("Failed to fetch team statistics:", err.message);
      setTeamStatistics(null);
    }
  };
  return (
    <div className="bg-white dark:bg-black p-3 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-lg font-semibold text-black dark:text-white mb-3">Add Favorite Team</h2>

      {isLoading ? (
        <p className="text-center text-gray-400">Loading teams...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : (
        <div className="overflow-y-auto max-h-64">
          <ul className="space-y-2">
            {displayedTeams.map((team) => (
              <li
                key={team.name}
                className="flex items-center justify-between bg-gray-700 p-2 rounded-md"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={team.logo || "https://via.placeholder.com/50"}
                    alt={team.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-white">{team.name}</span>
                </div>
                {favoriteTeams.some((favorite) => favorite.name === team.name) ? (
                  <button
                    className="bg-red-600 text-sm px-2 py-1 rounded-md hover:bg-red-700"
                    onClick={() => onRemoveFavorite(team)}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    className="  button-color animate-gradient-flow-xtext-sm px-2 py-1 rounded-md hover:bg-blue-700"
                    onClick={() => onAddFavorite(team)}
                  >
                    Add
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-600 text-sm px-3 py-1 rounded-md"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-xs text-gray-400">Page {currentPage}</span>
        <button
          className="bg-gray-600 text-sm px-3 py-1 rounded-md"
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(allTeams.length / ITEMS_PER_PAGE) ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(allTeams.length / ITEMS_PER_PAGE)}
        >
          Next
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-3">⭐Your Favorite Teams</h2>
        {favoriteTeams.length > 0 ? (
          <ul className="space-y-2 overflow-y-auto max-h-40">
            {favoriteTeams.map((team) => (
              <li key={team.name} className="flex items-center justify-between bg-gray-700 p-2 rounded-md">
                <div className="flex items-center gap-3">
                  <img
                    src={team.logo || "https://via.placeholder.com/50"}
                    alt={team.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-white">{team.name}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-800 text-sm px-2 py-1 rounded-md hover:bg-blue-700"
                    onClick={() => handleShowOverview(team)}
                  >
                    Overview
                  </button>
                  <button
                    className="bg-red-600 text-sm px-2 py-1 rounded-md hover:bg-red-700"
                    onClick={() => onRemoveFavorite(team)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-400">No favorite teams added yet.</p>
        )}
      </div>
      {showOverviewPopup && selectedTeam && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-white">
            <h3 className="text-xl font-bold mb-4">{selectedTeam.name} - Last Match Overview</h3>
            {teamStatistics ? (
              <div>
                <p className="text-sm mb-2">Match Date: {teamStatistics.matchDate}</p>
                <p className="text-sm mb-2">Opponent: {teamStatistics.opponent}</p>
                <p className="text-sm mb-2">Score: {teamStatistics.score}</p>
                <p className="text-sm mb-2">Location: {teamStatistics.location}</p>
              </div>
            ) : (
              <p className="text-center text-gray-400">No data available.</p>
            )}
            <button
              className="bg-red-600 text-sm px-4 py-2 rounded-md hover:bg-red-700 mt-4"
              onClick={() => setShowOverviewPopup(false)} 
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddFavoriteTeam;
