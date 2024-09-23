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

  // Function to get the song title
  const getSongTitle = () => song?.title || song?.attributes?.name || 'Unknown Title';
  // Function to get the song ID
  const getSongId = () => song?.song_key||song?.hub?.actions[0]?.id || song?.key || song?.id ;
  // Function to get the artist ID
  const getArtistId = () => song?.artists?.[0]?.adamid || song?.relationships?.artists?.data[0]?.id || 'default-artist-id';
  // Function to get the cover art URL
  const getCoverArt = () => song?.cover_art || song?.images?.coverart || song?.attributes?.artwork?.url || 'default-image-url';
  // Function to get a comparator for the active song
  const getActiveSongComparator = () => song?.attributes?.name || song?.key || 'default-comparator';
  // Function to get the artist name
  const getArtistName = () => song?.artist || song?.subtitle || song?.attributes?.artistName || 'Unknown Artist';

  // Async function to add a song to a library
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

  // Async function to create a library
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
    <div className="flex flex-col w-[200px] p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/5">
      <div className="relative w-full h-36 group ">
        <div className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${activeSong?.title === song.title ? 'flex bg-black bg-opacity-70' : 'hidden'}`}>
          <PlayPause
            isPlaying={isPlaying}
            activeSong={activeSong}
            song={song}
            handlePause={handlePauseClick}
            handlePlay={handlePlayClick}
          />
        </div>
        <img 
          alt="song_img" 
          src={getCoverArt()} 
          className="w-full h-full object-cover brightness-110 hover:brightness-100 transition-all duration-300"
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
      
      <div className="mt-4 flex justify-between items-center">

        <LikeButton song={{
          key: getSongId(),
          title: getSongTitle(),
          subtitle: getArtistName(),
          images: { coverart: getCoverArt() },
          hub: song.hub,
          sections: song.sections,
          attributes: song.attributes,
          audio_url: song.audio_url || song.hub?.actions?.find(action => action.type === "uri")?.uri || song.attributes?.previews?.[0]?.url,
        }} isLikedSongs={song.isLikedSongs} />

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
  );
};

export default SongCard;
