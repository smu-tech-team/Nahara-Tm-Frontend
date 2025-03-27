import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const ReportPost = () => {
  const [report, setReport] = useState("");
  const [contentLink, setContentLink] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure user acknowledged guidelines
    if (!acknowledged) {
      alert("You must acknowledge the guidelines before submitting.");
      return;
    }

    // Start loading
    setLoading(true);

    try {
      const token = localStorage.getItem("token"); // Retrieve token
      if (!token) {
        alert("You must be logged in to submit a report.");
        setLoading(false);
        return;
      }

      const data = { contentLink, report }; // Payload for API call

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Proper string interpolation
      };

      // Make the API request
      const response = await axios.post(
        "http://localhost:8087/api/user/submit",
        data,
        { headers }
      );

      // Handle success response
      if (response.status === 200) {
        toast.alert("Report submitted successfully!");
      } else {
        alert("Failed to submit the report.");
      }
    } catch (error) {
      // Handle errors
      console.error("Error submitting report:", error);
      alert("An error occurred. Please try again.");
    } finally {
      // Reset form and stop loading
      setLoading(false);
      setReport("");
      setContentLink("");
      setAcknowledged(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-3xl mx-auto bg-gray-100 dark:bg-gray-900 mt-6 mb-6 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Report Post</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        If you find any content that violates our guidelines, please report it below.
      </p>
      <p className="mt-2 text-gray-600 dark:text-gray-300">
        Please provide a link to the content if possible.
      </p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="block text-gray-700 dark:text-gray-300">Content Link:</label>
        <input
          type="url"
          className="w-full p-2 border border-gray-300 text-gray-800 dark:border-gray-300 rounded mt-2"
          value={contentLink}
          onChange={(e) => setContentLink(e.target.value)}
          required
        />
        <label className="block mt-4 text-gray-700 dark:text-gray-300">Reason for reporting:</label>
        <textarea
          className="w-full p-2 border border-gray-300  text-gray-800 dark:border-gray-300  rounded h-32 mt-2"
          value={report}
          onChange={(e) => setReport(e.target.value)}
          required
        ></textarea>
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="acknowledge" className="text-gray-600 dark:text-gray-300">
            I acknowledge that the content violates the community guidelines.
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex justify-center items-center"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </motion.div>
  );
};

export default ReportPost;
