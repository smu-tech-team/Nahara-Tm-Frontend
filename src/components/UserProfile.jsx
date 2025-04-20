import React, { useState } from 'react';

const CLOUDINARY_UPLOAD_PRESET = 'your_upload_preset'; 
const CLOUDINARY_CLOUD_NAME = 'djloapfzb'; 

const Dashboard = ({ onUpdateUser }) => {
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setUploading(true);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      setUploading(false);
      return data.secure_url; // Cloudinary URL
    } catch (error) {
      setUploading(false);
      console.error('Cloudinary upload failed:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = preview; // Default to preview in case Cloudinary fails

    if (profileImage) {
      imageUrl = await uploadToCloudinary(profileImage);
    }

    if (imageUrl) {
      onUpdateUser({ username, profileImage: imageUrl });
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={handleUsernameChange}
          className="w-full p-2 border rounded"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2" />
        {preview && <img src={preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto" />}
        <button type="submit" className="w-full bg-blue-800 text-white p-2 rounded" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default Dashboard;
