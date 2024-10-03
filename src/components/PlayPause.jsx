import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";


const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
  songId,
  size = 35, // Default size
  color = "text-gray-300", // Default color
  playIcon = FaPlayCircle, // Default play icon
  pauseIcon = FaPauseCircle, // Default pause icon
}) => {

let activeSongId=   activeSong?.resources?.songs && Object.keys(activeSong.resources.songs)[0];




  
  let isActive = false;

  if (activeSong?.id && song?.id) {
    isActive = activeSong.id === song.id;
  } else if (activeSong?.key && song?.key) {
    isActive = activeSong.key === song.key;
  } else if (activeSong?.title) {
    activeSong?.title === song?.title
  }
  else if (activeSongId) {
    isActive = activeSongId === song?.id || songId;

  }

  const PlayIconComponent = playIcon;
  const PauseIconComponent = pauseIcon;

  return isPlaying && isActive ? (
    <PauseIconComponent size={size} className={`${color} z-50`} onClick={handlePause} />
  ) : (
    <PlayIconComponent size={size} className={`${color} z-50`} onClick={handlePlay} />
  );
};

export default PlayPause;
