import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from '../store/authStore';
import Default from '/anonymous-8291223_1280.webp';

const AddYourLiveNews = ({ onClose }) => {
  const [videoLink, setVideoLink] = useState('');
  const [isValidLink, setIsValidLink] = useState(false);
  const user = useAuthStore.getState().user;

  const isFacebookUrl = (url) => {
    return url.includes('facebook.com') || url.includes('fb.watch');
  };

  const validateLink = (link) => {
    return ReactPlayer.canPlay(link) || isFacebookUrl(link);
  };

  const handleInputChange = (e) => {
    const link = e.target.value;
    setVideoLink(link);
    setIsValidLink(validateLink(link));
  };

  const handleAddNews = async () => {
    if (isValidLink) {
      try {
        // Prepare the payload for the backend
        const payload = {
          link: videoLink,
          creatorName: user?.blogName || 'Unknown Creator',
          creatorImage: user?.blogProfile || Default,
        };

        // Call the backend API to add live news
        const response = await fetch('http://localhost:8087/api/live-news/add-live-news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to add live news.');
        }

        // Show success message
        toast.success('Live news added successfully!');
        setVideoLink('');
        setIsValidLink(false);
        onClose && onClose(); // Close the modal
      } catch (error) {
        console.error('Error adding live news:', error.message);
        toast.error('Failed to add live news.');
      }
    } else {
      toast.error('Invalid video link! Please enter a valid link.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} 
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 max-w-sm sm:max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">Add Your Live News</h1>
          <p className="text-sm text-gray-600">Share a live video link with your audience!</p>
        </div>

        <input
          type="text"
          placeholder="Enter video link (YouTube, Twitch, Facebook, etc.)"
          value={videoLink}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />
        <p className={`mt-2 text-sm ${isValidLink ? 'text-green-500' : 'text-red-500'}`}>
          {isValidLink ? 'Valid video link!' : 'Enter a valid video link.'}
        </p>

        <div className="flex items-center mt-4 bg-gray-100 rounded-lg p-2">
          <img
            src={user?.blogProfile || Default}
            alt="Creator profile"
            className="w-10 h-10 rounded-full"
          />
          <p className="ml-4 text-gray-700 font-bold">{user?.blogName || 'Unknown Creator'}</p>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleAddNews}
            className="bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            disabled={!isValidLink}
          >
            Add News
          </button>
          <button
            onClick={onClose}
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddYourLiveNews;
