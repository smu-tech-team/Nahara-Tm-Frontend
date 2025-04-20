import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const AdminMessageForm = () => {
  const { creatorId } = useParams(); // Get creatorId dynamically
  const [postTitle, setPostTitle] = useState("");
  const [content, setContent] = useState("");
  const [messageType, setMessageType] = useState("ELIGIBLE_TO_EARN");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post("http://localhost:8087/api/creator/messages/admin/send", {
        creatorId, // Pass creatorId dynamically
        postTitle,
        content,
        type: messageType,
      });

      setSuccess(true);

      // Reset the form fields
      setPostTitle("");
      setContent("");
      setMessageType("ELIGIBLE_TO_EARN");
    } catch (err) {
      setError("Failed to send the message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg mt-5 mb-5 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Send Message to Creator
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && (
        <div className="text-green-500 mb-4">Message sent successfully!</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="postTitle" className="block text-gray-700">
            Post Title
          </label>
          <input
            type="text"
            id="postTitle"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            className="w-full mt-2 px-4 py-2 border text-gray-800 border-gray-300 rounded-lg"
            placeholder="Enter Post Title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-2 px-4 py-2 border text-gray-800 border-gray-300 rounded-lg"
            placeholder="Enter message content"
            rows="4"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="messageType" className="block text-gray-700">
            Message Type
          </label>
          <select
            id="messageType"
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full mt-2 px-4 py-2 border text-gray-800 border-gray-300 rounded-lg"
            required
          >
            <option value="ELIGIBLE_TO_EARN">Eligible To Earn</option>
            <option value="VIOLATION">Violation</option>
            <option value="CONGRATULATION">Congratulation</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Information</option>
            <option value="REMINDER">Reminder</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Message"}
          <FaPaperPlane className="ml-2" />
        </button>
      </form>
    </div>
  );
};

export default AdminMessageForm;
