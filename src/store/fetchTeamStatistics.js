import axios from "axios";
import fetchTeams from "../store/fetchTeams.js"; // Adjust the path as needed

const getLastMatchData = async (teamId) => {
  const headers = {
    'x-rapidapi-key': 'your_api_key_here', // Replace with your valid API key
    'x-rapidapi-host': 'v3.football.api-sports.io',
  };

  try {
    const response = await axios.get(
      `https://v3.football.api-sports.io/fixtures?team=${teamId}&season=2023`,
      { headers }
    );

    const matches = response.data.response;
    if (!matches.length) {
      console.log(`No match data found for team ${teamId}`);
      return null;
    }

    const latestMatch = matches.sort((a, b) => new Date(b.fixture.date) - new Date(a.fixture.date))[0];

    console.log(`✅ Latest match for team ${teamId}:`, latestMatch);
    return latestMatch;

  } catch (err) {
    console.error(`❌ Error fetching match data for Team ${teamId}:`, err.response?.data || err.message);
    return null;
  }
};

const fetchAllTeamsLastMatchData = async () => {
  try {
    const teams = await fetchTeams(39, 2023); 
    console.log("✅ Total Teams Fetched:", teams.length);

    for (const item of teams) {
      const teamId = item.team?.id;
      const teamName = item.team?.name;

      if (!teamId) {
        console.warn(`⚠️ Skipping ${teamName || 'Unnamed'} — missing team ID`);
        continue;
      }

      console.log(`\n📌 Fetching last match data for ${teamName} (ID: ${teamId})`);
      await getLastMatchData(teamId);
    }
  } catch (error) {
    console.error("❌ Failed to fetch teams:", error);
  }
};

fetchAllTeamsLastMatchData();
export default getLastMatchData;
