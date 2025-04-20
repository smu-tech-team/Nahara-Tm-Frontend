import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import DefaultAvatar from "/anonymous-8291223_1280.webp";
import { FaUsers, FaFlag, FaBullhorn, FaTimes } from "react-icons/fa"; // Added icons

const ActionButtons = () => {
    const [activePopup, setActivePopup] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handlePopup = async (popup) => {
        setActivePopup(popup);
        setLoading(true);
        setData([]);

        try {
            let response;
            switch (popup) {
                case "users":
                    response = await axios.get("http://localhost:8087/api/admin/users?page=0&size=10");
                    break;
                case "reportedPosts":
                    response = await axios.get("http://localhost:8087/api/admin/reported-posts?page=0&size=10");
                    break;
                case "adsRequests":
                    response = await axios.get("http://localhost:8087/api/admin/Ads-List?page=0&size=10");
                    break;
                default:
                    return;
            }
            setData(response.data.content || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setActivePopup("");
        setData([]);
    };

    const handleViewPost = (contentLink) => {
        if (contentLink.includes("/post?slug=")) {
            window.open(contentLink, "_blank");
        } else {
            alert("Invalid post link.");
        }
    };

    return (
        <div className="p-8 bg-gradient-to-r">
            <h1 className="text-3xl font-bold text-white  dark:text-gray-800 mb-6">Admin Quick Actions</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePopup("users")}
                    className="flex items-center gap-3 px-6 py-4 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    <FaUsers />
                    Check Users
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePopup("reportedPosts")}
                    className="flex items-center gap-3 px-6 py-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
                >
                    <FaFlag />
                    Today Reported Posts
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePopup("adsRequests")}
                    className="flex items-center gap-3 px-6 py-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
                >
                    <FaBullhorn />
                    Ads Requests
                </motion.button>
            </div>

            {activePopup && (
    <motion.div
        className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
    >
        <motion.div
            className="bg-gray-700 rounded-xl p-8 w-full max-w-2xl shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-3">
                <FaTimes 
                    onClick={handleClose} 
                    className="cursor-pointer text-white hover:text-red-500 transition duration-200" 
                />
                {activePopup.replace(/([A-Z])/g, " $1")}
            </h2>

            {loading ? (
                <ul className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="p-4 bg-white rounded-md shadow flex items-center">
                            <Skeleton height={20} width={`70%`} />
                            <Skeleton height={15} width={`40%`} className="ml-4" />
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <li
                                key={index}
                                className="p-4 bg-white rounded-md shadow-md text-gray-800 flex items-center gap-4 transition-transform duration-200 hover:scale-105"
                            >
                                {activePopup === "users" && (
                                    <>
                                        <img
                                            src={item.photoURL || DefaultAvatar}
                                            alt={item.userName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-purple-600">User ID: {item.userId}</p>
                                            <p className="font-bold text-purple-600">User Name: {item.userName}</p>
                                            <p className="text-sm text-gray-500">Email: {item.email}</p>
                                        </div>
                                    </>
                                )}
                                {activePopup === "reportedPosts" && (
                                    <div>
                                        <p className="font-bold text-red-600">Post ID: {item.repostedPostId}</p>
                                        <p className="text-gray-600 font-bold">Reported By: {item.userName}</p>
                                        <p className="text-sm text-gray-700">Reason: {item.reason}</p>
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleViewPost(item.contentLink);
                                            }}
                                            className="text-blue-500 underline text-sm hover:text-blue-700"
                                        >
                                            View Post
                                        </a>
                                    </div>
                                )}
                                {activePopup === "adsRequests" && (
                                    <div>
                                        <p className="font-bold text-yellow-700">From: {item.name}</p>
                                        <p className="text-sm text-gray-500">Email: {item.email}</p>
                                        <p className="text-sm text-gray-600">Message: {item.message}</p>
                                        <p className="text-sm font-medium text-green-700">Payment: {item.paymentType}</p>
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-200 font-medium">No data found.</p>
                    )}
                </ul>
            )}

            <div className="mt-6 text-right">
                <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-white text-green-500 rounded-lg shadow-md hover:bg-green-500 hover:text-white transition duration-200"
                >
                    Close
                </button>
            </div>
        </motion.div>
    </motion.div>
)}

        </div>
    );
};

export default ActionButtons;
