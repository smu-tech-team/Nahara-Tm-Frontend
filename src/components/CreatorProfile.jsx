import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const CreatorProfile = () => {
  const { creatorId } = useParams(); // Get creator ID from URL
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // Follow state
  const [loadingFollow, setLoadingFollow] = useState(false); // Follow button loading state
  const token = localStorage.getItem("token");
  const [showFollowers, setShowFollowers] = useState(false); // State to toggle dropdown
 const [followers, setFollowers] = useState([]);
 const [loadingFollowers, setLoadingFollowers] = useState(false);

 // Fetch creator data on component mount
 useEffect(() => {
  const fetchCreatorData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8087/api/creator/creator/${creatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCreator(response.data);
    } catch (error) {
      console.error("Error fetching creator data:", error.response?.data || error.message);
    } finally {
      setLoading(false); // Stop loading after fetch attempt
    }
  };

  fetchCreatorData();
}, [creatorId, token]);

// Fetch follow status
useEffect(() => {
  const fetchFollowStatus = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8087/api/creator/follow-status/${creatorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsFollowing(response.data.isFollowing);
      localStorage.setItem(`followStatus_${creatorId}`, JSON.stringify(response.data.isFollowing));
    } catch (error) {
      console.error("Error fetching follow status:", error.response?.data || error.message);
    }
  };

  if (token) {
    const storedStatus = localStorage.getItem(`followStatus_${creatorId}`);
    if (storedStatus !== null) {
      setIsFollowing(JSON.parse(storedStatus));
    } else {
      fetchFollowStatus();
    }
  }
}, [creatorId, token]);

// Toggle Follow/Unfollow Creator
const handleFollowToggle = async () => {
  try {
    setLoadingFollow(true);
    const endpoint = isFollowing
      ? `http://localhost:8087/api/creator/unfollow/${creatorId}`
      : `http://localhost:8087/api/creator/follow/${creatorId}`;

    if (isFollowing) {
      await axios.delete(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.post(endpoint, {}, { headers: { Authorization: `Bearer ${token}` } });
    }

    const newStatus = !isFollowing;
    setIsFollowing(newStatus);
    localStorage.setItem(`followStatus_${creatorId}`, JSON.stringify(newStatus));
  } catch (error) {
    console.error("Error toggling follow status:", error.response?.data || error.message);
  } finally {
    setLoadingFollow(false);
  }
};

// Fetch Followers List
const handleToggleFollowers = async () => {
  if (!showFollowers) {
    setLoadingFollowers(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:8087/api/creator/api/creator/${creatorId}/get-creator-followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        throw new Error("Followers data not found");
      }

      setFollowers(response.data.followers || []);
    } catch (error) {
      console.error("Error fetching followers:", error);
      alert("Unable to load followers. Please try again later.");
      setFollowers([]); // Set to empty array in case of error
    } finally {
      setLoadingFollowers(false); // Stop loading
    }
  }
  setShowFollowers(!showFollowers); // Toggle visibility
};


// Handle closing dropdown when clicking outside
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (showFollowers && !event.target.closest(".followers-dropdown")) {
      setShowFollowers(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);
  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, [showFollowers]);

// Render loading state
if (loading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}

// Render when creator is not found
if (!creator) {
  return <div className="flex justify-center items-center h-screen">Creator not found.</div>;
}
  
  
  return (
    <div className="max-w-7xl mx-auto p-20 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-4">
        <div className="flex-shrink-0">
          <img
            src={creator.image || "https://via.placeholder.com/150"}
            alt={creator.name}
            className="w-40 h-40 rounded-full border-4 border-blue-500 object-cover"
          />
        </div>

        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-3xl font-bold">{creator.name}</h1>
          <p className="mt-2 text-sm text-gray-500">{creator.bio}</p>
          {creator.website && (
            <a
              href={creator.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-500 underline"
            >
              {creator.website}
            </a>
          )}

          {token && (
            <button
              onClick={handleFollowToggle}
              className={`mt-4 px-6 py-2 rounded-lg font-semibold ${
                isFollowing ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              disabled={loadingFollow}
            >
              {loadingFollow ? "Processing..." : isFollowing ? "Unfollow Creator" : "Follow Creator"}
            </button>
          )}

          <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{creator.postsCount || 0}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
            <div className="flex flex-col items-center">
                {/* Followers Count */}
                <span className="text-xl font-bold">{creator.followersCount || 0}</span>
                <button
                  className="text-sm text-blue-500 underline cursor-pointer"
                  onClick={handleToggleFollowers}
                >
                  Followers
                </button>

               {/* Dropdown */}
              {showFollowers && (
                <div className="mt-2 bg-white shadow-lg rounded-lg p-4 w-60 followers-dropdown">
                  <button
                    className="text-sm text-red-500 underline cursor-pointer mb-2"
                    onClick={() => setShowFollowers(false)}
                  >
                    Close
                  </button>
                  {loadingFollowers ? (
                    <p className="text-gray-500">Loading followers...</p>
                  ) : (
                    <ul>
                      {followers.length > 0 ? (
                        followers.map((follower) => (
                          <li
                            key={follower.id}
                            className="flex items-center gap-4 border-b border-gray-200 pb-2 mb-2"
                          >
                            <img
                              src={follower.image || "https://via.placeholder.com/40"}
                              alt={follower.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-gray-800 font-medium">{follower.name}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-500">No followers found.</li>
                      )}
                    </ul>
                  )}
                </div>
                  )}
            </div>


            <div className="flex flex-col items-center">
              <span className="text-xl font-bold">{creator.likesCount || 0}</span>
              <span className="text-sm text-gray-500">Likes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Posts by: <span className="font-thin bg-gray-700 text-white border hover:bg-green-700 rounded-r-lg">{creator.name}</span> </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creator.posts?.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <img
                src={post.image || "https://via.placeholder.com/300"}
                alt={post.title}
                className="w-full h-40 rounded-lg object-cover"
              />
              <h3 className="text-gray-500 mt-4">{post.views} Views</h3>
              <h3 className="text-lg font-bold mt-4">{post.title}</h3>
              <h3 className="text-gray-500 mt-4">
              {new Date(post.createdAt).toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500 mt-2">{post.summary}</p>
              <Link to={`/${post.slug}`} className="text-xl font-bold hover:text-blue-400 transition">
                Read More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
