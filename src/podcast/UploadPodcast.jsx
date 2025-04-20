import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PodcastUpload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null); // For preview purposes
  const [audioFile, setAudioFile] = useState(null);
  const [isEpisode, setIsEpisode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Reset form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setCategory("");
    setCover(null);
    setCoverPreview(null);
    setAudioFile(null);
    setIsEpisode(false);
  };

  // Handle tag addition
  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setTags([...tags, e.target.value]);
      e.target.value = "";
    }
  };

  // Handle tag removal
  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle cover upload
  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    setCover(file); // Set the actual file object
    setCoverPreview(URL.createObjectURL(file)); // Set preview URL
  };

  // Remove cover
  const handleRemoveCover = () => {
    setCover(null);
    setCoverPreview(null); // Clear preview
  };

  // Handle audio file upload
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    setAudioFile(file); // Set the actual file object
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !audioFile || !cover) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags)); // This will send tags as a JSON array
    formData.append("category", category);
    formData.append("isEpisode", isEpisode.toString());
    formData.append("cover", cover);
    formData.append("audio", audioFile);

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You're not logged in!");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:8087/api/podcast/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Podcast uploaded successfully!");
        resetForm(); // Clear the form after successful upload
      } else {
        const error = await response.text();
        toast.error(`Failed to upload podcast: ${error}`);
      }
    } catch (err) {
      toast.error(`Error uploading podcast: ${err.message}`);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Upload Your Podcast</h1>
        <p className="mt-4 text-gray-400">
          Share your voice with the world in just a few steps.
        </p>
      </header>

      {/* Upload Form */}
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Podcast Title */}
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-400">
            Podcast Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter your podcast title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-4 bg-gray-700 rounded-md text-white"
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter a brief description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-gray-700 rounded-md text-white"
          ></textarea>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-400">
            Tags
          </label>
          <div className="flex items-center flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-500 text-white rounded-full cursor-pointer"
                onClick={() => handleTagRemove(tag)}
              >
                {tag}
              </span>
            ))}
            <input
              type="text"
              id="tags"
              placeholder="Type and press Enter"
              onKeyDown={handleTagAdd}
              className="p-2 bg-gray-700 rounded-md text-white flex-grow"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-400">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 bg-gray-700 rounded-md text-white"
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Education">Education</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Business">Business</option>
          </select>
        </div>

        {/* Cover Upload */}
        <div className="mb-6">
          <label htmlFor="cover" className="block text-sm font-medium text-gray-400">
            Cover Image
          </label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleCoverUpload}
            className="w-full p-2 bg-gray-700 rounded-md text-white"
          />
          {coverPreview && (
            <div className="mt-4 flex items-center">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-32 h-32 rounded-md object-cover mr-4"
              />
              <button
                onClick={handleRemoveCover}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-500 transition duration-300"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Audio Upload */}
        <div className="mb-6">
          <label htmlFor="audioFile" className="block text-sm font-medium text-gray-400">
            Audio File
          </label>
          <input
            type="file"
            id="audioFile"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full p-2 bg-gray-700 rounded-md text-white"
          />
        </div>

       

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-800 text-white py-4 rounded-md hover:bg-blue-600 transition duration-300"
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? (
            <span>Loading...</span> // You can replace this with a spinner icon or animation
          ) : (
            "Publish Podcast"
          )}
        </button>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default PodcastUpload;
