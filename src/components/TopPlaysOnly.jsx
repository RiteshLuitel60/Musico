import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery, useGetSongsByGenreQuery } from '../redux/services/shazamCore';

// Function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className={`w-full flex flex-row items-center hover:bg-green-400 ${activeSong?.attributes?.name === song?.attributes?.name ? 'bg-[#26242c]' : 'bg-transparent'} py-1 p-0.7 rounded-lg cursor-pointer mb-0.5`}> 
    <h3 className="font-extrabold text-sm text-white mr-3">{i + 1}.</h3> {/* Numbering of top chart songs */}
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="w10 h-10 rounded-lg" src={song?.attributes?.artwork.url} alt={song?.attributes?.name} /> {/* Image of top chart songs */}
      <div className="flex-1 flex flex-col justify-center mx-3"> 
        <Link to={`/songs/${song.id}`}>
          <p className="text-base font-bold text-white">
            {song?.attributes?.name}
          </p> {/* Song name text in top chart cards */}
        </Link>
        <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
          <p className="text-sm text-gray-300 mt-1">
            {song?.attributes?.artistName} 
          </p> {/* Artist name in top chart card */}
        </Link>
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

const TopPlayM = ({ songData }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const divRef = useRef(null);

  const [topPlays, setTopPlays] = useState([]);

  const genre = (songData?.resources?.['shazam-songs']?.[songData?.data?.[0]?.id]?.attributes?.genres?.primary).toUpperCase();

  const { data, isFetching, error } = useGetSongsByGenreQuery(genre, { skip: !genre });

  useEffect(() => {
    if (data) {
      const shuffledData = shuffleArray(data);
      setTopPlays(shuffledData.slice(0, 10));
    }
  }, [data]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topPlays, i }));
    dispatch(playPause(true));
  };

  if (isFetching) return <div className='text-white'>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div ref={divRef} className="xl:ml-8 ml-0 xl:mb-0 mb-3 flex-1 xl:max-w-[390px] max-w-full flex flex-col">
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <Link to="/top-charts">
            <p className="text-gray-300 text-sm cursor-pointer">See more</p> 
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          {topPlays.map((song, i) => (
            <TopChartCard
              key={song.key || song.id}
              song={song}
              i={i}
              isPlaying={isPlaying}
              activeSong={activeSong}
              handlePauseClick={handlePauseClick}
              handlePlayClick={() => handlePlayClick(song, i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopPlayM;
