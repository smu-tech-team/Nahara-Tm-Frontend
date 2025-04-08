import axios from 'axios';

const cache = {};

const getFootballTeamsFromLeague = async (leagueId, season) => {
  const headers = {
    'x-rapidapi-key': 'b65cdb3843cd296fa4aa860613898e6d', 
  };

  if (!leagueId || !season) {
    console.error('Invalid league ID or season:', leagueId, season);
    return [];  
  }

  const cacheKey = `${leagueId}_${season}`;
  if (cache[cacheKey]) {
    console.log('Using cached data for', cacheKey);
    return cache[cacheKey];  // Return cached data if available
  }

  try {
    const response = await axios.get(
      `https://v3.football.api-sports.io/teams?league=${leagueId}&season=${season}`,
      { headers }
    );

    console.log('Response Data:', response.data);

    const teams = response.data.response.map(team => ({
      id: team.team.id, 
      name: team.team.name,
      logo: team.team.logo,
    }));

    cache[cacheKey] = teams;

    console.log('✅ Teams Fetched:', teams);
    return teams;
  } catch (err) {
    console.error('Error fetching teams:', err);

    return [];  // Return empty array on error
  }
};

export default getFootballTeamsFromLeague;
