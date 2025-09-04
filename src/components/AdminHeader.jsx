import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import DefaultAvatar from "/anonymous-8291223_1280.webp";
import axios from "axios";
import AdminReminderSetting from "../components/AdminReminderSetting"; 
import useAuthStore from "../store/authStore";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Assuming React Router is in use
import AdminAddBanner from "./AdminAddBanner";


const AdminHeader = () => {
    const { user, setUser, clearUser } = useAuthStore();
    const [userName, setUserName] = useState("Admin");
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(""); 
    const [adminProfile, setAdminProfile] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [appealCount, setAppealCount] = useState(0);

       const handleBannerAdded = (newBanner) => {
        console.log("Banner Added:", newBanner);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");
      
        try {
          // Get the token from localStorage
          const token = localStorage.getItem("token");
          if (!token) {
            setError("No token found. Please log in.");
            return;
          }
      
          // Create a FormData object for the file upload
          const formData = new FormData();
          if (selectedFile) {
            formData.append("imageFile", selectedFile);
          }
      
          const response = await axios.put("https://nahara-production.up.railway.app/api/admin/update-info", formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
      
          setSuccess(response.data.message);
          if (response.data.user) {
            setUser(response.data.user); // Update user state with the new data
          }
        } catch (err) {
          console.error("Error during the request: ", err);
          setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      

    const handleSettingsToggle = () => {
        setSettingsOpen((prevState) => !prevState);
    };

    const resizeImage = (file, maxWidth, maxHeight, callback) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    } else {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => callback(blob), file.type);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            resizeImage(file, 800, 800, (resizedFile) => {
                setSelectedFile(resizedFile);

                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewSrc(reader.result); // Set preview image
                };
                reader.readAsDataURL(resizedFile);
            });
        }
    };

    const handleDragAndDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            resizeImage(file, 800, 800, (resizedFile) => {
                setSelectedFile(resizedFile);

                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewSrc(reader.result); // Set preview image
                };
                reader.readAsDataURL(resizedFile);
            });
        }
    };

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token); 
                setUserName(decoded.userName || "Admin"); 
                setAdminProfile(decoded.adminProfile || DefaultAvatar);
            }
        } catch (err) {
            console.error("Failed to decode JWT:", err.message);
        }
    }, []);

    useEffect(() => {
        const fetchAppeals = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(" https://nahara-production.up.railway.app/api/appeal/count", {
              headers: { Authorization: `Bearer ${token}` },
            });
            setAppealCount(response.data.count || 0);
          } catch (err) {
            console.error("Failed to fetch appeal count", err);
          }
        };
        fetchAppeals();
      }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 items-center mb-6">
            <div className="flex items-center justify-center">
                <img
                    src={adminProfile || DefaultAvatar} 
                    alt="Admin Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-blue-600"
                />
            </div>

            <div className="text-center lg:text-left lg:col-span-2">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
                    Welcome, {userName} 👋
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Role: Administrator
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                    Manage your dashboard efficiently and effectively.
                </p>
            </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-4 lg:space-y-0 lg:space-x-4">
    <div className="flex justify-center lg:justify-end">
            <AdminAddBanner onBannerAdded={handleBannerAdded} />    </div>
    <motion.button
        onClick={handleSettingsToggle}
        className="bg-blue-800 from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
        whileHover={{ scale: 1.05 }}
    >
        <Settings className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
        Settings
    </motion.button>
</div>

<div className="relative ml-4">
  <button
    onClick={() => navigate("/admin/appeals")}
    className="relative bg-white border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white p-2 rounded-full transition"
  >
    <MessageCircle className="w-6 h-6" />
    {appealCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
        {appealCount}
      </span>
    )}
  </button>
</div>


{settingsOpen && (
    <motion.div
        className="fixed top-0 left-0 h-full w-full sm:w-3/4 bg-white shadow-lg z-50 p-4 sm:p-6 rounded-lg overflow-y-auto"
        initial={{ x: "-100%" }}
        animate={{ x: settingsOpen ? 0 : "-100%" }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800">Settings</h2>
            <motion.button
                onClick={handleSettingsToggle}
                className="text-gray-700 hover:text-red-600 font-medium text-base sm:text-lg transition-colors mt-4 sm:mt-0"
                whileHover={{ scale: 1.2 }}
            >
                Close
            </motion.button>
        </div>

        <div className="mt-4 sm:mt-8">
            <AdminReminderSetting />
        </div>
        <motion.div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragAndDrop}
            className="border-dashed border-2 sm:border-4 border-blue-800 rounded-lg p-4 sm:p-6 text-center bg-blue-50 shadow-md hover:border-blue-900 transition-transform hover:scale-105"
        >
            {previewSrc ? (
                <motion.img
                    src={previewSrc}
                    alt="Preview"
                    className="max-w-full h-auto rounded-md shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
            ) : (
                <p className="text-blue-800 font-medium text-sm sm:text-base">
                    Drag and drop your image here or click below to upload.
                </p>
            )}
        </motion.div>

        {/* File Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-transform"
            >
                <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                    Upload Profile Picture
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-800 focus:outline-none"
                />
            </motion.div>

            <div className="flex justify-end">
                <motion.button
                    type="submit"
                    className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg focus:ring focus:ring-blue-800 transition-transform hover:scale-105"
                    whileHover={{ scale: 1.1 }}
                >
                    Save Changes
                </motion.button>
            </div>
        </form>
    </motion.div>
)}
</div>
    );
};

AdminHeader.propTypes = {
    onSettingsToggle: PropTypes.func.isRequired,
};

export default AdminHeader;
