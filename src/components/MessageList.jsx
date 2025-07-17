import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages, currentUserId, onReply, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
      {messages.map((m) => (

        
        <MessageItem
          key={m.id}
          message={m}
          isOwn={m.user?.id === currentUserId}
          onReply={() => onReply(m)}
          onEdit={() => onEdit(m)}
          onDelete={() => onDelete(m.id)}
        />
      ))}
    </div>
  );
};

export default MessageList;
