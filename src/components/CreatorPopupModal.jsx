import React from "react";

const CreatorPopupModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80 text-center">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Leaving Our Site</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        You are about to visit an external website. We have no control over its content or security.
      </p>
      <div className="mt-4 flex justify-center gap-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition">
          Cancel
        </button>
        <button onClick={onConfirm} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
          OK
        </button>
      </div>
    </div>
  </div>
);

export default CreatorPopupModal;
