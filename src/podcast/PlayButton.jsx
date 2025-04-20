import { useAudio } from '../podcast/AudioProvider';

const PlayButton = ({ episode, playlist }) => {
  const { loadTrack } = useAudio();

  return (
    <button
      onClick={() => loadTrack(episode, playlist, playlist.findIndex((ep) => ep.id === episode.id))}
    >
      ▶️ Play
    </button>
  );
};
export default PlayButton;