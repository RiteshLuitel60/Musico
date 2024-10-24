// Import necessary dependencies and components
import React from 'react';
import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';

const SongBar = ({ song, i, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  // Helper functions to safely access song properties
  const getSongName = () => song?.attributes?.name || song?.title || 'Unknown Song';
  const getArtistName = () => song?.attributes?.artistName || song?.subtitle || 'Unknown Artist';
  const getSongTitle = () => song?.title || song?.attributes?.name || 'Unknown Title';
  const getArtworkUrl = () => {
    if (song?.attributes?.artwork?.url) {
      return song.attributes.artwork.url.replace('{w}', '125').replace('{h}', '125');
    }
    return song?.images?.coverart || '/path/to/default/image.jpg';
  };
  const getSongId = () => song?.id || song?.key || '';

  return (
    // Song bar container with conditional styling based on active song
    <div className={`w-full flex flex-row items-center hover:bg-[#4e446c] ${
      activeSong?.id || activeSong?.key === getSongId() || activeSong?.attributes?.name === getSongName() 
        ? 'bg-[#aaa8b200]' 
        : 'bg-transparent'
    } py-2 p-4 rounded-lg cursor-pointer mb-2`}>
      {/* Song number */}
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        {/* Song artwork */}
        <img
          className="w-20 h-20 rounded-lg"
          src={getArtworkUrl()}
          alt={getSongName()}
        />
        <div className="flex-1 flex flex-col justify-center mx-3">
        {/* Song title with link */}
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${getSongId()}`}>
            {getSongTitle()}
          </Link>
        </p>
          {/* Artist name */}
          <p className="text-base text-gray-300 mt-1">
            {getArtistName()}
          </p>
        </div>
      </div>
      {/* Play/Pause button */}
      <PlayPause
        isPlaying={isPlaying}
        activeSong={activeSong}
        song={song}
        handlePause={handlePauseClick}
        handlePlay={handlePlayClick}
      />
    </div>
  );
};

export default SongBar;
