import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCardForIdentify = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  // Destructure the song data with default values
  const {
    title = 'Unknown Title',
    subtitle = 'Unknown Artist',
    images = {},
    genres = {},
    url,
    share = {},
    hub = {},
    sections = [],
    artists = [],
    key,
  } = song || {};

  // Handler functions for play and pause actions
  const handlePauseClick = () => {
    dispatch(playPause(false));
    console.log("Paused");
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
    console.log("Played");
    console.log({
      songTitle: getSongTitle(),
      songId: getSongId(),
      artistId: getArtistId(),
      coverArt: getCoverArt(),
      activeSongComparator: getActiveSongComparator(),
      artistName: getArtistName(),
    });
  };

  // Handler to close the card
  const handleCloseClick = () => {
    setIsVisible(false);
    console.log("Close button clicked");
  };

  // Helper functions to safely access song properties
  const getSongTitle = () => song?.title || 'Unknown Title';
  const getSongId = () => song?.key || 'default-id';
  const getArtistId = () => song.artists?.[0]?.adamid || 'default-artist-id';
  const getCoverArt = () => song?.images?.background || 'default-image-url';
  const getActiveSongComparator = () => song.attributes?.name || song?.key || 'default-comparator';
  const getArtistName = () => song.attributes?.artistName || subtitle || 'Unknown Artist';

  if (!isVisible) return null; // If not visible, render nothing

  return (
    <div className="relative flex flex-col w-[180px] p-2 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      
      {/* Cross Button */}
      <button
        className="absolute top-[-12px] right-[-12px] w-8 h-8 flex items-center justify-center bg-red-600 rounded-full text-white text-xl z-30"
        onClick={handleCloseClick} // Pass function reference
      >
        &times;
      </button>

      {/* Song Cover Art with Play/Pause Overlay */}
      <div className="relative w-full h-30 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong && getActiveSongComparator() === (activeSong.id || activeSong.key) ? 'flex bg-black bg-opacity-70' : 'hidden'}`}
        >
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img
          alt="song cover art"
          src={getCoverArt()}
          className="w-full h-full rounded-lg"
        />
      </div>

      {/* Song Title and Artist Name */}
      <div className="border-spacing-2 p-2 rounded-lg">
        <p className="font-semibold text-lg text-white truncate">
          {getSongTitle()}
        </p>
        <p className="text-sm text-gray-300 truncate mt-1">
          {getArtistName()}
        </p>
      </div>

      {/* Uncomment and use the following if needed */}
      {/* <div className="mt-2 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${getSongId()}`}>
            {getSongTitle()}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={getArtistId() ? `/artists/${getArtistId()}` : '/top-artists'}>
            {getArtistName()}
          </Link>
        </p>
      </div> */}
    </div>
  );
};

export default SongCardForIdentify;
