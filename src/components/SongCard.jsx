import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import LikeButton from './LikeButton';
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import PlayPause from "./PlayPause";
import SongOptions from "./SongOptions";
import { useGetSongDetailsQuery } from '../redux/services/shazamCore';

const SongCard = ({ song, isPlaying, activeSong, data, i, libraries = [], onAddToLibrary, onCreateLibrary }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(true);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
    console.log(song);
  };

  const getSongTitle = () => song?.title || song?.attributes?.name || 'Unknown Title';
  const getSongId = () => song?.song_key || song?.key || song?.id || 'default-id';
  const getArtistId = () => song?.artists?.[0]?.adamid || song?.relationships?.artists?.data[0]?.id || 'default-artist-id';
  const getCoverArt = () => song?.cover_art || song?.images?.coverart || song?.attributes?.artwork?.url || 'default-image-url';
  const getActiveSongComparator = () => song?.attributes?.name || song?.key || 'default-comparator';
  const getArtistName = () => song?.artist || song?.subtitle || song?.attributes?.artistName || 'Unknown Artist';

  if (!isVisible) return null;

  return (
    <div className="flex flex-col w-[220px] p-4 bg-white/10 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/5">
      <div className="relative w-full h-44 group">
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
          className="w-full h-full rounded-lg object-cover brightness-110 hover:brightness-100 transition-all duration-300"
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
        />
      </div>
    </div>
  );
};

// Add this function outside of the component
async function fetchSongDetails(songId) {
  try {
    const { data, error } = await useGetSongDetailsQuery(songId);
    if (data) {
      const audioUrl = data.hub?.actions?.find(action => action.type === "uri")?.uri || '';
      
      return {
        id: data.key,
        title: data.title,
        artist: data.subtitle,
        cover_art: data.images?.coverart,
        audio_url: audioUrl,
      };
    } else if (error) {
      console.error('Error fetching song details:', error);
      return null;
    }
  } catch (error) {
    console.error('Error in fetchSongDetails:', error);
    return null;
  }
}

export default SongCard;
