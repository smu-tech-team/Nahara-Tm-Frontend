import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { FaUserEdit, FaSignOutAlt, FaEnvelope } from "react-icons/fa";

const ProfileUpdate = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [blogWebsite, setBlogWebsite] = useState(user?.blogWebsite || "");
  const [blogDescription, setBlogDescription] = useState(user?.blogDescription || "");
  const [imagePreview, setImagePreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [emailSuccess, setEmailSuccess] = useState("");

  const handleEmailVerification = async () => {
    setEmailSuccess("");
    setError("");
    try {
      const response = await axios.post("http://localhost:8087/api/creator/send-verification", {
        email,
      });
      setEmailSuccess("Verification email sent! Check your inbox.");
      console.log("Verification Link:", response.data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data || "Failed to send verification email.");
    }
  };

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
      formData.append("email", email);
      if (selectedFile) {
        formData.append("imageFile", selectedFile);
      }

      const response = await axios.put("http://localhost:8087/api/creator/update-info", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(response.data.message);
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8087/api/creator/logout", { token }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      clearUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center min-h-screen px-4">
      <motion.div initial={{ y: -30 }} animate={{ y: 0 }} className="bg-white shadow-lg rounded-lg w-full max-w-lg p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaUserEdit className="mr-2 text-blue-500" /> Update Profile
        </h2>

        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-500 mb-2">{success}</div>}
        {emailSuccess && <div className="text-blue-500 mb-2">{emailSuccess}</div>}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block  dark:border-gray-700 text-gray-600">Blog Website</label>
            <input
              type="text"
              value={blogWebsite}
              onChange={(e) => setBlogWebsite(e.target.value)}
              className="w-full border p-2 rounded dark:border-gray-700 text-gray-600"
            />
          </div>

          <div>
            <label className="block  dark:border-gray-700 text-gray-600">Blog Description</label>
            <textarea
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              rows="3"
              className="w-full border p-2 rounded  dark:border-gray-700 text-gray-600"
            />
          </div>

          <div>
            <label className="block  dark:border-gray-700 text-gray-600">Email</label>
            <div className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow border p-2 rounded  dark:border-gray-700 text-gray-600"
              />
              <button type="button" onClick={handleEmailVerification} className="ml-2 bg-blue-500 text-white  p-2 rounded">
                Verify
              </button>
            </div>
          </div>

          <div>
            <label className="block   dark:border-gray-700 text-gray-600">Profile Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border p-2 rounded  dark:border-gray-700 text-gray-600" />
          </div>

          {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-full mt-2" />}

          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <button onClick={handleLogout} className="w-full mt-4 bg-red-500 text-white p-2 rounded flex items-center justify-center">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileUpdate;
