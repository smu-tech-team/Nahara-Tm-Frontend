import { useState } from "react";
import Comment from "./Comment";

const Comments = () => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!comment.trim()) {
      setError("Please enter a comment.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setComment("");
      alert("Comment sent!"); // Replace with actual send logic
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-8 lg:w-3/5">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <div className="flex flex-col gap-2 w-full">
        <textarea
          placeholder="Write a comment...."
          className="w-full p-4 rounded-xl text-black border border-gray-300 focus:outline-none"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          className={`px-4 py-3 text-white font-medium rounded-xl ${loading ? "bg-gray-400" : "bg-blue-800"}`}
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
      <Comment />
    </div>
  );
};

export default Comments;
