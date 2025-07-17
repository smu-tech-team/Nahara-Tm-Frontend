import VisualizerCanvas from "./VisualizerCanvas";



export const PlayerPanel = ({
  volume,
  status,
  isPlaying,
  onTogglePlaying,
  latestPcmChunk,
}) => {
  switch (status) {
    case "connecting":
      return <p className="text-yellow-400 animate-pulse">🔄 Connecting to stream...</p>;
    case "connected":
      return (
        <div className="space-y-1">
         
          <VisualizerCanvas chunk={latestPcmChunk} />
          <div className="mt-2 w-full h-2 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-100"
              style={{ width: `${Math.min(volume * 200, 100)}%` }}
            ></div>
          </div>
          <button
            onClick={onTogglePlaying}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? "⏸️ Pause Visualization" : "▶️ Resume Visualization"}
          </button>
        </div>
      );
    case "error":
      return <p className="text-red-400">❌ Could not connect. Please try again later.</p>;
    case "disconnected":
      return <p className="text-gray-400">⚠️ Stream ended or disconnected.</p>;
    default:
      return <p className="text-gray-400">🎙️ Select a session to listen</p>;
  }
};
