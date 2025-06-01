import { useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const topics = [
  { label: "💡 Suggestion", value: "suggestion" },
  { label: "🐞 Bug Report", value: "bug" },
  { label: "⭐ Feature Request", value: "feature" },
  { label: "📣 General Feedback", value: "general" },
];

const FeedbackComponent = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const persisted = localStorage.getItem("feedback-panel-open");
    setOpen(persisted === "true");
  }, []);

  const toggleOpen = (state) => {
    setOpen(state);
    localStorage.setItem("feedback-panel-open", state.toString());
  };

  const [location, setLocation] = useState(null);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.warn("Geolocation not allowed or available", error);
      }
    );
  }
}, []);


  const handleSubmit = async () => {
    if (!feedback.trim() || !topic) {
      return toast.error("Please select a topic and provide feedback.");
    }

  const metadata = {
  message: feedback,
  topic,
  userEmail: user?.email || "anonymous@example.com",
  userId: user?.id || null,
  timestamp: new Date().toISOString(),
  pageUrl: window.location.href,
  location: location
    ? `Lat: ${location.latitude}, Long: ${location.longitude}`
    : "Location unavailable",
};


    try {
      setLoading(true);
      const res = await fetch("http://localhost:8087/api/notifications/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitted(true);
      setFeedback("");
      setTopic("");
      toast.success("Thank you for your feedback!");
      setTimeout(() => {
        toggleOpen(false);
        setSubmitted(false);
        setLoading(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to send feedback. Try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-2 right-4 z-50 flex flex-col items-end">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white dark:bg-gray-900 shadow-xl rounded-xl w-72 sm:w-64 p-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {user?.image && (
                    <img
                      src={user.image}
                      alt="avatar"
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <h4 className="font-semibold text-sm text-gray-800 dark:text-white">
                    Feedback
                  </h4>
                </div>
                <button onClick={() => toggleOpen(false)} aria-label="Close">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {submitted ? (
                <p className="text-green-600 text-sm">Thanks for your feedback!</p>
              ) : (
                <>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full mb-2 text-sm p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Topic</option>
                    {topics.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>

                  <textarea
                    rows={3}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Your thoughts..."
                    className="w-full mb-3 text-sm p-2 border rounded-md text-gray-900 dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 px-4 rounded-md transition disabled:opacity-60"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!open && (
          <button
            onClick={() => toggleOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-full shadow-md transition flex items-center space-x-1 text-sm"
            aria-label="Give Feedback"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Feedback</span>
          </button>
        )}
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </>
  );
};

export default FeedbackComponent;
