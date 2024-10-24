// Import necessary dependencies and components
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import LikeButton from './LikeButton';
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import PlayPause from "./PlayPause";
import SongOptions from "./SongOptions";
import { handleAddToLibrary, handleCreateLibrary, fetchUserLibraries } from '../utils/libraryUtils';


// SongCard component definition
const SongCard = ({ song, isPlaying, activeSong, data, i, libraries = [], setLibraries, currentLibraryId, onRemoveFromLibrary }) => {
  const dispatch = useDispatch(); // Hook to dispatch actions
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  // Function to handle pause action
  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  // Function to handle play action
  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
    console.log(song); // Log the current song
    

  };

  // Helper functions to get song details
  const getSongTitle = () => song?.title || song?.attributes?.name || 'Unknown Title';
  const getSongId = () => song?.song_key||song?.hub?.actions[0]?.id || song?.key || song?.id ||  '';
  const getArtistId = () => song?.artist_id || song?.artists?.[0]?.adamid || song?.relationships?.artists?.data[0]?.id ||  '';
  const getCoverArt = () => song?.cover_art || song?.images?.coverart || song?.attributes?.artwork?.url || 'default-image-url';
  const getArtistName = () => song?.artist || song?.subtitle || song?.attributes?.artistName || 'Unknown Artist';

  // Function to add a song to a library
  const onAddToLibrary = async (libraryId, song) => {
    const result = await handleAddToLibrary(libraryId, song);
    if (result.success) {
      const updatedLibraries = await fetchUserLibraries();
      if (updatedLibraries.success) {
        setLibraries(updatedLibraries.libraries);
      }
    }
    return result;
  };

  // Function to create a new library
  const onCreateLibrary = async () => {
    const result = await handleCreateLibrary(song);
    if (result.success) {
      const updatedLibraries = await fetchUserLibraries();
      if (updatedLibraries.success) {
        setLibraries(updatedLibraries.libraries);
      }
    } else {
      alert(result.error.message || 'Failed to create library.');
    }
    return result;
  };

  // Conditional rendering based on visibility
  if (!isVisible) return null;

  return (
    <div className="flex flex-col w-[160px] p-4 hover:bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer transition-all duration-300 ease-in-out group hover:bg-opacity-70 hover:scale-105">
      <div className="relative w-full h-28">
        <div className="absolute inset-0  group-hover:bg-black/70 transition-all duration-300 ease-in-out"></div>
        <div className={`absolute inset-0 justify-center items-center hidden group-hover:flex`}>
          <div className="absolute inset-0 flex items-center justify-between animate-fadeUp p-1 z-10">
            <LikeButton song={{
              artist_id: getArtistId(),
              key: getSongId(),
              title: getSongTitle(),
              subtitle: getArtistName(),
              images: { coverart: getCoverArt() },
              audio_url: song.audio_url || song.hub?.actions?.find(action => action.type === "uri")?.uri || song.attributes?.previews?.[0]?.url,
            }} isLikedSongs={song.isLikedSongs} />

            <PlayPause
              isPlaying={isPlaying}
              activeSong={activeSong}
              song={song}
              handlePause={handlePauseClick}
              handlePlay={handlePlayClick}
            />

            <SongOptions
              song={song}
              libraries={libraries}
              onAddToLibrary={onAddToLibrary}
              onCreateLibrary={onCreateLibrary}
              currentLibraryId={currentLibraryId}
              onRemoveFromLibrary={onRemoveFromLibrary}
            />
          </div>
        </div>
        <img 
          alt="song_img" 
          src={getCoverArt()} 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      <div className="mt-4 flex flex-col">
        <p className="font-semibold text-lg text-white truncate">
          <Link to={`/songs/${getSongId()}`}>
            {getSongTitle()}
          </Link>
        </p>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={getArtistId() ? `/artists/${getArtistId()}` : '/top-artists'}>
            {getArtistName()}
          </Link>
        </p>
      </div>
      
  
    </div>
  );
};

export default SongCard;
