import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
  songId
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

  return isPlaying && isActive ? (
    <FaPauseCircle size={35} className="text-gray-300 z-50" onClick={handlePause} />
  ) : (
    <FaPlayCircle size={35} className="text-gray-300 z-50" onClick={handlePlay} />
  );
};

export default PlayPause;
