import React, { useState } from "react";

const MessageItem = ({ message, isOwn, onReply, onEdit, onDelete }) => {
  const {
    user,
    content,
    timestamp,
    replyTo,
    replies = [],
  } = message;

  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex flex-col space-y-2">
      <div
        className={`group relative flex gap-2 items-start ${
          isOwn ? "justify-end" : "justify-start"
        }`}
      >
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt={user?.name || "User"}
          className="w-8 h-8 rounded-full"
        />
        <div
          className={`max-w-[80%] p-3 rounded-xl text-sm whitespace-pre-wrap shadow relative break-words ${
            isOwn
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-tl-none"
          }`}
        >
          {replyTo && (
            <div className="text-xs italic mb-1 text-gray-300 border-l-4 pl-2 border-blue-300">
              Replying to {replyTo.userName || "Anonymous"}:{" "}
              {replyTo.content?.substring(0, 30)}...
            </div>
          )}
          <div className="font-semibold mb-1">{user?.name || "Anonymous"}</div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          <div className="text-[10px] mt-2 text-right text-gray-300">
            {new Date(timestamp).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              day: "numeric",
              month: "short",
            })}
          </div>

          <div className="absolute hidden group-hover:flex gap-1 right-1 top-1 text-xs">
            <button
              className="bg-white dark:bg-gray-900 px-1 rounded hover:text-blue-600"
              onClick={onReply}
            >
              Reply
            </button>
            {isOwn && (
              <>
                <button
                  className="bg-white dark:bg-gray-900 px-1 rounded hover:text-yellow-500"
                  onClick={onEdit}
                >
                  Edit
                </button>
                <button
                  className="bg-white dark:bg-gray-900 px-1 rounded hover:text-red-600"
                  onClick={onDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-12">
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-sm text-blue-600 hover:underline"
          >
            {showReplies
              ? "Hide replies"
              : `View ${replies.length} repl${replies.length > 1 ? "ies" : "y"}`}
          </button>

          {showReplies && (
            <div className="mt-2 space-y-2">
              {replies.map((reply) => (
                <MessageItem
                  key={reply.id}
                  message={reply}
                  isOwn={reply.user?.id === message.user?.id}
                  onReply={() => onReply(reply)}
                  onEdit={() => onEdit(reply)}
                  onDelete={() => onDelete(reply.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
