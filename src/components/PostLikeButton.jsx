import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const PostLikeButton = ({ postId, initialLikes = 0, initiallyLiked = false }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem("token")?.trim();
  
  if (!token) {
    console.warn("No token found in localStorage.");
    return;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded); 
    setCurrentUser(decoded); 
  } catch (error) {
    console.error("Invalid Token Format", error);
    alert("Session expired. Please log in again.");
    localStorage.removeItem("token");
  }
}, []);


 const handleLike = async (e) => {
  e.stopPropagation();

  if (!currentUser) {
    alert("You must be logged in to like this post.");
    return;
  }

  const token = localStorage.getItem("token")?.trim();
  if (!token) {
    console.error("Missing authorization token");
    alert("You need to log in first.");
    return;
  }

  try {
    console.log(`Sending request to like post ${postId} with token:`, token);

    const res = await fetch(`http://localhost:8087/api/post/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`API Response Status: ${res.status}`);

    if (!res.ok) {
      console.error(`Failed to like post: ${res.statusText}`);
      alert("Something went wrong. Please try again.");
      return;
    }

    const data = await res.json();
    console.log("Response data:", data);

    setLikes(data.likes);
    setLiked(data.liked);
  } catch (err) {
    console.error("Error liking post:", err);
  }
};

  return (
    <div className="flex items-center gap-4 text-gray-400 dark:text-white">
      <button
        onClick={handleLike}
        className="flex items-center gap-1 hover:text-red-500 transition"
      >
        <FaHeart className={liked ? "text-red-800" : ""} />
        <span>{likes}</span>
      </button>
    </div>
  );
};

export default PostLikeButton;
