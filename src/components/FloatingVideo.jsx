import React, { useState, useEffect } from "react";
import logo from "/SmartLogoMain.png"; // Correct path to the logo

const FloatingVideo = ({ videoUrl }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState("");

  useEffect(() => {
    const convertToEmbedUrl = (url) => {
      try {
        let embedLink = url;
        let videoId = "";

        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          if (url.includes("youtube.com/watch?v=")) {
            const urlParams = new URL(url).searchParams;
            videoId = urlParams.get("v");
          } else if (url.includes("youtu.be/")) {
            videoId = url.split("/")[3].split("?")[0]; // Extracts only the video ID
          }

          if (videoId) {
            embedLink = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
          }
        }

        return embedLink;
      } catch (error) {
        console.error("Error processing video URL:", error);
        return url;
      }
    };

    setEmbedUrl(convertToEmbedUrl(videoUrl));
  }, [videoUrl]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show the logo for at least 2 seconds
  };

  return (
    isOpen && (
      <div style={styles.floatingVideoContainer}>
        <button style={styles.closeButton} onClick={handleClose}>
          ✖
        </button>
        {isLoading && (
          <div style={styles.loadingContainer}>
            <img src={logo} alt="Loading..." style={styles.loadingLogo} />
          </div>
        )}
        {embedUrl && (
          <iframe
            src={embedUrl}
            title="Video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoad}
            style={isLoading ? { display: "none" } : styles.videoFrame}
          ></iframe>
        )}
      </div>
    )
  );
};

const styles = {
  floatingVideoContainer: {
    position: "fixed",
    bottom: "10px",
    left: "10px",
    right: "10px",
    zIndex: 1000,
    backgroundColor: "white",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    width: "90%",
    maxWidth: "400px", // Keeps it constrained for wider screens
  },
  closeButton: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    zIndex: 1001,
    color: "#333",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "200px",
  },
  loadingLogo: {
    width: "60px",
    height: "60px",
    display: "block",
  },
  videoFrame: {
    width: "100%",
    height: "200px", // Fully adjusts for small screens
    borderRadius: "8px",
  },
};

export default FloatingVideo;
