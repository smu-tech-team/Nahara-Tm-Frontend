import React, { useEffect, useState } from "react";
import { LineChart, Line,
   XAxis, YAxis,
    CartesianGrid,
     Tooltip, ResponsiveContainer,
      Legend } from "recharts";
import { motion } from "framer-motion"; // For animations
import useAuthStore from "../store/authStore";
import axios from "axios";
import DefaultAvatar from "../assert/anonymous-8291223_1280.webp";

// Import your modals
import WithdrawEarnings from "../components/Withdraw";
import LockEarnings from "../components/LockEarning";
import CheckEligibility from "../components/CheckEligibility";
import { toast } from "react-toastify";

const CreatorDashboard = ({ creatorId }) => {
  const user = useAuthStore.getState().user;

  const [stats, setStats] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeModal, setActiveModal] = useState(null);


  const API_BASE_URL = "http://localhost:8087/api/creator";
  const fetchCreatorData = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!creatorId || !token) {
        console.error("Missing creatorId or token!");
        return;
      }
  
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
      const [viewsRes, followersRes, postsRes] = await Promise.all([
        axios.get(`http://localhost:8087/api/creator/${creatorId}/total-views`),
        axios.get(`http://localhost:8087/api/creator/creators/${creatorId}/followers`),
        axios.get(`http://localhost:8087/api/creator/${creatorId}/total-posts`),

      ]);
  
      setTotalViews(viewsRes.data || 0);
      setFollowers(followersRes.data.count || 0);
      setTotalPosts(postsRes.data || 0);
    } catch (error) {
      console.error("Error fetching creator data:", error.response || error.message);
      toast.alert("Failed to fetch creator data. Please try again later.");
    }
  };
  
  const fetchCreatorDatas = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const statsRes = await axios.get(`${API_BASE_URL}/creators/${creatorId}/stats`);  
      setTotalViews(statsRes.data.totalViews);
      setFollowers(statsRes.data.followers.count);
      setTotalPosts(statsRes.data.totalPosts);
      
      // Update stats state
      setStats([
        {
          date: new Date().toLocaleDateString(), // Example date format
          views: statsRes.data.totalViews,
          followers: statsRes.data.followers.count,
          earnings: totalEarnings,
          posts: statsRes.data.totalPosts,
        }
      ]);
    } catch (error) {
      console.error("Error fetching creator data:", error.response || error.message);
      alert("Failed to fetch creator data. Please check your connection or try again later.");
    }
  };
  
  
  const fetchTotalEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
    
      const response = await axios.get("http://localhost:8087/api/earnings/calculate", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("Response received:", response.data);
      setTotalEarnings(response.data.totalEarnings || 0);
    } catch (error) {
      console.error("Error fetching total earnings:", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (!creatorId) {
      console.error("Creator ID is missing! Cannot fetch data.");
      return;
    }

    // Fetch creator data here
    fetchCreatorData(creatorId);
    fetchTotalEarnings();
    fetchCreatorDatas();
  }, [creatorId]);


  
  

  const blogName = user?.blogName || "Your Blog Name";
  const blogWebsite= user?.blogWebsite || "Your Blog Website";
  const username = user?.username || "Creator Info";
  const blogProfile = user?.blogProfile || DefaultAvatar;

  // Render Modal Content Dynamically
  const renderModalContent = () => {
    switch (activeModal) {
      case "withdraw":
        return <WithdrawEarnings balance={totalEarnings} onClose={() => setActiveModal(null)} />;
      case "lockEarnings":
        return <LockEarnings onClose={() => setActiveModal(null)} />;
      case "checkEligibility":
        return <CheckEligibility onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex items-center">
        <img src={blogProfile} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500" />
        <div className="ml-6">
          <h2 className="text-2xl font-bold dark:text-white text-black">{username}</h2>
          <p className="text-gray-500"><span className="font-bold text-black dark:text-white">Name:</span> {blogName}</p>
          <p className="text-gray-500"><span className="font-bold text-black dark:text-white">Website:</span> {blogWebsite}</p>

        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-xl font-bold text-blue-600">{followers}</p>
          <p className="text-sm text-gray-600">Followers</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-green-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-xl font-bold text-green-600">{totalViews}</p>
          <p className="text-sm text-gray-600">Total Views</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-xl font-bold text-yellow-600">{`$${totalEarnings.toFixed(2)}`}</p>
          <p className="text-sm text-gray-600">Earnings</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-red-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-xl font-bold text-red-600">{totalPosts}</p>
          <p className="text-sm text-gray-600">Posts</p>
        </motion.div>
      </div>

      {/* Growth Statistics Chart */}
      <div className="bg-black dark:bg-gray-500 shadow rounded-lg p-6 mt-6">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Your Growth Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
            <Line type="monotone" dataKey="followers" stroke="#82ca9d" name="Followers" />
            <Line type="monotone" dataKey="earnings" stroke="#ffc658" name="Earnings" />
            <Line type="monotone" dataKey="posts" stroke="#ff7300" name="Posts" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={() => setActiveModal("lockEarnings")}
        >
          Lock Earnings
        </button>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          onClick={() => setActiveModal("withdraw")}
        >
          Withdraw
        </button>
        <button
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700"
          onClick={() => setActiveModal("checkEligibility")}
        >
          Check Eligibility
        </button>
      </div>

      {/* Modal Rendering */}
      {activeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {renderModalContent()}
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
