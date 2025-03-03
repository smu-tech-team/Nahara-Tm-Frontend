import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";

const ProfileUpdate = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();

  const [blogWebsite, setBlogWebsite] = useState("");
  const [blogDescription, setBlogDescription] = useState("");
  const [blogProfile, setBlogProfile] = useState("");
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
      setBlogProfile(user.blogProfile || "");
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

  // Use setBlogProfile to update the state when needed, e.g., after a successful upload
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
        formData.append("file", selectedFile); // Make sure this matches what backend expects
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
        setBlogProfile(response.data.user.blogProfile); // Update blogProfile with the new profile URL
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token not found");
      }

      await axios.post(
        "http://localhost:8087/api/creator/logout",
        { token },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setError(error.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center min-h-screen bg-transparent  "
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-transparent shadow-blue-300 dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-300 dark:text-white">
          Update Profile
        </h2>

        {error && <motion.p className="text-red-500 text-center mb-4">{error}</motion.p>}
        {success && <motion.p className="text-green-500 text-center mb-4">{success}</motion.p>}

        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label htmlFor="blogWebsite" className="block text-gray-300 dark:text-gray-300">
              Blog Website:
            </label>
            <input
              type="text"
              id="blogWebsite"
              value={blogWebsite}
              onChange={(e) => setBlogWebsite(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="blogDescription" className="block text-gray-300 dark:text-gray-300">
              Blog Description:
            </label>
            <textarea
              id="blogDescription"
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="blogProfile" className="block text-gray-300 dark:text-gray-300">
              Profile Image:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-300"
            />
          </div>

          {imagePreview && (
            <div className="mb-4 flex justify-center">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
{/* 
          {blogProfile && (
            <div className="mb-4 flex justify-center">
              <img
                src={blogProfile}
                alt="Profile"
                className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600"
              />
            </div>
          )} */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </motion.button>
        </form>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 mt-4 rounded-lg hover:bg-red-600"
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileUpdate;
