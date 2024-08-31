import React from "react";
import { FaPauseCircle, FaPlayCircle } from "react-icons/fa";

const PlayPause = ({
  isPlaying,
  activeSong,
  song,
  handlePause,
  handlePlay,
}) => {
  let isActive = false;

  if (activeSong?.id && song?.id) {
    isActive = activeSong.id === song.id;
  } else if (activeSong?.key && song?.key) {
    isActive = activeSong.key === song.key;
  } else if (activeSong?.title === song?.title) {
    isActive = true;
  }

  return isPlaying && isActive ? (
    <FaPauseCircle size={35} className="text-gray-300" onClick={handlePause} />
  ) : (
    <FaPlayCircle size={35} className="text-gray-300" onClick={handlePlay} />
  );
};

export default PlayPause;
