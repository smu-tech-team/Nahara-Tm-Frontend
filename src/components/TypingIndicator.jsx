import React from "react";

const TypingIndicator = ({ typingUsers }) => {
  if (!typingUsers.length) return null;

  return (
    <div className="text-xs italic text-gray-500 dark:text-gray-300 mt-2 absolute bottom-16 left-4">
      {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
    </div>
  );
};

export default TypingIndicator;
