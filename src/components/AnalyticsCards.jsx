import React from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AnalyticsCards = ({ users, creators, reports, ads_request, loading }) => {
    const data = [
        { label: "Users", count: users, color: "bg-blue-500" },
        { label: "Creators", count: creators, color: "bg-green-500" },
        { label: "Reported Posts", count: reports, color: "bg-red-500" },
        { label: "Ads Requests", count: ads_request, color: "bg-gray-500" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item, index) => (
                <motion.div
                    key={index}
                    className={`p-4 text-white rounded-lg shadow-md transform transition hover:scale-105 hover:shadow-lg ${item.color}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <h2 className="text-xl font-bold">
                        {loading ? <Skeleton height={25} width={50} /> : item.count}
                    </h2>
                    <p className="text-sm">
                        {loading ? <Skeleton height={15} width={80} /> : item.label}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default AnalyticsCards;
