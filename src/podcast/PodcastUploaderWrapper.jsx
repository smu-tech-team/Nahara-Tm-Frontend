import React, { useState } from 'react';
import PodcastUpload from './UploadPodcast'; // Will create this next
import EpisodeUpload from './EpisodeUpload'; // Will create this next

const PodcastUploaderWrapper = () => {
  const [isEpisodeMode, setIsEpisodeMode] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      {/* Switch Toggle */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-full ${
            !isEpisodeMode ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setIsEpisodeMode(false)}
        >
          Single Podcast
        </button>
        <button
          className={`px-6 py-2 rounded-r-full ${
            isEpisodeMode ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setIsEpisodeMode(true)}
        >
          Episode
        </button>
      </div>

      {/* Conditional Form Rendering */}
      {isEpisodeMode ? <EpisodeUpload /> : <PodcastUpload />}
    </div>
  );
};

export default PodcastUploaderWrapper;
