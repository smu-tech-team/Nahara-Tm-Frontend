// MessageInput.jsx
import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "../store/Emoji";

const MessageInput = ({
  user,
  sessionId,
  replyTo,
  editingMessageId,
  onSend,
  onCancelEdit,
  onTyping,
  clearReply,
  inputValue,
  setInputValue,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!editingMessageId) {
      setImagePreview(null);
      setInputValue("");
    }
  }, [editingMessageId, setInputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    onTyping?.();
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {}, 3000);
  };

  const handleEmojiSelect = (emoji) => {
    setInputValue((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = () => {
    if (!inputValue.trim() && !imagePreview) return;

  const message = {
  userId: user.userId || user.id,
  role: Array.from(user.roles ?? [])[0]?.name || user.role,
  content: imagePreview
    ? `<img src="${imagePreview}" alt="uploaded" class="max-w-[200px] max-h-[200px]" />`
    : inputValue.trim(),
  timestamp: new Date().toISOString(),
  sessionId,
  repliedToMessageId: replyTo?.id || null,
  replyTo: replyTo
    ? {
        id: replyTo.id,
        userName: replyTo.user?.name || replyTo.userName || "Anonymous",
        content: replyTo.content,
      }
    : null,
};



    onSend(message);
    setImagePreview(null);
    setInputValue("");
    if (clearReply) clearReply();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2 items-center relative">
      <input
        type="text"
        placeholder={
          editingMessageId
            ? "Edit message..."
            : replyTo
            ? `Replying to ${replyTo.userName || replyTo.user?.name || "Anonymous"}`
            : "Type a message..."
        }
        className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />

      <button
        type="button"
        onClick={() => setShowEmojiPicker((v) => !v)}
        className="px-2 select-none"
      >
        😀
      </button>

      <EmojiPicker
        visible={showEmojiPicker}
        onSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="chat-image-upload"
      />
      <label htmlFor="chat-image-upload" className="cursor-pointer px-2 text-blue-600">
        📷
      </label>

      {imagePreview && (
        <div className="relative">
          <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded" />
          <button
            type="button"
            onClick={() => setImagePreview(null)}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5"
          >
            ×
          </button>
        </div>
      )}

      {editingMessageId ? (
        <>
          <button onClick={onCancelEdit} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </>
      ) : (
        <button onClick={handleSend} className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
      )}
    </div>
  );
};

export default MessageInput;
