import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Subscribe() {
  const [formData, setFormData] = useState({ name: "", email: "", preferences: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post("https://nahara-production.up.railway.app/api/newsletter/subscribe", formData);
      toast.success(response.data || "Subscription successful!");
      setFormData({ name: "", email: "", preferences: "" }); // Reset form
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
          Subscribe to Our Newsletter
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 dark:bg-gray-700 dark:text-white"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-800 dark:bg-gray-700 dark:text-white"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferences (e.g., Sports, Tech, Health)
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              value={formData.preferences}
              onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Subscribe;
