import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios"; 
import { formatDistanceToNow } from "date-fns";
import Image from "/anonymous-8291223_1280.webp"; 

const Comment = ({ _id, userImage, userName, desc, createdAt, onDelete, postId, comments }) => {
  const [userId, setUserId] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const comment = comments.find((comment) => comment?._id === _id);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token is missing!");
      setUserId("Unknown");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const loggedInUser = decoded?.userId || "Unknown";
      setUserId(loggedInUser);

      // ✅ Compare userId with the comment creator to check ownership
      if (comment && comment.creatorId === loggedInUser) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
      setUserId("Unknown");
    }
  }, [_id]);

  const handleDelete = async () => {
    if (!comment || !comment._id) {
      console.error("Comment ID is undefined!");
      return;
    }
  
    try {
      console.log(`Deleting comment with ID: ${comment._id} from post ID: ${postId}`);
      const response = await axios.delete(`http://localhost:8087/delete-comment/${comment._id}`);
      console.log("Comment deleted successfully!", response.data);
      onDelete(comment._id); 
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data || error.message);
      alert("An error occurred while deleting the comment.");
    }
  };
  
  const isValidDate = createdAt && !isNaN(new Date(createdAt).getTime());
  const relativeTime = isValidDate
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Invalid date";
  const exactDate = isValidDate ? new Date(createdAt).toLocaleString() : "Unknown date";

  return (
    <div className="p-4 bg-slate-50 dark:text-black rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <img
          src={userImage || Image} 
          alt={`${userName || "Anonymous"}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = Image; 
          }}
        />
        <div className="flex flex-col">
          <span className="font-medium text-black">{userName || "Anonymous"}</span>
          <span className="text-sm text-gray-500" title={isValidDate ? exactDate : "Invalid date"}>
            {relativeTime}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-black">{desc || "No description provided"}</p>
      </div>
      {isOwner && (
        <button className="mt-2 text-red-600 hover:underline" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
};

export default Comment;
