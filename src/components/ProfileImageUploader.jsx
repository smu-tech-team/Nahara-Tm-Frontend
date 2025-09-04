import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileUpdater = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("token");
      await axios.put("https://nahara-production.up.railway.app/api/user/profile-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update profile image.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!email) {
      toast.warning("Please enter an email address.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://nahara-production.up.railway.app/api/user/email",
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Failed to update email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Update Profile
        </h2>

        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-40 h-40 sm:w-60 sm:h-60 object-cover rounded-full border-4 border-gray-300 shadow-lg"
          />
        ) : (
          <div className="w-40 h-40 sm:w-60 sm:h-60 flex items-center justify-center border-4 border-dashed border-gray-400 rounded-full">
            <p className="text-gray-500 text-sm sm:text-lg text-center">No Image Selected</p>
          </div>
        )}

        <input type="file" accept="image/*" className="hidden" id="fileInput" onChange={handleFileChange} />
        <label
          htmlFor="fileInput"
          className="mt-6 w-full px-6 py-3 bg-blue-800 text-white text-base sm:text-lg font-semibold text-center rounded-lg cursor-pointer hover:bg-blue-700 transition"
        >
          Choose Image
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className={`mt-6 w-full px-6 py-3 text-base sm:text-lg font-semibold text-white rounded-lg transition ${
            loading || !selectedFile ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <div className="mt-6 w-full">
          <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2">Update Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter new email"
          />
        </div>

        <button
          onClick={handleEmailUpdate}
          disabled={loading || !email}
          className={`mt-4 w-full px-6 py-3 text-base sm:text-lg font-semibold text-white rounded-lg transition ${
            loading || !email ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-800 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Updating..." : "Update Email"}
        </button>
      </div>
    </div>
  );
};

export default ProfileUpdater;
