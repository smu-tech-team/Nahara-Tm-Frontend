import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // For decoding JWT
import DefaultAvatar from "../assert/anonymous-8291223_1280.webp"; // Adjust the path as needed
import axios from "axios"; // Ensure axios is installed

const UserProfileCard = () => {
  const [userInfo, setUserInfo] = useState({
    username: "Loading...",
    email: "Loading...",
    img: DefaultAvatar,
    id: "Loading...",
    roles: [],
    createdAt: "Loading...",
    updatedAt: "Loading...",
  });
  const [userRole, setUserRole] = useState("");
  const [savedPosts, setSavedPosts] = useState([]); // List of saved posts
  const [followedCreators, setFollowedCreators] = useState([]); // List of followed creators
  const navigate = useNavigate();

  // Fetch saved posts
  const fetchSavedPosts = async (userId, page = 0, size = 10) => {
    try {
      const token = localStorage.getItem("token"); // Ensure token is available
      const savedPostsResponse = await axios.get(`http://localhost:8087/api/user/saved`, {
        params: { userId, page, size },
        headers: { 
          Authorization: `Bearer ${token}`
         },
      });

      const newPosts = savedPostsResponse.data.posts || [];
      setSavedPosts((prevPosts) => [...prevPosts, ...newPosts]);
      console.log(newPosts)
    } catch (error) {
      console.error("Error fetching saved posts:", error.response?.data || error.message);
    }
  };

  const fetchFollowedCreators = async (userId, page = 0, size = 10) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view this content.");
        return;
      }
  
      // Use a hardcoded baseURL or the appropriate direct URL.
      const baseURL = "http://localhost:8087";
      const response = await axios.get(`${baseURL}/api/user/followedCreators`, {
        params: { userId, page, size },
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const newCreators = response.data.creators || [];
      if (newCreators.length === 0) {
        console.log("No more creators to load.");
        return;
      }
  
      // Update followed creators state while avoiding duplicates.
      setFollowedCreators((prevCreators) => {
        const uniqueCreators = new Map();
        [...prevCreators, ...newCreators].forEach((creator) =>
          uniqueCreators.set(creator.id, creator)
        );
        return Array.from(uniqueCreators.values());
      });
    } catch (error) {
      // Handle and log any errors.
      if (error.response && error.response.status === 500) {
        console.error("Server error:", error.response.data);
        alert("Something went wrong on our end. Please try again later.");
      } else {
        console.error("Error fetching followed creators:", error.message);
      }
    }
  };
  
  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      if (!token) {
        console.warn("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }

      // Decode JWT for user details
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      const role = decodedToken.roles?.[0]?.name || "USER"; // Extract user role
      setUserRole(role);

      // Fetch user profile
      const userResponse = await axios.get(`http://localhost:8087/api/user/getUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserInfo({
        username: userResponse.data.username || "N/A",
        email: userResponse.data.email || "N/A",
        img: userResponse.data.photoURL || DefaultAvatar,
        id: userResponse.data.userId || "N/A",
        roles: userResponse.data.roles || [],
        createdAt: userResponse.data.createdAt || "N/A",
        updatedAt: userResponse.data.updatedAt || "N/A",
      });

      // Fetch additional data
      fetchSavedPosts(userId, 0, 10); // Initial fetch of saved posts
      fetchFollowedCreators(userId); // Fetch followed creators
    } catch (error) {
      console.error("Error fetching user profile:", error.response?.data || error.message);
    }
  };

  // Navigate to profile management page
  const handleProfileClick = () => {
    if (userRole === "CREATOR") {
      navigate("/creator-profile");
    } else if (userRole === "ADMIN") {
      navigate("/admin-profile");
    } else {
      navigate("/profile");
    }
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        {/* Top Section: Avatar and User Info */}
        <div className="flex items-center gap-6 border-b pb-4">
          {/* Avatar */}
          <div className="relative w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 to-green-400 p-1">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <img
                src={userInfo.img}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover hover:scale-105 transition duration-300"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">Username : {userInfo.username}</h2>
            <p className="text-sm text-gray-500">Email : {userInfo.email}</p>
            <p className="text-sm text-gray-400">User ID: {userInfo.id}</p>

            {/* User Role Badge */}
            <span
              className={`mt-2 px-3 py-1 text-xs  font-semibold rounded-full 
                ${userRole === "ADMIN" ? "bg-red-100 text-red-600" : ""}
                ${userRole === "CREATOR" ? "bg-green-100 text-green-600" : ""}
                ${userRole === "USER" ? "bg-blue-100  items-center text-blue-600" : ""}
              `}
            >
              {userRole}
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex justify-between mt-4 text-center">
  <div>
    <h4 className="text-lg font-bold bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 p-2 rounded">
      {savedPosts.length}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400">Saved Posts</p>
  </div>
  <div>
    <h4 className="text-lg font-bold bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 p-2 rounded">
      {followedCreators.length}
    </h4>
    <p className="text-sm text-gray-500 dark:text-gray-400">Followed Creators</p>
  </div>
</div>

        {/* Saved Posts and Followed Creators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
  {/* Saved Posts */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Saved Posts</h3>
    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
      {savedPosts.length > 0 ? (
        savedPosts.map((post) => (
          <div
            key={post.id}
            className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm mb-2 flex justify-between items-center"
          >
            <span className="text-gray-700 dark:text-gray-300">{post.title || "Untitled Post"}</span>
            <button className="text-blue-500 dark:text-blue-400 hover:underline">View</button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No saved posts yet.</p>
      )}
    </div>
  </div>

  {/* Followed Creators */}
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Followed Creators</h3>
    <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
      {followedCreators.length > 0 ? (
        followedCreators.map((creator) => (
          <div
            key={creator.id}
            className="py-2 px-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm mb-2 flex justify-between items-center"
          >
            <span className="text-gray-700 dark:text-gray-300">{creator.name || "Unnamed Creator"}</span>
            <button className="text-blue-500 dark:text-blue-400 hover:underline">Follow</button>
          </div>
        ))
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No followed creators yet.</p>
      )}
    </div>
  </div>
</div>

        {/* User Metadata */}

        {/* Manage Profile Button */}
        <button
          onClick={handleProfileClick}
          className="mt-6 py-2 px-6 w-full bg-gradient-to-r from-blue-600 to-green-400 text-white rounded-full hover:scale-105 transform transition duration-300"
        >
          Manage Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfileCard;
