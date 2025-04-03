import React, { useState, useEffect } from 'react';
import AddYourLiveNews from '../components/AddYourLiveNews';
import RecentLiveNews from '../components/RecentLiveNews';

const LiveNewsDashboard = () => {
  const [liveNewsList, setLiveNewsList] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLiveNewsList((news) =>
        news.filter((item) => now - item.timestamp < 24 * 60 * 60 * 1000)
      );
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const addLiveNews = (link) => {
    const now = Date.now();
    setLiveNewsList((prevList) => [
      ...prevList,
      { link, timestamp: now },
    ]);
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Live News Dashboard</h1>
      <AddYourLiveNews addLiveNews={addLiveNews} />
      <RecentLiveNews liveNewsList={liveNewsList} />
    </div>
  );
};

export default LiveNewsDashboard;
