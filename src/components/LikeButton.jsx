import React, { useState, useEffect, useRef } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Heart } from "lucide-react";
import { createLikedSongsLibrary } from '../utils/libraryUtils';

// Component for a like button that interacts with a Supabase backend
const LikeButton = ({ song, isLikedSongs = false }) => {
  const [isLiked, setIsLiked] = useState(isLikedSongs);
  const [userId, setUserId] = useState(null);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const isInitialized = useRef(false);

  // Initialize the button state on component mount
  useEffect(() => {
    const initializeButton = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        setIsLoading(true);
        const fetchedUserId = await fetchUserId();
        if (!fetchedUserId) return;

        setUserId(fetchedUserId);

        const fetchedPlaylistId = await fetchLikedSongsPlaylistId(fetchedUserId);
        if (!fetchedPlaylistId) return;

        setLikedSongsPlaylistId(fetchedPlaylistId);

        await checkIfLiked(fetchedPlaylistId);
      } catch (error) {
        console.error("Error initializing like button:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeButton();
  }, [song]); // Add song as a dependency

  // Fetch the current user's ID
  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? user.id : null;
  };

  // Fetch the ID of the user's "Liked Songs" playlist
  const fetchLikedSongsPlaylistId = async (userId) => {
    const { data, error } = await supabase
      .from("libraries")
      .select("id")
      .eq("name", "Liked Songs")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        // Create Liked Songs library if it doesn't exist
        const result = await createLikedSongsLibrary();
        if (result.success) {
          return result.library.id;
        }
      }
      console.error("Error fetching Liked Songs playlist:", error);
      return null;
    }
    return data ? data.id : null;
  };

  // Check if the current song is liked by the user
  const checkIfLiked = async (playlistId) => {
    const { data, error } = await supabase
      .from('library_songs')
      .select('*')
      .eq('library_id', playlistId)
      .or(`song_key.eq.${song.key || song.id},title.eq.${encodeURIComponent(song.title || song.name)}`);
    
    if (error) {
      console.error("Error checking if song is liked:", error);
    } else {
      setIsLiked(data.length > 0);
    }
  };

  // Handle the like/unlike action
  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsLiked((prev) => !prev);


    try {
      if (isLiked) {
        // Remove the song from liked songs
        await supabase
          .from("library_songs")
          .delete()
          .eq("library_id", likedSongsPlaylistId)
          .eq("song_key", song.key || song.id);
      } else {
        // Add the song to liked songs
        const songDetails = {
          song_key: song.key || song.id,
          title: song.title || song.name ,
          artist: song.subtitle || song?.attributes?.artistName ,
          cover_art: song.images?.coverart,
          artist_id: song.artist_id || "",
          audio_url: song.hub?.actions?.find((action) => action.type === "uri")?.uri ||
                     song.attributes?.previews?.[0]?.url ||
                     song.audio_url ||
                     "",
        };


        await supabase.from("library_songs").insert({
          library_id: likedSongsPlaylistId,
          ...songDetails,
        });
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      setIsLiked((prev) => !prev);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the like button
  return (
    <button onClick={handleLike} className="focus:outline-none" disabled={isLoading}>
      <Heart
        size={20}
        fill={isLiked ? "lime" : "none"}
        stroke={isLiked ? "lime" : "white"}
        className={isLiked ? "animate-like" : ""}
      />
    </button>
  );
};

export default LikeButton;