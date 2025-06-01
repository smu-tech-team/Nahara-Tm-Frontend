import React, { useState } from 'react';
import Write from '../route/Write';
import EbookForm from './EbookForm';

const EbookUploaderWrapper = () => {
  const [isEbookMode, setIsEbookMode] = useState(false);

  return (
    <div className="p-4 min-h-screen bg-gray-900 text-white">
      {/* Switch Toggle */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-l-full ${
            !isEbookMode ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setIsEbookMode(false)}
        >
        Publish post

        </button>
        <button
          className={`px-6 py-2 rounded-r-full ${
            isEbookMode ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setIsEbookMode(true)}
        >
          Ebook Upload

        </button>
      </div>

      {/* Conditional Form Rendering */}
      {isEbookMode ? <EbookForm /> : <Write />}
      
    </div>
  );
};

export default EbookUploaderWrapper;
