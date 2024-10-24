import React, { useState } from 'react';
import PlayPause from './PlayPause'; // Import PlayPause component

const SongCard2 = ({ data, isPlaying, activeSong, handlePause, handlePlay }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Extract song details from data prop
  const title = data.title;
  const subtitle = data.subtitle;
  const images = data.images || {};
  const hub = data.hub || {};

  // Function to handle removing the song card
  const handleRemove = () => {
    setIsVisible(false);
  };

  // If not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div className="relative max-w-sm rounded overflow-hidden shadow-lg bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg">
      {/* Remove button */}
      <button
        onClick={handleRemove}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
      >
        &times;
      </button>
      <div className="relative">
        {/* Song cover art */}
        <img
          className="w-full"
          src={images.coverart || '/path/to/default-image.jpg'} // Provide a fallback image
          alt={`${title || 'Song'} cover art`}
        />
        {/* Play/Pause button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={data} // Pass the entire track data as the song
            handlePause={handlePause}
            handlePlay={handlePlay}
          />
        </div>
      </div>
      {/* Song details */}
      <div className="px-6 py-4">
        <div className="font-bold text-white">
          {title || 'Unknown Title'}
        </div>
        <div className="text-gray-400">
          {subtitle || 'Unknown Artist'}
        </div>
        {/* External links */}
        <div className="mt-4">
          <a href={hub?.actions?.[0]?.uri || '#'} className="text-blue-500 mr-4">Apple Music</a>
          <a href={hub?.providers?.[0]?.actions?.[0]?.uri || '#'} className="text-blue-500">Spotify</a>
        </div>
      </div>
    </div>
  );
};

export default SongCard2;
