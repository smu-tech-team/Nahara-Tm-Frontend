import React, { useEffect, useState } from "react";
import axios from "axios";

const FollowButton = ({ creatorId, token }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);

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

  return (
    <button
      onClick={handleFollowToggle}
      className={`mt-4 px-6 py-2 rounded-lg font-semibold ${
        isFollowing ? "bg-red-600 text-white hover:bg-red-700" : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
      disabled={loadingFollow}
    >
      {loadingFollow ? "Processing..." : isFollowing ? "Unfollow Creator" : "Follow Creator"}
    </button>
  );
};

export default FollowButton;
