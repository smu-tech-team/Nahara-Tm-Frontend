import { useState } from "react";
import axios from "axios";

export default function AdminAddBanner({ onBannerAdded }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [bannerData, setBannerData] = useState({
    category: "",
    title: "",
    description: "",
    imageUrl: "",
    url: "",
  });

  const toggleModal = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setBannerData({ ...bannerData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8087/api/banners/admin/add", bannerData);
      alert("Banner added successfully!");
      setIsOpen(false);
      onBannerAdded(response.data);
    } catch (error) {
      alert("Failed to add banner!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700"
      >
        Add Banner
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add New Banner</h2>

            {loading && <p className="text-center text-gray-500">Saving banner...</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={bannerData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={bannerData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={bannerData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />

              {/* Drag-and-Drop File Upload */}
              <div
                className="w-full p-4 border rounded-md text-center cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={() => document.getElementById("fileInput").click()}
              >
                Drag and drop an image or click to upload
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Image Preview */}
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Banner Preview"
                  className="w-full h-40 object-cover rounded-md mt-2"
                />
              )}

              <input
                type="text"
                name="url"
                placeholder="Banner Link"
                value={bannerData.url}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
