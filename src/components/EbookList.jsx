import React, { useState, useEffect } from "react";
import { FaBookOpen, FaTimes } from "react-icons/fa";

const EbookList = ({ creatorId, onClose }) => {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEbooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8087/api/creator/creator/${creatorId}/ebooks`);
      const data = await response.json();
      const sortedEbooks = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setEbooks(sortedEbooks);
    } catch (error) {
      console.error("Error fetching ebooks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();
  }, [creatorId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-2 sm:px-4">
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-[95%] sm:max-w-3xl relative overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition"
          aria-label="Close"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* Header */}
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <FaBookOpen className="text-blue-500" /> Ebooks
        </h2>

        {/* Loading Indicator */}
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-300 animate-pulse">
            Loading ebooks...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ebooks.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-300 text-center w-full">
                ❌ No ebooks found for this creator.
              </p>
            ) : (
              ebooks.map((ebook) => (
                <div
                  key={ebook.id}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transition transform hover:scale-105 flex flex-col items-center"
                >
                  {/* Ebook Cover */}
                  <a href={ebook.readUrl} target="_blank" rel="noopener noreferrer">
                    <img
                      src={ebook.coverImageUrl || "https://via.placeholder.com/200x300"}
                      alt={ebook.title}
                      className="w-full h-64 sm:h-56 rounded-lg object-cover hover:opacity-80 transition"
                    />
                  </a>

                  {/* Clickable Title */}
                  <a
                    href={`/read-ebook/${ebook.id}`}
                    className="text-base sm:text-lg font-semibold text-blue-500 mt-3 text-center hover:underline"
                  >
                    {ebook.title}
                  </a>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
                    {ebook.description}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EbookList;
