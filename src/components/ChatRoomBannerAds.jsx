import React from "react";

export default function ChatRoomBannerAds() {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] rounded-xl overflow-hidden shadow-xl">
      {/* Background Image */}
      <img
        src="/Copilot_Live.png" // Replace with your banner image path
        alt="Nahara Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-lg">
          Welcome to <span className="text-pink-400">Nahara</span>
        </h1>
        <p className="mt-3 text-lg md:text-xl max-w-2xl text-white/90">
          Explore <em>posts, podcasts, songs, ebooks & news</em> — all in one vibrant chatroom.
        </p>
        
      </div>
    </div>
  );
}
