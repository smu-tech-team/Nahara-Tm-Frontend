import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

const EmbedModal = ({ isOpen, onClose, onEmbed }) => {
  const [type, setType] = useState('youtube');
  const [input, setInput] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!input) return setPreview(null);

    if (type === 'youtube') {
      const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (match) {
        const embedUrl = `https://www.youtube.com/embed/${match[1]}`;
        setPreview(
          <iframe
            src={embedUrl}
            width="100%"
            height="250"
            allowFullScreen
            className="rounded"
          ></iframe>
        );
      } else {
        setPreview(<p className="text-red-500 text-sm">Invalid YouTube link.</p>);
      }
    }

    else if (type === 'podcast') {
      if (input.includes('embed')) {
        setPreview(
          <iframe
            src={input}
            width="100%"
            height="152"
            style={{ border: 'none' }}
            allow="encrypted-media"
          ></iframe>
        );
      } else {
        setPreview(<p className="text-red-500 text-sm">Embed link must contain &quot;embed&quot;.</p>);
      }
    }

    else if (type === 'iframe') {
      if (input.startsWith('<iframe')) {
        setPreview(
          <div
            className="w-full overflow-hidden rounded"
            dangerouslySetInnerHTML={{ __html: input }}
          ></div>
        );
      } else {
        setPreview(<p className="text-red-500 text-sm">Must start with &lt;iframe&gt; tag.</p>);
      }
    }
  }, [input, type]);

  const handleEmbed = () => {
    let embedCode;

    if (type === 'youtube') {
      const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
      if (!match) return alert('Invalid YouTube URL');
      embedCode = `https://www.youtube.com/embed/${match[1]}`;
      onEmbed({ type: 'video', value: embedCode });
    }

    else if (type === 'podcast') {
      if (!input.startsWith('https://') || !input.includes('embed')) {
        return alert('Please enter a valid podcast embed URL');
      }
      embedCode = `<iframe width="100%" height="152" style="border:none;" src="${input}" allow="encrypted-media"></iframe>`;
      onEmbed({ type: 'iframe', value: embedCode });
    }

    else if (type === 'iframe') {
      if (!input.startsWith('<iframe')) return alert('Invalid iFrame code');
      onEmbed({ type: 'iframe', value: input });
    }

    setInput('');
    setPreview(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 p-4 flex items-center justify-center bg-black/50">
      <Dialog.Panel className="bg-white p-6 rounded-xl max-w-md w-full space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Embed Media</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setInput('');
            setPreview(null);
          }}
          className="w-full border rounded p-2"
        >
          <option value="youtube">YouTube Video</option>
          <option value="podcast">Podcast (e.g. Spotify)</option>
          <option value="iframe">Custom iFrame</option>
        </select>

        <input
          type="text"
          placeholder={
            type === 'youtube'
              ? 'https://youtu.be/video_id'
              : type === 'podcast'
              ? 'https://open.spotify.com/embed/episode/...'
              : '<iframe ...></iframe>'
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {preview && <div className="mt-3 border rounded p-2 bg-gray-50">{preview}</div>}

        <div className="flex justify-end">
          <button
            onClick={handleEmbed}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Embed
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EmbedModal;
