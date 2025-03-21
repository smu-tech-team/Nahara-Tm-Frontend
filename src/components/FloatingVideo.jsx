import React, { useState, useEffect } from 'react';
import logo from '../assert/SmartLogoMain.png'; // Correct path to the logo

const FloatingVideo = ({ videoUrl }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState('');

  useEffect(() => {
    const convertToEmbedUrl = (url) => {
      try {
        let embedLink = url;
        let videoId = '';

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          if (url.includes('youtube.com/watch?v=')) {
            const urlParams = new URL(url).searchParams;
            videoId = urlParams.get('v');
          } else if (url.includes('youtu.be/')) {
            videoId = url.split('/')[3].split('?')[0]; // Extracts only the video ID
          }

          if (videoId) {
            embedLink = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
          }
        }

        console.log('Converted Embed URL:', embedLink); // Debugging
        return embedLink;
      } catch (error) {
        console.error('Error processing video URL:', error);
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
      <div style={styles.floatingVideo}>
        <button style={styles.closeButton} className='dark:text-gray-800 text-black' onClick={handleClose}>✖</button>
        {isLoading && <img src={logo} alt="Loading logo" style={styles.loadingLogo} />}
        {embedUrl && (
          <iframe
            width="350"
            height="250"
            src={embedUrl}
            title="Video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleLoad}
            style={isLoading ? { display: 'none' } : {}}
          ></iframe>
        )}
      </div>
    )
  );
};

const styles = {
  floatingVideo: {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    zIndex: 1000,
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  loadingLogo: {
    width: '100px',
    height: '100px',
    display: 'block',
    margin: 'auto',
    padding: '20px',
  },
};

export default FloatingVideo;
