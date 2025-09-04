import React, { useState } from "react";

const ShareEmbed = ({ podcastId }) => {
  const embedSrc = `https://nahara-production.up.railway.app/api/podcast/${podcastId}/embed`;

  // ✅ Updated only this line:
  const podcastUrl = `http://localhost:5173/podcast/${podcastId}`;

  const embedCode = `<iframe src="${embedSrc}" width="100%" height="250" frameborder="0" allow="autoplay"></iframe>`;

  const [copied, setCopied] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCopy = (text, setCopiedFn) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedFn(true);
      setTimeout(() => setCopiedFn(false), 2000);
    });
  };

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  return (
    <div className="bg-gray-800 p-4 rounded-xl text-white space-y-4 relative">
      <h3 className="text-lg font-semibold">📤 Share & Embed Podcast</h3>

      {/* Shareable URL */}
      <div className="flex items-center gap-2">
        <input
          readOnly
          type="text"
          value={podcastUrl}
          className="flex-1 px-3 py-2 rounded-md bg-gray-700 text-sm"
        />
        <button
          onClick={() => handleCopy(podcastUrl, setCopied)}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* Share dropdown */}
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-sm"
        >
          Share on...
        </button>

        {showDropdown && (
          <div className="absolute z-10 mt-2 w-52 bg-white text-black rounded-md shadow-lg overflow-hidden">
            <a
              href={`https://wa.me/?text=Check%20this%20podcast%20out:%20${encodeURIComponent(podcastUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-200 text-sm"
            >
              WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=Listen%20to%20this%20podcast!&url=${encodeURIComponent(podcastUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-200 text-sm"
            >
              Twitter (X)
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(podcastUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-200 text-sm"
            >
              Facebook
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(podcastUrl)}&text=Check%20this%20podcast%20out!`}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 hover:bg-gray-200 text-sm"
            >
              Telegram
            </a>
            <button
              onClick={() => handleCopy(podcastUrl, setCopied)}
              className="w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>

      {/* Embed code */}
      <div className="flex items-center gap-2">
        <textarea
          readOnly
          rows={2}
          value={embedCode}
          className="flex-1 px-3 py-2 rounded-md bg-gray-700 text-sm resize-none"
        />
        <button
          onClick={() => handleCopy(embedCode, setCopiedEmbed)}
          className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
        >
          {copiedEmbed ? "Copied!" : "Copy Embed"}
        </button>
      </div>

      {/* Preview toggle */}
      <button
        onClick={() => setShowPreview(prev => !prev)}
        className="text-sm underline text-blue-400"
      >
        {showPreview ? "Hide Embed Preview" : "Show Embed Preview"}
      </button>

      {/* Preview iframe */}
      {showPreview && (
        <div className="mt-3 border border-gray-600 rounded-md overflow-hidden">
          <iframe
            src={embedSrc}
            width="100%"
            height="250"
            frameBorder="0"
            allow="autoplay"
            title="Podcast Embed"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ShareEmbed;
