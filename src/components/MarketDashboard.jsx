// MarketDashboard.jsx
import React, { useEffect, useState } from "react";
import MarketCard from "./MarketCard";
import EmailSubscription from "./EmailSubscription";
import axios from "axios";

const MarketDashboard = () => {
  const [cryptoMarkets, setCryptoMarkets] = useState([]);
  const [commodityMarkets, setCommodityMarkets] = useState([]);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 6,
            page: 1,
            sparkline: true,
          },
        });
        setCryptoMarkets(res.data);
      } catch (err) {
        console.error("Crypto fetch error", err);
      }
    };

    const fetchCommodities = async () => {
      try {
        const res = await axios.get("https://commodities-api.com/api/latest", {
          params: { access_key: "YOUR_API_KEY", base: "USD", symbols: "XAU,XAG,WTIOIL" },
        });

        const formatted = Object.entries(res.data.data.rates).map(([symbol, rate]) => ({
          id: symbol,
          name: symbol === "XAU" ? "Gold" : symbol === "XAG" ? "Silver" : "Crude Oil",
          symbol,
          current_price: rate,
          image: `/assets/${symbol.toLowerCase()}.png`,
        }));

        setCommodityMarkets(formatted);
      } catch (error) {
        console.error("Failed to fetch commodities:", error.message);
      }
    };

    fetchCryptoData();
    fetchCommodities();
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
        🌍 Market Overview
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...commodityMarkets, ...cryptoMarkets].map((market) => (
          <MarketCard key={market.id} data={market} />
        ))}
      </div>


      <div className="text-center mt-6">
        <a
          href="/market-details"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md text-sm md:text-base hover:bg-blue-700 transition"
        >
          View Full Market Page →
        </a>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => setShowEmail(!showEmail)}
          className="text-sm text-blue-600 hover:underline"
        >
          {showEmail ? "Hide" : "Subscribe for Alerts"}
        </button>
        {showEmail && <div className="mt-2"><EmailSubscription /></div>}
      </div>
    </div>
  );
};

export default MarketDashboard;
