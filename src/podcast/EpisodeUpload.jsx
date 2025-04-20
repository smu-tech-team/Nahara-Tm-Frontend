import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EpisodeUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState('');
  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTags([]);
    setCategory('');
    setCover(null);
    setCoverPreview(null);
    setAudioFile(null);
    setAudioPreview(null);
    setErrors({});
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setTags([...tags, e.target.value]);
      e.target.value = '';
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveCover = () => {
    setCover(null);
    setCoverPreview(null);
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!cover) newErrors.cover = 'Cover image is required';
    if (!audioFile) newErrors.audio = 'Audio file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    formData.append('category', category);
    formData.append('isEpisode', true);
    formData.append('cover', cover);
    formData.append('audio', audioFile);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("You're not logged in!");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:8087/api/episodes/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          toast.success('Episode uploaded successfully!');
          resetForm(); // Reset the form after a successful upload
        } else {
          alert('Failed to upload episode: ' + xhr.responseText);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        toast.error('Upload error occurred.');
      };

      xhr.send(formData);
    } catch (err) {
      setUploading(false);
      alert('Error uploading episode: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-8 rounded-2xl shadow-xl space-y-6">
      <h2 className="text-3xl font-bold mb-4">🎙️ Upload an Episode</h2>

      <div>
        <label className="block text-lg font-semibold">Title</label>
        <input
          className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-lg font-semibold">Description</label>
        <textarea
          className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-lg font-semibold">Tags (press Enter)</label>
        <input
          className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700"
          onKeyDown={handleTagAdd}
        />
        <div className="flex flex-wrap mt-2 gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <FaTimes onClick={() => handleTagRemove(tag)} className="cursor-pointer" />
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-lg font-semibold">Category</label>
        <select
          className="w-full mt-1 p-3 rounded bg-gray-800 border border-gray-700"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="Tech">Tech</option>
          <option value="Health">Health</option>
          <option value="Business">Business</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-lg font-semibold">Cover Image</label>
        <input type="file" onChange={handleCoverUpload} accept="image/*" />
        {coverPreview && (
          <div className="mt-2 relative">
            <img src={coverPreview} alt="cover preview" className="w-40 h-40 object-cover rounded-lg" />
            <button
              onClick={handleRemoveCover}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2"
            >
              ✕
            </button>
          </div>
        )}
        {errors.cover && <p className="text-red-500 text-sm mt-1">{errors.cover}</p>}
      </div>

      <div>
        <label className="block text-lg font-semibold">Audio File</label>
        <input type="file" onChange={handleAudioUpload} accept="audio/*" />
        {audioPreview && (
          <audio controls className="mt-2 w-full">
            <source src={audioPreview} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        )}
        {errors.audio && <p className="text-red-500 text-sm mt-1">{errors.audio}</p>}
      </div>

      {uploading && (
        <div className="w-full bg-gray-700 h-4 rounded mt-4">
          <div
            className="bg-green-500 h-4 rounded transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
          <p className="text-sm text-green-300 mt-1">Uploading: {uploadProgress}%</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-800 text-white py-3 rounded-lg hover:bg-blue-500 transition duration-300 mt-6"
      >
        🚀 Publish Episode
      </button>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EpisodeUpload;
