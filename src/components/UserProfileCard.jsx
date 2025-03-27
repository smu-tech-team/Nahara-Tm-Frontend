import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import DefaultAvatar from "../assert/anonymous-8291223_1280.webp";
import axios from "axios";

const UserProfileCard = () => {
  const [userInfo, setUserInfo] = useState({
    username: "Loading...",
    email: "Loading...",
    img: DefaultAvatar,
    id: "Loading...",
    roles: [],
  });
  const [userRole, setUserRole] = useState("");
  const [savedPosts, setSavedPosts] = useState([]);
  const [followedCreators, setFollowedCreators] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!token) {
      console.warn("No token found. Redirecting to login...");
      navigate("/login");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userId;
    setUserRole(decodedToken.roles?.[0]?.name || "USER");

    try {
      const baseURL = "http://localhost:8087/api/user";
      const [userRes, savedPostsRes, followedCreatorsRes] = await Promise.all([
        axios.get(`${baseURL}/getUser/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${baseURL}/saved`, { params: { userId }, headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${baseURL}/followedCreators`, { params: { userId }, headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setUserInfo({
        username: userRes.data.username || "N/A",
        email: userRes.data.email || "N/A",
        img: userRes.data.photoURL || DefaultAvatar,
        id: userRes.data.userId || "N/A",
        roles: userRes.data.roles || [],
      });

      setSavedPosts(savedPostsRes.data?.posts || []);
      setFollowedCreators(followedCreatorsRes.data?.creators || []);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  const handleUnfollow = async (creatorId) => {
    try {
      await axios.post(
        `http://localhost:8087/api/user/unfollow`,
        { creatorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFollowedCreators(followedCreators.filter((creator) => creator.id !== creatorId));
    } catch (error) {
      console.error("Error unfollowing creator:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {/* Profile Info */}
        <div className="flex items-center gap-6 border-b pb-4">
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 to-green-400 p-1">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <img src={userInfo.img} alt="Profile" className="w-36 h-36 rounded-full object-cover hover:scale-105 transition duration-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">Username: {userInfo.username}</h2>
            <p className="text-sm text-gray-500">Email: {userInfo.email}</p>
            <span className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${userRole === "ADMIN" ? "bg-red-100 text-red-600" : userRole === "CREATOR" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
              {userRole}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between mt-4 text-center">
          <div>
            <h4 className="text-lg font-bold bg-white text-gray-900 p-2 rounded">{savedPosts.length}</h4>
            <p className="text-sm text-gray-500">Saved Posts</p>
          </div>
          <div>
            <h4 className="text-lg font-bold bg-white text-gray-900 p-2 rounded">{followedCreators.length}</h4>
            <p className="text-sm text-gray-500">Followed Creators</p>
          </div>
        </div>

        {/* Saved Posts & Followed Creators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Saved Posts */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Saved Posts</h3>
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {savedPosts.length > 0 ? (
                savedPosts.map((post) => (
                  <div key={post.id} className="py-2 px-4 bg-gray-100 rounded-md shadow-sm mb-2 flex justify-between items-center">
                    <span className="text-gray-700">{post.title || "Untitled Post"}</span>
                    <button className="text-blue-500 hover:underline" onClick={() => navigate(`/post/${post.id}`)}>Read</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No saved posts yet.</p>
              )}
            </div>
          </div>

          {/* Followed Creators */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Followed Creators</h3>
            <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {followedCreators.length > 0 ? (
                followedCreators.map((creator) => (
                  <div key={creator.id} className="py-2 px-4 bg-gray-100 rounded-md shadow-sm mb-2 flex justify-between items-center">
                    <span className="text-gray-700">{creator.name || "Unnamed Creator"}</span>
                    <button className="text-red-500 hover:underline" onClick={() => handleUnfollow(creator.id)}>Unfollow</button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No followed creators yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Manage Profile Button */}
        <button onClick={() => navigate(userRole === "CREATOR" ? "/creator-profile" : userRole === "ADMIN" ? "/admin-profile" : "/profile")} className="mt-6 py-2 px-6 w-full bg-gradient-to-r from-blue-600 to-green-400 text-white rounded-full hover:scale-105 transition duration-300">
          Manage Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
