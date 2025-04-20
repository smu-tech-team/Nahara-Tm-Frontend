import React, { createContext, useContext, useRef, useState } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(new Audio());
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Load new track
  const loadTrack = (track, trackQueue = [], index = 0) => {
    setQueue(trackQueue);
    setQueueIndex(index);
    setCurrentTrack(track);
    audioRef.current.src = track.audioUrl;
    play();
  };

  const play = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    isPlaying ? pause() : play();
  };

  const next = () => {
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1;
      setQueueIndex(nextIndex);
      setCurrentTrack(queue[nextIndex]);
      audioRef.current.src = queue[nextIndex].audioUrl;
      play();
    }
  };

  const previous = () => {
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1;
      setQueueIndex(prevIndex);
      setCurrentTrack(queue[prevIndex]);
      audioRef.current.src = queue[prevIndex].audioUrl;
      play();
    }
  };

  const seek = (value) => {
    audioRef.current.currentTime = value;
  };

  const setAudioVolume = (val) => {
    setVolume(val);
    audioRef.current.volume = val;
  };

  const onTimeUpdate = () => {
    setProgress(audioRef.current.currentTime);
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentTrack,
        isPlaying,
        volume,
        progress,
        queue,
        queueIndex,
        loadTrack,
        play,
        pause,
        togglePlay,
        next,
        previous,
        seek,
        setAudioVolume,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        onEnded={next}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={() => setProgress(audioRef.current.currentTime)}
      />
    </AudioContext.Provider>
  );
};
