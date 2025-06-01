import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Smuads1 from "/smuads2.jpg";
import Smuads2 from "/smuads.jpg";


export default function RightSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [podcasts, setPodcasts] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHidden(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const podcastResponse = await axios.get("http://localhost:8087/api/podcast/list");
        setPodcasts(Array.isArray(podcastResponse.data) ? podcastResponse.data.slice(0, 6) : []);

        const ebookResponse = await axios.get("http://localhost:8087/api/ebooks/get-all-ebooks");
        setEbooks(Array.isArray(ebookResponse.data) ? ebookResponse.data.slice(0, 6) : []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error.response?.data || error.message);
        setLoading(false);
      }
    };
    setTimeout(() => fetchContent(), 1200);
  }, []);

  return (
    <>
      <button
        className={`fixed right-4 top-20 bg-blue-800 text-white p-2 rounded-md shadow-md hover:bg-gray-700 transition ${hidden ? "hidden" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-10" onClick={() => setIsOpen(false)}></div>}
      <motion.div
        className={`fixed right-0 top-16 h-[calc(100vh-4rem)] ${isOpen ? "w-64 sm:w-80 max-w-full" : "w-0"}
 bg-gray-900 text-white shadow-md p-3 overflow-y-auto rounded-l-lg z-20 transition-all`}
        initial={{ x: 200 }}
        animate={{ x: isOpen ? 0 : 200 }}
        transition={{ ease: "easeInOut", duration: 0.4 }}
      >
        {isOpen && (
          <>
            <h2 className="text-md font-bold mb-3">🎧 Podcasts & Books</h2>
            <div className="flex items-center bg-gray-800 p-2 rounded-md mb-3">
              <Search className="text-white" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-white text-sm ml-2 w-full outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Podcasts</h3>
            {loading
              ? Array(6).fill().map((_, index) => <motion.div key={index} className="w-full h-20 bg-gray-700 rounded-md mb-2 animate-pulse" />)
              : podcasts.map((podcast, index) => (
                  <motion.div key={index} className="bg-gray-800 p-2 rounded-md mb-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2" whileHover={{ scale: 1.02 }}>
                    <img src={podcast.coverImageUrl} alt={podcast.title} className="w-12 h-12 rounded-md object-cover" loading="lazy" />
                    <div>
                      <h3 className="text-xs font-medium">{podcast.title}</h3>
                      <a href={`/explore`} className="text-blue-300 text-xs mt-1 inline-block hover:underline">Listen →</a>
                    </div>
                  </motion.div>
                ))}
            <h3 className="text-sm font-semibold text-purple-400 mb-2">Ebooks</h3>
            {loading
              ? Array(3).fill().map((_, index) => <motion.div key={index} className="w-full h-20 bg-gray-700 rounded-md mb-2 animate-pulse" />)
              : ebooks.map((ebook, index) => (
                  <motion.div key={index} className="bg-gray-800 p-2 rounded-md mb-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2" whileHover={{ scale: 1.02 }}>
                    <img src={ebook.coverImageUrl} alt={ebook.title} className="w-12 h-12 rounded-md object-cover" loading="lazy" />
                    <div>
                      <h3 className="text-xs font-medium">{ebook.title}</h3>
                      <a href={`/read-ebook/${ebook.id}`} className="text-purple-300 text-xs mt-1 inline-block hover:underline">Read →</a>
                    </div>
                  </motion.div>
                ))}
            <div className="mt-6 p-4 bg-gray-700 rounded-md text-center">
              <h3 className="text-sm font-semibold text-blue-400">Sponsored Ad</h3>
              <img src={Smuads1} alt="Ad Banner" className="mx-auto mt-2 rounded-md" />
              <a href="#" className="text-blue-300 text-xs mt-2 inline-block hover:underline">Visit Advertiser →</a>
            </div>
             <div className="mt-6 p-4 bg-gray-700 rounded-md text-center">
              <h3 className="text-sm font-semibold text-blue-400">Sponsored Ad</h3>
              <img src={Smuads2} alt="Ad Banner" className="mx-auto mt-2 rounded-md" />
              <a href="#" className="text-yellow-300 text-xs mt-2 inline-block hover:underline">Visit Advertiser →</a>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
