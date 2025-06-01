import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-[90%] sm:max-w-lg w-full overflow-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose} // ✅ Ensure close button correctly calls onClose
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition"
          aria-label="Close"
        >
          ✖
        </button>

        {/* Modal Header */}
        {title && <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>}

        {/* Modal Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
