import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import axios from "axios"; // Import axios
import { formatDistanceToNow } from "date-fns";
import Image from "../assert/anonymous-8291223_1280.webp"; // Default fallback image

const Comment = ({ userImage, userName, desc, createdAt, _id, onDelete }) => {
  const [userId, setUserId] = useState(null);

  // Fetch the token from localStorage and decode it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing!");
      setUserId("Unknown");
      return;
    }

    try {
      const decoded = jwtDecode(token); // Decode the token
      setUserId(decoded?.userId || "Unknown"); // Extract and set the user ID
    } catch (error) {
      console.error("Failed to decode token:", error);
      setUserId("Unknown"); // Fallback in case of decoding errors
    }
  }, []);

  // Handle the comment deletion action
  const handleDelete = async () => {
    const postId = "somePostId"; // Define postId here or pass it as a prop
    if (!userId) {
      console.error("User ID is missing or not decoded properly!");
      return;
    }
    if (!_id || !postId) {
      console.error("Comment ID or Post ID is undefined or null!");
      return;
    }
  
    console.log(`User ${userId} is attempting to delete comment with ID: ${_id} from post ID: ${postId}`);
  
    try {
      await axios.delete(`http://localhost:8087/posts/${postId}/comments/${_id}`);
      console.log("Comment deleted successfully!");
      onDelete(_id); // Update parent state to remove comment from the list
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      alert("An error occurred while deleting the comment.");
    }
  };
  
  // Calculate relative and exact time for the comment
  const isValidDate = createdAt && !isNaN(new Date(createdAt).getTime());
  const relativeTime = isValidDate
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Invalid date";
  const exactDate = isValidDate ? new Date(createdAt).toLocaleString() : "Unknown date";

  return (
    <div className="p-4 bg-slate-50 dark:text-black rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <img
          src={userImage || Image} // Use the user's image, fallback if unavailable
          alt={`${userName || "Anonymous"}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite fallback loops
            e.target.src = Image; // Set fallback image if the provided image fails to load
          }}
        />
        <div className="flex flex-col">
          <span className="font-medium text-black">{userName || "Anonymous"}</span>
          <span
            className="text-sm text-gray-500"
            title={isValidDate ? exactDate : "Invalid date"}
          >
            {relativeTime}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-black">{desc || "No description provided"}</p>
      </div>
      <button
        className="mt-2 text-red-600 hover:underline"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default Comment;
