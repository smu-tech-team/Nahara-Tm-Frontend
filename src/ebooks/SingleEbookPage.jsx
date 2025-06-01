import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import axios from "axios";
import { motion } from "framer-motion";

const SingleEbookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate function
  const [ebook, setEbook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null); // State for selected chapter

  useEffect(() => {
    const fetchEbookAndChapters = async () => {
      try {
        const ebookRes = await axios.get(`http://localhost:8087/api/ebooks/get-single-ebook/${id}`);
        const chaptersRes = await axios.get(`http://localhost:8087/api/ebooks/${id}/chapters`);

        console.log("Ebook data:", ebookRes.data); // Check if ebook data is correct
        console.log("Chapters data:", chaptersRes.data); // Check if chapters data is correct

        setEbook(ebookRes.data);
        setChapters(chaptersRes.data);
      } catch (err) {
        console.error("Error fetching ebook or chapters:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEbookAndChapters();
  }, [id]);

  const handleChapterClick = (pdfUrl) => {
    setSelectedChapter(pdfUrl); // Update the selected chapter
  };

  const handleCloseChapter = () => {
    setSelectedChapter(null); // Close the selected chapter by resetting the state
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-800 flex justify-center">
        <motion.div
          className="w-3/4 md:w-1/2 bg-gray-900 p-6 rounded-lg shadow-md animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-600 rounded mb-2"></div>
          <div className="h-32 bg-gray-700 rounded mb-6"></div>
          <div className="h-4 w-5/6 bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-4/6 bg-gray-600 rounded"></div>
        </motion.div>
      </section>
    );
  }

  if (error || !ebook) {
    return (
      <motion.section
        className="flex flex-col items-center py-16 bg-gray-800"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src="/no-data.png"
          alt="No eBooks"
          className="w-64 h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <h2 className="text-2xl font-bold text-white mt-6">Oops! Ebook not found.</h2>
        <p className="text-gray-400 mt-2">Try searching for a different title.</p>
      </motion.section>
    );
  }

  const handleBackClick = () => {
    navigate("/ebooks"); // Use navigate instead of history.push
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 flex flex-col p-4">
      {/* Back Button */}
      <button
        onClick={handleBackClick} // Navigate to /ebooks when clicked
        className="mb-6 w-max px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
      >
        ← Back to Ebooks
      </button>

      {/* Ebook Cover and Details */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">{ebook.title}</h1>
        <p className="text-gray-400 mb-4">By {ebook.author}</p>
        <motion.img
          src={ebook.coverImageUrl}
          alt="cover"
          className="w-full h-72 object-cover rounded-lg mb-6 shadow-lg"
          whileHover={{ scale: 1.02 }}
        />
        <p className="text-lg text-gray-300">{ebook.description}</p>
      </motion.div>

      {/* Chapters Section */}
      {chapters.length > 0 ? (
        <motion.div
          className="mt-8 bg-gray-800 p-6 rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-semibold text-white mb-4">Chapters</h2>
          <ul className="space-y-4">
            {chapters.map((chapter) => (
              <motion.li
                key={chapter.id}
                className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition cursor-pointer"
                onClick={() => handleChapterClick(chapter.pdfUrl)} // Handle chapter click
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-xl font-bold text-white">{chapter.title}</h3>
                {chapter.description && <p className="text-gray-800 mt-2">{chapter.description}</p>}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : (
        <div className="text-white">No chapters available for this ebook.</div>
      )}

      {/* Full-Screen PDF Viewer */}
      {selectedChapter ? (
        <motion.div
          className="w-full flex-grow mt-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <iframe
            src={`https://docs.google.com/gview?url=${selectedChapter}&embedded=true`}
            width="100%"
            height="800px"
            className="border-none rounded-lg"
            title="Full Ebook"
          ></iframe>

          {/* Close Button */}
          <button
            onClick={handleCloseChapter}
            className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition"
          >
            Close
          </button>
        </motion.div>
      ) : (
        <div className="w-full flex-grow mt-6 text-center text-gray-400">
          <p>Select a chapter to view its content.</p>
        </div>
      )}
    </div>
  );
};

export default SingleEbookPage;
