import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import LikeButton from './LikeButton';
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import PlayPause from "./PlayPause";
import SongOptions from "./SongOptions";
import { useGetSongDetailsQuery } from '../redux/services/shazamCore';

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
  const dispatch = useDispatch();
  const supabase = useSupabaseClient();
  const [userId, setUserId] = useState(null);
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUserId();
  }, [supabase.auth]);

  useEffect(() => {
    const fetchLibraries = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from('libraries')
          .select('*')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching libraries:', error);
        } else {
          setLibraries(data);
        }
      }
    };
    fetchLibraries();
  }, [userId, supabase]);

  const handlePauseClick = () => {
    dispatch(playPause(false));
  };

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
    console.log(song);
  };

  // Helper functions (unchanged)
  const getSongTitle = () => song?.attributes?.name || song?.title || "Unknown Title";
  const getSongId = () => song?.hub?.actions?.[0]?.id || song?.id || song?.key;
  const getArtistId = () => song.relationships?.artists?.data[0]?.id || song.artists?.[0]?.adamid || "default-artist-id";
  const getCoverArt = () => song.attributes?.artwork?.url || song.images?.coverart || "default-image-url";
  const getActiveSongComparator = () => song.attributes?.name || song.key || "default-comparator";
  const getArtistName = () => song.attributes?.artistName || song.subtitle || "Unknown Artist";

  const handleAddToLibrary = async (libraryId) => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const songKey = getSongId();

    if (!songKey) {
      console.error("Invalid song key");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('library_songs')
        .insert({
          library_id: libraryId,
          song_key: songKey,
        });

      if (error) throw error;

      console.log("Song added to library successfully");
      // Optionally, you can update the UI or state here to reflect the change
    } catch (error) {
      console.error("Error adding song to library:", error.message);
      // Optionally, you can show an error message to the user here
    }
  };

  const handleCreateLibrary = async (songToAdd) => {
    const name = prompt("Enter a name for the new library:");
    if (name) {
      const { data, error } = await supabase
        .from('libraries')
        .insert({ name, user_id: userId })
        .select();

      if (error) {
        console.error("Error creating library:", error);
      } else {
        setLibraries([...libraries, data[0]]);
        handleAddToLibrary(data[0].id);
      }
    }
  };

  return (
    <div className="flex flex-col w-[220px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer">
      <div className="relative w-full h-48 group">
        <div
          className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
            activeSong &&
            getActiveSongComparator() === (activeSong.id || activeSong.key)
              ? "flex bg-black bg-opacity-70"
              : "hidden"
          }`}
        >
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
          className="w-full h-full rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <LikeButton songId={getSongId()} userId={userId} />
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <div className="flex flex-row justify-between items-center">
          <p className="font-semibold text-lg text-white truncate">
            <Link to={`/songs/${getSongId()}`}>{getSongTitle()}</Link>
          </p>
          <SongOptions
            song={song}
            libraries={libraries}
            onAddToLibrary={handleAddToLibrary}
            onCreateLibrary={handleCreateLibrary}
          />
        </div>
        <p className="text-sm truncate text-gray-300 mt-1">
          <Link to={song.artists ? `/artists/${song?.artists[0]?.adamid}` : '/top-artists'}>
            {getArtistName()}
          </Link>
        </p>
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
