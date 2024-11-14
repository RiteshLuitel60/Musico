// Import necessary libraries and components
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// Import actions from Redux slice
import {
  nextSong,
  prevSong,
  playPause,
} from "../../redux/features/playerSlice";

// Import child components
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";

// Import utility function
import { getAudioUrl } from "../../utils/audioUtils";

const MusicPlayer = () => {
  // Get state from Redux store
  const { activeSong, currentSongs, currentIndex, isActive, isPlaying } =
    useSelector((state) => state.player);

  // Set up local state
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // Initialize dispatch
  const dispatch = useDispatch();

  // Effect to play song when currentIndex changes
  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
  }, [currentIndex]);

  // Function to handle play/pause
  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  // Function to handle next song
  const handleNextSong = () => {
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  // Function to handle previous song
  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  // Effect to preload playlist
  useEffect(() => {
    const preloadPlaylist = async () => {
      if (currentSongs.length > 0) {
        const preloadPromises = currentSongs.map(song => getAudioUrl(song));
        await Promise.all(preloadPromises);
      }
    };
    preloadPlaylist();
  }, [currentSongs]);

  const getSongId = () => {
    return activeSong?.key || activeSong?.id || Object.keys(activeSong?.resources?.['shazam-songs'] || {})[0] || '';
  };

  // Render the music player
  return (
    <Link to={`/songs/${getSongId()}`} className="w-full">
      <div className="relative sm:px-12 px-8 w-full flex items-center justify-between flex-wrap">
        {/* Display current track info */}
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
        />

        <div className="flex-1 flex flex-col items-center justify-center sm:justify-between">
          {/* Render player controls */}
          <Controls
            isPlaying={isPlaying}
            isActive={isActive}
            repeat={repeat}
            setRepeat={setRepeat}
            shuffle={shuffle}
            setShuffle={setShuffle}
            currentSongs={currentSongs}
            handlePlayPause={handlePlayPause}
            handlePrevSong={handlePrevSong}
            handleNextSong={handleNextSong}
          />
          {/* Render seekbar */}
          <Seekbar
            value={appTime}
            min="0"
            max={duration}
            onInput={(event) => setSeekTime(event.target.value)}
            setSeekTime={setSeekTime}
            appTime={appTime}
          />
          {/* Render audio player if there's an active song */}
          {activeSong && Object.keys(activeSong).length > 0 && (
            <Player
              activeSong={activeSong}
              volume={volume}
              isPlaying={isPlaying}
              seekTime={seekTime}
              repeat={repeat}
              currentIndex={currentIndex}
              onEnded={handleNextSong}
              onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
              onLoadedData={(event) => setDuration(event.target.duration)}
            />
          )}
        </div>

        {/* Render volume control */}
        <VolumeBar
          value={volume}
          min="0"
          max="1"
          onChange={(event) => setVolume(event.target.value)}
          setVolume={setVolume}
        />
      </div>
    </Link>
  );
};

export default MusicPlayer;
