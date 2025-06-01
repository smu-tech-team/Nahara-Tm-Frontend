import React from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MarketCard = ({ data }) => {
  const chartData = data?.sparkline_in_7d?.price?.map((price, i) => ({
    index: i,
    price: Number(price.toFixed(2)),
  })) || [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all p-4 sm:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-white">
            {data.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {data.symbol}
          </p>
        </div>
        <img
          src={data.image}
          alt={data.name}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full border dark:border-gray-700"
        />
      </div>

      {/* Chart */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={chartData}>
            <XAxis dataKey="index" hide />
            <YAxis domain={["auto", "auto"]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "none",
                color: "#fff",
                fontSize: "0.75rem",
                borderRadius: "6px",
              }}
              formatter={(value) => [`$${value}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Price Display */}
      <div className="mt-4 text-sm sm:text-base text-gray-800 dark:text-gray-200">
        <span className="font-medium">Current Price:</span>{" "}
        ${data.current_price?.toLocaleString()}
      </div>
    </div>
  );
};

export default MarketCard;
