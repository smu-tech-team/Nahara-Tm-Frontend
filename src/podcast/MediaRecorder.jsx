const startVideoStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
  const socket = new WebSocket("ws://https://nahara-production.up.railway.app/ws/videocast/{sessionId}");
  const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  recorder.ondataavailable = (e) => {
    if (socket.readyState === WebSocket.OPEN && e.data.size > 0) {
      socket.send(e.data);
    }
  };

  recorder.start(1000); 
};
export default startVideoStream;