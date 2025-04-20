import { useAudio } from '../podcast/AudioProvider';
import { formatTime } from '../podcast/formatTime';

const FullPlayerModal = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    previous,
    progress,
    seek,
    volume,
    setAudioVolume,
  } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 text-white z-50 p-8 flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-2">{currentTrack.title}</h2>
      <p className="text-sm text-gray-400 mb-4">{formatTime(progress)} / {formatTime(currentTrack.duration)}</p>
      <input
        type="range"
        value={progress}
        max={currentTrack.duration}
        onChange={(e) => seek(e.target.value)}
        className="w-full mb-4"
      />
      <div className="flex gap-4 items-center">
        <button onClick={previous}>⏮</button>
        <button onClick={togglePlay}>{isPlaying ? '⏸ Pause' : '▶️ Play'}</button>
        <button onClick={next}>⏭</button>
      </div>
      <div className="mt-4">
        <label>Volume</label>
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setAudioVolume(parseFloat(e.target.value))} />
      </div>
    </div>
  );
};

export default FullPlayerModal;
