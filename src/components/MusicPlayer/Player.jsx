import React, { useRef, useEffect } from 'react';

/* eslint-disable jsx-a11y/media-has-caption */
const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current) {
      console.log('Current Player State:', {
        activeSong,
        isPlaying,
        currentSongs,
        isActive
      })
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);



  return (
    <audio
      src={activeSong?.attributes?.url}  // Adjusted to match the dataset structure
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
    
  );

  
};



export default Player;
