import { useState } from "react";
import { animateMini, motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const AdvertiseWithUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [paymentType, setPaymentType] = useState("Credit Card");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name,
      email,
      message,
      paymentType,
    };

    try {
      const response = await axios.post("http://localhost:8087/api/advertise/submit", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        toast.alert("Inquiry sent successfully!");
        setName("");
        setEmail("");
        setMessage("");
        setPaymentType("Credit Card");
      } else {
       toast.alert("Failed to send the inquiry.");
      }
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 max-w-3xl mx-auto mt-6 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg"
    >
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
        Advertise With Us
      </h1>
      <p className="mt-4 text-gray-600 dark:text-gray-300 text-center">
        Reach a wider audience by advertising with us. We offer various ad placements to maximize your exposure.
      </p>
      <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-semibold">Why Advertise With Us?</h2>
        <ul className="list-disc list-inside">
          <li>Targeted audience reach</li>
          <li>Multiple ad placement options</li>
          <li>Affordable pricing plans</li>
          <li>24/7 customer support</li>
        </ul>
      </div>
      <form className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-700 dark:text-gray-300">Your Name</label>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Your Email</label>
        <input
          type="email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Message</label>
        <textarea
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>

        <label className="block mt-4 mb-2 text-gray-700 dark:text-gray-300">Preferred Payment Type</label>
        <select
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="PayPal">PayPal</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        <button
          type="submit"
          className="mt-6 w-full bg-blue-500  hover:bg-blue-600 text-white py-2 px-4 rounded flex justify-center items-center"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </motion.div>
  );
};

export default AdvertiseWithUs;
