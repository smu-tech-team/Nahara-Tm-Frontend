import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuthStore from "../store/authStore";
import { motion } from "framer-motion";
import { FaUserEdit, FaSignOutAlt, FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpPage from "../components/OtpPage";

const ProfileUpdate = () => {
  const { user, setUser, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [blogWebsite, setBlogWebsite] = useState(user?.blogWebsite || "");
  const [blogDescription, setBlogDescription] = useState(user?.blogDescription || "");
  const [imagePreview, setImagePreview] = useState(user?.imageUrl || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [otp, setOtp] = useState("");

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
      toast.success("Profile updated successfully!");
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      toast.error("Profile update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8087/api/creator/logout",
        { token },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearUser();
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed. Please try again.");
      toast.error("Logout failed.");
    }
  };

  if (otpMode) {
    return (
      <OtpPage
        otp={otp}
        setOtp={setOtp}
        email={email}
        setOtpMode={setOtpMode}
        setUser={setUser}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-100 to-purple-200">
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="md:w-1/2 w-full h-96 md:h-auto relative"
      >
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?fit=crop&w=1050&q=80"
          alt="Inspiration Background"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6 rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Elevate Your Creator Profile
          </h1>
          <p className="text-white mt-4 text-sm md:text-base max-w-md">
            Stand out, be remembered. Keep your brand as fresh as your content.
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-t-3xl md:rounded-none md:rounded-l-3xl shadow-2xl p-8  w-full md:w-1/2 flex flex-col justify-center"
      >
        <h3 className="text-2xl font-bold mb-6 text-blue-700 flex items-center">
          <FaUserEdit className="mr-2" /> Update Profile Info
        </h3>

        {error && <div className="text-red-500 mb-3">{error}</div>}
        {success && <div className="text-green-600 mb-3">{success}</div>}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Blog Website</label>
            <input
              type="text"
              value={blogWebsite}
              onChange={(e) => setBlogWebsite(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Blog Description</label>
            <textarea
              value={blogDescription}
              onChange={(e) => setBlogDescription(e.target.value)}
              rows="3"
              placeholder="Describe your blog purpose..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={otpMode}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">
              Image <span className="text-xs text-gray-500">(Profile Card)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
            />
          </div>

          {imagePreview && (
            <div className="flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold shadow hover:opacity-90 transition duration-300"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button>
        </form>

        {!otpMode && (
          <button
            onClick={() => setOtpMode(true)}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg flex items-center justify-center transition"
          >
            <FaKey className="mr-2" /> Verify Email with OTP
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center transition"
        >
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </motion.div>
    </div>
  );
};

export default ProfileUpdate;
