import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaHeart } from 'react-icons/fa';

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (src) {
      const canPlay = audioRef.current?.canPlayType('audio/mp3') || audioRef.current?.canPlayType('audio/mp4');
      setError(!canPlay);
    }
  }, [src]);

  const togglePlay = () => {
    if (error) {
      alert("Audio format not supported! Please try another track.");
      return;
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  return (
    <div className="flex items-center gap-4 bg-gray-900 p-3 rounded-md">
      {error ? (
        <p className="text-red-500">Unsupported audio format. Try another song.</p>
      ) : (
        <>
          <button onClick={togglePlay} className="text-white text-lg">
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          <div className="w-full bg-gray-700 h-2 rounded-md overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }} />
          </div>
          <FaVolumeUp className="text-white ml-2" />
          <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} />
        </>
      )}
    </div>
  );
};
