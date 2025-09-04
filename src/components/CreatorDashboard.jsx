import React, { useEffect, useState } from "react";
import { LineChart, Line,
   XAxis, YAxis,
    CartesianGrid,
     Tooltip, ResponsiveContainer,
      Legend } from "recharts";
import { motion } from "framer-motion"; 
import useAuthStore from "../store/authStore";
import axios from "axios";
import DefaultAvatar from "/anonymous-8291223_1280.webp";
import AddYourLiveNews from "../components/AddYourLiveNews";
import WithdrawEarnings from "../components/Withdraw";
import LockEarnings from "../components/LockEarning";
import CheckEligibility from "../components/CheckEligibility";
import { toast } from "react-toastify";
import CreatorMessagesDropdown from "./CreatorMessagesDropdown";
import Sidebar from "./Sidebar"; 
import AdSpace from "./AdSpace";

const CreatorDashboard = ({ creatorId }) => {
  const user = useAuthStore.getState().user;

  const [stats, setStats] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [activeModal, setActiveModal] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const API_BASE_URL = "https://nahara-production.up.railway.app/api/creator";


  const fetchCreatorData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!creatorId || !token) {
        console.error("Missing creatorId or token!");
        return;
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const [viewsRes, followersRes, postsRes] = await Promise.all([
        axios.get(`https://nahara-production.up.railway.app/api/creator/${creatorId}/total-views`),
        axios.get(`https://nahara-production.up.railway.app/api/creator/creators/${creatorId}/followers`),
        axios.get(`https://nahara-production.up.railway.app/api/creator/${creatorId}/total-posts`),

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
            setStats([
        {
          date: new Date().toLocaleDateString(), 
          views: statsRes.data.totalViews,
          followers: statsRes.data.followers.count,
          earnings: totalEarnings,
          posts: statsRes.data.totalPosts,
        }
      ]);
    } catch (error) {
      console.error("Error fetching creator data:", error.response || error.message);
      toast.alert("Failed to fetch creator data. Please check your connection or try again later.");
    }
  };
  const fetchTotalEarnings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await axios.get("https://nahara-production.up.railway.app/api/earnings/calculate", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Response received:", response.data);
      setTotalEarnings(response.data.totalEarnings || 0);
    } catch (error) {
      console.error("Error fetching total earnings:", error.response ? error.response.data : error.message);
    }
  };

    const fetchCreatorInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!creatorId || !token) {
      console.error("Missing creatorId or token!");
      return;
    }
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(`${API_BASE_URL}/creators/${creatorId}`);
    
    setIsVerified(response.data.isVerified || false);
  } catch (error) {
    console.error("Error fetching creator data:", error.response || error.message);
  }
};

  useEffect(() => {
    if (!creatorId) {
      console.error("Creator ID is missing! Cannot fetch data.");
      return;
    }
    fetchCreatorData(creatorId);
    fetchTotalEarnings();
    fetchCreatorDatas();
  }, [creatorId]);
  const blogName = user?.blogName || "Your Blog Name";
  const blogWebsite= user?.blogWebsite || "Your Blog Website";
  const username = user?.username || "Creator Info";
  const blogProfile = user?.blogProfile || DefaultAvatar;
  const renderModalContent = () => {
    switch (activeModal) {
      case "withdraw":
        return <WithdrawEarnings balance={totalEarnings} onClose={() => setActiveModal(null)} />;
      case "lockEarnings":
        return <LockEarnings onClose={() => setActiveModal(null)} />;
      case "checkEligibility":
        return <CheckEligibility onClose={() => setActiveModal(null)} />;
      case "addLiveNews":
        return <AddYourLiveNews onClose={() => setActiveModal(null)} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-6 flex items-center">
        <img src={blogProfile} alt="Profile" className="w-24 h-24 rounded-full border-4 border-blue-500" />
        <div className="ml-6">
          <h2 className="text-2xl font-bold dark:text-white text-black">{username}</h2>
          <p className="text-gray-500"><span className="font-bold text-black dark:text-white">Name:</span> {blogName}</p>
          <p className="text-gray-500"><span className="font-bold text-black dark:text-white">Website:</span> {blogWebsite}</p>

        </div>
        <div className="ml-auto">
        <CreatorMessagesDropdown creatorId={creatorId} />
      </div>
      </div>

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
      <div className="bg-black dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
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
      <AdSpace />
      <div className="flex ">
      <Sidebar setActiveModal={setActiveModal} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
      {activeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {renderModalContent()}
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;
