/* eslint-disable no-nested-ternary */
import React from 'react';
import { Link } from 'react-router-dom';

import PlayPause from './PlayPause';

const SongBar = ({ song, i, artistId, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => {
  // Helper functions to safely access properties
  const getSongName = () => song?.attributes?.name || song?.title || 'Unknown Song';
  const getArtistName = () => song?.attributes?.artistName || song?.subtitle || 'Unknown Artist';
  const getArtworkUrl = () => {
    if (song?.attributes?.artwork?.url) {
      return song.attributes.artwork.url.replace('{w}', '125').replace('{h}', '125');
    }
    return song?.images?.coverart || '/path/to/default/image.jpg';
  };
  const getSongId = () => song?.id || song?.key || '';

  return (
    <div className={`w-full flex flex-row items-center hover:bg-[#4e446c] ${
      activeSong?.id || activeSong?.key === getSongId() || activeSong?.attributes?.name === getSongName() 
        ? 'bg-[#aaa8b200]' 
        : 'bg-transparent'
    } py-2 p-4 rounded-lg cursor-pointer mb-2`}>
      <h3 className="font-bold text-base text-white mr-3">{i + 1}.</h3>
      <div className="flex-1 flex flex-row justify-between items-center">
        <img
          className="w-20 h-20 rounded-lg"
          src={getArtworkUrl()}
          alt={getSongName()}
        />
        <div className="flex-1 flex flex-col justify-center mx-3">
          {!artistId ? (
            <Link to={`/songs/${getSongId()}`}>
              <p className="text-xl font-bold text-white">
                {getSongName()}
              </p>
            </Link>
          ) : (
            <p className="text-xl font-bold text-white">
              {getSongName()}
            </p>
          )}
          <p className="text-base text-gray-300 mt-1">
            {getArtistName()}
          </p>
        </div>
      </div>
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
