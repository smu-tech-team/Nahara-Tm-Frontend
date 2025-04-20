import React from 'react';
import GooglePlayLogo from '/newnow2.png';
import AppStoreLogo from '/newnow.png';

const DownloadApp = () => {
  return (
    <div className="mt-5 flex flex-col items-center text-center px-4 space-y-3">
      <h2 className="text-base sm:text-lg font-medium text-gray-600 dark:text-white">
        COMING SOON
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
        Stay updated and connected with our latest sports updates, hot gist and more on the go.
      </p>
      <div className="flex space-x-3 mt-2">
        <a
          href="https://play.google.com/store"
          target="_blank"
          rel="noopener noreferrer"
          className="transform hover:scale-105 transition duration-300 shadow-md rounded-lg"
        >
          <img
            src={GooglePlayLogo}
            alt="Google Play Store"
            className="w-24 sm:w-28 h-auto rounded-md"
          />
        </a>
        <a
          href="https://www.apple.com/app-store/"
          target="_blank"
          rel="noopener noreferrer"
          className="transform hover:scale-105 transition duration-300 shadow-md rounded-lg"
        >
          <img
            src={AppStoreLogo}
            alt="Apple App Store"
            className="w-24 sm:w-28 h-auto rounded-md"
          />
        </a>
      </div>
    </div>
  );
};

export default DownloadApp;
