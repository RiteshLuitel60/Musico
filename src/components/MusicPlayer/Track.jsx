import React from 'react';

const Track = ({ isPlaying, isActive, activeSong }) => {
  // Destructure the active song details
  const {
    attributes: {
      name: title,
      artistName: subtitle,
      artwork: { url: coverArt } = {}
    } = {}
  } = activeSong || {};

  return (
    <div className="flex-1 flex items-center justify-start">
      <div className={`${isPlaying && isActive ? 'animate-[spin_3s_linear_infinite]' : ''} hidden sm:block h-16 w-16 mr-4`}>
        <img src={coverArt || '/default-image.jpg'} alt="cover art" className="rounded-full" />
      </div>
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">
          {title || 'No active Song'}
        </p>
        <p className="truncate text-gray-300">
          {subtitle || 'No active Song'}
        </p>
      </div>
    </div>
  );
};

export default Track;
