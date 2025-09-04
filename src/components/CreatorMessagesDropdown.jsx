import { useEffect, useState } from "react";
import axios from "axios";
import { FaExclamationTriangle, FaEnvelope } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatorMessagesDropdown = ({ creatorId }) => {
  const [messages, setMessages] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `https://nahara-production.up.railway.app/api/creator/messages/${creatorId}`
        );
        setMessages(response.data);
        setUnreadCount(response.data.filter((msg) => !msg.read).length);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [creatorId]);

  const openMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      axios
        .put(`https://nahara-production.up.railway.app/api/creator/messages/read/${msg.id}`)
        .then(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, read: true } : m))
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
        })
        .catch((err) => console.error("Mark as read error", err));
    }
  };

  const closeModal = () => setSelectedMessage(null);

  return (
    <div className="relative">
      {/* Toggle Dropdown Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative flex items-center gap-2 bg-blue-800 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        <FaEnvelope className="text-lg" />
        Messages
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 max-h-80 overflow-y-auto bg-white shadow-xl rounded-lg z-50 p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Messages</h3>
          {messages.length === 0 ? (
            <p className="text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                className="mb-3 border-b border-gray-200 pb-2 last:border-none cursor-pointer hover:bg-gray-50 rounded-md p-2"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                  {msg.type === "warning" ? (
                    <FaExclamationTriangle className="text-yellow-500" />
                  ) : (
                    <FaEnvelope className="text-blue-500" />
                  )}
                  <span className="capitalize font-medium">{msg.type}</span>
                  <span className="ml-auto text-xs text-gray-400">
                    {dayjs(msg.timestamp).fromNow()}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">{msg.postTitle}</p>
                <p className="text-sm text-gray-700 truncate">{msg.content}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              {selectedMessage.postTitle}
            </h2>
            <div className="flex items-center gap-2 mb-1 text-sm text-gray-600">
              {selectedMessage.type === "warning" ? (
                <FaExclamationTriangle className="text-yellow-500" />
              ) : (
                <FaEnvelope className="text-blue-500" />
              )}
              <span className="capitalize">{selectedMessage.type}</span>
              <span className="ml-auto text-xs text-gray-500">
                {dayjs(selectedMessage.timestamp).format("MMM D, YYYY h:mm A")}
              </span>
            </div>
            <p className="text-gray-700 text-sm whitespace-pre-line mt-2">
              {selectedMessage.content}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorMessagesDropdown;
