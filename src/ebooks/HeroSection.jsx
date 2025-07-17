import { motion } from "framer-motion";
import { useState } from "react";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  return (
    <section className="bg-gradient-to-br from-blue-800 to-red-800 text-white py-20 text-center rounded-lg mb-5 mt-5">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold mb-4"
      >
        Discover Your Next Favorite eBook
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg md:text-2xl mb-6"
      >
        Browse our top collection of developer and tech books
      </motion.p>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex justify-center gap-4 flex-wrap"
      >
        <input
          type="text"
          placeholder="Search eBooks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 w-64 text-black border rounded-xl shadow-sm focus:outline-none"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 w-48 text-black border rounded-xl shadow-sm focus:outline-none"
        >
          <option value="">All Categories</option>
          <option value="Technology">Technology</option>
          <option value="Science">Science</option>
          <option value="Education">Education</option>
          <option value="Business">Business</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>

        <motion.button
          className="px-6 py-2 bg-white text-blue-800 rounded-lg shadow hover:bg-gray-200 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Search
        </motion.button>
      </motion.div>
    </section>
  );
};

export default HeroSection;
