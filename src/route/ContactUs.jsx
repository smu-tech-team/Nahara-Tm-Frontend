import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 mt-6 mb-6 dark:bg-gray-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Contact Us</h1>
      <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
        Have questions? Feel free to reach out to us!
      </p>
      <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
        <div className="flex items-center space-x-3">
          <FaPhone className="text-blue-500" />
          <span>+123 456 7890</span>
        </div>
        <div className="flex items-center space-x-3">
          <FaEnvelope className="text-red-500" />
          <span>contact@example.com</span>
        </div>
        <div className="flex items-center space-x-3">
          <FaMapMarkerAlt className="text-green-500" />
          <span>1234 Street, City, Country</span>
        </div>
      </div>
      <form className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-700 dark:text-gray-300">Your Name</label>
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded" 
          required 
        />
        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Your Email</label>
        <input 
          type="email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded" 
          required 
        />
        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Message</label>
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded h-32" 
          required
        ></textarea>
        <button
          type="submit"
          className="mt-4 w-full bg-blue-800 hover:bg-blue-700 text-white py-2 px-4 rounded flex justify-center items-center"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default Contact;