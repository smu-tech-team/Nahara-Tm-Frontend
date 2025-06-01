import React, { useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp } from 'react-icons/fa';

const VideoPlayer = ({ videoId, onNext, onPrev }) => {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 bg-gray-900 p-3 rounded-md">
      <div className="relative w-full aspect-video">
        <iframe 
          width="100%" 
          height="100%" 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${playing ? 1 : 0}&controls=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex gap-4">
        <button onClick={onPrev} className="text-white text-lg">
          <FaBackward />
        </button>
        <button onClick={() => setPlaying(!playing)} className="text-white text-lg">
          {playing ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={onNext} className="text-white text-lg">
          <FaForward />
        </button>
        <FaVolumeUp className="text-white ml-2" />
      </div>
    </div>
  );
};
export default VideoPlayer;