import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SongBar from './SongBar';
import { playPause, setActiveSong } from '../redux/features/playerSlice';

const RelatedSongs = ({ data, artistId }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-3xl text-white">Related Songs:</h1>

      <div className="mt-6 w-full flex flex-col">
        {data?.map((song, i) => (
          <SongBar
            key={song.id || song.key}
            song={song}
            i={i}
            artistId={artistId}
            isPlaying={isPlaying}
            activeSong={activeSong}
            handlePauseClick={handlePauseClick}
            handlePlayClick={() => handlePlayClick(song, i)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedSongs;