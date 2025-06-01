import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MarketDetails = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8087/api/stocks/commodities')
      .then(res => {
        setCommodities(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center p-4">Loading commodities...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Commodities Market</h2>
      <div className="grid grid-cols-2 gap-4">
        {commodities.map((item) => (
          <div key={item.symbol} className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.symbol}</p>
            <p className="mt-2 font-bold text-green-600">${item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketDetails;
