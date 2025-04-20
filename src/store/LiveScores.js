import axios from 'axios';

const SPORTS_ENDPOINTS = {
  football: 'https://v3.football.api-sports.io/fixtures?live=all',
  basketball: 'https://v1.basketball.api-sports.io/games?live=all',
  tennis: 'https://v1.tennis.api-sports.io/matches?live=all',
  cricket: 'https://v1.cricket.api-sports.io/matches?live=all',
};

const fetchLiveScoresForAllSports = async () => {
  const headers = {
    'x-apisports-key': 'b65cdb3843cd296fa4aa860613898e6d',
  };

  const allResults = {};
  const cacheExpirationTime = 3 * 60 * 1000; 

  await Promise.all(
    Object.entries(SPORTS_ENDPOINTS).map(async ([sport, url]) => {
      const cachedData = JSON.parse(localStorage.getItem(sport));

      if (cachedData && Date.now() - cachedData.timestamp < cacheExpirationTime) {
        allResults[sport] = cachedData.data;
      } else {
        try {
          const res = await axios.get(url, { headers });
          allResults[sport] = res.data.response || [];

          localStorage.setItem(
            sport,
            JSON.stringify({
              data: res.data.response || [],
              timestamp: Date.now(),
            })
          );
        } catch (err) {
          console.error(`Failed to fetch ${sport} scores:`, err.message);
          allResults[sport] = []; 
        }
      }
    })
  );

  return allResults;
};

export default fetchLiveScoresForAllSports;
