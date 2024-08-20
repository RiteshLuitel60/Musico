import React, { useRef, useEffect } from 'react';

const Player = ({ activeSong, isPlaying, volume, seekTime, onEnded, onTimeUpdate, onLoadedData, repeat }) => {
  const ref = useRef(null);

  // Function to determine the correct audio URL
  const getAudioUrl = (song) => {
    if (song?.attributes?.previews?.[0]?.url) {
      return song.attributes.previews[0].url;
    } else if (song?.hub?.actions?.[1]?.uri) {
      return song.hub.actions[1].uri;
    } else if (typeof song === 'string') {
      return song; // If song is a string, assume it's a URL
    }
    return ''; // Fallback to an empty string if no URL is found
  };

  // Handle play/pause logic
  if (ref.current) {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  // Update volume
  useEffect(() => {
    ref.current.volume = volume;
  }, [volume]);

  // Update seek time
  useEffect(() => {
    ref.current.currentTime = seekTime;
  }, [seekTime]);

  return (
    <audio
      src={getAudioUrl(activeSong)} // Use the getAudioUrl function to get the correct audio URL
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
