import React from "react";
import { formatDistanceToNow } from "date-fns";
import Image from "../assert/anonymous-8291223_1280.webp";

const Comment = ({ userImage, userName, desc, createdAt }) => {
  const isValidDate = createdAt && !isNaN(new Date(createdAt).getTime());
  const relativeTime = isValidDate
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "Invalid date";
  const exactDate = isValidDate
    ? new Date(createdAt).toLocaleString()
    : "Unknown date";

  return (
    <div className="p-4 bg-slate-50 dark:text-black rounded-xl mb-8">
      <div className="flex items-center gap-4">
        <img
          src={userImage || Image} // Fallback to anonymous image if `userImage` is falsy
          alt={`${userName}'s profile`}
          className="w-10 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = Image; // Set fallback image if the provided image fails to load
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
    </div>
  );
};

export default Comment;
