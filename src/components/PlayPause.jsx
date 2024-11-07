import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

// PlayPause component for controlling audio playback
const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
  songId,
  size = 35, // Default size
  color = "text-white", // Default color
  playIcon = FaPlayCircle, // Default play icon
  pauseIcon = FaPauseCircle, // Default pause icon
}) => {

// Extract the active song ID from the resources if available
let activeSongId=   activeSong?.resources?.songs && Object.keys(activeSong.resources.songs)[0];




  
  let isActive = false;

  // Determine if the current song is active based on various possible identifiers
  if (activeSong?.song_key) {
    isActive = activeSong?.song_key === song?.song_key;
  }
  else if (activeSong?.id && song?.id) {
    isActive = activeSong.id === song.id;
  } else if (activeSong?.key && song?.key) {
    isActive = activeSong.key === song.key;
  } else if (activeSong?.title) {
    activeSong?.title === song?.title
  }
  else if (activeSongId) {
    isActive = activeSongId === song?.id || songId;

  } 

  // Assign the play and pause icons to variables
  const PlayIconComponent = playIcon;
  const PauseIconComponent = pauseIcon;

  // Render pause icon if playing and active, otherwise render play icon
  return isPlaying && isActive ? (
    <PauseIconComponent size={size} className={`${color} `} onClick={handlePause} />
  ) : (
    <PlayIconComponent size={size} className={`${color} `} onClick={handlePlay} />
  );
};

export default PlayPause;
