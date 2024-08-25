import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  // Helper functions to get the correct properties based on the song object structure
  const getSongTitle = () => song?.attributes?.name || song?.title || 'Unknown Title';
  const getSongId = () => song?.hub?.actions?.[0]?.id || song?.id || 'default-id';
  const getArtistId = () => song.relationships?.artists?.data[0]?.id || song.artists?.[0]?.adamid || 'default-artist-id';
  const getCoverArt = () => song.attributes?.artwork?.url || song.images?.coverart || 'default-image-url';
  const getActiveSongComparator = () => song.attributes?.name || song.key || 'default-comparator';
  const getArtistName = () => song.attributes?.artistName || song.subtitle || 'Unknown Artist';

  return (
    <div className="flex flex-col w-[180px] p-2 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-30 group">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong && getActiveSongComparator() === (activeSong.id || activeSong.key) ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img alt="song cover art" src={getCoverArt()} className="w-full h-full rounded-lg" />
      </div>

      <div className="mt-2 flex flex-col">
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
      </div>
    </div>
  );
};

export default SongCard;
