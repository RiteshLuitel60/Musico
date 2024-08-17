/* eslint-disable import/no-unresolved */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';

import PlayPause from './PlayPause';
import { playPause, setActiveSong } from '../redux/features/playerSlice';
import { useGetTopChartsQuery } from '../redux/services/shazamCore';

import 'swiper/css';
import 'swiper/css/free-mode';
const TopChartCard = ({ song, i, isPlaying, activeSong, handlePauseClick, handlePlayClick }) => (
  <div className={`w-full flex flex-row items-center hover:bg-green-400 ${activeSong?.attributes?.name === song?.attributes?.name ? 'bg-[#26242c]' : 'bg-transparent'} py-1 p-0.7 rounded-lg cursor-pointer mb-0.5`}> 
    <h3 className="font-bold text-sm text-white mr-3">{i + 1}.</h3> {/* Numbering of top chart songs */}
    <div className="flex-1 flex flex-row justify-between items-center">
      <img className="w10 h-10 rounded-lg" src={song?.attributes?.artwork.url} alt={song?.attributes?.name} /> {/*  image of top chart songs */}
      <div className="flex-1 flex flex-col justify-center mx-3"> 
        <Link to={`/songs/${song.id}`}>
          <p className="text-base font-bold text-white">
            {song?.attributes?.name}
          </p> {/* Song name text in top chart cards */}
        </Link>
        <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
          <p className="text-sm text-gray-300 mt-1">
            {song?.attributes?.artistName} 
          </p> {/* artist name in top chart card */}
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

const TopPlay = () => {
  const dispatch = useDispatch();
  const { activeSong, isPlaying } = useSelector((state) => state.player);
  const { data } = useGetTopChartsQuery();
  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
}, []); // Empty array ensures this runs only on component load


  const topPlays = data?.slice(0, 5);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = (song, i) => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div ref={divRef} className="xl:ml-8 ml-0 xl:mb-0 mb-3 flex-1 xl:max-w-[390px] max-w-full flex flex-col"> {/* Increased max-width */}
      <div className="w-full flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Plays</h2> {/* Increased font size */}
          <Link to="/top-charts">
            <p className="text-gray-300 text-sm cursor-pointer">See more</p> 
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-1"> {/* Increased margin-top */}
          {topPlays?.map((song, i) => (
            <TopChartCard
              key={song.id}
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

      <div className="w-full flex flex-col mt-8"> {/* Increased margin-top */}
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-white font-bold text-2xl">Top Artists</h2> {/* Increased font size */}
          <Link to="/top-artists">
            <p className="text-gray-300 text-sm cursor-pointer">See more</p> 
          </Link>
        </div>

        <Swiper
          slidesPerView="auto"
          spaceBetween={10}  
          freeMode
          centeredSlides
          centeredSlidesBounds
          modules={[FreeMode]}
          className="mt-6" /* Increased margin-top */
        >
          {topPlays?.slice(0, 5).map((song, i) => (
            <SwiperSlide
              key={song?.id}
              style={{ width: '22%', height: 'auto' }}  /* Slightly increased slide width */
              className="shadow-lg rounded-full animate-slideright"
            >
              <Link to={`/artists/${song?.relationships.artists.data[0].id}`}>
                <img src={song.attributes?.artwork?.url} alt={song.attributes?.name} className="rounded-full w-full object-cover" />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};



export default TopPlay;
