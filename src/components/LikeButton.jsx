import React, { useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Heart } from "lucide-react";

const LikeButton = ({ song, isLikedSongs = false }) => {
  const [isLiked, setIsLiked] = useState(isLikedSongs);
  const [userId, setUserId] = useState(null);
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    const initializeButton = async () => {
      const fetchedUserId = await fetchUserId();
      if (fetchedUserId) {
        setUserId(fetchedUserId);
        const fetchedPlaylistId = await fetchLikedSongsPlaylistId(fetchedUserId);
        if (fetchedPlaylistId) {
          setLikedSongsPlaylistId(fetchedPlaylistId);
          await checkIfLiked(fetchedPlaylistId);
        }
      }
    };
    initializeButton();
  }, [song]);

  const fetchUserId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ? user.id : null;
  };

  const fetchLikedSongsPlaylistId = async (userId) => {
    const { data, error } = await supabase
      .from("libraries")
      .select("id")
      .eq("name", "Liked Songs")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching Liked Songs playlist:", error);
      return null;
    }
    return data ? data.id : null;
  };

  const checkIfLiked = async (playlistId) => {
    const { data, error } = await supabase
      .from("library_songs")
      .select("*")
      .eq("library_id", playlistId)
      .eq("song_key", song.key);

    if (error) {
      console.error("Error checking if song is liked:", error);
    } else {
      setIsLiked(data.length > 0);
    }
  };

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsLiked((prev) => !prev); // Optimistic update

    try {
      if (isLiked) {
        await supabase
          .from("library_songs")
          .delete()
          .eq("library_id", likedSongsPlaylistId)
          .eq("song_key", song.key);
      } else {
        const songDetails = {
          song_key: song.key,
          title: song.title,
          artist: song.subtitle,
          cover_art: song.images?.coverart,
          audio_url: song.hub?.actions?.find((action) => action.type === "uri")?.uri ||
                     song.attributes?.previews?.[0]?.url ||
                     song.audio_url ||
                     "",
          lyrics: song.sections?.find((section) => section.type === "LYRICS")?.text || [],
        };

        await supabase.from("library_songs").insert({
          library_id: likedSongsPlaylistId,
          ...songDetails,
        });
      }
    } catch (error) {
      console.error("Error updating like status:", error);
      setIsLiked((prev) => !prev); // Revert optimistic update on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      className="focus:outline-none"
      disabled={isLoading}
    >
      <Heart
        size={20}
        fill={isLiked ? "lime" : "none"}
        stroke={isLiked ? "lime" : "currentColor"}
        className={isLiked ? "animate-like" : ""}
      />
    </button>
  );
};

export default LikeButton;