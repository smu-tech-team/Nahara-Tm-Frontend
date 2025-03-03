import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useAuthStore from "../store/authStore";
import { Link } from "react-router-dom";
import DefaultAvatar from "../assert/icons8-avatar.gif";
import Profile from "../route/ProfileUpdate";
import axios from "axios";

const CreatorDashboard = () => {
  const user = useAuthStore.getState().user;
  const [stats, setStats] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  const API_BASE_URL = "https://your-backend-url.com/api";
  const TOTALVIEW_API_URL = "http://localhost:8087/api/creator/";
  const FOLLOWERS_API_URL = "http://localhost:8087/api/creator/";
  const TOTALEARNINGS_API_URL = "https://your-backend-url.com/api";
  const TOTALPOST_API_URL = "http://localhost:8087/api/creator/";


  useEffect(() => {
    if (!user?.id) return;
  
    const fetchAndSchedule = async () => {
      try {
        await fetchCreatorData(user.id);
      } catch (error) {
        console.error("Error fetching creator data:", error);
      }
      setTimeout(fetchAndSchedule, 604800000); // 7 days
    };
  
    fetchAndSchedule();
  
    return () => clearTimeout(fetchAndSchedule);
  }, [user?.id, followers]);  // Dependency added to update when followers change
  
  const refreshDashboard = async () => {
    if (!user?.id) return;
    try {
      await fetchCreatorData(user.id);
    } catch (error) {
      console.error("Failed to refresh dashboard:", error);
    }
  };
  
  const fetchCreatorData = async (creatorId) => {
    try {
      const [statsRes, viewsRes, followersRes, earningsRes, postsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/creators/${creatorId}/stats`),
        axios.get(`${TOTALVIEW_API_URL}/creators/${creatorId}/total-views`),
        axios.get(`${FOLLOWERS_API_URL}/creators/${creatorId}/followers` ),  // Fixed URL
        axios.get(`${TOTALEARNINGS_API_URL}/creators/${creatorId}/totalEarnings`),
        axios.get(`${TOTALPOST_API_URL}/creators/${creatorId}/total-posts`), // Fixed double slash
      ]);
  
      setStats(statsRes.data);
      setTotalViews(viewsRes.data.totalViews || 0);
      setFollowers(followersRes.data.totalFollowers || 0); // Ensure correct property name
      setTotalEarnings(earningsRes.data.totalEarnings || 0);
      setTotalPosts(postsRes.data.totalPosts || 0);
    } catch (error) {
      console.error("Error fetching creator data:", error);
    }
  };
  

  const blogName = user?.blogName || "Your Blog Name";
  const email = user?.email || "creator@example.com";
  const username = user?.userName || "Creator Name";
  const  blogWebsite = user?.blogWebsite || " Blog Website";
  const blogDescription = user?.blogDescription || "blogDescription";
  const blogProfile = user?.blogProfile || DefaultAvatar;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center dark:bg-black bg-transparent shadow-white rounded-lg shadow-lg p-6 w-full md:w-1/2">
          <img src={blogProfile} alt="Profile" className="w-32 animate-pulse h-32 rounded-full border-4 border-blue-500" />
          <h2 className="text-2xl font-semibold mt-4">{username}</h2>
          <p className="text-lg text-gray-600">{blogName}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-lg text-gray-600">{blogWebsite}</p>
          <p className="text-lg text-gray-600">{blogDescription}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-4 text-blue-500 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-lg font-semibold">{followers}</p>
              <p className="text-sm text-gray-600 font-bold">Followers</p>
            </div>
            <div className="p-4 text-red-500 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-lg font-semibold">{totalPosts}</p>
              <p className="text-sm text-gray-600  font-bold">Posts</p>
            </div>
            <div className="p-4 text-green-500 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-lg font-semibold">{totalViews}</p>
              <p className="text-sm text-gray-600  font-bold">Total Views</p>
            </div>
            <div className="p-4 text-green-500 dark:bg-gray-800 rounded-lg text-center">
              <p className="text-lg font-semibold">${totalEarnings}</p>
              <p className="text-sm text-gray-600  font-bold">Earnings</p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4 p-4 rounded-lg shadow-lg dark:bg-black bg-transparent">
          <h3 className="text-xl text-white font-semibold mb-4">Growth Statistics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" className="gap-3" dataKey="views" stroke="#8884d8" name="Views" />
              <Line type="monotone" dataKey="followers" stroke="#82ca9d" name="Followers" />
              <Line type="monotone" dataKey="earnings" stroke="#ffc658" name="Earnings" />
              <Line type="monotone" dataKey="posts" stroke="#ff7300" name="Posts" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-center space-x-4 mt-6">
          <Link to="/write">
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Publish Post</button>
          </Link>
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">Delete Post</button>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default CreatorDashboard;
