import React from "react";

const AudioPlayer = ({ audioSrc }) => {
  return (
    <audio controls className="w-full mt-4">
      <source src={audioSrc} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;