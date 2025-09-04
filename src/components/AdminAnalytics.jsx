import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserFriends, FaUsersCog, FaExclamationCircle, FaBullhorn } from "react-icons/fa"; // Added icons

const AdminAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        users: 0,
        creators: 0,
        reports: 0,
        ads_request: 0,
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [usersRes, creatorsRes, reportsRes, adsRes] = await Promise.all([
                    axios.get("https://nahara-production.up.railway.app/api/admin/users-count"),
                    axios.get("https://nahara-production.up.railway.app/api/admin/creators-count"),
                    axios.get("https://nahara-production.up.railway.app/api/admin/reported-posts-count"),
                    axios.get("https://nahara-production.up.railway.app/api/admin/ads-count"),
                ]);

                setAnalytics({
                    users: usersRes.data,
                    creators: creatorsRes.data,
                    reports: reportsRes.data,
                    ads_request: adsRes.data,
                });
            } catch (err) {
                console.error("Failed to fetch analytics counts:", err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-extrabold text-white  dark:text-gray-800 mb-6">Admin Analytics Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-4 text-center text-white  dark:text-gray-800 font-medium">
                        Loading analytics...
                    </div>
                ) : (
                    <>
                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-4 hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaUserFriends className="text-blue-500 text-4xl" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-700">Total Users</h2>
                                <p className="text-2xl text-gray-800 font-semibold">{analytics.users}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-4 hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaUsersCog className="text-green-500 text-4xl" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-700">Creators</h2>
                                <p className="text-2xl text-gray-800 font-semibold">{analytics.creators}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-4 hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaExclamationCircle className="text-red-500 text-4xl" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-700">Reports</h2>
                                <p className="text-2xl text-gray-800 font-semibold">{analytics.reports}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="p-6 bg-white rounded-lg shadow-lg flex items-center gap-4 hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaBullhorn className="text-yellow-500 text-4xl" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-700">Ads Requests</h2>
                                <p className="text-2xl text-gray-800 font-semibold">{analytics.ads_request}</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminAnalytics;
