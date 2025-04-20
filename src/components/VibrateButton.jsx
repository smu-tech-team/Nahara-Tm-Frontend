import React from "react";

const VibrateButton = ({ children, onClick, vibrationPattern = [500, 200, 500], ...props }) => {
  const handleClick = (e) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(vibrationPattern);
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button onClick={handleClick} {...props}>
      {children || "Vibrate"}
    </button>
  );
};

export default VibrateButton;
