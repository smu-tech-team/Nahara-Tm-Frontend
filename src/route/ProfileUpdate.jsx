import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { FaUserEdit, FaSignOutAlt } from "react-icons/fa";

const ProfileUpdate = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const [blogWebsite, setBlogWebsite] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      setBlogWebsite(user.blogWebsite || "");
      setBlogDescription(user.blogDescription || "");
      setImagePreview(user.blogProfile || "");
    }
  }, [user, navigate]);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("blogWebsite", blogWebsite);
      formData.append("blogDescription", blogDescription);
      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const response = await axios.put(
        "http://localhost:8087/api/creator/update-info",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess(response.data.message);
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token not found");

      await axios.post(
        "http://localhost:8087/api/creator/logout",
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      clearUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4"
    >
      <motion.div
        initial={{ y: -30 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="bg-white dark:bg-gray-800 shadow-xl rounded-lg w-full max-w-2xl overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Update Profile</h2>
            <FaUserEdit className="text-3xl text-blue-500" />
          </div>

          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              role="alert"
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Blog Website Input */}
            <div>
              <label htmlFor="blogWebsite" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Blog Website
              </label>
              <input
                type="text"
                id="blogWebsite"
                value={blogWebsite}
                onChange={(e) => setBlogWebsite(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Blog Description Input */}
            <div>
              <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Blog Description
              </label>
              <textarea
                id="blogDescription"
                rows="3"
                value={blogDescription}
                onChange={(e) => setBlogDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Profile Image Input */}
            <div>
              <label htmlFor="blogProfile" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="flex justify-center mt-4">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full shadow-md border-2 border-blue-500"
                />
              </div>
            )}

            {/* Update Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </motion.button>
          </form>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="w-full mt-4 bg-red-500 text-white py-2 rounded-lg shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center gap-2"
          >
            <FaSignOutAlt />
            Logout
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileUpdate;
