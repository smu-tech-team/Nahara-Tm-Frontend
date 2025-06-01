import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNewspaper,
  FaPodcast,
  FaLock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaBars,
  FaHeadset, 
  FaComments, 
  FaToolbox, 
  FaGavel, 
  FaPenFancy, 
  FaSadTear, 
  FaTimesCircle, 
} from "react-icons/fa";
const menuItems = [
  { icon: <FaNewspaper size={18} />, label: "Live News", color: "hover:text-blue-500", action: "addLiveNews" },
  { icon: <FaPodcast size={18} />, label: "Podcast", color: "hover:text-blue-400", route: "/start-podcast" },
  { icon: <FaLock size={18} />, label: "Lock Earnings", color: "hover:text-yellow-400", action: "lockEarnings" },
  { icon: <FaMoneyBillWave size={18} />, label: "Withdraw", color: "hover:text-green-400", action: "withdraw" },
  { icon: <FaCheckCircle size={18} />, label: "Eligibility", color: "hover:text-purple-400", action: "checkEligibility" },
  { icon: <FaHeadset size={18} />, label: "Support", color: "hover:text-gray-400", action: "support", needsPopup: true },
  { icon: <FaComments size={18} />, label: "Live Chat", color: "hover:text-green-500", action: "liveChat", needsPopup: true },
  { icon: <FaToolbox size={18} />, label: "Creator Tools", color: "hover:text-yellow-500", action: "creatorTools", needsPopup: true },
  { icon: <FaGavel size={18} />, label: "Appeals", color: "hover:text-red-500", action: "appeals", needsPopup: true },
  { icon: <FaPenFancy size={18} />, label: "Create Post", color: "hover:text-blue-600", route: "/get-started/write/ebook" }, 
];
const Sidebar = ({ setActiveModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.needsPopup) {
      setPopupContent(item.label);
    } else if (item.action) {
      setActiveModal(item.action);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative z-50">
     <motion.button
  onClick={() => setIsOpen((prev) => !prev)}
  className="fixed top-12 left-20 sm:left-4 bg-white dark:bg-black dark:text-white text-black p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all focus:outline-none flex items-center gap-2"
  whileTap={{ scale: 0.9, rotate: 90 }}
  aria-label="Toggle Sidebar"
>
  <FaBars size={20} />
  <span className="text-sm font-medium">Click to Open Menu</span>
</motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            ref={sidebarRef}
            key="sidebar"
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 max-w-full bg-gray-950 text-white h-screen p-6 fixed left-0 top-0 shadow-xl border-r border-gray-800 overflow-y-auto flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-6 text-center border-b pb-4">
              Creator Dashboard
            </h2>

            <div className="flex flex-col gap-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleClick(item)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 hover:bg-gray-800 ${item.color}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {popupContent && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4 w-80">
              <FaSadTear size={40} className="text-gray-400" />
              <h2 className="text-lg font-semibold">{popupContent} - 404</h2>
              <p className="text-sm text-gray-400 text-center">
                This feature is not available yet. Stay tuned for updates!
              </p>
              <button
                onClick={() => setPopupContent(null)}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <FaTimesCircle size={18} />
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
