import { motion } from "framer-motion";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaBookOpen, FaDownload, FaBookmark, FaRegBookmark, FaCartPlus } from "react-icons/fa";

const BookCard = ({ id, title, description, cover, link, isSaved, userId, author, createdAt, initialLikes, initialReads, price }) => {
  const [saved, setSaved] = useState(isSaved);
  const [likes, setLikes] = useState(initialLikes || 0);
  const [reads, setReads] = useState(initialReads || 0);
  const navigate = useNavigate();

  const handleSaveToggle = async () => {
    try {
      const endpoint = saved ? "/api/ebook/unsave" : "/api/ebook/save";
      await axios.post(`${endpoint}?ebookId=${id}&userId=${userId}`);
      setSaved(!saved);
    } catch (err) {
      console.error("Save toggle error:", err);
    }
  };

  const handleLikeClick = async () => {
    try {
      await axios.post(`/api/ebook/like?ebookId=${id}&userId=${userId}`);
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handleReadClick = async () => {
    try {
      await axios.get(`http://localhost:8087/api/ebooks/get-single-ebook/${id}`);
      setReads((prev) => prev + 1);
      navigate(`/read-ebook/${id}`);
    } catch (err) {
      console.error("Read error:", err);
    }
  };

  const handleDownloadClick = async () => {
    try {
      const res = await axios.get(`http://localhost:8087/api/ebooks/ebook/download?ebookId=${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const handleAddToCart = () => {
    console.log("Adding to cart", id);
    // Implement the add to cart functionality here
  };

  return (
    <motion.div
      className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-transform"
      whileHover={{ scale: 1.03 }}
    >
      <img src={cover} alt={title} className="w-full h-64 object-cover" />
      <div className="p-6 relative">
        <h3 className="text-xl font-semibold text-gray-900">{author}</h3>
        <h3 className="text-lg font-medium text-gray-800 mt-1">{title}</h3>
        <p className="text-gray-600 text-sm mt-2 line-clamp-3">{description}</p>
        <p className="text-gray-400 text-xs mt-1">{createdAt}</p>

        <div
        className="absolute top-24 right-4 md:top-32 md:right-6 bg-blue-600 text-white py-2 px-4 rounded-full shadow-lg 
                  text-lg md:text-xl font-semibold transition-transform transform hover:scale-105"
      >
        ${price}
      </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-10 mt-6 text-gray-700">
          {/* Read */}
          <button onClick={handleReadClick} className="flex items-center gap-1 hover:text-blue-600 transition">
            <FaBookOpen className="text-xl" />
            <span className="text-sm">{reads}</span>
          </button>

          {/* Like */}
          <button onClick={handleLikeClick} className="flex items-center gap-1 hover:text-red-600 transition">
            <FaHeart className="text-xl" />
            <span className="text-sm">{likes}</span>
          </button>

          {/* Download */}
          <button onClick={handleDownloadClick} className="flex items-center gap-1 hover:text-green-600 transition">
            <FaDownload className="text-xl" />
          </button>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition"
          >
            <FaCartPlus className="text-xl" />
            <span className="text-sm">Add to Cart</span>
          </button>
        </div>

        {/* Save/Unsave */}
        <button
          onClick={handleSaveToggle}
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition"
        >
          {saved ? <FaBookmark className="text-2xl" /> : <FaRegBookmark className="text-2xl" />}
        </button>
      </div>
    </motion.div>
  );
};

export default BookCard;
