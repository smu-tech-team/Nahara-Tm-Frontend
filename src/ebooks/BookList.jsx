import React, { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "./BookCard";
import { motion } from "framer-motion";
import Sad from '/Pngtree.png';

const SkeletonCard = () => (
  <motion.div
    className="bg-white p-6 rounded-2xl shadow animate-pulse"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className="h-40 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </motion.div>
);

const BookList = ({ userId }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:8087/api/ebooks/get-all-ebooks");
        setBooks(res.data);
        if (res.data.length === 0) setError(true);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-16 bg-gray-800">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </motion.div>
      </section>
    );
  }

  if (error || filteredBooks.length === 0) {
    return (
      <motion.section
        className="flex flex-col items-center py-16 bg-gray-800"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.img
          src={Sad}
          alt="No eBooks"
          className="w-64 h-64 "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        />
        <h2 className="text-2xl font-bold text-white mt-6">Oops! No eBooks found.</h2>
        <p className="text-gray-400 mt-2">Try refreshing or searching for different keywords.</p>
        <motion.button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-800 text-white rounded-lg shadow hover:bg-blue-700 transition"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Reload
        </motion.button>
      </motion.section>
    );
  }

  return (
    <section className="py-16 bg-gray-800">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Available eBooks</h2>
        <p className="text-gray-300">Explore a wide range of eBooks tailored for you.</p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
      >
        {filteredBooks.map((book) => (
          <motion.div
            key={book.id}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
          >
            <BookCard
              id={book.id}
              title={book.title}
              author={book.author}
              description={book.description}
              createdAt={book.createdAt}
              cover={book.coverImageUrl}
              link={book.link}
              isSaved={book.isSaved}
              userId={userId}
              price={book.price}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default BookList;
