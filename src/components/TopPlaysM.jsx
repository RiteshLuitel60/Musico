import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery, useGetSongsByGenreQuery } from '../redux/services/shazamCore';
import SongBar from './SongBar';

// Function to shuffle an array randomly
const shuffleArray = (array) => {
  let shuffledArray = array.slice(); // Create a copy of the array
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

// Main component for displaying top plays
const TopPlayM = ({ songData }) => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  
  const [topPlays, setTopPlays] = useState([]);

  // Extract genre from song data
  const genre = songData?.resources?.['shazam-songs']?.[songData?.data?.[0]?.id]?.attributes?.genres?.primary?.toUpperCase() || '';

  // Fetch songs by genre
  const { data, isFetching, error } = useGetSongsByGenreQuery(genre, { skip: !genre });

  // Fetch top charts as a fallback
  const { data: topChartsData } = useGetTopChartsQuery();

  // Shuffle and set top plays when data is available
  useEffect(() => {
    if (data && !error) {
      const shuffledData = shuffleArray(data);
      setTopPlays(shuffledData.slice(0, 10));
    } else if (error && topChartsData) {
      // If there's an error, use top charts data
      const shuffledTopCharts = shuffleArray(topChartsData);
      setTopPlays(shuffledTopCharts.slice(0, 10));
    }
  }, [data, error, topChartsData]);

  // Handle pause click
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  // Handle play click
  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data: topPlays, i }));
    dispatch(playPause(true));
  };
  
  // Loading state
  if (isFetching) return <div className='text-white'>Loading...</div>;

  
  return (
    <div className="flex flex-col">
      

        <div className="mt-6 w-full flex flex-col">
          {topPlays.map((song, i) => (
            <SongBar 
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
        <div className="flex flex-row justify-between items-center">
          
        </div>
      </div>
  );
};

export default TopPlayM;
