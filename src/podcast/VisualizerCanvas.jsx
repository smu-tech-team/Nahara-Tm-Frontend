import React, { useEffect, useRef, useState } from "react";

const VisualizerCanvas = ({ chunk }) => {
  const canvasRef = useRef(null);
  const [peak, setPeak] = useState(0);

  useEffect(() => {
    if (!chunk || !chunk.length) return;
    const currentPeak = Math.max(...chunk.map(Math.abs));
    setPeak((prev) => Math.max(currentPeak, prev * 0.95)); // decay peak
  }, [chunk]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (chunk && chunk.length) {
      ctx.beginPath();
      ctx.strokeStyle = "#00FFAA";
      ctx.lineWidth = 1;
      const step = width / chunk.length;
      for (let i = 0; i < chunk.length; i++) {
        const x = i * step;
        const y = height / 2 - chunk[i] * height / 2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Draw peak line
    const peakY = height / 2 - peak * height / 2;
    ctx.beginPath();
    ctx.strokeStyle = "#FF4C4C";
    ctx.moveTo(0, peakY);
    ctx.lineTo(width, peakY);
    ctx.stroke();
  }, [chunk, peak]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={600} height={100} className="w-full bg-black rounded" />
      <div className="absolute top-0 left-0 text-white text-xs p-1">
        Peak: {(peak * 100).toFixed(1)}%
      </div>
    </div>
  );
};

export default VisualizerCanvas;
